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

  const allSalesForChart = await prisma.sale.findMany({
    where,
    select: { orderDate: true, totalSalesUsd: true }
  })

  // Group by month
  const monthlyData: Record<string, number> = {}
  allSalesForChart.forEach(sale => {
    const d = sale.orderDate
    const label = `${d.getFullYear().toString().slice(2)}-${(d.getMonth() + 1).toString().padStart(2, '0')}`
    if (!monthlyData[label]) monthlyData[label] = 0
    monthlyData[label] += sale.totalSalesUsd
  })

  const sortedMonths = Object.keys(monthlyData).sort()
  
  const values = sortedMonths.map(m => monthlyData[m])
  
  // 3-month rolling average
  const rollingAvg = values.map((val, i) => {
    let sum = val;
    let count = 1;
    if (i > 0) { sum += values[i-1]; count++; }
    if (i > 1) { sum += values[i-2]; count++; }
    return sum / count;
  });

  return NextResponse.json(sortedMonths.map((m, i) => ({
    name: m,
    revenue: values[i],
    rollingAvg: rollingAvg[i]
  })))
}
