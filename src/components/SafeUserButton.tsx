"use client"

import { useUser, UserButton } from "@clerk/nextjs"
import Link from "next/link"

export function DesktopAuthButtons() {
  let isSignedIn = false

  try {
    const result = useUser()
    isSignedIn = result.isSignedIn === true
  } catch {
    // Clerk not configured — show unauthenticated state
  }

  if (isSignedIn) {
    return (
      <>
        <Link
          href="/dashboard"
          className="text-sm font-medium text-[#4b5563] transition-colors hover:text-[#3D2BFF]"
        >
          Dashboard
        </Link>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-8 w-8",
            },
          }}
        />
      </>
    )
  }

  return (
    <>
      <Link
        href="/sign-in"
        className="rounded-lg px-4 py-2 text-sm font-medium text-[#4b5563] transition-colors hover:text-[#3D2BFF]"
      >
        Log in
      </Link>
      <Link
        href="/sign-up"
        className="rounded-lg bg-[#3D2BFF] px-5 py-2 text-sm font-medium text-white transition-all hover:scale-[1.02] hover:bg-[#3525E0]"
      >
        Start free &rarr;
      </Link>
    </>
  )
}

export function MobileAuthButtons({ onClick }: { onClick: () => void }) {
  let isSignedIn = false

  try {
    const result = useUser()
    isSignedIn = result.isSignedIn === true
  } catch {
    // Clerk not configured — show unauthenticated state
  }

  if (isSignedIn) {
    return (
      <>
        <Link
          href="/dashboard"
          className="rounded-lg px-4 py-2 text-center text-sm font-medium text-[#4b5563] transition-colors hover:text-[#3D2BFF]"
          onClick={onClick}
        >
          Dashboard
        </Link>
        <div className="flex justify-center">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-8 w-8",
              },
            }}
          />
        </div>
      </>
    )
  }

  return (
    <>
      <Link
        href="/sign-in"
        className="rounded-lg px-4 py-2 text-center text-sm font-medium text-[#4b5563] transition-colors hover:text-[#3D2BFF]"
        onClick={onClick}
      >
        Log in
      </Link>
      <Link
        href="/sign-up"
        className="rounded-lg bg-[#3D2BFF] px-5 py-2 text-center text-sm font-medium text-white transition-all hover:bg-[#3525E0]"
        onClick={onClick}
      >
        Start free &rarr;
      </Link>
    </>
  )
}
