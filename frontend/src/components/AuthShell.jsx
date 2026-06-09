import { Scale } from "lucide-react";

export default function AuthShell({ title, subtitle, children }) {
  return (
    <main className="grid min-h-screen bg-stone-50 lg:grid-cols-[1fr_1.1fr]">
      <section className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded bg-ink text-white">
              <Scale size={22} />
            </span>
            <span className="text-xl font-semibold text-ink">LegalLens</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-normal text-ink">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </section>
      <section className="hidden bg-ink px-10 py-12 text-white lg:block">
        <div className="flex h-full flex-col justify-between">
          <div>
            <div className="text-sm font-medium uppercase tracking-widest text-amber-300">
              Phase 1
            </div>
            <h2 className="mt-5 max-w-xl text-5xl font-semibold leading-tight tracking-normal">
              A lean workspace for IPC to BNS section mapping.
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-slate-200">
            <div className="border border-white/15 p-5">
              <div className="text-2xl font-semibold text-white">REST</div>
              <p className="mt-2 leading-6">Flask API with JWT-protected endpoints.</p>
            </div>
            <div className="border border-white/15 p-5">
              <div className="text-2xl font-semibold text-white">SQLite</div>
              <p className="mt-2 leading-6">Simple local persistence for users and queries.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
