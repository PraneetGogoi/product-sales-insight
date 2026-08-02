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

  const allSales = await prisma.sale.findMany({
    where,
    select: { orderDate: true, totalSalesUsd: true }
  })

  // Group by weekday (0 = Sun, 1 = Mon...)
  const weekdayData = [0, 0, 0, 0, 0, 0, 0]
  allSales.forEach(sale => {
    const day = sale.orderDate.getDay()
    weekdayData[day] += sale.totalSalesUsd
  })

  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return NextResponse.json(
    labels.map((label, i) => ({
      day: label,
      revenue: weekdayData[i]
    }))
  )
}
