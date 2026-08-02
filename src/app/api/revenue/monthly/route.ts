import { NextResponse } from 'next/server'
import { getMonthlyRevenueData } from '@/lib/data'
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  return NextResponse.json(await getMonthlyRevenueData(searchParams.get('range'), searchParams.get('category')))
}