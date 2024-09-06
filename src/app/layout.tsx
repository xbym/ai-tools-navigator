import { AuthProvider } from '@/components/AuthProvider';
import { ToastProvider } from '@/contexts/ToastContext';
import "./globals.css";
import ErrorBoundary from '@/components/ErrorBoundary';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}