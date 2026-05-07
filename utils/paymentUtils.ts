import { CardType } from "@/types/payment";

export const CurrencyArray = [
  {
    id: "USD",
    label: "USD ($)",
    value: "USD",
  },
  {
    id: "INR",
    label: "INR (₹)",
    value: "INR",
  },
];

export const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim()
    .slice(0, 19);

export const getCardType = (number: string): CardType => {
  if (number.startsWith("4")) return "Visa";
  if (/^5[1-5]/.test(number)) return "Mastercard";
  if (/^3[47]/.test(number)) return "Amex";
  return "Unknown";
};

export const formatExpiry = (value: string) => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, "");

  // Limit to 4 digits (MMYY) [cite: 8]
  const limited = digits.slice(0, 4);

  // Add slash after first 2 digits if they exist [cite: 8]
  if (limited.length > 2) {
    return `${limited.slice(0, 2)}/${limited.slice(2)}`;
  }

  return limited;
};

export const validateExpiryDate = (value: string): boolean => {
  if (value.length !== 5) return false;

  const [month, year] = value.split("/").map(Number);
  if (month < 1 || month > 12) return false;

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = parseInt(now.getFullYear().toString().slice(-2));

  // Reject past dates [cite: 14]
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;

  return true;
};

export const formatCVV = (value: string, cardType: CardType) => {
  // Remove all non-digit characters [cite: 14]
  const digits = value.replace(/\D/g, "");

  // Amex uses 4 digits, others use 3 [cite: 14]
  const maxLength = cardType === "Amex" ? 4 : 3;
  return digits.slice(0, maxLength);
};

export const validateCVV = (cvv: string, cardType: CardType): boolean => {
  const requiredLength = cardType === "Amex" ? 4 : 3;
  return cvv.length === requiredLength; // [cite: 14]
};
