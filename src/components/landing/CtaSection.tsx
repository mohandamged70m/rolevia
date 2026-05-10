import Link from "next/link"
import BookForm from "./BookForm"

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-[#0D0D1A] px-4 py-24 sm:px-6 lg:px-8">
      {/* Radial purple glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[500px] w-[500px] rounded-full bg-[#3D2BFF] opacity-[0.12] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Ready to write better job descriptions — faster?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/60">
          Join thousands of HR teams across MENA. Generate compliant, bilingual,
          high-quality JDs in seconds — not hours.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/sign-up"
            className="inline-flex items-center rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-[#3D2BFF] shadow-lg transition-all hover:scale-[1.02] hover:bg-white/90"
          >
            Start writing for free
          </Link>
          <span className="hidden sm:block text-white/30 text-sm">or</span>
          <BookForm />
        </div>
      </div>
    </section>
  )
}
