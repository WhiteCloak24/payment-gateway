import React from "react";
import { CardType } from "../types/payment";

interface CardPreviewProps {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cardType: CardType;
}

export const CardPreview: React.FC<CardPreviewProps> = ({
  cardNumber,
  cardHolder,
  expiry,
  cardType,
}) => {
  return (
    <div className="w-full max-w-sm h-40 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-white shadow-2xl transition-all mb-8">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-8 bg-yellow-500/20 rounded-md" />{" "}
        <span className="font-bold italic text-xl">
          {cardType !== "Unknown" ? cardType : "Bank"}
        </span>
      </div>

      <div className="text-xl tracking-widest mb-4 h-8">
        {cardNumber || "•••• •••• •••• ••••"}
      </div>

      <div className="flex justify-between">
        <div>
          <p className="text-[10px] uppercase opacity-60">Card Holder</p>
          <p className="font-medium text-sm tracking-wide uppercase truncate w-40">
            {cardHolder || "Your Name"}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase opacity-60">Expires</p>
          <p className="font-medium text-sm tracking-wide">{expiry || "MM/YY"}</p>
        </div>
      </div>
    </div>
  );
};
