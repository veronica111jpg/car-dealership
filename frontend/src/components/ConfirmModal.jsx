import { useState } from "react";
import Modal from "./Modal";

export default function ConfirmModal({ vehicle, onConfirm, onClose }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    setError("");
    setBusy(true);
    try {
      await onConfirm();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <Modal title="Delete vehicle" onClose={onClose}>
      <p className="text-sm text-slate-600">
        Permanently delete <strong>{vehicle.make} {vehicle.model}</strong>? This cannot be undone.
      </p>
      {error && (
        <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}
      <div className="flex justify-end gap-2 pt-5">
        <button onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
          Cancel
        </button>
        <button onClick={handleDelete} disabled={busy} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">
          {busy ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Modal>
  );
}