-- ==========================================
-- E-Commerce Customer Sales Analytics
-- Database Creation Script
-- ==========================================

DROP DATABASE IF EXISTS ecommerce_sales;

CREATE DATABASE ecommerce_sales;

USE ecommerce_sales;

CREATE TABLE online_retail (
    Invoice VARCHAR(20),
    StockCode VARCHAR(20),
    Description TEXT,
    Quantity INT,
    InvoiceDate DATETIME,
    Price DECIMAL(10,2),
    CustomerID INT,
    Country VARCHAR(100),
    Revenue DECIMAL(12,2)
);