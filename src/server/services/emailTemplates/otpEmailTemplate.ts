export function generateOtpEmailHtml(
  email: string,
  otpCode: string,
  purpose: 'login' | 'reset_password' | 'register' = 'login'
): string {
  const isReset = purpose === 'reset_password';
  const title = isReset ? 'Password Reset Code' : 'Sign In Verification Code';
  const subtitle = isReset
    ? 'Use the 6-digit code below to securely reset your NeverForgot password.'
    : 'Use the 6-digit code below to securely sign in to your NeverForgot account.';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f1f5f9; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Container -->
        <table role="presentation" width="100%" style="max-width: 540px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0;" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Header Banner -->
          <tr>
            <td bgcolor="#091e3a" style="background-color: #091e3a; background: linear-gradient(135deg, #091e3a 0%, #0e7490 60%, #2563eb 100%); padding: 32px 28px; text-align: left;">
              <div style="display: inline-block; background-color: #1e293b; border: 1px solid #38bdf8; border-radius: 12px; padding: 7px 14px; margin-bottom: 14px;">
                <span style="color: #38bdf8 !important; font-size: 12px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">
                  🛡️ NeverForgot Security
                </span>
              </div>
              <h1 style="color: #ffffff !important; font-size: 22px; font-weight: 800; margin: 0 0 6px 0;">
                ${title}
              </h1>
              <p style="color: #f1f5f9 !important; font-size: 14px; margin: 0; font-weight: 500; line-height: 1.4;">
                ${subtitle}
              </p>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 32px 28px 24px 28px; text-align: center;">
              <p style="font-size: 14px; color: #475569; margin: 0 0 24px 0; text-align: left;">
                Hello, we received a request to ${isReset ? 'reset the password for' : 'sign in to'} your NeverForgot account for <strong>${email}</strong>.
              </p>

              <!-- OTP Code Display Box -->
              <div style="background-color: #f0fdf4; border: 2px dashed #86efac; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
                <p style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #15803d; margin: 0 0 8px 0;">
                  Your 6-Digit Verification Code
                </p>
                <div style="font-family: 'SF Mono', Consolas, Menlo, monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #0f172a; padding: 4px 0;">
                  ${otpCode}
                </div>
                <p style="font-size: 12px; color: #64748b; margin: 8px 0 0 0;">
                  Valid for 10 minutes • Do not share this code with anyone
                </p>
              </div>

              <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0 0 20px 0; text-align: left;">
                If you did not initiate this request, you can safely ignore this email. No changes will be made to your account.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 28px; text-align: center;">
              <p style="font-size: 11.5px; color: #94a3b8; margin: 0;">
                © 2026 NeverForgot Inc. • Zero-telemetry Bill & Warranty Expiry Vault
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
