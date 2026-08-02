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
    select: { orderDate: true, totalSalesUsd: true },
    orderBy: { orderDate: 'asc' }
  })

  // Group by day to avoid a huge array, or group by month depending on range
  // Let's group by month since the other charts do
  const monthlyData: Record<string, number> = {}
  allSales.forEach(sale => {
    const d = sale.orderDate
    const label = `${d.getFullYear().toString().slice(2)}-${(d.getMonth() + 1).toString().padStart(2, '0')}`
    if (!monthlyData[label]) monthlyData[label] = 0
    monthlyData[label] += sale.totalSalesUsd
  })

  const sortedMonths = Object.keys(monthlyData).sort()
  const values = sortedMonths.map(m => monthlyData[m])
  
  let runningTotal = 0;
  const cumulativeValues = values.map(val => {
    runningTotal += val;
    return runningTotal;
  })

  return NextResponse.json(
    sortedMonths.map((m, i) => ({
      name: m,
      cumulative: cumulativeValues[i]
    }))
  )
}
