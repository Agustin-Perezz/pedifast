export function isSafariBrowser(): boolean {
  return (
    /Safari/.test(navigator.userAgent) &&
    !/Chrome|CriOS|FxiOS/.test(navigator.userAgent)
  );
}
