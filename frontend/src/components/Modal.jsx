// A centred popup with a dark backdrop. Clicking the backdrop closes it.
export default function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-line bg-canvas p-6"
        // Stop clicks inside the popup from reaching the backdrop.
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-2xl leading-none text-muted hover:text-ink"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}