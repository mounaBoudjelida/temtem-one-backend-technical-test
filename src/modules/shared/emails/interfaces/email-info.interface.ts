export interface EmailInfo {
  to: string | string[];
  cc?: string | string[];
  subject: string;
  templateName: string;
  context: Record<string, string>;
}
