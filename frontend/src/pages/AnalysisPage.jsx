import { motion } from "framer-motion";
import { Bot, Sparkles, Waves } from "lucide-react";

import { GlassCard } from "../components/GlassCard";
import { ShimmerBlock } from "../components/ShimmerBlock";
import { StepProgress } from "../components/StepProgress";

export function AnalysisPage({ steps, activeIndex, progress, messages }) {
  return (
    <div className="pb-10">
      <div className="lg:grid lg:grid-cols-[0.88fr_1.12fr] lg:gap-6">
        <div>
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Back</span>
            <div className="flex items-center gap-2">
              {steps.map((step, index) => (
                <span
                  key={step.id}
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                    index === activeIndex ? "accent-lime text-[#0b2712]" : "bg-[#f3f3f1]"
                  }`}
                >
                  {index + 1}
                </span>
              ))}
            </div>
            <span>{Math.round(progress)}%</span>
          </div>

          <h1 className="mt-8 text-[48px] font-semibold leading-[0.95] tracking-tight text-[#111322] md:text-[56px]">
            Good bye
            <br />
            static paths
          </h1>

          <GlassCard className="editor-illustration mt-6 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Live analysis</p>
                <p className="mt-3 max-w-[220px] text-sm leading-6 text-slate-500">
                  We are merging academic signals, social context, and location cues into one study plan.
                </p>
              </div>
              <div className="accent-cyan flex h-12 w-12 items-center justify-center rounded-[18px]">
                <Bot size={20} className="text-[#082033]" />
              </div>
            </div>

            <div className="mt-8 flex items-end justify-between">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border border-[#111322] bg-white">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="accent-lime flex h-16 w-16 items-center justify-center rounded-full"
                >
                  <Sparkles size={22} className="text-[#0b2712]" />
                </motion.div>
              </div>
              <div className="w-28">
                <p className="text-[32px] font-semibold leading-none tracking-tight text-[#111322]">{Math.round(progress)}%</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">plan loading</p>
              </div>
            </div>
          </GlassCard>

          <div className="mt-6 h-3 rounded-full bg-[#f0f0ed]">
            <motion.div
              className="h-full rounded-full accent-cyan"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            />
          </div>
        </div>

        <div className="mt-6 space-y-4 lg:mt-0">
          <GlassCard className="p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#111322]">
            <Waves size={16} />
            <span>Streaming console</span>
          </div>
          <div className="space-y-3">
            {messages.map((message, index) => (
              <motion.div
                key={`${message}-${index}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[22px] bg-[#f7f7f5] px-4 py-4 text-sm leading-6 text-slate-600"
              >
                {message}
              </motion.div>
            ))}
            <div className="rounded-[22px] bg-[#eefcf0] p-4">
              <div className="space-y-3">
                <ShimmerBlock className="h-3 w-full" />
                <ShimmerBlock className="h-3 w-4/5" />
                <ShimmerBlock className="h-3 w-3/5" />
              </div>
            </div>
          </div>
          </GlassCard>

          <GlassCard className="p-5">
            <h2 className="text-[28px] font-semibold leading-none tracking-tight text-[#111322]">Pipeline</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Base modules arrive first so the plan can open before deeper lessons finish caching.
            </p>
            <div className="mt-5">
              <StepProgress steps={steps} activeIndex={activeIndex} />
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
