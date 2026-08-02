import { NextResponse } from 'next/server'
import { getCitiesData } from '@/lib/data'
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  return NextResponse.json(await getCitiesData(searchParams.get('range'), searchParams.get('category')))
}