import { NextResponse } from 'next/server'
import { getProductsData } from '@/lib/data'
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  return NextResponse.json(await getProductsData(searchParams.get('range'), searchParams.get('q')))
}