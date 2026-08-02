import { NextResponse } from 'next/server'
import { getOverviewData } from '@/lib/data'
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  return NextResponse.json(await getOverviewData(searchParams.get('range'), searchParams.get('category')))
}