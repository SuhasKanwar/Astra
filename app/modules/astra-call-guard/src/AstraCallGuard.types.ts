import type { NativeModule } from 'expo-modules-core';

/** Trimmed verdict the native overlay needs to render. */
export type CallGuardVerdict = {
  number: string;
  riskScore: number;
  label: string;
  scamType: string | null;
  recommendation: string;
};

/** Result of {@link AstraCallGuardModule.requestCallPermissions}. */
export type CallGuardPermissions = {
  phone: boolean;
  overlay: boolean;
};

/** Events emitted from native -> JS. */
export type AstraCallGuardModuleEvents = {
  onIncomingCall: (event: { number: string }) => void;
  onCallEnded: (event: Record<string, never>) => void;
};

/** The native module surface (also an EventEmitter via NativeModule). */
export declare class AstraCallGuardModule extends NativeModule<AstraCallGuardModuleEvents> {
  /** Requests READ_PHONE_STATE + READ_CALL_LOG; also reports overlay state. */
  requestCallPermissions(): Promise<CallGuardPermissions>;
  /** Settings.canDrawOverlays. */
  hasOverlayPermission(): Promise<boolean>;
  /** Launches ACTION_MANAGE_OVERLAY_PERMISSION. */
  openOverlaySettings(): void;
  /** Draws the system overlay (no-op without draw-over permission). */
  showCallerOverlay(verdict: CallGuardVerdict): void;
  /** Removes the system overlay. */
  hideCallerOverlay(): void;
  /** Fires `onIncomingCall` exactly like a real detected call. */
  simulateIncomingCall(number: string): void;
}
