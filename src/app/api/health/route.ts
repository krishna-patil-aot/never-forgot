import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureDbInitialized } from '@/server/initDb';
import { IApiResponse, ISystemHealth } from '@/types/api.types';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse<IApiResponse<ISystemHealth>>> {
  await ensureDbInitialized();

  try {
    const assetCount = await prisma.asset.count();
    const hasGemini = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);

    const health: ISystemHealth = {
      status: 'healthy',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        provider: 'sqlite (dev.db)',
        totalAssets: assetCount,
      },
      aiEngine: {
        geminiConfigured: hasGemini,
        mode: hasGemini ? 'gemini' : 'heuristic-fallback',
      },
    };

    return NextResponse.json({
      success: true,
      data: health,
      message: 'NeverForgot backend is healthy and operational',
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown health check failure';
    return NextResponse.json(
      {
        success: false,
        data: {
          status: 'unhealthy',
          uptimeSeconds: Math.floor(process.uptime()),
          timestamp: new Date().toISOString(),
          database: {
            connected: false,
            provider: 'sqlite (dev.db)',
            totalAssets: 0,
          },
          aiEngine: {
            geminiConfigured: false,
            mode: 'heuristic-fallback',
          },
        },
        error: errorMsg,
      },
      { status: 500 }
    );
  }
}
