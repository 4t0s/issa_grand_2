import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Brain, NotebookPen, Radar, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { GlassCard } from "../components/GlassCard";

const defaultSubjects = ["Mathematics", "Physics", "Chemistry", "Biology", "History", "Language Arts"];

const steps = [
  {
    key: "grades",
    title: "Tell us your grades",
    helper: "Capture a clean academic snapshot so the planner can see the real baseline.",
    icon: NotebookPen,
  },
  {
    key: "signals",
    title: "Strongest and weakest",
    helper: "Point to the confident subject and the place that needs extra care first.",
    icon: Brain,
  },
  {
    key: "interests",
    title: "What keeps you curious?",
    helper: "A few interests help the plan feel motivating instead of generic.",
    icon: Radar,
  },
];

function normalizeDraft(draft) {
  return {
    name: draft.name.trim() || "Student",
    grades: draft.grades.map((entry) => ({
      subject: entry.subject,
      grade: Number(entry.grade || 0),
    })),
    strongest_subject: draft.strongest_subject,
    weakest_subject: draft.weakest_subject,
    interests: draft.interests
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  };
}

export function ProfilePage({ onSubmit, submitting, errorMessage }) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState({
    name: "",
    grades: defaultSubjects.map((subject) => ({ subject, grade: 78 })),
    strongest_subject: "Mathematics",
    weakest_subject: "Physics",
    interests: "robotics, exam prep",
  });

  const currentStep = steps[step];
  const CurrentIcon = currentStep.icon;
  const sortedGrades = useMemo(
    () => [...draft.grades].sort((left, right) => Number(right.grade) - Number(left.grade)),
    [draft.grades],
  );

  function updateGrade(subject, grade) {
    setDraft((current) => ({
      ...current,
      grades: current.grades.map((entry) => (entry.subject === subject ? { ...entry, grade } : entry)),
    }));
  }

  function advance() {
    if (step < steps.length - 1) {
      setStep((current) => current + 1);
      return;
    }

    onSubmit(normalizeDraft(draft));
  }

  function goBack() {
    if (step > 0) {
      setStep((current) => current - 1);
    }
  }

  return (
    <div className="pb-10">
      <div className="lg:grid lg:grid-cols-[0.88fr_1.12fr] lg:gap-6">
        <div>
          <div className="flex items-center justify-between text-sm text-slate-400">
            <button type="button" onClick={goBack} className="inline-flex items-center gap-1" disabled={step === 0}>
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="flex items-center gap-3">
              {steps.map((item, index) => (
                <span
                  key={item.key}
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                    index === step ? "accent-lime text-[#0b2712]" : "bg-[#f3f3f1] text-slate-400"
                  }`}
                >
                  {index + 1}
                </span>
              ))}
            </div>
            <span>{step === steps.length - 1 ? "Ready" : "Skip"}</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <h1 className="mt-8 text-[48px] font-semibold leading-[0.95] tracking-tight text-[#111322] md:text-[56px]">
              {currentStep.title}
            </h1>
            <p className="mt-4 max-w-[380px] text-sm leading-6 text-slate-500">{currentStep.helper}</p>
          </motion.div>

          <div className="mt-6 flex items-center gap-3 rounded-[24px] bg-[#f3f9ff] px-4 py-4">
            <div className="accent-cyan flex h-12 w-12 items-center justify-center rounded-[18px]">
              <CurrentIcon size={20} className="text-[#082033]" />
            </div>
            <p className="text-sm leading-6 text-slate-600">
              We keep this local, then blend it with location and community signals.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-1">
            <div className="soft-card rounded-[24px] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Highest</p>
              <p className="mt-3 text-lg font-semibold text-[#111322]">{sortedGrades[0]?.subject || "N/A"}</p>
            </div>
            <div className="soft-card rounded-[24px] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Lowest</p>
              <p className="mt-3 text-lg font-semibold text-[#111322]">{sortedGrades.at(-1)?.subject || "N/A"}</p>
            </div>
          </div>
        </div>

        <div>
          {errorMessage && (
            <div className="mt-4 rounded-[22px] bg-[#fff0f0] px-4 py-3 text-sm text-[#9f3b3b] lg:mt-0">{errorMessage}</div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.key}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.22 }}
              className="mt-6 lg:mt-0"
            >
          {step === 0 && (
            <div className="space-y-3">
              <GlassCard className="p-5">
                <label className="block">
                  <span className="text-sm text-slate-400">Student name</span>
                  <input
                    value={draft.name}
                    onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Amina"
                    className="mt-3 w-full rounded-[20px] border border-transparent bg-[#f7f7f5] px-4 py-4 text-[#111322] outline-none transition focus:border-[#55c2f6]"
                  />
                </label>
              </GlassCard>

              <div className="space-y-3">
                {draft.grades.map((entry) => (
                  <GlassCard key={entry.subject} className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-[#111322]">{entry.subject}</p>
                        <p className="text-xs text-slate-400">Current score</p>
                      </div>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={entry.grade}
                        onChange={(event) => updateGrade(entry.subject, event.target.value)}
                        className="w-24 rounded-full border border-transparent bg-[#f3f3f1] px-4 py-3 text-center text-sm font-semibold text-[#111322] outline-none transition focus:border-[#55c2f6]"
                      />
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <GlassCard className="p-5">
                <label className="block">
                  <span className="text-sm text-slate-400">Strongest subject</span>
                  <select
                    value={draft.strongest_subject}
                    onChange={(event) => setDraft((current) => ({ ...current, strongest_subject: event.target.value }))}
                    className="mt-3 w-full rounded-[20px] border border-transparent bg-[#f7f7f5] px-4 py-4 text-[#111322] outline-none transition focus:border-[#75eb78]"
                  >
                    {defaultSubjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </label>
              </GlassCard>

              <GlassCard className="p-5">
                <label className="block">
                  <span className="text-sm text-slate-400">Weakest subject</span>
                  <select
                    value={draft.weakest_subject}
                    onChange={(event) => setDraft((current) => ({ ...current, weakest_subject: event.target.value }))}
                    className="mt-3 w-full rounded-[20px] border border-transparent bg-[#f7f7f5] px-4 py-4 text-[#111322] outline-none transition focus:border-[#55c2f6]"
                  >
                    {defaultSubjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </label>
              </GlassCard>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <GlassCard className="p-5">
                <label className="block">
                  <span className="text-sm text-slate-400">Interests</span>
                  <textarea
                    rows="5"
                    value={draft.interests}
                    onChange={(event) => setDraft((current) => ({ ...current, interests: event.target.value }))}
                    className="mt-3 w-full rounded-[24px] border border-transparent bg-[#f7f7f5] px-4 py-4 text-[#111322] outline-none transition focus:border-[#55c2f6]"
                  />
                </label>
              </GlassCard>

              <div className="rounded-[26px] bg-[#eefcf0] p-5">
                <div className="flex items-center gap-3">
                  <div className="accent-lime flex h-10 w-10 items-center justify-center rounded-[16px]">
                    <Sparkles size={18} className="text-[#0b2712]" />
                  </div>
                  <p className="text-sm leading-6 text-slate-600">
                    Try short prompts like robotics, sustainability, astronomy, quick revision, lab work.
                  </p>
                </div>
              </div>
            </div>
          )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center gap-3">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0}
              className="flex-1 rounded-full bg-[#f3f3f1] px-5 py-4 text-sm font-semibold text-slate-500 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={advance}
              disabled={submitting}
              className="accent-cyan inline-flex flex-[1.4] items-center justify-center gap-2 rounded-full px-5 py-4 text-sm font-semibold text-[#082033] disabled:opacity-60"
            >
              {step === steps.length - 1 ? (submitting ? "Building..." : "Generate path") : "Continue"}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
