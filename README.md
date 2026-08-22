# Dayflow — Human Resource Management System (HRMS)
> **Odoo x NMIT Bangalore Hackathon 2026**  
> *Every workday, perfectly aligned.*

Dayflow is a modern, enterprise Human Resource Management System engineered with an editorial visual identity, sub-second DynamoDB stream update simulation, AWS Cognito multi-factor RBAC, encrypted S3 document vaults, and SNS alert notifications.

---

## 🌟 Key Features

- **Strict Role-Based Access Control (RBAC)**:
  - **Employee Persona (Sophia Vance)**: Self-service punch card with live timer, leave balance donut visualization, payslip viewer with PDF modal, and locked fields in profile.
  - **HR Lead Persona (Marcus Chen)**: Urgent leave approvals triage queue, team attendance roster, and candidate operations.
  - **Admin / VP Persona (Elena Rostova)**: Executive HQ dashboard, organization-wide attendance records, full profile editing, department payroll allocation, and executive reports generator.
- **Cognito Auth Architecture**:
  - Sign-in with inline validation and 1-click persona switchers.
  - Sign-up with 4-criteria live entropy password strength meter + 6-digit OTP email verification step.
- **Time & Attendance OS**:
  - Live punch-in/out console with running stopwatch timer and location tagging.
  - Dual view: Daily Timeline Table vs Monthly Calendar Grid.
  - Status types: `Present`, `Absent`, `Half-day`, `Leave`.
- **Leave & Time-Off Management**:
  - Leave quota visualization (Paid, Sick, Compensatory, Unpaid).
  - Date range picker with automatic working-day calculator (excluding weekends).
  - 1-click approval/rejection with audit comments, animated transitions, and celebration feedback.
- **Payroll & Compensation**:
  - Itemized earnings & statutory deduction breakdown.
  - Interactive corporate PDF payslip preview modal with print/download simulation.
  - Admin CTC compensation tier structure editor.
- **Workforce Analytics & Reports**:
  - Interactive presence and punctuality trend line/bar charts.
  - Departmental monthly payroll allocation stacked visualizations.
  - Custom workforce report export builder (CSV / PDF).
- **AWS SNS Notifications**:
  - Slide-out real-time notification stream drawer with filter tabs and actionable deep links.
- **Hackathon Judge Demo Bar**:
  - 1-click instant persona switcher (`Sophia` ⇄ `Marcus` ⇄ `Elena`).
  - Direct screen jump selector across all 12 views.
  - Toggleable AWS Lambda Latency simulation (`0ms` vs `450ms`).
  - Seed database reset trigger.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation & Running Locally

```bash
# Clone the repository
git clone https://github.com/ATHIS07/Odoo-x-NMIT-Bangalore-Hackathon-2026.git
cd Odoo-x-NMIT-Bangalore-Hackathon-2026

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be live at `http://localhost:3000/`.

---

## 🛠️ Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite 5
- **Animations & Motion**: Framer Motion
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti
- **Design System**: Bespoke CSS custom tokens with modern typography (`Plus Jakarta Sans`, `Space Grotesk`, `JetBrains Mono`)

---

## 📄 License
MIT License. Built for the Odoo x NMIT Bangalore Hackathon 2026.
