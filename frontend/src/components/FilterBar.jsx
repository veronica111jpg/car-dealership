import { CATEGORIES } from "../constants";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";

export default function FilterBar({ filters, onChange, onClear }) {
  // Returns a handler that updates just one field of the filters object.
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <input
          placeholder="Make (e.g. Toyota)"
          value={filters.make}
          onChange={set("make")}
          className={inputClass}
        />
        <input
          placeholder="Model (e.g. Civic)"
          value={filters.model}
          onChange={set("model")}
          className={inputClass}
        />
        <select
          value={filters.category}
          onChange={set("category")}
          className={inputClass}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="0"
          placeholder="Min price"
          value={filters.minPrice}
          onChange={set("minPrice")}
          className={inputClass}
        />
        <input
          type="number"
          min="0"
          placeholder="Max price"
          value={filters.maxPrice}
          onChange={set("maxPrice")}
          className={inputClass}
        />
      </div>
      <button
        onClick={onClear}
        className="mt-3 text-sm font-medium text-indigo-600 hover:underline"
      >
        Clear filters
      </button>
    </div>
  );
}