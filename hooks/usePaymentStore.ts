import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PaymentStatus, Transaction } from "../types/payment";

interface PaymentState {
  transactionId: string;
  status: PaymentStatus;
  history: Transaction[];
  attempts: number;
  setStatus: (status: PaymentStatus) => void;
  addTransaction: (tx: Transaction) => void;
  incrementAttempt: () => void;
  resetAttempts: () => void;
  resetPayment: () => void;
  generateNewTransactionId: () => void;
}

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set) => ({
      transactionId: "",
      status: "Idle",
      history: [],
      attempts: 0,
      setStatus: (status) => set({ status }),
      addTransaction: (tx) =>
        set((state) => ({
          history: [tx, ...state.history.filter((t) => t.id !== tx.id)],
        })),
      incrementAttempt: () =>
        set((state) => ({ attempts: state.attempts + 1 })),
      resetAttempts: () => set({ attempts: 0 }),
      resetPayment: () =>
        set({
          attempts: 0,
          status: "Idle",
          transactionId: crypto.randomUUID(),
        }),
      generateNewTransactionId: () => {
        set({ transactionId: crypto.randomUUID() });
      },
    }),
    { name: "payment-storage" },
  ),
);
