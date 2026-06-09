import { useState } from "react";
import { Search } from "lucide-react";

import { api, getApiError } from "../api/client";
import AppLayout from "../components/AppLayout";

export default function IPCBNSMapper() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    setSearched(true);

    try {
      const response = await api.get("/ipc-bns", { params: { q: query } });
      setResults(response.data.results);
    } catch (apiError) {
      setResults([]);
      setError(getApiError(apiError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-normal text-ink">IPC-BNS Mapper</h1>
        <p className="mt-2 text-sm text-slate-600">Find equivalent sections by number or offence title.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded border border-slate-200 bg-white p-5 shadow-panel">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Search section or title</span>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input
              className="focus-ring h-11 flex-1 rounded border border-slate-300 bg-white px-3 text-sm"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Example: 420, murder, cheating"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded bg-teal px-5 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Search size={18} />
              <span>{loading ? "Searching..." : "Search"}</span>
            </button>
          </div>
        </label>
      </form>

      {error ? <p className="mt-5 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

      <section className="mt-6 rounded border border-slate-200 bg-white shadow-panel">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-ink">Results</h2>
        </div>
        {!searched ? (
          <p className="p-5 text-sm text-slate-600">Run a search to view mappings.</p>
        ) : loading ? (
          <p className="p-5 text-sm text-slate-600">Searching mappings...</p>
        ) : results.length === 0 ? (
          <p className="p-5 text-sm text-slate-600">No mappings found.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {results.map((item) => (
              <article key={item.id} className="grid gap-4 p-5 md:grid-cols-[1fr_1fr]">
                <div>
                  <div className="text-xs font-semibold uppercase text-slate-500">IPC Section</div>
                  <h3 className="mt-2 text-lg font-semibold text-ink">{item.ipc_section}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.ipc_title}</p>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase text-slate-500">BNS Section</div>
                  <h3 className="mt-2 text-lg font-semibold text-teal">{item.bns_section}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.bns_title}</p>
                  {item.notes ? <p className="mt-3 text-sm leading-6 text-slate-500">{item.notes}</p> : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </AppLayout>
  );
}
