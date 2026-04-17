export function buildQuoteNotificationAdminHtml(quote: any): string {
  const itemsRows = quote.items
    .map((item: any) => {
      const product = item.sku?.color?.product;
      return `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e8e8e8;">${product?.catalogReference ?? '-'} — ${product?.brand ?? '-'}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e8e8e8;">${item.sku?.sizeLabel ?? '-'}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e8e8e8;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e8e8e8;text-align:right;">€${Number(item.unitPrice).toFixed(2)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e8e8e8;text-align:right;">€${(Number(item.unitPrice) * item.quantity).toFixed(2)}</td>
        </tr>`;
    })
    .join('');

  const user = quote.user;
  const address = quote.address;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Quote Request</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="640" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background-color:#d9534f;padding:32px 40px;">
              <h1 style="color:#ffffff;margin:0;font-size:22px;">🛎️ New Quote Request</h1>
              <p style="color:#f9d6d5;margin:8px 0 0;font-size:14px;">Reference: ${quote.id}</p>
            </td>
          </tr>
          <!-- Customer info -->
          <tr>
            <td style="padding:32px 40px 0;">
              <h3 style="color:#1a1a2e;margin:0 0 12px;">Customer</h3>
              <p style="color:#555;margin:4px 0;">${user?.firstName ?? ''} ${user?.lastName ?? ''}</p>
              <p style="color:#555;margin:4px 0;">${user?.email ?? ''}</p>
              <p style="color:#555;margin:4px 0;">${address?.phoneNumber ?? ''}</p>
            </td>
          </tr>
          <!-- Delivery address -->
          <tr>
            <td style="padding:16px 40px 0;">
              <h3 style="color:#1a1a2e;margin:0 0 12px;">Delivery Address</h3>
              <p style="color:#555;margin:4px 0;">${address?.fullName ?? ''}</p>
              <p style="color:#555;margin:4px 0;">${address?.addressLine1 ?? ''}${address?.addressLine2 ? ', ' + address.addressLine2 : ''}</p>
              <p style="color:#555;margin:4px 0;">${address?.postalCode ?? ''} ${address?.city ?? ''}, ${address?.country ?? ''}</p>
            </td>
          </tr>
          <!-- Items -->
          <tr>
            <td style="padding:24px 40px 0;">
              <h3 style="color:#1a1a2e;margin:0 0 12px;">Items</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e8e8;border-radius:6px;overflow:hidden;">
                <thead>
                  <tr style="background-color:#f4f4f7;">
                    <th style="padding:10px 12px;text-align:left;font-size:13px;color:#888;">Product</th>
                    <th style="padding:10px 12px;text-align:left;font-size:13px;color:#888;">Size</th>
                    <th style="padding:10px 12px;text-align:center;font-size:13px;color:#888;">Qty</th>
                    <th style="padding:10px 12px;text-align:right;font-size:13px;color:#888;">Unit Price</th>
                    <th style="padding:10px 12px;text-align:right;font-size:13px;color:#888;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="4" style="padding:12px;text-align:right;font-weight:bold;color:#1a1a2e;">Total</td>
                    <td style="padding:12px;text-align:right;font-weight:bold;color:#d9534f;">€${Number(quote.totalPrice).toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </td>
          </tr>
          ${quote.note ? `<tr><td style="padding:16px 40px 0;"><p style="color:#555;"><strong>Customer note:</strong> ${quote.note}</p></td></tr>` : ''}
          <!-- Footer -->
          <tr>
            <td style="background-color:#f4f4f7;padding:24px;text-align:center;margin-top:32px;">
              <p style="color:#aaa;font-size:12px;margin:0;">© ${new Date().getFullYear()} Koletex Admin</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
