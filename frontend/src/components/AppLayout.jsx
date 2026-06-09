import { BookOpenText, LayoutDashboard, LogOut, Scale } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../state/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/mapper", label: "IPC-BNS Mapper", icon: BookOpenText },
];

export default function AppLayout({ children }) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded bg-ink text-white">
              <Scale size={20} />
            </span>
            <div>
              <div className="text-base font-semibold text-ink">LegalLens</div>
              <div className="text-xs text-slate-500">{user?.email}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="focus-ring inline-flex h-10 items-center gap-2 rounded border border-slate-300 px-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
            title="Log out"
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 md:grid-cols-[220px_1fr]">
        <aside className="md:sticky md:top-6 md:h-[calc(100vh-3rem)]">
          <nav className="flex gap-2 md:flex-col">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      "focus-ring inline-flex h-11 items-center gap-3 rounded px-3 text-sm font-medium",
                      isActive
                        ? "bg-teal text-white"
                        : "text-slate-700 hover:bg-white hover:text-ink",
                    ].join(" ")
                  }
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>
        <section>{children}</section>
      </div>
    </main>
  );
}
