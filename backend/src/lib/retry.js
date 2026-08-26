export const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function withBoundedExponentialRetry(operation, {
  attempts,
  initialDelayMs,
  maxDelayMs,
  sleep = wait,
} = {}) {
  const maximumAttempts = Math.max(1, Number(attempts) || 1);
  const maximumDelay = Math.max(0, Number(maxDelayMs) || 0);
  let delay = Math.max(0, Number(initialDelayMs) || 0);

  for (let attempt = 1; attempt <= maximumAttempts; attempt += 1) {
    try {
      return await operation(attempt);
    } catch (error) {
      if (attempt === maximumAttempts) throw error;
      await sleep(Math.min(delay, maximumDelay));
      delay = Math.min(Math.max(delay * 2, 1), maximumDelay);
    }
  }
  throw new Error("Retry operation ended unexpectedly.");
}
