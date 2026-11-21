export type ActivityResult = 'Success' | 'Warning' | 'Blocked';

export interface AuditRecord {
  id: string;
  timestamp: string;
  formattedDate: string;
  actor: {
    name: string;
    role: string;
    initials: string;
    ipAddress: string;
    userAgent: string;
  };
  actionType: string;
  company: string;
  description: string;
  result: ActivityResult;
  metadata?: Record<string, any>;
}
