import { ClerkProvider } from "@clerk/nextjs"
import { isClerkConfigured } from "@/lib/clerk"

export default function ClerkProviderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  if (!isClerkConfigured) {
    return <>{children}</>
  }

  return <ClerkProvider>{children}</ClerkProvider>
}
