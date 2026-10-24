import { CATEGORY_BANNER, DEFAULT_BANNER } from "../constants";
import CarIcon from "./CarIcon";

const money = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

// `children` is a slot: the admin controls get passed in there later.
export default function VehicleCard({ vehicle, onPurchase, busy, children }) {
  const soldOut = vehicle.quantity === 0;
  const banner = CATEGORY_BANNER[vehicle.category] ?? DEFAULT_BANNER;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-lg">
      {/* Coloured banner by category, with the make shown as a watermark. */}
      <div
        className={`relative flex h-32 items-center justify-center overflow-hidden bg-gradient-to-br ${banner} ${
          soldOut ? "opacity-60 grayscale" : ""
        }`}
      >
        <span className="absolute -bottom-3 left-3 select-none text-5xl font-black uppercase tracking-tight text-white/20">
          {vehicle.make}
        </span>
        <CarIcon className="h-16 w-16 text-white" />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            {vehicle.category}
          </p>
          <h3 className="text-lg font-bold text-slate-800">
            {vehicle.make} {vehicle.model}
          </h3>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold text-slate-900">
            {money(vehicle.price)}
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              soldOut
                ? "bg-red-100 text-red-700"
                : vehicle.quantity <= 2
                ? "bg-amber-100 text-amber-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {soldOut ? "Out of stock" : `${vehicle.quantity} in stock`}
          </span>
        </div>

        {/* Disabled when there is nothing left, or while a request is running. */}
        <button
          onClick={() => onPurchase(vehicle)}
          disabled={soldOut || busy}
          className="mt-auto rounded-lg bg-indigo-600 py-2 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {busy ? "Purchasing..." : soldOut ? "Sold out" : "Purchase"}
        </button>

        {children}
      </div>
    </div>
  );
}