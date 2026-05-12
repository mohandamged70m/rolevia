const FEATURES = [
  {
    emoji: "🎯",
    title: "Role-aware AI",
    body: "Generates tailored JDs that match seniority, industry, and company culture — not generic templates.",
  },
  {
    emoji: "🌍",
    title: "12+ MENA markets",
    body: "Pre-configured for UAE, KSA, Egypt, Qatar, Kuwait, Bahrain, Oman, Jordan, and more.",
  },
  {
    emoji: "⚡",
    title: "90% faster than writing",
    body: "Go from blank page to publish-ready JD in under 30 seconds, not 45 minutes.",
  },
  {
    emoji: "🔤",
    title: "True bilingual output",
    body: "Native Arabic and English with proper RTL layout, terminology, and cultural relevance.",
  },
  {
    emoji: "📊",
    title: "Bias & quality scoring",
    body: "Built-in checks for clarity, inclusivity, and MENA compliance before you publish.",
  },
  {
    emoji: "🔗",
    title: "ATS & job board sync",
    body: "Export directly to Greenhouse, Workday, Bayt, LinkedIn, Wuzzuf, and more.",
  },
]

export default function Features() {
  return (
    <section id="features" className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#3D2BFF]">
            Why Rolevia
          </p>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
            Everything HR needs to hire faster
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-[#EAE8FF] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#3D2BFF]/20 hover:shadow-lg hover:shadow-[#3D2BFF]/10"
            >
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-[#F0EEFF] p-3 text-xl">
                {f.emoji}
              </div>
              <h3 className="font-heading mb-2 text-lg font-bold text-[#111827]">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#6b7280]">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
