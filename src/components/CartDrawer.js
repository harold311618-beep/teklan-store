"use client";

import { useState } from 'react';
import { useCart } from '@/context/CartContext';

const formatCurrency = (value) => {
  const price = Number(value);
  return Number.isFinite(price) ? price.toLocaleString('es-CO') : "0";
};

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    items,
    total,
    totalItems,
    increaseItem,
    decreaseItem,
    removeItem,
    clearCart,
  } = useCart();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="relative rounded-lg border border-slate-600 px-3 py-2 font-semibold hover:bg-slate-800 transition"
      >
        Carrito
        {totalItems > 0 && (
          <span className="ml-2 rounded-full bg-cyan-400 px-2 py-0.5 text-xs font-black text-slate-950">
            {totalItems}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-[min(92vw,380px)] rounded-xl border border-slate-700 bg-slate-900 p-4 shadow-2xl">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold">Pago de contado</h2>
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-sm text-slate-400 hover:text-red-300"
              >
                Vaciar
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">Tu carrito esta vacio.</p>
          ) : (
            <div className="space-y-4">
              <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold leading-snug">{item.name}</h3>
                        <p className="mt-1 text-sm text-cyan-300">${formatCurrency(item.price)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-slate-500 hover:text-red-300"
                      >
                        Eliminar
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center rounded-lg border border-slate-700">
                        <button
                          type="button"
                          onClick={() => decreaseItem(item.id)}
                          className="h-9 w-9 hover:bg-slate-800"
                        >
                          -
                        </button>
                        <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => increaseItem(item.id)}
                          className="h-9 w-9 hover:bg-slate-800"
                        >
                          +
                        </button>
                      </div>
                      <p className="font-bold">${formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-700 pt-4">
                <div className="flex items-center justify-between text-lg font-black">
                  <span>Total contado</span>
                  <span className="text-cyan-300">${formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
