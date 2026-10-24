import { useState } from "react";
import Modal from "./Modal";

export default function RestockModal({ vehicle, onRestock, onClose }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onRestock(parseInt(amount, 10));
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <Modal title="Restock vehicle" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <p className="text-sm text-slate-600">
          {vehicle.make} {vehicle.model} currently has{" "}
          <strong>{vehicle.quantity}</strong> in stock. How many units are you adding?
        </p>
        {error && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        )}
        <input
          required
          autoFocus
          type="number"
          min="1"
          step="1"
          placeholder="Units to add"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
            {saving ? "Restocking..." : "Restock"}
          </button>
        </div>
      </form>
    </Modal>
  );
}