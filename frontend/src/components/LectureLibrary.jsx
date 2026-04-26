import { useMemo, useState } from "react";
import { Clock3, Download, FolderOpen, PlayCircle, Sparkles } from "lucide-react";

import { GlassCard } from "./GlassCard";

const folderColors = ["#d9f4ff", "#ffeccf", "#eefcf0", "#ffe1e7"];

function buildLectureFolders(sessionData) {
  const modules = sessionData.learning_path.priority_modules || [];
  const topics = sessionData.learning_path.recommended_topics || [];

  return topics.slice(0, 4).map((topic, folderIndex) => {
    const matchedModules = modules.filter((module) => module.topic.toLowerCase() === topic.toLowerCase());
    const baseLectures = matchedModules.length ? matchedModules : modules.slice(0, 3);

    const lectures = baseLectures.map((module, lectureIndex) => ({
      id: `${topic}-${lectureIndex}`,
      title: lectureIndex === 0 ? module.title : `${topic} ${lectureIndex === 1 ? "Exam Drill" : "Explainer Session"}`,
      channel: lectureIndex === 0 ? "Adaptive Campus" : lectureIndex === 1 ? "Study Sprint" : "Local Lecture Hub",
      duration: lectureIndex === 0 ? "18:24" : lectureIndex === 1 ? "09:42" : "14:08",
      progress: lectureIndex === 0 ? 72 : lectureIndex === 1 ? 28 : 0,
      description: module.content,
      offlineReady: module.offline_ready,
      badge: lectureIndex === 0 ? "Core" : lectureIndex === 1 ? "Practice" : "Review",
    }));

    return {
      id: topic.toLowerCase().replace(/\s+/g, "-"),
      topic,
      subtitle: `${lectures.length} lectures`,
      accent: folderColors[folderIndex % folderColors.length],
      lectures,
    };
  });
}

function FolderButton({ folder, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[26px] p-4 text-left transition ${
        active ? "bg-[#111322] text-white shadow-[0_18px_28px_rgba(17,19,34,0.14)]" : "soft-card text-[#111322]"
      }`}
    >
      <div
        className="folder-card h-16 rounded-[18px]"
        style={{ background: active ? "linear-gradient(180deg,#bce9ff 0%,#7bd2ff 100%)" : undefined }}
      />
      <p className={`mt-4 text-sm font-semibold ${active ? "text-white" : "text-[#111322]"}`}>{folder.topic}</p>
      <p className={`mt-1 text-xs ${active ? "text-white/68" : "text-slate-400"}`}>{folder.subtitle}</p>
    </button>
  );
}

export function LectureLibrary({ sessionData, deferredQueue, advancedReady }) {
  const folders = useMemo(() => buildLectureFolders(sessionData), [sessionData]);
  const [activeFolderId, setActiveFolderId] = useState(folders[0]?.id || "");
  const activeFolder = folders.find((folder) => folder.id === activeFolderId) || folders[0];
  const playlistCount = activeFolder?.lectures.length || 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Lecture folders</p>
          <h2 className="mt-2 text-[34px] font-semibold leading-none tracking-tight text-[#111322]">Watch later</h2>
        </div>
        <div className="hidden items-center gap-2 rounded-full bg-[#eefcf0] px-4 py-3 text-sm font-medium text-[#285b35] md:inline-flex">
          <Download size={16} />
          <span>{advancedReady ? "Advanced lectures ready" : "Syncing advanced lectures"}</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {folders.map((folder) => (
          <FolderButton
            key={folder.id}
            folder={folder}
            active={folder.id === activeFolder.id}
            onClick={() => setActiveFolderId(folder.id)}
          />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
        <GlassCard className="overflow-hidden p-0">
          <div className="bg-[linear-gradient(135deg,#111322,#2b3047)] px-6 py-6 text-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/60">Playlist</p>
                <h3 className="mt-3 text-[30px] font-semibold leading-[1.05] tracking-tight">{activeFolder.topic}</h3>
              </div>
              <div className="rounded-full bg-white/10 p-3">
                <PlayCircle size={18} />
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[24px] bg-white/8 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-white/60">Saved lectures</p>
                <p className="mt-3 text-[26px] font-semibold leading-none">{playlistCount}</p>
              </div>
              <div className="rounded-[24px] bg-white/8 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-white/60">Offline queue</p>
                <p className="mt-3 text-[26px] font-semibold leading-none">{deferredQueue.length}</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-5">
            <div className="flex items-center gap-3 rounded-[24px] bg-[#f7f7f5] p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#d9f4ff]">
                <FolderOpen size={18} className="text-[#1b4f68]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#111322]">This folder works like a watch later list</p>
                <p className="mt-1 text-sm text-slate-500">Open a topic folder, skim the playlist, then continue where you left off.</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {activeFolder.lectures.map((lecture, index) => (
                <div key={lecture.id} className="rounded-[24px] bg-[#f7f7f5] p-4">
                  <div className="flex gap-4">
                    <div
                      className="flex h-24 w-36 shrink-0 items-end justify-between rounded-[20px] p-4"
                      style={{
                        background:
                          index % 3 === 0
                            ? "linear-gradient(135deg,#dcefff,#f7f7f5)"
                            : index % 3 === 1
                              ? "linear-gradient(135deg,#ffe6d7,#fff7ef)"
                              : "linear-gradient(135deg,#e5f9e7,#f8fcf8)",
                      }}
                    >
                      <PlayCircle size={26} className="text-[#111322]" />
                      <span className="rounded-full bg-black/80 px-2 py-1 text-[11px] font-semibold text-white">
                        {lecture.duration}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#111322]">{lecture.title}</p>
                          <p className="mt-1 text-sm text-slate-400">{lecture.channel}</p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 shadow-[0_8px_18px_rgba(17,19,34,0.04)]">
                          {lecture.badge}
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-slate-500">{lecture.description}</p>

                      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <Clock3 size={14} />
                          {lecture.duration}
                        </span>
                        <span className={`rounded-full px-3 py-1.5 font-semibold ${lecture.offlineReady ? "bg-[#eefcf0] text-[#285b35]" : "bg-[#fff2df] text-[#8a6430]"}`}>
                          {lecture.offlineReady ? "Offline ready" : "Streaming only"}
                        </span>
                      </div>

                      <div className="mt-4 h-2 rounded-full bg-white">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#57c1f6,#8df58e)]"
                          style={{ width: `${lecture.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        <div className="space-y-5">
          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-[#ffe9ee]">
                <Sparkles size={18} className="text-[#b03f5a]" />
              </div>
              <div>
                <h3 className="text-[28px] font-semibold leading-none tracking-tight text-[#111322]">Suggested next</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">Use the folder list to jump by topic, then continue with the saved queue below.</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {deferredQueue.slice(0, 4).map((item, index) => (
                <div key={`${item.title}-${index}`} className="rounded-[22px] bg-[#f7f7f5] px-4 py-4">
                  <p className="text-sm font-semibold text-[#111322]">{item.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">{item.topic}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <h3 className="text-[28px] font-semibold leading-none tracking-tight text-[#111322]">Folder summary</h3>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {folders.map((folder, index) => (
                <div key={folder.id} className="rounded-[22px] p-4" style={{ background: folder.accent }}>
                  <p className="text-sm font-semibold text-[#111322]">{folder.topic}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500">{folder.lectures.length} lectures</p>
                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    {index === 0 ? "Start here first." : index === 1 ? "Good for rehearsal." : "Keep as backup."}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
