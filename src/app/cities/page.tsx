import CitiesClient from '@/components/CitiesClient'
import { getCitiesData } from '@/lib/data'

export default async function CitiesPage(props: { searchParams: Promise<{ range?: string }> }) {
  const searchParams = await props.searchParams;
  const range = searchParams.range || 'All Time'
  
  const citiesData = await getCitiesData(range)

  return (
    <CitiesClient initialCitiesData={citiesData} />
  )
}
