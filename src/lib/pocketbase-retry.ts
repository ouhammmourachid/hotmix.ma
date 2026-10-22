// PocketBase reports network failures (connect timeout, connection reset) as status 0.
// Server-side fetches retry those a few times so a single dropped connection doesn't
// fail the whole render; HTTP errors (404, 400, ...) are returned immediately.
export async function withNetworkRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      if (error?.status !== 0 || attempt >= attempts) throw error;
      await new Promise((resolve) => setTimeout(resolve, 300 * attempt));
    }
  }
}
