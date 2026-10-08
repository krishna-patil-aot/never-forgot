import nodemailer from 'nodemailer';
import fs from 'node:fs';
import path from 'node:path';
import {
  IEmailOptions,
  ISendEmailResult,
  IWarrantyExpiryEmailData,
} from '@/types/email.types';
import { IFeedbackSubmissionDto } from '@/types/feedback.types';
import { generateWarrantyExpiryEmailHtml } from './emailTemplates/warrantyExpiryTemplate';
import { generateFeedbackEmailHtml } from './emailTemplates/feedbackEmailTemplate';

export class EmailService {
  /**
   * Send a generic HTML email
   */
  static async sendEmail(options: IEmailOptions): Promise<ISendEmailResult> {
    const { to, subject, html, text, from, replyTo } = options;

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT
      ? parseInt(process.env.SMTP_PORT, 10)
      : 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
    const resendApiKey = process.env.RESEND_API_KEY;

    const fromAddress =
      from ||
      process.env.SMTP_FROM ||
      'NeverForgot Expiry Sentinel <notifications@neverforgot.app>';

    // 1. Try Resend if configured
    if (resendApiKey) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromAddress,
            to: [to],
            subject,
            html,
            text,
            ...(replyTo ? { reply_to: replyTo } : {}),
          }),
        });

        const data = (await response.json()) as { id?: string; message?: string };
        if (response.ok && data.id) {
          console.log(`[EmailService] ✅ Email delivered via Resend API to ${to}: ${data.id}`);
          return {
            success: true,
            messageId: data.id,
            deliveredMode: 'resend',
          };
        } else {
          console.warn(`[EmailService] Resend API error:`, data.message);
        }
      } catch (err) {
        console.error(`[EmailService] Resend dispatch failed:`, err);
      }
    }

    // 2. Try SMTP via nodemailer if configured (including Google 16-character App Passwords)
    if (smtpUser && smtpPass) {
      const cleanPass = smtpPass.replace(/\s+/g, '').trim();

      if (cleanPass) {
        try {
          const isGmail =
            (smtpHost && smtpHost.includes('gmail')) ||
            smtpUser.endsWith('@gmail.com') ||
            process.env.SMTP_SERVICE === 'gmail';

          const transporter = isGmail
            ? nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: smtpUser.trim(),
                  pass: cleanPass,
                },
              })
            : nodemailer.createTransport({
                host: smtpHost || 'smtp.gmail.com',
                port: smtpPort,
                secure: smtpPort === 465 || process.env.SMTP_SECURE === 'true',
                auth: {
                  user: smtpUser.trim(),
                  pass: cleanPass,
                },
              });

          const actualFrom =
            from ||
            process.env.SMTP_FROM ||
            `NeverForgot Sentinel <${smtpUser.trim()}>`;

          const info = await transporter.sendMail({
            from: actualFrom,
            to,
            subject,
            text: text || subject,
            html,
            ...(replyTo ? { replyTo } : {}),
          });

          console.log(`[EmailService] 🚀 Email delivered via SMTP/Gmail to ${to}: ${info.messageId}`);
          return {
            success: true,
            messageId: info.messageId,
            deliveredMode: 'smtp',
          };
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : 'SMTP delivery failed';
          console.error(`[EmailService] SMTP send error:`, errorMsg);
        }
      }
    }

    // 3. Fallback for testing: Ethereal Email + scratch HTML preview
    try {
      console.log(`[EmailService] Generating test email dispatch for ${to}...`);
      const testAccount = await nodemailer.createTestAccount();
      const testTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      const info = await testTransporter.sendMail({
        from: fromAddress,
        to,
        subject,
        text: text || subject,
        html,
      });

      const previewUrl = nodemailer.getTestMessageUrl(info) || undefined;

      // Also persist to scratch folder for direct developer inspection
      try {
        const scratchDir = path.join(process.cwd(), 'scratch');
        if (!fs.existsSync(scratchDir)) {
          fs.mkdirSync(scratchDir, { recursive: true });
        }
        const previewFilePath = path.join(scratchDir, 'latest-test-email.html');
        fs.writeFileSync(previewFilePath, html, 'utf-8');
      } catch {
        // Ignore file system write errors if in serverless environment
      }

      console.log(`[EmailService] 📬 Test email rendered! Preview URL: ${previewUrl}`);

      return {
        success: true,
        messageId: info.messageId,
        previewUrl,
        deliveredMode: 'preview_fallback',
      };
    } catch (fallbackErr) {
      const errorMsg =
        fallbackErr instanceof Error
          ? fallbackErr.message
          : 'Failed to dispatch email';
      return {
        success: false,
        error: errorMsg,
        deliveredMode: 'preview_fallback',
      };
    }
  }

  /**
   * Send a formatted Warranty / Asset Expiration Alert
   */
  static async sendWarrantyExpiryAlert(
    data: IWarrantyExpiryEmailData
  ): Promise<ISendEmailResult> {
    const html = generateWarrantyExpiryEmailHtml(data);
    const subject =
      data.daysRemaining === 1
        ? `🚨 [FINAL NOTICE] Warranty Expires Tomorrow: ${data.assetTitle}`
        : data.daysRemaining === 0
        ? `🚨 [FINAL NOTICE] Warranty Expires Today: ${data.assetTitle}`
        : data.daysRemaining <= 7 && data.daysRemaining > 1
        ? `⚠️ [7-Day Reminder] Warranty Expiring: ${data.assetTitle} (${data.daysRemaining} days left)`
        : data.daysRemaining < 0
        ? `⚠️ Coverage Expired: ${data.assetTitle}`
        : `⚠️ Warranty Expiring: ${data.assetTitle} (${data.daysRemaining} days remaining)`;

    const text =
      data.daysRemaining <= 1 && data.daysRemaining >= 0
        ? `FINAL NOTICE: Warranty for ${data.assetTitle} expires ${data.daysRemaining === 0 ? 'today' : 'tomorrow'} (${data.expiryDate}). Please file any claims immediately.`
        : `7-Day Reminder: Warranty for ${data.assetTitle} is scheduled to expire in ${data.daysRemaining} days on ${data.expiryDate}. Review asset and take action.`;

    return this.sendEmail({
      to: data.recipientEmail,
      subject,
      html,
      text,
    });
  }

  /**
   * Send 6-Digit OTP for Login or Registration
   */
  static async sendOtpEmail(
    email: string,
    otpCode: string,
    purpose: 'login' | 'reset_password' | 'register' = 'login'
  ): Promise<ISendEmailResult> {
    const { generateOtpEmailHtml } = await import(
      './emailTemplates/otpEmailTemplate'
    );
    const html = generateOtpEmailHtml(email, otpCode, purpose);
    const subject = `🔑 NeverForgot Verification Code: ${otpCode}`;

    return this.sendEmail({
      to: email,
      subject,
      html,
      text: `Your NeverForgot verification code is ${otpCode}. It is valid for 10 minutes.`,
    });
  }

  /**
   * Send Password Reset OTP
   */
  static async sendPasswordResetEmail(
    email: string,
    otpCode: string
  ): Promise<ISendEmailResult> {
    return this.sendOtpEmail(email, otpCode, 'reset_password');
  }

  /**
   * Send User Feedback to Application Owner
   */
  static async sendFeedbackEmail(
    feedbackData: IFeedbackSubmissionDto
  ): Promise<ISendEmailResult> {
    let recipientEmail =
      process.env.FEEDBACK_RECEIVER_EMAIL ||
      process.env.ADMIN_EMAIL;

    // Dynamically fallback to admin in database or SMTP_USER
    if (!recipientEmail) {
      try {
        const { prisma } = await import('@/lib/prisma');
        const adminUser = await prisma.user.findFirst({
          where: { role: 'admin' },
          select: { email: true },
        });
        if (adminUser?.email) {
          recipientEmail = adminUser.email;
        }
      } catch {
        // Fall through to SMTP_USER
      }
    }

    if (!recipientEmail) {
      recipientEmail = process.env.SMTP_USER || 'notifications@neverforgot.app';
    }

    const categoryNames: Record<string, string> = {
      bug_report: 'Bug Report',
      feature_request: 'Feature Request',
      ui_experience: 'UI Experience',
      general: 'General Feedback',
    };

    const categoryLabel = categoryNames[feedbackData.category] || 'Feedback';
    const stars = '★'.repeat(feedbackData.rating);
    const subject = `${stars} [User Feedback] ${feedbackData.rating}/5 from ${feedbackData.userName || 'User'} (${categoryLabel})`;
    const html = generateFeedbackEmailHtml(feedbackData, recipientEmail);
    const text = `User Feedback (${feedbackData.rating}/5 Stars) from ${feedbackData.userName} (${feedbackData.userEmail}):\nCategory: ${categoryLabel}\nMessage: ${feedbackData.message}`;

    console.log(
      `[EmailService] 📬 Dispatching user feedback from ${feedbackData.userEmail} to owner: ${recipientEmail}`
    );

    return this.sendEmail({
      to: recipientEmail,
      subject,
      html,
      text,
      replyTo: feedbackData.userEmail ? `${feedbackData.userName} <${feedbackData.userEmail}>` : undefined,
    });
  }

  /**
   * Send Welcome Email to newly registered user
   */
  static async sendWelcomeEmail(
    email: string,
    fullName: string
  ): Promise<ISendEmailResult> {
    const { generateWelcomeEmailHtml } = await import(
      './emailTemplates/welcomeEmailTemplate'
    );
    const html = generateWelcomeEmailHtml({
      userName: fullName,
      userEmail: email,
    });
    const subject = `✨ Welcome to NeverForgot – We're Glad to Have You, ${fullName || 'Member'}!`;
    const text = `Hello ${fullName},\n\nNeverForgot is glad to welcome you!\n\nYour smart digital asset, warranty, and proactive renewal sentinel is now ready.\n\nOpen your vault: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}\n\nNeverForgot Sentinel Team`;

    console.log(
      `[EmailService] ✉️ Sending welcome email to newly registered user: ${email}`
    );

    return this.sendEmail({
      to: email,
      subject,
      html,
      text,
    });
  }

  /**
   * Send automated EMI installment reminder alert (7-day or 1-day notice)
   */
  static async sendEmiReminderAlert(
    data: import('@/types/email.types').IEmiReminderEmailData
  ): Promise<ISendEmailResult> {
    const isUrgent = data.daysRemaining <= 1;
    const dueLabel =
      data.daysRemaining === 0
        ? 'TODAY'
        : data.daysRemaining === 1
        ? 'TOMORROW'
        : `in ${data.daysRemaining} days`;
    const subject = isUrgent
      ? `🚨 Urgent EMI Due ${dueLabel}: ₹${data.emiAmount.toLocaleString('en-IN')} for ${data.emiTitle}`
      : `⚠️ 7-Day EMI Reminder: ₹${data.emiAmount.toLocaleString('en-IN')} for ${data.emiTitle} due on ${data.dueDate}`;

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #0f172a; margin: 0 0 8px 0; font-size: 22px;">💳 NeverForgot EMI Sentinel</h2>
          <span style="display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: bold; background: ${
            isUrgent ? '#fee2e2; color: #b91c1c;' : '#e0f2fe; color: #0369a1;'
          }">
            ${isUrgent ? 'URGENT PAYMENT NOTICE' : 'UPCOMING EMI PAYMENT'}
          </span>
        </div>
        <p style="font-size: 14px; color: #334155; margin-bottom: 20px;">
          Hi <strong>${data.recipientName}</strong>, this is an automated reminder for your upcoming loan EMI installment.
        </p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Loan Title:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #0f172a; text-align: right;">${data.emiTitle}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Lender / Bank:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #0f172a; text-align: right;">${data.lenderName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Loan Type:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #0f172a; text-align: right; text-transform: capitalize;">${data.loanType.replace(/_/g, ' ')}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Monthly EMI:</td>
              <td style="padding: 6px 0; font-weight: 800; color: #0284c7; text-align: right; font-size: 16px;">₹${data.emiAmount.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Due Date:</td>
              <td style="padding: 6px 0; font-weight: bold; color: ${
                isUrgent ? '#dc2626' : '#0f172a'
              }; text-align: right;">${data.dueDate} (${dueLabel})</td>
            </tr>
            ${
              data.accountNumber
                ? `<tr>
              <td style="padding: 6px 0; color: #64748b;">Account Number:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #0f172a; text-align: right;">${data.accountNumber}</td>
            </tr>`
                : ''
            }
          </table>
        </div>
        <div style="text-align: center; margin-top: 24px;">
          <a href="${data.actionUrl}" style="display: inline-block; padding: 12px 28px; background: #0891b2; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 14px; border-radius: 12px; box-shadow: 0 2px 4px rgba(8, 145, 178, 0.2);">
            View Loan & Mark Paid
          </a>
        </div>
        <p style="text-align: center; font-size: 11px; color: #94a3b8; margin-top: 28px;">
          NeverForgot • Automated financial alerts to ensure zero late fees or credit score impact.
        </p>
      </div>
    `;

    return this.sendEmail({
      to: data.recipientEmail,
      subject,
      html,
      text: `Hi ${data.recipientName}, your EMI of ₹${data.emiAmount} for ${data.emiTitle} (${data.lenderName}) is due ${dueLabel} on ${data.dueDate}. View your loan: ${data.actionUrl}`,
    });
  }
}

