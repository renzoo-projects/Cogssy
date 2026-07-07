import ProductDetailPage from './product-detail-page'

export function generateStaticParams() {
  return [{ id: '__placeholder__' }]
}

export default function Page() {
  return <ProductDetailPage />
}
