import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OcrService } from '@/server/services/ocr.service';
import { ensureDbInitialized } from '@/server/initDb';
import { getAuthenticatedUser } from '@/server/auth/session';
import { IApiResponse, IScanDocumentRequest, IScanDocumentResult } from '@/types/api.types';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest
): Promise<NextResponse<IApiResponse<IScanDocumentResult | null>>> {
  await ensureDbInitialized();

  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: 'Please sign in to scan bills and warranties into your vault.',
        },
        { status: 401 }
      );
    }

    const payload: IScanDocumentRequest = (await request.json()) as IScanDocumentRequest;

    if (!payload.fileName) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: 'Document file name is required',
        },
        { status: 400 }
      );
    }

    // Execute dual-engine OCR extraction
    const result = await OcrService.scanDocument(payload);

    // Asynchronously log audit trail for model analytics
    try {
      await prisma.aiAuditLog.create({
        data: {
          documentName: payload.fileName,
          detectedCategory: result.extraction.category,
          confidence: result.confidenceScore,
          status: 'accurate',
          originalTitle: result.extraction.title,
          rawSummary: result.extraction.rawSummary,
          processingEngine: result.processingEngine,
        },
      });
    } catch {
      // Non-blocking analytics
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `Document parsed successfully with ${result.processingEngine}`,
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'AI scanning process failed';
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
