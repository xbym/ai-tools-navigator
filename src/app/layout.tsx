import { AuthProvider } from '@/components/AuthProvider';
import { LoadingProgress } from '@/components/LoadingProgress';
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <LoadingProgress />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
