export async function logClientError(error: Error, url: string, component?: string) {
  try {
    await fetch('/api/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        url,
        userAgent: navigator.userAgent,
        component
      })
    });
  } catch (e) {
    console.error('Failed to log client error:', e);
  }
}