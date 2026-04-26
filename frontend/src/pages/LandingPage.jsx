import { motion } from "framer-motion";
import { ArrowRight, BookOpenText, Download, Sparkles, WandSparkles } from "lucide-react";

import { GlassCard } from "../components/GlassCard";

const quickCards = [
  { label: "Profile signals", value: "6 subjects", color: "accent-cyan" },
  { label: "Offline kit", value: "Ready local", color: "accent-lime" },
];

export function LandingPage({ onStart, onResume, cachedSessionAvailable }) {
  return (
    <div className="pb-8 lg:grid lg:grid-cols-[1.02fr_0.98fr] lg:gap-6">
      <div>
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-full bg-[linear-gradient(135deg,#ccecff,#f7f7f5)] p-1">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
              <BookOpenText size={18} className="text-[#111322]" />
            </div>
          </div>
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f3f1] text-xl text-slate-500">
            ...
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p className="mt-8 text-sm text-slate-400">Keep your information in our app.</p>
          <h1 className="mt-2 text-[52px] font-semibold leading-[0.92] tracking-tight text-[#111322] md:text-[66px]">
            Hello,
            <br />
            Learner
          </h1>
          <p className="mt-5 max-w-[460px] text-sm leading-7 text-slate-500 md:text-base">
            Context-aware adaptive planning, social learning signals, and offline study packs in one calm workspace.
          </p>
        </motion.div>

        <div className="mt-7 flex gap-3">
          <button
            type="button"
            onClick={onStart}
            className="accent-cyan inline-flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-4 text-sm font-semibold text-[#082033]"
          >
            Start profile
            <ArrowRight size={16} />
          </button>
          <button
            type="button"
            onClick={cachedSessionAvailable ? onResume : onStart}
            className="accent-lime inline-flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-4 text-sm font-semibold text-[#0b2712]"
          >
            {cachedSessionAvailable ? "Resume" : "Continue"}
          </button>
        </div>

        <GlassCard className="mt-5 p-5">
          <div className="flex items-start gap-4">
            <div className="accent-lime flex h-12 w-12 items-center justify-center rounded-[18px]">
              <Download size={18} className="text-[#0b2712]" />
            </div>
            <div>
              <h2 className="text-[28px] font-semibold leading-none tracking-tight text-[#111322]">Offline first</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Core modules land first, advanced study blocks continue syncing in the background.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="mt-6 lg:mt-0">
        <GlassCard className="editor-illustration overflow-hidden p-6 md:p-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Adaptive engine</p>
              <p className="mt-3 max-w-[220px] text-sm leading-6 text-slate-500">
                Build a local-first study path using grades, interests, community pulse, and place-based context.
              </p>
            </div>
            <div className="rounded-full bg-[#f6fcff] p-3">
              <WandSparkles size={20} className="text-[#55c2f6]" />
            </div>
          </div>

          <div className="mt-8 flex items-end justify-between">
            <div className="relative rounded-[30px] border border-[#111322] p-6">
              <Sparkles size={22} className="absolute -right-3 -top-3 rounded-full bg-white p-1 text-[#8de78f]" />
              <BookOpenText size={54} className="text-[#111322]" />
            </div>
            <div className="folder-card h-28 w-28 rounded-[26px]" />
          </div>
        </GlassCard>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {quickCards.map((card) => (
            <div key={card.label} className="soft-card rounded-[26px] p-4">
              <div className={`h-2 w-12 rounded-full ${card.color}`} />
              <p className="mt-6 text-sm text-slate-400">{card.label}</p>
              <p className="mt-2 text-lg font-semibold text-[#111322]">{card.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
