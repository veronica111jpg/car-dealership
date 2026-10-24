export default function AdminControls({ onEdit, onRestock, onDelete }) {
  const base = "flex-1 rounded-lg border px-2 py-1.5 text-sm font-medium transition";
  return (
    <div className="flex gap-2 border-t border-slate-100 pt-3">
      <button onClick={onEdit} className={`${base} border-slate-300 text-slate-700 hover:bg-slate-100`}>
        Edit
      </button>
      <button onClick={onRestock} className={`${base} border-emerald-300 text-emerald-700 hover:bg-emerald-50`}>
        Restock
      </button>
      <button onClick={onDelete} className={`${base} border-red-300 text-red-700 hover:bg-red-50`}>
        Delete
      </button>
    </div>
  );
}