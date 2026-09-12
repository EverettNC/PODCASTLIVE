export function trap(fn: () => void) {
  try {
    fn();
  } catch {
    /* floor stays up */
  }
}

export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = window.setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (value) => {
        window.clearTimeout(id);
        resolve(value);
      },
      (err) => {
        window.clearTimeout(id);
        reject(err);
      },
    );
  });
}

export function settle<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return withTimeout(promise, ms).catch(() => fallback);
}
