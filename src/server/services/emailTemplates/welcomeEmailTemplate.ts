import { IWelcomeEmailData } from '@/types/email.types';

export function generateWelcomeEmailHtml(data: IWelcomeEmailData): string {
  const { userName, userEmail, appUrl } = data;
  const targetUrl = appUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const displayName = userName?.trim() || 'Valued Member';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NeverForgot is Glad to Welcome You!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f1f5f9; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.03); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner (Bulletproof Solid Background) -->
          <tr>
            <td bgcolor="#091e3a" style="background-color: #091e3a; background: linear-gradient(135deg, #091e3a 0%, #0369a1 50%, #0f766e 100%); padding: 36px 32px; text-align: left;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <!-- Sentinel Badge -->
                    <span style="display: inline-block; background-color: #1e293b; color: #38bdf8 !important; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; padding: 6px 14px; border-radius: 9999px; margin-bottom: 12px; border: 1px solid #0284c7;">
                      🛡️ NeverForgot Sentinel Vault
                    </span>
                    <h1 style="margin: 0 0 8px 0; color: #ffffff !important; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; line-height: 1.25;">
                      NeverForgot is Glad to Welcome You!
                    </h1>
                    <p style="margin: 0; color: #f1f5f9 !important; font-size: 14px; line-height: 1.5; font-weight: 400;">
                      Your smart digital asset, warranty, and proactive renewal sentinel is ready.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Welcome Message & Introduction -->
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700; color: #0f172a;">
                Hello ${displayName}, 👋
              </h2>
              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.65; color: #334155;">
                We are thrilled to welcome you to <strong>NeverForgot</strong>! We built NeverForgot with one core mission: to make sure you <strong>never lose money, miss an expiration deadline, or scramble to locate lost receipts and warranty cards ever again</strong>.
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.65; color: #475569;">
                From high-value electronics and vehicles to health policies and home appliances, your assets are now guarded by smart automated sentinel reminders.
              </p>

              <!-- Features Grid / Highlight Cards -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <!-- Feature 1 -->
                  <td width="50%" valign="top" style="padding: 0 8px 16px 0;">
                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px;">
                      <div style="font-size: 20px; margin-bottom: 6px;">🛡️</div>
                      <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">Smart Expiry Sentinel</div>
                      <div style="font-size: 12px; color: #64748b; line-height: 1.45;">Automated email & in-app alerts sent 7 days and 1 day before expiration.</div>
                    </div>
                  </td>
                  <!-- Feature 2 -->
                  <td width="50%" valign="top" style="padding: 0 0 16px 8px;">
                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px;">
                      <div style="font-size: 20px; margin-bottom: 6px;">📄</div>
                      <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">Digital Document Vault</div>
                      <div style="font-size: 12px; color: #64748b; line-height: 1.45;">Securely upload and access invoices, bills, RC cards, and insurance schedules.</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <!-- Feature 3 -->
                  <td width="50%" valign="top" style="padding: 0 8px 0 0;">
                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px;">
                      <div style="font-size: 20px; margin-bottom: 6px;">🔧</div>
                      <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">Service & AMC Tracker</div>
                      <div style="font-size: 12px; color: #64748b; line-height: 1.45;">Keep track of free periodic services, oil changes, and AMC maintenance visits.</div>
                    </div>
                  </td>
                  <!-- Feature 4 -->
                  <td width="50%" valign="top" style="padding: 0 0 0 8px;">
                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px;">
                      <div style="font-size: 20px; margin-bottom: 6px;">⚡</div>
                      <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">Zero Hassle Recovery</div>
                      <div style="font-size: 12px; color: #64748b; line-height: 1.45;">Quick claims assistance, provider customer care hotlines, and policy numbers ready.</div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Quick Start Banner -->
              <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 14px; padding: 16px 20px; margin-bottom: 28px;">
                <p style="margin: 0; font-size: 13px; color: #1e40af; line-height: 1.5; font-weight: 500;">
                  💡 <strong>Quick Start:</strong> Register your first device, vehicle, or policy today. It takes less than 30 seconds to lock in peace of mind.
                </p>
              </div>

              <!-- Bulletproof Call to Action Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto 16px auto;">
                <tr>
                  <td align="center" bgcolor="#0284c7" style="border-radius: 12px; background-color: #0284c7;">
                    <a href="${targetUrl}" target="_blank" style="display: inline-block; padding: 14px 28px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; color: #ffffff !important; text-decoration: none; border-radius: 12px; border: 1px solid #0284c7;">
                      <span style="color: #ffffff !important; font-weight: 800; letter-spacing: 0.3px;">
                        🚀 Open Your NeverForgot Vault &rarr;
                      </span>
                    </a>
                  </td>
                </tr>
              </table>

              <p style="text-align: center; margin: 0; font-size: 12px; color: #64748b;">
                Registered Email: <strong>${userEmail}</strong>
              </p>
            </td>
          </tr>

          <!-- Footer Section -->
          <tr>
            <td bgcolor="#f8fafc" style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 32px; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 600; color: #475569;">
                NeverForgot • Proactive Warranty & Asset Lifecycle Sentinel
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8; line-height: 1.5;">
                You are receiving this welcome email because an account was registered with NeverForgot.<br/>
                If you did not register this account, please contact our team immediately.
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
