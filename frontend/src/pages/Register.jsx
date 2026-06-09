import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthShell from "../components/AuthShell";
import { getApiError } from "../api/client";
import { useAuth } from "../state/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await register(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch (apiError) {
      setError(getApiError(apiError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell title="Create account" subtitle="Set up a local account for authenticated section lookup.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Name</span>
          <input
            className="focus-ring mt-2 h-11 w-full rounded border border-slate-300 bg-white px-3 text-sm"
            name="name"
            value={form.name}
            onChange={updateField}
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            className="focus-ring mt-2 h-11 w-full rounded border border-slate-300 bg-white px-3 text-sm"
            name="email"
            type="email"
            value={form.email}
            onChange={updateField}
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input
            className="focus-ring mt-2 h-11 w-full rounded border border-slate-300 bg-white px-3 text-sm"
            name="password"
            type="password"
            minLength={8}
            value={form.password}
            onChange={updateField}
            required
          />
        </label>
        {error ? <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        <button
          type="submit"
          disabled={submitting}
          className="focus-ring h-11 w-full rounded bg-teal px-4 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-sm text-slate-600">
        Already registered?{" "}
        <Link className="font-semibold text-teal hover:text-teal-700" to="/login">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
