// Simple email service using Resend API
// Gracefully degrades if RESEND_API_KEY is not set

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = 'LIMIT Platform <noreply@limit.app>';
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.log('\n=== EMAIL (Development Mode - No RESEND_API_KEY) ===');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`HTML: ${html.substring(0, 200)}...`);
    console.log('=== END EMAIL ===\n');
    return true;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend API error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

export async function sendVerificationEmail({
  to,
  name,
  token,
}: {
  to: string;
  name: string;
  token: string;
}): Promise<boolean> {
  const verificationUrl = `${NEXTAUTH_URL}/api/auth/verify?token=${token}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-block; background: linear-gradient(135deg, #14b8a6, #0891b2); width: 64px; height: 64px; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
          <span style="color: white; font-size: 32px; font-weight: bold;">L</span>
        </div>
        <h1 style="margin: 0; font-size: 28px; color: #111827; font-weight: 800;">LIMIT Platform</h1>
      </div>

      <h2 style="color: #111827; font-size: 24px; margin-bottom: 16px;">Hi ${name},</h2>

      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
        Thank you for registering with LIMIT. Please verify your email address to activate your account and start analyzing building regulations.
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #14b8a6, #0891b2); color: white; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 600; font-size: 16px;">
          Verify Email Address
        </a>
      </div>

      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 32px;">
        If the button doesn't work, copy and paste this link into your browser:
      </p>
      <p style="color: #14b8a6; font-size: 14px; word-break: break-all;">
        ${verificationUrl}
      </p>

      <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px; line-height: 1.6; margin: 0;">
          This verification link will expire in 24 hours. If you didn't create an account with LIMIT, you can safely ignore this email.
        </p>
      </div>
    </div>

    <div style="text-align: center; margin-top: 24px;">
      <p style="color: #9ca3af; font-size: 12px;">
        LIMIT - Building Regulation Compliance Platform
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({
    to,
    subject: 'Verify your email - LIMIT Platform',
    html,
  });
}

export async function sendWelcomeEmail({
  to,
  name,
}: {
  to: string;
  name: string;
}): Promise<boolean> {
  const dashboardUrl = `${NEXTAUTH_URL}/dashboard`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to LIMIT</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #111827; font-size: 24px; margin-bottom: 16px;">Welcome to LIMIT, ${name}!</h2>

      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
        Your email has been verified successfully. You can now access all features of the LIMIT platform.
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #14b8a6, #0891b2); color: white; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 600; font-size: 16px;">
          Go to Dashboard
        </a>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({
    to,
    subject: 'Welcome to LIMIT Platform',
    html,
  });
}
