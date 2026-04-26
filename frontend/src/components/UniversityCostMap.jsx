import { useMemo, useState } from "react";
import { MapPinned, Minus, Plus } from "lucide-react";

import { GlassCard } from "./GlassCard";

const areas = [
  {
    id: "astana",
    name: "Astana Capital Belt",
    costLabel: "High",
    monthlyCost: "$730 - $980 / month",
    tuitionNote: "Strong international programs and higher rent around the academic core.",
    color: "#ff7d8d",
    glow: "#ffb4bc",
    geometry: { top: "18%", left: "48%", size: 176 },
    universities: [
      { name: "Nazarbayev University", top: "29%", left: "58%" },
      { name: "L.N. Gumilyov ENU", top: "33%", left: "54%" },
      { name: "Astana IT University", top: "25%", left: "50%" },
    ],
  },
  {
    id: "karaganda",
    name: "Karaganda Study Basin",
    costLabel: "Balanced",
    monthlyCost: "$540 - $760 / month",
    tuitionNote: "Balanced living costs with strong technical and medical campuses.",
    color: "#ffb067",
    glow: "#ffd5a9",
    geometry: { top: "35%", left: "40%", size: 188 },
    universities: [
      { name: "Karaganda Buketov University", top: "52%", left: "48%" },
      { name: "Karaganda Technical University", top: "49%", left: "45%" },
      { name: "Medical University of Karaganda", top: "57%", left: "52%" },
    ],
  },
  {
    id: "shymkent",
    name: "Shymkent South Cluster",
    costLabel: "Moderate",
    monthlyCost: "$460 - $690 / month",
    tuitionNote: "Lower rent pressure with dense student neighborhoods and regional access.",
    color: "#ff9a8f",
    glow: "#ffd0c9",
    geometry: { top: "58%", left: "24%", size: 170 },
    universities: [
      { name: "South Kazakhstan University", top: "68%", left: "31%" },
      { name: "Shymkent University", top: "72%", left: "38%" },
      { name: "M. Auezov University", top: "63%", left: "28%" },
    ],
  },
  {
    id: "almaty",
    name: "Almaty Academic Ring",
    costLabel: "High",
    monthlyCost: "$690 - $940 / month",
    tuitionNote: "Premium urban costs, broadest campus choice, and dense research activity.",
    color: "#ff6e87",
    glow: "#ffb0bf",
    geometry: { top: "60%", left: "63%", size: 194 },
    universities: [
      { name: "Al-Farabi KazNU", top: "73%", left: "74%" },
      { name: "KIMEP University", top: "68%", left: "71%" },
      { name: "Satbayev University", top: "78%", left: "68%" },
    ],
  },
];

function IconButton({ onClick, disabled, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-black/6 bg-white text-slate-600 shadow-[0_10px_22px_rgba(17,19,34,0.08)] disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export function UniversityCostMap() {
  const [selectedAreaId, setSelectedAreaId] = useState("almaty");
  const [zoom, setZoom] = useState(1);

  const selectedArea = useMemo(
    () => areas.find((area) => area.id === selectedAreaId) || areas[0],
    [selectedAreaId],
  );

  function zoomIn() {
    setZoom((current) => Math.min(1.3, Number((current + 0.1).toFixed(2))));
  }

  function zoomOut() {
    setZoom((current) => Math.max(1, Number((current - 0.1).toFixed(2))));
  }

  return (
    <GlassCard className="p-5 md:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Student map</p>
          <h3 className="mt-2 text-[30px] font-semibold leading-none tracking-tight text-[#111322]">
            Cost of living by area
          </h3>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-[#f3f4f6] px-4 py-3 text-sm font-medium text-slate-600">
          <MapPinned size={16} />
          <span>Kazakhstan</span>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="map-surface relative h-[430px] overflow-hidden rounded-[30px] border border-black/6">
          <div
            className="absolute inset-0 transition-transform duration-300 ease-out"
            style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
          >
            <svg
              viewBox="0 0 800 520"
              className="absolute inset-0 h-full w-full text-slate-300/70"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M86 146C144 132 219 121 266 137C322 157 378 111 449 128C513 144 557 123 603 150C650 177 716 175 733 228C748 276 706 311 668 338C620 372 628 405 556 409C503 412 476 448 422 442C359 436 320 464 261 440C204 417 150 417 117 377C85 338 38 320 45 268C53 216 30 161 86 146Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path d="M104 192L693 192" stroke="currentColor" strokeWidth="1.2" strokeDasharray="6 10" />
              <path d="M92 262L720 262" stroke="currentColor" strokeWidth="1.2" strokeDasharray="6 10" />
              <path d="M138 337L669 337" stroke="currentColor" strokeWidth="1.2" strokeDasharray="6 10" />
              <path d="M196 146L196 406" stroke="currentColor" strokeWidth="1.2" strokeDasharray="6 10" />
              <path d="M386 132L386 428" stroke="currentColor" strokeWidth="1.2" strokeDasharray="6 10" />
              <path d="M574 144L574 402" stroke="currentColor" strokeWidth="1.2" strokeDasharray="6 10" />
            </svg>

            {areas.map((area) => {
              const selected = area.id === selectedArea.id;

              return (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => setSelectedAreaId(area.id)}
                  className="absolute border-0 bg-transparent p-0 text-left"
                  style={{
                    top: area.geometry.top,
                    left: area.geometry.left,
                    width: `${area.geometry.size}px`,
                    height: `${area.geometry.size}px`,
                    transform: "translate(-50%, -50%)",
                    color: area.color,
                  }}
                >
                  <span
                    className="map-glow"
                    style={{
                      inset: "20%",
                      background: area.glow,
                    }}
                  />
                  <span
                    className="map-sector"
                    style={{
                      inset: 0,
                      background: selected ? `${area.color}22` : `${area.color}14`,
                      opacity: selected ? 1 : 0.72,
                    }}
                  />
                  <span className="absolute left-1/2 top-[calc(100%+14px)] -translate-x-1/2 rounded-full bg-white/92 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 shadow-[0_10px_22px_rgba(17,19,34,0.08)]">
                    {area.costLabel}
                  </span>
                </button>
              );
            })}

            {areas.flatMap((area) =>
              area.universities.map((university) => {
                const active = area.id === selectedArea.id;

                return (
                  <button
                    key={university.name}
                    type="button"
                    onClick={() => setSelectedAreaId(area.id)}
                    className="map-university-dot absolute h-4 w-4 border-0 p-0"
                    style={{
                      top: university.top,
                      left: university.left,
                      transform: "translate(-50%, -50%)",
                      opacity: active ? 1 : 0.52,
                    }}
                    aria-label={university.name}
                  />
                );
              }),
            )}

            <div className="pointer-events-none absolute left-6 top-6 rounded-[24px] bg-white/92 px-4 py-3 shadow-[0_10px_22px_rgba(17,19,34,0.08)]">
              <p className="text-sm font-medium text-[#111322]">{selectedArea.name}</p>
            </div>
          </div>

          <div className="absolute bottom-6 right-6 flex flex-col gap-2">
            <IconButton onClick={zoomIn} disabled={zoom >= 1.3}>
              <Plus size={16} />
            </IconButton>
            <IconButton onClick={zoomOut} disabled={zoom <= 1}>
              <Minus size={16} />
            </IconButton>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[30px] bg-[linear-gradient(180deg,#fff6f7,#fffefe)] p-5 text-[#111322] shadow-[0_20px_34px_rgba(17,19,34,0.08)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Selected area</p>
                <h4 className="mt-3 text-[32px] font-semibold leading-[1.05] tracking-tight">{selectedArea.name}</h4>
              </div>
              <span className="rounded-full bg-[#ffe3e8] px-3 py-2 text-xs uppercase tracking-[0.18em] text-[#a14759]">
                {selectedArea.costLabel}
              </span>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-600">{selectedArea.tuitionNote}</p>

            <div className="mt-6 rounded-[24px] bg-white p-4 shadow-[0_12px_24px_rgba(17,19,34,0.05)]">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Estimated student living</p>
              <p className="mt-3 text-[28px] font-semibold leading-none tracking-tight">{selectedArea.monthlyCost}</p>
            </div>
          </div>

          <div className="soft-card rounded-[30px] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Major universities</p>
            <div className="mt-4 space-y-3">
              {selectedArea.universities.map((university, index) => (
                <div key={university.name} className="rounded-[22px] bg-white px-4 py-4 shadow-[0_10px_20px_rgba(17,19,34,0.04)]">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-[#111322]"
                      style={{ background: index === 0 ? "#ffd7dd" : index === 1 ? "#ffe4c4" : "#d9f4ff" }}
                    >
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#111322]">{university.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
                        In the {selectedArea.name.toLowerCase()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {areas.map((area) => (
              <button
                key={area.id}
                type="button"
                onClick={() => setSelectedAreaId(area.id)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition ${
                  area.id === selectedArea.id ? "bg-[#111322] text-white" : "bg-[#f3f4f6] text-slate-500"
                }`}
              >
                {area.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
