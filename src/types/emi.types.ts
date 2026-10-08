export type LoanType =
  | 'home_loan'
  | 'car_loan'
  | 'personal_loan'
  | 'bike_loan'
  | 'education_loan'
  | 'gold_loan'
  | 'consumer_loan'
  | 'business_loan'
  | 'other';

export type EmiStatus = 'active' | 'completed' | 'paused';

export interface IEmiReminder {
  id: string;
  userId: string;
  title: string;
  loanType: LoanType;
  lenderName: string;
  accountNumber?: string;
  emiAmount: number;
  dueDay: number; // 1-31
  totalLoanAmount?: number;
  interestRate?: number;
  tenureMonths?: number;
  startDate: string; // ISO 8601 string
  endDate?: string; // ISO 8601 string
  autoDebit: boolean;
  debitAccount?: string;
  status: EmiStatus;
  documentUrl?: string;
  documentName?: string;
  notes?: string;
  lastPaidMonth?: string; // "YYYY-MM"
  createdAt: string;
  updatedAt: string;
  // Computed dynamic fields
  nextDueDate: string;
  daysUntilDue: number;
  isDueSoon: boolean; // <= 7 days
  isUrgent: boolean; // <= 1 day
  isPaidThisMonth: boolean;
}

export interface ICreateEmiDto {
  title: string;
  loanType: LoanType;
  lenderName: string;
  accountNumber?: string;
  emiAmount: number;
  dueDay: number;
  totalLoanAmount?: number;
  interestRate?: number;
  tenureMonths?: number;
  startDate: string;
  endDate?: string;
  autoDebit?: boolean;
  debitAccount?: string;
  documentUrl?: string;
  documentName?: string;
  notes?: string;
}

export interface IUpdateEmiDto {
  title?: string;
  loanType?: LoanType;
  lenderName?: string;
  accountNumber?: string;
  emiAmount?: number;
  dueDay?: number;
  totalLoanAmount?: number;
  interestRate?: number;
  tenureMonths?: number;
  startDate?: string;
  endDate?: string;
  autoDebit?: boolean;
  debitAccount?: string;
  status?: EmiStatus;
  documentUrl?: string;
  documentName?: string;
  notes?: string;
  lastPaidMonth?: string;
}

export interface IEmiFilterQuery {
  loanType?: LoanType | 'all';
  status?: EmiStatus | 'all';
  searchQuery?: string;
}

export interface IEmiMetrics {
  totalMonthlyOutflow: number;
  activeCount: number;
  upcomingDueCount: number; // due within 7 days
  urgentDueCount: number; // due within 1 day
  totalPrincipal: number;
  paidThisMonthCount: number;
}
