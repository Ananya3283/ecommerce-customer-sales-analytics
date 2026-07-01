USE ecommerce_sales;

-- =====================================================
-- E-COMMERCE SALES ANALYSIS
-- =====================================================

-- ==========================
-- BUSINESS KPI ANALYSIS
-- ==========================

-- 1. Total Revenue
SELECT ROUND(SUM(Revenue),2) AS Total_Revenue
FROM online_retail;

-- 2. Total Orders
SELECT COUNT(DISTINCT Invoice) AS Total_Orders
FROM online_retail;

-- 3. Total Customers
SELECT COUNT(DISTINCT CustomerID) AS Total_Customers
FROM online_retail
WHERE CustomerID <> 0;

-- 4. Total Products Sold
SELECT SUM(Quantity) AS Products_Sold
FROM online_retail;

-- 5. Average Order Value
SELECT ROUND(SUM(Revenue)/COUNT(DISTINCT Invoice),2) AS Average_Order_Value
FROM online_retail;

-- ==========================
-- SALES ANALYSIS
-- ==========================

-- 6. Monthly Revenue
SELECT
DATE_FORMAT(InvoiceDate,'%Y-%m') AS Month,
ROUND(SUM(Revenue),2) AS Revenue
FROM online_retail
GROUP BY Month
ORDER BY Month;

-- 7. Revenue by Country
SELECT
Country,
ROUND(SUM(Revenue),2) AS Revenue
FROM online_retail
GROUP BY Country
ORDER BY Revenue DESC;

-- 8. Top 10 Customers
SELECT
CustomerID,
ROUND(SUM(Revenue),2) AS Total_Spent
FROM online_retail
WHERE CustomerID <> 0
GROUP BY CustomerID
ORDER BY Total_Spent DESC
LIMIT 10;

-- 9. Top 10 Products by Quantity Sold
SELECT
Description,
SUM(Quantity) AS Units_Sold
FROM online_retail
GROUP BY Description
ORDER BY Units_Sold DESC
LIMIT 10;

-- 10. Top 10 Products by Revenue
SELECT
Description,
ROUND(SUM(Revenue),2) AS Revenue
FROM online_retail
GROUP BY Description
ORDER BY Revenue DESC
LIMIT 10;
-- =====================================================
-- MODULE 2 : INTERMEDIATE SQL ANALYSIS
-- =====================================================

-- 11. Top 10 Invoices by Revenue
SELECT
    Invoice,
    ROUND(SUM(Revenue),2) AS Order_Revenue
FROM online_retail
GROUP BY Invoice
ORDER BY Order_Revenue DESC
LIMIT 10;

-- 12. Average Revenue by Country
SELECT
    Country,
    ROUND(AVG(Revenue),2) AS Avg_Revenue
FROM online_retail
GROUP BY Country
ORDER BY Avg_Revenue DESC;

-- 13. Products Sold in More Than 10,000 Units
SELECT
    Description,
    SUM(Quantity) AS Total_Units
FROM online_retail
GROUP BY Description
HAVING SUM(Quantity) > 10000
ORDER BY Total_Units DESC;

-- 14. Customers Who Spent More Than 50,000
SELECT
    CustomerID,
    ROUND(SUM(Revenue),2) AS Total_Spent
FROM online_retail
WHERE CustomerID <> 0
GROUP BY CustomerID
HAVING SUM(Revenue) > 50000
ORDER BY Total_Spent DESC;

-- 15. Number of Orders by Country
SELECT
    Country,
    COUNT(DISTINCT Invoice) AS Total_Orders
FROM online_retail
GROUP BY Country
ORDER BY Total_Orders DESC;

-- 16. Average Quantity per Order
SELECT
    ROUND(AVG(Quantity),2) AS Average_Quantity
FROM online_retail;

-- 17. Products with Highest Average Selling Price
SELECT
    Description,
    ROUND(AVG(Price),2) AS Average_Price
FROM online_retail
GROUP BY Description
ORDER BY Average_Price DESC
LIMIT 10;

-- 18. Revenue by Year
SELECT
    YEAR(InvoiceDate) AS Sales_Year,
    ROUND(SUM(Revenue),2) AS Total_Revenue
FROM online_retail
GROUP BY YEAR(InvoiceDate)
ORDER BY Sales_Year;

-- 19. Monthly Number of Orders
SELECT
    DATE_FORMAT(InvoiceDate,'%Y-%m') AS Month,
    COUNT(DISTINCT Invoice) AS Orders
FROM online_retail
GROUP BY Month
ORDER BY Month;

-- 20. Top 10 Countries by Number of Customers
SELECT
    Country,
    COUNT(DISTINCT CustomerID) AS Customers
FROM online_retail
WHERE CustomerID <> 0
GROUP BY Country
ORDER BY Customers DESC
LIMIT 10;

-- =====================================================
-- MODULE 3 : ADVANCED SQL
-- =====================================================

-- 21. Top 10 Customers using RANK()
SELECT
    CustomerID,
    ROUND(SUM(Revenue),2) AS Total_Revenue,
    RANK() OVER (ORDER BY SUM(Revenue) DESC) AS Customer_Rank
FROM online_retail
WHERE CustomerID <> 0
GROUP BY CustomerID
LIMIT 10;

-- 22. Top 10 Customers using DENSE_RANK()
SELECT
    CustomerID,
    ROUND(SUM(Revenue),2) AS Total_Revenue,
    DENSE_RANK() OVER (ORDER BY SUM(Revenue) DESC) AS Customer_Rank
FROM online_retail
WHERE CustomerID <> 0
GROUP BY CustomerID
LIMIT 10;

-- 23. Running Monthly Revenue
SELECT
    DATE_FORMAT(InvoiceDate,'%Y-%m') AS Month,
    ROUND(SUM(Revenue),2) AS Monthly_Revenue,
    ROUND(
        SUM(SUM(Revenue)) OVER (
            ORDER BY DATE_FORMAT(InvoiceDate,'%Y-%m')
        ),2
    ) AS Running_Revenue
FROM online_retail
GROUP BY Month;

-- 24. Revenue Contribution by Country
SELECT
    Country,
    ROUND(SUM(Revenue),2) AS Revenue,
    ROUND(
        SUM(Revenue)*100/
        (SELECT SUM(Revenue) FROM online_retail),
        2
    ) AS Revenue_Percentage
FROM online_retail
GROUP BY Country
ORDER BY Revenue DESC;

-- 25. Average Revenue per Customer using CTE
WITH customer_sales AS
(
SELECT
CustomerID,
SUM(Revenue) AS Revenue
FROM online_retail
WHERE CustomerID <> 0
GROUP BY CustomerID
)

SELECT
ROUND(AVG(Revenue),2) AS Avg_Customer_Revenue
FROM customer_sales;

-- 26. Customers Spending Above Average
WITH customer_sales AS
(
SELECT
CustomerID,
SUM(Revenue) AS Revenue
FROM online_retail
WHERE CustomerID <> 0
GROUP BY CustomerID
)

SELECT *
FROM customer_sales
WHERE Revenue >
(
SELECT AVG(Revenue)
FROM customer_sales
)
ORDER BY Revenue DESC;

-- 27. Top Product in Each Country
SELECT *
FROM
(
SELECT
Country,
Description,
SUM(Revenue) AS Revenue,
ROW_NUMBER() OVER(
PARTITION BY Country
ORDER BY SUM(Revenue) DESC
) AS rn
FROM online_retail
GROUP BY Country, Description
) t
WHERE rn = 1;

-- 28. Monthly Order Ranking
SELECT
DATE_FORMAT(InvoiceDate,'%Y-%m') AS Month,
COUNT(DISTINCT Invoice) AS Orders,
RANK() OVER(
ORDER BY COUNT(DISTINCT Invoice) DESC
) AS Month_Rank
FROM online_retail
GROUP BY Month;

-- 29. Top 5 Countries by Revenue
SELECT
Country,
ROUND(SUM(Revenue),2) AS Revenue
FROM online_retail
GROUP BY Country
ORDER BY Revenue DESC
LIMIT 5;

-- 30. Top 5 Customers by Revenue
SELECT
CustomerID,
ROUND(SUM(Revenue),2) AS Revenue
FROM online_retail
WHERE CustomerID <> 0
GROUP BY CustomerID
ORDER BY Revenue DESC
LIMIT 5;