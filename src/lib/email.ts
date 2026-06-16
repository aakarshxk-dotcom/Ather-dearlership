import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

const fromAddress = process.env.SMTP_FROM || 'Ather Energy Dealership <noreply@atherdealership.in>';
const adminEmail = process.env.ADMIN_EMAIL || 'admin@atherdealership.in';

function canSend(): boolean {
  return !!(process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendNewLeadEmail(lead: {
  fullName: string;
  phone: string;
  email: string;
  city?: string;
  state?: string;
  createdAt?: Date;
}) {
  if (!canSend()) return;
  try {
    await transporter.sendMail({
      from: fromAddress,
      to: adminEmail,
      subject: 'New Dealership Lead Received',
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #E5E7EB;border-radius:12px;overflow:hidden;">
        <div style="background:#059669;padding:24px;text-align:center;"><h1 style="color:white;margin:0;font-size:20px;">New Dealership Lead</h1></div>
        <div style="padding:24px;background:#FAFAFA;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:10px;border-bottom:1px solid #E5E7EB;font-weight:600;color:#6B7280;width:40%;">Name</td><td style="padding:10px;border-bottom:1px solid #E5E7EB;color:#111827;">${lead.fullName}</td></tr>
            <tr><td style="padding:10px;border-bottom:1px solid #E5E7EB;font-weight:600;color:#6B7280;">Phone</td><td style="padding:10px;border-bottom:1px solid #E5E7EB;color:#111827;">${lead.phone}</td></tr>
            <tr><td style="padding:10px;border-bottom:1px solid #E5E7EB;font-weight:600;color:#6B7280;">Email</td><td style="padding:10px;border-bottom:1px solid #E5E7EB;color:#111827;"><a href="mailto:${lead.email}">${lead.email}</a></td></tr>
            <tr><td style="padding:10px;border-bottom:1px solid #E5E7EB;font-weight:600;color:#6B7280;">Location</td><td style="padding:10px;border-bottom:1px solid #E5E7EB;color:#111827;">${lead.city || ''}${lead.city && lead.state ? ', ' : ''}${lead.state || ''}</td></tr>
            <tr><td style="padding:10px;border-bottom:1px solid #E5E7EB;font-weight:600;color:#6B7280;">Date</td><td style="padding:10px;border-bottom:1px solid #E5E7EB;color:#111827;">${lead.createdAt ? new Date(lead.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td></tr>
          </table>
        </div></div>`,
    });
  } catch (error) {
    console.error('Failed to send lead email:', error);
  }
}

export async function sendContactEmail(contact: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  if (!canSend()) return;
  try {
    await transporter.sendMail({
      from: fromAddress,
      to: adminEmail,
      subject: `New Contact: ${contact.subject}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #E5E7EB;border-radius:12px;overflow:hidden;">
        <div style="background:#059669;padding:24px;text-align:center;"><h1 style="color:white;margin:0;font-size:20px;">New Contact Message</h1></div>
        <div style="padding:24px;background:#FAFAFA;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:10px;border-bottom:1px solid #E5E7EB;font-weight:600;color:#6B7280;width:40%;">Name</td><td style="padding:10px;border-bottom:1px solid #E5E7EB;color:#111827;">${contact.name}</td></tr>
            <tr><td style="padding:10px;border-bottom:1px solid #E5E7EB;font-weight:600;color:#6B7280;">Email</td><td style="padding:10px;border-bottom:1px solid #E5E7EB;color:#111827;">${contact.email}</td></tr>
            ${contact.phone ? `<tr><td style="padding:10px;border-bottom:1px solid #E5E7EB;font-weight:600;color:#6B7280;">Phone</td><td style="padding:10px;border-bottom:1px solid #E5E7EB;color:#111827;">${contact.phone}</td></tr>` : ''}
            <tr><td style="padding:10px;border-bottom:1px solid #E5E7EB;font-weight:600;color:#6B7280;">Subject</td><td style="padding:10px;border-bottom:1px solid #E5E7EB;color:#111827;">${contact.subject}</td></tr>
            <tr><td style="padding:10px;font-weight:600;color:#6B7280;">Message</td><td style="padding:10px;color:#111827;white-space:pre-wrap;">${contact.message}</td></tr>
          </table>
        </div></div>`,
    });
  } catch (error) {
    console.error('Failed to send contact email:', error);
  }
}

export async function sendNewsletterNotification(email: string) {
  if (!canSend()) return;
  try {
    await transporter.sendMail({
      from: fromAddress,
      to: adminEmail,
      subject: 'New Newsletter Subscriber',
      text: `New subscriber: ${email}`,
    });
  } catch (error) {
    console.error('Failed to send newsletter notification:', error);
  }
}
