import { NextResponse } from 'next/server';
import { EPAYCO_CONFIRMATION_SECRET } from '@/lib/config';
import { fetchOrderByReference, updateOrder } from '@/services/firestoreRepository';

const STATUS_MAP = {
  pending: 'Pendiente',
  aceptada: 'Aceptada',
  rechazada: 'Rechazada',
  pagado: 'Pagado',
};

export async function POST(request) {
  const secret = request.headers.get('x-epayco-secret') || '';
  if (!EPAYCO_CONFIRMATION_SECRET || secret !== EPAYCO_CONFIRMATION_SECRET) {
    return NextResponse.json({ error: 'Secret inválido' }, { status: 401 });
  }

  const body = await request.json();
  const reference = body?.reference || body?.ref || body?.data?.reference;
  const paymentStatus = body?.status || body?.data?.status || '';

  if (!reference || !paymentStatus) {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
  }

  const status = STATUS_MAP[paymentStatus.toLowerCase()] || 'Pendiente';

  try {
    const order = await fetchOrderByReference(reference);
    if (!order) {
      return NextResponse.json({ error: 'Orden no encontrada.' }, { status: 404 });
    }

    await updateOrder(order.id, {
      paymentStatus: status,
      paymentConfirmation: {
        raw: body,
        receivedAt: new Date().toISOString(),
      },
    });

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error('Error actualizando orden desde webhook EPayco:', error);
    return NextResponse.json({ error: 'No se pudo actualizar la orden' }, { status: 500 });
  }
}
