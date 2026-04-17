const T = {
  subject: { fr: 'Réinitialisez votre mot de passe', en: 'Reset your password', de: 'Passwort zurücksetzen', nl: 'Wachtwoord opnieuw instellen' },
  title: { fr: 'Réinitialisez votre mot de passe', en: 'Reset your password', de: 'Passwort zurücksetzen', nl: 'Wachtwoord opnieuw instellen' },
  intro: { fr: 'Nous avons reçu une demande de réinitialisation du mot de passe de votre compte. Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe. Ce lien expire dans <strong>1 heure</strong>.', en: 'We received a request to reset the password for your account. Click the button below to set a new password. This link expires in <strong>1 hour</strong>.', de: 'Wir haben eine Anfrage zum Zurücksetzen des Passworts für Ihr Konto erhalten. Klicken Sie auf die Schaltfläche unten, um ein neues Passwort festzulegen. Dieser Link läuft in <strong>1 Stunde</strong> ab.', nl: 'We hebben een verzoek ontvangen om het wachtwoord voor uw account opnieuw in te stellen. Klik op de onderstaande knop om een nieuw wachtwoord in te stellen. Deze link verloopt na <strong>1 uur</strong>.' },
  btn: { fr: 'Réinitialiser le mot de passe', en: 'Reset Password', de: 'Passwort zurücksetzen', nl: 'Wachtwoord opnieuw instellen' },
  fallback: { fr: 'Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :', en: "If the button doesn't work, copy and paste this link into your browser:", de: 'Wenn die Schaltfläche nicht funktioniert, kopieren Sie diesen Link in Ihren Browser:', nl: 'Als de knop niet werkt, kopieer en plak dan deze link in uw browser:' },
  ignore: { fr: 'Si vous n\'avez pas demandé de réinitialisation, ignorez cet e-mail. Votre mot de passe ne changera pas.', en: 'If you did not request a password reset, please ignore this email. Your password will not change.', de: 'Wenn Sie keine Passwortzurücksetzung angefordert haben, ignorieren Sie diese E-Mail. Ihr Passwort wird nicht geändert.', nl: 'Als u geen wachtwoordherstel heeft aangevraagd, negeer dan deze e-mail. Uw wachtwoord wordt niet gewijzigd.' },
};

export function getPasswordResetEmailSubject(lang = 'nl'): string {
  return T.subject[lang as keyof typeof T.subject] ?? T.subject.en;
}

export function buildPasswordResetEmailHtml(resetUrl: string, lang = 'nl'): string {
  const l = <K extends keyof typeof T>(key: K): string =>
    (T[key] as Record<string, string>)[lang] ?? (T[key] as Record<string, string>).en;
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
              <div style="text-align:center;margin-bottom:32px;">
                <a href="${resetUrl}" style="display:inline-block;background-color:#1a1a2e;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:16px;font-weight:600;">${l('btn')}</a>
              </div>
              <p style="margin:0 0 8px;color:#888;font-size:13px;line-height:1.6;">${l('fallback')}</p>
              <p style="margin:0 0 24px;word-break:break-all;"><a href="${resetUrl}" style="color:#1a1a2e;font-size:13px;">${resetUrl}</a></p>
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
