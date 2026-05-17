import React from 'react';
import type { OrderStatus } from '@/lib/types';

interface TimelineEvent {
  status: OrderStatus;
  label: string;
  timestamp?: string | null;
  isPending?: boolean;
}

interface OrderStatusTimelineProps {
  currentStatus: OrderStatus;
  createdAt?: string;
  updatedAt?: string;
  estimatedDelivery?: string | null;
}

const STATUS_STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'received', label: 'Received' },
  { key: 'printing', label: 'Printing' },
  { key: 'quality_check', label: 'Quality Check' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
];

const STATUS_INDEX: Record<OrderStatus, number> = {
  received: 0,
  printing: 1,
  quality_check: 2,
  shipped: 3,
  delivered: 4,
};

function formatTimestamp(ts: string): string {
  try {
    return new Date(ts).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return ts;
  }
}

export default function OrderStatusTimeline({
  currentStatus,
  createdAt,
  updatedAt,
  estimatedDelivery,
}: OrderStatusTimelineProps) {
  const currentIdx = STATUS_INDEX[currentStatus] ?? 0;

  const events: TimelineEvent[] = STATUS_STEPS.map((step, idx) => {
    let timestamp: string | null = null;
    let isPending = false;

    if (idx === 0 && createdAt) {
      timestamp = formatTimestamp(createdAt);
    } else if (idx === currentIdx && updatedAt && idx > 0) {
      timestamp = formatTimestamp(updatedAt);
    } else if (idx < currentIdx) {
      timestamp = '—'; // Done but exact time unknown
    } else if (idx === STATUS_STEPS.length - 1 && estimatedDelivery) {
      timestamp = `Est. ${estimatedDelivery}`;
      isPending = idx > currentIdx;
    } else if (idx > currentIdx) {
      timestamp = 'Pending';
      isPending = true;
    }

    return {
      status: step.key,
      label: step.label,
      timestamp,
      isPending,
    };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {events.map((event, idx) => {
        const isDone = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        const isPending = idx > currentIdx;

        return (
          <div key={event.status} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            {/* Timeline indicator */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              {/* Dot */}
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  flexShrink: 0,
                  ...(isDone
                    ? { backgroundColor: '#C9A84C', border: '2px solid #C9A84C', color: '#0A0A0F' }
                    : isCurrent
                    ? { backgroundColor: 'transparent', border: '2px solid #C9A84C' }
                    : { backgroundColor: 'transparent', border: '2px solid #3A3A3A' }),
                }}
              >
                {isDone && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0A0A0F" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {isCurrent && (
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#C9A84C' }} />
                )}
              </div>

              {/* Connector line */}
              {idx < events.length - 1 && (
                <div
                  style={{
                    width: '1px',
                    height: '36px',
                    backgroundColor: isDone ? 'rgba(201,168,76,0.4)' : 'rgba(58,58,58,0.6)',
                    marginTop: '2px',
                    marginBottom: '2px',
                  }}
                />
              )}
            </div>

            {/* Content */}
            <div style={{ paddingBottom: idx < events.length - 1 ? '8px' : '0', paddingTop: '0px' }}>
              <p
                style={{
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontSize: '14px',
                  fontWeight: isCurrent ? 500 : 400,
                  color: isDone || isCurrent ? '#F5F0E8' : '#6B6B6B',
                  letterSpacing: '0.02em',
                  lineHeight: '20px',
                }}
              >
                {event.label}
              </p>
              {event.timestamp && (
                <p
                  style={{
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontSize: '12px',
                    color: isPending ? '#3A3A3A' : isDone ? 'rgba(201,168,76,0.7)' : '#C9A84C',
                    marginTop: '2px',
                  }}
                >
                  {event.timestamp}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
