export function isNetworkError(e: any): e is { type: string; code: string } {
  return e && typeof e === 'object' && 'type' in e && 'code' in e
}
