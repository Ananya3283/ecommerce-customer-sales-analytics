// Summaries of online_retail_cleaned.csv (built by web/scripts/build_data.py), for "All" and the top 10 countries.
import raw from "./ecommerce.json"

export type View = {
  revenue: number
  orders: number
  customers: number
  products: number
  units: number
  /** Per month: [revenue, orders] */
  monthly: [number, number][]
  topProducts: [string, number][]
  weekday: number[]
  hour: Record<string, number>
  /** Per segment: [customers, revenue, avg recency days, avg orders] */
  segments: [number | null, number | null, number | null, number | null][]
}

type Raw = { months: string[]; segments: string[]; weekdays: string[]; countries: string[]; views: Record<string, View> }
const data = raw as unknown as Raw

export const MONTHS = data.months
export const SEGMENTS = data.segments
export const WEEKDAYS = data.weekdays
export const COUNTRIES = data.countries
export const VIEWS = data.views

export const monthLabel = (m: string) => new Date(`${m}-01T00:00:00`).toLocaleDateString("en-US", { month: "short", year: "2-digit" })
const gbp = (v: number) => (v >= 1e6 ? `£${(v / 1e6).toFixed(2)}M` : `£${(v / 1e3).toFixed(1)}K`)

/** Plain-language findings for the selected country. */
export function insights(country: string): string[] {
  const v = VIEWS[country]
  const all = VIEWS.All
  const out: string[] = []
  if (country !== "All") out.push(`${country} brought in ${gbp(v.revenue)}, ${((v.revenue / all.revenue) * 100).toFixed(1)}% of all revenue.`)
  else out.push(`The United Kingdom brought in ${((VIEWS["United Kingdom"].revenue / all.revenue) * 100).toFixed(0)}% of all revenue.`)
  const champ = v.segments[0]
  if (champ[0] && v.customers) out.push(`Champions are ${((champ[0] / v.customers) * 100).toFixed(0)}% of customers but ${(((champ[1] ?? 0) / v.revenue) * 100).toFixed(0)}% of revenue.`)
  const best = v.monthly.reduce((b, m, i) => (m[0] > v.monthly[b][0] ? i : b), 0)
  out.push(`${new Date(`${MONTHS[best]}-01T00:00:00`).toLocaleDateString("en-US", { month: "long", year: "numeric" })} was the best month at ${gbp(v.monthly[best][0])}.`)
  const day = v.weekday.indexOf(Math.max(...v.weekday))
  out.push(`${["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][day]} gets the most orders${v.weekday[5] === 0 ? ", and there are none on Saturdays" : ""}.`)
  return out
}
