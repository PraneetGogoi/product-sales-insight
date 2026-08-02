import { NextResponse } from 'next/server'
import { getHeatmapRevenueData } from '@/lib/data'
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  return NextResponse.json(await getHeatmapRevenueData(searchParams.get('range'), searchParams.get('category')))
}