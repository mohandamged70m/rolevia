export const DEMO_ROLES = [
  "Senior Product Manager",
  "Software Engineer",
  "Marketing Manager",
  "HR Business Partner",
  "Sales Director",
]

const ROLE_KEYWORDS: { keywords: string[]; key: string }[] = [
  { keywords: ["product manager", "product owner", "pm"], key: "product-manager" },
  { keywords: ["software engineer", "developer", "engineer", "frontend", "backend", "full stack", "full-stack"], key: "software-engineer" },
  { keywords: ["marketing", "growth", "brand", "digital marketing"], key: "marketing" },
  { keywords: ["hr", "human resources", "people", "hrbp", "hr business partner"], key: "hr" },
  { keywords: ["sales", "biz dev", "business development", "account executive"], key: "sales" },
]

export function findDemoRole(role: string): string | null {
  const lower = role.toLowerCase().trim()
  for (const entry of ROLE_KEYWORDS) {
    if (entry.keywords.some((k) => lower.includes(k))) {
      return entry.key
    }
  }
  return null
}

export const SAMPLE_JDS: Record<string, string> = {
  "product-manager": `🇬🇧 ENGLISH VERSION

## **Job Title**
Senior Product Manager

## **About the Role**
We are looking for a Senior Product Manager to define and drive the product roadmap for our B2B SaaS platform serving the MENA region. You will work directly with engineering, design, and go-to-market teams to Ship products that solve real problems for HR teams across the Middle East.

## **Key Responsibilities**
- Define product strategy and quarterly OKRs in alignment with company goals
- Conduct user research and competitive analysis across MENA markets (KSA, UAE, Egypt)
- Write detailed PRDs and manage the full product lifecycle from ideation to launch
- Collaborate with engineering to break down epics into deliverable sprints
- Analyze product metrics (MAU, retention, NPS) and iterate based on data
- Present product updates and roadmap decisions to stakeholders and leadership

## **Requirements**
### Must-have
- 5+ years of product management experience, preferably in B2B SaaS
- Proven track record of shipping products used by 10k+ users
- Strong analytical skills — you are comfortable with SQL, Amplitude, or similar tools
- Excellent English communication; Arabic is a strong plus

### Nice-to-have
- Experience in HR tech, recruitment, or labor compliance
- Worked on products serving both English and Arabic-speaking users
- Familiarity with KSA labor law or UAE Labour Law

## **What We Offer**
- Competitive tax-free salary (AED 35,000 — 45,000 / month)
- Equity package — you own a piece of what you build
- Remote-first with optional co-working in Dubai Internet City
- Annual learning budget of AED 10,000
- 30 paid vacation days + public holidays

---

🇸🇦 ARABIC VERSION

## **المسمى الوظيفي**
مدير منتج أول

## **نبذة عن الدور**
نبحث عن مدير منتج أول لتحديد وقيادة خارطة طريق منتج منصة B2B السحابية التي تخدم منطقة الشرق الأوسط وشمال أفريقيا. ستعمل مباشرة مع فرق الهندسة والتصميم والتسويق لإطلاق منتجات تحل مشكلات حقيقية لفرق الموارد البشرية في جميع أنحاء الشرق الأوسط.

## **المسؤوليات الرئيسية**
- تحديد استراتيجية المنتج والأهداف الربعية بما يتوافق مع أهداف الشركة
- إجراء أبحاث المستخدمين وتحليل المنافسين في أسواق الشرق الأوسط (السعودية، الإمارات، مصر)
- كتابة وثائق متطلبات المنتج وإدارة دورة حياة المنتج الكاملة من الفكرة إلى الإطلاق
- التعاون مع فريق الهندسة لتقسيم المهام الكبيرة إلى سباقات قابلة للتسليم
- تحليل مقاييس المنتج (المستخدمين النشطين شهرياً، الاحتفاظ، صافي المروجين) والتكرار بناءً على البيانات
- عرض تحديثات المنتج وقرارات خارطة الطريق على أصحاب المصلحة والإدارة

## **المتطلبات**
### أساسي
- 5+ سنوات من خبرة إدارة المنتجات، ويفضل في B2B SaaS
- سجل حافل في إطلاق منتجات يستخدمها 10,000+ مستخدم
- مهارات تحليلية قوية — إجادة استخدام SQL أو Amplitude أو أدوات مماثلة
- إجادة ممتازة للغة الإنجليزية؛ اللغة العربية ميزة إضافية قوية

### مرغوب فيه
- خبرة في تكنولوجيا الموارد البشرية أو التوظيف أو الامتثال العمالي
- العمل على منتجات تخدم المستخدمين الناطقين بالعربية والإنجليزية
- الإلمام بقانون العمل السعودي أو قانون العمل الإماراتي

## **ما نقدمه**
- راتب تنافسي معفى من الضرائب (35,000 — 45,000 درهم إماراتي / شهرياً)
- حصة في الأسهم — تملك جزءاً مما تبنيه
- العمل عن بُعد بشكل أساسي مع مساحات عمل اختيارية في مدينة دبي للإنترنت
- ميزانية تعليمية سنوية بقيمة 10,000 درهم إماراتي
- 30 يوم إجازة مدفوعة + العطلات الرسمية`,

  "software-engineer": `🇬🇧 ENGLISH VERSION

## **Job Title**
Software Engineer — Full Stack

## **About the Role**
We are hiring a Full Stack Software Engineer to build and scale the core platform powering Rolevia's AI-driven job description engine. You will own features end-to-end, from database schema design to polished UI, and ship code that tens of thousands of HR professionals interact with daily.

## **Key Responsibilities**
- Design, build, and maintain RESTful APIs and GraphQL endpoints using Node.js and TypeScript
- Build responsive, accessible UI components with React and Next.js
- Write comprehensive unit and integration tests (Jest, Playwright)
- Optimize database queries and schema design (PostgreSQL, Prisma)
- Participate in code reviews and mentor junior engineers
- Contribute to architecture decisions and technical roadmaps

## **Requirements**
### Must-have
- 4+ years of professional software engineering experience
- Deep knowledge of TypeScript, React, and Node.js
- Experience with relational databases and ORMs
- Strong understanding of CI/CD pipelines and version control (Git)

### Nice-to-have
- Experience with AI/LLM APIs (OpenAI, Gemini, Claude)
- Familiarity with cloud infrastructure (AWS, GCP, or Azure)
- Experience building bilingual (AR/EN) applications
- Open-source contributions or a live side project you can show us

## **What We Offer**
- Competitive salary (AED 25,000 — 35,000 / month)
- Stock options
- MacBook Pro + equipment budget of AED 5,000
- Flexible hours — we care about output, not hours sat at a desk
- Annual team retreat (previous: Istanbul, next: TBD)

---

🇸🇦 ARABIC VERSION

## **المسمى الوظيفي**
مهندس برمجيات — Full Stack

## **نبذة عن الدور**
نبحث عن مهندس برمجيات Full Stack لبناء وتوسيع المنصة الأساسية التي تشغل محرك كتابة الوصف الوظيفي المدعوم بالذكاء الاصطناعي في Rolevia. ستتولى مسؤولية الميزات بالكامل، من تصميم قاعدة البيانات إلى واجهة المستخدم، وستطلق كوداً يتفاعل معه عشرات الآلاف من متخصصي الموارد البشرية يومياً.

## **المسؤوليات الرئيسية**
- تصميم وبناء وصيانة واجهات API (RESTful و GraphQL) باستخدام Node.js و TypeScript
- بناء مكونات واجهة مستخدم سريعة الاستجابة وسهلة الوصول باستخدام React و Next.js
- كتابة اختبارات وحدة وتكامل شاملة (Jest, Playwright)
- تحسين استعلامات قاعدة البيانات وتصميم المخططات (PostgreSQL, Prisma)
- المشاركة في مراجعات الكود وتوجيه المهندسين المبتدئين
- المساهمة في قرارات الهندسة المعمارية والخرائط الفنية

## **المتطلبات**
### أساسي
- 4+ سنوات من خبرة هندسة البرمجيات الاحترافية
- معرفة عميقة بـ TypeScript و React و Node.js
- خبرة مع قواعد البيانات العلائقية و ORMs
- فهم قوي لخطوط CI/CD والتحكم في الإصدارات (Git)

### مرغوب فيه
- خبرة مع واجهات AI/LLM (OpenAI, Gemini, Claude)
- الإلمام بالبنية التحتية السحابية (AWS, GCP, Azure)
- خبرة في بناء تطبيقات ثنائية اللغة (AR/EN)
- مساهمات مفتوحة المصدر أو مشروع جانبي مباشر

## **ما نقدمه**
- راتب تنافسي (25,000 — 35,000 درهم إماراتي / شهرياً)
- خيارات أسهم
- MacBook Pro + ميزانية معدات بقيمة 5,000 درهم إماراتي
- ساعات عمل مرنة — نهتم بالمخرجات وليس ساعات الجلوس على المكتب
- رحلة سنوية للفريق (السابقة: إسطنبول، القادمة: لم تحدد بعد)`,

  "marketing": `🇬🇧 ENGLISH VERSION

## **Job Title**
Marketing Manager — MENA Region

## **About the Role**
We are looking for a Marketing Manager to own demand generation and brand positioning across the MENA region. You will build and execute multi-channel campaigns that drive qualified leads for our B2B SaaS platform, working closely with sales, product, and regional partners.

## **Key Responsibilities**
- Plan and execute integrated marketing campaigns across digital, events, and content channels
- Manage the marketing budget and optimize spend across paid search, social, and events
- Create localized content in English and Arabic (blog posts, whitepapers, case studies, webinars)
- Build and nurture relationships with HR industry partners, influencers, and media in KSA and UAE
- Track and report on key metrics (MQLs, SQLs, CAC, pipeline influence) using HubSpot
- Collaborate with product marketing on positioning, messaging, and go-to-market launches

## **Requirements**
### Must-have
- 5+ years of B2B marketing experience, with at least 2 years focused on MENA markets
- Fluency in English and Arabic (reading, writing, speaking)
- Proven experience managing paid campaigns on Google Ads, LinkedIn, and Meta
- Strong analytical skills — comfort with Excel/Google Sheets and marketing analytics tools

### Nice-to-have
- Experience marketing to HR or recruitment audiences
- In-house experience at a SaaS company (not agency)
- Knowledge of HubSpot or Marketo
- Existing media and partner relationships in KSA or UAE

## **What We Offer**
- Competitive tax-free salary (AED 30,000 — 40,000 / month)
- Performance bonus (up to 20% of annual salary)
- Remote-friendly with quarterly meetups in Dubai
- Annual learning budget of AED 8,000
- Health insurance for you and your family

---

🇸🇦 ARABIC VERSION

## **المسمى الوظيفي**
مدير تسويق — منطقة الشرق الأوسط وشمال أفريقيا

## **نبذة عن الدور**
نبحث عن مدير تسويق ليتولى مسؤولية توليد الطلب وتحديد موقع العلامة التجارية في منطقة الشرق الأوسط وشمال أفريقيا. ستبني وتنفذ حملات متعددة القنوات تجذب عملاء محتملين مؤهلين لمنصة B2B الخاصة بنا، بالتعاون الوثيق مع فرق المبيعات والمنتجات والشركاء الإقليميين.

## **المسؤوليات الرئيسية**
- تخطيط وتنفيذ حملات تسويقية متكاملة عبر القنوات الرقمية والفعاليات والمحتوى
- إدارة ميزانية التسويق وتحسين الإنفاق عبر البحث المدفوع ووسائل التواصل الاجتماعي والفعاليات
- إنشاء محتوى محلي باللغتين الإنجليزية والعربية (مقالات، تقارير، دراسات حالة، ندوات عبر الإنترنت)
- بناء ورعاية العلاقات مع شركاء الموارد البشرية والمؤثرين ووسائل الإعلام في السعودية والإمارات
- تتبع وإعداد تقارير عن المقاييس الرئيسية (MQLs، SQLs، CAC) باستخدام HubSpot
- التعاون مع تسويق المنتجات في تحديد المواقع والرسائل وإطلاقات الذهاب إلى السوق

## **المتطلبات**
### أساسي
- 5+ سنوات من خبرة التسويق B2B، مع سنتين على الأقل في أسواق الشرق الأوسط
- إجادة اللغتين الإنجليزية والعربية (قراءة، كتابة، تحدث)
- خبرة مثبتة في إدارة الحملات المدفوعة على Google Ads و LinkedIn و Meta
- مهارات تحليلية قوية — إجادة استخدام Excel وأدوات تحليل التسويق

### مرغوب فيه
- خبرة في التسويق لجمهور الموارد البشرية أو التوظيف
- خبرة داخلية في شركة SaaS (وليس وكالة)
- معرفة بـ HubSpot أو Marketo
- علاقات إعلامية وشراكة قائمة في السعودية أو الإمارات

## **ما نقدمه**
- راتب تنافسي معفى من الضرائب (30,000 — 40,000 درهم إماراتي / شهرياً)
- مكافأة أداء (تصل إلى 20% من الراتب السنوي)
- العمل عن بُعد مع لقاءات ربع سنوية في دبي
- ميزانية تعليمية سنوية بقيمة 8,000 درهم إماراتي
- تأمين صحي لك ولأسرتك`,

  "hr": `🇬🇧 ENGLISH VERSION

## **Job Title**
HR Business Partner

## **About the Role**
We are seeking an HR Business Partner to partner with our leadership team in scaling the organisation from 50 to 200+ employees over the next 18 months. You will shape people strategy, drive talent acquisition, and ensure compliance with KSA and UAE labour laws as we expand across the region.

## **Key Responsibilities**
- Partner with department heads to align people strategy with business objectives
- Lead end-to-end recruitment for key hires across engineering, sales, and operations
- Design and implement performance review cycles, promotion frameworks, and compensation bands
- Ensure full compliance with KSA Labour Law, UAE Labour Law, and DIFC/ADGM regulations
- Manage employee relations cases with empathy and fairness
- Build and maintain HR dashboards to track headcount, turnover, and engagement

## **Requirements**
### Must-have
- 6+ years of HR experience, with at least 3 years as an HRBP or similar
- Deep knowledge of KSA Labour Law and UAE Labour Law
- Experience scaling a company from startup to mid-stage (50→200+ employees)
- Fluent English and Arabic — you will write policies and communicate in both languages

### Nice-to-have
- CIPD, SHRM, or equivalent HR certification
- Experience using HRIS platforms (BambooHR, Personio, or similar)
- Worked in a SaaS or tech company before

## **What We Offer**
- Competitive salary (AED 28,000 — 38,000 / month)
- Equity — you help build the company, you share in its success
- Flexible remote policy
- Annual wellbeing stipend of AED 6,000
- Visa and relocation support if moving to Dubai

---

🇸🇦 ARABIC VERSION

## **المسمى الوظيفي**
شريك أعمال الموارد البشرية

## **نبذة عن الدور**
نبحث عن شريك أعمال للموارد البشرية ليتعاون مع فريق القيادة في توسيع نطاق المنظمة من 50 إلى 200+ موظف خلال الـ 18 شهراً القادمة. ستشكل استراتيجية الأفراد، وتقود اكتساب المواهب، وتضمن الامتثال لقوانين العمل في السعودية والإمارات مع توسعنا في المنطقة.

## **المسؤوليات الرئيسية**
- الشراكة مع رؤساء الأقسام لمواءمة استراتيجية الأفراد مع أهداف العمل
- قيادة عملية التوظيف للمتعاقدين الرئيسيين في الهندسة والمبيعات والعمليات
- تصميم وتنفيذ دورات تقييم الأداء وهياكل الترقية ونطاقات الرواتب
- ضمان الامتثال الكامل لقانون العمل السعودي وقانون العمل الإماراتي ولوائح DIFC/ADGM
- إدارة علاقات الموظفين بتعاطف وإنصاف
- بناء وصيانة لوحات معلومات الموارد البشرية لتتبع عدد الموظفين والدوران والمشاركة

## **المتطلبات**
### أساسي
- 6+ سنوات من خبرة الموارد البشرية، مع 3 سنوات على الأقل كشريك أعمال أو ما يعادلها
- معرفة عميقة بقانون العمل السعودي وقانون العمل الإماراتي
- خبرة في توسيع نطاق شركة من مرحلة البدء إلى المرحلة المتوسطة (50→200+ موظف)
- إجادة اللغتين الإنجليزية والعربية — ستكتب السياسات وتتواصل بكلتا اللغتين

### مرغوب فيه
- شهادة CIPD أو SHRM أو ما يعادلها
- خبرة في استخدام أنظمة HRIS (BambooHR، Personio، أو ما شابهها)
- خبرة سابقة في شركة SaaS أو تكنولوجيا

## **ما نقدمه**
- راتب تنافسي (28,000 — 38,000 درهم إماراتي / شهرياً)
- حصة في الأسهم — أنت تبني الشركة وتشارك في نجاحها
- سياسة عمل عن بُعد مرنة
- علاوة رفاهية سنوية بقيمة 6,000 درهم إماراتي
- دعم التأشيرة والانتقال إذا انتقلت إلى دبي`,

  "sales": `🇬🇧 ENGLISH VERSION

## **Job Title**
Sales Director — MENA Enterprise

## **About the Role**
We are looking for a Sales Director to own enterprise revenue across the MENA region. You will build and lead a high-performing sales team, develop relationships with CHROs and HR directors at leading organisations in KSA, UAE, and Egypt, and drive ARR growth from AED 2M to AED 10M+.

## **Key Responsibilities**
- Own the full enterprise sales cycle from prospecting to close for accounts with 500+ employees
- Recruit, train, and mentor a team of 4-6 Enterprise AEs
- Build a repeatable sales playbook tailored to MENA enterprise buying behaviours
- Develop deep relationships with key decision-makers at target accounts
- Forecast accurately and report pipeline health to the CEO weekly
- Partner with Customer Success to ensure smooth handoffs and high NPS

## **Requirements**
### Must-have
- 8+ years of B2B sales experience, with 3+ years leading a team
- Proven track record of closing 6-figure ARR deals in MENA enterprise
- Deep network of HR and procurement contacts in KSA and UAE
- Fluent English and Arabic — you will negotiate and present in both languages
- Experience using SFDC or HubSpot for pipeline management

### Nice-to-have
- Experience selling HR tech, SaaS HRIS, or recruitment solutions
- Worked at a company that grew from Series A to Series B or beyond
- MBA from a recognised university

## **What We Offer**
- Competitive base salary (AED 40,000 — 55,000 / month)
- Uncapped commission — OTE 2x base realistic in year one
- Equity package
- Car allowance of AED 2,500 / month
- Executive health insurance
- First-class travel for client meetings across the region

---

🇸🇦 ARABIC VERSION

## **المسمى الوظيفي**
مدير مبيعات — مؤسسات الشرق الأوسط

## **نبذة عن الدور**
نبحث عن مدير مبيعات ليتولى مسؤولية إيرادات المؤسسات في منطقة الشرق الأوسط وشمال أفريقيا. ستبني وتقود فريق مبيعات عالي الأداء، وتطور علاقات مع مدراء الموارد البشرية التنفيذيين في المؤسسات الرائدة في السعودية والإمارات ومصر، وتدفع نمو الإيرادات السنوية المتكررة من 2 مليون إلى 10+ ملايين درهم إماراتي.

## **المسؤوليات الرئيسية**
- إدارة دورة مبيعات المؤسسات بالكامل من البحث إلى الإغلاق للحسابات التي تضم 500+ موظف
- توظيف وتدريب وتوجيه فريق من 4-6 من مدراء الحسابات المؤسسية
- بناء دليل مبيعات قابل للتكرار مصمم خصيصاً لسلوكيات الشراء المؤسسي في الشرق الأوسط
- تطوير علاقات عميقة مع صانعي القرار الرئيسيين في الحسابات المستهدفة
- تقديم توقعات دقيقة وتقارير أسبوعية عن صحة خط الأنابيب إلى الرئيس التنفيذي
- الشراكة مع فرق نجاح العملاء لضمان انتقال سلس ودرجات عالية في صافي المروجين

## **المتطلبات**
### أساسي
- 8+ سنوات من خبرة المبيعات B2B، مع 3+ سنوات في قيادة فريق
- سجل حافل في إغلاق صفقات مؤسسية بقيمة 6 أرقام في الشرق الأوسط
- شبكة واسعة من جهات الاتصال في الموارد البشرية والمشتريات في السعودية والإمارات
- إجادة اللغتين الإنجليزية والعربية — ستفاوض وتقدم بكلتا اللغتين
- خبرة في استخدام SFDC أو HubSpot لإدارة خط الأنابيب

### مرغوب فيه
- خبرة في بيع تكنولوجيا الموارد البشرية أو أنظمة HRIS السحابية أو حلول التوظيف
- العمل في شركة نمت من السلسلة A إلى السلسلة B أو beyond
- ماجستير إدارة أعمال من جامعة معترف بها

## **ما نقدمه**
- راتب أساسي تنافسي (40,000 — 55,000 درهم إماراتي / شهرياً)
- عمولة غير محدودة — ضعف الراتب الأساسي في السنة الأولى
- حصة في الأسهم
- بدل سيارة 2,500 درهم إماراتي / شهرياً
- تأمين صحي تنفيذي
- سفر من الدرجة الأولى لاجتماعات العملاء في جميع أنحاء المنطقة`,
}
