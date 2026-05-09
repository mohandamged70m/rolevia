const COMPANIES = [
  "Aramco Digital",
  "stc",
  "Noon",
  "ADIB",
  "Careem",
  "talabat",
  "e&",
  "Bayt.com",
  "Majid Al Futtaim",
]

export default function LogoStrip() {
  return (
    <section className="border-y border-[#EAE8FF] bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="mb-8 text-center text-xs font-medium uppercase tracking-[0.15em] text-[#9ca3af]">
          Trusted by HR teams across 12+ MENA markets
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {COMPANIES.map((name) => (
            <span
              key={name}
              className="text-sm font-semibold text-[#9ca3af] opacity-60 transition-opacity hover:opacity-100"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
