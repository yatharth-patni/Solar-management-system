export type PaymentType = 'Advance' | 'Milestone' | 'Final';
export type PaymentMethod = 'Bank Wire' | 'Direct Debit' | 'Cheque' | 'Credit Card' | 'Digital Gateway';
export type PaymentStatus = 'Cleared' | 'Pending Verification' | 'Overdue' | 'Refunded';

export interface CustomerPayment {
  id: string; // e.g. 'PAY-801'
  paymentNumber: string;
  customerId: string;
  customerName: string;
  projectId: string;
  projectName: string;
  paymentType: PaymentType;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  paymentDate: string;
  referenceNo: string;
  notes?: string;
}

export type InvoiceType = 'Installation Contract' | 'Equipment Sale' | 'Out-of-Warranty Repair';
export type InvoiceStatus = 'Paid' | 'Issued' | 'Pending Payment' | 'Overdue';

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxPercent: number;
  total: number;
}

export interface Invoice {
  id: string; // e.g. 'INV-2024-101'
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  projectId?: string;
  projectName?: string;
  invoiceType: InvoiceType;
  issueDate: string;
  dueDate: string;
  items: InvoiceLineItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  paidAmount: number;
  balanceDue: number;
  paymentTerms: string;
  notes?: string;
}

export type ExpenseCategory = 
  | 'Hardware Procurement' 
  | 'Logistics & Haulage' 
  | 'Civil Subcontractor' 
  | 'Permits & Grid Interconnection' 
  | 'Tools & Safety Equipment'
  | 'Operational Overhead';

export type ExpenseStatus = 'Paid' | 'Approved' | 'Pending Approval' | 'Rejected';

export interface CompanyExpense {
  id: string; // e.g. 'EXP-901'
  expenseNumber: string;
  category: ExpenseCategory;
  vendorName: string;
  description: string;
  amount: number;
  expenseDate: string;
  dueDate: string;
  paymentStatus: ExpenseStatus;
  approvedBy?: string;
  linkedProjectId?: string;
  receiptAttachment?: string;
}

export interface ProjectCosting {
  id: string; // e.g. 'CST-401'
  projectId: string;
  projectName: string;
  customerName: string;
  capacityKw: number;
  contractPrice: number;
  estimatedCost: number;
  hardwareCost: number;
  laborCost: number;
  logisticsCost: number;
  permitsCost: number;
  actualTotalCost: number;
  netProfit: number;
  profitMarginPercent: number;
  status: 'Completed' | 'In Progress' | 'Over Budget' | 'Pending Commissioning';
}

export interface TechnicianPayout {
  id: string; // e.g. 'PAYOUT-301'
  technicianId: string;
  technicianName: string;
  specialization: string;
  completedInstallations: number;
  serviceVisits: number;
  baseRateAmount: number;
  milestoneBonus: number;
  totalPayout: number;
  payPeriod: string;
  status: 'Disbursed' | 'Approved' | 'Pending Verification';
  disbursementDate?: string;
  paymentRef?: string;
}

export type DisbursalStatus = 
  | 'Disbursed to Customer' 
  | 'Inspection Completed' 
  | 'Documentation Submitted' 
  | 'Discom Approval Pending';

export type ClaimStatus = 'Claim Received' | 'In Process' | 'Query Raised' | 'Disbursed';

export interface SubsidyClaim {
  id: string; // e.g. 'SUB-701'
  applicationNumber: string;
  customerName: string;
  consumerNumber: string;
  discomName: string;
  siteAddress: string;
  capacityKw: number;
  schemeName: string; // e.g. 'National Rooftop Solar Subsidy Phase II'
  subsidyAmount: number;
  submissionDate: string;
  approvalDate?: string;
  disbursalDate?: string;
  disbursalStatus: DisbursalStatus;
  claimStatus: ClaimStatus;
  trackingRemarks: string;
}

export interface FinancialMetricKPI {
  totalRevenue: number;
  recognizedRevenue: number;
  advanceReceivables: number;
  totalExpenses: number;
  netOperatingProfit: number;
  operatingCashFlow: number;
  profitMarginPercentage: number;
  pendingInvoicesValue: number;
  pendingSubsidiesValue: number;
}
