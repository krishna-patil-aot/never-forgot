import { IFeedbackSubmissionDto } from '@/types/feedback.types';

export function generateFeedbackEmailHtml(
  data: IFeedbackSubmissionDto,
  recipientEmail: string
): string {
  const { rating, category, message, userName, userEmail, selectedTags, deviceInfo } = data;

  const starIcons = '★'.repeat(rating) + '☆'.repeat(5 - rating);

  const categoryLabels: Record<string, { label: string; color: string; bg: string }> = {
    bug_report: { label: '🐛 Bug / Issue Report', color: '#be123c', bg: '#ffe4e6' },
    feature_request: { label: '💡 Feature Request', color: '#6d28d9', bg: '#ede9fe' },
    ui_experience: { label: '🎨 UI & Usability Experience', color: '#0369a1', bg: '#e0f2fe' },
    general: { label: '💬 General Feedback', color: '#0f766e', bg: '#ccfbf1' },
  };

  const categoryMeta = categoryLabels[category] || {
    label: '💬 User Feedback',
    color: '#0f766e',
    bg: '#ccfbf1',
  };

  const ratingLabels: Record<number, string> = {
    1: 'Very Disappointed (1/5)',
    2: 'Needs Improvement (2/5)',
    3: 'Average / Fair (3/5)',
    4: 'Great Experience (4/5)',
    5: 'Excellent & Delighted (5/5)',
  };

  const ratingDesc = ratingLabels[rating] || `${rating}/5 Stars`;

  const tagsHtml =
    selectedTags && selectedTags.length > 0
      ? selectedTags
          .map(
            (tag) =>
              `<span style="display: inline-block; background-color: #f1f5f9; color: #334155; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 9999px; margin-right: 6px; margin-bottom: 6px; border: 1px solid #e2e8f0;">${tag}</span>`
          )
          .join('')
      : '';

  const sanitizedMessage = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New User Feedback - NeverForgot</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f1f5f9; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0;" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Brand Header Banner -->
          <tr>
            <td bgcolor="#091e3a" style="background-color: #091e3a; background: linear-gradient(135deg, #091e3a 0%, #0e7490 60%, #059669 100%); padding: 32px 28px; text-align: left;">
              <div style="display: inline-block; background-color: #1e293b; border: 1px solid #38bdf8; border-radius: 12px; padding: 7px 14px; margin-bottom: 14px;">
                <span style="color: #38bdf8 !important; font-size: 12px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">
                  📬 NeverForgot • Feedback Center
                </span>
              </div>
              <h1 style="color: #ffffff !important; font-size: 22px; font-weight: 800; margin: 0 0 6px 0; letter-spacing: -0.3px;">
                New User Feedback Received!
              </h1>
              <p style="color: #f1f5f9 !important; font-size: 14px; margin: 0; font-weight: 500; line-height: 1.4;">
                A user just submitted feedback through the NeverForgot application.
              </p>
            </td>
          </tr>

          <!-- Rating & Category Highlight Strip -->
          <tr>
            <td style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 18px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="vertical-align: middle;">
                    <div style="font-size: 24px; color: #f59e0b; letter-spacing: 2px; font-weight: 700;">
                      ${starIcons}
                    </div>
                    <div style="font-size: 12px; font-weight: 700; color: #475569; margin-top: 3px;">
                      ${ratingDesc}
                    </div>
                  </td>
                  <td style="text-align: right; vertical-align: middle;">
                    <span style="display: inline-block; background-color: ${categoryMeta.bg}; color: ${categoryMeta.color}; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 9999px; border: 1px solid ${categoryMeta.color}30;">
                      ${categoryMeta.label}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td style="padding: 28px;">
              
              <!-- Sender Profile Card -->
              <table role="presentation" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px; margin-bottom: 22px;" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding: 12px;">
                    <p style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin: 0 0 6px 0;">
                      Feedback Submitted By
                    </p>
                    <p style="font-size: 15px; font-weight: 700; color: #0f172a; margin: 0 0 4px 0;">
                      ${userName || 'Anonymous User'}
                    </p>
                    <p style="font-size: 13px; color: #0284c7; margin: 0;">
                      <a href="mailto:${userEmail}" style="color: #0284c7; text-decoration: none; font-weight: 600;">
                        ${userEmail}
                      </a>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Feedback Message Quote Card -->
              <div style="margin-bottom: 22px;">
                <p style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #475569; margin: 0 0 8px 0;">
                  User Message
                </p>
                <div style="background-color: #ffffff; border-left: 4px solid #0e7490; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; border-radius: 0 14px 14px 0; padding: 18px 20px; font-size: 14px; line-height: 1.6; color: #1e293b; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
                  ${sanitizedMessage}
                </div>
              </div>

              ${
                tagsHtml
                  ? `<!-- Selected Tags -->
              <div style="margin-bottom: 22px;">
                <p style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin: 0 0 8px 0;">
                  Selected Highlights
                </p>
                <div>${tagsHtml}</div>
              </div>`
                  : ''
              }

              <!-- Diagnostic & Device Context -->
              ${
                deviceInfo
                  ? `<!-- Device Diagnostics -->
              <div style="background-color: #f1f5f9; border-radius: 12px; padding: 14px 16px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
                <p style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #475569; margin: 0 0 8px 0;">
                  🖥️ Diagnostic Context
                </p>
                <table role="presentation" width="100%" style="font-size: 11.5px; color: #64748b;" cellspacing="0" cellpadding="2" border="0">
                  ${deviceInfo.os ? `<tr><td width="30%" style="font-weight: 600;">Operating System:</td><td>${deviceInfo.os}</td></tr>` : ''}
                  ${deviceInfo.browser ? `<tr><td style="font-weight: 600;">Browser:</td><td>${deviceInfo.browser}</td></tr>` : ''}
                  ${deviceInfo.screenResolution ? `<tr><td style="font-weight: 600;">Screen Size:</td><td>${deviceInfo.screenResolution}</td></tr>` : ''}
                  ${deviceInfo.currentPath ? `<tr><td style="font-weight: 600;">App Path:</td><td><code>${deviceInfo.currentPath}</code></td></tr>` : ''}
                  <tr><td style="font-weight: 600;">Recipient:</td><td>${recipientEmail}</td></tr>
                </table>
              </div>`
                  : ''
              }

              <!-- Direct Action: Reply Button (Bulletproof Email Table Button) -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 8px auto 0 auto;">
                <tr>
                  <td align="center" bgcolor="#0284c7" style="background-color: #0284c7; border-radius: 12px; padding: 13px 30px; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35);">
                    <a href="mailto:${userEmail}?subject=Re:%20NeverForgot%20Feedback%20Response" style="color: #ffffff !important; font-size: 14px; font-weight: 800; text-decoration: none; display: inline-block;">
                      <span style="color: #ffffff !important; font-weight: 800; text-decoration: none;">✉️ Reply to ${userName || 'User'}</span>
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 28px; text-align: center;">
              <p style="font-size: 11.5px; color: #94a3b8; margin: 0 0 4px 0;">
                © 2026 NeverForgot Inc. • Bill & Warranty Expiry Sentinel
              </p>
              <p style="font-size: 11px; color: #cbd5e1; margin: 0;">
                This notification was dispatched automatically when a user submitted the feedback form.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
