export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Banner Producto Estrella */}
  <section className="my-10 relative rounded-3xl overflow-hidden h-[400px] flex items-center bg-gradient-to-r from-slate-800 to-cyan-900">
  <div className="p-12 md:w-1/2">
    <h2 className="text-5xl font-black mb-4">iPhone 17 Pro</h2>
    <p className="text-lg mb-6 text-slate-300">La nueva era de la potencia. Disponible hoy con crédito directo.</p>
    <button className="bg-cyan-500 text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-cyan-400 transition">
      Comprar ahora
    </button>
  </div>
  {/* Imagen del producto */}
  <div className="hidden md:block md:w-1/2 h-full relative">
     <img 
        src="/iphone17pro.png" 
        alt="iPhone 17 Pro" 
        className="object-contain h-full w-full p-4"
     />
  </div>
</section>

      {/* Catálogo */}
      <section className="my-16">
        <h3 className="text-3xl font-bold mb-8">Catálogo de Novedades</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
              <div className="h-48 bg-slate-700 rounded-lg mb-4"></div>
              <h4 className="font-bold text-lg">Smartphone {item}</h4>
              <p className="text-cyan-400 font-bold mt-2">$0.000.000</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}