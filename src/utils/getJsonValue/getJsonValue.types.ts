export interface GetJsonValueArgs<T> {
  obj: object;
  path: string;
  fallback?: T;
}
