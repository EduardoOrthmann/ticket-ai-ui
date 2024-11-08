export interface Email {
  id: string;
  subject: string;
  body: string;
  from_: string;
  status: 'processed' | 'unprocessed';
}

export interface TicketRequest {
  subject: string;
  body: string;
}

export interface Ticket {
  cause_code: string;
  priority: string;
  brief_description: string;
  assignment: string;
  summarized_issue: string;
  reason: string;
  raw_email: string;
}
