import { cn } from '@/lib/cn'

type Variant = 'primary' | 'ghost'

export function Button({
  variant = 'primary',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent',
        'disabled:cursor-not-allowed disabled:opacity-40',
        variant === 'primary' &&
          'glow-accent bg-accent px-6 py-3 text-[0.96rem] text-white hover:-translate-y-0.5 hover:bg-accent-strong disabled:hover:translate-y-0',
        variant === 'ghost' && 'px-2 py-2 text-[0.95rem] text-muted hover:text-ink',
        className,
      )}
      {...props}
    />
  )
}
