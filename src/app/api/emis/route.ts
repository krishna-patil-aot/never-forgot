import { NextRequest, NextResponse } from 'next/server';
import { EmiRepository } from '@/server/repositories/emi.repository';
import { ensureDbInitialized } from '@/server/initDb';
import { getAuthenticatedUser } from '@/server/auth/session';
import { IApiResponse } from '@/types/api.types';
import {
  IEmiReminder,
  ICreateEmiDto,
  IEmiFilterQuery,
  LoanType,
  EmiStatus,
} from '@/types/emi.types';
import { isDateBefore } from '@/lib/dateUtils';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest
): Promise<NextResponse<IApiResponse<IEmiReminder[]>>> {
  await ensureDbInitialized();

  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'Guest session — sign in to view your live EMI loans',
      });
    }

    const { searchParams } = new URL(request.url);
    const loanTypeParam = searchParams.get('loanType');
    const statusParam = searchParams.get('status');
    const searchQuery = searchParams.get('searchQuery') || undefined;

    const filterQuery: IEmiFilterQuery = {
      loanType:
        loanTypeParam && loanTypeParam !== 'all'
          ? (loanTypeParam as LoanType)
          : 'all',
      status:
        statusParam && statusParam !== 'all'
          ? (statusParam as EmiStatus)
          : 'all',
      searchQuery,
    };

    const emis = await EmiRepository.findMany(user.id, filterQuery);

    return NextResponse.json({
      success: true,
      data: emis,
      message: 'EMI reminders retrieved successfully',
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to fetch EMIs';
    return NextResponse.json(
      {
        success: false,
        data: [],
        error: errorMsg,
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<IApiResponse<IEmiReminder | null>>> {
  await ensureDbInitialized();

  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: 'Please sign in to register EMI reminders',
        },
        { status: 401 }
      );
    }

    const body: ICreateEmiDto = (await request.json()) as ICreateEmiDto;

    if (!body.title || !body.lenderName || !body.loanType || !body.emiAmount || !body.dueDay || !body.startDate) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: 'Missing required EMI fields (title, lenderName, loanType, emiAmount, dueDay, startDate)',
        },
        { status: 400 }
      );
    }

    if (body.endDate && isDateBefore(body.endDate, body.startDate)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: 'Loan completion end date cannot be before loan start date.',
        },
        { status: 400 }
      );
    }

    const created = await EmiRepository.create(body, user.id);

    return NextResponse.json(
      {
        success: true,
        data: created,
        message: 'EMI reminder created successfully',
      },
      { status: 201 }
    );
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to create EMI';
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: errorMsg,
      },
      { status: 500 }
    );
  }
}
