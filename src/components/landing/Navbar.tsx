"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { DesktopAuthButtons, MobileAuthButtons } from "@/components/SafeUserButton"

const NAV_ITEMS = [
  { label: "Features", href: "#features" },
  { label: "Templates", href: "#templates" },
  { label: "Pricing", href: "#pricing" },
  { label: "Reviews", href: "#markets" },
  { label: "Resources", href: "#resources" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-[#EAE8FF] bg-white/80 shadow-sm backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-1">
          <span className="font-heading text-xl font-extrabold text-[#3D2BFF]">
            Rolevia
          </span>
          <span className="h-2 w-2 rounded-full bg-[#FF5C3A]" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[#4b5563] transition-colors hover:text-[#3D2BFF]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <DesktopAuthButtons />
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-6 text-[#3D2BFF]" /> : <Menu className="size-6 text-[#4b5563]" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-[#EAE8FF] bg-white md:hidden">
          <nav className="flex flex-col gap-4 px-4 py-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-[#4b5563] transition-colors hover:text-[#3D2BFF]"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-3">
              <MobileAuthButtons onClick={() => setMobileOpen(false)} />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
