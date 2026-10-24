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

// Each category gets its own gradient for the card header.
// (Full class names are written out so Tailwind can detect them.)
export const CATEGORY_GRADIENT = {
  Sedan: "from-indigo-500 to-blue-600",
  SUV: "from-emerald-500 to-teal-600",
  Hatchback: "from-orange-400 to-rose-500",
  Truck: "from-slate-600 to-slate-800",
  Coupe: "from-red-500 to-rose-700",
  Convertible: "from-sky-400 to-cyan-600",
  Van: "from-purple-500 to-fuchsia-600",
};

export const DEFAULT_GRADIENT = "from-slate-500 to-slate-700";