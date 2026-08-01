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

  const productStats = await prisma.sale.groupBy({
    by: ['productName'],
    where,
    _sum: {
      totalSalesUsd: true,
      quantitySold: true,
    }
  })

  // Sort by revenue (descending)
  const byRevenue = [...productStats].sort((a, b) => (b._sum.totalSalesUsd || 0) - (a._sum.totalSalesUsd || 0))
  // Sort by volume (descending)
  const byVolume = [...productStats].sort((a, b) => (b._sum.quantitySold || 0) - (a._sum.quantitySold || 0))
  
  // Sort by revenue (ascending for bottom products)
  const bottomRevenue = [...productStats].sort((a, b) => (a._sum.totalSalesUsd || 0) - (b._sum.totalSalesUsd || 0))

  const maxRevenue = byRevenue[0]?._sum.totalSalesUsd || 1
  const maxVolume = byVolume[0]?._sum.quantitySold || 1
  const maxBottomRev = bottomRevenue[0]?._sum.totalSalesUsd || 1 // For scaling bottom bars if we want relative to max of bottom, but usually relative to max overall.
  // Actually, UI usually scales relative to the max in the current list.
  const bottomMaxVal = bottomRevenue.length > 0 ? Math.max(...bottomRevenue.slice(0, 5).map(p => p._sum.totalSalesUsd || 0)) : 1

  return NextResponse.json({
    top_products_revenue: byRevenue.slice(0, 10).map((p, i) => ({
      rank: String(i + 1).padStart(2, '0'),
      name: p.productName,
      value: p._sum.totalSalesUsd || 0,
      pct: Math.round(((p._sum.totalSalesUsd || 0) / maxRevenue) * 100)
    })),
    top_products_volume: byVolume.slice(0, 5).map((p, i) => ({
      rank: String(i + 1).padStart(2, '0'),
      name: p.productName,
      value: p._sum.quantitySold || 0,
      pct: Math.round(((p._sum.quantitySold || 0) / maxVolume) * 100)
    })),
    bottom_products: bottomRevenue.slice(0, 5).map((p, i) => ({
      rank: String(i + 1).padStart(2, '0'),
      name: p.productName,
      value: p._sum.totalSalesUsd || 0,
      pct: Math.round(((p._sum.totalSalesUsd || 0) / bottomMaxVal) * 100)
    }))
  })
}
