export function buildPasswordResetEmailHtml(resetUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset</title>
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
              <h2 style="margin:0 0 16px;color:#1a1a2e;font-size:22px;">Reset your password</h2>
              <p style="margin:0 0 32px;color:#555;font-size:15px;line-height:1.6;">
                We received a request to reset the password for your account.
                Click the button below to set a new password. This link expires in <strong>1 hour</strong>.
              </p>
              <div style="text-align:center;margin-bottom:32px;">
                <a href="${resetUrl}"
                   style="display:inline-block;background-color:#1a1a2e;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:16px;font-weight:600;">
                  Reset Password
                </a>
              </div>
              <p style="margin:0 0 8px;color:#888;font-size:13px;line-height:1.6;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin:0 0 24px;word-break:break-all;">
                <a href="${resetUrl}" style="color:#1a1a2e;font-size:13px;">${resetUrl}</a>
              </p>
              <p style="margin:0;color:#888;font-size:13px;line-height:1.6;">
                If you did not request a password reset, please ignore this email. Your password will not change.
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
