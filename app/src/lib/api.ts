import axios, { type AxiosResponse } from 'axios';

import { store } from '@/redux/store';
import { HTTP_BASE_URL } from './config';
import type {
  AuthResponseData,
  CheckItem,
  ReportItem,
  SigninPayload,
  SignupPayload,
  SubmitReportPayload,
  Verdict,
} from './types';

export const api = axios.create({
  baseURL: HTTP_BASE_URL,
  timeout: 15000,
});

/**
 * Inject Authorization: Bearer <token> on every request, reading the
 * current token straight from the redux store so it always stays in sync.
 */
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

/**
 * Server responses follow `{ success, message?, data? }`. Some routes may
 * return the payload directly. This unwraps `data` when present, otherwise
 * returns the body as-is, so helpers stay resilient for the demo.
 */
function unwrap<T>(res: AxiosResponse): T {
  const body = res.data;
  if (body && typeof body === 'object' && 'data' in body && body.data !== undefined) {
    return body.data as T;
  }
  return body as T;
}

/** Turn an axios/unknown error into a human-readable message. */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message || error.message || 'Network request failed';
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong';
}

// --- Auth ---------------------------------------------------------------

export async function signup(payload: SignupPayload): Promise<AuthResponseData> {
  const res = await api.post('/api/auth/signup', payload);
  return unwrap<AuthResponseData>(res);
}

export async function signin(payload: SigninPayload): Promise<AuthResponseData> {
  const res = await api.post('/api/auth/signin', payload);
  return unwrap<AuthResponseData>(res);
}

// --- Calls / reports ----------------------------------------------------

export async function lookupNumber(number: string): Promise<Verdict> {
  const res = await api.get('/api/calls/lookup', { params: { number } });
  return unwrap<Verdict>(res);
}

export async function submitReport(payload: SubmitReportPayload): Promise<ReportItem> {
  const res = await api.post('/api/reports', payload);
  return unwrap<ReportItem>(res);
}

export async function getReports(number: string): Promise<ReportItem[]> {
  const res = await api.get('/api/reports', { params: { number } });
  return unwrap<ReportItem[]>(res) ?? [];
}

export async function getChecks(): Promise<CheckItem[]> {
  const res = await api.get('/api/checks');
  return unwrap<CheckItem[]>(res) ?? [];
}
