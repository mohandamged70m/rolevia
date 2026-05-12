const STATS = [
  { value: "90%", label: "reduction in JD writing time", accent: true },
  { value: "12+", label: "MENA markets", accent: false },
  { value: "2M+", label: "JDs generated", accent: false },
  { value: "4.9", label: "★ average rating", accent: true },
]

export default function Stats() {
  return (
    <section className="bg-[#3D2BFF] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading text-[36px] font-extrabold leading-none text-white sm:text-[52px]">
                {stat.value}
                {stat.accent && (
                  <span className="text-[#FF5C3A]">
                    ★
                  </span>
                )}
              </p>
              <p className="mt-2 text-sm font-medium text-white/80">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
