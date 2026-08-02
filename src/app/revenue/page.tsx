import RevenueClient from '@/components/RevenueClient'
import { getMonthlyRevenueData, getHeatmapRevenueData, getCumulativeRevenueData, getCategoriesData } from '@/lib/data'

export default async function RevenuePage(props: { searchParams: Promise<{ range?: string }> }) {
  const searchParams = await props.searchParams;
  const range = searchParams.range || 'All Time'
  
  const [monthlyTrendData, heatmapData, cumulativeData, categoryData] = await Promise.all([
    getMonthlyRevenueData(range),
    getHeatmapRevenueData(range),
    getCumulativeRevenueData(range),
    getCategoriesData(range)
  ])

  return (
    <RevenueClient 
      initialMonthlyTrendData={monthlyTrendData}
      initialHeatmapData={heatmapData}
      initialCumulativeData={cumulativeData}
      initialCategoryData={categoryData}
    />
  )
}
