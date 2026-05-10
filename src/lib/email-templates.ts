// HTML Email Templates for FORMIQ 3D Print Studio
// These use inline styles for maximum email client compatibility

import type { Address, OrderStatus } from './types';
import { STATUS_LABELS, MATERIALS, COLORS, QUALITY_OPTIONS } from './constants';

const brandColor = '#6366F1';
const accentColor = '#22D3EE';
const bgDark = '#0F172A';
const bgCard = '#1E293B';
const textPrimary = '#F1F5F9';
const textSecondary = '#94A3B8';
const borderColor = '#334155';

function getMaterialLabel(value: string) {
  return MATERIALS.find(m => m.value === value)?.label || value;
}

function getColorLabel(value: string) {
  return COLORS.find(c => c.value === value)?.label || value;
}

function getQualityLabel(value: string) {
  return QUALITY_OPTIONS.find(q => q.value === value)?.label || value;
}

function formatAddress(address: Address): string {
  return `${address.street}, ${address.city}, ${address.state} — ${address.pincode}, ${address.country}`;
}

const statusEmoji: Record<string, string> = {
  received: '📥',
  printing: '🖨️',
  quality_check: '🔍',
  shipped: '🚚',
  delivered: '✅',
};

function baseLayout(title: string, content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:${bgDark};font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${bgDark};padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="text-align:center;padding-bottom:30px;">
              <div style="display:inline-block;background:linear-gradient(135deg,${brandColor},${accentColor});border-radius:12px;padding:12px 14px;margin-bottom:12px;">
                <span style="font-size:24px;font-weight:800;color:#FFFFFF;letter-spacing:0.5px;">⬡</span>
              </div>
              <h1 style="margin:8px 0 0;font-size:22px;font-weight:700;color:${textPrimary};">
                Print<span style="color:${brandColor};">Forge</span> 3D
              </h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="background-color:${bgCard};border-radius:16px;border:1px solid ${borderColor};padding:32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="text-align:center;padding-top:24px;">
              <p style="margin:0;font-size:12px;color:${textSecondary};">
                © ${new Date().getFullYear()} FORMIQ 3D Print Studio. All rights reserved.
              </p>
              <p style="margin:6px 0 0;font-size:11px;color:${textSecondary};">
                You received this email because you have an account with FORMIQ 3D Print Studio.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function specRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:8px 12px;font-size:13px;color:${textSecondary};border-bottom:1px solid ${borderColor};">${label}</td>
      <td style="padding:8px 12px;font-size:13px;color:${textPrimary};font-weight:600;text-align:right;border-bottom:1px solid ${borderColor};">${value}</td>
    </tr>`;
}

// ─── Order Confirmation (Customer) ───────────────────────────────
export function orderConfirmationTemplate(data: {
  customerName: string;
  orderId: string;
  material: string;
  color: string;
  infill: number;
  quality: string;
  quantity: number;
  instructions: string | null;
  address: Address;
  fileCount: number;
  appUrl: string;
}): { subject: string; html: string } {
  const content = `
    <h2 style="margin:0 0 8px;font-size:20px;color:${textPrimary};">Order Confirmed! 🎉</h2>
    <p style="margin:0 0 24px;font-size:14px;color:${textSecondary};line-height:1.6;">
      Hi <strong style="color:${textPrimary};">${data.customerName}</strong>, your 3D print order has been received and is being reviewed.
    </p>

    <!-- Order ID -->
    <div style="background-color:${bgDark};border-radius:12px;padding:16px;margin-bottom:20px;text-align:center;">
      <p style="margin:0 0 4px;font-size:11px;color:${textSecondary};text-transform:uppercase;letter-spacing:1px;">Order ID</p>
      <p style="margin:0;font-size:18px;font-weight:700;color:${accentColor};font-family:monospace;">#${data.orderId.slice(0, 8)}</p>
    </div>

    <!-- Specs Table -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;border-radius:8px;overflow:hidden;background:${bgDark};">
      ${specRow('Material', getMaterialLabel(data.material))}
      ${specRow('Color', getColorLabel(data.color))}
      ${specRow('Infill', `${data.infill}%`)}
      ${specRow('Quality', getQualityLabel(data.quality))}
      ${specRow('Quantity', String(data.quantity))}
      ${specRow('Files', `${data.fileCount} file(s)`)}
    </table>

    ${data.instructions ? `
    <div style="background-color:${bgDark};border-radius:8px;padding:12px;margin-bottom:20px;">
      <p style="margin:0 0 4px;font-size:11px;color:${textSecondary};text-transform:uppercase;letter-spacing:1px;">Special Instructions</p>
      <p style="margin:0;font-size:13px;color:${textPrimary};">${data.instructions}</p>
    </div>` : ''}

    <!-- Address -->
    <div style="background-color:${bgDark};border-radius:8px;padding:12px;margin-bottom:24px;">
      <p style="margin:0 0 4px;font-size:11px;color:${textSecondary};text-transform:uppercase;letter-spacing:1px;">📍 Delivery Address</p>
      <p style="margin:0;font-size:13px;color:${textPrimary};">${formatAddress(data.address)}</p>
    </div>

    <!-- CTA -->
    <div style="text-align:center;">
      <a href="${data.appUrl}/orders/${data.orderId}" style="display:inline-block;background:linear-gradient(135deg,${brandColor},${accentColor});color:#FFFFFF;font-size:14px;font-weight:600;padding:12px 32px;border-radius:12px;text-decoration:none;">
        Track Your Order →
      </a>
    </div>

    <p style="margin:24px 0 0;font-size:12px;color:${textSecondary};text-align:center;">
      We'll notify you at each stage of the process.
    </p>`;

  return {
    subject: `Order Confirmed — #${data.orderId.slice(0, 8)} | FORMIQ 3D Print Studio`,
    html: baseLayout('Order Confirmed', content),
  };
}

// ─── New Order Alert (Admin) ────────────────────────────────────
export function adminNewOrderAlertTemplate(data: {
  customerName: string;
  customerEmail: string;
  orderId: string;
  material: string;
  color: string;
  infill: number;
  quality: string;
  quantity: number;
  fileCount: number;
  appUrl: string;
}): { subject: string; html: string } {
  const content = `
    <h2 style="margin:0 0 8px;font-size:20px;color:${textPrimary};">📦 New Order Received</h2>
    <p style="margin:0 0 24px;font-size:14px;color:${textSecondary};line-height:1.6;">
      A new order has been submitted and is awaiting processing.
    </p>

    <!-- Customer Info -->
    <div style="background-color:${bgDark};border-radius:12px;padding:16px;margin-bottom:20px;">
      <p style="margin:0 0 4px;font-size:11px;color:${textSecondary};text-transform:uppercase;letter-spacing:1px;">Customer</p>
      <p style="margin:0;font-size:15px;font-weight:600;color:${textPrimary};">${data.customerName}</p>
      <p style="margin:4px 0 0;font-size:13px;color:${accentColor};">${data.customerEmail}</p>
    </div>

    <!-- Order Summary -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;border-radius:8px;overflow:hidden;background:${bgDark};">
      ${specRow('Order ID', `#${data.orderId.slice(0, 8)}`)}
      ${specRow('Material', getMaterialLabel(data.material))}
      ${specRow('Color', getColorLabel(data.color))}
      ${specRow('Infill', `${data.infill}%`)}
      ${specRow('Quality', getQualityLabel(data.quality))}
      ${specRow('Quantity', String(data.quantity))}
      ${specRow('Files', `${data.fileCount} file(s)`)}
    </table>

    <!-- CTA -->
    <div style="text-align:center;">
      <a href="${data.appUrl}/admin/orders/${data.orderId}" style="display:inline-block;background:linear-gradient(135deg,${brandColor},${accentColor});color:#FFFFFF;font-size:14px;font-weight:600;padding:12px 32px;border-radius:12px;text-decoration:none;">
        View Order Details →
      </a>
    </div>`;

  return {
    subject: `🆕 New Order #${data.orderId.slice(0, 8)} from ${data.customerName}`,
    html: baseLayout('New Order Alert', content),
  };
}

// ─── Status Update (Customer) ────────────────────────────────────
export function statusUpdateTemplate(data: {
  customerName: string;
  orderId: string;
  newStatus: OrderStatus;
  trackingNumber?: string;
  appUrl: string;
}): { subject: string; html: string } {
  const statusLabel = STATUS_LABELS[data.newStatus] || data.newStatus;
  const emoji = statusEmoji[data.newStatus] || '📋';
  const isShipped = data.newStatus === 'shipped';
  const isDelivered = data.newStatus === 'delivered';

  let statusMessage = '';
  switch (data.newStatus) {
    case 'printing':
      statusMessage = 'Your order is now being printed! Our machines are working on bringing your design to life.';
      break;
    case 'quality_check':
      statusMessage = 'Your print is complete and is now undergoing quality inspection to ensure it meets our standards.';
      break;
    case 'shipped':
      statusMessage = 'Great news! Your order has been shipped and is on its way to you.';
      break;
    case 'delivered':
      statusMessage = 'Your order has been delivered! We hope you love your 3D print.';
      break;
    default:
      statusMessage = `Your order status has been updated to: ${statusLabel}.`;
  }

  const content = `
    <h2 style="margin:0 0 8px;font-size:20px;color:${textPrimary};">${emoji} Order Status Update</h2>
    <p style="margin:0 0 24px;font-size:14px;color:${textSecondary};line-height:1.6;">
      Hi <strong style="color:${textPrimary};">${data.customerName}</strong>, here's an update on your order.
    </p>

    <!-- Order + Status -->
    <div style="background-color:${bgDark};border-radius:12px;padding:20px;margin-bottom:20px;text-align:center;">
      <p style="margin:0 0 8px;font-size:12px;color:${textSecondary};">Order #${data.orderId.slice(0, 8)}</p>
      <div style="display:inline-block;background:${brandColor}22;border:1px solid ${brandColor}44;border-radius:8px;padding:8px 20px;">
        <span style="font-size:16px;font-weight:700;color:${brandColor};">${emoji} ${statusLabel}</span>
      </div>
    </div>

    <p style="margin:0 0 20px;font-size:14px;color:${textSecondary};line-height:1.6;">
      ${statusMessage}
    </p>

    ${isShipped && data.trackingNumber ? `
    <div style="background-color:${bgDark};border-radius:12px;padding:16px;margin-bottom:20px;border:1px solid ${accentColor}33;">
      <p style="margin:0 0 4px;font-size:11px;color:${textSecondary};text-transform:uppercase;letter-spacing:1px;">📦 Tracking Number</p>
      <p style="margin:0;font-size:20px;font-weight:700;color:${accentColor};font-family:monospace;letter-spacing:1px;">${data.trackingNumber}</p>
    </div>` : ''}

    ${isDelivered ? `
    <p style="margin:0 0 20px;font-size:13px;color:${textSecondary};">
      If you have any questions or concerns about your print, please don't hesitate to reach out. Thank you for choosing FORMIQ 3D Print Studio!
    </p>` : ''}

    <!-- CTA -->
    <div style="text-align:center;">
      <a href="${data.appUrl}/orders/${data.orderId}" style="display:inline-block;background:linear-gradient(135deg,${brandColor},${accentColor});color:#FFFFFF;font-size:14px;font-weight:600;padding:12px 32px;border-radius:12px;text-decoration:none;">
        View Order Details →
      </a>
    </div>`;

  const subjectMap: Record<string, string> = {
    printing: `🖨️ Your order is now printing — #${data.orderId.slice(0, 8)}`,
    quality_check: `🔍 Quality check in progress — #${data.orderId.slice(0, 8)}`,
    shipped: `🚚 Your order has been shipped! — #${data.orderId.slice(0, 8)}`,
    delivered: `✅ Order delivered — #${data.orderId.slice(0, 8)}`,
  };

  return {
    subject: subjectMap[data.newStatus] || `Order Update — #${data.orderId.slice(0, 8)} | FORMIQ 3D Print Studio`,
    html: baseLayout('Order Status Update', content),
  };
}
