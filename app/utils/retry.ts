export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let retries = 0;

  while (true) {
    try {
      return await fn();
    } catch (error: any) {
      if (retries >= maxRetries || error?.status !== 429) {
        throw error;
      }

      retries++;
      const delay = initialDelay * Math.pow(2, retries - 1); 
      console.log(`Retry attempt ${retries} after ${delay}ms`);
      await sleep(delay);
    }
  }
}
