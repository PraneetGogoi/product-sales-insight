import DashboardClient from '@/components/DashboardClient'
import { getOverviewData, getMonthlyRevenueData, getTopProductsData, getCategoriesData } from '@/lib/data'

export default async function Home(props: { searchParams: Promise<{ range?: string }> }) {
  const searchParams = await props.searchParams;
  const range = searchParams.range || 'All Time'
  
  const [overview, monthlyTrendData, topProductsRev, categoryData] = await Promise.all([
    getOverviewData(range),
    getMonthlyRevenueData(range),
    getTopProductsData(range, null, 'revenue'),
    getCategoriesData(range)
  ])

  return (
    <DashboardClient 
      initialOverview={overview}
      initialMonthlyTrendData={monthlyTrendData}
      initialTopProductsRev={topProductsRev}
      initialCategoryData={categoryData}
    />
  )
}
