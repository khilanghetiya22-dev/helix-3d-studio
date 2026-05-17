// Email sending utility using Resend
// Emails are best-effort: failures are logged but don't block the main operation

import { Resend } from 'resend';
import {
  orderConfirmationTemplate,
  adminNewOrderAlertTemplate,
  statusUpdateTemplate,
} from './email-templates';
import type { Address, OrderStatus } from './types';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'HELIX 3D Studio <onboarding@resend.dev>'; // Change to your verified domain
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || '';

interface SendEmailResult {
  success: boolean;
  error?: string;
}

async function sendEmail(to: string, subject: string, html: string): Promise<SendEmailResult> {
  // Skip if Resend is not configured
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Email] Skipped (no RESEND_API_KEY): "${subject}" → ${to}`);
    return { success: false, error: 'RESEND_API_KEY not configured' };
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      console.error(`[Email] Failed to send "${subject}" to ${to}:`, error);
      return { success: false, error: error.message };
    }

    console.log(`[Email] Sent: "${subject}" → ${to}`);
    return { success: true };
  } catch (err) {
    console.error(`[Email] Exception sending "${subject}" to ${to}:`, err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// ─── Public API ──────────────────────────────────────────────────

/**
 * Send order confirmation email to the customer
 */
export async function sendOrderConfirmation(data: {
  customerName: string;
  customerEmail: string;
  orderId: string;
  material: string;
  color: string;
  infill: number;
  quality: string;
  quantity: number;
  instructions: string | null;
  address: Address;
  fileCount: number;
}): Promise<SendEmailResult> {
  const { subject, html } = orderConfirmationTemplate({
    ...data,
    appUrl: APP_URL,
  });
  return sendEmail(data.customerEmail, subject, html);
}

/**
 * Send new order alert email to the admin
 */
export async function sendAdminNewOrderAlert(data: {
  customerName: string;
  customerEmail: string;
  orderId: string;
  material: string;
  color: string;
  infill: number;
  quality: string;
  quantity: number;
  fileCount: number;
}): Promise<SendEmailResult> {
  if (!ADMIN_EMAIL) {
    console.log('[Email] Skipped admin alert (no ADMIN_NOTIFICATION_EMAIL configured)');
    return { success: false, error: 'No admin email configured' };
  }

  const { subject, html } = adminNewOrderAlertTemplate({
    ...data,
    appUrl: APP_URL,
  });
  return sendEmail(ADMIN_EMAIL, subject, html);
}

/**
 * Send status update email to the customer
 */
export async function sendStatusUpdateEmail(data: {
  customerName: string;
  customerEmail: string;
  orderId: string;
  newStatus: OrderStatus;
  trackingNumber?: string;
}): Promise<SendEmailResult> {
  const { subject, html } = statusUpdateTemplate({
    ...data,
    appUrl: APP_URL,
  });
  return sendEmail(data.customerEmail, subject, html);
}
