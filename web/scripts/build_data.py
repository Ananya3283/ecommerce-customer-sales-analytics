"""Builds web/src/data/ecommerce.json from online_retail_cleaned.csv.

Run from the repo root:  python web/scripts/build_data.py
The RFM scoring and segment rules are copied from 03_Customer_Analytics.ipynb so the numbers match the notebook.
Summaries are pre-computed for "All" and the 10 countries with the most revenue.
"""
import json
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
df = pd.read_csv(ROOT / "online_retail_cleaned.csv", dtype={"Invoice": str}, low_memory=False)
df["InvoiceDate"] = pd.to_datetime(df["InvoiceDate"])
df["month"] = df["InvoiceDate"].dt.strftime("%Y-%m")

# ---------- RFM, exactly as in 03_Customer_Analytics.ipynb
rfm_df = df.dropna(subset=["Customer ID"]).copy()
analysis_date = rfm_df["InvoiceDate"].max() + pd.Timedelta(days=1)
rfm = rfm_df.groupby("Customer ID").agg({"InvoiceDate": lambda x: (analysis_date - x.max()).days, "Invoice": "nunique", "Revenue": "sum"})
rfm.columns = ["Recency", "Frequency", "Monetary"]
rfm["R_Score"] = pd.qcut(rfm["Recency"], q=5, labels=[5, 4, 3, 2, 1]).astype(int)
rfm["F_Score"] = pd.qcut(rfm["Frequency"].rank(method="first"), q=5, labels=[1, 2, 3, 4, 5]).astype(int)
rfm["M_Score"] = pd.qcut(rfm["Monetary"], q=5, labels=[1, 2, 3, 4, 5]).astype(int)

def customer_segment(row):
    if row["R_Score"] >= 4 and row["F_Score"] >= 4 and row["M_Score"] >= 4:
        return "Champions"
    elif row["R_Score"] >= 3 and row["F_Score"] >= 4:
        return "Loyal Customers"
    elif row["R_Score"] >= 4 and row["F_Score"] <= 2:
        return "Potential Loyalists"
    elif row["R_Score"] <= 2 and row["F_Score"] >= 4:
        return "At Risk"
    else:
        return "Others"

rfm["Segment"] = rfm.apply(customer_segment, axis=1)
# Each customer's country = where most of their revenue came from
rfm["Country"] = rfm_df.groupby(["Customer ID", "Country"])["Revenue"].sum().reset_index().sort_values("Revenue").groupby("Customer ID").tail(1).set_index("Customer ID")["Country"]

SEGMENTS = ["Champions", "Loyal Customers", "Potential Loyalists", "At Risk", "Others"]
WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
months = sorted(df["month"].unique())
countries = df.groupby("Country")["Revenue"].sum().sort_values(ascending=False).head(10).index.tolist()

def summary(d, r):
    inv = d.drop_duplicates("Invoice")
    monthly = d.groupby("month").agg(revenue=("Revenue", "sum"), orders=("Invoice", "nunique")).reindex(months, fill_value=0)
    top = d.groupby("Description")["Revenue"].sum().sort_values(ascending=False).head(10)
    seg = r.groupby("Segment").agg(customers=("Monetary", "size"), revenue=("Monetary", "sum"), recency=("Recency", "mean"), frequency=("Frequency", "mean")).reindex(SEGMENTS)
    return {
        "revenue": round(float(d["Revenue"].sum()), 2),
        "orders": int(d["Invoice"].nunique()),
        "customers": int(d["Customer ID"].nunique()),
        "products": int(d["StockCode"].nunique()),
        "units": int(d["Quantity"].sum()),
        "monthly": [[round(float(v), 2), int(o)] for v, o in zip(monthly["revenue"], monthly["orders"])],
        "topProducts": [[str(k).strip().title(), round(float(v), 2)] for k, v in top.items()],
        "weekday": [int((inv["InvoiceDate"].dt.dayofweek == i).sum()) for i in range(7)],
        "hour": {str(h): int(c) for h, c in inv["InvoiceDate"].dt.hour.value_counts().sort_index().items()},
        "segments": [[None if pd.isna(x) else (int(x) if i == 0 else round(float(x), 2)) for i, x in enumerate(row)] for row in seg[["customers", "revenue", "recency", "frequency"]].itertuples(index=False)],
    }

out = {"months": months, "segments": SEGMENTS, "weekdays": WEEKDAYS, "countries": countries, "views": {"All": summary(df, rfm)}}
for c in countries:
    out["views"][c] = summary(df[df["Country"] == c], rfm[rfm["Country"] == c])

dest = ROOT / "web" / "src" / "data" / "ecommerce.json"
dest.parent.mkdir(parents=True, exist_ok=True)
dest.write_text(json.dumps(out, separators=(",", ":"), ensure_ascii=False), encoding="utf-8")
a = out["views"]["All"]
ch = rfm[rfm.Segment == "Champions"]
print(f"-> {dest.relative_to(ROOT)} ({dest.stat().st_size/1024:.0f} KB) | rows {len(df):,}")
print(f"revenue {a['revenue']:,.2f} orders {a['orders']:,} customers {a['customers']:,} | months {months[0]}..{months[-1]}")
print(f"champions {len(ch)/len(rfm):.1%} of customers, revenue {ch.Monetary.sum():,.0f} = {ch.Monetary.sum()/rfm.Monetary.sum():.1%} | UK share {out['views']['United Kingdom']['revenue']/a['revenue']:.1%}")
