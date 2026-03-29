# 💳 LoanTracker

[![Status](https://img.shields.io/badge/Status-Active-success.svg)]()
[![Frontend](https://img.shields.io/badge/Frontend-React_Native-61DAFB?logo=react&logoColor=white)]()
[![Backend](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)]()
[![Database](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)]()

**LoanTracker** is a premium full-stack mobile solution designed for the modern user to manage, track, and visualize personal finance loans and individual debts. Whether you are lending to friends or tracking your own credit card liabilities, LoanTracker provides a unified, secure dashboard to stay on top of your finances.

---

## ✨ Why LoanTracker?

Managing multiple debts can be chaotic. LoanTracker solves this by:

- **Centralizing Data**: No more tracking debts in notes or spreadsheets.
- **Visualizing Relationships**: The unique **Loan Chain** feature allows you to see the source of funds (e.g., specific credit cards) lent to specific individuals.
- **Accountability**: Detailed repayment logs ensure every penny is accounted for.

---

## 📱 Visual Experience

<div align="center">
  <table width="100%">
    <tr>
      <td align="center" width="33%">
        <img src="./docs/assets/dashboard.png" width="250" alt="Dashboard"/>
        <p><b>Performance Dashboard</b><br/>Real-time analytics and loan tracking.</p>
      </td>
      <td align="center" width="33%">
        <img src="./docs/assets/loan_management.png" width="250" alt="Loan Management"/>
        <p><b>Loan Management</b><br/>Track given and taken loans easily.</p>
      </td>
      <td align="center" width="33%">
        <img src="./docs/assets/add_loan.png" width="250" alt="Add Loan"/>
        <p><b>Flexible Details</b><br/>Comprehensive loan entry with EMI support.</p>
      </td>
    </tr>
    <tr>
      <td align="center" width="33%">
        <img src="./docs/assets/borrower_list.png" width="250" alt="Borrower List"/>
        <p><b>Borrower Directory</b><br/>Manage all your lending contacts in one place.</p>
      </td>
      <td align="center" width="33%">
        <img src="./docs/assets/profile_settings.png" width="250" alt="Profile & Settings"/>
        <p><b>Premium Settings</b><br/>Dark mode and profile customization.</p>
      </td>
      <td align="center" width="33%">
        <!-- Space for future feature or extra screenshot -->
      </td>
    </tr>
  </table>
</div>

---

## 🚀 Key Features

- **🔐 Enterprise-Grade Auth**: Secure JWT-based authentication with encrypted password hashing.
- **📊 Loan Chain Visualization**: View a hierarchical structure of debts. See exactly which credit card or bank loan is fueling the amount you've lent to others.
- **📝 Real-time Repayment Logs**: Historical tracking of all partial and full repayments.
- **📱 Fluid UI/UX**: Built with Expo Router for native-feeling transitions and a clean, minimalist design.
- **🌑 Light/Dark Mode Ready**: Styled with a focus on readability and modern aesthetics.

---

## 🏗️ System Architecture

```mermaid
graph TD
    User((User)) -->|Interacts| App[React Native / Expo App]
    App -->|API Requests| Express[Express.js Server]
    Express -->|Middleware| JWT[JWT Auth/Bcrypt]
    JWT -->|Query| Controller[Business Logic]
    Controller -->|CRUD| DB[(MongoDB Atlas)]
    DB -->|Data| Controller
    Controller -->|JSON Response| App
```

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: [React Native (Expo)](https://expo.dev/)
- **Architecture**: Expo Router (File-based routing)
- **Language**: TypeScript (Strongly typed for reliability)
- **Styling**: StyleSheet API with a custom premium design system

### Backend

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Security**: JWT (Stateless Auth) & Bcrypt (Password Hashing)