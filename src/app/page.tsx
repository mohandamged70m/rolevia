import Navbar from "@/components/landing/Navbar"
import Hero from "@/components/landing/Hero"
import LogoStrip from "@/components/landing/LogoStrip"
import ProductTabs from "@/components/landing/ProductTabs"
import Features from "@/components/landing/Features"
import Stats from "@/components/landing/Stats"
import HowItWorks from "@/components/landing/HowItWorks"
import Testimonials from "@/components/landing/Testimonials"
import Pricing from "@/components/landing/Pricing"
import CtaSection from "@/components/landing/CtaSection"
import Footer from "@/components/landing/Footer"

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <LogoStrip />
        <ProductTabs />
        <Features />
        <Stats />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}
