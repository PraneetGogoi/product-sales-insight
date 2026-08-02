import ProductsClient from '@/components/ProductsClient'
import { getTopProductsData, getProductsData } from '@/lib/data'

export default async function ProductsPage(props: { searchParams: Promise<{ range?: string, q?: string }> }) {
  const searchParams = await props.searchParams;
  const range = searchParams.range || 'All Time'
  const query = searchParams.q || ''
  
  const [topRevenue, topQuantity, allProducts] = await Promise.all([
    getTopProductsData(range, null, 'revenue'),
    getTopProductsData(range, null, 'quantity'),
    getProductsData(range, query)
  ])

  return (
    <ProductsClient 
      initialTopRevenue={topRevenue}
      initialTopQuantity={topQuantity}
      initialAllProducts={allProducts}
    />
  )
}
