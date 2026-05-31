/**
 * theme.js — JS mirror of CSS design tokens
 * Used for dynamic className generation and conditional styling.
 */

export const SIGNAL_COLORS = {
  BUY: {
    text: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/30',
    badge: 'badge-buy',
    glow: 'shadow-[0_0_24px_rgba(34,197,94,0.2)]',
  },
  SELL: {
    text: 'text-danger',
    bg: 'bg-danger/10',
    border: 'border-danger/30',
    badge: 'badge-sell',
    glow: 'shadow-[0_0_24px_rgba(239,68,68,0.2)]',
  },
  HOLD: {
    text: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/30',
    badge: 'badge-hold',
    glow: 'shadow-[0_0_24px_rgba(245,158,11,0.2)]',
  },
};

export const CHANGE_COLOR = (change) =>
  change > 0 ? 'text-success' : change < 0 ? 'text-danger' : 'text-text-secondary';

export const CHANGE_BG = (change) =>
  change > 0 ? 'bg-success/10' : change < 0 ? 'bg-danger/10' : 'bg-neutral/10';
