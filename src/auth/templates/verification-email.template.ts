const T = {
  subject: {
    fr: 'Vérifiez votre adresse e-mail',
    en: 'Verify your email address',
    de: 'Bestätigen Sie Ihre E-Mail-Adresse',
    nl: 'Verifieer uw e-mailadres',
  },
  title: {
    fr: 'Vérifiez votre adresse e-mail',
    en: 'Verify your email address',
    de: 'Bestätigen Sie Ihre E-Mail-Adresse',
    nl: 'Verifieer uw e-mailadres',
  },
  intro: {
    fr: 'Merci pour votre inscription. Utilisez le code ci-dessous pour confirmer votre adresse e-mail. Ce code expire dans <strong>24 heures</strong>.',
    en: 'Thank you for registering. Use the verification code below to confirm your email address. This code expires in <strong>24 hours</strong>.',
    de: 'Vielen Dank für Ihre Registrierung. Verwenden Sie den untenstehenden Code, um Ihre E-Mail-Adresse zu bestätigen. Dieser Code läuft in <strong>24 Stunden</strong> ab.',
    nl: 'Bedankt voor uw registratie. Gebruik de onderstaande code om uw e-mailadres te bevestigen. Deze code verloopt na <strong>24 uur</strong>.',
  },
  label: {
    fr: 'Votre code de vérification',
    en: 'Your verification code',
    de: 'Ihr Bestätigungscode',
    nl: 'Uw verificatiecode',
  },
  ignore: {
    fr: "Si vous n'avez pas créé de compte, ignorez cet e-mail.",
    en: 'If you did not create an account, please ignore this email.',
    de: 'Wenn Sie kein Konto erstellt haben, ignorieren Sie diese E-Mail.',
    nl: 'Als u geen account heeft aangemaakt, negeer dan deze e-mail.',
  },
};

export function getVerificationEmailSubject(lang = 'nl'): string {
  return T.subject[lang as keyof typeof T.subject] ?? T.subject.en;
}

export function buildVerificationEmailHtml(code: string, lang = 'nl'): string {
  const l = <K extends keyof typeof T>(key: K): string =>
    (T[key] as Record<string, string>)[lang] ??
    (T[key] as Record<string, string>).en;
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
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <tr>
            <td style="background-color:#1a1a2e;padding:32px 40px;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:1px;">KOLETEX</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 16px;color:#1a1a2e;font-size:22px;">${l('title')}</h2>
              <p style="margin:0 0 32px;color:#555;font-size:15px;line-height:1.6;">${l('intro')}</p>
              <div style="background-color:#f4f4f7;border-radius:8px;padding:24px;text-align:center;margin-bottom:32px;">
                <p style="margin:0 0 8px;color:#888;font-size:13px;text-transform:uppercase;letter-spacing:1px;">${l('label')}</p>
                <p style="margin:0;color:#1a1a2e;font-size:48px;font-weight:700;letter-spacing:12px;">${code}</p>
              </div>
              <p style="margin:0;color:#888;font-size:13px;line-height:1.6;">${l('ignore')}</p>
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
