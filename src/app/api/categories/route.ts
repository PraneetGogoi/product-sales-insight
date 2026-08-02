import { NextResponse } from 'next/server'
import { getCategoriesData } from '@/lib/data'
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  return NextResponse.json(await getCategoriesData(searchParams.get('range'), searchParams.get('category')))
}