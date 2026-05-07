import { usePaymentStore } from "./usePaymentStore";

export const useHandlePayment = () => {
  const {
    setStatus,
    incrementAttempt,
    addTransaction,
    transactionId,
  } = usePaymentStore();

  const executePayment = async (payload: any) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s Limit [cite: 25, 53]

    setStatus("Processing");
    incrementAttempt();

    try {
      const res = await fetch("/api/pay", {
        method: "POST",
        signal: controller.signal,
        body: JSON.stringify({ ...payload, transactionId: transactionId }),
      });

      const data = await res.json();
      clearTimeout(timeoutId);

      const finalStatus = data.success ? "Success" : "Failed";
      setStatus(finalStatus);

      addTransaction({
        id: transactionId,
        amount: payload.amount,
        currency: payload.currency,
        status: finalStatus,
        timestamp: Date.now(),
      });
      // if (finalStatus === "Success") {
      //   generateNewTransactionId();
      // }
    } catch (err: any) {
      const status = err.name === "AbortError" ? "Timeout" : "Failed";
      setStatus(status);
    }
  };

  return { executePayment };
};
