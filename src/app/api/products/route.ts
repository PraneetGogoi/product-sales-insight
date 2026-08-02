import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDateFilter } from '@/lib/utils'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const range = searchParams.get('range') || 'All Time'
  const query = searchParams.get('q') || ''

  try {
    const dateFilter = getDateFilter(range)
    
    const whereClause: any = {}
    if (dateFilter) {
      whereClause.orderDate = dateFilter
    }
    if (query) {
      whereClause.productName = {
        contains: query
      }
    }

    const grouped = await prisma.sale.groupBy({
      by: ['productName', 'category'],
      where: whereClause,
      _sum: {
        totalSalesUsd: true,
        quantitySold: true
      },
      _avg: {
        priceUsd: true
      },
      orderBy: {
        _sum: {
          totalSalesUsd: 'desc'
        }
      }
    })

    const products = grouped.map(p => ({
      name: p.productName,
      category: p.category,
      revenue: p._sum.totalSalesUsd || 0,
      quantity: p._sum.quantitySold || 0,
      avgPrice: p._avg.priceUsd || 0
    }))

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
