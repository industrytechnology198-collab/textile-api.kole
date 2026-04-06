export function buildVerificationEmailHtml(code: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <tr>
            <td style="background-color:#1a1a2e;padding:32px 40px;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:1px;">KOLETEX</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 16px;color:#1a1a2e;font-size:22px;">Verify your email address</h2>
              <p style="margin:0 0 32px;color:#555;font-size:15px;line-height:1.6;">
                Thank you for registering. Use the verification code below to confirm your email address.
                This code expires in <strong>24 hours</strong>.
              </p>
              <div style="background-color:#f4f4f7;border-radius:8px;padding:24px;text-align:center;margin-bottom:32px;">
                <p style="margin:0 0 8px;color:#888;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Your verification code</p>
                <p style="margin:0;color:#1a1a2e;font-size:48px;font-weight:700;letter-spacing:12px;">${code}</p>
              </div>
              <p style="margin:0;color:#888;font-size:13px;line-height:1.6;">
                If you did not create an account, please ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f4f4f7;padding:24px 40px;text-align:center;">
              <p style="margin:0;color:#aaa;font-size:12px;">&copy; ${new Date().getFullYear()} Koletex. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
