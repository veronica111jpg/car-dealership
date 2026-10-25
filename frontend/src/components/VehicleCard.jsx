import { formatPrice } from "../constants";
import CarSilhouette from "./CarSilhouette";

const TALL = ["SUV", "MPV", "Pickup"];

// `children` is a slot: the admin controls get passed in there.
export default function VehicleCard({ vehicle, onPurchase, busy, children }) {
  const soldOut = vehicle.quantity === 0;
  const low = !soldOut && vehicle.quantity <= 2;

  return (
    <article className="flex flex-col rounded-lg border border-line p-5 transition hover:border-muted/60">
      <div className={`flex h-36 items-center justify-center ${soldOut ? "opacity-40" : ""}`}>
        <CarSilhouette tall={TALL.includes(vehicle.category)} className="h-full text-ink/70" />
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold leading-tight">
          {vehicle.make} {vehicle.model}
        </h3>
        <p className="mt-1 font-semibold">{formatPrice(vehicle.price)}</p>
        <p className="mt-0.5 text-sm text-muted">{vehicle.category}</p>
        <p className={`text-sm ${soldOut ? "text-danger" : low ? "text-ink" : "text-muted"}`}>
          {soldOut ? "Out of stock" : low ? `Only ${vehicle.quantity} left` : `${vehicle.quantity} in stock`}
        </p>
      </div>

      {/* Disabled when there is nothing left, or while a request is running. */}
      <button
        onClick={() => onPurchase(vehicle)}
        disabled={soldOut || busy}
        className="btn-primary mt-5 w-full"
      >
        {busy ? "Purchasing..." : soldOut ? "Sold out" : "Purchase"}
      </button>

      {children}
    </article>
  );
}