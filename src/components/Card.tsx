import { formattedCurrency } from "../utils/format-currency";

interface CardProps {
  title: string;
  currency: number;
  isCurrency?: boolean;
}

export function Card({ title, currency, isCurrency = true }: CardProps) {
  return (
    <div
      className="flex flex-col justify-center items-center bg-zinc-700 p-3 rounded-lg
   drop-shadow-md transform hover:scale-105 transition-all hover:ring-2 ring-green-300"
    >
      <p className="capitalize font-medium">{title}</p>
      <span className="text-green-300 font-semibold">
        {isCurrency ? `${formattedCurrency(currency)}` : `${currency}%`}
      </span>
    </div>
  )
}