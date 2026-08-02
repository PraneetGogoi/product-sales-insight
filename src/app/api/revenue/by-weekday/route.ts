import { NextResponse } from 'next/server'
import { getByWeekdayRevenueData } from '@/lib/data'
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  return NextResponse.json(await getByWeekdayRevenueData(searchParams.get('range'), searchParams.get('category')))
}