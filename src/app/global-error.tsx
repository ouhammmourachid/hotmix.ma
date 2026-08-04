'use client';

import React from 'react';

export default function GlobalError({
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-primary text-secondary">
          <h2 className="text-xl font-bold mb-4">Something went wrong!</h2>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-greny text-white rounded-md hover:opacity-90">
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
