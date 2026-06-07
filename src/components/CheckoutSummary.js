import Link from 'next/link';
import { formatCurrency } from '@/lib/format';

export default function CheckoutSummary({ items, totals }) {
  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-950 p-6">
      <h2 className="text-2xl font-bold text-white">Resumen de tu compra</h2>
      <p className="mt-2 text-slate-400">Revisa los productos, impuestos y envío antes de confirmar.</p>

      {items.length === 0 ? (
        <div className="mt-8 text-slate-400">
          Tu carrito está vacío. <Link href="/" className="text-cyan-300 hover:text-cyan-100">Ver productos</Link>.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="text-slate-400 text-sm">Cantidad: {item.quantity}</p>
                </div>
                <p className="text-cyan-300 font-bold">${formatCurrency(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Impuestos</span>
                <span>${formatCurrency(totals.tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span>${formatCurrency(totals.shipping)}</span>
              </div>
              <div className="border-t border-slate-700 pt-3 flex justify-between text-lg font-bold text-white">
                <span>Total</span>
                <span>${formatCurrency(totals.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
