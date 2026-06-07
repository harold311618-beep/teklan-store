"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AuthPage() {
  const router = useRouter();
  const { user, loading, signIn, signUp, authError, logOut } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!loading && user) {
      setSuccessMessage('Ya has iniciado sesión. Puedes seguir comprando o cerrar sesión si deseas.');
    }
  }, [loading, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!email.trim() || !password.trim()) {
      setFormError('Ingresa correo y contraseña para continuar.');
      return;
    }

    if (mode === 'register' && password !== confirmPassword) {
      setFormError('Las contraseñas no coinciden.');
      return;
    }

    setSubmitting(true);

    try {
      if (mode === 'login') {
        await signIn(email.trim(), password);
        router.push('/');
      } else {
        await signUp(email.trim(), password);
        setSuccessMessage('Cuenta creada correctamente. Ahora puedes iniciar sesión.');
        setMode('login');
      }
    } catch {
      // authError se muestra desde el contexto
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logOut();
    setSuccessMessage('Has cerrado sesión correctamente.');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-12">
        <div className="rounded-3xl border border-slate-700 bg-slate-900 px-8 py-6 text-slate-300">Verificando sesión...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black">Mi Cuenta</h1>
            <p className="text-sm text-slate-400">Inicia sesión o regístrate para comprar y guardar tu sesión.</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${mode === 'login' ? 'bg-cyan-500 text-slate-950' : 'border border-slate-700 text-slate-300 hover:bg-slate-800'}`}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${mode === 'register' ? 'bg-cyan-500 text-slate-950' : 'border border-slate-700 text-slate-300 hover:bg-slate-800'}`}
            >
              Registrarse
            </button>
          </div>
        </div>

        {user ? (
          <div className="rounded-3xl border border-cyan-700 bg-cyan-950/40 p-6 mb-6">
            <p className="text-slate-100 font-semibold">Sesión activa como:</p>
            <p className="mt-2 text-cyan-200 break-all">{user.email}</p>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-6 rounded-full bg-cyan-500 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-400 transition"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="text-sm font-semibold text-slate-300">Correo electrónico</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-2xl bg-slate-950 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
                placeholder="ejemplo@correo.com"
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

            {mode === 'register' && (
              <label className="block">
                <span className="text-sm font-semibold text-slate-300">Confirmar contraseña</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="mt-2 w-full rounded-2xl bg-slate-950 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
                  placeholder="********"
                />
              </label>
            )}

            {(formError || authError || successMessage) && (
              <div className={`rounded-2xl px-4 py-3 text-sm ${successMessage ? 'bg-emerald-950 border border-emerald-700 text-emerald-100' : 'bg-rose-950 border border-rose-600 text-rose-100'}`}>
                {formError || authError || successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-cyan-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-60"
            >
              {submitting ? 'Procesando...' : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
            </button>
          </form>
        )}

        <p className="mt-6 text-sm text-slate-500">
          ¿Tienes dudas? Visita la tienda o contáctanos para soporte.
        </p>

        <Link href="/" className="mt-4 inline-block text-sm text-cyan-300 hover:text-cyan-100">
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
}
