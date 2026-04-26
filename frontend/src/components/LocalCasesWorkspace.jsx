import { useEffect, useMemo, useState } from "react";
import { FileUp, Link2, NotebookPen, Save, SendHorizontal } from "lucide-react";

import { GlassCard } from "./GlassCard";

const STORAGE_KEY = "adaptive-local-cases-drafts";

function buildCases(sessionData) {
  const weakest = sessionData.profile.weakest_subject;
  const region = sessionData.location_context.region;

  return [
    {
      id: "budget-case",
      title: `Budget plan for studying ${weakest}`,
      prompt: `You have a first-year student moving into ${region}. Build a realistic monthly plan that protects time for ${weakest} practice while keeping living costs manageable.`,
      outcome: "Budget spreadsheet, short rationale, or written study/living plan.",
    },
    {
      id: "university-case",
      title: "Choose the strongest study city",
      prompt: "Compare the mapped university areas and explain which area is best for a student who needs academic support, stable costs, and access to good campuses.",
      outcome: "Essay, bullet recommendation, slide outline, or uploaded document.",
    },
    {
      id: "community-case",
      title: "Solve a local study challenge",
      prompt: "Design a local intervention for students who struggle to stay consistent offline. Use regional constraints, campus access, and course priority modules in your answer.",
      outcome: "Case memo, action checklist, voice transcript, PDF, or annotated file.",
    },
  ];
}

function readStoredDrafts() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function LocalCasesWorkspace({ sessionData }) {
  const cases = useMemo(() => buildCases(sessionData), [sessionData]);
  const [selectedCaseId, setSelectedCaseId] = useState(cases[0]?.id || "");
  const [drafts, setDrafts] = useState(() => readStoredDrafts());
  const [savedStamp, setSavedStamp] = useState("");

  const selectedCase = cases.find((caseItem) => caseItem.id === selectedCaseId) || cases[0];
  const draft = drafts[selectedCase.id] || {
    format: "structured",
    response: "",
    supportLink: "",
    files: [],
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  }, [drafts]);

  function updateDraft(patch) {
    setDrafts((current) => ({
      ...current,
      [selectedCase.id]: {
        ...draft,
        ...patch,
      },
    }));
  }

  function handleFiles(event) {
    const nextFiles = Array.from(event.target.files || []).map((file) => ({
      name: file.name,
      size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      type: file.type || "file",
    }));
    updateDraft({ files: nextFiles });
  }

  function saveDraft() {
    updateDraft({ response: draft.response });
    setSavedStamp(`Saved ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Local cases</p>
          <h2 className="mt-2 text-[34px] font-semibold leading-none tracking-tight text-[#111322]">Solve and submit</h2>
        </div>
        <div className="rounded-full bg-[#eef8ff] px-4 py-3 text-sm font-medium text-[#27506d]">
          Any format: text, link, or file
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.88fr_1.12fr]">
        <div className="space-y-3">
          {cases.map((caseItem) => {
            const active = caseItem.id === selectedCase.id;
            return (
              <button
                key={caseItem.id}
                type="button"
                onClick={() => setSelectedCaseId(caseItem.id)}
                className={`w-full rounded-[28px] p-5 text-left transition ${
                  active ? "bg-[#111322] text-white shadow-[0_18px_28px_rgba(17,19,34,0.14)]" : "glass-panel text-[#111322]"
                }`}
              >
                <p className={`text-xs uppercase tracking-[0.18em] ${active ? "text-white/60" : "text-slate-400"}`}>Case prompt</p>
                <h3 className="mt-3 text-[26px] font-semibold leading-[1.05] tracking-tight">{caseItem.title}</h3>
                <p className={`mt-4 text-sm leading-6 ${active ? "text-white/72" : "text-slate-500"}`}>{caseItem.prompt}</p>
              </button>
            );
          })}
        </div>

        <GlassCard className="p-5 md:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Selected case</p>
              <h3 className="mt-3 text-[30px] font-semibold leading-[1.05] tracking-tight text-[#111322]">{selectedCase.title}</h3>
            </div>
            <div className="rounded-full bg-[#f3f4f6] p-3">
              <NotebookPen size={18} className="text-slate-600" />
            </div>
          </div>

          <div className="mt-5 rounded-[24px] bg-[#f7f7f5] p-4">
            <p className="text-sm leading-7 text-slate-600">{selectedCase.prompt}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.16em] text-slate-400">Accepted outcome</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">{selectedCase.outcome}</p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {[
              { id: "structured", label: "Structured text" },
              { id: "bullet", label: "Bullet plan" },
              { id: "markdown", label: "Markdown" },
              { id: "upload", label: "Upload only" },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => updateDraft({ format: option.id })}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] ${
                  draft.format === option.id ? "bg-[#111322] text-white" : "bg-[#f3f4f6] text-slate-500"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="mt-5 space-y-4">
            {draft.format !== "upload" && (
              <textarea
                rows="10"
                value={draft.response}
                onChange={(event) => updateDraft({ response: event.target.value })}
                placeholder="Write the solution in the format that makes sense for you."
                className="w-full rounded-[26px] border border-transparent bg-[#f7f7f5] px-4 py-4 text-[#111322] outline-none transition focus:border-[#55c2f6]"
              />
            )}

            <div className="grid gap-4 md:grid-cols-[1fr_auto]">
              <label className="block">
                <span className="inline-flex items-center gap-2 text-sm text-slate-400">
                  <Link2 size={15} />
                  Supporting link
                </span>
                <input
                  value={draft.supportLink}
                  onChange={(event) => updateDraft({ supportLink: event.target.value })}
                  placeholder="Paste a document link, slide deck, or shared note"
                  className="mt-3 w-full rounded-[20px] border border-transparent bg-[#f7f7f5] px-4 py-4 text-[#111322] outline-none transition focus:border-[#55c2f6]"
                />
              </label>

              <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[22px] bg-[#eefcf0] px-5 py-4 text-sm font-semibold text-[#285b35]">
                <FileUp size={16} />
                <span>Upload file</span>
                <input type="file" multiple className="hidden" onChange={handleFiles} />
              </label>
            </div>

            <div className="rounded-[24px] bg-[#f7f7f5] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Attached files</p>
              <div className="mt-3 space-y-2">
                {draft.files.length ? (
                  draft.files.map((file) => (
                    <div key={file.name} className="flex items-center justify-between rounded-[18px] bg-white px-4 py-3 text-sm shadow-[0_8px_18px_rgba(17,19,34,0.04)]">
                      <span className="font-medium text-[#111322]">{file.name}</span>
                      <span className="text-slate-400">{file.size}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No files attached yet. You can submit plain text, links, or uploads.</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={saveDraft}
              className="inline-flex items-center gap-2 rounded-full bg-[#111322] px-5 py-3 text-sm font-semibold text-white"
            >
              <Save size={16} />
              Save draft
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-[#eef8ff] px-5 py-3 text-sm font-semibold text-[#27506d]"
            >
              <SendHorizontal size={16} />
              Ready to submit
            </button>
            {savedStamp && <span className="text-sm text-slate-400">{savedStamp}</span>}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
