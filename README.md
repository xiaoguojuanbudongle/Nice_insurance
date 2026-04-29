# NICE Insurance Management System

## Project Overview
The **NICE Insurance Management System** is a comprehensive, web-based platform designed to streamline insurance operations for both automotive and residential properties. The system provides a secure and intuitive interface for managing the end-to-end lifecycle of insurance policies, from customer registration and policy issuance to automated invoicing and payment processing.

## Key Features

### 1. Dual-Role Portal
- **Customer Portal:** Allows users to register, log in, view their active Auto and Home policies, check billing status, and manage payments.
- **Employee Dashboard:** Provides staff with administrative tools to manage customer records, approve/update policies, and oversee financial transactions.

### 2. Insurance Management
- **Auto Insurance:** Track vehicle details (VIN, make, model), associated drivers, and policy coverage.
- **Home Insurance:** Manage property details including purchase value, area, safety features (fire notification, security systems), and policy specifics.

### 3. Financial Module
- **Automated Invoicing:** Generates invoices for both Auto and Home policies with due date tracking.
- **Payment Processing:** Supports multiple payment methods (Credit, Debit, PayPal, Check) and handles installment payments.

### 4. Advanced Data Analytics
The system integrates complex business intelligence queries to provide insights, such as:
- Multi-table performance analysis.
- Customer demographic distribution.
- High-value policy identification and payment trend analysis.

## Technical Architecture

- **Frontend:** Built with **Next.js (React)** for a modern, responsive user experience.
- **Backend & Database:** Powered by **PostgreSQL (via Supabase)**, ensuring robust relational data integrity and high performance.
- **Deployment:** Hosted on **Vercel** using a **Serverless** architecture to ensure high availability and scalability.
- **API Design:** Implemented following **RESTful** principles for clean and efficient communication between the client and server.

## Security & Reliability

- **Data Privacy:** Sensitive information, including user passwords, is fully encrypted before storage.
- **Protection:** Built-in safeguards against common web vulnerabilities like **SQL Injection** and **Cross-Site Scripting (XSS)**.
- **Concurrency:** Advanced transaction management to support simultaneous users and prevent database deadlocks.
