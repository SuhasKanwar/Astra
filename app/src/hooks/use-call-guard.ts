import { useCallback, useEffect, useState } from 'react';

import { getErrorMessage, lookupNumber } from '@/lib/api';
import {
  addCallEndedListener,
  addIncomingCallListener,
  hasOverlayPermission,
  hideCallerOverlay,
  isNativeCallGuardAvailable,
  showCallerOverlay,
} from '@/lib/call-guard';
import type { Verdict } from '@/lib/types';

export type CallGuardOverlayState = {
  visible: boolean;
  number: string | null;
  verdict: Verdict | null;
  loading: boolean;
  error: string | null;
};

const HIDDEN: CallGuardOverlayState = {
  visible: false,
  number: null,
  verdict: null,
  loading: false,
  error: null,
};

/**
 * Bridges native call detection to the lookup -> overlay flow.
 *
 * Mounted once in `(tabs)/_layout`. On `onIncomingCall` it looks the number up
 * and, when draw-over permission is granted, hands the verdict to the native
 * system overlay. Otherwise (or on error) it surfaces the in-app JS
 * `VerdictOverlay` via the returned `overlayState`. On `onCallEnded` everything
 * is dismissed. No-ops cleanly when the native module isn't available.
 */
export function useCallGuard() {
  const [overlayState, setOverlayState] = useState<CallGuardOverlayState>(HIDDEN);

  const dismiss = useCallback(() => {
    hideCallerOverlay();
    setOverlayState(HIDDEN);
  }, []);

  useEffect(() => {
    if (!isNativeCallGuardAvailable) return;

    const incoming = addIncomingCallListener(async ({ number }) => {
      const useNative = await hasOverlayPermission();

      // JS fallback path shows a loading state immediately.
      if (!useNative) {
        setOverlayState({ visible: true, number, verdict: null, loading: true, error: null });
      }

      try {
        const verdict = await lookupNumber(number);
        if (useNative) {
          showCallerOverlay(verdict);
        } else {
          setOverlayState({ visible: true, number, verdict, loading: false, error: null });
        }
      } catch (e) {
        // Native overlay can't render an error -> always surface it in-app.
        setOverlayState({
          visible: true,
          number,
          verdict: null,
          loading: false,
          error: getErrorMessage(e),
        });
      }
    });

    const ended = addCallEndedListener(() => {
      hideCallerOverlay();
      setOverlayState(HIDDEN);
    });

    return () => {
      incoming?.remove();
      ended?.remove();
    };
  }, []);

  return { overlayState, dismiss };
}
