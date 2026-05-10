interface IconProps {
  className?: string
  size?: number
}

export function IconAccount({ className, size = 24 }: IconProps) {
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
      <path d="M12 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10Z" />
      <path d="M12 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
      <path d="M5.5 19.5A8.5 8.5 0 0 1 18.5 19.5" />
    </svg>
  )
}
