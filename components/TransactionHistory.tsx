"use client";

import { usePaymentStore } from "../hooks/usePaymentStore";
import moment from "moment";

export const TransactionHistory = () => {
  const { history } = usePaymentStore();

  if (history.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 border-2 border-dashed rounded-xl text-gray-400">
        No transactions found yet.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-gray-50 text-gray-600 font-medium border-b sticky top-0 z-10">
          <tr>
            <th className="px-6 py-4 w-1/4">Transaction ID</th>
            <th className="px-6 py-4 w-1/4">Amount</th>
            <th className="px-6 py-4 w-1/4">Status</th>
            <th className="px-6 py-4 w-1/4">Date</th>
          </tr>
        </thead>
      </table>

      <div className="max-h-[calc(100vh-250px)] min-h-50 overflow-y-auto">
        <table className="w-full text-left text-sm border-collapse">
          <tbody className="divide-y divide-gray-100">
            {history.map((tx) => (
              <tr
                key={tx.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() =>
                  alert(
                    `Details for TX: ${tx.id}\nStatus: ${tx.status}\nAmount: ${tx.amount} ${tx.currency}`,
                  )
                }
              >
                <td className="px-6 py-4 font-mono text-xs text-blue-600 w-1/4">
                  {tx.id.slice(0, 8)}...{tx.id.slice(-4)}
                </td>
                <td className="px-6 py-4 font-semibold w-1/4">
                  {tx.currency} {tx.amount}
                </td>
                <td className="px-6 py-4 w-1/4">
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      tx.status === "Success"
                        ? "bg-green-100 text-green-700"
                        : tx.status === "Failed"
                          ? "bg-red-100 text-red-700"
                          : tx.status === "Timeout"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 w-1/4">
                  {moment(tx.timestamp).format("DD MMM, YYYY | hh:mm A")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
