'use client';

import { use } from 'react';
import Link from 'next/link';

export default function CheckoutResponsePage({ searchParams: searchParamsPromise }) {
  // En Next.js 15 / React 19, searchParams es una promesa que debe desempaquetarse con use()
  const searchParams = use(searchParamsPromise);

  const status = (searchParams?.x_response || searchParams?.estado_pol || searchParams?.status || '').toString().toLowerCase();
  const reference = searchParams?.x_ref_payco || searchParams?.ref_payco || searchParams?.reference || searchParams?.invoice || '';
  const isAccepted = status === 'aceptada' || status === 'approved' || status === 'pagado';
  const isRejected = status === 'rechazada' || status === 'rejected';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-700 bg-slate-900 p-10 text-center">
        <h1 className="text-4xl font-black mb-4 text-white">
          {isAccepted ? 'Pago recibido' : isRejected ? 'Pago rechazado' : 'Estado de pago pendiente'}
        </h1>
        <p className="text-slate-400 mb-4">
          {isAccepted
            ? 'Tu pago fue procesado correctamente. Si todo está bien, tu orden quedará actualizada en el sistema.'
            : isRejected
            ? 'No se pudo procesar el pago. Verifica los datos o intenta con otro medio de pago.'
            : 'Estamos procesando la información del pago. Si este es un retorno de ePayco, revisa tu orden en unos minutos.'}
        </p>
        {reference && (
          <p className="rounded-2xl bg-slate-950 border border-slate-700 px-4 py-3 text-slate-200">
            Referencia de pago: <strong>{reference}</strong>
          </p>
        )}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/mis-pedidos" className="rounded-full bg-cyan-500 px-6 py-3 font-bold text-slate-950 hover:bg-cyan-400 transition">
            Ver mis pedidos
          </Link>
          <Link href="/" className="rounded-full border border-slate-700 px-6 py-3 text-slate-100 hover:bg-slate-800 transition">
            Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
}
