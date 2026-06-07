// src/app/layout.js
import CartDrawer from '@/components/CartDrawer';
import { CartProvider } from '@/context/CartContext';
import Link from 'next/link';
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
        <CartProvider>
          <nav className="p-6 flex flex-col gap-4 border-b border-slate-700 md:flex-row md:justify-between md:items-center">
            <Link href="/" className="text-3xl font-black text-cyan-400 tracking-tighter">
              TEKLAN
            </Link>
            <div className="flex flex-wrap items-center gap-4 font-medium">
              <Link href="/" className="hover:text-cyan-400 transition">Tienda</Link>
              <Link href="/" className="hover:text-cyan-400 transition">Mi Crédito</Link>
              <CartDrawer />
            </div>
          </nav>

          <main className="flex-grow">{children}</main>

          <footer className="p-10 border-t border-slate-800 text-center text-slate-500 text-sm">
            <p>© 2026 Teklan - Tecnología a tu alcance.</p>
            <p>By Montc Investment SAS</p>
            <p>NIT 901.828.471-9</p>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
