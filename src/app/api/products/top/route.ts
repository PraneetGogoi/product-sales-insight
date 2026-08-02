import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDateFilter } from '@/lib/utils'
import { Prisma } from '@prisma/client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const range = searchParams.get('range')
  const categoryParam = searchParams.get('category')
  const by = searchParams.get('by') || 'revenue'

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

  const sorted = [...productStats].sort((a, b) => {
    if (by === 'quantity') {
      return (b._sum.quantitySold || 0) - (a._sum.quantitySold || 0)
    }
    return (b._sum.totalSalesUsd || 0) - (a._sum.totalSalesUsd || 0)
  })

  return NextResponse.json(
    sorted.slice(0, 10).map((p) => ({
      name: p.productName,
      revenue: p._sum.totalSalesUsd || 0,
      quantity: p._sum.quantitySold || 0
    }))
  )
}
