const VIBRATION_PATTERN = 10;

// Haptic feedback on add-to-cart. Client-only: `navigator.vibrate` is a
// browser API with no server counterpart, so callers must invoke this from an
// event handler (never during render) and guard it where SSR is possible.
export function vibrateAddToCart(): void {
  navigator.vibrate?.(VIBRATION_PATTERN);
}
