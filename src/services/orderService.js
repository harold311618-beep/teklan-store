import { serverTimestamp } from 'firebase/firestore';
import { createOrder } from '@/services/firestoreRepository';
import {
  TAX_RATE,
  SHIPPING_RATE,
  EPAYCO_CHECKOUT_URL,
  EPAYCO_CLIENT_ID,
  EPAYCO_PUBLIC_KEY,
  EPAYCO_URL_RESPONSE,
  EPAYCO_URL_CONFIRMATION,
  EPAYCO_TEST_MODE,
} from '@/lib/config';

export const ORDER_STATUS = {
  PENDING: 'Pendiente',
  ACCEPTED: 'Aceptada',
  REJECTED: 'Rechazada',
  PAID: 'Pagado',
};

export const PAYMENT_METHODS = {
  CASH: 'contado',
  PSE: 'PSE',
  CARD: 'tarjeta',
  CASH_PAYMENT: 'efectivo',
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
    paymentGateway: EPAYCO_CLIENT_ID && EPAYCO_PUBLIC_KEY ? 'epayco' : 'offline',
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

export function buildEpaycoCheckoutUrl(order, customer) {
  if (!EPAYCO_PUBLIC_KEY || !EPAYCO_URL_RESPONSE || !EPAYCO_URL_CONFIRMATION) {
    return null;
  }

  const description = order.items
    .map((item) => item.name)
    .filter(Boolean)
    .join(', ')
    .slice(0, 180);

  const params = new URLSearchParams({
    p_key: EPAYCO_PUBLIC_KEY,
    p_test_request: EPAYCO_TEST_MODE ? 'TRUE' : 'FALSE',
    p_response: EPAYCO_URL_RESPONSE,
    p_confirmation: EPAYCO_URL_CONFIRMATION,
    p_description: description || 'Compra Teklan',
    p_currency: 'COP',
    p_amount: String(order.totals.total),
    p_tax: String(order.totals.tax),
    p_tax_base: String(Math.max(order.totals.subtotal - order.totals.tax, 0)),
    p_invoice: order.reference,
    p_name: customer.name,
    p_email: customer.email || '',
    p_phone: customer.phone || '',
    p_country: 'CO',
    p_city: customer.city || '',
    p_address: customer.address || '',
  });

  if (EPAYCO_CLIENT_ID) {
    params.set('p_cust_id_cliente', EPAYCO_CLIENT_ID);
  }

  return `${EPAYCO_CHECKOUT_URL}?${params.toString()}`;
}
