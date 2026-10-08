import moment from 'moment';
import { prisma } from '@/lib/prisma';
import {
  IEmiReminder,
  ICreateEmiDto,
  IUpdateEmiDto,
  IEmiFilterQuery,
  LoanType,
  EmiStatus,
} from '@/types/emi.types';

type PrismaEmiRecord = {
  id: string;
  userId: string;
  title: string;
  loanType: string;
  lenderName: string;
  accountNumber: string | null;
  emiAmount: number;
  dueDay: number;
  totalLoanAmount: number | null;
  interestRate: number | null;
  tenureMonths: number | null;
  startDate: Date;
  endDate: Date | null;
  autoDebit: boolean;
  debitAccount: string | null;
  status: string;
  documentUrl: string | null;
  documentName: string | null;
  notes: string | null;
  lastPaidMonth: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export function computeEmiDueDateDetails(dueDay: number, lastPaidMonth: string | null): {
  nextDueDate: string;
  daysUntilDue: number;
  isDueSoon: boolean;
  isUrgent: boolean;
  isPaidThisMonth: boolean;
} {
  const now = moment().startOf('day');
  const currentYearMonth = now.format('YYYY-MM');
  const currentMonthDue = moment()
    .date(Math.min(dueDay, moment().daysInMonth()))
    .startOf('day');

  let targetDueDate = currentMonthDue;
  if (now.isAfter(currentMonthDue, 'day')) {
    // If due day for this month has already passed, next due is next month
    const nextMonth = moment().add(1, 'month');
    targetDueDate = nextMonth
      .date(Math.min(dueDay, nextMonth.daysInMonth()))
      .startOf('day');
  }

  const daysUntilDue = targetDueDate.diff(now, 'days');
  const isPaidThisMonth = lastPaidMonth === currentYearMonth;
  const isDueSoon = daysUntilDue <= 7 && daysUntilDue > 1 && !isPaidThisMonth;
  const isUrgent = daysUntilDue <= 1 && daysUntilDue >= 0 && !isPaidThisMonth;

  return {
    nextDueDate: targetDueDate.toISOString(),
    daysUntilDue,
    isDueSoon,
    isUrgent,
    isPaidThisMonth,
  };
}

export function mapPrismaToEmiReminder(raw: PrismaEmiRecord): IEmiReminder {
  const computed = computeEmiDueDateDetails(raw.dueDay, raw.lastPaidMonth);

  return {
    id: raw.id,
    userId: raw.userId,
    title: raw.title,
    loanType: raw.loanType as LoanType,
    lenderName: raw.lenderName,
    accountNumber: raw.accountNumber ?? undefined,
    emiAmount: raw.emiAmount,
    dueDay: raw.dueDay,
    totalLoanAmount: raw.totalLoanAmount ?? undefined,
    interestRate: raw.interestRate ?? undefined,
    tenureMonths: raw.tenureMonths ?? undefined,
    startDate: raw.startDate.toISOString(),
    endDate: raw.endDate ? raw.endDate.toISOString() : undefined,
    autoDebit: raw.autoDebit,
    debitAccount: raw.debitAccount ?? undefined,
    status: raw.status as EmiStatus,
    documentUrl: raw.documentUrl ?? undefined,
    documentName: raw.documentName ?? undefined,
    notes: raw.notes ?? undefined,
    lastPaidMonth: raw.lastPaidMonth ?? undefined,
    createdAt: raw.createdAt.toISOString(),
    updatedAt: raw.updatedAt.toISOString(),
    nextDueDate: computed.nextDueDate,
    daysUntilDue: computed.daysUntilDue,
    isDueSoon: computed.isDueSoon,
    isUrgent: computed.isUrgent,
    isPaidThisMonth: computed.isPaidThisMonth,
  };
}

export class EmiRepository {
  /**
   * Find user EMI reminders with optional loan type and status filters
   */
  static async findMany(userId: string, filters?: IEmiFilterQuery): Promise<IEmiReminder[]> {
    const whereConditions: {
      userId: string;
      loanType?: string;
      status?: string;
      OR?: Array<{
        title?: { contains: string };
        lenderName?: { contains: string };
        accountNumber?: { contains: string };
      }>;
    } = {
      userId,
    };

    if (filters?.loanType && filters.loanType !== 'all') {
      whereConditions.loanType = filters.loanType;
    }

    if (filters?.status && filters.status !== 'all') {
      whereConditions.status = filters.status;
    }

    if (filters?.searchQuery && filters.searchQuery.trim().length > 0) {
      const q = filters.searchQuery.trim();
      whereConditions.OR = [
        { title: { contains: q } },
        { lenderName: { contains: q } },
        { accountNumber: { contains: q } },
      ];
    }

    const records = await prisma.emiReminder.findMany({
      where: whereConditions,
      orderBy: { dueDay: 'asc' },
    });

    return records.map(mapPrismaToEmiReminder);
  }

  /**
   * Find single EMI reminder by ID
   */
  static async findById(id: string, userId: string): Promise<IEmiReminder | null> {
    const record = await prisma.emiReminder.findFirst({
      where: { id, userId },
    });

    if (!record) return null;
    return mapPrismaToEmiReminder(record);
  }

  /**
   * Create a new EMI reminder
   */
  static async create(dto: ICreateEmiDto, userId: string): Promise<IEmiReminder> {
    const created = await prisma.emiReminder.create({
      data: {
        userId,
        title: dto.title,
        loanType: dto.loanType,
        lenderName: dto.lenderName,
        accountNumber: dto.accountNumber || null,
        emiAmount: Math.max(0, dto.emiAmount),
        dueDay: Math.max(1, Math.min(31, dto.dueDay)),
        totalLoanAmount:
          dto.totalLoanAmount !== undefined && dto.totalLoanAmount !== null
            ? Math.max(0, dto.totalLoanAmount)
            : null,
        interestRate:
          dto.interestRate !== undefined && dto.interestRate !== null
            ? Math.max(0, dto.interestRate)
            : null,
        tenureMonths:
          dto.tenureMonths !== undefined && dto.tenureMonths !== null
            ? Math.max(1, dto.tenureMonths)
            : null,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        autoDebit: dto.autoDebit ?? true,
        debitAccount: dto.debitAccount || null,
        documentUrl: dto.documentUrl || null,
        documentName: dto.documentName || null,
        notes: dto.notes || null,
        status: 'active',
      },
    });

    return mapPrismaToEmiReminder(created);
  }

  /**
   * Update an existing EMI reminder
   */
  static async update(
    id: string,
    dto: IUpdateEmiDto,
    userId: string
  ): Promise<IEmiReminder | null> {
    const existing = await prisma.emiReminder.findFirst({
      where: { id, userId },
    });

    if (!existing) return null;

    const updated = await prisma.emiReminder.update({
      where: { id },
      data: {
        title: dto.title ?? existing.title,
        loanType: dto.loanType ?? existing.loanType,
        lenderName: dto.lenderName ?? existing.lenderName,
        accountNumber:
          dto.accountNumber !== undefined ? dto.accountNumber : existing.accountNumber,
        emiAmount:
          dto.emiAmount !== undefined ? Math.max(0, dto.emiAmount) : existing.emiAmount,
        dueDay:
          dto.dueDay !== undefined
            ? Math.max(1, Math.min(31, dto.dueDay))
            : existing.dueDay,
        totalLoanAmount:
          dto.totalLoanAmount !== undefined
            ? dto.totalLoanAmount !== null
              ? Math.max(0, dto.totalLoanAmount)
              : null
            : existing.totalLoanAmount,
        interestRate:
          dto.interestRate !== undefined
            ? dto.interestRate !== null
              ? Math.max(0, dto.interestRate)
              : null
            : existing.interestRate,
        tenureMonths:
          dto.tenureMonths !== undefined
            ? dto.tenureMonths !== null
              ? Math.max(1, dto.tenureMonths)
              : null
            : existing.tenureMonths,
        startDate: dto.startDate ? new Date(dto.startDate) : existing.startDate,
        endDate:
          dto.endDate !== undefined
            ? dto.endDate
              ? new Date(dto.endDate)
              : null
            : existing.endDate,
        autoDebit: dto.autoDebit !== undefined ? dto.autoDebit : existing.autoDebit,
        debitAccount:
          dto.debitAccount !== undefined ? dto.debitAccount : existing.debitAccount,
        status: dto.status ?? existing.status,
        documentUrl:
          dto.documentUrl !== undefined ? dto.documentUrl : existing.documentUrl,
        documentName:
          dto.documentName !== undefined ? dto.documentName : existing.documentName,
        notes: dto.notes !== undefined ? dto.notes : existing.notes,
        lastPaidMonth:
          dto.lastPaidMonth !== undefined ? dto.lastPaidMonth : existing.lastPaidMonth,
      },
    });

    return mapPrismaToEmiReminder(updated);
  }

  /**
   * Toggle or mark EMI as paid for the current month
   */
  static async togglePaidCurrentMonth(
    id: string,
    userId: string
  ): Promise<IEmiReminder | null> {
    const existing = await prisma.emiReminder.findFirst({
      where: { id, userId },
    });

    if (!existing) return null;

    const currentMonth = moment().format('YYYY-MM');
    const newPaidMonth = existing.lastPaidMonth === currentMonth ? null : currentMonth;

    const updated = await prisma.emiReminder.update({
      where: { id },
      data: { lastPaidMonth: newPaidMonth },
    });

    return mapPrismaToEmiReminder(updated);
  }

  /**
   * Delete an EMI reminder
   */
  static async delete(id: string, userId: string): Promise<boolean> {
    const existing = await prisma.emiReminder.findFirst({
      where: { id, userId },
    });

    if (!existing) return false;

    await prisma.notification.deleteMany({
      where: { userId, emiId: id },
    });

    await prisma.emiReminder.delete({ where: { id } });
    return true;
  }
}
