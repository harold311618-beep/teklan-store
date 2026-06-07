import Link from 'next/link';

export default function CheckoutSuccessPage({ searchParams }) {
  const orderId = searchParams?.orderId || '';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-700 bg-slate-900 p-10 text-center">
        <h1 className="text-4xl font-black text-cyan-300 mb-4">¡Pago confirmado!</h1>
        <p className="text-slate-400 mb-6">Gracias por tu compra. Tu orden se ha registrado correctamente.</p>
        {orderId && (
          <p className="rounded-2xl bg-slate-950 border border-slate-700 px-4 py-3 text-slate-200">
            Número de orden: <strong>{orderId}</strong>
          </p>
        )}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/" className="rounded-full bg-cyan-500 px-6 py-3 font-bold text-slate-950 hover:bg-cyan-400 transition">
            Volver a la tienda
          </Link>
          {orderId && (
            <Link href={`/pedido/${orderId}`} className="rounded-full border border-slate-700 px-6 py-3 text-slate-100 hover:bg-slate-800 transition">
              Ver orden
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
