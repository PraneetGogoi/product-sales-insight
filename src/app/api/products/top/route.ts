import { NextResponse } from 'next/server'
import { getTopProductsData } from '@/lib/data'
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  return NextResponse.json(await getTopProductsData(
    searchParams.get('range'),
    searchParams.get('category'),
    searchParams.get('by') ?? undefined
  ))
}