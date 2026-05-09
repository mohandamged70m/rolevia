const STEPS = [
  { number: "01", title: "Enter the role", body: "Type any job title, seniority level, and industry." },
  { number: "02", title: "AI generates the JD", body: "Our engine writes a complete, compliant JD in seconds." },
  { number: "03", title: "Review & refine", body: "Tweak tone, add requirements, or toggle bilingual mode." },
  { number: "04", title: "Publish", body: "Export to your ATS, share a link, or download as PDF." },
]

export default function HowItWorks() {
  return (
    <section id="templates" className="bg-[#F8F7FF] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 grid gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#3D2BFF]">
              How it works
            </p>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
              From role to publish in 4 steps
            </h2>
          </div>
          <p className="text-[#6b7280] lg:self-end lg:text-right">
            No learning curve. No templates to fill. Just describe what you need.
          </p>
        </div>

        <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connecting line */}
          <div className="absolute left-0 top-8 hidden h-px w-full bg-[#EAE8FF] lg:block" />

          {STEPS.map((step) => (
            <div key={step.number} className="relative">
              <div className="relative z-10 mb-5 flex size-14 items-center justify-center rounded-full bg-[#3D2BFF] text-lg font-extrabold text-white shadow-lg shadow-[#3D2BFF]/25">
                {step.number}
              </div>
              <h3 className="font-heading mb-2 text-lg font-bold text-[#111827]">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#6b7280]">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
