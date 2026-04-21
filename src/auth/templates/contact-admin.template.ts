export function buildContactAdminHtml(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Contact Message</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <tr>
            <td style="background-color:#1a1a2e;padding:32px 40px;">
              <h1 style="color:#ffffff;margin:0;font-size:22px;">📩 New Contact Message</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:8px 0;color:#888;font-size:13px;width:100px;">From</td>
                  <td style="padding:8px 0;color:#1a1a2e;font-size:15px;font-weight:bold;">${data.name}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#888;font-size:13px;">Email</td>
                  <td style="padding:8px 0;color:#1a1a2e;font-size:15px;">
                    <a href="mailto:${data.email}" style="color:#d9534f;text-decoration:none;">${data.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#888;font-size:13px;">Subject</td>
                  <td style="padding:8px 0;color:#1a1a2e;font-size:15px;">${data.subject}</td>
                </tr>
              </table>
              <hr style="border:none;border-top:1px solid #e8e8e8;margin:24px 0;" />
              <h3 style="color:#1a1a2e;margin:0 0 12px;font-size:15px;">Message</h3>
              <p style="color:#555;line-height:1.7;margin:0;white-space:pre-wrap;">${data.message}</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f4f4f7;padding:16px 40px;text-align:center;">
              <p style="color:#aaa;font-size:12px;margin:0;">Kole — contact form</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
