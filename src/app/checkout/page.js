'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import CheckoutSummary from '@/components/CheckoutSummary';
import { calculateOrderTotals, PAYMENT_METHODS } from '@/services/orderService';
import { formatCurrency } from '@/lib/format';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { items, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: PAYMENT_METHODS.CASH,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user?.email) {
      setFormData((current) => (current.email ? current : { ...current, email: user.email }));
    }
  }, [user?.email]);

  const totals = useMemo(() => calculateOrderTotals(items), [items]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (items.length === 0) {
      setError('Agrega productos al carrito antes de continuar.');
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.city.trim() || !formData.postalCode.trim()) {
      setError('Completa todos los campos de envío para continuar.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.uid || null,
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
          },
          items,
          paymentMethod: formData.paymentMethod,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'No pudimos crear tu orden. Intenta de nuevo.');
        return;
      }

      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
        return;
      }

      clearCart();
      router.push(`/checkout/success?orderId=${result.orderId}`);
    } catch (submitError) {
      console.error('Error enviando orden:', submitError);
      setError('No pudimos procesar la orden. Intenta más tarde.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-20">
        <div className="rounded-3xl border border-slate-700 bg-slate-900 px-8 py-6 text-slate-300">Verificando sesión...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-700 bg-slate-950 p-8">
          <h1 className="text-4xl font-black mb-4">Checkout</h1>
          <p className="text-slate-400 mb-8">Completa tus datos y elige la forma de pago para finalizar tu compra.</p>

          <div className="grid gap-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-300">Nombre completo</span>
              <input
                type="text"
                value={formData.name}
                onChange={handleChange('name')}
                className="mt-2 w-full rounded-2xl bg-slate-900 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
                placeholder="Nombre y apellido"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-300">Correo electrónico</span>
              <input
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                className="mt-2 w-full rounded-2xl bg-slate-900 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
                placeholder="correo@dominio.com"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-slate-300">Teléfono</span>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange('phone')}
                  className="mt-2 w-full rounded-2xl bg-slate-900 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
                  placeholder="3001234567"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-300">Ciudad</span>
                <input
                  type="text"
                  value={formData.city}
                  onChange={handleChange('city')}
                  className="mt-2 w-full rounded-2xl bg-slate-900 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
                  placeholder="Bogotá"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-semibold text-slate-300">Dirección</span>
              <input
                type="text"
                value={formData.address}
                onChange={handleChange('address')}
                className="mt-2 w-full rounded-2xl bg-slate-900 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
                placeholder="Calle 123 #45-67"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-300">Código postal</span>
              <input
                type="text"
                value={formData.postalCode}
                onChange={handleChange('postalCode')}
                className="mt-2 w-full rounded-2xl bg-slate-900 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
                placeholder="110111"
              />
            </label>

            <div>
              <span className="text-sm font-semibold text-slate-300">Forma de pago</span>
              <div className="mt-4 space-y-3">
                {[
                  {
                    id: PAYMENT_METHODS.PSE,
                    label: 'PSE',
                    description: 'Transferencia bancaria en línea',
                    icon: '🏦',
                  },
                  {
                    id: PAYMENT_METHODS.CARD,
                    label: 'Tarjeta de crédito/débito',
                    description: 'Visa, Mastercard, American Express',
                    icon: '💳',
                  },
                  {
                    id: PAYMENT_METHODS.CASH,
                    label: 'Pago de contado',
                    description: 'Coordinamos la forma de pago',
                    icon: '💰',
                  },
                ].map((method) => (
                  <label key={method.id} className="block cursor-pointer">
                    <div
                      className={`rounded-2xl border-2 p-4 transition ${
                        formData.paymentMethod === method.id
                          ? 'border-cyan-400 bg-cyan-950/30'
                          : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={handleChange('paymentMethod')}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{method.icon}</span>
                            <span className="font-semibold text-white">{method.label}</span>
                          </div>
                          <p className="mt-1 text-xs text-slate-400">{method.description}</p>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {formData.paymentMethod === PAYMENT_METHODS.PSE && (
              <div className="rounded-2xl border border-cyan-700 bg-cyan-950/40 p-4 text-cyan-100 text-sm">
                <p className="font-semibold">PSE - Transferencia Bancaria</p>
                <p className="mt-2">Se abrirá tu banco para confirmar la transferencia. Completamente seguro y verificado.</p>
              </div>
            )}

            {formData.paymentMethod === PAYMENT_METHODS.CARD && (
              <div className="rounded-2xl border border-cyan-700 bg-cyan-950/40 p-4 text-cyan-100 text-sm">
                <p className="font-semibold">Tarjeta de crédito/débito</p>
                <p className="mt-2">Acepta Visa, Mastercard y American Express. El pago se procesa mediante ePayco de forma segura.</p>
              </div>
            )}

            {formData.paymentMethod === PAYMENT_METHODS.CASH && (
              <div className="rounded-2xl border border-emerald-700 bg-emerald-950/40 p-4 text-emerald-100 text-sm">
                <p className="font-semibold">Pago de contado</p>
                <p className="mt-2">Coordinaremos contigo para definir la forma y lugar de pago. Nuestro equipo te contactará.</p>
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-rose-600 bg-rose-950/50 px-4 py-3 text-sm text-rose-100">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="rounded-2xl border border-emerald-600 bg-emerald-950/50 px-4 py-3 text-sm text-emerald-100">
                {successMessage}
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full rounded-full bg-cyan-500 px-5 py-4 text-lg font-bold text-slate-950 hover:bg-cyan-400 transition disabled:opacity-60"
            >
              {submitting ? 'Procesando orden...' : 'Confirmar pedido'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <CheckoutSummary items={items} totals={totals} />

          <div className="rounded-3xl border border-slate-700 bg-slate-950 p-6 text-slate-400">
            <p className="font-semibold text-white">Consejos para compras escalables</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>- Revisa tu carrito antes de confirmar.</li>
              <li>- Usa datos reales para que el envío llegue sin contratiempos.</li>
              <li>- Si eliges pago con ePayco, completa los datos según la plataforma.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
