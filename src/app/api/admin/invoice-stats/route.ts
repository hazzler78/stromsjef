import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ 
        error: 'Missing Supabase configuration' 
      }, { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get total invoice uploads
    const { count: totalUploads, error: countError } = await supabase
      .from('invoice_ocr')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error getting total uploads:', countError);
      return NextResponse.json({ 
        error: 'Failed to get upload statistics' 
      }, { status: 500 });
    }

    // Get uploads by date (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: recentUploads, error: recentError } = await supabase
      .from('invoice_ocr')
      .select('created_at')
      .gte('created_at', thirtyDaysAgo.toISOString());

    if (recentError) {
      console.error('Error getting recent uploads:', recentError);
    }

    // Get uploads with consent (files stored)
    const { count: uploadsWithConsent, error: consentError } = await supabase
      .from('invoice_ocr')
      .select('*', { count: 'exact', head: true })
      .eq('consent', true);

    if (consentError) {
      console.error('Error getting consent uploads:', consentError);
    }

    // Get unique sessions (unique users)
    const { data: uniqueSessions, error: sessionError } = await supabase
      .from('invoice_ocr')
      .select('session_id')
      .not('session_id', 'is', null);

    if (sessionError) {
      console.error('Error getting unique sessions:', sessionError);
    }

    const uniqueUsers = uniqueSessions ? 
      new Set(uniqueSessions.map(row => row.session_id)).size : 0;

    // Get daily uploads for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: dailyUploads, error: dailyError } = await supabase
      .from('invoice_ocr')
      .select('created_at')
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    if (dailyError) {
      console.error('Error getting daily uploads:', dailyError);
    }

    // Group by date
    const dailyStats: Record<string, number> = {};
    if (dailyUploads) {
      dailyUploads.forEach(upload => {
        const date = new Date(upload.created_at).toISOString().split('T')[0];
        dailyStats[date] = (dailyStats[date] || 0) + 1;
      });
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalUploads: totalUploads || 0,
        uploadsLast30Days: recentUploads?.length || 0,
        uploadsWithConsent: uploadsWithConsent || 0,
        uniqueUsers: uniqueUsers,
        dailyStats: dailyStats,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in invoice stats endpoint:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
