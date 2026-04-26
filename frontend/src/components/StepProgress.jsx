import { Check, LoaderCircle } from "lucide-react";

export function StepProgress({ steps, activeIndex }) {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => {
        const completed = index < activeIndex;
        const active = index === activeIndex;

        return (
          <div
            key={step.id}
            className={`rounded-[24px] px-4 py-4 transition ${
              completed
                ? "bg-[#eefcf0] shadow-[0_10px_22px_rgba(117,235,120,0.12)]"
                : active
                  ? "bg-[#eef8ff] shadow-[0_10px_22px_rgba(87,193,246,0.12)]"
                  : "soft-card"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  completed
                    ? "accent-lime text-[#0b2712]"
                    : active
                      ? "accent-cyan text-[#082033]"
                      : "bg-white text-slate-500 shadow-sm"
                }`}
              >
                {completed ? <Check size={16} /> : active ? <LoaderCircle size={16} className="animate-spin" /> : index + 1}
              </div>

              <div>
                <p className="text-sm font-semibold text-[#111322]">{step.label}</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">{step.helper}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
