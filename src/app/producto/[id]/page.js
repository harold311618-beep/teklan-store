import ProductDetailClient from './ProductDetailClient';

export default async function DetalleProductoPage({ params }) {
  const { id } = await params;

  return <ProductDetailClient productId={id} />;
}
