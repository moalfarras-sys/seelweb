export type MessageRole = "user" | "bot";

export interface BotAction {
  label: string;
  url: string;
  variant: "primary" | "secondary" | "whatsapp";
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  time: Date;
  actions?: BotAction[];
}

export interface LeadData {
  name: string;
  phone: string;
  email: string;
  service: string;
  date: string;
}