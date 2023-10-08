export function isObservable(obj) {
  return obj && typeof obj.subscribe === 'function';
}
