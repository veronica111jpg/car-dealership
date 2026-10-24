import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../AuthContext";
import AdminControls from "../components/AdminControls";
import ConfirmModal from "../components/ConfirmModal";
import FilterBar from "../components/FilterBar";
import Navbar from "../components/Navbar";
import RestockModal from "../components/RestockModal";
import VehicleCard from "../components/VehicleCard";
import VehicleFormModal from "../components/VehicleFormModal";

const EMPTY_FILTERS = { make: "", model: "", category: "", minPrice: "", maxPrice: "" };

export default function Dashboard() {
  const { session, isAdmin, logout } = useAuth();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [toast, setToast] = useState(null);
  // Which popup is open: null, or { type: "form" | "restock" | "delete", vehicle }.
  const [modal, setModal] = useState(null);
  // Bump this number to force the list to reload after a change.
  const [refreshKey, setRefreshKey] = useState(0);
  const reload = () => setRefreshKey((k) => k + 1);

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  // Reload the list whenever the filters change. The search endpoint with no
  // filters returns every vehicle, so one call covers both cases.
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.make) params.set("make", filters.make);
    if (filters.model) params.set("model", filters.model);
    if (filters.category) params.set("category", filters.category);
    if (filters.minPrice) params.set("min_price", filters.minPrice);
    if (filters.maxPrice) params.set("max_price", filters.maxPrice);

    let cancelled = false; // ignore responses from outdated searches
    // Wait 300ms after the last keystroke so we don't call the API per letter.
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const data = await api(`/api/vehicles/search?${params}`, {
          token: session.token,
        });
        if (!cancelled) setVehicles(data);
      } catch (err) {
        if (err.status === 401) logout(); // token expired
        else if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, refreshKey, session.token]);

  async function handlePurchase(vehicle) {
    setBusyId(vehicle.id);
    try {
      const updated = await api(`/api/vehicles/${vehicle.id}/purchase`, {
        method: "POST",
        token: session.token,
      });
      setVehicles((list) => list.map((v) => (v.id === updated.id ? updated : v)));
      showToast(`Purchased 1 x ${updated.make} ${updated.model}`);
    } catch (err) {
      if (err.status === 401) return logout();
      showToast(err.message, "error");
      reload(); // stock may have changed since we loaded the page
    } finally {
      setBusyId(null);
    }
  }

  // ---- Admin actions. Each one throws on failure so the popup can show the error. ----

  async function handleSave(data) {
    const editing = modal.vehicle;
    await api(editing ? `/api/vehicles/${editing.id}` : "/api/vehicles", {
      method: editing ? "PUT" : "POST",
      body: data,
      token: session.token,
    });
    setModal(null);
    showToast(editing ? "Vehicle updated" : "Vehicle added");
    reload();
  }

  async function handleRestock(amount) {
    const vehicle = modal.vehicle;
    await api(`/api/vehicles/${vehicle.id}/restock`, {
      method: "POST",
      body: { quantity: amount },
      token: session.token,
    });
    setModal(null);
    showToast(`Added ${amount} units to ${vehicle.make} ${vehicle.model}`);
    reload();
  }

  async function handleDelete() {
    const vehicle = modal.vehicle;
    await api(`/api/vehicles/${vehicle.id}`, {
      method: "DELETE",
      token: session.token,
    });
    setModal(null);
    showToast(`Deleted ${vehicle.make} ${vehicle.model}`);
    reload();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Available vehicles</h1>
            <p className="text-slate-500">Browse the inventory and buy in one click.</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setModal({ type: "form", vehicle: null })}
              className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              + Add vehicle
            </button>
          )}
        </div>

        <FilterBar
          filters={filters}
          onChange={setFilters}
          onClear={() => setFilters(EMPTY_FILTERS)}
        />

        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</div>
        )}

        {loading ? (
          <p className="py-12 text-center text-slate-500">Loading vehicles...</p>
        ) : vehicles.length === 0 ? (
          <p className="py-12 text-center text-slate-500">
            No vehicles match your search.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                onPurchase={handlePurchase}
                busy={busyId === v.id}
              >
                {/* Only admins ever see these buttons (the server enforces it too). */}
                {isAdmin && (
                  <AdminControls
                    onEdit={() => setModal({ type: "form", vehicle: v })}
                    onRestock={() => setModal({ type: "restock", vehicle: v })}
                    onDelete={() => setModal({ type: "delete", vehicle: v })}
                  />
                )}
              </VehicleCard>
            ))}
          </div>
        )}
      </main>

      {modal?.type === "form" && (
        <VehicleFormModal
          vehicle={modal.vehicle}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === "restock" && (
        <RestockModal
          vehicle={modal.vehicle}
          onRestock={handleRestock}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === "delete" && (
        <ConfirmModal
          vehicle={modal.vehicle}
          onConfirm={handleDelete}
          onClose={() => setModal(null)}
        />
      )}

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-30 rounded-lg px-4 py-3 font-medium text-white shadow-lg ${
            toast.type === "error" ? "bg-red-600" : "bg-emerald-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}