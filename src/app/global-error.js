'use client';

import * as Sentry from "@sentry/nextjs";

export default function GlobalError({ error }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <h2>出错了!</h2>
        <button onClick={() => window.location.reload()}>
          请尝试刷新页面
        </button>
      </body>
    </html>
  );
}