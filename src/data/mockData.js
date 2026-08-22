// ============================================================================
// ODOO ENTERPRISE HRMS - CORE MOCK DATABASE SEED (INDIA / LOCALIZED)
// Real-world enterprise data with complete relational consistency (INR / Indian Hubs)
// ============================================================================

export const INITIAL_USERS = [
  {
    id: "usr_001",
    employeeId: "DF-8824",
    name: "Sophia Vance",
    email: "sophia.vance@odoo.com",
    role: "employee",
    department: "Engineering",
    designation: "Senior Staff Frontend Architect",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80",
    phone: "+91 98450 23891",
    location: "Bangalore, Karnataka (NMIT / Whitefield HQ)",
    joiningDate: "2022-03-15",
    status: "active"
  },
  {
    id: "usr_002",
    employeeId: "DF-1092",
    name: "Marcus Chen",
    email: "marcus.chen@odoo.com",
    role: "hr",
    department: "People & Talent Operations",
    designation: "Lead HR Business Partner",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80",
    phone: "+91 98201 45611",
    location: "Mumbai, Maharashtra (BKC Hub)",
    joiningDate: "2021-08-01",
    status: "active"
  },
  {
    id: "usr_003",
    employeeId: "DF-0010",
    name: "Elena Rostova",
    email: "elena.rostova@odoo.com",
    role: "admin",
    department: "Executive Operations",
    designation: "VP of People & Operations",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80",
    phone: "+91 98800 89033",
    location: "Bangalore, Karnataka (NMIT Tech Park HQ)",
    joiningDate: "2020-01-10",
    status: "active"
  },
  {
    id: "usr_004",
    employeeId: "DF-4412",
    name: "Liam Thorne",
    email: "liam.thorne@odoo.com",
    role: "employee",
    department: "Engineering",
    designation: "Distributed Systems Engineer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80",
    phone: "+91 97012 78922",
    location: "Hyderabad, Telangana (HITEC City)",
    joiningDate: "2023-01-20",
    status: "active"
  },
  {
    id: "usr_005",
    employeeId: "DF-5529",
    name: "Aria Montgomery",
    email: "aria.montgomery@odoo.com",
    role: "employee",
    department: "Product Design",
    designation: "Principal UX Systems Designer",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=240&auto=format&fit=crop&q=80",
    phone: "+91 99001 99166",
    location: "Bangalore, Karnataka (Koramangala)",
    joiningDate: "2022-09-01",
    status: "active"
  },
  {
    id: "usr_006",
    employeeId: "DF-6701",
    name: "Devon Brooks",
    email: "devon.brooks@odoo.com",
    role: "employee",
    department: "Product Management",
    designation: "Lead Technical Product Manager",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=240&auto=format&fit=crop&q=80",
    phone: "+91 98230 33290",
    location: "Pune, Maharashtra (Hinjewadi)",
    joiningDate: "2021-11-15",
    status: "active"
  },
  {
    id: "usr_007",
    employeeId: "DF-7182",
    name: "Nadia Patel",
    email: "nadia.patel@odoo.com",
    role: "employee",
    department: "Finance & Strategy",
    designation: "Senior Financial Analyst",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=240&auto=format&fit=crop&q=80",
    phone: "+91 98205 67488",
    location: "Mumbai, Maharashtra (Lower Parel)",
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
      emergencyContactPhone: "+91 98451 91233"
    },
    jobDetails: {
      employeeId: "DF-8824",
      department: "Engineering",
      designation: "Senior Staff Frontend Architect",
      manager: "Elena Rostova",
      workEmail: "sophia.vance@odoo.com",
      employmentType: "Full-Time Permanent",
      joiningDate: "2022-03-15",
      shift: "General Core Shift (09:30 AM - 06:00 PM IST)",
      workLocation: "Bangalore HQ (Outer Ring Road / NMIT)",
      costCenter: "CC-ENG-402"
    },
    address: {
      street: "74 Outer Ring Road, Bellandur",
      city: "Bangalore",
      state: "Karnataka",
      postalCode: "560103",
      country: "India"
    },
    phone: "+91 98450 23891",
    salaryStructure: {
      baseSalary: 1800000,
      hra: 720000,
      specialAllowance: 330000,
      performanceBonus: 250000,
      providentFundDeduction: 21600,
      professionalTax: 2400,
      taxDeductionAtSource: 180000,
      netAnnualSalary: 2646000,
      currency: "INR",
      currencySymbol: "₹",
      bankName: "HDFC Bank Ltd. (Commercial Branch)",
      accountNumber: "•••• •••• 6829",
      routingNumber: "HDFC0001234"
    },
    leaveBalance: {
      paid: { total: 20, used: 6, remaining: 14 },
      sick: { total: 12, used: 2, remaining: 10 },
      unpaid: { total: 15, used: 0, remaining: 15 },
      compensatory: { total: 5, used: 1, remaining: 4 }
    },
    documents: [
      { id: "doc_01", name: "Employment_Agreement_Odoo_Signed.pdf", type: "PDF", size: "2.4 MB", uploadDate: "2022-03-15", s3Key: "s3://dayflow-hr-vault/usr_001/contracts/emp_agreement.pdf" },
      { id: "doc_02", name: "Form16_Tax_Declaration_2025_26.pdf", type: "PDF", size: "1.1 MB", uploadDate: "2026-01-10", s3Key: "s3://dayflow-hr-vault/usr_001/tax/form16_2026.pdf" },
      { id: "doc_03", name: "Passport_Aadhaar_Identification_Certified.pdf", type: "PDF", size: "3.8 MB", uploadDate: "2022-03-14", s3Key: "s3://dayflow-hr-vault/usr_001/id/id_proof.pdf" },
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
      emergencyContactPhone: "+91 98209 77788"
    },
    jobDetails: {
      employeeId: "DF-1092",
      department: "People & Talent Operations",
      designation: "Lead HR Business Partner",
      manager: "Elena Rostova",
      workEmail: "marcus.chen@odoo.com",
      employmentType: "Full-Time Permanent",
      joiningDate: "2021-08-01",
      shift: "General Core Shift (09:30 AM - 06:00 PM IST)",
      workLocation: "Mumbai Hub (Bandra Kurla Complex / BKC)",
      costCenter: "CC-HR-101"
    },
    address: {
      street: "Tower 2, Bandra Kurla Complex (BKC)",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400051",
      country: "India"
    },
    phone: "+91 98201 45611",
    salaryStructure: {
      baseSalary: 1400000,
      hra: 560000,
      specialAllowance: 240000,
      performanceBonus: 180000,
      providentFundDeduction: 21600,
      professionalTax: 2400,
      taxDeductionAtSource: 140000,
      netAnnualSalary: 2036000,
      currency: "INR",
      currencySymbol: "₹",
      bankName: "ICICI Bank (BKC Towers)",
      accountNumber: "•••• •••• 9104",
      routingNumber: "ICIC0000456"
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
      emergencyContactPhone: "+91 98801 90122"
    },
    jobDetails: {
      employeeId: "DF-0010",
      department: "Executive Operations",
      designation: "VP of People & Operations",
      manager: "Chief Executive Officer",
      workEmail: "elena.rostova@odoo.com",
      employmentType: "Executive",
      joiningDate: "2020-01-10",
      shift: "Executive Flexible (IST)",
      workLocation: "Bangalore HQ (NMIT Tech Park)",
      costCenter: "CC-EXEC-001"
    },
    address: {
      street: "12 Lavelle Road, Shanthala Nagar",
      city: "Bangalore",
      state: "Karnataka",
      postalCode: "560001",
      country: "India"
    },
    phone: "+91 98800 89033",
    salaryStructure: {
      baseSalary: 2800000,
      hra: 1120000,
      specialAllowance: 580000,
      performanceBonus: 600000,
      providentFundDeduction: 21600,
      professionalTax: 2400,
      taxDeductionAtSource: 380000,
      netAnnualSalary: 4096000,
      currency: "INR",
      currencySymbol: "₹",
      bankName: "State Bank of India (Corporate Centre)",
      accountNumber: "•••• •••• 4402",
      routingNumber: "SBIN0007890"
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
    checkIn: "09:24 AM",
    checkOut: null,
    duration: "Live Active",
    status: "present",
    location: "Bangalore HQ - Floor 4 (IP: 192.168.10.42)",
    notes: "On-time biometric check-in via NFC terminal"
  },
  {
    id: "att_02",
    userId: "usr_001",
    date: "2026-08-21",
    checkIn: "09:30 AM",
    checkOut: "06:15 PM",
    duration: "8h 45m",
    status: "present",
    location: "Bangalore HQ - Desk 402",
    notes: "Core sprint engineering"
  },
  {
    id: "att_03",
    userId: "usr_001",
    date: "2026-08-20",
    checkIn: "09:18 AM",
    checkOut: "06:42 PM",
    duration: "9h 24m",
    status: "present",
    location: "Remote - Verified IP (Bangalore)",
    notes: "Sprint release deployment support"
  },
  {
    id: "att_04",
    userId: "usr_001",
    date: "2026-08-19",
    checkIn: "09:30 AM",
    checkOut: "02:00 PM",
    duration: "4h 30m",
    status: "half-day",
    location: "Bangalore HQ",
    notes: "Approved afternoon medical appointment"
  },
  {
    id: "att_05",
    userId: "usr_001",
    date: "2026-08-18",
    checkIn: "09:20 AM",
    checkOut: "06:05 PM",
    duration: "8h 45m",
    status: "present",
    location: "Bangalore HQ",
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
    notes: "National Holiday — Independence Day"
  },
  {
    id: "att_07",
    userId: "usr_002",
    date: "2026-08-22",
    checkIn: "09:15 AM",
    checkOut: null,
    duration: "Live Active",
    status: "present",
    location: "Mumbai BKC Hub",
    notes: "Candidate interviews & HR orientation"
  },
  {
    id: "att_08",
    userId: "usr_004",
    date: "2026-08-22",
    checkIn: "09:45 AM",
    checkOut: null,
    duration: "Live Active",
    status: "present",
    location: "Hyderabad HITEC City (Remote)",
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
    checkIn: "09:10 AM",
    checkOut: null,
    duration: "Live Active",
    status: "present",
    location: "Pune Hinjewadi Hub",
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
    notes: "Pending punch-in"
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
    remarks: "Attending React Advanced Global Summit. Reachable on Slack async.",
    status: "approved",
    adminComment: "Approved. Share learnings with the engineering pod.",
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
    remarks: "Family travel and outstation personal leave.",
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
    remarks: "Acute viral fever. Doctor advised 2 days bed rest. Medical prescription attached.",
    attachment: "Medical_Certificate_Apollo_DrRao.pdf",
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
    remarks: "Personal sabbatical for executive management certification.",
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
    remarks: "Personal relocation in Mumbai.",
    status: "rejected",
    adminComment: "Rejected due to Q3 corporate financial audit closure. Please reschedule post Aug 15.",
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
    adminComment: "Take care and get well soon!",
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
    grossPay: 237500,
    basic: 150000,
    hra: 60000,
    specialAllowance: 27500,
    bonus: 0,
    deductions: {
      providentFund: 1800,
      taxDeduction: 15000,
      professionalTax: 200,
      healthInsurance: 1500
    },
    totalDeductions: 18500,
    netPay: 219000,
    status: "paid",
    transactionId: "TXN-DF-IN-982104",
    currency: "₹",
    currencySymbol: "₹"
  },
  {
    id: "pay_2026_06",
    userId: "usr_001",
    month: "June 2026",
    payDate: "2026-06-30",
    grossPay: 237500,
    basic: 150000,
    hra: 60000,
    specialAllowance: 27500,
    bonus: 0,
    deductions: {
      providentFund: 1800,
      taxDeduction: 15000,
      professionalTax: 200,
      healthInsurance: 1500
    },
    totalDeductions: 18500,
    netPay: 219000,
    status: "paid",
    transactionId: "TXN-DF-IN-881902",
    currency: "₹",
    currencySymbol: "₹"
  },
  {
    id: "pay_2026_05",
    userId: "usr_001",
    month: "May 2026",
    payDate: "2026-05-31",
    grossPay: 287500,
    basic: 150000,
    hra: 60000,
    specialAllowance: 27500,
    bonus: 50000, // Annual Performance Appraisal Bonus
    deductions: {
      providentFund: 1800,
      taxDeduction: 22000,
      professionalTax: 200,
      healthInsurance: 1500
    },
    totalDeductions: 25500,
    netPay: 262000,
    status: "paid",
    transactionId: "TXN-DF-IN-771801",
    currency: "₹",
    currencySymbol: "₹"
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
    title: "July 2026 Salary Slip Disbursed",
    message: "Your compensation slip for July 2026 (₹2,19,000 Net) has been credited to your HDFC account.",
    read: true,
    timestamp: "3 days ago",
    link: "/payroll"
  },
  {
    id: "notif_03",
    userId: "usr_001",
    type: "attendance",
    title: "Biometric Punch Logged Successfully",
    message: "Clock-in confirmed at 09:24 AM via Bangalore HQ Floor 4 Terminal.",
    read: false,
    timestamp: "2 hours ago",
    link: "/attendance"
  },
  {
    id: "notif_04",
    userId: "usr_002",
    type: "leave_request",
    title: "New Leave Application",
    message: "Aria Montgomery submitted a Sick Leave request (2 days, viral fever). Review required.",
    read: false,
    timestamp: "1 hour ago",
    link: "/leave/approvals"
  },
  {
    id: "notif_05",
    userId: "usr_003",
    type: "payroll_batch",
    title: "August 2026 Payroll Cycle Open",
    message: "Automated Lambda payroll validation run completed. 100% records reconciled across India hubs.",
    read: false,
    timestamp: "4 hours ago",
    link: "/payroll"
  }
];

export const COMPANY_HOLIDAYS = [
  { name: "Gandhi Jayanti", date: "2026-10-02", day: "Friday", type: "National Gazetted Holiday" },
  { name: "Dussehra / Vijayadashami", date: "2026-10-20", day: "Tuesday", type: "Festive Holiday" },
  { name: "Kannada Rajyotsava", date: "2026-11-01", day: "Sunday", type: "State Public Holiday" },
  { name: "Diwali & Deepavali Break", date: "2026-11-08", day: "Sunday - Monday", type: "Mandatory Corporate Closure" },
  { name: "Christmas & Year-End Closure", date: "2026-12-25", day: "Friday", type: "National Holiday" }
];
