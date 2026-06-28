/**
 * Shared API + domain types for Astra.
 * These mirror the backend contract (see docs design spec, sections 2 & 5).
 */

export type VerdictLabel = 'Safe' | 'Suspicious' | 'Scam' | 'Unknown';

/** A single community report sample attached to a Verdict. */
export interface VerdictReport {
  scamType: string;
  description: string;
  severity: number;
  createdAt: string;
}

/** Server -> app verdict that drives the verdict card + overlay. */
export interface Verdict {
  number: string;
  riskScore: number; // 0..100
  label: VerdictLabel;
  scamType: string | null;
  reportCount: number;
  explanation: string;
  recommendation: string;
  reports?: VerdictReport[];
}

/** Authenticated user as returned by the server. */
export interface ApiUser {
  id?: string;
  name: string;
  email: string;
}

/** data payload of /api/auth/signin|signup. */
export interface AuthResponseData {
  user: ApiUser;
  token: string;
}

/** Standard server envelope: { success, message?, data? }. */
export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data?: T;
}

/** One row from GET /api/checks. */
export interface CheckItem {
  number: string;
  riskScore: number;
  label: VerdictLabel;
  scamType: string | null;
  createdAt: string;
}

/** One row from GET /api/reports?number=. */
export interface ReportItem {
  number?: string;
  scamType: string;
  description: string;
  severity: number;
  createdAt: string;
}

export interface SubmitReportPayload {
  number: string;
  scamType: string;
  description: string;
  severity?: number;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface SigninPayload {
  email: string;
  password: string;
}
