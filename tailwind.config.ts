import type { Config } from 'tailwindcss'

// Design tokens for the cobalt system (v4). Colours are driven by CSS vars in
// globals.css so the palette lives in one place.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        panel: 'var(--panel)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        faint: 'var(--faint)',
        line: 'var(--line)',
        track: 'var(--track)',
        accent: {
          DEFAULT: 'var(--accent)',
          strong: 'var(--accent-strong)',
          wash: 'var(--accent-wash)',
          line: 'var(--accent-line)',
        },
        spark: {
          DEFAULT: 'var(--spark)',
          deep: 'var(--spark-deep)',
          wash: 'var(--spark-wash)',
        },
      },
      fontFamily: {
        // Heavy grotesque display (data-journalism), serif accent, mono for data.
        display: ['Helvetica Neue', 'Helvetica', 'Segoe UI', 'system-ui', 'Arial', 'sans-serif'],
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: [
          'Iowan Old Style',
          'Palatino Linotype',
          'Palatino',
          'Georgia',
          'Times New Roman',
          'serif',
        ],
        mono: ['ui-monospace', 'SF Mono', 'Menlo', 'Consolas', 'monospace'],
      },
      maxWidth: {
        prose: '38rem',
      },
      letterSpacing: {
        tightish: '-0.02em',
        tighter2: '-0.035em',
      },
    },
  },
  plugins: [],
}

export default config
