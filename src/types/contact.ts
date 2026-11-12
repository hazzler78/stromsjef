export type ContactStatus = 'new' | 'handled';

export interface ContactSubmission {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  newsletterOptIn: boolean;
  source?: string;
  message?: string;
  status: ContactStatus;
}

export interface ContactSubmissionInput {
  name: string;
  email: string;
  phone: string;
  newsletterOptIn?: boolean;
  source?: string;
  message?: string;
}
