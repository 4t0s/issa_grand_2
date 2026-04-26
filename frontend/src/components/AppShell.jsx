import { motion } from "framer-motion";
import { Home, RefreshCcw } from "lucide-react";

export function AppShell({ screen, cachedSessionAvailable, onHome, children }) {
  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#111322]">
      <div className="mx-auto max-w-[1240px] px-0 sm:px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="app-stage relative min-h-screen overflow-hidden sm:my-4 sm:min-h-[calc(100vh-2rem)] sm:rounded-[28px] md:my-6 md:rounded-[36px]"
        >
          <div className="hidden items-center justify-between border-b border-black/5 px-8 py-6 md:flex lg:px-10">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Context-Aware Learning</p>
              <h1 className="mt-2 text-[28px] font-semibold leading-none tracking-tight text-[#111322]">
                {cachedSessionAvailable ? "Your adaptive workspace" : "A bright adaptive learning workspace"}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onHome}
                className="inline-flex items-center gap-2 rounded-full bg-[#f3f3f1] px-4 py-3 text-sm font-medium text-slate-500"
              >
                <Home size={16} />
                <span>Home</span>
              </button>

              <div className="inline-flex items-center gap-2 rounded-full bg-[#111322] px-4 py-3 text-sm font-medium text-white">
                <RefreshCcw size={14} />
                <span>{screen === "dashboard" ? "Session active" : "In progress"}</span>
              </button>
            </div>
          </div>

          <div className="hide-scrollbar px-5 py-6 pb-28 md:px-8 md:py-8 md:pb-10 lg:px-10">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}
