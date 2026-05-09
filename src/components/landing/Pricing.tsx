import Link from "next/link"

const PLANS = [
  {
    name: "Starter",
    desc: "For individuals and small teams getting started.",
    price: "$0",
    period: "/mo",
    limit: "5 JDs / month",
    popular: false,
    features: [
      "AI-generated job descriptions",
      "English-only output",
      "Basic quality scoring",
      "Copy & export to PDF",
      "Community support",
    ],
    cta: "Start free",
    href: "#",
  },
  {
    name: "Growth",
    desc: "For growing HR teams hiring across multiple roles.",
    price: "$49",
    period: "/mo",
    limit: "Unlimited JDs",
    popular: true,
    features: [
      "Unlimited AI generations",
      "Arabic & bilingual JDs",
      "MENA compliance engine",
      "ATS export (Greenhouse, Workday, Bayt +)",
      "Bias & quality scoring",
      "Priority support",
      "Team collaboration",
    ],
    cta: "Start 14-day trial",
    href: "#",
  },
  {
    name: "Enterprise",
    desc: "For organizations with custom requirements.",
    price: "Custom",
    period: "",
    limit: "Tailored to you",
    popular: false,
    features: [
      "Everything in Growth",
      "Custom compliance rules",
      "SSO & SCIM",
      "Dedicated account manager",
      "Custom integrations",
      "SLA & audit logs",
      "On-premise option",
    ],
    cta: "Contact sales",
    href: "#",
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="bg-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#3D2BFF]">
            Simple pricing
          </p>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
            Start free. Scale as you grow.
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border bg-white p-8 shadow-sm transition-all hover:shadow-lg ${
                plan.popular
                  ? "border-[#3D2BFF] ring-1 ring-[#3D2BFF]"
                  : "border-[#EAE8FF]"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-block rounded-full bg-[#FF5C3A] px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                    Most popular
                  </span>
                </div>
              )}

              <div className={`mb-6 ${plan.popular ? "pt-2" : ""}`}>
                <h3 className="font-heading text-lg font-bold text-[#111827]">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-[#6b7280]">{plan.desc}</p>
                <div className="mt-4">
                  <span className="font-heading text-4xl font-extrabold text-[#111827]">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="ml-1 text-sm text-[#6b7280]">
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-[#9ca3af]">{plan.limit}</p>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#4b5563]">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-medium transition-all hover:scale-[1.02] ${
                  plan.popular
                    ? "bg-[#3D2BFF] text-white shadow-lg shadow-[#3D2BFF]/25 hover:bg-[#3525E0]"
                    : "border-2 border-[#3D2BFF]/20 text-[#3D2BFF] hover:bg-[#F8F7FF]"
                }`}
              >
                {plan.cta}
                {plan.name !== "Enterprise" ? " →" : ""}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
