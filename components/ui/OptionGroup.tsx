'use client'

import * as RadioGroup from '@radix-ui/react-radio-group'
import { cn } from '@/lib/cn'

export type Option = { value: string; label: string; hint?: string }

// Single-select as full-width cards. Radix RadioGroup gives roving focus and
// arrow-key navigation; each card is a large tap target.
export function OptionGroup({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: readonly Option[]
  value: string | null
  onChange: (value: string) => void
  ariaLabel: string
}) {
  return (
    <RadioGroup.Root
      className="flex flex-col gap-2.5"
      value={value ?? undefined}
      onValueChange={onChange}
      aria-label={ariaLabel}
    >
      {options.map((opt) => {
        const selected = opt.value === value
        return (
          <RadioGroup.Item
            key={opt.value}
            value={opt.value}
            className={cn(
              'group flex min-h-[3.4rem] items-center gap-3 rounded-2xl border-2 px-4 py-4 text-left transition-all',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent',
              selected
                ? 'glow-soft border-accent bg-accent-wash'
                : 'border-line bg-surface hover:-translate-y-0.5 hover:border-accent-line',
            )}
          >
            <span
              aria-hidden
              className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                selected ? 'border-accent' : 'border-faint',
              )}
            >
              {selected ? <span className="h-2.5 w-2.5 rounded-full bg-accent" /> : null}
            </span>
            <span className="text-[0.98rem] leading-snug">{opt.label}</span>
            {opt.hint ? (
              <span className="ml-auto font-mono text-xs text-faint">{opt.hint}</span>
            ) : null}
          </RadioGroup.Item>
        )
      })}
    </RadioGroup.Root>
  )
}
