export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 2,
  retryInterval: number = 1000,
  timeout: number = 25000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await Promise.race([
        operation(),
        new Promise<T>((_, reject) =>
          setTimeout(() => reject(new Error(`Request timeout after ${timeout}ms`)), timeout)
        ),
      ]);
      return result;
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on quota errors
      if (error?.responseBody && error.responseBody.includes("insufficient_quota")) {
        console.error("Quota exceeded, not retrying:", error?.message);
        throw error;
      }

      console.log(`Attempt ${attempt + 1}/${maxRetries + 1} failed:`, error?.message);
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, retryInterval));
      }
    }
  }
  
  throw lastError;
}

export function isQuotaOrAuthOrNetwork(err: any): boolean {
  const msg = String(err?.message || "").toLowerCase()
  const body = String((err as any)?.responseBody || "")
  const code = (err as any)?.statusCode
  return (
    msg.includes("insufficient_quota") ||
    msg.includes("quota") ||
    msg.includes("billing") ||
    msg.includes("unauthorized") ||
    msg.includes("401") ||
    msg.includes("timeout") ||
    code === 401 ||
    code === 429 ||
    /"insufficient_quota"/i.test(body)
  )
}