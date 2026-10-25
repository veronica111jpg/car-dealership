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
    <Modal title="Restock" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-muted">
          {vehicle.make} {vehicle.model} currently has{" "}
          <strong className="text-ink">{vehicle.quantity}</strong> in stock.
        </p>
        {error && <div className="error-box">{error}</div>}
        <div>
          <label className="label">Units to add</label>
          <input
            required
            autoFocus
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="field"
          />
        </div>
        <div className="flex justify-end gap-2 pt-3">
          <button type="button" onClick={onClose} className="btn-outline">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Restocking..." : "Restock"}
          </button>
        </div>
      </form>
    </Modal>
  );
}