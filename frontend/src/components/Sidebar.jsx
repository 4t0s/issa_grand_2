import { Bot, Compass, GraduationCap, Home, LayoutDashboard } from "lucide-react";

const items = [
  { key: "landing", label: "Launch", icon: Home },
  { key: "profile", label: "Profile", icon: GraduationCap },
  { key: "analysis", label: "Analysis", icon: Bot },
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export function Sidebar({ activeScreen, cachedSessionAvailable, onHome }) {
  return (
    <aside className="hidden w-72 flex-col border-r border-white/6 bg-black/20 px-6 py-8 lg:flex">
      <button
        type="button"
        onClick={onHome}
        className="mb-8 rounded-2xl border border-white/8 bg-white/4 p-4 text-left transition hover:border-cyan-300/25 hover:bg-white/8"
      >
        <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/70">Adaptive Engine</p>
        <h1 className="mt-2 text-lg font-semibold text-white">Context-Aware Learning</h1>
        <p className="mt-2 text-sm text-slate-300/72">
          Offline-first planning tuned by profile, location, and social momentum.
        </p>
      </button>

      <div className="space-y-2">
        {items.map(({ key, label, icon: Icon }) => {
          const isActive = activeScreen === key;
          return (
            <div
              key={key}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                isActive
                  ? "border-cyan-300/28 bg-cyan-400/10 text-white"
                  : "border-white/5 bg-white/[0.03] text-slate-300/72"
              }`}
            >
              <Icon size={18} className={isActive ? "text-cyan-200" : "text-slate-400"} />
              <span>{label}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-auto rounded-3xl border border-violet-300/12 bg-violet-400/8 p-4">
        <div className="flex items-center gap-2 text-sm text-violet-100">
          <Compass size={16} className="text-violet-200" />
          <span>Offline cache</span>
        </div>
        <p className="mt-2 text-sm text-slate-300/75">
          {cachedSessionAvailable
            ? "A previous learning session is ready to resume locally."
            : "No cached session yet. The first generated plan will be stored for offline review."}
        </p>
      </div>
    </aside>
  );
}

