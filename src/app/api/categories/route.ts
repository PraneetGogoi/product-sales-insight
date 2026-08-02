import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDateFilter } from '@/lib/utils'
import { Prisma } from '@prisma/client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const range = searchParams.get('range')
  const categoryFilter = searchParams.get('category')

  const dateFilter = getDateFilter(range?.toLowerCase() || null)
  
  const where: Prisma.SaleWhereInput = {}
  if (dateFilter) where.orderDate = dateFilter
  if (categoryFilter) where.category = categoryFilter

  const categorySales = await prisma.sale.groupBy({
    by: ['category'],
    where,
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

  return NextResponse.json(
    categorySales.map(c => ({
      name: c.category,
      revenue: c._sum.totalSalesUsd || 0,
      quantity: c._sum.quantitySold || 0,
      avgPrice: c._avg.priceUsd || 0
    }))
  )
}
