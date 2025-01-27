// Root layout - server component
import { AuthProvider } from '../components/providers/AuthProvider';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body suppressHydrationWarning={true}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
