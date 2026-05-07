"use client";

import { PaymentForm } from "@/components/PaymentForm";
import { TransactionHistory } from "@/components/TransactionHistory";
import { usePaymentStore } from "@/hooks/usePaymentStore";

export default function Home() {
  const { status, resetPayment, attempts, transactionId } = usePaymentStore();

  return (
    <>
      {status !== "Idle" && status !== "Failed" && status !== "Timeout" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all px-4">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center animate-in fade-in zoom-in duration-300">
            {status === "Processing" && (
              <div className="space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <h2 className="text-xl font-semibold">Processing Payment</h2>
                <p className="text-gray-500 text-sm">
                  Please do not refresh the page.
                </p>
                <div className="text-xs font-medium text-blue-600 bg-blue-50 py-1 px-3 rounded-full inline-block">
                  Attempt {attempts} of 3
                </div>
              </div>
            )}

            {status === "Success" && (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Payment Success!
                </h2>
                <p className="text-gray-500 text-sm">
                  Your transaction was completed successfully.
                </p>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">
                    Transaction ID
                  </p>
                  <p className="text-xs font-mono break-all">{transactionId}</p>
                </div>
                <button
                  onClick={() => {
                    resetPayment();
                    // window.location.reload(); // Removed reload for smoother UX, resetPayment should suffice
                  }}
                  className="w-full py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-[1280px] mx-auto px-4 py-6 md:py-12">
        <header className="text-center space-y-2 mb-8 md:mb-12">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900">
            Checkout
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            Complete your transaction securely
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 xl:gap-16 items-start">
          <div className="w-full lg:w-[55%] flex justify-center">
            <div className="w-full max-w-xl">
              <PaymentForm />

              {(status === "Success" ||
                status === "Failed" ||
                attempts === 3) && (
                <button
                  onClick={resetPayment}
                  className="mt-6 w-full text-blue-600 hover:underline text-sm font-medium py-2"
                >
                  Start New Payment
                </button>
              )}
            </div>
          </div>

          <div className="hidden lg:block w-[1px] self-stretch bg-gray-200" />

          <div className="w-full lg:w-[45%]">
            <div className="bg-white lg:bg-transparent rounded-2xl">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-slate-900 rounded-full inline-block"></span>
                Transaction History
              </h2>
              <TransactionHistory />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
