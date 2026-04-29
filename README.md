# NICE Insurance Management System - Project Overview

## 1. General Description
This project involves creating a web-based user interface for a Database schema designed to manage insurance services (Auto and Home). The system must support registration, login, and full CRUD (Create, Read, Update, Delete) operations for various business activities.

## 2. Core Requirements
- **Web UI:** A functional and neat interface accessible via standard web browsers.
- **User Roles:** Distinct authorization for **Customers** and **Employees**.
- **Authentication:** Secure login and registration.
- **Backend:** A relational database (PostgreSQL/Supabase used in this implementation).
- **APIs:** Designed with a **RESTful** style.

## 3. Technical & Security Specifications
- **Data Security:** Passwords must be encrypted before being stored in the database.
- **Attack Prevention:** Implementation of measures against **SQL Injection** (using prepared statements or stored procedures) and **Cross-Site Scripting (XSS)**.
- **Concurrency Control:** Define appropriate transactions to handle multiple simultaneous users and prevent deadlocks.

## 4. Deliverables
### A. Project Demo (80 Points)
- A live demonstration of the system's features and source code.
- Must use interesting test data to showcase functionality.

### B. Project Report (20 Points)
- **Executive Summary:** Business case and approach.
- **Design Docs:** Logical and Relational models, DDL code, and table list.
- **System Details:** Software/languages used and security features implemented.
- **Business Analysis (6 Mandatory SQLs):**
    1. Table join with at least 3 tables.
    2. Multi-row subquery.
    3. Correlated subquery.
    4. SET operator query.
    5. Query with in-line view or WITH clause.
    6. TOP-N/BOTTOM-N query.

## 5. Extra Credit (Up to 6%)
- **Modern Architecture:** Use of Cache, Containers, or **Serverless** (Vercel) for high availability.
- **Performance:** Strategic indexing with analytical proof of improvement.
- **Visualization:** Data analysis presented through graphs and charts.
- **Advanced Security:** Password reset verification and audit history tables.

