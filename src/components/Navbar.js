"use client";

import Link from 'next/link';
import CartDrawer from '@/components/CartDrawer';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, isAdmin } = useAuth();

  return (
    <nav className="p-6 flex flex-col gap-4 border-b border-slate-700 md:flex-row md:justify-between md:items-center">
      <Link href="/" className="text-3xl font-black text-cyan-400 tracking-tighter">
        TEKLAN
      </Link>
      <div className="flex flex-wrap items-center gap-4 font-medium">
        <Link href="/" className="hover:text-cyan-400 transition">Tienda</Link>
        <Link href="/checkout" className="hover:text-cyan-400 transition">Checkout</Link>
        {user && (
          <Link href="/mis-pedidos" className="hover:text-cyan-400 transition">Mis pedidos</Link>
        )}
        <Link href="/auth" className="hover:text-cyan-400 transition">Cuenta</Link>
        {isAdmin && (
          <Link href="/admin" className="hover:text-cyan-400 transition">Admin</Link>
        )}
        <CartDrawer />
      </div>
    </nav>
  );
}
