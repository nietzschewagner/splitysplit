"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type Mode = "login" | "signup";

type StoredUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: number;
};

const USERS_STORAGE_KEY = "splitmate_users_v1";
const ACTIVE_USER_STORAGE_KEY = "splitmate_active_user_v1";

const defaultForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function createId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("signup");
  const [form, setForm] = useState(defaultForm);
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "error" | "success"; message: string } | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(USERS_STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as StoredUser[]) : [];
      setUsers(Array.isArray(parsed) ? parsed : []);
      const activeId = window.localStorage.getItem(ACTIVE_USER_STORAGE_KEY);
      if (activeId) {
        const active = parsed.find((candidate) => candidate.id === activeId) ?? null;
        setCurrentUser(active);
      }
    } catch {
      setUsers([]);
      setCurrentUser(null);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    setFeedback(null);
  }, [mode]);

  const formIsValid = useMemo(() => {
    if (mode === "login") {
      return Boolean(form.email.trim() && form.password.trim());
    }
    return Boolean(
      form.name.trim() &&
        form.email.trim() &&
        form.password.trim() &&
        form.confirmPassword.trim(),
    );
  }, [form, mode]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!hydrated) {
      return;
    }
    setLoading(true);
    setFeedback(null);

    const email = form.email.trim().toLowerCase();
    const password = form.password.trim();

    if (!email || !email.includes("@")) {
      setFeedback({ type: "error", message: "Please provide a valid email address." });
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setFeedback({
        type: "error",
        message: "Password must be at least 6 characters long.",
      });
      setLoading(false);
      return;
    }

    if (mode === "signup") {
      if (password !== form.confirmPassword.trim()) {
        setFeedback({ type: "error", message: "Passwords do not match." });
        setLoading(false);
        return;
      }

      if (!form.name.trim()) {
        setFeedback({ type: "error", message: "Please add your name so we can personalize things." });
        setLoading(false);
        return;
      }

      const emailTaken = users.some(
        (candidate) => candidate.email.toLowerCase() === email,
      );
      if (emailTaken) {
        setFeedback({
          type: "error",
          message: "An account with this email already exists. Try logging in instead.",
        });
        setLoading(false);
        return;
      }

      const newUser: StoredUser = {
        id: createId(),
        name: form.name.trim(),
        email,
        password,
        createdAt: Date.now(),
      };
      const updated = [...users, newUser];
      try {
        window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
        window.localStorage.setItem(ACTIVE_USER_STORAGE_KEY, newUser.id);
      } catch {
        setFeedback({
          type: "error",
          message: "Unable to save account details in your browser.",
        });
        setLoading(false);
        return;
      }

      setUsers(updated);
      setCurrentUser(newUser);
      setFeedback({
        type: "success",
        message: `Welcome aboard, ${newUser.name}! Your account lives safely in this browser.`,
      });
      setForm(defaultForm);
      setMode("login");
      setLoading(false);
      return;
    }

    const matchingUser =
      users.find(
        (candidate) =>
          candidate.email.toLowerCase() === email && candidate.password === password,
      ) ?? null;

    if (!matchingUser) {
      setFeedback({
        type: "error",
        message: "We could not find that email and password combo. Try again or create an account.",
      });
      setLoading(false);
      return;
    }

    try {
      window.localStorage.setItem(ACTIVE_USER_STORAGE_KEY, matchingUser.id);
    } catch {
      setFeedback({
        type: "error",
        message: "We could not complete the sign-in flow. Try again in a moment.",
      });
      setLoading(false);
      return;
    }

    setCurrentUser(matchingUser);
    setFeedback({
      type: "success",
      message: `Signed in as ${matchingUser.name}. You are ready to split costs.`,
    });
    setForm(defaultForm);
    setLoading(false);
  };

  const handleLogout = () => {
    if (!hydrated || !currentUser) return;
    window.localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
    setCurrentUser(null);
    setFeedback({
      type: "success",
      message: "You have been signed out on this device.",
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 pb-12 sm:p-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 transition hover:text-emerald-500"
      >
        ← Back to expense splitter
      </Link>

      <div className="rounded-3xl border border-gray-200 bg-white shadow-lg shadow-emerald-100/60">
        <div className="grid gap-6 p-6 sm:grid-cols-[1.2fr,1fr] sm:p-10">
          <section className="space-y-4">
            <div>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Splitysplit Accounts
              </span>
              <h1 className="mt-3 text-2xl font-bold text-slate-900">
                {mode === "signup" ? "Create your account" : "Log in to Splitysplit"}
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Accounts live entirely in your browser. We use them to personalize your events and
                make sharing simpler—no server required.
              </p>
            </div>

            {currentUser ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <p className="font-medium">Signed in as {currentUser.name}</p>
                <p className="text-emerald-600/80">
                  {currentUser.email} · Member since{" "}
                  {new Date(currentUser.createdAt).toLocaleDateString()}
                </p>
                <button
                  type="button"
                  className="mt-3 rounded-lg border border-emerald-500 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-500 hover:text-white"
                  onClick={handleLogout}
                >
                  Log out on this device
                </button>
              </div>
            ) : (
              <p className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/60 px-4 py-3 text-sm text-emerald-700">
                Not signed in yet. Create an account below or jump back to the app—your data still
                stays offline.
              </p>
            )}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
              <p className="font-semibold text-slate-700">Good to know:</p>
              <ul className="mt-2 space-y-1">
                <li>• Credentials are stored locally and never leave this device.</li>
                <li>• Clearing your browser storage will remove accounts and sign-in state.</li>
                <li>• You can create multiple accounts to plan trips for friends or teams.</li>
              </ul>
            </div>
          </section>

          <section className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-gray-50/70 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                {mode === "signup" ? "Start from scratch" : "Welcome back"}
              </h2>
              <button
                type="button"
                className="text-sm font-medium text-emerald-600 underline-offset-4 hover:underline"
                onClick={() => {
                  setMode(mode === "signup" ? "login" : "signup");
                  setForm(defaultForm);
                }}
              >
                {mode === "signup" ? "Prefer to log in?" : "Need an account?"}
              </button>
            </div>

            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              {mode === "signup" && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-600" htmlFor="name">
                    Full name
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    value={form.name}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, name: event.target.value }))
                    }
                    placeholder="Avery Chen"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-600" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  value={form.email}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, email: event.target.value }))
                  }
                  placeholder="you@example.com"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-600" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  value={form.password}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, password: event.target.value }))
                  }
                  placeholder="At least 6 characters"
                />
              </div>

              {mode === "signup" && (
                <div className="flex flex-col gap-1">
                  <label
                    className="text-xs font-semibold uppercase tracking-wide text-slate-600"
                    htmlFor="confirm-password"
                  >
                    Confirm password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    value={form.confirmPassword}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        confirmPassword: event.target.value,
                      }))
                    }
                    placeholder="Repeat password"
                  />
                </div>
              )}

              {feedback && (
                <p
                  className={`rounded-lg px-3 py-2 text-sm ${
                    feedback.type === "error"
                      ? "border border-rose-200 bg-rose-50 text-rose-600"
                      : "border border-emerald-200 bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {feedback.message}
                </p>
              )}

              <button
                type="submit"
                disabled={!formIsValid || loading}
                className="mt-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 hover:bg-emerald-400"
              >
                {loading
                  ? "Please wait..."
                  : mode === "signup"
                    ? "Create account"
                    : "Log in"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
