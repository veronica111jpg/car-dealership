import { useState } from "react";
import { CATEGORIES } from "../constants";
import Modal from "./Modal";

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
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="error-box">{error}</div>}
        <div>
          <label className="label">Make</label>
          <input required value={form.make} onChange={set("make")} className="field" />
        </div>
        <div>
          <label className="label">Model</label>
          <input required value={form.model} onChange={set("model")} className="field" />
        </div>
        <div>
          <label className="label">Category</label>
          <select value={form.category} onChange={set("category")} className="field">
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Price (₹)</label>
            <input required type="number" min="0" step="1" value={form.price} onChange={set("price")} className="field" />
          </div>
          <div>
            <label className="label">Quantity</label>
            <input required type="number" min="0" step="1" value={form.quantity} onChange={set("quantity")} className="field" />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-3">
          <button type="button" onClick={onClose} className="btn-outline">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving..." : editing ? "Save changes" : "Add vehicle"}
          </button>
        </div>
      </form>
    </Modal>
  );
}