// ============================================================================
// DAYFLOW ENTERPRISE HRMS - CORE MOCK DATABASE SEED
// Real-world enterprise data with complete relational consistency
// ============================================================================

export const INITIAL_USERS = [
  {
    id: "usr_001",
    employeeId: "DF-8824",
    name: "Sophia Vance",
    email: "sophia.vance@dayflow.io",
    role: "employee",
    department: "Engineering",
    designation: "Senior Staff Frontend Architect",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80",
    phone: "+1 (555) 234-8901",
    location: "San Francisco, CA (HQ)",
    joiningDate: "2022-03-15",
    status: "active"
  },
  {
    id: "usr_002",
    employeeId: "DF-1092",
    name: "Marcus Chen",
    email: "marcus.chen@dayflow.io",
    role: "hr",
    department: "People & Talent Operations",
    designation: "Lead HR Business Partner",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80",
    phone: "+1 (555) 456-1122",
    location: "New York, NY",
    joiningDate: "2021-08-01",
    status: "active"
  },
  {
    id: "usr_003",
    employeeId: "DF-0010",
    name: "Elena Rostova",
    email: "elena.rostova@dayflow.io",
    role: "admin",
    department: "Executive Operations",
    designation: "VP of People & Operations",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80",
    phone: "+1 (555) 890-3344",
    location: "San Francisco, CA (HQ)",
    joiningDate: "2020-01-10",
    status: "active"
  },
  {
    id: "usr_004",
    employeeId: "DF-4412",
    name: "Liam Thorne",
    email: "liam.thorne@dayflow.io",
    role: "employee",
    department: "Engineering",
    designation: "Distributed Systems Engineer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80",
    phone: "+1 (555) 789-2231",
    location: "Austin, TX",
    joiningDate: "2023-01-20",
    status: "active"
  },
  {
    id: "usr_005",
    employeeId: "DF-5529",
    name: "Aria Montgomery",
    email: "aria.montgomery@dayflow.io",
    role: "employee",
    department: "Product Design",
    designation: "Principal UX Systems Designer",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=240&auto=format&fit=crop&q=80",
    phone: "+1 (555) 991-6644",
    location: "Seattle, WA",
    joiningDate: "2022-09-01",
    status: "active"
  },
  {
    id: "usr_006",
    employeeId: "DF-6701",
    name: "Devon Brooks",
    email: "devon.brooks@dayflow.io",
    role: "employee",
    department: "Product Management",
    designation: "Lead Technical Product Manager",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=240&auto=format&fit=crop&q=80",
    phone: "+1 (555) 332-9090",
    location: "San Francisco, CA (HQ)",
    joiningDate: "2021-11-15",
    status: "active"
  },
  {
    id: "usr_007",
    employeeId: "DF-7182",
    name: "Nadia Patel",
    email: "nadia.patel@dayflow.io",
    role: "employee",
    department: "Finance & Strategy",
    designation: "Senior Financial Analyst",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=240&auto=format&fit=crop&q=80",
    phone: "+1 (555) 674-8833",
    location: "New York, NY",
    joiningDate: "2023-04-10",
    status: "active"
  }
];

export const INITIAL_PROFILES = {
  usr_001: {
    userId: "usr_001",
    personalDetails: {
      fullName: "Sophia Vance",
      dateOfBirth: "1994-06-22",
      gender: "Female",
      bloodGroup: "O+",
      maritalStatus: "Single",
      emergencyContactName: "David Vance",
      emergencyContactRelation: "Father",
      emergencyContactPhone: "+1 (555) 912-3344"
    },
    jobDetails: {
      employeeId: "DF-8824",
      department: "Engineering",
      designation: "Senior Staff Frontend Architect",
      manager: "Elena Rostova",
      workEmail: "sophia.vance@dayflow.io",
      employmentType: "Full-Time Permanent",
      joiningDate: "2022-03-15",
      shift: "Standard Core (09:00 AM - 05:30 PM PST)",
      workLocation: "San Francisco HQ (Hybrid 3/2)",
      costCenter: "CC-ENG-402"
    },
    address: {
      street: "742 Montgomery St, Apt 4B",
      city: "San Francisco",
      state: "California",
      postalCode: "94111",
      country: "United States"
    },
    phone: "+1 (555) 234-8901",
    salaryStructure: {
      baseSalary: 165000,
      hra: 35000,
      specialAllowance: 25000,
      performanceBonus: 20000,
      providentFundDeduction: 12000,
      professionalTax: 2400,
      taxDeductionAtSource: 32000,
      netAnnualSalary: 198600,
      currency: "USD",
      bankName: "First Republic / Chase Commercial",
      accountNumber: "•••• •••• 6829",
      routingNumber: "121000358"
    },
    leaveBalance: {
      paid: { total: 20, used: 6, remaining: 14 },
      sick: { total: 12, used: 2, remaining: 10 },
      unpaid: { total: 15, used: 0, remaining: 15 },
      compensatory: { total: 5, used: 1, remaining: 4 }
    },
    documents: [
      { id: "doc_01", name: "Employment_Agreement_Dayflow_Signed.pdf", type: "PDF", size: "2.4 MB", uploadDate: "2022-03-15", s3Key: "s3://dayflow-hr-vault/usr_001/contracts/emp_agreement.pdf" },
      { id: "doc_02", name: "W4_Tax_Withholding_2024.pdf", type: "PDF", size: "1.1 MB", uploadDate: "2024-01-10", s3Key: "s3://dayflow-hr-vault/usr_001/tax/w4_2024.pdf" },
      { id: "doc_03", name: "Passport_Identification_Certified.pdf", type: "PDF", size: "3.8 MB", uploadDate: "2022-03-14", s3Key: "s3://dayflow-hr-vault/usr_001/id/passport.pdf" },
      { id: "doc_04", name: "AWS_Certified_Solutions_Architect.pdf", type: "PDF", size: "1.6 MB", uploadDate: "2023-08-20", s3Key: "s3://dayflow-hr-vault/usr_001/certs/aws_csa.pdf" }
    ]
  },
  usr_002: {
    userId: "usr_002",
    personalDetails: {
      fullName: "Marcus Chen",
      dateOfBirth: "1988-11-14",
      gender: "Male",
      bloodGroup: "A+",
      maritalStatus: "Married",
      emergencyContactName: "Linda Chen",
      emergencyContactRelation: "Spouse",
      emergencyContactPhone: "+1 (555) 777-8899"
    },
    jobDetails: {
      employeeId: "DF-1092",
      department: "People & Talent Operations",
      designation: "Lead HR Business Partner",
      manager: "Elena Rostova",
      workEmail: "marcus.chen@dayflow.io",
      employmentType: "Full-Time Permanent",
      joiningDate: "2021-08-01",
      shift: "Standard Core (09:00 AM - 05:00 PM EST)",
      workLocation: "New York Hub",
      costCenter: "CC-HR-101"
    },
    address: {
      street: "120 Broadway, Suite 1400",
      city: "New York",
      state: "New York",
      postalCode: "10271",
      country: "United States"
    },
    phone: "+1 (555) 456-1122",
    salaryStructure: {
      baseSalary: 140000,
      hra: 30000,
      specialAllowance: 18000,
      performanceBonus: 15000,
      providentFundDeduction: 10000,
      professionalTax: 2400,
      taxDeductionAtSource: 26000,
      netAnnualSalary: 164600,
      currency: "USD",
      bankName: "Morgan Stanley Private Bank",
      accountNumber: "•••• •••• 9104",
      routingNumber: "021000021"
    },
    leaveBalance: {
      paid: { total: 22, used: 4, remaining: 18 },
      sick: { total: 12, used: 1, remaining: 11 },
      unpaid: { total: 15, used: 0, remaining: 15 },
      compensatory: { total: 5, used: 2, remaining: 3 }
    },
    documents: [
      { id: "doc_11", name: "HR_Leadership_Charter_Signed.pdf", type: "PDF", size: "1.9 MB", uploadDate: "2021-08-01", s3Key: "s3://dayflow-hr-vault/usr_002/contracts/charter.pdf" },
      { id: "doc_12", name: "SHRM_Senior_Certified_Professional.pdf", type: "PDF", size: "2.1 MB", uploadDate: "2022-04-12", s3Key: "s3://dayflow-hr-vault/usr_002/certs/shrm_scp.pdf" }
    ]
  },
  usr_003: {
    userId: "usr_003",
    personalDetails: {
      fullName: "Elena Rostova",
      dateOfBirth: "1983-04-05",
      gender: "Female",
      bloodGroup: "AB+",
      maritalStatus: "Married",
      emergencyContactName: "Sergei Rostova",
      emergencyContactRelation: "Spouse",
      emergencyContactPhone: "+1 (555) 901-2244"
    },
    jobDetails: {
      employeeId: "DF-0010",
      department: "Executive Operations",
      designation: "VP of People & Operations",
      manager: "Chief Executive Officer",
      workEmail: "elena.rostova@dayflow.io",
      employmentType: "Executive",
      joiningDate: "2020-01-10",
      shift: "Executive Flexible",
      workLocation: "San Francisco HQ",
      costCenter: "CC-EXEC-001"
    },
    address: {
      street: "2100 Pacific Avenue",
      city: "San Francisco",
      state: "California",
      postalCode: "94115",
      country: "United States"
    },
    phone: "+1 (555) 890-3344",
    salaryStructure: {
      baseSalary: 230000,
      hra: 50000,
      specialAllowance: 45000,
      performanceBonus: 60000,
      providentFundDeduction: 18000,
      professionalTax: 2400,
      taxDeductionAtSource: 62000,
      netAnnualSalary: 302600,
      currency: "USD",
      bankName: "Goldman Sachs Private Wealth",
      accountNumber: "•••• •••• 4402",
      routingNumber: "122000496"
    },
    leaveBalance: {
      paid: { total: 25, used: 5, remaining: 20 },
      sick: { total: 15, used: 0, remaining: 15 },
      unpaid: { total: 20, used: 0, remaining: 20 },
      compensatory: { total: 8, used: 0, remaining: 8 }
    },
    documents: [
      { id: "doc_21", name: "Executive_Appointment_Letter.pdf", type: "PDF", size: "3.2 MB", uploadDate: "2020-01-10", s3Key: "s3://dayflow-hr-vault/usr_003/contracts/exec_letter.pdf" },
      { id: "doc_22", name: "Equity_Incentive_Plan_Grant.pdf", type: "PDF", size: "4.5 MB", uploadDate: "2020-01-15", s3Key: "s3://dayflow-hr-vault/usr_003/equity/grant_notice.pdf" }
    ]
  }
};

export const INITIAL_ATTENDANCE = [
  {
    id: "att_01",
    userId: "usr_001",
    date: "2026-08-22",
    checkIn: "08:54 AM",
    checkOut: null,
    duration: "Live Active",
    status: "present",
    location: "SF HQ - Floor 4 (IP: 192.168.10.42)",
    notes: "On-time check-in via badge NFC reader"
  },
  {
    id: "att_02",
    userId: "usr_001",
    date: "2026-08-21",
    checkIn: "09:02 AM",
    checkOut: "05:45 PM",
    duration: "8h 43m",
    status: "present",
    location: "SF HQ - Desk 402",
    notes: "Core sprint engineering"
  },
  {
    id: "att_03",
    userId: "usr_001",
    date: "2026-08-20",
    checkIn: "08:48 AM",
    checkOut: "06:12 PM",
    duration: "9h 24m",
    status: "present",
    location: "Remote - Verified IP (San Francisco)",
    notes: "Late sprint deployment support"
  },
  {
    id: "att_04",
    userId: "usr_001",
    date: "2026-08-19",
    checkIn: "09:15 AM",
    checkOut: "01:30 PM",
    duration: "4h 15m",
    status: "half-day",
    location: "SF HQ",
    notes: "Approved afternoon medical appointment"
  },
  {
    id: "att_05",
    userId: "usr_001",
    date: "2026-08-18",
    checkIn: "08:50 AM",
    checkOut: "05:35 PM",
    duration: "8h 45m",
    status: "present",
    location: "SF HQ",
    notes: "Architecture review sync"
  },
  {
    id: "att_06",
    userId: "usr_001",
    date: "2026-08-15",
    checkIn: null,
    checkOut: null,
    duration: "0h",
    status: "leave",
    location: "Out of Office",
    notes: "Approved Casual Leave"
  },
  {
    id: "att_07",
    userId: "usr_002",
    date: "2026-08-22",
    checkIn: "08:45 AM",
    checkOut: null,
    duration: "Live Active",
    status: "present",
    location: "New York Hub",
    notes: "Candidate interviews & HR orientation"
  },
  {
    id: "att_08",
    userId: "usr_004",
    date: "2026-08-22",
    checkIn: "09:30 AM",
    checkOut: null,
    duration: "Live Active",
    status: "present",
    location: "Austin, TX (Remote)",
    notes: "Database migration sprint"
  },
  {
    id: "att_09",
    userId: "usr_005",
    date: "2026-08-22",
    checkIn: null,
    checkOut: null,
    duration: "0h",
    status: "leave",
    location: "Out of Office",
    notes: "Approved Medical Leave"
  },
  {
    id: "att_10",
    userId: "usr_006",
    date: "2026-08-22",
    checkIn: "08:30 AM",
    checkOut: null,
    duration: "Live Active",
    status: "present",
    location: "SF HQ",
    notes: "Product roadmap council"
  },
  {
    id: "att_11",
    userId: "usr_007",
    date: "2026-08-22",
    checkIn: null,
    checkOut: null,
    duration: "0h",
    status: "absent",
    location: "Unrecorded",
    notes: "Unexcused absence / pending check-in"
  }
];

export const INITIAL_LEAVES = [
  {
    id: "lve_101",
    userId: "usr_001",
    employeeName: "Sophia Vance",
    department: "Engineering",
    leaveType: "paid",
    startDate: "2026-09-04",
    endDate: "2026-09-08",
    daysCount: 3,
    remarks: "Attending React Advanced Global Summit in London. Will be reachable on Slack async.",
    status: "approved",
    adminComment: "Approved. Enjoy the conference and share takeaways with the team.",
    reviewedBy: "Marcus Chen",
    reviewedAt: "2026-08-18T14:20:00Z",
    submittedAt: "2026-08-17T09:12:00Z"
  },
  {
    id: "lve_102",
    userId: "usr_004",
    employeeName: "Liam Thorne",
    department: "Engineering",
    leaveType: "paid",
    startDate: "2026-08-28",
    endDate: "2026-09-01",
    daysCount: 3,
    remarks: "Family vacation and travel out of state.",
    status: "pending",
    adminComment: null,
    reviewedBy: null,
    reviewedAt: null,
    submittedAt: "2026-08-21T11:45:00Z"
  },
  {
    id: "lve_103",
    userId: "usr_005",
    employeeName: "Aria Montgomery",
    department: "Product Design",
    leaveType: "sick",
    startDate: "2026-08-22",
    endDate: "2026-08-23",
    daysCount: 2,
    remarks: "Sudden flu and acute fever. Doctor has advised bed rest. Medical certificate attached.",
    attachment: "Medical_Prescription_DrDavis.pdf",
    status: "pending",
    adminComment: null,
    reviewedBy: null,
    reviewedAt: null,
    submittedAt: "2026-08-22T07:30:00Z"
  },
  {
    id: "lve_104",
    userId: "usr_006",
    employeeName: "Devon Brooks",
    department: "Product Management",
    leaveType: "unpaid",
    startDate: "2026-09-15",
    endDate: "2026-09-25",
    daysCount: 8,
    remarks: "Personal sabbatical to complete executive certification capstone.",
    status: "pending",
    adminComment: null,
    reviewedBy: null,
    reviewedAt: null,
    submittedAt: "2026-08-20T16:00:00Z"
  },
  {
    id: "lve_105",
    userId: "usr_007",
    employeeName: "Nadia Patel",
    department: "Finance & Strategy",
    leaveType: "paid",
    startDate: "2026-08-10",
    endDate: "2026-08-12",
    daysCount: 3,
    remarks: "Personal relocation and apartment lease signing.",
    status: "rejected",
    adminComment: "Rejected due to overlap with Q3 corporate financial audit closure. Please reschedule post August 15.",
    reviewedBy: "Elena Rostova",
    reviewedAt: "2026-08-05T10:00:00Z",
    submittedAt: "2026-08-04T08:30:00Z"
  },
  {
    id: "lve_106",
    userId: "usr_001",
    employeeName: "Sophia Vance",
    department: "Engineering",
    leaveType: "sick",
    startDate: "2026-07-14",
    endDate: "2026-07-15",
    daysCount: 2,
    remarks: "Dental surgery recovery.",
    status: "approved",
    adminComment: "Get well soon!",
    reviewedBy: "Marcus Chen",
    reviewedAt: "2026-07-13T16:10:00Z",
    submittedAt: "2026-07-13T14:00:00Z"
  }
];

export const INITIAL_PAYROLL = [
  {
    id: "pay_2026_07",
    userId: "usr_001",
    month: "July 2026",
    payDate: "2026-07-31",
    grossPay: 18750,
    basic: 13750,
    hra: 2916,
    specialAllowance: 2084,
    bonus: 0,
    deductions: {
      providentFund: 1000,
      taxDeduction: 2666,
      professionalTax: 200,
      healthInsurance: 150
    },
    totalDeductions: 4016,
    netPay: 14734,
    status: "paid",
    transactionId: "TXN-DF-982104-US",
    currency: "$"
  },
  {
    id: "pay_2026_06",
    userId: "usr_001",
    month: "June 2026",
    payDate: "2026-06-30",
    grossPay: 18750,
    basic: 13750,
    hra: 2916,
    specialAllowance: 2084,
    bonus: 0,
    deductions: {
      providentFund: 1000,
      taxDeduction: 2666,
      professionalTax: 200,
      healthInsurance: 150
    },
    totalDeductions: 4016,
    netPay: 14734,
    status: "paid",
    transactionId: "TXN-DF-881902-US",
    currency: "$"
  },
  {
    id: "pay_2026_05",
    userId: "usr_001",
    month: "May 2026",
    payDate: "2026-05-31",
    grossPay: 23750,
    basic: 13750,
    hra: 2916,
    specialAllowance: 2084,
    bonus: 5000, // Mid-year performance bonus
    deductions: {
      providentFund: 1000,
      taxDeduction: 3950,
      professionalTax: 200,
      healthInsurance: 150
    },
    totalDeductions: 5300,
    netPay: 18450,
    status: "paid",
    transactionId: "TXN-DF-771801-US",
    currency: "$"
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif_01",
    userId: "usr_001",
    type: "leave_approval",
    title: "Leave Request Approved",
    message: "Marcus Chen approved your paid leave for Sep 04 - Sep 08 (React Summit).",
    read: false,
    timestamp: "10 mins ago",
    link: "/leave/apply"
  },
  {
    id: "notif_02",
    userId: "usr_001",
    type: "payroll",
    title: "July 2026 Payslip Available",
    message: "Your compensation slip for July 2026 ($14,734 Net) has been deposited.",
    read: true,
    timestamp: "3 days ago",
    link: "/payroll"
  },
  {
    id: "notif_03",
    userId: "usr_001",
    type: "attendance",
    title: "Punch-In Logged Successfully",
    message: "Clock-in confirmed at 08:54 AM via SF HQ Floor 4 Terminal.",
    read: false,
    timestamp: "2 hours ago",
    link: "/attendance"
  },
  {
    id: "notif_04",
    userId: "usr_002",
    type: "leave_request",
    title: "New Leave Application",
    message: "Aria Montgomery submitted a Sick Leave request (2 days, flu). Review required.",
    read: false,
    timestamp: "1 hour ago",
    link: "/leave/approvals"
  },
  {
    id: "notif_05",
    userId: "usr_003",
    type: "payroll_batch",
    title: "August 2026 Payroll Cycle Open",
    message: "Automated Lambda payroll validation run completed. 100% records reconciled.",
    read: false,
    timestamp: "4 hours ago",
    link: "/payroll"
  }
];

export const COMPANY_HOLIDAYS = [
  { name: "Labor Day", date: "2026-09-07", day: "Monday", type: "Federal Public Holiday" },
  { name: "Indigenous Peoples' Day", date: "2026-10-12", day: "Monday", type: "Federal Public Holiday" },
  { name: "Veterans Day", date: "2026-11-11", day: "Wednesday", type: "Corporate Holiday" },
  { name: "Thanksgiving & Autumn Break", date: "2026-11-26", day: "Thursday - Friday", type: "Mandatory Office Closure" },
  { name: "Winter Solstice & Year-End", date: "2026-12-24", day: "Thursday - Friday", type: "Global Holiday" }
];
