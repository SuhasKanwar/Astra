import { requireOptionalNativeModule } from 'expo-modules-core';

import type { AstraCallGuardModule } from './AstraCallGuard.types';

/**
 * The native module, or `null` when it isn't installed (web, Expo Go, or any
 * build without the native module linked). Prefer the safe wrapper in
 * `src/lib/call-guard.ts` over importing this directly.
 */
const AstraCallGuard = requireOptionalNativeModule<AstraCallGuardModule>('AstraCallGuard');

export default AstraCallGuard;
