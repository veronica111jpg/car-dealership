// Shared by the filter sidebar and the admin forms.
export const CATEGORIES = ["Hatchback", "Sedan", "SUV", "MPV", "Pickup", "Electric"];

// Prices are shown in Indian rupees with lakh/crore grouping, e.g. ₹14,50,000.
export const formatPrice = (n) =>
  n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });