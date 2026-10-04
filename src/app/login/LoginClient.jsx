"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/authSlice";
import { showToast } from "@/store/toastSlice";
import { login } from "@/lib/api";

export default function LoginClient() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    login(username.trim(), password)
      .then((user) => {
        setLoading(false);
        dispatch(setUser(user));
        dispatch(showToast(`Welcome back, ${user.firstName}`));
        router.push("/");
      })
      .catch((err) => setError(err.message || "Login failed"));
  }

  return (
    <div className="container-page grid gap-8 py-12 lg:grid-cols-2 lg:items-center">
      <div>
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="mt-2 text-muted">Sign in to see your orders, wishlist and personal recommendations.</p>
        <div className="mt-6 rounded-xl bg-brand-50 p-5 text-sm">
          <p className="font-semibold">Demo account</p>
          <p className="mt-1 text-muted">username: <code>emilys</code> · password: <code>emilyspass</code></p>
          <p className="mt-1 text-muted">Auth uses the DummyJSON test users.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-8 shadow-card">
        <label className="label">Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} className="input" />
        <div className="mt-4">
          <label className="label">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" />
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary mt-5 w-full">
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <p className="mt-3 text-center text-xs text-muted">
          Don&apos;t have an account? <Link href="/login" className="text-brand-600">Sign up</Link>
        </p>
      </form>
    </div>
  );
}
