export default function CheckoutFailPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-3xl rounded-3xl border border-rose-700 bg-slate-900 p-10 text-center">
        <h1 className="text-4xl font-black text-rose-400 mb-4">Pago no procesado</h1>
        <p className="text-slate-400 mb-6">Hubo un problema al procesar tu pago. Intenta nuevamente o contacta soporte.</p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a href="/checkout" className="rounded-full bg-cyan-500 px-6 py-3 font-bold text-slate-950 hover:bg-cyan-400 transition">
            Volver al checkout
          </a>
          <a href="/" className="rounded-full border border-slate-700 px-6 py-3 text-slate-100 hover:bg-slate-800 transition">
            Volver a la tienda
          </a>
        </div>
      </div>
    </div>
  );
}
