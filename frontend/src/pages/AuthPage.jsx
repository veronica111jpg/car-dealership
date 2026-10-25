import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import CarSilhouette from "../components/CarSilhouette";

export default function AuthPage({ mode }) {
  const isLogin = mode === "login";
  const { session, login, register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (session) return <Navigate to="/" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await (isLogin ? login(email, password) : register(email, password));
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Soft light behind the drawing, the only "decoration" on the page. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_45%,rgba(255,255,255,0.09),transparent_60%)]" />

      <header className="relative border-b border-line">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <span className="text-sm font-semibold tracking-[0.25em]">AUTOSTOCK</span>
          <Link
            to={isLogin ? "/register" : "/login"}
            className="text-sm font-medium hover:text-muted"
          >
            {isLogin ? "Create account" : "Log in"}
          </Link>
        </div>
      </header>

      <main className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-14 lg:min-h-[calc(100vh-70px)] lg:grid-cols-2">
        <div>
          <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Find your
            <br />
            next car.
          </h1>
          <p className="mt-4 max-w-sm text-muted">
            Browse the full dealership inventory, filter by what matters and
            buy in a click.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 max-w-md space-y-4 rounded-lg border border-line bg-surface/60 p-6"
          >
            <h2 className="text-lg font-semibold">
              {isLogin ? "Log in" : "Create your account"}
            </h2>

            {error && <div className="error-box">{error}</div>}

            <div>
              <label className="label">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field !bg-canvas"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field !bg-canvas"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Please wait..." : isLogin ? "Log in" : "Sign up"}
            </button>
          </form>
        </div>

        <div className="hidden lg:block">
          <CarSilhouette className="w-full text-ink/25" />
        </div>
      </main>
    </div>
  );
}