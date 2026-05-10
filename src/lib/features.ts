export interface Feature {
  id: string
  label: string
  description: string
  iconId: string
  href: string
  status: "active" | "coming-soon"
  comingSoonLabel?: string
}

export const DASHBOARD_FEATURES: Feature[] = [
  {
    id: "generate",
    label: "Generate JD",
    description: "Create bilingual job descriptions with AI",
    iconId: "generate",
    href: "/dashboard/generate",
    status: "active",
  },
  {
    id: "library",
    label: "Library",
    description: "Browse and manage your saved JDs",
    iconId: "library",
    href: "/dashboard/library",
    status: "active",
  },
  {
    id: "account",
    label: "Account",
    description: "Manage your plan and settings",
    iconId: "account",
    href: "/dashboard/account",
    status: "active",
  },
  {
    id: "ats",
    label: "ATS CV Reviewer",
    description: "Score resumes against job descriptions",
    iconId: "ats",
    href: "/dashboard/ats",
    status: "coming-soon",
    comingSoonLabel: "Early access",
  },
  {
    id: "interviews",
    label: "Interview Scheduler",
    description: "Schedule and manage interviews",
    iconId: "interview",
    href: "/dashboard/interviews",
    status: "coming-soon",
    comingSoonLabel: "Coming soon",
  },
  {
    id: "candidates",
    label: "Candidates Pipeline",
    description: "Track applicants from apply to hire",
    iconId: "candidates",
    href: "/dashboard/candidates",
    status: "coming-soon",
    comingSoonLabel: "Coming soon",
  },
  {
    id: "analytics",
    label: "Analytics",
    description: "HR metrics and hiring reports",
    iconId: "analytics",
    href: "/dashboard/analytics",
    status: "coming-soon",
    comingSoonLabel: "Coming soon",
  },
]

export const SIDEBAR_NAV = [
  { id: "hub", label: "Hub", iconId: "hub", href: "/dashboard" },
  { id: "generate", label: "Generate", iconId: "generate", href: "/dashboard/generate" },
  { id: "library", label: "Library", iconId: "library", href: "/dashboard/library" },
  { id: "account", label: "Account", iconId: "account", href: "/dashboard/account" },
]

export const SIDEBAR_FUTURE = [
  { id: "ats", label: "ATS Reviewer", iconId: "ats", href: "/dashboard/ats" },
  { id: "interviews", label: "Interviews", iconId: "interview", href: "/dashboard/interviews" },
  { id: "candidates", label: "Candidates", iconId: "candidates", href: "/dashboard/candidates" },
  { id: "analytics", label: "Analytics", iconId: "analytics", href: "/dashboard/analytics" },
]
