import { redirect } from "next/navigation"
import { SignIn } from "@clerk/nextjs"
import { isClerkConfigured } from "@/lib/clerk"

export default function SignInPage() {
  if (!isClerkConfigured) {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#F0EEFF] via-[#F0EEFF]/50 to-white px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-2xl font-bold text-[#111827]">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-[#6b7280]">Sign in to your Rolevia account</p>
        </div>
        <SignIn
          fallbackRedirectUrl="/dashboard"
          signUpUrl="/sign-up"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "rounded-2xl border border-[#EAE8FF] shadow-lg shadow-[#3D2BFF]/5 p-8",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton:
                "rounded-xl border border-[#EAE8FF] text-sm font-medium text-[#4b5563] hover:bg-[#F8F7FF] hover:border-[#3D2BFF]/20 transition-all",
              dividerLine: "bg-[#EAE8FF]",
              dividerText: "text-[#9ca3af] text-xs",
              formButtonPrimary:
                "rounded-xl bg-[#3D2BFF] text-sm font-medium text-white shadow-lg shadow-[#3D2BFF]/25 hover:bg-[#3525E0] transition-all",
              formFieldInput:
                "rounded-xl border border-[#EAE8FF] px-4 py-3 text-sm text-[#111827] placeholder:text-[#9ca3af] focus:border-[#3D2BFF]/40 focus:ring-0 transition-all",
              formFieldLabel: "text-sm font-medium text-[#4b5563]",
              footerActionLink:
                "text-[#3D2BFF] font-medium hover:text-[#3525E0]",
              footer: "hidden",
            },
          }}
        />
        <p className="mt-6 text-center text-xs text-[#9ca3af]">
          Don&apos;t have an account?{" "}
          <a
            href="/sign-up"
            className="font-medium text-[#3D2BFF] hover:text-[#3525E0]"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
