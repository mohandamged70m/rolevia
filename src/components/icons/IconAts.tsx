interface IconProps {
  className?: string
  size?: number
}

export function IconAts({ className, size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M9 15h6" />
      <path d="M12 12v6" />
      <path d="M4.5 12.5 7 10l2 2.5" />
      <path d="M20 12.5 17.5 10 15 12.5" />
      <circle cx="12" cy="18" r="4" fill="currentColor" opacity="0.2" />
      <path d="M12 16v2l1 1" strokeWidth="1.2" />
    </svg>
  )
}
