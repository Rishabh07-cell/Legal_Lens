import { useEffect, useState } from "react";
import { Clock, Search } from "lucide-react";
import { Link } from "react-router-dom";

import { api, getApiError } from "../api/client";
import AppLayout from "../components/AppLayout";
import { useAuth } from "../state/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const response = await api.get("/history");
        setHistory(response.data.history);
      } catch (apiError) {
        setError(getApiError(apiError));
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-normal text-ink">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">Welcome back, {user?.name}.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/mapper"
          className="focus-ring block rounded border border-slate-200 bg-white p-5 shadow-panel hover:border-teal"
        >
          <Search className="text-teal" size={24} />
          <h2 className="mt-4 text-lg font-semibold text-ink">Start IPC-BNS lookup</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Search by IPC section, BNS section, or title.</p>
        </Link>
        <div className="rounded border border-slate-200 bg-white p-5 shadow-panel">
          <Clock className="text-saffron" size={24} />
          <h2 className="mt-4 text-lg font-semibold text-ink">Recent activity</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {history.length} saved lookup{history.length === 1 ? "" : "s"} in your current account.
          </p>
        </div>
      </div>

      <section className="mt-6 rounded border border-slate-200 bg-white shadow-panel">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-ink">Query History</h2>
        </div>
        {loading ? (
          <p className="p-5 text-sm text-slate-600">Loading history...</p>
        ) : error ? (
          <p className="m-5 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
        ) : history.length === 0 ? (
          <p className="p-5 text-sm text-slate-600">No lookups yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Query</th>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Results</th>
                  <th className="px-5 py-3 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((item) => (
                  <tr key={item.id}>
                    <td className="px-5 py-3 font-medium text-ink">{item.query_text}</td>
                    <td className="px-5 py-3 text-slate-600">{item.query_type}</td>
                    <td className="px-5 py-3 text-slate-600">{item.result_count}</td>
                    <td className="px-5 py-3 text-slate-600">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AppLayout>
  );
}
