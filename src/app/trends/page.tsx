import TrendsClient from '@/components/TrendsClient'
import { getByWeekdayRevenueData, getTrendsData } from '@/lib/data'

export default async function TrendsPage(props: { searchParams: Promise<{ range?: string }> }) {
  const searchParams = await props.searchParams;
  const range = searchParams.range || 'All Time'
  
  const [weekdayData, trendsData] = await Promise.all([
    getByWeekdayRevenueData(range),
    getTrendsData(range)
  ])

  return (
    <TrendsClient 
      initialWeekdayData={weekdayData}
      initialTrendsData={trendsData}
    />
  )
}
