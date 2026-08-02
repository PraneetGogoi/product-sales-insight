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

  // We want to return something easy to render as a grid:
  // e.g. Array of { year, month, revenue }
  const heatmap: Record<string, number> = {}
  
  allSales.forEach(sale => {
    const d = sale.orderDate
    const key = `${d.getFullYear()}-${d.getMonth()}`
    if (!heatmap[key]) heatmap[key] = 0
    heatmap[key] += sale.totalSalesUsd
  })

  const results = Object.keys(heatmap).map(key => {
    const [year, month] = key.split('-')
    return {
      year: parseInt(year, 10),
      month: parseInt(month, 10), // 0-11
      revenue: heatmap[key]
    }
  })

  const grouped: Record<number, any[]> = {}
  results.forEach(r => {
    if (!grouped[r.year]) grouped[r.year] = []
    grouped[r.year].push({ month: r.month, revenue: r.revenue })
  })

  const finalResponse = Object.keys(grouped).sort().map(year => {
    const y = parseInt(year, 10)
    // ensure all 12 months exist
    const months = []
    for (let i = 0; i < 12; i++) {
      const existing = grouped[y].find(m => m.month === i)
      months.push(existing || { month: i, revenue: 0 })
    }
    return {
      year: y,
      months
    }
  })

  return NextResponse.json(finalResponse)
}
