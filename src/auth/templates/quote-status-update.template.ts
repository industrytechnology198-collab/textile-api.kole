const STATUS_LABELS: Record<string, Record<string, string>> = {
  PENDING: {
    fr: 'En attente',
    en: 'Pending',
    de: 'Ausstehend',
    nl: 'In afwachting',
  },
  CONFIRMED: {
    fr: 'Confirmée',
    en: 'Confirmed',
    de: 'Bestätigt',
    nl: 'Bevestigd',
  },
  PROCESSING: {
    fr: 'En cours de traitement',
    en: 'Processing',
    de: 'In Bearbeitung',
    nl: 'In verwerking',
  },
  SHIPPED: {
    fr: 'Expédiée',
    en: 'Shipped',
    de: 'Versendet',
    nl: 'Verzonden',
  },
  DELIVERED: {
    fr: 'Livrée',
    en: 'Delivered',
    de: 'Geliefert',
    nl: 'Geleverd',
  },
  CANCELLED: {
    fr: 'Annulée',
    en: 'Cancelled',
    de: 'Storniert',
    nl: 'Geannuleerd',
  },
};

const SUBJECTS: Record<string, Record<string, string>> = {
  fr: {
    default: 'Mise à jour de votre commande — Koletex',
  },
  en: {
    default: 'Your order has been updated — Koletex',
  },
  de: {
    default: 'Ihre Bestellung wurde aktualisiert — Koletex',
  },
  nl: {
    default: 'Uw bestelling is bijgewerkt — Koletex',
  },
};

const INTROS: Record<string, string> = {
  fr: 'Nous vous informons que votre commande a été mise à jour.',
  en: 'We are letting you know that your order has been updated.',
  de: 'Wir informieren Sie, dass Ihre Bestellung aktualisiert wurde.',
  nl: 'We laten u weten dat uw bestelling is bijgewerkt.',
};

const STATUS_LINE: Record<string, string> = {
  fr: 'Nouveau statut',
  en: 'New status',
  de: 'Neuer Status',
  nl: 'Nieuwe status',
};

const REF_LINE: Record<string, string> = {
  fr: 'Référence',
  en: 'Reference',
  de: 'Referenz',
  nl: 'Referentie',
};

const CLOSING: Record<string, string> = {
  fr: "Notre équipe reste à votre disposition pour toute question.",
  en: 'Our team remains available for any questions.',
  de: 'Unser Team steht Ihnen für alle Fragen zur Verfügung.',
  nl: 'Ons team staat tot uw beschikking voor alle vragen.',
};

export function getQuoteStatusUpdateSubject(lang: string): string {
  const l = SUBJECTS[lang] ?? SUBJECTS['en'];
  return l.default;
}

export function buildQuoteStatusUpdateHtml(
  quoteId: string,
  status: string,
  lang: string = 'nl',
): string {
  const l = (map: Record<string, string>) => map[lang] ?? map['en'];
  const statusLabel = STATUS_LABELS[status]?.[lang] ?? STATUS_LABELS[status]?.['en'] ?? status;

  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${getQuoteStatusUpdateSubject(lang)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background-color:#1a1a2e;padding:32px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;letter-spacing:1px;">KOLETEX</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="color:#555;line-height:1.6;margin:0 0 24px;">${l(INTROS)}</p>

              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e8e8;border-radius:6px;overflow:hidden;">
                <tr>
                  <td style="padding:14px 20px;background:#f4f4f7;color:#888;font-size:13px;width:40%;">${l(REF_LINE)}</td>
                  <td style="padding:14px 20px;color:#1a1a2e;font-weight:bold;font-size:13px;">${quoteId}</td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;background:#f4f4f7;color:#888;font-size:13px;border-top:1px solid #e8e8e8;">${l(STATUS_LINE)}</td>
                  <td style="padding:14px 20px;border-top:1px solid #e8e8e8;">
                    <span style="background-color:#1a1a2e;color:#ffffff;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:bold;">${statusLabel}</span>
                  </td>
                </tr>
              </table>

              <p style="color:#555;line-height:1.6;margin-top:32px;">${l(CLOSING)}</p>
            </td>
          </tr>
          <!-- Footer -->
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
