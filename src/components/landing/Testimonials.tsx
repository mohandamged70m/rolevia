const TESTIMONIALS = [
  {
    quote:
      "Rolevia cut our JD creation time from 45 minutes to under 30 seconds. The bilingual output is flawless — our Arabic postings finally read as naturally as the English ones.",
    name: "Sara Al-Otaibi",
    role: "HR Director, Saudi Aramco Digital",
    initials: "SA",
  },
  {
    quote:
      "We write JDs for 6 different markets. Rolevia's compliance engine handles KSA, UAE, and Egypt labor laws automatically. It's like having a legal team built into your HR stack.",
    name: "Khaled Mansour",
    role: "Talent Acquisition Lead, Careem",
    initials: "KM",
  },
  {
    quote:
      "The quality scoring feature is a game-changer. We can check for biased language and inclusivity before anything goes live. Our hiring diversity improved measurably in the first quarter.",
    name: "Nour El-Din",
    role: "VP People & Culture, Noon",
    initials: "NE",
  },
]

export default function Testimonials() {
  return (
    <section id="markets" className="bg-[#F8F7FF] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#3D2BFF]">
            What HR teams say
          </p>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
            Loved by teams across MENA
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-[#EAE8FF] bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex gap-0.5 text-[#FF5C3A]">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="mb-5 text-sm leading-relaxed italic text-[#4b5563]">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-[#3D2BFF] text-xs font-bold text-white">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">{t.name}</p>
                  <p className="text-xs text-[#6b7280]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
