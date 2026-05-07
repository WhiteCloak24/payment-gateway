export type PaymentStatus =
  | "Idle"
  | "Processing"
  | "Success"
  | "Failed"
  | "Timeout";
export type CardType = "Visa" | "Mastercard" | "Amex" | "Unknown";
export type Currency = "USD" | "INR";
export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  timestamp: number;
}
