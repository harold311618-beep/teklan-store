'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchOrdersByUser } from '@/services/firestoreRepository';
import { formatCurrency, formatDate } from '@/lib/format';
import Link from 'next/link';

export default function MisPedidosPage() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!user) return;

    setLoadingOrders(true);
    setError('');

    fetchOrdersByUser(user.uid)
      .then(setOrders)
      .catch((fetchError) => {
        console.error('Error cargando pedidos:', fetchError);
        setError('No pudimos cargar tus pedidos. Intenta de nuevo.');
      })
      .finally(() => setLoadingOrders(false));
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-20">
        <div className="rounded-3xl border border-slate-700 bg-slate-900 px-8 py-6 text-slate-300">Verificando sesión...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-20">
        <div className="rounded-3xl border border-slate-700 bg-slate-900 p-10 text-center max-w-xl">
          <h1 className="text-3xl font-black mb-4">Inicia sesión para ver tus pedidos</h1>
          <p className="text-slate-400 mb-6">Solo tú puedes revisar el historial y el estado de tus compras.</p>
          <Link href="/auth" className="inline-flex rounded-full bg-cyan-500 px-6 py-3 text-slate-950 font-bold hover:bg-cyan-400 transition">
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white">Mis pedidos</h1>
        <p className="mt-2 text-slate-400">Revisa el historial, estado de pago y número de seguimiento de tus órdenes.</p>
      </div>

      {loadingOrders ? (
        <div className="rounded-3xl border border-slate-700 bg-slate-950 p-10 text-center text-slate-400">Cargando pedidos...</div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-600 bg-rose-950/40 p-8 text-rose-100">{error}</div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-slate-700 bg-slate-950 p-10 text-center text-slate-400">
          No tienes pedidos registrados todavía. <Link href="/" className="text-cyan-300 hover:text-cyan-100">Explora la tienda</Link>.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-400">Referencia</p>
                  <p className="text-lg font-semibold text-white">{order.reference || order.id}</p>
                </div>
                <div className="space-y-1 text-sm text-slate-400">
                  <p>Estado: <span className="text-white">{order.paymentStatus}</span></p>
                  <p>Total: <span className="text-white">${formatCurrency(order.totals?.total)}</span></p>
                  <p>{formatDate(order.createdAt)}</p>
                </div>
                <Link href={`/pedido/${order.id}`} className="rounded-full bg-cyan-500 px-5 py-3 text-slate-950 font-semibold hover:bg-cyan-400 transition">
                  Ver detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
