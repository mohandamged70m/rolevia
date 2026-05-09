import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Privacy Policy</h1>
      <p className="mt-4 text-muted-foreground">
        This page is under construction. Check back soon.
      </p>
      <Link href="/" className="mt-8 inline-block text-sm text-primary underline-offset-4 hover:underline">
        &larr; Back to home
      </Link>
    </div>
  )
}
