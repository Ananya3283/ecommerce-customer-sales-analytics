# 🛒 E-Commerce Customer Sales Analytics

## About the Project

This project analyzes an online retail dataset containing over 500,000 transactions. The goal was to clean the raw data, perform exploratory analysis, identify valuable customer segments using RFM analysis, store the cleaned data in MySQL, and build an interactive Power BI dashboard to present business insights.

I built this project to practice the complete data analytics workflow—from raw data to an interactive business dashboard.

---

## Problem Statement

Retail businesses generate large amounts of transactional data, but raw data alone doesn't provide useful insights.

This project answers questions such as:

* Which countries generate the highest revenue?
* Which products contribute the most sales?
* Who are the most valuable customers?
* How does revenue change over time?
* Which customers are at risk of not returning?

---

## Tools Used

* Python (Pandas, NumPy, Matplotlib, Seaborn)
* MySQL
* Power BI
* Jupyter Notebook

---

## Project Workflow

### Data Cleaning

The original dataset contained duplicate records, cancelled orders, missing values, and invalid transactions.

Cleaning included:

* Removing duplicate rows
* Handling missing values
* Removing cancelled invoices
* Removing records with negative quantity or price
* Creating a Revenue column

The cleaned dataset contains **505,913 transactions**.

---

### Exploratory Data Analysis

Python was used to understand sales patterns and customer behaviour through visualizations.

Some of the analyses included:

* Monthly revenue trend
* Country-wise sales
* Product performance
* Revenue distribution
* Customer purchase behaviour

---

### Customer Segmentation

RFM (Recency, Frequency and Monetary) analysis was performed to classify customers into different business segments.

Segments include:

* Champions
* Loyal Customers
* Potential Loyalists
* At Risk
* Others

This helps businesses target customers with different marketing strategies.

---

### SQL Analysis

The cleaned dataset was imported into MySQL.

SQL queries were written to analyse:

* Revenue
* Orders
* Products
* Customers
* Countries
* Monthly sales

---

### Power BI Dashboard

An interactive dashboard was developed with:

* KPI Cards
* Monthly Revenue Trend
* Revenue by Country
* Top Products
* Top Customers
* Revenue Distribution
* Country Filter
* Date Filter

---

## Key Insights

* The United Kingdom generated the majority of total revenue.
* A small percentage of customers contributed a large share of sales.
* Revenue increased significantly during the holiday season.
* A few products consistently generated the highest revenue.
* RFM analysis identified both high-value and at-risk customers.

---

## Folder Structure

```
Dataset/
Python/
SQL/
PowerBI/
Dashboard_Images/
README.md
requirements.txt
```

---

## Future Improvements

* Sales forecasting
* Customer churn prediction
* Product recommendation system
* Deploy the dashboard online

---

## Author

**Ananya Rawat**

This project was developed as part of my Data Analytics portfolio to strengthen my skills in Python, SQL and Power BI.
