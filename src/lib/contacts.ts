import { randomUUID } from 'crypto';
import { kv } from '@vercel/kv';
import {
  ContactStatus,
  ContactSubmission,
  ContactSubmissionInput,
} from '@/types/contact';

const CONTACTS_INDEX_KEY = 'contacts:index';

const isDevelopmentMode: boolean =
  process.env.NODE_ENV === 'development' &&
  (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN);

const inMemoryContacts: ContactSubmission[] = [];

function contactKey(id: string): string {
  return `contact:${id}`;
}

export async function saveContactSubmission(
  input: ContactSubmissionInput
): Promise<ContactSubmission | null> {
  const submission: ContactSubmission = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    name: input.name,
    email: input.email,
    phone: input.phone,
    newsletterOptIn: Boolean(input.newsletterOptIn),
    source: input.source,
    message: input.message,
    status: 'new',
  };

  try {
    if (isDevelopmentMode) {
      inMemoryContacts.unshift(submission);
      return submission;
    }

    await kv.set(contactKey(submission.id), submission);
    await kv.zadd(CONTACTS_INDEX_KEY, {
      score: Date.parse(submission.createdAt),
      member: submission.id,
    });
    return submission;
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

  try {
    if (isDevelopmentMode) {
      let items = [...inMemoryContacts];
      if (sinceMs !== undefined && !Number.isNaN(sinceMs)) {
        items = items.filter((c) => Date.parse(c.createdAt) >= sinceMs);
      }
      return items.slice(0, limit);
    }

    const fetchCount = sinceMs !== undefined ? limit * 5 : limit;
    const ids = await kv.zrange<string[]>(CONTACTS_INDEX_KEY, 0, fetchCount - 1, {
      rev: true,
    });

    if (!ids?.length) {
      return [];
    }

    const contacts: ContactSubmission[] = [];
    for (const id of ids) {
      const entry = await kv.get<ContactSubmission>(contactKey(id));
      if (!entry) {
        continue;
      }
      if (sinceMs !== undefined && Date.parse(entry.createdAt) < sinceMs) {
        continue;
      }
      contacts.push(entry);
      if (contacts.length >= limit) {
        break;
      }
    }

    return contacts;
  } catch (error) {
    console.error('Failed to list contact submissions:', error);
    throw error;
  }
}

export async function updateContactStatus(
  id: string,
  status: ContactStatus
): Promise<ContactSubmission | null> {
  try {
    if (isDevelopmentMode) {
      const index = inMemoryContacts.findIndex((c) => c.id === id);
      if (index === -1) {
        return null;
      }
      inMemoryContacts[index] = { ...inMemoryContacts[index], status };
      return inMemoryContacts[index];
    }

    const key = contactKey(id);
    const existing = await kv.get<ContactSubmission>(key);
    if (!existing) {
      return null;
    }

    const updated: ContactSubmission = { ...existing, status };
    await kv.set(key, updated);
    return updated;
  } catch (error) {
    console.error('Failed to update contact status:', error);
    throw error;
  }
}
