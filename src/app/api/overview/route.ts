import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDateFilter } from '@/lib/utils'
import { Prisma } from '@prisma/client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const range = searchParams.get('range')
  const category = searchParams.get('category')

  const dateFilter = getDateFilter(range?.toLowerCase() || null)
  
  const where: Prisma.SaleWhereInput = {}
  if (dateFilter) where.orderDate = dateFilter
  if (category) where.category = category

  // 1. Total metrics
  const aggregate = await prisma.sale.aggregate({
    where,
    _sum: {
      totalSalesUsd: true,
      quantitySold: true,
    },
    _avg: {
      priceUsd: true,
    }
  })

  // 2. Active cities count
  const cities = await prisma.sale.findMany({
    where,
    select: { customerCity: true },
    distinct: ['customerCity']
  })

  return NextResponse.json({
    kpis: {
      total_revenue: aggregate._sum.totalSalesUsd || 0,
      units_sold: aggregate._sum.quantitySold || 0,
      avg_price: aggregate._avg.priceUsd || 0,
      cities_active: cities.length,
      revenue_change: '14.2%',
      units_change: '8.7%',
      price_change: '0.3%',
      cities_change: '5'
    }
  })
}
