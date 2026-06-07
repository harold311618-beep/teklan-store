"use client"; // Necesario para componentes interactivos
import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { db } from '../lib/firebase'; // Importamos tu conexión a DB
import { collection, getDocs } from 'firebase/firestore';

export default function Home() {
  const [productos, setProductos] = useState([]);

  // Efecto para traer los productos de Firebase al cargar
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        // OJO: Si tu colección en Firebase se llama "Productos" con P mayúscula, cámbialo aquí abajo.
        const querySnapshot = await getDocs(collection(db, "productos"));
        const listaProductos = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log("Productos encontrados:", listaProductos); // <-- Esto te mostrará en la consola si están llegando los datos
        setProductos(listaProductos);
      } catch (error) {
        console.error("Error al obtener productos: ", error);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Banner Producto Estrella */}
      <section className="my-10 relative rounded-3xl overflow-hidden h-[400px] flex items-center bg-gradient-to-r from-slate-800 to-cyan-950">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="p-12 md:w-1/2 z-10"
        >
          <h2 className="text-5xl font-black mb-4">iPhone 17 Pro</h2>
          <p className="text-lg mb-6 text-slate-300">La nueva era de la potencia. Disponible hoy con nuestro crédito directo Teklan.</p>
          <button className="bg-cyan-500 text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/20">
            Solicitar Crédito
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="hidden md:block md:w-1/2 h-full relative"
        >
          <img 
            src="https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/iphone-17-pro-17-pro-max-hero.png" 
            alt="iPhone 17 Pro" 
            className="object-contain h-full w-full p-4 drop-shadow-2xl"
          />
        </motion.div>
      </section>

      {/* Catálogo de Productos (Dinámico) */}
      <section className="my-16">
        <h3 className="text-3xl font-bold mb-8">Novedades en Stock</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {productos.length === 0 ? (
            <p className="text-slate-400 col-span-3 text-center py-10">Buscando productos en inventario...</p>
          ) : (
            productos.map((producto) => (
              <div key={producto.id} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-cyan-500 transition-all duration-300">
                <div className="h-48 bg-slate-700 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                  <span className="text-slate-500">Imagen de {producto.Nombre || "Producto"}</span>
                </div>
                <h4 className="font-bold text-lg">{producto.Nombre || "Sin nombre"}</h4>
                <p className="text-cyan-400 font-bold mt-2">
                  {/* Convertimos el precio a número por seguridad antes de formatearlo */}
                  ${producto.Precio ? Number(producto.Precio).toLocaleString('es-CO') : "0"}
                </p>
                <button className="mt-4 w-full border border-slate-600 py-2 rounded-lg hover:bg-slate-700 transition">
                  Ver detalles
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}