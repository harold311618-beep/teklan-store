import { serverTimestamp } from 'firebase/firestore';
import { createOrder } from '@/services/firestoreRepository';
import { TAX_RATE, SHIPPING_RATE, EPAYCO_CHECKOUT_URL } from '@/lib/config';

export const ORDER_STATUS = {
  PENDING: 'Pendiente',
  ACCEPTED: 'Aceptada',
  REJECTED: 'Rechazada',
  PAID: 'Pagado',
};

export const PAYMENT_METHODS = {
  CASH: 'contado',
  PSE: 'PSE',
  CASH_PAYMENT: 'efectivo',
  CARD: 'tarjeta',
};

export function generateOrderReference() {
  return `TK-${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`;
}

export function calculateOrderTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const shipping = subtotal > 0 ? SHIPPING_RATE : 0;
  const total = subtotal + tax + shipping;

  return { subtotal, tax, shipping, total };
}

export async function createOrderRecord({ userId, customer, items, paymentMethod, email }) {
  const reference = generateOrderReference();
  const { subtotal, tax, shipping, total } = calculateOrderTotals(items);
  const orderPayload = {
    reference,
    userId: userId || null,
    customer: {
      name: customer.name,
      email: customer.email || email || '',
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      postalCode: customer.postalCode,
    },
    items,
    paymentMethod,
    paymentGateway: EPAYCO_CHECKOUT_URL ? 'epayco' : 'offline',
    paymentStatus: ORDER_STATUS.PENDING,
    totals: {
      subtotal,
      tax,
      shipping,
      total,
    },
    createdAt: serverTimestamp(),
  };

  return createOrder(orderPayload);
}
