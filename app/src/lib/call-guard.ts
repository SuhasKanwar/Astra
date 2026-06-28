/**
 * Safe wrapper around the local `astra-call-guard` native module.
 *
 * The native module is Android-only and absent on web / Expo Go / any build
 * that hasn't linked it. Every export here degrades to a no-op in that case so
 * the rest of the app stays demoable, with `isNativeCallGuardAvailable` letting
 * callers branch to the JS fallback overlay.
 */
import type { EventSubscription } from 'expo-modules-core';

import AstraCallGuard, {
  type CallGuardPermissions,
  type CallGuardVerdict,
} from '../../modules/astra-call-guard';
import type { Verdict } from './types';

export type { CallGuardPermissions, CallGuardVerdict };

/** True when the Kotlin module is linked (release/dev build on Android). */
export const isNativeCallGuardAvailable = AstraCallGuard != null;

/** Map a full server Verdict down to what the native overlay renders. */
export function toCallGuardVerdict(v: Verdict): CallGuardVerdict {
  return {
    number: v.number,
    riskScore: v.riskScore,
    label: v.label,
    scamType: v.scamType,
    recommendation: v.recommendation,
  };
}

export async function requestCallPermissions(): Promise<CallGuardPermissions> {
  if (!AstraCallGuard) return { phone: false, overlay: false };
  return AstraCallGuard.requestCallPermissions();
}

export async function hasOverlayPermission(): Promise<boolean> {
  if (!AstraCallGuard) return false;
  return AstraCallGuard.hasOverlayPermission();
}

export function openOverlaySettings(): void {
  AstraCallGuard?.openOverlaySettings();
}

export function showCallerOverlay(verdict: Verdict): void {
  AstraCallGuard?.showCallerOverlay(toCallGuardVerdict(verdict));
}

export function hideCallerOverlay(): void {
  AstraCallGuard?.hideCallerOverlay();
}

export function simulateIncomingCall(number: string): void {
  AstraCallGuard?.simulateIncomingCall(number);
}

export function addIncomingCallListener(
  listener: (event: { number: string }) => void,
): EventSubscription | null {
  return AstraCallGuard?.addListener('onIncomingCall', listener) ?? null;
}

export function addCallEndedListener(
  listener: (event: Record<string, never>) => void,
): EventSubscription | null {
  return AstraCallGuard?.addListener('onCallEnded', listener) ?? null;
}
