import { useState } from "react";
import { Compass, FolderOpen, MapPinned, MessageSquareQuote, RefreshCcw } from "lucide-react";

import { LectureLibrary } from "../components/LectureLibrary";
import { LocalCasesWorkspace } from "../components/LocalCasesWorkspace";
import { UniversityCostMap } from "../components/UniversityCostMap";

const dashboardTabs = [
  { id: "lectures", label: "Lectures", icon: FolderOpen },
  { id: "map", label: "Area map", icon: MapPinned },
  { id: "cases", label: "Local cases", icon: MessageSquareQuote },
];

function DashboardTabButton({ active, icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium transition ${
        active ? "bg-[#111322] text-white" : "bg-[#f3f4f6] text-slate-500"
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );
}

export function DashboardPage({ sessionData, advancedReady, deferredQueue, onRestart }) {
  const [activeTab, setActiveTab] = useState("lectures");

  function renderTab() {
    if (activeTab === "map") {
      return <UniversityCostMap />;
    }

    if (activeTab === "cases") {
      return <LocalCasesWorkspace sessionData={sessionData} />;
    }

    return (
      <LectureLibrary
        sessionData={sessionData}
        deferredQueue={deferredQueue}
        advancedReady={advancedReady}
      />
    );
  }

  return (
    <div className="pb-10">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Learning workspace</p>
          <h2 className="mt-3 text-[40px] font-semibold leading-[0.95] tracking-tight text-[#111322]">
            {sessionData.profile.name}'s local learning hub
          </h2>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#eef8ff] px-4 py-3 text-[#27506d]">
              <Compass size={15} />
              {sessionData.location_context.region}
            </span>
            <span className="rounded-full bg-[#eefcf0] px-4 py-3 text-[#285b35]">
              {sessionData.learning_path.recommended_topics.length} guided topics
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111322] px-5 py-3 text-sm font-semibold text-white"
        >
          <RefreshCcw size={16} />
          Rebuild plan
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {dashboardTabs.map((tab) => (
          <DashboardTabButton
            key={tab.id}
            active={tab.id === activeTab}
            icon={tab.icon}
            label={tab.label}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </div>

      <div className="mt-6">{renderTab()}</div>
    </div>
  );
}
