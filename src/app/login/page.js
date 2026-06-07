"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, signIn, authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace('/admin');
    }
  }, [loading, user, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    if (!email.trim() || !password.trim()) {
      setFormError('Ingresa correo y contraseña para continuar.');
      return;
    }

    setSubmitting(true);

    try {
      await signIn(email.trim(), password);
      router.push('/admin');
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <h1 className="text-3xl font-black mb-2">Ingreso administrativo</h1>
        <p className="text-sm text-slate-400 mb-6">Accede al panel de administración con tu usuario de Firebase Auth.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="text-sm font-semibold text-slate-300">Correo</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-2xl bg-slate-950 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
              placeholder="admin@teklan.com"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-300">Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl bg-slate-950 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
              placeholder="********"
            />
          </label>

          {(formError || authError) && (
            <div className="rounded-2xl border border-rose-600 bg-rose-950/50 px-4 py-3 text-sm text-rose-100">
              {formError || authError}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-cyan-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-60"
          >
            {submitting ? 'Ingresando...' : 'Entrar al panel'}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500">
          Si no tienes credenciales, crea un usuario en Firebase Auth o pide acceso al administrador.
        </p>

        <Link href="/" className="mt-4 inline-block text-sm text-cyan-300 hover:text-cyan-100">
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
}
