import { auth } from "@clerk/nextjs/server"

export interface Plan {
  id: "starter" | "pro" | "team"
  label: string
  price: number
  limit: number | "unlimited"
  description: string
  features: string[]
}

export const PLANS: Plan[] = [
  {
    id: "starter",
    label: "Starter",
    price: 12,
    limit: 50,
    description: "For small teams and occasional hiring",
    features: ["50 JDs per month", "Bilingual AR/EN", "Library storage", "Email support"],
  },
  {
    id: "pro",
    label: "Pro",
    price: 29,
    limit: "unlimited",
    description: "For growing teams with active hiring",
    features: ["Unlimited JDs", "Bilingual AR/EN", "Library storage", "Priority support", "Export to Word"],
  },
  {
    id: "team",
    label: "Team",
    price: 79,
    limit: "unlimited",
    description: "For HR teams and recruitment agencies",
    features: ["Unlimited JDs", "Bilingual AR/EN", "Library storage", "Priority support", "5 team seats", "Analytics"],
  },
]

const PLAN_LIMITS: Record<string, number | "unlimited"> = {
  free: 10,
  starter: 50,
  pro: "unlimited",
  team: "unlimited",
}

export function getPlanLimit(plan: string): number | "unlimited" {
  return PLAN_LIMITS[plan] ?? 10
}

export function getPlanPrice(plan: string): string {
  const prices: Record<string, string> = {
    free: "$0/mo",
    starter: "$12/mo",
    pro: "$29/mo",
    team: "$79/mo",
  }
  return prices[plan] ?? "$0/mo"
}

export function isClerkBillingEnabled(): boolean {
  return !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
}

export function getUserPlan(hasFn: (params: { plan: string }) => boolean): string {
  if (hasFn({ plan: "team" })) return "team"
  if (hasFn({ plan: "pro" })) return "pro"
  if (hasFn({ plan: "starter" })) return "starter"
  return "free"
}
