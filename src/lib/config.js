export const TAX_RATE = Number(process.env.NEXT_PUBLIC_TAX_RATE ?? 0.19);
export const SHIPPING_RATE = Number(process.env.NEXT_PUBLIC_SHIPPING_RATE ?? 12000);
export const ORDER_COLLECTION = process.env.NEXT_PUBLIC_ORDER_COLLECTION ?? 'orders';
export const EPAYCO_CHECKOUT_URL = process.env.NEXT_PUBLIC_EPAYCO_CHECKOUT_URL ?? '';
export const EPAYCO_PUBLIC_KEY = process.env.EPAYCO_PUBLIC_KEY ?? '';
export const EPAYCO_PRIVATE_KEY = process.env.EPAYCO_PRIVATE_KEY ?? '';
export const EPAYCO_CONFIRMATION_SECRET = process.env.EPAYCO_CONFIRMATION_SECRET ?? '';
export const EPAYCO_TEST_MODE = process.env.NEXT_PUBLIC_EPAYCO_TEST_MODE === 'true';
