import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDateFilter } from '@/lib/utils'
import { Prisma } from '@prisma/client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const range = searchParams.get('range')
  const categoryParam = searchParams.get('category')

  const dateFilter = getDateFilter(range?.toLowerCase() || null)
  
  const where: Prisma.SaleWhereInput = {}
  if (dateFilter) where.orderDate = dateFilter
  if (categoryParam) where.category = categoryParam

  const cityStats = await prisma.sale.groupBy({
    by: ['customerCity'],
    where,
    _sum: {
      totalSalesUsd: true,
      quantitySold: true, // we might use quantitySold or count for "orders"
    },
    _count: {
      _all: true
    }
  })

  const sortedCities = [...cityStats].sort((a, b) => (b._sum.totalSalesUsd || 0) - (a._sum.totalSalesUsd || 0))
  const maxRevenue = sortedCities[0]?._sum.totalSalesUsd || 1
  
  const labels = sortedCities.map(c => c.customerCity)
  const revenue = sortedCities.map(c => c._sum.totalSalesUsd || 0)
  const orders = sortedCities.map(c => c._count._all)
  
  const totalRev = revenue.reduce((sum, v) => sum + v, 0)

  return NextResponse.json({
    cities: {
      labels,
      revenue,
      orders
    },
    top_cities_overview: sortedCities.slice(0, 5).map(c => ({
      name: c.customerCity,
      revenue: c._sum.totalSalesUsd || 0,
      pct: Math.round(((c._sum.totalSalesUsd || 0) / maxRevenue) * 100),
      share_pct: totalRev > 0 ? Math.round(((c._sum.totalSalesUsd || 0) / totalRev) * 100) : 0
    }))
  })
}
