import { NextResponse } from 'next/server'
import { getCumulativeRevenueData } from '@/lib/data'
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  return NextResponse.json(await getCumulativeRevenueData(searchParams.get('range'), searchParams.get('category')))
}