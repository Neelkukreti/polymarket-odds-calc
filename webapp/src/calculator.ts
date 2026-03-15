export interface OutcomeResult {
  index: number
  label: string
  priceCents: number
  investment: number
  shares: number
  payout: number
  profit: number
  roi: number
  isProfit: boolean
}

export interface CalculationResult {
  outcomes: OutcomeResult[]
  totalInvestment: number
  bestRoi: OutcomeResult
  worstRoi: OutcomeResult
  profitableCount: number
  breakevenPrice: number
  strategy: 'equal' | 'custom'
}

export function calculate(
  totalInvestment: number,
  prices: number[],
  labels: string[],
  distribution?: number[]
): CalculationResult {
  const n = prices.length
  const investments = distribution ?? prices.map(() => totalInvestment / n)
  const strategy = distribution ? 'custom' : 'equal'

  const outcomes: OutcomeResult[] = prices.map((priceCents, i) => {
    const priceDollars = priceCents / 100
    const investment = investments[i]
    const shares = investment / priceDollars
    const payout = shares // $1 per share if wins
    const profit = payout - totalInvestment
    const roi = totalInvestment > 0 ? payout / totalInvestment : 0

    return {
      index: i + 1,
      label: labels[i] || `Outcome ${i + 1}`,
      priceCents,
      investment,
      shares,
      payout,
      profit,
      roi,
      isProfit: profit > 0,
    }
  })

  const bestRoi = outcomes.reduce((a, b) => (a.roi > b.roi ? a : b))
  const worstRoi = outcomes.reduce((a, b) => (a.roi < b.roi ? a : b))
  const profitableCount = outcomes.filter((o) => o.isProfit).length
  const breakevenPrice = 100 / n

  return {
    outcomes,
    totalInvestment,
    bestRoi,
    worstRoi,
    profitableCount,
    breakevenPrice,
    strategy,
  }
}
