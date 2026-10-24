import { useState } from "react";
import { CATEGORIES } from "../constants";
import Modal from "./Modal";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";

// If `vehicle` is passed we are editing it, otherwise we are adding a new one.
export default function VehicleFormModal({ vehicle, onSave, onClose }) {
  const editing = Boolean(vehicle);
  const [form, setForm] = useState({
    make: vehicle?.make ?? "",
    model: vehicle?.model ?? "",
    category: vehicle?.category ?? CATEGORIES[0],
    price: vehicle?.price ?? "",
    quantity: vehicle?.quantity ?? "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      // Inputs give us strings, but the API expects numbers.
      await onSave({
        make: form.make.trim(),
        model: form.model.trim(),
        category: form.category,
        price: Number(form.price),
        quantity: parseInt(form.quantity, 10),
      });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <Modal title={editing ? "Edit vehicle" : "Add vehicle"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        <input required placeholder="Make" value={form.make} onChange={set("make")} className={inputClass} />
        <input required placeholder="Model" value={form.model} onChange={set("model")} className={inputClass} />
        <select value={form.category} onChange={set("category")} className={inputClass}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-3">
          <input required type="number" min="0" step="0.01" placeholder="Price" value={form.price} onChange={set("price")} className={inputClass} />
          <input required type="number" min="0" step="1" placeholder="Quantity" value={form.quantity} onChange={set("quantity")} className={inputClass} />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">
            {saving ? "Saving..." : editing ? "Save changes" : "Add vehicle"}
          </button>
        </div>
      </form>
    </Modal>
  );
}