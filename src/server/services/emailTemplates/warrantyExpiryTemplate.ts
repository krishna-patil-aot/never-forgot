import { IWarrantyExpiryEmailData } from '@/types/email.types';

export function generateWarrantyExpiryEmailHtml(data: IWarrantyExpiryEmailData): string {
  const {
    recipientName,
    recipientEmail,
    assetTitle,
    brandOrProvider,
    category,
    expiryDate,
    daysRemaining,
    identifierNumber,
    price,
    actionUrl,
  } = data;

  const isExpired = daysRemaining < 0;
  const isLastDay = daysRemaining === 0 || daysRemaining === 1;
  const isCritical = daysRemaining > 1 && daysRemaining <= 7;

  const statusBg = isExpired ? '#fee2e2' : isLastDay ? '#fef2f2' : isCritical ? '#fef3c7' : '#ecfeff';
  const statusColor = isExpired ? '#b91c1c' : isLastDay ? '#dc2626' : isCritical ? '#b45309' : '#0e7490';
  const statusBorder = isExpired ? '#fca5a5' : isLastDay ? '#fca5a5' : isCritical ? '#fcd34d' : '#a5f3fc';
  const statusIcon = isExpired ? '🛑' : isLastDay ? '🚨' : '⚠️';
  const statusText = isExpired
    ? `EXPIRED ${Math.abs(daysRemaining)} DAYS AGO`
    : daysRemaining === 0
    ? 'EXPIRES TODAY'
    : daysRemaining === 1
    ? 'EXPIRES TOMORROW (LAST DAY)'
    : `EXPIRES IN ${daysRemaining} DAYS`;

  const categoryLabel =
    category === 'electronics'
      ? 'Electronics & Gadgets'
      : category === 'vehicle'
      ? 'Vehicle & Auto'
      : category === 'health_insurance'
      ? 'Health Insurance'
      : category === 'life_insurance'
      ? 'Life Insurance'
      : category === 'home_amc'
      ? 'Home AMC & Appliance'
      : 'Personal Document';

  const formattedPrice =
    price !== undefined && price !== null
      ? typeof price === 'number'
        ? `₹${price.toLocaleString('en-IN')}`
        : price
      : null;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NeverForgot Expiration Alert: ${assetTitle}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f1f5f9; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Container -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04); border: 1px solid #e2e8f0;" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Header Banner -->
          <tr>
            <td bgcolor="#091e3a" style="background-color: #091e3a; background: linear-gradient(135deg, #091e3a 0%, #0e7490 60%, #2563eb 100%); padding: 36px 32px; text-align: left;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <div style="display: inline-block; background-color: #1e293b; border: 1px solid #38bdf8; border-radius: 12px; padding: 8px 14px; margin-bottom: 16px;">
                      <span style="color: #38bdf8 !important; font-size: 13px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">
                        🛡️ NeverForgot Sentinel
                      </span>
                    </div>
                    <h1 style="color: #ffffff !important; font-size: 24px; font-weight: 800; margin: 0 0 6px 0; line-height: 1.25;">
                      Warranty Expiration Alert
                    </h1>
                    <p style="color: #f1f5f9 !important; font-size: 14px; margin: 0; line-height: 1.4; font-weight: 500;">
                      Automated protection sentinel for your valuable assets & policies
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              <p style="font-size: 15px; line-height: 1.6; color: #334155; margin: 0 0 20px 0;">
                Hello <strong>${recipientName || 'Valued User'}</strong>,
              </p>
              <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px 0;">
                ${
                  isLastDay
                    ? `⚠️ <strong style="color: #dc2626;">URGENT FINAL NOTICE:</strong> Warranty coverage for <strong>${assetTitle}</strong> expires ${daysRemaining === 0 ? 'today' : 'tomorrow'}. This is your final opportunity to submit free warranty claims or get free service before coverage lapses permanently.`
                    : isCritical
                    ? `Our proactive monitoring sentinel detected that coverage for <strong>${assetTitle}</strong> expires in <strong>${daysRemaining} days</strong>. Review your asset details below and initiate any warranty service or renewal before the deadline.`
                    : `Our proactive monitoring system detected that your coverage deadline is approaching. Review your asset details below and initiate any warranty claims or renewals before coverage lapses.`
                }
              </p>

              <!-- Urgent Status Pill -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center" style="background-color: ${statusBg}; border: 1px solid ${statusBorder}; border-radius: 14px; padding: 12px 16px;">
                    <span style="color: ${statusColor}; font-size: 13px; font-weight: 800; letter-spacing: 0.8px;">
                      ${statusIcon} ${statusText}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Asset Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 28px;">
                <tr>
                  <td>
                    <div style="margin-bottom: 8px;">
                      <span style="display: inline-block; background-color: #e0f2fe; color: #0369a1; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding: 3px 10px; border-radius: 9999px;">
                        ${categoryLabel}
                      </span>
                    </div>

                    <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; line-height: 1.3;">
                      ${assetTitle}
                    </h2>

                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #64748b; width: 40%;">Brand / Provider:</td>
                        <td style="padding: 6px 0; font-size: 13px; color: #0f172a; font-weight: 600;">${brandOrProvider || 'Not specified'}</td>
                      </tr>
                      ${
                        identifierNumber
                          ? `<tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Serial / Policy ID:</td>
                        <td style="padding: 6px 0; font-size: 13px; color: #0f172a; font-weight: 600; font-family: monospace;">${identifierNumber}</td>
                      </tr>`
                          : ''
                      }
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Expiration Date:</td>
                        <td style="padding: 6px 0; font-size: 13px; color: #0f172a; font-weight: 700;">${expiryDate}</td>
                      </tr>
                      ${
                        formattedPrice
                          ? `<tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Invoice Value:</td>
                        <td style="padding: 6px 0; font-size: 13px; color: #059669; font-weight: 700;">${formattedPrice}</td>
                      </tr>`
                          : ''
                      }
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Recommended Next Steps -->
              <h3 style="font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                Recommended Next Steps
              </h3>
              <ul style="margin: 0 0 28px 0; padding-left: 20px; font-size: 13.5px; line-height: 1.6; color: #475569;">
                <li style="margin-bottom: 6px;">Inspect your item thoroughly for any hardware issues or maintenance needs.</li>
                <li style="margin-bottom: 6px;">Contact the manufacturer / service center to file zero-cost warranty claims.</li>
                <li style="margin-bottom: 6px;">Check options to extend warranty or renew insurance before penalty windows.</li>
              </ul>

              <!-- CTA Button (Bulletproof Email Table Button) -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 0 auto 24px auto;">
                <tr>
                  <td align="center" bgcolor="#0284c7" style="background-color: #0284c7; border-radius: 12px; padding: 14px 32px; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35);">
                    <a href="${actionUrl}" target="_blank" style="color: #ffffff !important; font-size: 15px; font-weight: 800; text-decoration: none; display: inline-block; line-height: 1.2;">
                      <span style="color: #ffffff !important; font-weight: 800; text-decoration: none;">View Asset in NeverForgot Vault →</span>
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
                Direct vault URL: <a href="${actionUrl}" style="color: #0284c7; text-decoration: underline;">${actionUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 32px; text-align: center;">
              <p style="font-size: 12px; color: #64748b; margin: 0 0 8px 0;">
                This automated sentinel alert was delivered to <strong>${recipientEmail}</strong> because email notifications are enabled in your NeverForgot profile.
              </p>
              <p style="font-size: 11px; color: #94a3b8; margin: 0;">
                © 2026 NeverForgot Inc. • Never lose a warranty deadline again.
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
