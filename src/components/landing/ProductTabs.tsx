"use client"

import { useState } from "react"

const TABS = [
  {
    id: "generate",
    icon: "✦",
    label: "AI Generate",
    steps: [
      { time: "2 sec", title: "Enter a role", body: "Type any job title and select your market." },
      { time: "5 sec", title: "AI writes the JD", body: "Our engine generates a complete, compliant JD with quality scoring." },
      { time: "Instant", title: "Publish everywhere", body: "Copy, export to ATS, or generate an Arabic version in one click." },
    ],
    preview: (
      <div className="rounded-xl border border-[#EAE8FF] bg-white p-6 shadow-sm">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
          Quality scores
        </p>
        <div className="space-y-3">
          {[
            { label: "Clarity", value: "92", color: "bg-[#3D2BFF]" },
            { label: "Inclusivity", value: "88", color: "bg-[#3D2BFF]" },
            { label: "MENA compliance", value: "✓", color: "bg-[#10B981]" },
          ].map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-[#4b5563]">{item.label}</span>
                <span className="font-semibold text-[#111827]">{item.value}</span>
              </div>
              <div className="h-2 rounded-full bg-[#F0EEFF]">
                <div
                  className={`h-2 rounded-full ${item.color}`}
                  style={{ width: item.value === "✓" ? "100%" : `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "bilingual",
    icon: "🌐",
    label: "Bilingual JDs",
    steps: [
      { time: "1 click", title: "Toggle bilingual mode", body: "Switch from English-only to Arabic + English." },
      { time: "Auto", title: "AI translates & localizes", body: "Not just translation — culturally adapted phrasing for MENA." },
      { time: "3 sec", title: "Side-by-side preview", body: "Review both versions simultaneously before publishing." },
    ],
    preview: (
      <div className="grid grid-cols-2 gap-3 rounded-xl border border-[#EAE8FF] bg-white p-4 shadow-sm">
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#3D2BFF]">English</p>
          <div className="space-y-1.5">
            <div className="h-2 w-full rounded bg-[#EAE8FF]" />
            <div className="h-2 w-4/5 rounded bg-[#EAE8FF]" />
            <div className="h-2 w-3/4 rounded bg-[#EAE8FF]" />
            <div className="h-2 w-5/6 rounded bg-[#EAE8FF]" />
          </div>
        </div>
        <div className="space-y-2" dir="rtl">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#3D2BFF]">العربية</p>
          <div className="space-y-1.5">
            <div className="h-2 w-full rounded bg-[#EAE8FF]" />
            <div className="h-2 w-4/5 rounded bg-[#EAE8FF]" />
            <div className="h-2 w-3/4 rounded bg-[#EAE8FF]" />
            <div className="h-2 w-5/6 rounded bg-[#EAE8FF]" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "compliance",
    icon: "⚖️",
    label: "MENA Compliance",
    steps: [
      { time: "Auto", title: "Detect applicable laws", body: "KSA Saudization, UAE labor law, Egypt, Qatar, Kuwait." },
      { time: "2 sec", title: "Flag required clauses", body: "Automatically inserts mandatory language per market." },
      { time: "Verified", title: "Compliance check passed", body: "Green-lit for posting with full audit trail." },
    ],
    preview: (
      <div className="rounded-xl border border-[#EAE8FF] bg-white p-6 shadow-sm">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
          Compliance checklist
        </p>
        <div className="space-y-3">
          {[
            { label: "Saudization (Nitaqat) clause", ok: true },
            { label: "UAE Labour Law Article 8", ok: true },
            { label: "Equal opportunity statement", ok: true },
            { label: "Salary band disclosure (KSA)", ok: true },
            { label: "Probation period (Egypt)", ok: false },
            { label: "Working hours per market", ok: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className={`flex size-5 shrink-0 items-center justify-center rounded-full ${
                  item.ok ? "bg-[#10B981]" : "bg-[#F59E0B]"
                }`}
              >
                <span className="text-[10px] text-white">{item.ok ? "✓" : "!"}</span>
              </div>
              <span className="text-sm text-[#4b5563]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "ats",
    icon: "🔗",
    label: "ATS Export",
    steps: [
      { time: "1 click", title: "Choose destination", body: "Pick your ATS, job board, or format." },
      { time: "2 sec", title: "Auto-format", body: "Rolevia reformats the JD to match each platform's schema." },
      { time: "Done", title: "Published", body: "JD goes live without manual copy-paste or reformatting." },
    ],
    preview: (
      <div className="grid grid-cols-3 gap-3 rounded-xl border border-[#EAE8FF] bg-white p-5 shadow-sm">
        {[
          { name: "Greenhouse", emoji: "🌱" },
          { name: "Workday", emoji: "📅" },
          { name: "Bayt", emoji: "🏠" },
          { name: "LinkedIn", emoji: "💼" },
          { name: "PDF", emoji: "📄" },
          { name: "Wuzzuf", emoji: "⚡" },
        ].map((item) => (
          <div
            key={item.name}
            className="flex flex-col items-center gap-1.5 rounded-lg border border-[#EAE8FF] bg-[#F8F7FF] p-3 text-center transition-all hover:border-[#3D2BFF]/30 hover:bg-white"
          >
            <span className="text-lg">{item.emoji}</span>
            <span className="text-[10px] font-medium text-[#4b5563]">{item.name}</span>
          </div>
        ))}
      </div>
    ),
  },
]

export default function ProductTabs() {
  const [active, setActive] = useState("generate")

  const current = TABS.find((t) => t.id === active)!

  return (
    <section id="templates" className="bg-[#F8F7FF] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#3D2BFF]">
            What Rolevia does
          </p>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
            The end-to-end JD platform for HR teams
          </h2>
        </div>

        {/* Tab buttons */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                active === tab.id
                  ? "bg-[#3D2BFF] text-white shadow-lg shadow-[#3D2BFF]/25"
                  : "bg-white text-[#4b5563] hover:bg-[#F0EEFF]"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab panel */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Steps */}
          <div className="space-y-6">
            {current.steps.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#3D2BFF] text-[10px] font-bold text-white">
                    {i + 1}
                  </div>
                  {i < current.steps.length - 1 && (
                    <div className="mt-1 h-full w-px bg-[#EAE8FF]" />
                  )}
                </div>
                <div className="pb-6">
                  <span className="mb-1 inline-block rounded-full bg-[#3D2BFF]/10 px-2 py-0.5 text-[10px] font-medium text-[#3D2BFF]">
                    {step.time}
                  </span>
                  <h4 className="font-heading mt-1 text-base font-bold text-[#111827]">
                    {step.title}
                  </h4>
                  <p className="mt-1 text-sm text-[#6b7280]">{step.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Preview card */}
          <div>{current.preview}</div>
        </div>
      </div>
    </section>
  )
}
