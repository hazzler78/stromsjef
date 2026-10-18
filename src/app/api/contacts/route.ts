import { NextRequest, NextResponse } from 'next/server';
import { verifyContactsApiToken } from '@/lib/contacts-api-auth';
import {
  listContactSubmissions,
  updateContactStatus,
} from '@/lib/contacts';
import { ContactStatus } from '@/types/contact';

function unauthorizedResponse(auth: {
  authorized: false;
  status: 401 | 500;
  error: string;
}) {
  return NextResponse.json({ error: auth.error }, { status: auth.status });
}

export async function GET(request: NextRequest) {
  const auth = verifyContactsApiToken(request.headers.get('authorization'));
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  const { searchParams } = new URL(request.url);
  const since = searchParams.get('since') ?? undefined;
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? parseInt(limitParam, 10) : undefined;

  if (limitParam && (limit === undefined || Number.isNaN(limit) || limit < 1)) {
    return NextResponse.json({ error: 'Invalid limit parameter' }, { status: 400 });
  }

  try {
    const contacts = await listContactSubmissions({ since, limit });
    return NextResponse.json({ contacts });
  } catch (error) {
    const message =
      error instanceof Error && error.message === 'Invalid since timestamp'
        ? error.message
        : 'Failed to load contacts';
    const status =
      error instanceof Error && error.message === 'Invalid since timestamp'
        ? 400
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = verifyContactsApiToken(request.headers.get('authorization'));
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const body = await request.json();
    const { id, status } = body as { id?: string; status?: ContactStatus };

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Missing contact id' }, { status: 400 });
    }

    if (status !== 'new' && status !== 'handled') {
      return NextResponse.json(
        { error: 'status must be "new" or "handled"' },
        { status: 400 }
      );
    }

    const updated = await updateContactStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json({ contact: updated });
  } catch (error) {
    console.error('PATCH /api/contacts error:', error);
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
  }
}
