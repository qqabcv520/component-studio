export function isNotNil<T>(x: T): x is NonNullable<T> {
  return x != null;
}
