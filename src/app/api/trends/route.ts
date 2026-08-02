import { NextResponse } from 'next/server'
import { getTrendsData } from '@/lib/data'
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  return NextResponse.json(await getTrendsData(searchParams.get('range')))
}