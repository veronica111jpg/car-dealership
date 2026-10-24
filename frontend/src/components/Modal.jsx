// A centred popup with a dark backdrop. Clicking the backdrop closes it.
export default function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        // Stop clicks inside the popup from reaching the backdrop.
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg px-2 py-1 text-2xl leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}