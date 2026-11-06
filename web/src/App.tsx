import NumberFlow from "@number-flow/react"
import { AnimatePresence, motion } from "motion/react"
import { parseAsString, useQueryStates } from "nuqs"
import { OrderedColumns, Panel, RankBars, TrendLine } from "@/components/charts"
import { Figures } from "@/components/figures"
import { ALL, FilterBar, type Field } from "@/components/filter-bar"
import { PageHeader } from "@/components/page-header"
import { COUNTRIES, MONTHS, SEGMENTS, VIEWS, WEEKDAYS, insights, monthLabel } from "@/data/ecommerce"
import { fmt } from "@/lib/format"

// The country slicer lives in the URL, so a filtered view can be shared as a link
const params = { country: parseAsString.withDefault(ALL) }
const FIELDS: Field[] = [{ key: "country", label: "Country", all: "All countries", options: COUNTRIES }]
const short = (t: string) => (t.length > 30 ? `${t.slice(0, 28)}…` : t)

export default function App() {
  const [q, setQ] = useQueryStates(params)
  const country = COUNTRIES.includes(q.country) ? q.country : ALL
  const v = VIEWS[country]

  const trend = MONTHS.map((m, i) => ({ key: monthLabel(m), revenue: v.monthly[i][0] }))
  const identified = v.segments.reduce((t, s) => t + (s[1] ?? 0), 0)
  const segShare = [
    ...SEGMENTS.map((s, i) => ({ key: s, value: (v.segments[i][1] ?? 0) / v.revenue, detail: `${fmt(v.segments[i][1], "gbp")} from ${fmt(v.segments[i][0], "int")} customers` })),
    { key: "No customer ID", value: (v.revenue - identified) / v.revenue, detail: `${fmt(v.revenue - identified, "gbp")} from guest checkouts` },
  ]
  const hours = Object.keys(v.hour).map(Number).sort((a, b) => a - b)

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-8">
      <PageHeader
        title="E-commerce customers"
        dataset="Online Retail II (UCI), 502,416 transactions, Dec 2009 to Dec 2010."
        repo="https://github.com/Ananya3283/ecommerce-customer-sales-analytics"
        linkText="Notebooks, SQL and Power BI on GitHub"
      />

      <div className="sticky top-0 z-20 -mx-4 mt-6 border-b bg-background/90 px-4 py-4 backdrop-blur sm:-mx-8 sm:px-8">
        <FilterBar fields={FIELDS} value={{ country }} onChange={(k, val) => setQ({ [k]: val === ALL ? null : val })} />
      </div>

      <main className="mt-10 space-y-12">
        <section className="grid items-start gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <h1 className="text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-5xl">
              <NumberFlow value={v.revenue} format={{ style: "currency", currency: "GBP", notation: "compact", maximumFractionDigits: 2 }} /> revenue.{" "}
              <span className="text-leaver">
                <NumberFlow value={v.customers} /> customers.
              </span>
            </h1>
            <h2 className="mt-8 text-base font-semibold">What stands out</h2>
            <ul className="mt-2 space-y-2.5">
              <AnimatePresence mode="popLayout" initial={false}>
                {insights(country).map((t) => (
                  <motion.li
                    key={t}
                    layout
                    initial={{ opacity: 0, y: 4, filter: "blur(2px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(2px)", transition: { duration: 0.15 } }}
                    transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="border-l-2 border-leaver pl-3 leading-snug"
                  >
                    {t}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
          <Panel title="Revenue by month" note="Hover the line to read a month. December 2010 covers the 1st to the 9th only.">
            <TrendLine data={trend} series={[{ key: "revenue", label: "Revenue", color: "var(--left)" }]} format="gbp" height={300} />
          </Panel>
        </section>

        <Figures
          items={[
            { label: "Revenue", value: v.revenue, format: "gbp" },
            { label: "Orders", value: v.orders, format: "int" },
            { label: "Customers", value: v.customers, format: "int", tone: "left" },
            { label: "Avg order value", value: v.revenue / v.orders, format: "int", prefix: "£" },
            { label: "Products sold", value: v.products, format: "int" },
            { label: "Units sold", value: v.units, format: "money" },
          ]}
        />

        <div className="grid gap-x-12 gap-y-10 lg:grid-cols-2">
          <Panel title="Share of revenue by RFM segment" note="Customers scored on recency, frequency and spend, as in the notebook.">
            <RankBars data={segShare} format="pct" labelWidth={150} sort={false} />
          </Panel>
          <Panel title="Customers by RFM segment" note="Hover a bar for average days since last order.">
            <RankBars
              data={SEGMENTS.map((s, i) => ({ key: s, value: v.segments[i][0] ?? 0, detail: v.segments[i][2] != null ? `last order ${Math.round(v.segments[i][2]!)} days ago on average, ${v.segments[i][3]!.toFixed(1)} orders` : undefined }))}
              format="int"
              labelWidth={150}
              color="var(--kept)"
              sort={false}
            />
          </Panel>
          <Panel title="Top 10 products by revenue" note="Hover a bar for the full product name.">
            <RankBars data={v.topProducts.map(([k, val]) => ({ key: short(k), value: val, detail: k }))} format="gbp" labelWidth={230} color="var(--kept)" />
          </Panel>
          <Panel title="Revenue by country" note="The 10 countries with the most revenue.">
            <RankBars data={COUNTRIES.map((c) => ({ key: c, value: VIEWS[c].revenue }))} format="gbp" labelWidth={120} color="var(--kept)" />
          </Panel>
          <Panel title="Orders by day of the week">
            <OrderedColumns data={WEEKDAYS.map((d, i) => ({ key: d, value: v.weekday[i] }))} format="int" />
          </Panel>
          <Panel title="Orders by hour of the day" note="Shop time, 24-hour clock.">
            <OrderedColumns data={hours.map((h) => ({ key: String(h), value: v.hour[String(h)] }))} format="int" labels={false} />
          </Panel>
        </div>
      </main>
    </div>
  )
}
