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

  const categoryGroups = await prisma.sale.groupBy({
    by: ['category'],
    where,
    _sum: {
      totalSalesUsd: true,
      quantitySold: true,
    },
    _avg: {
      priceUsd: true,
    },
    orderBy: {
      _sum: {
        totalSalesUsd: 'desc'
      }
    }
  })

  const labels = categoryGroups.map(g => g.category)
  const values = categoryGroups.map(g => g._sum.totalSalesUsd || 0)
  const units = categoryGroups.map(g => g._sum.quantitySold || 0)
  const avgPrices = categoryGroups.map(g => g._avg.priceUsd || 0)

  const totalRev = values.reduce((sum, v) => sum + v, 0)
  const percentages = values.map(v => totalRev > 0 ? Math.round((v / totalRev) * 100) : 0)

  return NextResponse.json({
    category_revenue: {
      labels,
      values,
      units,
      avg_prices: avgPrices
    },
    category_share: {
      labels,
      percentages,
      values
    },
    aov_by_category: categoryGroups.map((g, i) => ({
      rank: String(i + 1).padStart(2, '0'),
      name: g.category,
      value: g._avg.priceUsd || 0,
      pct: percentages[i]
    }))
  })
}
