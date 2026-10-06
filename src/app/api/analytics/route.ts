import { NextRequest, NextResponse } from "next/server";
import { AnalyticsRepository } from "@/server/repositories/analytics.repository";
import { ensureDbInitialized } from "@/server/initDb";
import { getAuthenticatedUser } from "@/server/auth/session";
import { IApiResponse, IAnalyticsSummary } from "@/types/api.types";

export const dynamic = "force-dynamic";

const EMPTY_SUMMARY: IAnalyticsSummary = {
  totalAssetsTracked: 0,
  activeCount: 0,
  expiringSoonCount: 0,
  expiredCount: 0,
  totalProtectedValue: 0,
  categoryBreakdown: {
    electronics: 0,
    vehicle: 0,
    health_insurance: 0,
    life_insurance: 0,
    home_amc: 0,
    personal_doc: 0,
  },
  upcomingMilestonesCount: 0,
  daysToNextExpiry: null,
  nextExpiringAssetTitle: null,
};

export async function GET(
  request: NextRequest,
): Promise<NextResponse<IApiResponse<IAnalyticsSummary>>> {
  await ensureDbInitialized();

  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({
        success: true,
        data: EMPTY_SUMMARY,
        message: "Guest analytics — sign in to view personal vault metrics",
      });
    }

    const summary = await AnalyticsRepository.getSummary(user.id);

    return NextResponse.json({
      success: true,
      data: summary,
      message: "Live user analytics retrieved successfully",
    });
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "Failed to retrieve analytics";
    return NextResponse.json(
      {
        success: false,
        data: EMPTY_SUMMARY,
        error: errorMsg,
      },
      { status: 500 },
    );
  }
}
