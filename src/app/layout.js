// src/app/layout.js
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata = {
  title: 'Teklan | Tecnología y Crédito',
  description: 'Tienda de celulares con financiación directa.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-slate-900 text-slate-100 min-h-screen flex flex-col">
        <AuthProvider>
          <CartProvider>
            <Navbar />

            <main className="flex-grow">{children}</main>

            <footer className="p-10 border-t border-slate-800 text-center text-slate-500 text-sm">
              <p>© 2026 Teklan - Tecnología a tu alcance.</p>
              <p>By Montc Investment SAS</p>
              <p>NIT 901.828.471-9</p>
            </footer>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
