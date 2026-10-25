export default function AdminControls({ onEdit, onRestock, onDelete }) {
  return (
    <div className="mt-4 flex gap-5 border-t border-line pt-3 text-sm font-medium">
      <button onClick={onEdit} className="hover:text-muted">Edit</button>
      <button onClick={onRestock} className="hover:text-muted">Restock</button>
      <button onClick={onDelete} className="ml-auto text-danger hover:opacity-70">
        Delete
      </button>
    </div>
  );
}