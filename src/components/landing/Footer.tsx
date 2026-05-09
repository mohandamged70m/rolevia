import Link from "next/link"

const PRODUCT_LINKS = [
  { label: "AI Generator", href: "#" },
  { label: "Bilingual JDs", href: "#" },
  { label: "Compliance Engine", href: "#" },
  { label: "ATS Export", href: "#" },
  { label: "Templates", href: "#" },
  { label: "Pricing", href: "#pricing" },
]

const MARKET_LINKS = [
  { label: "United Arab Emirates", href: "#" },
  { label: "Saudi Arabia", href: "#" },
  { label: "Egypt", href: "#" },
  { label: "Qatar & GCC", href: "#" },
]

const COMPANY_LINKS = [
  { label: "About", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Contact", href: "#" },
]

export default function Footer() {
  return (
    <footer className="bg-[#0D0D1A] px-4 pt-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-1">
              <span className="font-heading text-xl font-extrabold text-white">
                Rolevia
              </span>
              <span className="h-2 w-2 rounded-full bg-[#FF5C3A]" />
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/50">
              AI-powered job description writer for HR teams in the MENA region.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/70">
              Product
            </h4>
            <ul className="space-y-2.5">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Markets */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/70">
              Markets
            </h4>
            <ul className="space-y-2.5">
              {MARKET_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/70">
              Company
            </h4>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center gap-4 border-t border-white/10 py-8 sm:flex-row sm:justify-between">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Rolevia. All rights reserved.
          </p>
          <p className="text-xs text-white/30" dir="rtl">
            وظيفتي — كاتب وصف الوظائف بالذكاء الاصطناعي
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-xs text-white/40 transition-colors hover:text-white"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-white/40 transition-colors hover:text-white"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
