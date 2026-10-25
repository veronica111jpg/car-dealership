import { CATEGORIES } from "../constants";

// A collapsible group, built on the native <details> element (no extra JS).
function Section({ title, children }) {
  return (
    <details open className="group border-b border-line py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-semibold [&::-webkit-details-marker]:hidden">
        {title}
        <svg
          viewBox="0 0 20 20"
          className="h-4 w-4 transition group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12l5-5 5 5" />
        </svg>
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

export default function FilterBar({
  filters,
  onChange,
  inStockOnly,
  onInStockChange,
  onClear,
}) {
  // Returns a handler that updates just one field of the filters object.
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  const tab = (active) =>
    `flex-1 rounded-md py-2.5 text-sm font-semibold transition ${
      active ? "bg-surface text-ink" : "text-muted hover:text-ink"
    }`;

  return (
    <aside>
      {/* All / In stock toggle */}
      <div className="flex gap-1 rounded-md border border-line p-1">
        <button onClick={() => onInStockChange(false)} className={tab(!inStockOnly)}>
          All
        </button>
        <button onClick={() => onInStockChange(true)} className={tab(inStockOnly)}>
          In stock
        </button>
      </div>

      <Section title="Make">
        <input placeholder="e.g. Tata" value={filters.make} onChange={set("make")} className="field" />
      </Section>

      <Section title="Model">
        <input placeholder="e.g. Nexon" value={filters.model} onChange={set("model")} className="field" />
      </Section>

      <Section title="Category">
        <div className="space-y-1">
          {["", ...CATEGORIES].map((c) => (
            <label key={c || "all"} className="flex cursor-pointer items-center gap-3 py-1.5 text-sm">
              <input
                type="radio"
                name="category"
                checked={filters.category === c}
                onChange={() => onChange({ ...filters, category: c })}
                className="h-4 w-4 accent-white"
              />
              {c || "All categories"}
            </label>
          ))}
        </div>
      </Section>

      <Section title="Price (₹)">
        <div className="grid grid-cols-2 gap-3">
          <input type="number" min="0" placeholder="Min" value={filters.minPrice} onChange={set("minPrice")} className="field" />
          <input type="number" min="0" placeholder="Max" value={filters.maxPrice} onChange={set("maxPrice")} className="field" />
        </div>
      </Section>

      <button onClick={onClear} className="mt-5 text-sm font-medium text-muted hover:text-ink">
        Clear all filters
      </button>
    </aside>
  );
}