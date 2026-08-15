import { useEffect } from 'react';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export function GlobalErrorPage({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Global unhandled error:', error);
  }, [error]);

  return (
    <html lang="ru">
      <body style={{ fontFamily: 'sans-serif' }}>
        <div
          style={{
            display: 'flex',
            minHeight: '100vh',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            padding: '1rem',
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Критическая ошибка приложения</h1>
          <p style={{ color: '#888', maxWidth: '24rem' }}>
            Что-то серьёзно сломалось. Попробуйте перезагрузить страницу.
          </p>
          {error.digest && (
            <p style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#aaa' }}>
              ID ошибки: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              background: '#111',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Попробовать снова
          </button>
        </div>
      </body>
    </html>
  );
}