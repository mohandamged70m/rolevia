import { Badge } from "@/components/ui/badge"

export default function AppPreview() {
  return (
    <section id="preview" className="px-4 pb-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="relative rounded-xl border border-border/40 bg-card shadow-sm ring-1 ring-foreground/5">
          <div className="absolute -top-3 left-6">
            <Badge variant="secondary" className="px-3 py-1 text-xs uppercase tracking-wider">
              Preview
            </Badge>
          </div>

          <div className="grid grid-cols-1 divide-y md:grid-cols-2 md:divide-x md:divide-y-0">
            {/* Left: Input Form */}
            <div className="space-y-5 p-6">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Job Title</label>
                <div className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                  Software Engineer
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Industry</label>
                <div className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                  Tech
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Language</label>
                <div className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                  Both
                </div>
              </div>
            </div>

            {/* Right: Bilingual Output */}
            <div className="flex flex-col divide-y">
              {/* Arabic */}
              <div dir="rtl" className="space-y-2 p-6">
                <span className="text-xs font-medium text-muted-foreground">بالعربية</span>
                <h3 className="font-arabic text-base font-semibold leading-relaxed">
                  مهندس برمجيات
                </h3>
                <p className="font-arabic text-sm leading-relaxed text-muted-foreground">
                  نحن نبحث عن مهندس برمجيات موهوب للانضمام إلى فريقنا التقني. ستعمل على تطوير
                  حلول مبتكرة باستخدام أحدث التقنيات.
                </p>
              </div>

              {/* English */}
              <div dir="ltr" className="space-y-2 p-6">
                <span className="text-xs font-medium text-muted-foreground">English</span>
                <h3 className="text-base font-semibold">Software Engineer</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  We are looking for a talented Software Engineer to join our tech team. You will
                  work on building innovative solutions using cutting-edge technologies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
