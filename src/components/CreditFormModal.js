"use client";

import { useMemo, useState } from 'react';

const initialFormState = {
  nombre: '',
  telefono: '',
  correo: '',
  horario: '',
};

export default function CreditFormModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  const valid = useMemo(() => {
    return Boolean(form.nombre.trim() && form.telefono.trim() && form.correo.trim());
  }, [form.nombre, form.telefono, form.correo]);

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!form.nombre.trim()) nextErrors.nombre = 'Por favor ingresa tu nombre.';
    if (!form.telefono.trim()) nextErrors.telefono = 'Por favor ingresa tu teléfono.';
    if (!form.correo.trim()) nextErrors.correo = 'Por favor ingresa tu correo.';
    if (form.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) {
      nextErrors.correo = 'Ingresa un correo válido.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({ ...form });
    setForm(initialFormState);
    setErrors({});
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
      <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
          <div>
            <h2 className="text-2xl font-black text-white">Solicitud de crédito directo</h2>
            <p className="text-sm text-slate-400">Completa tus datos y un asesor se comunicará contigo.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-700 px-3 py-2 text-slate-300 hover:bg-slate-800"
          >
            Cerrar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
          <label className="block">
            <span className="text-sm font-semibold text-slate-300">Nombre completo</span>
            <input
              type="text"
              value={form.nombre}
              onChange={handleChange('nombre')}
              className="mt-2 w-full rounded-2xl bg-slate-950 border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
            {errors.nombre && <p className="mt-2 text-sm text-rose-400">{errors.nombre}</p>}
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-300">Teléfono</span>
            <input
              type="tel"
              value={form.telefono}
              onChange={handleChange('telefono')}
              className="mt-2 w-full rounded-2xl bg-slate-950 border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-400"
              placeholder="Ej: 3121234567"
            />
            {errors.telefono && <p className="mt-2 text-sm text-rose-400">{errors.telefono}</p>}
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-300">Correo electrónico</span>
            <input
              type="email"
              value={form.correo}
              onChange={handleChange('correo')}
              className="mt-2 w-full rounded-2xl bg-slate-950 border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-400"
              placeholder="ejemplo@correo.com"
            />
            {errors.correo && <p className="mt-2 text-sm text-rose-400">{errors.correo}</p>}
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-300">Horario de contacto (opcional)</span>
            <input
              type="text"
              value={form.horario}
              onChange={handleChange('horario')}
              className="mt-2 w-full rounded-2xl bg-slate-950 border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-400"
              placeholder="Ej: Mañana, después de las 3 PM"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!valid}
            >
              Enviar solicitud
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
