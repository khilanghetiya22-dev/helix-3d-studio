'use client';

import React from 'react';
import { Inbox, Printer, CheckCircle, Truck, PackageCheck } from 'lucide-react';
import { OrderStatus } from '@/lib/types';
import { ORDER_STATUSES } from '@/lib/constants';

interface OrderStatusStepperProps {
  currentStatus: OrderStatus;
  className?: string;
}

const iconMap: Record<string, React.ReactNode> = {
  inbox: <Inbox className="w-5 h-5" />,
  printer: <Printer className="w-5 h-5" />,
  'check-circle': <CheckCircle className="w-5 h-5" />,
  truck: <Truck className="w-5 h-5" />,
  'package-check': <PackageCheck className="w-5 h-5" />,
};

// HELIX brand status stepper — gold-branded per V7 spec
// Completed: gold filled | Current: gold outlined + glow | Upcoming: grey
const GOLD = '#C9A84C';
const GREY = '#6B6B6B';
const WHITE = '#F5F0E8';
const NAVY = '#0D1B2A';

export default function OrderStatusStepper({ currentStatus, className = '' }: OrderStatusStepperProps) {
  const currentIndex = ORDER_STATUSES.findIndex(s => s.key === currentStatus);

  return (
    <div className={`w-full ${className}`}>
      {/* Desktop: Horizontal */}
      <div className="hidden md:flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute top-6 left-[10%] right-[10%] h-0.5" style={{ backgroundColor: 'rgba(201,168,76,0.15)' }} />
        {/* Progress line — gold */}
        <div
          className="absolute top-6 left-[10%] h-0.5 transition-all duration-700 ease-out"
          style={{
            width: `${currentIndex === 0 ? 0 : (currentIndex / (ORDER_STATUSES.length - 1)) * 80}%`,
            backgroundColor: GOLD,
          }}
        />

        {ORDER_STATUSES.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <div key={step.key} className="relative flex flex-col items-center z-10" style={{ width: '20%' }}>
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  transition-all duration-500 ease-out
                  ${isCompleted ? 'scale-90' : isCurrent ? 'scale-110' : 'scale-90 opacity-40'}
                `}
                style={{
                  backgroundColor: isCompleted
                    ? `${GOLD}20`
                    : isCurrent
                      ? 'transparent'
                      : NAVY,
                  border: isPending
                    ? `2px solid ${GREY}`
                    : `2px solid ${GOLD}`,
                  boxShadow: isCurrent ? `0 0 20px ${GOLD}40` : 'none',
                  color: isPending ? GREY : GOLD,
                }}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  iconMap[step.icon]
                )}
              </div>

              <span
                className={`
                  mt-3 text-xs font-medium text-center transition-all duration-300
                `}
                style={{
                  color: isCurrent ? WHITE : isCompleted ? GOLD : GREY,
                  fontWeight: isCurrent ? 600 : 500,
                }}
              >
                {step.label}
              </span>

              {isCurrent && (
                <div
                  className="mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                  style={{
                    backgroundColor: `${GOLD}20`,
                    color: GOLD,
                    letterSpacing: '0.08em',
                  }}
                >
                  Current
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: Vertical */}
      <div className="md:hidden space-y-0">
        {ORDER_STATUSES.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;
          const isLast = index === ORDER_STATUSES.length - 1;

          return (
            <div key={step.key} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                    transition-all duration-500
                    ${isPending ? 'opacity-40' : ''}
                  `}
                  style={{
                    backgroundColor: isCompleted
                      ? `${GOLD}20`
                      : isCurrent
                        ? 'transparent'
                        : NAVY,
                    border: isPending
                      ? `2px solid ${GREY}`
                      : `2px solid ${GOLD}`,
                    boxShadow: isCurrent ? `0 0 16px ${GOLD}40` : 'none',
                    color: isPending ? GREY : GOLD,
                  }}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    iconMap[step.icon]
                  )}
                </div>
                {!isLast && (
                  <div
                    className="w-0.5 h-8 transition-all duration-500"
                    style={{
                      backgroundColor: isCompleted ? GOLD : 'rgba(201,168,76,0.15)',
                    }}
                  />
                )}
              </div>

              <div className={`pt-2 pb-4 ${isPending ? 'opacity-40' : ''}`}>
                <p
                  className="text-sm font-medium"
                  style={{ color: isCurrent ? WHITE : isCompleted ? GOLD : GREY }}
                >
                  {step.label}
                </p>
                {isCurrent && (
                  <span
                    className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                    style={{ backgroundColor: `${GOLD}20`, color: GOLD, letterSpacing: '0.08em' }}
                  >
                    Current
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
