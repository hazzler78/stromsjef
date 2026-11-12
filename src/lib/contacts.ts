import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  ContactStatus,
  ContactSubmission,
  ContactSubmissionInput,
} from '@/types/contact';

type ContactSubmissionRow = {
  id: string;
  name: string;
  email: string;
  message: string | null;
  created_at: string;
};

function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key);
}

function mapRow(row: ContactSubmissionRow): ContactSubmission {
  return {
    id: row.id,
    createdAt: row.created_at,
    name: row.name,
    email: row.email,
    phone: '',
    newsletterOptIn: false,
    message: row.message ?? undefined,
    status: 'new',
  };
}

export async function saveContactSubmission(
  input: ContactSubmissionInput
): Promise<ContactSubmission | null> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('Failed to persist contact submission: Supabase is not configured');
      return null;
    }

    const { data, error } = await supabase
      .from('contact_submissions')
      .insert({
        name: input.name,
        email: input.email,
        message: input.message ?? null,
      })
      .select('id, name, email, message, created_at')
      .single();

    if (error || !data) {
      console.error('Failed to persist contact submission:', error);
      return null;
    }

    return mapRow(data as ContactSubmissionRow);
  } catch (error) {
    console.error('Failed to persist contact submission:', error);
    return null;
  }
}

export async function listContactSubmissions(options?: {
  since?: string;
  limit?: number;
}): Promise<ContactSubmission[]> {
  const limit = Math.min(Math.max(options?.limit ?? 50, 1), 200);
  const sinceMs = options?.since ? Date.parse(options.since) : undefined;
  if (options?.since && sinceMs !== undefined && Number.isNaN(sinceMs)) {
    throw new Error('Invalid since timestamp');
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  let query = supabase
    .from('contact_submissions')
    .select('id, name, email, message, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (sinceMs !== undefined && !Number.isNaN(sinceMs)) {
    query = query.gte('created_at', new Date(sinceMs).toISOString());
  }

  const { data, error } = await query;
  if (error) {
    console.error('Failed to list contact submissions:', error);
    throw error;
  }

  return ((data as ContactSubmissionRow[]) || []).map(mapRow);
}

export async function updateContactStatus(
  id: string,
  _status: ContactStatus
): Promise<ContactSubmission | null> {
  // contact_submissions has no status column; keep API shape without failing hard
  void _status;
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  const { data, error } = await supabase
    .from('contact_submissions')
    .select('id, name, email, message, created_at')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Failed to update contact status:', error);
    throw error;
  }

  return data ? mapRow(data as ContactSubmissionRow) : null;
}
