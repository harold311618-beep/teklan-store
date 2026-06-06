// src/app/layout.js
import './globals.css';

export const metadata = {
  title: 'Teklan | Tecnología y Crédito',
  description: 'Tienda de celulares con financiación directa.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-slate-900 text-slate-100 min-h-screen flex flex-col">
        <nav className="p-6 flex justify-between items-center border-b border-slate-700">
          <h1 className="text-3xl font-black text-cyan-400 tracking-tighter">TEKLAN</h1>
          <div className="space-x-6 font-medium">
            <a href="/" className="hover:text-cyan-400 transition">Tienda</a>
            <a href="#" className="hover:text-cyan-400 transition">Mi Crédito</a>
          </div>
        </nav>
        
        <main className="flex-grow">{children}</main>

        <footer className="p-10 border-t border-slate-800 text-center text-slate-500 text-sm">
          <p>© 2026 Teklan - Tecnología a tu alcance.</p>
        </footer>
      </body>
    </html>
  );
}