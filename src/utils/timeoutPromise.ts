export function timeoutPromise(ms: number) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Request timed out.'))
    }, ms)
  })
}
