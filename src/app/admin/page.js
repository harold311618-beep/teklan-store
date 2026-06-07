"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import InventoryModal from '@/components/InventoryModal';
import Link from 'next/link';

const statusOptions = ['Pendiente', 'Contactado', 'En Negociacion'];
const orderStatusOptions = ['Pendiente', 'Pagado', 'Aceptada', 'Rechazada'];

const formatDate = (timestamp) => {
  if (!timestamp?.toDate) return 'Sin fecha';
  return timestamp.toDate().toLocaleString('es-CO', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};

export default function AdminPage() {
  const { user, isAdmin, loading: authLoading, logOut } = useAuth();
  const router = useRouter();
  const [leads, setLeads] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingLead, setSavingLead] = useState('');
  const [savingOrder, setSavingOrder] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');
  const [inventoryModal, setInventoryModal] = useState(null);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      router.replace('/login');
      return;
    }

    if (!isAdmin) {
      router.replace('/');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setError('');

      try {
        const leadQuery = query(
          collection(db, 'solicitudes_contacto_credito'),
          orderBy('solicitadoEn', 'desc')
        );
        const leadSnapshot = await getDocs(leadQuery);
        const leadList = leadSnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        const productSnapshot = await getDocs(collection(db, 'Productos'));
        const productList = productSnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        const orderSnapshot = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
        const orderList = orderSnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        setLeads(leadList);
        setProducts(productList);
        setOrders(orderList);
      } catch (fetchError) {
        console.error('Error cargando datos de administración:', fetchError);
        setError('No pudimos cargar los datos administrativos. Intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [authLoading, router, user]);

  const handleStatusChange = async (leadId, status) => {
    setSavingLead(leadId);
    try {
      await updateDoc(doc(db, 'solicitudes_contacto_credito', leadId), {
        status,
      });

      setLeads((current) => current.map((lead) => (
        lead.id === leadId ? { ...lead, status } : lead
      )));
    } catch (updateError) {
      console.error('Error actualizando estado de lead:', updateError);
      setError('No pudimos actualizar el estado. Intenta más tarde.');
    } finally {
      setSavingLead('');
    }
  };

  const handleOrderStatusChange = async (orderId, status) => {
    setSavingOrder(orderId);

    try {
      await updateDoc(doc(db, 'orders', orderId), {
        paymentStatus: status,
      });

      setOrders((current) => current.map((order) => (
        order.id === orderId ? { ...order, paymentStatus: status } : order
      )));
    } catch (updateError) {
      console.error('Error actualizando estado de orden:', updateError);
      setError('No pudimos actualizar el estado de la orden. Intenta más tarde.');
    } finally {
      setSavingOrder('');
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      router.replace('/login');
    } catch (logoutError) {
      console.error('Error al cerrar sesión:', logoutError);
      setError('No pudimos cerrar sesión. Intenta de nuevo.');
    }
  };

  const reloadProducts = async () => {
    try {
      const productSnapshot = await getDocs(collection(db, 'Productos'));
      const productList = productSnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setProducts(productList);
    } catch (reloadError) {
      console.error('Error recargando productos:', reloadError);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="rounded-3xl border border-slate-700 bg-slate-900 px-8 py-6 text-slate-300">Verificando sesión...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black text-white">Panel de Administración</h1>
          <p className="mt-2 text-slate-400 max-w-2xl">
            Centro operativo para gestionar leads y ver el inventario disponible.
          </p>
          <p className="mt-3 text-sm text-slate-500">Sesión: {user.email}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-900"
          >
            Cerrar sesión
          </button>
          <Link
            href="/"
            className="rounded-full border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-900"
          >
            Volver a la tienda
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-700 bg-slate-950 p-10 text-center text-slate-400">
          Cargando datos del panel administrativo...
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-600 bg-rose-950/40 p-8 text-rose-100">
          {error}
        </div>
      ) : (
        <div className="space-y-10">
          <section className="rounded-3xl border border-slate-700 bg-slate-950 p-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Solicitudes de crédito</h2>
                <p className="text-slate-400">Lista de leads recibidos desde el formulario de crédito.</p>
              </div>
              <span className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950">
                {leads.length} solicitudes
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-200">
                <thead className="border-b border-slate-700 text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Nombre</th>
                    <th className="px-4 py-3">Teléfono</th>
                    <th className="px-4 py-3">Correo</th>
                    <th className="px-4 py-3">Horario</th>
                    <th className="px-4 py-3">Producto</th>
                    <th className="px-4 py-3">Origen</th>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-900/80">
                      <td className="px-4 py-4 font-semibold text-white">{lead.nombre || 'Sin nombre'}</td>
                      <td className="px-4 py-4">{lead.telefono || '---'}</td>
                      <td className="px-4 py-4">{lead.correo || '---'}</td>
                      <td className="px-4 py-4">{lead.horario || 'No definido'}</td>
                      <td className="px-4 py-4">{lead.productoNombre || 'N/A'}</td>
                      <td className="px-4 py-4">{lead.origen || 'No definido'}</td>
                      <td className="px-4 py-4">{formatDate(lead.solicitadoEn)}</td>
                      <td className="px-4 py-4">
                        <select
                          value={lead.status || 'Pendiente'}
                          onChange={(event) => handleStatusChange(lead.id, event.target.value)}
                          disabled={savingLead === lead.id}
                          className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-700 bg-slate-950 p-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Órdenes de clientes</h2>
                <p className="text-slate-400">Filtra y revisa las órdenes con estado de pago, total y referencia.</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <span className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">
                  {orders.length} órdenes
                </span>
                <select
                  value={orderFilter}
                  onChange={(event) => setOrderFilter(event.target.value)}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
                >
                  <option value="all">Todos los estados</option>
                  {orderStatusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-200">
                <thead className="border-b border-slate-700 text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Referencia</th>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Monto</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {orders
                    .filter((order) => orderFilter === 'all' || order.paymentStatus === orderFilter)
                    .map((order) => (
                      <tr key={order.id} className="hover:bg-slate-900/80">
                        <td className="px-4 py-4 font-semibold text-white">{order.reference || order.id}</td>
                        <td className="px-4 py-4">{order.customer?.name || 'Sin cliente'}</td>
                        <td className="px-4 py-4">${Number(order.totals?.total || 0).toLocaleString('es-CO')}</td>
                        <td className="px-4 py-4">
                          <select
                            value={order.paymentStatus || 'Pendiente'}
                            onChange={(event) => handleOrderStatusChange(order.id, event.target.value)}
                            disabled={savingOrder === order.id}
                            className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
                          >
                            {orderStatusOptions.map((status) => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-4">{formatDate(order.createdAt)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-700 bg-slate-950 p-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Inventario</h2>
                <p className="text-slate-400">Gestiona los productos del catálogo sin editar código.</p>
              </div>
              <div className="flex gap-2">
                <span className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">
                  {products.length} productos
                </span>
                <button
                  type="button"
                  onClick={() => setInventoryModal({})}
                  className="rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 transition"
                >
                  + Nuevo producto
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div key={product.id} className="rounded-3xl border border-slate-800 bg-slate-900 p-5 hover:border-slate-700 transition">
                  {product.imagenUrl && (
                    <div className="mb-4 h-32 bg-slate-800 rounded-xl overflow-hidden">
                      <img src={product.imagenUrl} alt={product.Nombre} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-white">{product.Nombre || 'Sin nombre'}</h3>
                  <p className="mt-1 text-slate-400 text-sm">Marca: {product.Marca || 'No definida'}</p>
                  <p className="mt-1 text-cyan-300 font-bold">${Number(product.Precio || 0).toLocaleString('es-CO')}</p>
                  <p className="mt-3 text-xs text-slate-500 break-all">ID: {product.id}</p>
                  <button
                    type="button"
                    onClick={() => setInventoryModal(product)}
                    className="mt-4 w-full rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-800 transition"
                  >
                    Editar
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {inventoryModal !== null && (
        <InventoryModal
          product={inventoryModal || null}
          onClose={() => setInventoryModal(null)}
          onSuccess={reloadProducts}
        />
      )}
    </div>
  );
}
