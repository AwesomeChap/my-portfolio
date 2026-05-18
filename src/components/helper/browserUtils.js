export function isFirefox() {
  if (typeof navigator === 'undefined') return false;
  return /firefox/i.test(navigator.userAgent);
}
