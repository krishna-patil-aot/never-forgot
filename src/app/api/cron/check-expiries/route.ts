import { NextRequest, NextResponse } from 'next/server';
import { NotificationService } from '@/server/services/notification.service';
import { ensureDbInitialized } from '@/server/initDb';

export const dynamic = 'force-dynamic';

/**
 * Automated Cron / Sentinel Runner for Warranty Expiration Checks
 * Automatically monitors all users and assets across the platform:
 * - 7 Days before expiration ("before 7 day") -> In-app alert + app-styled email
 * - 1 Last day before expiration ("one last day before expired") -> In-app alert + urgent app-styled email
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  await ensureDbInitialized();

  try {
    // Optional bearer / query token validation for production security
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = request.headers.get('authorization');
    const querySecret = request.nextUrl.searchParams.get('secret');

    if (cronSecret && authHeader !== `Bearer ${cronSecret}` && querySecret !== cronSecret) {
      return NextResponse.json({ success: false, error: 'Unauthorized cron invocation' }, { status: 401 });
    }

    const result = await NotificationService.checkAllUsersExpiringAssets();

    return NextResponse.json({
      success: true,
      message: 'Automated expiry sentinel executed successfully',
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Cron execution failed';
    console.error('[Cron:check-expiries] Error:', errorMsg);
    return NextResponse.json(
      {
        success: false,
        error: errorMsg,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return GET(request);
}
