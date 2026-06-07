"use client";

import { useEffect, useMemo, useState } from 'react';
import { db } from '../../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from "framer-motion";
import Image from 'next/image';

const formatCurrency = (value) => {
  const price = Number(value);
  return Number.isFinite(price) ? price.toLocaleString('es-CO') : "0";
};

export default function ProductDetailClient({ productId }) {
  const normalizedProductId = useMemo(() => {
    if (!productId) return "";
    return Array.isArray(productId) ? productId[0] : String(productId);
  }, [productId]);

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!normalizedProductId) return;

    let isMounted = true;

    const fetchProducto = async () => {
      setLoading(true);
      setError("");

      try {
        const docRef = doc(db, "Productos", normalizedProductId);
        const docSnap = await getDoc(docRef);

        if (!isMounted) return;

        if (docSnap.exists()) {
          setProducto({ ...docSnap.data(), id: docSnap.id });
        } else {
          setProducto(null);
          setError("Este producto no existe o ya no está disponible.");
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("Error al obtener producto: ", error);
        setProducto(null);
        setError("No pudimos cargar este producto. Intenta de nuevo más tarde.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducto();

    return () => {
      isMounted = false;
    };
  }, [normalizedProductId]);

  if (!normalizedProductId) {
    return <p className="text-center mt-20 text-red-300">No recibimos el identificador del producto.</p>;
  }

  if (loading) {
    return <p className="text-center mt-20 text-slate-400">Cargando producto...</p>;
  }

  if (error) {
    return <p className="text-center mt-20 text-red-300">{error}</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8 text-white">
      <div className="grid md:grid-cols-2 gap-16 items-start">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-800 shadow-2xl border border-slate-700">
            {producto.imagenUrl ? (
              <Image
                src={producto.imagenUrl}
                alt={producto.Nombre || "Producto Teklan"}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                Sin imagen disponible
              </div>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-5xl font-black mb-4">{producto.Nombre || "Producto Teklan"}</h1>
          <p className="text-4xl text-cyan-400 font-bold mb-6">${formatCurrency(producto.Precio)}</p>

          <div className="bg-slate-800 p-6 rounded-2xl mb-8">
            <h3 className="text-xl font-bold mb-4 border-b border-slate-600 pb-2">Especificaciones Técnicas</h3>
            <ul className="space-y-2 text-slate-300">
              <li><strong>Procesador:</strong> {producto.procesador || "Consultar en tienda"}</li>
              <li><strong>Memoria:</strong> {producto.ram || "N/A"}</li>
              <li><strong>Almacenamiento:</strong> {producto.almacenamiento || "N/A"}</li>
              <li><strong>Cámara:</strong> {producto.camara || "N/A"}</li>
            </ul>
          </div>

          <button className="bg-cyan-500 text-slate-900 px-10 py-4 rounded-full font-bold text-lg w-full hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20">
            Solicitar Crédito Teklan
          </button>
        </motion.div>
      </div>

      <section className="mt-20 border-t border-slate-800 pt-12">
        <h2 className="text-3xl font-bold mb-8 text-center">¿Por qué elegir Teklan?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { t: "Crédito Directo", d: "Sin cuotas iniciales pesadas y aprobación rápida." },
            { t: "Garantía Original", d: "Todos nuestros dispositivos cuentan con garantía oficial." },
            { t: "Envío Asegurado", d: "Tu compra llega a tu casa totalmente protegida." },
          ].map((item, i) => (
            <div key={i} className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
              <h4 className="font-bold text-cyan-400 mb-2">{item.t}</h4>
              <p className="text-slate-400 text-sm">{item.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
