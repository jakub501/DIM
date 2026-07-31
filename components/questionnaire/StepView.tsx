'use client'

import { useEffect, useRef } from 'react'
import type { Step } from '@/lib/sequence'
import type { AnswerValue } from '@/lib/session'
import { FREQUENCY_SCALE, OVERCLAIM_PROMPT } from '@/lib/content'
import { OptionGroup, type Option } from '@/components/ui/OptionGroup'
import { MultiToggle } from '@/components/ui/MultiToggle'

const FREQUENCY_OPTIONS: Option[] = FREQUENCY_SCALE.map((o) => ({
  value: String(o.value),
  label: o.label,
  hint: String(o.value), // the score weight, shown per design
}))

const YESNO_OPTIONS: Option[] = [
  { value: 'yes', label: 'Áno' },
  { value: 'no', label: 'Nie' },
]

// A short caption above certain steps. Never names dimensions (avoids cueing).
function caption(step: Step): string | null {
  switch (step.kind) {
    case 'stress':
      return 'Za vyčerpania alebo tlaku'
    case 'overclaim':
      return 'Pojmy'
    case 'open':
      return 'Otvorená otázka — nepovinné'
    default:
      return null
  }
}

function Prompt({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-[1.4rem] font-semibold leading-snug tracking-tightish sm:text-[1.55rem]">
      {children}
    </h2>
  )
}

export function StepView({
  step,
  value,
  onAnswer,
}: {
  step: Step
  value: AnswerValue | undefined
  onAnswer: (value: AnswerValue) => void
}) {
  const cap = caption(step)

  // Move focus to the new question on each step so keyboard and screen-reader
  // users land on the prompt (and the view scrolls it into place).
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    ref.current?.focus()
  }, [step.id])

  return (
    <div ref={ref} tabIndex={-1} data-focus-target className="step-enter">
      {cap ? (
        <p className="mb-3 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-accent">
          {cap}
        </p>
      ) : null}

      {step.kind === 'statement' && step.widget === 'frequency' && (
        <>
          <Prompt>{step.text}</Prompt>
          <div className="mt-6">
            <OptionGroup
              ariaLabel={step.text}
              options={FREQUENCY_OPTIONS}
              value={value === undefined ? null : String(value)}
              onChange={(v) => onAnswer(Number(v))}
            />
          </div>
        </>
      )}

      {step.kind === 'statement' && step.widget === 'yesno' && (
        <>
          <Prompt>{step.text}</Prompt>
          <div className="mt-6">
            <OptionGroup
              ariaLabel={step.text}
              options={YESNO_OPTIONS}
              value={value === undefined ? null : value ? 'yes' : 'no'}
              onChange={(v) => onAnswer(v === 'yes')}
            />
          </div>
        </>
      )}

      {step.kind === 'stress' && (
        <>
          <Prompt>{step.item.prompt}</Prompt>
          <div className="mt-6">
            <OptionGroup
              ariaLabel={step.item.prompt}
              options={[
                { value: 'A', label: step.item.options.A },
                { value: 'B', label: step.item.options.B },
                { value: 'none', label: step.item.options.none },
              ]}
              value={value === undefined ? null : String(value)}
              onChange={(v) => onAnswer(v)}
            />
          </div>
        </>
      )}

      {step.kind === 'recovery' && (
        <>
          <Prompt>{step.item.prompt}</Prompt>
          <div className="mt-6">
            <OptionGroup
              ariaLabel={step.item.prompt}
              options={step.item.options.map((o) => ({ value: o.value, label: o.label }))}
              value={value === undefined ? null : String(value)}
              onChange={(v) => onAnswer(v)}
            />
          </div>
        </>
      )}

      {step.kind === 'overclaim' && (
        <>
          <Prompt>{OVERCLAIM_PROMPT}</Prompt>
          <div className="mt-6">
            <MultiToggle
              options={step.terms.map((t) => ({ value: t.id, label: t.label }))}
              selected={Array.isArray(value) ? value : []}
              onToggle={(id) => {
                const current = Array.isArray(value) ? value : []
                onAnswer(
                  current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
                )
              }}
            />
          </div>
        </>
      )}

      {step.kind === 'open' && (
        <>
          <Prompt>{step.item.text}</Prompt>
          <div className="mt-6">
            <textarea
              aria-label={step.item.text}
              value={typeof value === 'string' ? value : ''}
              onChange={(e) => onAnswer(e.target.value)}
              rows={5}
              className="w-full resize-y rounded-2xl border-2 border-line bg-surface px-4 py-3 text-[1rem] leading-relaxed focus-visible:border-accent focus-visible:outline-none"
              placeholder="Píš voľne — alebo nechaj prázdne a pokračuj."
            />
          </div>
        </>
      )}
    </div>
  )
}
