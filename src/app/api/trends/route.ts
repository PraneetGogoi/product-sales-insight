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

  // Get monthly trends
  const allSales = await prisma.sale.findMany({
    where,
    select: { orderDate: true, totalSalesUsd: true, quantitySold: true }
  })

  const monthlyRev: Record<string, number> = {}
  const monthlyVol: Record<string, number> = {}

  allSales.forEach(sale => {
    const d = sale.orderDate
    const label = `${d.getFullYear().toString().slice(2)}-${(d.getMonth() + 1).toString().padStart(2, '0')}`
    if (!monthlyRev[label]) monthlyRev[label] = 0
    if (!monthlyVol[label]) monthlyVol[label] = 0
    
    monthlyRev[label] += sale.totalSalesUsd
    monthlyVol[label] += sale.quantitySold
  })

  const sortedMonths = Object.keys(monthlyRev).sort()
  
  // Get scatter plot data (Category: Price vs Volume)
  const categoryStats = await prisma.sale.groupBy({
    by: ['category'],
    where,
    _sum: {
      quantitySold: true
    },
    _avg: {
      priceUsd: true
    }
  })

  return NextResponse.json({
    monthly_revenue: {
      labels: sortedMonths,
      values: sortedMonths.map(m => monthlyRev[m])
    },
    monthly_volume: {
      labels: sortedMonths,
      values: sortedMonths.map(m => monthlyVol[m])
    },
    category_scatter: categoryStats.map(c => ({
      category: c.category,
      avg_price: c._avg.priceUsd || 0,
      total_volume: c._sum.quantitySold || 0
    }))
  })
}
