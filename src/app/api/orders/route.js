import { NextResponse } from 'next/server';
import { createOrderRecord, buildEpaycoCheckoutUrl } from '@/services/orderService';
import { EPAYCO_CHECKOUT_URL } from '@/lib/config';

export async function POST(request) {
  const payload = await request.json();

  const requiredFields = ['customer', 'items', 'paymentMethod'];
  for (const field of requiredFields) {
    if (!payload[field]) {
      return NextResponse.json({ error: `Falta el campo ${field}` }, { status: 400 });
    }
  }

  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    return NextResponse.json({ error: 'El carrito debe contener al menos un producto.' }, { status: 400 });
  }

  try {
    const order = await createOrderRecord({
      userId: payload.userId,
      customer: payload.customer,
      items: payload.items,
      paymentMethod: payload.paymentMethod,
      email: payload.customer.email,
    });

    const paymentUrl = buildEpaycoCheckoutUrl(order, payload.customer);
    const responsePayload = {
      orderId: order.id,
      reference: order.reference,
      paymentUrl,
    };

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error('Error creando orden:', error);
    return NextResponse.json({ error: 'No pudimos crear la orden. Intenta nuevamente.' }, { status: 500 });
  }
}
