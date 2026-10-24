import { useAuth } from "../AuthContext";

export default function Dashboard() {
  const { session, isAdmin, logout } = useAuth();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Logged in as {session.email}</h1>
      <p className="mt-2 text-slate-600">Role: {isAdmin ? "admin" : "user"}</p>
      <button
        onClick={logout}
        className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-white"
      >
        Log out
      </button>
    </div>
  );
}