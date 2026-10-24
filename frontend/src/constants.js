// Shared by the filter bar and the admin forms.
export const CATEGORIES = [
  "Sedan",
  "SUV",
  "Hatchback",
  "Truck",
  "Coupe",
  "Convertible",
  "Van",
];

// Each category gets its own banner colour on the vehicle card.
// (Full class names are written out so Tailwind can detect them.)
export const CATEGORY_BANNER = {
  Sedan: "from-indigo-500 to-blue-600",
  SUV: "from-emerald-500 to-teal-600",
  Hatchback: "from-sky-500 to-cyan-600",
  Truck: "from-amber-500 to-orange-600",
  Coupe: "from-rose-500 to-red-600",
  Convertible: "from-fuchsia-500 to-purple-600",
  Van: "from-slate-500 to-slate-700",
};

export const DEFAULT_BANNER = "from-indigo-500 to-purple-600";