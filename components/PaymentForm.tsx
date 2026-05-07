"use client";

import React, { useEffect, useMemo } from "react";
import { usePaymentStore } from "../hooks/usePaymentStore";
import { useHandlePayment } from "../hooks/useHandlePayment";
import {
  CurrencyArray,
  formatCardNumber,
  formatCVV,
  formatExpiry,
  getCardType,
  validateCVV,
  validateExpiryDate,
} from "../utils/paymentUtils";
import { CardPreview } from "./CardPreview";
import { Controller, useForm } from "react-hook-form";

const initialFormData = {
  name: "",
  number: "",
  expiry: "",
  cvv: "",
  amount: "100",
  currency: "USD" as "USD" | "INR",
};
export const PaymentForm = () => {
  const { status, attempts, transactionId, generateNewTransactionId } =
    usePaymentStore();
  const { executePayment } = useHandlePayment();

  const { control, handleSubmit, reset, watch, getValues } = useForm({
    mode: "onBlur",
    defaultValues: initialFormData,
  });

  const [amount, cvv, expiry, name, number] = watch([
    "amount",
    "cvv",
    "expiry",
    "name",
    "number",
  ]);

  useEffect(() => {
    generateNewTransactionId();
  }, []);

  const cardType = useMemo(() => getCardType(number), [number]);

  const isFormValid =
    name.length > 2 &&
    number.length >= 15 &&
    expiry.includes("/") &&
    cvv.length >= 3;

  const onSubmit = (values: any) => {
    executePayment(values).then(() => {
      reset(initialFormData);
    });
  };

  const handleRetry = () => {
    executePayment(getValues());
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-lg">
      <CardPreview
        cardNumber={number}
        cardHolder={name}
        expiry={expiry}
        cardType={cardType}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Cardholder Name
          </label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => {
              return (
                <input
                  type="text"
                  className="w-full h-10 border p-2 rounded"
                  {...field}
                  required
                  autoComplete="off"
                  disabled={attempts != 0}
                />
              );
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Card Number</label>
          <Controller
            control={control}
            name="number"
            render={({ field }) => {
              return (
                <input
                  type="text"
                  className="w-full h-10 border p-2 rounded"
                  {...field}
                  onChange={(e) =>
                    field.onChange(formatCardNumber(e.target.value))
                  }
                  maxLength={19}
                  placeholder="0000 0000 0000 0000"
                  autoComplete="off"
                  disabled={attempts != 0}
                />
              );
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Expiry (MM/YY)
            </label>
            <Controller
              control={control}
              name="expiry"
              render={({ field }) => {
                return (
                  <input
                    type="text"
                    className="w-full h-10 border p-2 rounded"
                    {...field}
                    onChange={(e) =>
                      field.onChange(formatExpiry(e.target.value))
                    }
                    placeholder="MM/YY"
                    autoComplete="cc-exp webauthn"
                    disabled={attempts != 0}
                  />
                );
              }}
            />

            {expiry.length === 5 && !validateExpiryDate(expiry) && (
              <span id="expiry-error" className="text-red-500 text-xs">
                Invalid or past date
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CVV</label>
            <Controller
              control={control}
              name="cvv"
              render={({ field }) => {
                return (
                  <input
                    type="password"
                    {...field}
                    onChange={(e) =>
                      field.onChange(formatCVV(e.target.value, cardType))
                    }
                    autoComplete="off"
                    className="w-full h-10 border p-2 rounded"
                    maxLength={cardType === "Amex" ? 4 : 3}
                    disabled={attempts != 0}
                  />
                );
              }}
            />

            {cvv.length > 0 && !validateCVV(cvv, cardType) && (
              <span id="cvv-error" className="text-red-500 text-xs">
                Requires {cardType === "Amex" ? "4" : "3"} digits
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="amount" className="block text-sm font-medium mb-1">
              Amount
            </label>
            <Controller
              control={control}
              name="amount"
              render={({ field }) => {
                return (
                  <input
                    type="number"
                    {...field}
                    min="1"
                    step="any"
                    className="w-full border p-2 h-10 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="0.00"
                    required
                    autoComplete="transaction-amount webauthn"
                    disabled={attempts != 0}
                  />
                );
              }}
            />
          </div>

          <div className="w-1/3">
            <label
              htmlFor="currency"
              className="block text-sm font-medium mb-1"
            >
              Currency
            </label>
            <Controller
              control={control}
              name="currency"
              render={({ field }) => {
                return (
                  <select
                    id="currency"
                    className="w-full border p-2 h-10 rounded bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    {...field}
                    disabled={attempts != 0}
                  >
                    {CurrencyArray.map(({ id, label, value }) => {
                      return (
                        <option key={id} value={value}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                );
              }}
            />
          </div>
        </div>
        {status === "Failed" || status === "Timeout" ? (
          <div className="text-center space-y-3">
            <p className="text-red-500">
              {status === "Timeout"
                ? "Request Timed Out"
                : "Transaction Failed"}
            </p>
            {attempts < 3 ? (
              <button
                type="button"
                onClick={handleRetry}
                className="bg-blue-600 text-white px-6 py-2 rounded w-full"
              >
                Retry (Attempt {attempts + 1} of 3)
              </button>
            ) : (
              <p className="text-gray-500 font-bold">
                Maximum retry attempts reached.
              </p>
            )}
          </div>
        ) : (
          <button
            type="submit"
            disabled={!isFormValid}
            className="w-full bg-black text-white p-3 rounded-lg disabled:bg-gray-300 transition-colors cursor-pointer"
          >
            Pay Now ${amount}
          </button>
        )}
      </form>
    </div>
  );
};
