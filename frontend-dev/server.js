const http = require('http');
const url = require('url');

const BACKEND_URL = 'http://localhost:4873';

const resetPasswordPage = (token, error, success) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset Password – Koletex</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #f0f2f5;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.10);
      padding: 40px 36px;
      width: 100%;
      max-width: 420px;
    }
    .logo {
      font-size: 22px;
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }
    h1 {
      font-size: 20px;
      font-weight: 600;
      color: #1a1a2e;
      margin-bottom: 6px;
    }
    p.sub {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 28px;
    }
    label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 6px;
    }
    input[type="password"] {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 15px;
      outline: none;
      transition: border-color 0.2s;
      margin-bottom: 18px;
    }
    input[type="password"]:focus { border-color: #6366f1; }
    button {
      width: 100%;
      padding: 11px;
      background: #6366f1;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    button:hover { background: #4f46e5; }
    .alert {
      padding: 12px 14px;
      border-radius: 8px;
      font-size: 14px;
      margin-bottom: 20px;
    }
    .alert.error { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
    .alert.success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
    .no-token { text-align: center; color: #ef4444; margin-top: 10px; font-size: 14px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">Koletex</div>
    <h1>Reset your password</h1>
    <p class="sub">Enter a new password for your account.</p>

    ${error ? `<div class="alert error">${error}</div>` : ''}
    ${success ? `<div class="alert success">${success}</div>` : ''}

    ${token && !success ? `
    <form method="POST" action="/reset-password">
      <input type="hidden" name="token" value="${escapeHtml(token)}" />
      <label for="newPassword">New Password</label>
      <input type="password" id="newPassword" name="newPassword" minlength="8" required placeholder="Minimum 8 characters" />
      <label for="confirmPassword">Confirm Password</label>
      <input type="password" id="confirmPassword" name="confirmPassword" minlength="8" required placeholder="Repeat your password" />
      <button type="submit">Set New Password</button>
    </form>
    ` : ''}

    ${!token && !success ? `<p class="no-token">Invalid or missing reset link. Please request a new one.</p>` : ''}
  </div>
</body>
</html>
`;

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function parseBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', () => {
            const params = new URLSearchParams(body);
            resolve(Object.fromEntries(params.entries()));
        });
    });
}

async function callBackend(token, newPassword) {
    const body = JSON.stringify({ token, newPassword });
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 4873,
            path: '/auth/reset-password',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body),
            },
        };
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => resolve({ status: res.statusCode, body: data }));
        });
        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

const server = http.createServer(async (req, res) => {
    const parsed = url.parse(req.url, true);
    const pathname = parsed.pathname;

    // GET /reset-password?token=...
    if (req.method === 'GET' && pathname === '/reset-password') {
        const token = parsed.query.token || '';
        const html = resetPasswordPage(token, null, null);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
        return;
    }

    // POST /reset-password (form submission)
    if (req.method === 'POST' && pathname === '/reset-password') {
        const fields = await parseBody(req);
        const { token, newPassword, confirmPassword } = fields;

        if (!token) {
            const html = resetPasswordPage('', 'Missing reset token.', null);
            res.writeHead(400, { 'Content-Type': 'text/html' });
            res.end(html);
            return;
        }

        if (!newPassword || newPassword.length < 8) {
            const html = resetPasswordPage(token, 'Password must be at least 8 characters.', null);
            res.writeHead(400, { 'Content-Type': 'text/html' });
            res.end(html);
            return;
        }

        if (newPassword !== confirmPassword) {
            const html = resetPasswordPage(token, 'Passwords do not match.', null);
            res.writeHead(400, { 'Content-Type': 'text/html' });
            res.end(html);
            return;
        }

        try {
            const result = await callBackend(token, newPassword);
            if (result.status === 200 || result.status === 201) {
                const html = resetPasswordPage('', null, 'Your password has been reset successfully. You can now log in.');
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(html);
            } else {
                let message = 'Something went wrong. The link may have expired.';
                try {
                    const parsed = JSON.parse(result.body);
                    if (parsed.message) message = parsed.message;
                } catch (_) { }
                const html = resetPasswordPage(token, message, null);
                res.writeHead(400, { 'Content-Type': 'text/html' });
                res.end(html);
            }
        } catch (err) {
            const html = resetPasswordPage(token, 'Could not connect to the server. Make sure the backend is running.', null);
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end(html);
        }
        return;
    }

    // 404 for everything else
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
});

server.listen(3000, () => {
    console.log('Frontend dev server running at http://localhost:3000');
    console.log('Reset password page: http://localhost:3000/reset-password?token=YOUR_TOKEN');
});
