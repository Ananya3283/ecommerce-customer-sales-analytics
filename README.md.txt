# E-Commerce Customer Sales Analytics

An end-to-end Data Analytics project built using **Python, MySQL, and Power BI** to analyze online retail transactions and generate actionable business insights.

This project covers the complete analytics workflow, including data cleaning, exploratory data analysis (EDA), customer segmentation using RFM analysis, SQL-based business reporting, and an interactive Power BI dashboard.

---

## Project Objective

The objective of this project was to transform raw e-commerce transaction data into meaningful business insights. The analysis focuses on understanding customer purchasing behavior, identifying top-performing products, tracking revenue trends, and segmenting customers based on their buying patterns.

---

## Dataset

* **Dataset:** Online Retail II
* **Transactions after cleaning:** **505,193**
* **Data Period:** December 2009 – December 2010

> The original dataset is not included in this repository due to its size.

---

## Tools & Technologies

* Python
* Pandas
* NumPy
* Matplotlib
* Seaborn
* MySQL
* Power BI
* Jupyter Notebook

---

## Project Workflow

### Data Cleaning

The raw dataset was cleaned using Python by:

* Removing duplicate records
* Handling missing values
* Removing cancelled transactions
* Filtering invalid quantities and prices
* Creating a Revenue column for sales analysis

The cleaned dataset was then used throughout the project.

---

### Exploratory Data Analysis

EDA was performed to understand sales patterns and customer behavior.

Some of the key analyses include:

* Monthly Revenue Trend
* Revenue by Country
* Top Selling Products
* Revenue Distribution
* Customer Purchase Behaviour

---

### Customer Segmentation (RFM Analysis)

Customers were segmented using **Recency, Frequency and Monetary (RFM)** analysis into the following groups:

* Champions
* Loyal Customers
* Potential Loyalists
* At Risk
* Others

This segmentation helps identify high-value customers and customers who may require retention strategies.

---

### SQL Analysis

The cleaned dataset was imported into MySQL, where SQL queries were used to analyze:

* Total Revenue
* Total Orders
* Monthly Sales
* Country-wise Revenue
* Top Products
* Top Customers
* Average Order Value
* Customer Spending Patterns

---

### Power BI Dashboard

An interactive dashboard was created to present the analysis.

The dashboard includes:

* Total Revenue
* Total Orders
* Total Customers
* Products Sold
* Average Order Value
* Monthly Revenue Trend
* Revenue by Country
* Top Products by Revenue
* Top Customers by Revenue
* Country and Date Slicers

---

## Key Insights

* The United Kingdom generated the highest revenue.
* A small group of customers contributed a significant share of total sales.
* Revenue showed noticeable seasonal trends throughout the year.
* RFM analysis identified valuable customer segments as well as customers at risk of churn.

---

## Repository Structure

```
Ecommerce_Customer_Sales_Analytics/
│
├── Dataset/
├── Python/
├── SQL/
├── PowerBI/
├── Dashboard_Images/
├── README.md
└── requirements.txt
```

---

## Dashboard Preview

Add a screenshot of your Power BI dashboard in the `Dashboard_Images` folder and display it here.

```markdown
![Dashboard](Dashboard_Images/dashboard.png)
```

---

## Skills Demonstrated

* Data Cleaning & Preprocessing
* Exploratory Data Analysis
* SQL Querying
* Customer Segmentation (RFM)
* Data Visualization
* Business Dashboard Development
* Business Insight Generation

---

## Author

**Ananya Rawat**

M.Sc. Data Science Student | Aspiring Data Analyst
