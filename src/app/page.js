"use client";

import { useEffect, useMemo, useState } from 'react';
import { motion } from "framer-motion";
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';

const formatCurrency = (value) => {
  const price = Number(value);
  return Number.isFinite(price) ? price.toLocaleString('es-CO') : "0";
};

const getProductHref = (productId) => `/producto/${encodeURIComponent(productId)}`;

const getProductPrice = (producto) => {
  const price = Number(producto.Precio);
  return Number.isFinite(price) ? price : 0;
};

const getProductBrand = (producto) => {
  return producto.Marca || producto.marca || producto.Brand || producto.brand || "";
};

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Productos"));
        const listaProductos = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setProductos(listaProductos);
      } catch (error) {
        console.error("Error al obtener productos: ", error);
        setError("No pudimos cargar el inventario. Intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const marcas = useMemo(() => {
    const brandSet = new Set();

    productos.forEach((producto) => {
      const brand = getProductBrand(producto).trim();
      if (brand) brandSet.add(brand);
    });

    return Array.from(brandSet).sort((a, b) => a.localeCompare(b, 'es'));
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    const maxPriceNumber = Number(maxPrice);
    const hasMaxPrice = maxPrice !== "" && Number.isFinite(maxPriceNumber);

    const filtered = productos.filter((producto) => {
      const name = String(producto.Nombre || "").toLowerCase();
      const brand = String(getProductBrand(producto)).toLowerCase();
      const price = getProductPrice(producto);

      const matchesSearch = !searchTerm || name.includes(searchTerm) || brand.includes(searchTerm);
      const matchesBrand = !selectedBrand || brand === selectedBrand.toLowerCase();
      const matchesPrice = !hasMaxPrice || price <= maxPriceNumber;

      return matchesSearch && matchesBrand && matchesPrice;
    });

    if (sortOrder === "price-desc") {
      return [...filtered].sort((a, b) => getProductPrice(b) - getProductPrice(a));
    }

    if (sortOrder === "price-asc") {
      return [...filtered].sort((a, b) => getProductPrice(a) - getProductPrice(b));
    }

    return filtered;
  }, [maxPrice, productos, search, selectedBrand, sortOrder]);

  return (
    <div className="max-w-6xl mx-auto px-4">
      <section className="my-10 relative rounded-3xl overflow-hidden min-h-[460px] md:h-[400px] flex items-start md:items-center bg-gradient-to-r from-slate-800 to-cyan-950">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="p-8 pt-10 md:p-12 md:w-1/2 z-10"
        >
          <h2 className="text-5xl font-black mb-4">iPhone 17 Pro</h2>
          <p className="text-lg mb-6 text-slate-300">
            La nueva era de la potencia. Disponible hoy con nuestro crédito directo Teklan.
          </p>
          <button className="bg-cyan-500 text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/20">
            Solicitar Crédito
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute bottom-0 right-0 h-52 w-full opacity-70 md:opacity-100 md:relative md:block md:w-1/2 md:h-full"
        >
          <Image
            src="https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/iphone-17-pro-17-pro-max-hero.png"
            alt="iPhone 17 Pro"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-4 drop-shadow-2xl"
          />
        </motion.div>
      </section>

      <section className="my-16">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h3 className="text-3xl font-bold">Novedades en Stock</h3>
          <button
            type="button"
            onClick={() => setFiltersOpen((isOpen) => !isOpen)}
            aria-expanded={filtersOpen}
            className="w-full md:w-auto rounded-lg border border-slate-600 px-4 py-2 font-semibold text-slate-100 hover:bg-slate-800 transition"
          >
            {filtersOpen ? "Ocultar filtros" : "Mostrar filtros"}
          </button>
        </div>

        {filtersOpen && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-800/60 border border-slate-700 rounded-2xl p-4">
            <label className="block">
              <span className="block text-sm font-semibold text-slate-300 mb-2">Buscar</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Nombre o marca"
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-slate-100 outline-none focus:border-cyan-400"
              />
            </label>

            <label className="block">
              <span className="block text-sm font-semibold text-slate-300 mb-2">Marca</span>
              <select
                value={selectedBrand}
                onChange={(event) => setSelectedBrand(event.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-slate-100 outline-none focus:border-cyan-400"
              >
                <option value="">Todas</option>
                {marcas.map((marca) => (
                  <option key={marca} value={marca}>{marca}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="block text-sm font-semibold text-slate-300 mb-2">Precio máximo</span>
              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                placeholder="Ej: 3000000"
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-slate-100 outline-none focus:border-cyan-400"
              />
            </label>

            <label className="block">
              <span className="block text-sm font-semibold text-slate-300 mb-2">Ordenar</span>
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-slate-100 outline-none focus:border-cyan-400"
              >
                <option value="default">Recientes</option>
                <option value="price-desc">Mayor a menor</option>
                <option value="price-asc">Menor a mayor</option>
              </select>
            </label>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-slate-400 col-span-3 text-center py-10">Buscando productos en inventario...</p>
          ) : error ? (
            <p className="text-red-300 col-span-3 text-center py-10">{error}</p>
          ) : productosFiltrados.length === 0 ? (
            <p className="text-slate-400 col-span-3 text-center py-10">No encontramos productos con esos filtros.</p>
          ) : (
            productosFiltrados.map((producto) => (
              <div key={producto.id} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-cyan-500 transition-all duration-300">
                <div className="h-48 bg-slate-700 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative">
                  {producto.imagenUrl ? (
                    <Image
                      src={producto.imagenUrl}
                      alt={producto.Nombre || "Producto Teklan"}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <span className="text-slate-500">Sin imagen disponible</span>
                  )}
                </div>

                <h4 className="font-bold text-lg">{producto.Nombre || "Sin nombre"}</h4>
                <p className="text-cyan-400 font-bold mt-2">
                  ${formatCurrency(producto.Precio)}
                </p>
                <Link
                  href={getProductHref(producto.id)}
                  className="mt-4 block w-full border border-slate-600 py-2 rounded-lg hover:bg-slate-700 transition text-center"
                >
                  Ver detalles
                </Link>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
