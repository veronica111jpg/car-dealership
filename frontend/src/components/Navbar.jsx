import { useAuth } from "../AuthContext";

export default function Navbar() {
  const { session, isAdmin, logout } = useAuth();

  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <span className="text-sm font-semibold tracking-[0.25em]">AUTOSTOCK</span>
        <div className="flex items-center gap-4 text-sm">
          <span className="hidden text-muted sm:inline">{session.email}</span>
          {isAdmin && (
            <span className="rounded-full border border-line px-2.5 py-0.5 text-xs font-medium">
              Admin
            </span>
          )}
          <button onClick={logout} className="font-medium hover:text-muted">
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}