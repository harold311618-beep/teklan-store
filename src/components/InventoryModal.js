"use client";

import { useState } from 'react';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function InventoryModal({ product, onClose, onSuccess }) {
  const [formData, setFormData] = useState(product || {
    Nombre: '',
    Marca: '',
    Precio: '',
    stock: '',
    procesador: '',
    ram: '',
    almacenamiento: '',
    camara: '',
    imagenUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleChange = (field) => (event) => {
    setFormData((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (product?.id) {
        // Actualizar producto existente
        await updateDoc(doc(db, 'Productos', product.id), formData);
      } else {
        // Crear nuevo producto
        await addDoc(collection(db, 'Productos'), formData);
      }

      onSuccess();
      onClose();
    } catch (submitError) {
      console.error('Error guardando producto:', submitError);
      setError('No pudimos guardar el producto. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!product?.id) return;

    setLoading(true);
    setError('');

    try {
      await deleteDoc(doc(db, 'Productos', product.id));
      onSuccess();
      onClose();
    } catch (deleteError) {
      console.error('Error eliminando producto:', deleteError);
      setError('No pudimos eliminar el producto. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 border-b border-slate-700 bg-slate-900 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-black text-white">
            {product ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-700 px-3 py-2 text-slate-300 hover:bg-slate-800"
          >
            Cerrar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-300">Nombre</span>
              <input
                type="text"
                value={formData.Nombre}
                onChange={handleChange('Nombre')}
                className="mt-2 w-full rounded-2xl bg-slate-950 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
                placeholder="iPhone 17 Pro"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-300">Marca</span>
              <input
                type="text"
                value={formData.Marca}
                onChange={handleChange('Marca')}
                className="mt-2 w-full rounded-2xl bg-slate-950 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
                placeholder="Apple"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-300">Precio</span>
              <input
                type="number"
                value={formData.Precio}
                onChange={handleChange('Precio')}
                className="mt-2 w-full rounded-2xl bg-slate-950 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
                placeholder="3500000"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-300">URL de imagen</span>
              <input
                type="text"
                value={formData.imagenUrl}
                onChange={handleChange('imagenUrl')}
                className="mt-2 w-full rounded-2xl bg-slate-950 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
                placeholder="https://..."
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-300">Stock</span>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange('stock')}
                className="mt-2 w-full rounded-2xl bg-slate-950 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
                placeholder="10"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-300">Procesador</span>
              <input
                type="text"
                value={formData.procesador}
                onChange={handleChange('procesador')}
                className="mt-2 w-full rounded-2xl bg-slate-950 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
                placeholder="A18 Pro"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-300">RAM</span>
              <input
                type="text"
                value={formData.ram}
                onChange={handleChange('ram')}
                className="mt-2 w-full rounded-2xl bg-slate-950 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
                placeholder="8GB"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-300">Almacenamiento</span>
              <input
                type="text"
                value={formData.almacenamiento}
                onChange={handleChange('almacenamiento')}
                className="mt-2 w-full rounded-2xl bg-slate-950 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
                placeholder="256GB"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-300">Cámara</span>
              <input
                type="text"
                value={formData.camara}
                onChange={handleChange('camara')}
                className="mt-2 w-full rounded-2xl bg-slate-950 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
                placeholder="48MP + 12MP"
              />
            </label>
          </div>

          {error && (
            <div className="rounded-2xl border border-rose-600 bg-rose-950/50 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 pt-6 sm:flex-row sm:justify-end">
            {product && (
              <button
                type="button"
                onClick={() => setDeleteConfirm(!deleteConfirm)}
                className="rounded-2xl border border-rose-600 px-5 py-3 text-sm font-semibold text-rose-300 hover:bg-rose-950/50 transition"
              >
                {deleteConfirm ? 'Confirmar eliminación' : 'Eliminar producto'}
              </button>
            )}
            {deleteConfirm && product && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-bold text-white hover:bg-rose-700 disabled:opacity-60 transition"
              >
                {loading ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-60 transition"
            >
              {loading ? 'Guardando...' : product ? 'Actualizar' : 'Crear producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
