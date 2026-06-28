import type { VerdictLabel } from '@/lib/types';

/** Color-coding for verdict labels, shared by the card, overlay and lists. */
export const LABEL_COLORS: Record<VerdictLabel, string> = {
  Scam: '#E5484D', // red
  Suspicious: '#FFB224', // amber
  Safe: '#30A46C', // green
  Unknown: '#8B8D98', // grey
};

/** Soft background tint per label (used behind the score gauge). */
export const LABEL_TINTS: Record<VerdictLabel, string> = {
  Scam: 'rgba(229, 72, 77, 0.12)',
  Suspicious: 'rgba(255, 178, 36, 0.14)',
  Safe: 'rgba(48, 164, 108, 0.12)',
  Unknown: 'rgba(139, 141, 152, 0.12)',
};

export function labelColor(label: VerdictLabel): string {
  return LABEL_COLORS[label] ?? LABEL_COLORS.Unknown;
}

export function labelTint(label: VerdictLabel): string {
  return LABEL_TINTS[label] ?? LABEL_TINTS.Unknown;
}

/** Canonical scam types, used by the report form picker. */
export const SCAM_TYPES = [
  'Digital Arrest Scam',
  'KYC / Bank Fraud',
  'Lottery Scam',
  'Fake Delivery',
  'Job Scam',
  'Investment Scam',
  'Electricity Bill',
  'UPI Refund',
  'Other',
] as const;
