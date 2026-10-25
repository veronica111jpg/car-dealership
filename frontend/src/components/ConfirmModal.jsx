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
      <p className="text-sm text-muted">
        Permanently delete{" "}
        <strong className="text-ink">
          {vehicle.make} {vehicle.model}
        </strong>
        ? This cannot be undone.
      </p>
      {error && <div className="error-box mt-3">{error}</div>}
      <div className="flex justify-end gap-2 pt-5">
        <button onClick={onClose} className="btn-outline">
          Cancel
        </button>
        <button onClick={handleDelete} disabled={busy} className="btn-danger">
          {busy ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Modal>
  );
}