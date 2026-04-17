const T = {
  subject: { fr: 'Votre demande de devis a été reçue — Koletex', en: 'Your quote request has been received — Koletex', de: 'Ihre Angebotsanfrage wurde erhalten — Koletex', nl: 'Uw offerteaanvraag is ontvangen — Koletex' },
  title: { fr: 'Votre demande de devis a été reçue ✅', en: 'Your quote request has been received ✅', de: 'Ihre Angebotsanfrage wurde erhalten ✅', nl: 'Uw offerteaanvraag is ontvangen ✅' },
  intro: { fr: 'Merci pour votre demande. Notre équipe va l\'examiner et vous répondra sous peu.', en: 'Thank you for your order request. Our team will review it and get back to you shortly.', de: 'Vielen Dank für Ihre Anfrage. Unser Team wird sie prüfen und sich bald bei Ihnen melden.', nl: 'Bedankt voor uw aanvraag. Ons team zal deze beoordelen en spoedig contact met u opnemen.' },
  ref: { fr: 'Référence', en: 'Reference', de: 'Referenz', nl: 'Referentie' },
  colProduct: { fr: 'Produit', en: 'Product', de: 'Produkt', nl: 'Product' },
  colSize: { fr: 'Taille', en: 'Size', de: 'Größe', nl: 'Maat' },
  colQty: { fr: 'Qté', en: 'Qty', de: 'Menge', nl: 'Aantal' },
  colUnit: { fr: 'Prix unitaire', en: 'Unit Price', de: 'Einzelpreis', nl: 'Eenheidsprijs' },
  colTotal: { fr: 'Total', en: 'Total', de: 'Gesamt', nl: 'Totaal' },
  yourNote: { fr: 'Votre note', en: 'Your note', de: 'Ihre Notiz', nl: 'Uw opmerking' },
  closing: { fr: 'Nous vous contacterons pour confirmer la commande et organiser la livraison.', en: 'We will contact you to confirm the order and arrange delivery.', de: 'Wir werden Sie kontaktieren, um die Bestellung zu bestätigen und die Lieferung zu arrangieren.', nl: 'We nemen contact met u op om de bestelling te bevestigen en de levering te regelen.' },
};

export function getQuoteConfirmationSubject(lang = 'nl'): string {
  return T.subject[lang as keyof typeof T.subject] ?? T.subject.en;
}

export function buildQuoteConfirmationUserHtml(quote: any, lang = 'nl'): string {
  const l = <K extends keyof typeof T>(key: K): string =>
    (T[key] as Record<string, string>)[lang] ?? (T[key] as Record<string, string>).en;

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

  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${l('title')}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <tr>
            <td style="background-color:#1a1a2e;padding:32px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;letter-spacing:1px;">KOLETEX</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#1a1a2e;margin:0 0 16px;">${l('title')}</h2>
              <p style="color:#555;line-height:1.6;">${l('intro')}</p>
              <p style="color:#555;line-height:1.6;"><strong>${l('ref')}:</strong> ${quote.id}</p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;border:1px solid #e8e8e8;border-radius:6px;overflow:hidden;">
                <thead>
                  <tr style="background-color:#f4f4f7;">
                    <th style="padding:10px 12px;text-align:left;font-size:13px;color:#888;">${l('colProduct')}</th>
                    <th style="padding:10px 12px;text-align:left;font-size:13px;color:#888;">${l('colSize')}</th>
                    <th style="padding:10px 12px;text-align:center;font-size:13px;color:#888;">${l('colQty')}</th>
                    <th style="padding:10px 12px;text-align:right;font-size:13px;color:#888;">${l('colUnit')}</th>
                    <th style="padding:10px 12px;text-align:right;font-size:13px;color:#888;">${l('colTotal')}</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="4" style="padding:12px;text-align:right;font-weight:bold;color:#1a1a2e;">${l('colTotal')}</td>
                    <td style="padding:12px;text-align:right;font-weight:bold;color:#1a1a2e;">€${Number(quote.totalPrice).toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>

              ${quote.note ? `<p style="color:#555;margin-top:24px;"><strong>${l('yourNote')}:</strong> ${quote.note}</p>` : ''}

              <p style="color:#555;margin-top:32px;line-height:1.6;">${l('closing')}</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f4f4f7;padding:24px;text-align:center;">
              <p style="color:#aaa;font-size:12px;margin:0;">© ${new Date().getFullYear()} Koletex — All rights reserved</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
