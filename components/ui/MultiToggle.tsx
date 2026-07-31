'use client'

import { cn } from '@/lib/cn'

// Multi-select toggle chips (used by the overclaiming checklist). Each chip is
// a button with aria-pressed; selecting zero is a valid answer.
export function MultiToggle({
  options,
  selected,
  onToggle,
}: {
  options: readonly { value: string; label: string }[]
  selected: readonly string[]
  onToggle: (value: string) => void
}) {
  const set = new Set(selected)
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const on = set.has(opt.value)
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(opt.value)}
            className={cn(
              'rounded-xl border-2 px-3.5 py-2.5 text-[0.9rem] leading-snug transition-all',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent',
              on
                ? 'glow-soft border-accent bg-accent-wash'
                : 'border-line bg-surface hover:border-accent-line',
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
