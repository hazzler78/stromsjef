import { NextRequest, NextResponse } from 'next/server';

const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;

export async function GET(request: NextRequest) {
  try {
    if (!MAILERLITE_API_KEY) {
      return NextResponse.json(
        { error: 'Mailerlite API key mangler' },
        { status: 500 }
      );
    }

    // Fetch groups from Mailerlite
    const response = await fetch('https://connect.mailerlite.com/api/groups', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Mailerlite API error:', errorData);
      return NextResponse.json(
        { error: 'Kunne ikke hente grupper fra Mailerlite' },
        { status: 500 }
      );
    }

    const groupsData = await response.json();
    console.log('Mailerlite groups:', groupsData);

    return NextResponse.json({
      success: true,
      groups: groupsData.data || []
    });

  } catch (error) {
    console.error('Error fetching Mailerlite groups:', error);
    return NextResponse.json(
      { error: 'En feil oppstod ved henting av grupper' },
      { status: 500 }
    );
  }
} 