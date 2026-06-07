'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchOrderById } from '@/services/firestoreRepository';
import { formatCurrency, formatDate } from '@/lib/format';
import Link from 'next/link';

export default function PedidoDetallePage({ params }) {
  const { id } = params;
  const { user, isAdmin, loading } = useAuth();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loadingOrder, setLoadingOrder] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    setLoadingOrder(true);
    setError('');

    fetchOrderById(id)
      .then((foundOrder) => {
        if (!foundOrder) {
          setError('No encontramos esta orden.');
          return;
        }
        if (!isAdmin && foundOrder.userId && user?.uid !== foundOrder.userId) {
          setError('No tienes permiso para ver esta orden.');
          return;
        }
        setOrder(foundOrder);
      })
      .catch((fetchError) => {
        console.error('Error cargando orden:', fetchError);
        setError('No pudimos cargar la orden. Intenta de nuevo.');
      })
      .finally(() => setLoadingOrder(false));
  }, [id, user, isAdmin]);

  if (loading || loadingOrder) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-20">
        <div className="rounded-3xl border border-slate-700 bg-slate-900 px-8 py-6 text-slate-300">Cargando orden...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-20">
        <div className="rounded-3xl border border-rose-700 bg-slate-900 p-10 text-center max-w-xl">
          <p className="text-rose-300 mb-4">{error || 'Orden no encontrada.'}</p>
          <button onClick={() => router.push('/mis-pedidos')} className="rounded-full bg-cyan-500 px-6 py-3 text-slate-950 font-bold hover:bg-cyan-400 transition">
            Volver a mis pedidos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-black text-white">Orden #{order.reference || order.id}</h1>
          <p className="text-slate-400 mt-2">Estado: <span className="font-semibold text-cyan-300">{order.paymentStatus}</span></p>
        </div>
        <Link href="/mis-pedidos" className="rounded-full border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-900 transition">
          Volver a mis pedidos
        </Link>
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.9fr_0.6fr]">
        <div className="rounded-3xl border border-slate-700 bg-slate-950 p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Productos</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-slate-400 text-sm">Cantidad: {item.quantity}</p>
                  </div>
                  <p className="text-cyan-300 font-bold">${formatCurrency(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Detalles de envío</h2>
            <p className="text-slate-300"><strong>Nombre:</strong> {order.customer.name}</p>
            <p className="text-slate-300"><strong>Email:</strong> {order.customer.email}</p>
            <p className="text-slate-300"><strong>Teléfono:</strong> {order.customer.phone}</p>
            <p className="text-slate-300"><strong>Dirección:</strong> {order.customer.address}</p>
            <p className="text-slate-300"><strong>Ciudad:</strong> {order.customer.city}</p>
            <p className="text-slate-300"><strong>Código postal:</strong> {order.customer.postalCode}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-700 bg-slate-950 p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Resumen</h2>
            <div className="space-y-3 text-slate-300 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${formatCurrency(order.totals?.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Impuestos</span>
                <span>${formatCurrency(order.totals?.tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span>${formatCurrency(order.totals?.shipping)}</span>
              </div>
              <div className="border-t border-slate-700 pt-3 flex justify-between text-lg font-bold text-white">
                <span>Total</span>
                <span>${formatCurrency(order.totals?.total)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-950 p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Pago</h2>
            <p className="text-slate-300">Método: <span className="text-white">{order.paymentMethod}</span></p>
            <p className="text-slate-300">Gateway: <span className="text-white">{order.paymentGateway}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
