import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/server/services/email.service';
import { getAuthenticatedUser } from '@/server/auth/session';
import {
  IFeedbackSubmissionDto,
  IFeedbackApiResponse,
  FeedbackCategory,
} from '@/types/feedback.types';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest
): Promise<NextResponse<IFeedbackApiResponse>> {
  try {
    const body = (await request.json()) as Partial<IFeedbackSubmissionDto>;

    // 1. Rating validation (1 to 5)
    const rating = Number(body.rating);
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide a star rating between 1 and 5.',
        },
        { status: 400 }
      );
    }

    // 2. Feedback message validation
    if (!body.message || !body.message.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide your feedback or issue description.',
        },
        { status: 400 }
      );
    }

    // 3. Category validation
    const validCategories: FeedbackCategory[] = [
      'bug_report',
      'feature_request',
      'ui_experience',
      'general',
    ];
    const category: FeedbackCategory =
      body.category && validCategories.includes(body.category)
        ? body.category
        : 'general';

    // 4. Resolve authenticated user if available (prioritize verified session)
    const authUser = await getAuthenticatedUser(request).catch(() => null);

    const userName =
      authUser?.fullName ||
      body.userName?.trim() ||
      'NeverForgot App User';

    const userEmail =
      authUser?.email ||
      body.userEmail?.trim() ||
      'user@neverforgot.app';

    const payload: IFeedbackSubmissionDto = {
      rating,
      category,
      message: body.message.trim(),
      userName,
      userEmail,
      selectedTags: Array.isArray(body.selectedTags) ? body.selectedTags : [],
      deviceInfo: body.deviceInfo,
    };

    // 5. Dispatch email to application owner
    const emailResult = await EmailService.sendFeedbackEmail(payload);

    console.log(
      `[Feedback API] ✅ Feedback processed from ${userEmail} (${rating}⭐) | Result: ${emailResult.deliveredMode}`
    );

    return NextResponse.json({
      success: true,
      message: 'Thank you for your valuable feedback! Our team has received your submission.',
      feedbackId: emailResult.messageId || `fb_${Date.now()}`,
      deliveredMode: emailResult.deliveredMode,
    });
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : 'Failed to submit feedback';
    console.error('[Feedback API] Error:', errorMsg);
    return NextResponse.json(
      {
        success: false,
        message: errorMsg,
      },
      { status: 500 }
    );
  }
}
