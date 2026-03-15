import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { calculate, type CalculationResult, type OutcomeResult } from './calculator'

interface OutcomeInput {
  id: string
  label: string
  price: string
  investment: string
}

let nextId = 0
const uid = () => `o-${++nextId}`

const DEFAULT_OUTCOMES: OutcomeInput[] = [
  { id: uid(), label: 'Yes', price: '65', investment: '' },
  { id: uid(), label: 'No', price: '35', investment: '' },
]

function fmt(n: number, decimals = 2) {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

function fmtCompact(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 10_000) return `${(n / 1_000).toFixed(1)}K`
  return fmt(n)
}

export default function App() {
  const [investment, setInvestment] = useState('100')
  const [outcomes, setOutcomes] = useState<OutcomeInput[]>(DEFAULT_OUTCOMES)
  const [useCustomDist, setUseCustomDist] = useState(false)

  const updateOutcome = useCallback(
    (id: string, field: keyof OutcomeInput, value: string) => {
      setOutcomes((prev) =>
        prev.map((o) => (o.id === id ? { ...o, [field]: value } : o))
      )
    },
    []
  )

  const addOutcome = () => {
    setOutcomes((prev) => [
      ...prev,
      { id: uid(), label: `Outcome ${prev.length + 1}`, price: '10', investment: '' },
    ])
  }

  const removeOutcome = (id: string) => {
    if (outcomes.length <= 2) return
    setOutcomes((prev) => prev.filter((o) => o.id !== id))
  }

  const result: CalculationResult | null = useMemo(() => {
    const inv = parseFloat(investment)
    if (!inv || inv <= 0) return null

    const prices = outcomes.map((o) => parseFloat(o.price))
    if (prices.some((p) => isNaN(p) || p <= 0 || p > 99)) return null

    const labels = outcomes.map((o) => o.label || `Outcome`)

    if (useCustomDist) {
      const dist = outcomes.map((o) => parseFloat(o.investment))
      if (dist.some((d) => isNaN(d) || d < 0)) return null
      const sum = dist.reduce((a, b) => a + b, 0)
      if (Math.abs(sum - inv) > 0.01) return null
      return calculate(inv, prices, labels, dist)
    }

    return calculate(inv, prices, labels)
  }, [investment, outcomes, useCustomDist])

  const priceSum = outcomes.reduce((s, o) => s + (parseFloat(o.price) || 0), 0)
  const distSum = outcomes.reduce((s, o) => s + (parseFloat(o.investment) || 0), 0)
  const inv = parseFloat(investment) || 0
  const distError = useCustomDist && Math.abs(distSum - inv) > 0.01

  return (
    <div className="min-h-screen pb-safe">
      <div className="noise-overlay" />

      {/* Header */}
      <header className="border-b border-[var(--border)] relative sticky top-0 z-50 bg-[var(--bg-primary)]/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-3 sm:py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--blue)] flex items-center justify-center font-bold text-[var(--bg-primary)] text-xs sm:text-sm shrink-0">
              P
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-semibold tracking-tight text-[var(--text-primary)]">
                Polymarket Calculator
              </h1>
              <p className="text-[10px] sm:text-xs text-[var(--text-muted)] -mt-0.5 hidden sm:block">
                Multi-outcome odds & returns
              </p>
            </div>
          </div>
          <a
            href="https://github.com/Neelkukreti/polymarket-odds-calc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors text-sm flex items-center gap-1.5 p-1"
          >
            <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
        <div className="glow-line" />
      </header>

      <main className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 grid lg:grid-cols-[380px_1fr] gap-4 sm:gap-6">
        {/* Input Panel */}
        <div className="space-y-3 sm:space-y-4">
          {/* Investment */}
          <section className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-3 sm:p-4">
            <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
              Total Investment
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-mono text-sm">$</span>
              <input
                type="number"
                inputMode="decimal"
                value={investment}
                onChange={(e) => setInvestment(e.target.value)}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg py-3 pl-7 pr-3 text-[var(--text-primary)] font-mono text-base focus:outline-none focus:border-[var(--accent-mid)] transition-colors"
                placeholder="100"
                min="0"
                step="any"
              />
            </div>
          </section>

          {/* Outcomes */}
          <section className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                Outcomes
              </label>
              <span
                className={`font-mono text-xs px-1.5 py-0.5 rounded ${
                  Math.abs(priceSum - 100) < 1
                    ? 'text-[var(--positive)] bg-[var(--positive-dim)]'
                    : priceSum > 100
                      ? 'text-[var(--negative)] bg-[var(--negative-dim)]'
                      : 'text-[var(--amber)] bg-[var(--amber-dim)]'
                }`}
              >
                {fmt(priceSum, 1)}c
              </span>
            </div>

            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {outcomes.map((o) => (
                  <motion.div
                    key={o.id}
                    layout
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="flex gap-1.5 sm:gap-2 items-center"
                  >
                    <input
                      type="text"
                      value={o.label}
                      onChange={(e) => updateOutcome(o.id, 'label', e.target.value)}
                      className="flex-1 min-w-0 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg py-2.5 px-2.5 sm:px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-mid)] transition-colors"
                      placeholder="Label"
                    />
                    <div className="relative w-[72px] sm:w-20 shrink-0">
                      <input
                        type="number"
                        inputMode="decimal"
                        value={o.price}
                        onChange={(e) => updateOutcome(o.id, 'price', e.target.value)}
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg py-2.5 pl-2.5 pr-5 text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-mid)] transition-colors"
                        placeholder="50"
                        min="0.1"
                        max="99"
                        step="any"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xs">c</span>
                    </div>
                    {useCustomDist && (
                      <div className="relative w-[72px] sm:w-20 shrink-0">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xs">$</span>
                        <input
                          type="number"
                          inputMode="decimal"
                          value={o.investment}
                          onChange={(e) =>
                            updateOutcome(o.id, 'investment', e.target.value)
                          }
                          className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg py-2.5 pl-5 pr-2 text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-mid)] transition-colors"
                          placeholder="0"
                          min="0"
                          step="any"
                        />
                      </div>
                    )}
                    <button
                      onClick={() => removeOutcome(o.id)}
                      disabled={outcomes.length <= 2}
                      className="w-8 h-8 sm:w-7 sm:h-7 shrink-0 rounded-md flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--negative)] hover:bg-[var(--negative-dim)] active:bg-[var(--negative-dim)] disabled:opacity-20 disabled:cursor-not-allowed transition-colors text-base sm:text-xs"
                    >
                      &times;
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <button
              onClick={addOutcome}
              className="mt-3 w-full py-2.5 sm:py-2 rounded-lg border border-dashed border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent-mid)] hover:text-[var(--accent)] active:text-[var(--accent)] active:border-[var(--accent-mid)] transition-colors text-sm"
            >
              + Add Outcome
            </button>
          </section>

          {/* Distribution Toggle */}
          <section className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-3 sm:p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  Distribution
                </label>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {useCustomDist ? 'Custom amounts per outcome' : 'Equal split across all'}
                </p>
              </div>
              <button
                onClick={() => setUseCustomDist(!useCustomDist)}
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                  useCustomDist ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    useCustomDist ? 'left-[22px]' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
            {distError && (
              <p className="mt-2 text-xs text-[var(--negative)] font-mono">
                Sum ${fmt(distSum)} must equal ${fmt(inv)}
              </p>
            )}
          </section>

          {/* Quick presets */}
          <section className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-3 sm:p-4">
            <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
              Quick Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Binary (60/40)', prices: [60, 40], labels: ['Yes', 'No'] },
                { name: 'Three-way', prices: [50, 30, 20], labels: ['A', 'B', 'C'] },
                { name: 'Long shot 4x', prices: [3, 5, 12, 80], labels: ['Longshot', 'Unlikely', 'Maybe', 'Favorite'] },
                { name: 'Even spread', prices: [25, 25, 25, 25], labels: ['A', 'B', 'C', 'D'] },
              ].map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setOutcomes(
                      preset.prices.map((p, i) => ({
                        id: uid(),
                        label: preset.labels[i],
                        price: String(p),
                        investment: '',
                      }))
                    )
                    setUseCustomDist(false)
                  }}
                  className="py-2.5 sm:py-2 px-3 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-xs text-[var(--text-secondary)] hover:border-[var(--accent-mid)] hover:text-[var(--accent)] active:text-[var(--accent)] active:border-[var(--accent-mid)] transition-colors text-left"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Results Panel */}
        <div className="space-y-3 sm:space-y-4">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-3 sm:space-y-4"
              >
                {/* Summary cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  <StatCard
                    label="Best ROI"
                    value={`${fmt(result.bestRoi.roi)}x`}
                    sub={result.bestRoi.label}
                    accent="positive"
                  />
                  <StatCard
                    label="Best Payout"
                    value={`$${fmtCompact(result.bestRoi.payout)}`}
                    sub={`if ${result.bestRoi.label} wins`}
                    accent="blue"
                  />
                  <StatCard
                    label="Worst ROI"
                    value={`${fmt(result.worstRoi.roi)}x`}
                    sub={result.worstRoi.label}
                    accent={result.worstRoi.roi >= 1 ? 'amber' : 'negative'}
                  />
                  <StatCard
                    label="Profitable"
                    value={`${result.profitableCount}/${result.outcomes.length}`}
                    sub={`breakeven ~${fmt(result.breakevenPrice, 1)}c`}
                    accent={
                      result.profitableCount === result.outcomes.length
                        ? 'positive'
                        : 'amber'
                    }
                  />
                </div>

                {/* Desktop: Table | Mobile: Cards */}
                <div className="hidden sm:block rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[var(--border)] text-[var(--text-muted)]">
                          <th className="text-left py-3 px-4 font-medium text-xs uppercase tracking-wider">Outcome</th>
                          <th className="text-right py-3 px-4 font-medium text-xs uppercase tracking-wider">Price</th>
                          <th className="text-right py-3 px-4 font-medium text-xs uppercase tracking-wider">Invested</th>
                          <th className="text-right py-3 px-4 font-medium text-xs uppercase tracking-wider">Shares</th>
                          <th className="text-right py-3 px-4 font-medium text-xs uppercase tracking-wider">Payout</th>
                          <th className="text-right py-3 px-4 font-medium text-xs uppercase tracking-wider">Profit</th>
                          <th className="text-right py-3 px-4 font-medium text-xs uppercase tracking-wider">ROI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.outcomes.map((o, i) => (
                          <motion.tr
                            key={o.index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04, duration: 0.2 }}
                            className={`border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--bg-card-hover)] transition-colors ${
                              o.index === result.bestRoi.index
                                ? 'bg-[var(--positive-dim)]'
                                : ''
                            }`}
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-2 h-2 rounded-full shrink-0"
                                  style={{
                                    background:
                                      o.index === result.bestRoi.index
                                        ? 'var(--positive)'
                                        : o.index === result.worstRoi.index
                                          ? 'var(--negative)'
                                          : 'var(--text-muted)',
                                  }}
                                />
                                <span className="font-medium truncate">{o.label}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right font-mono text-[var(--text-secondary)]">
                              {fmt(o.priceCents, 1)}c
                            </td>
                            <td className="py-3 px-4 text-right font-mono text-[var(--text-secondary)]">
                              ${fmt(o.investment)}
                            </td>
                            <td className="py-3 px-4 text-right font-mono text-[var(--text-secondary)]">
                              {fmtCompact(o.shares)}
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-medium text-[var(--blue)]">
                              ${fmtCompact(o.payout)}
                            </td>
                            <td
                              className={`py-3 px-4 text-right font-mono font-medium ${
                                o.isProfit ? 'text-[var(--positive)]' : 'text-[var(--negative)]'
                              }`}
                            >
                              {o.profit >= 0 ? '+' : ''}${fmtCompact(o.profit)}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <RoiBadge roi={o.roi} isBest={o.index === result.bestRoi.index} />
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile: Outcome Cards */}
                <div className="sm:hidden space-y-2">
                  {result.outcomes.map((o, i) => (
                    <MobileOutcomeCard
                      key={o.index}
                      outcome={o}
                      isBest={o.index === result.bestRoi.index}
                      isWorst={o.index === result.worstRoi.index}
                      index={i}
                    />
                  ))}
                </div>

                {/* Visual bar chart */}
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-3 sm:p-4">
                  <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3">
                    ROI Comparison
                  </label>
                  <div className="space-y-2.5">
                    {result.outcomes.map((o) => (
                      <RoiBar key={o.index} outcome={o} maxRoi={result.bestRoi.roi} />
                    ))}
                  </div>
                </div>

                {/* Scenario cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <ScenarioCard outcome={result.bestRoi} totalInvestment={result.totalInvestment} type="best" />
                  <ScenarioCard outcome={result.worstRoi} totalInvestment={result.totalInvestment} type="worst" />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-card)] p-8 sm:p-12 text-center"
              >
                <div className="text-3xl sm:text-4xl mb-3 opacity-40">&#x1F4CA;</div>
                <p className="text-[var(--text-muted)] text-sm">
                  Enter investment amount and valid outcome prices to see results
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] mt-6 sm:mt-8">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between text-[10px] sm:text-xs text-[var(--text-muted)]">
          <span>Polymarket Odds Calculator</span>
          <span>Not financial advice. DYOR.</span>
        </div>
      </footer>
    </div>
  )
}

/* ---------- Sub-components ---------- */

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string
  sub: string
  accent: 'positive' | 'negative' | 'blue' | 'amber'
}) {
  const colors = {
    positive: { text: 'var(--positive)', bg: 'var(--positive-dim)' },
    negative: { text: 'var(--negative)', bg: 'var(--negative-dim)' },
    blue: { text: 'var(--blue)', bg: 'var(--blue-dim)' },
    amber: { text: 'var(--amber)', bg: 'var(--amber-dim)' },
  }
  const c = colors[accent]

  return (
    <div
      className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-2.5 sm:p-3.5 hover:border-opacity-60 transition-colors"
      style={{ borderColor: `color-mix(in srgb, ${c.text} 20%, var(--border))` }}
    >
      <p className="text-[9px] sm:text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider mb-0.5 sm:mb-1">{label}</p>
      <p className="font-mono text-lg sm:text-xl font-bold truncate" style={{ color: c.text }}>
        {value}
      </p>
      <p className="text-[9px] sm:text-[10px] text-[var(--text-muted)] mt-0.5 truncate">{sub}</p>
    </div>
  )
}

function MobileOutcomeCard({
  outcome,
  isBest,
  isWorst,
  index,
}: {
  outcome: OutcomeResult
  isBest: boolean
  isWorst: boolean
  index: number
}) {
  const dotColor = isBest
    ? 'var(--positive)'
    : isWorst
      ? 'var(--negative)'
      : 'var(--text-muted)'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
      className={`rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-3 ${
        isBest ? 'bg-[var(--positive-dim)] border-[color-mix(in_srgb,var(--positive)_25%,var(--border))]' : ''
      }`}
    >
      {/* Top row: name + ROI badge */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: dotColor }}
          />
          <span className="font-medium text-sm text-[var(--text-primary)] truncate">
            {outcome.label}
          </span>
          <span className="font-mono text-xs text-[var(--text-muted)]">
            {fmt(outcome.priceCents, 1)}c
          </span>
        </div>
        <RoiBadge roi={outcome.roi} isBest={isBest} />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-2">
        <div>
          <p className="text-[9px] text-[var(--text-muted)] uppercase">Invested</p>
          <p className="font-mono text-xs text-[var(--text-secondary)]">${fmtCompact(outcome.investment)}</p>
        </div>
        <div>
          <p className="text-[9px] text-[var(--text-muted)] uppercase">Shares</p>
          <p className="font-mono text-xs text-[var(--text-secondary)]">{fmtCompact(outcome.shares)}</p>
        </div>
        <div>
          <p className="text-[9px] text-[var(--text-muted)] uppercase">Payout</p>
          <p className="font-mono text-xs font-medium text-[var(--blue)]">${fmtCompact(outcome.payout)}</p>
        </div>
        <div>
          <p className="text-[9px] text-[var(--text-muted)] uppercase">Profit</p>
          <p
            className="font-mono text-xs font-medium"
            style={{ color: outcome.isProfit ? 'var(--positive)' : 'var(--negative)' }}
          >
            {outcome.profit >= 0 ? '+' : ''}${fmtCompact(outcome.profit)}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

function RoiBadge({ roi, isBest }: { roi: number; isBest: boolean }) {
  const color = roi >= 2 ? 'var(--positive)' : roi >= 1 ? 'var(--amber)' : 'var(--negative)'
  const bg = roi >= 2 ? 'var(--positive-dim)' : roi >= 1 ? 'var(--amber-dim)' : 'var(--negative-dim)'

  return (
    <span
      className="inline-flex items-center gap-1 font-mono text-xs font-semibold px-2 py-0.5 rounded-md shrink-0"
      style={{ color, background: bg }}
    >
      {isBest && <span className="text-[10px]">&#9733;</span>}
      {fmt(roi)}x
    </span>
  )
}

function RoiBar({ outcome, maxRoi }: { outcome: OutcomeResult; maxRoi: number }) {
  const pct = maxRoi > 0 ? (outcome.roi / maxRoi) * 100 : 0
  const color = outcome.roi >= 2 ? 'var(--positive)' : outcome.roi >= 1 ? 'var(--amber)' : 'var(--negative)'

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <span className="w-16 sm:w-20 text-xs text-[var(--text-secondary)] truncate shrink-0">
        {outcome.label}
      </span>
      <div className="flex-1 h-5 rounded-md bg-[var(--bg-secondary)] overflow-hidden relative">
        <motion.div
          className="h-full rounded-md"
          style={{ background: `linear-gradient(90deg, ${color}44, ${color}aa)` }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(pct, 2)}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      <span className="w-12 sm:w-14 text-right font-mono text-xs font-semibold" style={{ color }}>
        {fmt(outcome.roi)}x
      </span>
    </div>
  )
}

function ScenarioCard({
  outcome,
  totalInvestment,
  type,
}: {
  outcome: OutcomeResult
  totalInvestment: number
  type: 'best' | 'worst'
}) {
  const isBest = type === 'best'
  const borderColor = isBest ? 'var(--positive)' : 'var(--negative)'

  return (
    <div
      className="rounded-xl border bg-[var(--bg-card)] p-3 sm:p-4"
      style={{ borderColor: `color-mix(in srgb, ${borderColor} 30%, var(--border))` }}
    >
      <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
        <span
          className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded"
          style={{
            color: borderColor,
            background: isBest ? 'var(--positive-dim)' : 'var(--negative-dim)',
          }}
        >
          {isBest ? 'Best Case' : 'Worst Case'}
        </span>
        <span className="text-xs sm:text-sm font-medium text-[var(--text-secondary)] truncate">{outcome.label} wins</span>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
        <div>
          <p className="text-[9px] sm:text-[10px] text-[var(--text-muted)] uppercase mb-0.5">Payout</p>
          <p className="font-mono text-xs sm:text-sm font-bold text-[var(--blue)]">${fmtCompact(outcome.payout)}</p>
        </div>
        <div>
          <p className="text-[9px] sm:text-[10px] text-[var(--text-muted)] uppercase mb-0.5">Profit</p>
          <p
            className="font-mono text-xs sm:text-sm font-bold"
            style={{ color: outcome.isProfit ? 'var(--positive)' : 'var(--negative)' }}
          >
            {outcome.profit >= 0 ? '+' : ''}${fmtCompact(outcome.profit)}
          </p>
        </div>
        <div>
          <p className="text-[9px] sm:text-[10px] text-[var(--text-muted)] uppercase mb-0.5">ROI</p>
          <p className="font-mono text-xs sm:text-sm font-bold" style={{ color: borderColor }}>
            {fmt(outcome.roi)}x
          </p>
        </div>
      </div>
      <div className="mt-2.5 sm:mt-3 h-1 rounded-full bg-[var(--bg-secondary)] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: borderColor }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min((outcome.payout / totalInvestment) * 10, 100)}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
