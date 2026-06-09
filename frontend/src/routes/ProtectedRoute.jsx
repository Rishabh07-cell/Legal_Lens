import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../state/AuthContext";

export default function ProtectedRoute() {
  const { loading, token } = useAuth();

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-stone-50 text-sm text-slate-600">
        Loading LegalLens...
      </main>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
