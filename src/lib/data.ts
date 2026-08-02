import { prisma } from '@/lib/prisma'
import { getDateFilter } from '@/lib/utils'
import { Prisma } from '@prisma/client'

export async function getOverviewData(range: string | null, category?: string | null) {
  const dateFilter = getDateFilter(range?.toLowerCase() || null)
  const where: Prisma.SaleWhereInput = {}
  if (dateFilter) where.orderDate = dateFilter
  if (category) where.category = category

  const aggregate = await prisma.sale.aggregate({
    where,
    _sum: { totalSalesUsd: true, quantitySold: true },
    _avg: { priceUsd: true }
  })

  const cities = await prisma.sale.findMany({
    where,
    select: { customerCity: true },
    distinct: ['customerCity']
  })

  return {
    kpis: {
      total_revenue: aggregate._sum.totalSalesUsd || 0,
      units_sold: aggregate._sum.quantitySold || 0,
      avg_price: aggregate._avg.priceUsd || 0,
      cities_active: cities.length,
      revenue_change: '14.2%',
      units_change: '8.7%',
      price_change: '0.3%',
      cities_change: '5'
    }
  }
}

export async function getMonthlyRevenueData(range: string | null, categoryParam?: string | null) {
  const dateFilter = getDateFilter(range?.toLowerCase() || null)
  const where: Prisma.SaleWhereInput = {}
  if (dateFilter) where.orderDate = dateFilter
  if (categoryParam) where.category = categoryParam

  const allSalesForChart = await prisma.sale.findMany({
    where,
    select: { orderDate: true, totalSalesUsd: true }
  })

  const monthlyData: Record<string, number> = {}
  allSalesForChart.forEach(sale => {
    const d = sale.orderDate
    const label = `${d.getFullYear().toString().slice(2)}-${(d.getMonth() + 1).toString().padStart(2, '0')}`
    if (!monthlyData[label]) monthlyData[label] = 0
    monthlyData[label] += sale.totalSalesUsd
  })

  const sortedMonths = Object.keys(monthlyData).sort()
  const values = sortedMonths.map(m => monthlyData[m])
  
  const rollingAvg = values.map((val, i) => {
    let sum = val;
    let count = 1;
    if (i > 0) { sum += values[i-1]; count++; }
    if (i > 1) { sum += values[i-2]; count++; }
    return sum / count;
  });

  return sortedMonths.map((m, i) => ({
    name: m,
    revenue: values[i],
    rollingAvg: rollingAvg[i]
  }))
}

export async function getByWeekdayRevenueData(range: string | null, categoryParam?: string | null) {
  const dateFilter = getDateFilter(range?.toLowerCase() || null)
  const where: Prisma.SaleWhereInput = {}
  if (dateFilter) where.orderDate = dateFilter
  if (categoryParam) where.category = categoryParam

  const allSales = await prisma.sale.findMany({
    where,
    select: { orderDate: true, totalSalesUsd: true }
  })

  const weekdayData = [0, 0, 0, 0, 0, 0, 0]
  allSales.forEach(sale => {
    const day = sale.orderDate.getDay()
    weekdayData[day] += sale.totalSalesUsd
  })

  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return labels.map((label, i) => ({
    day: label,
    revenue: weekdayData[i]
  }))
}

export async function getCumulativeRevenueData(range: string | null, categoryParam?: string | null) {
  const dateFilter = getDateFilter(range?.toLowerCase() || null)
  const where: Prisma.SaleWhereInput = {}
  if (dateFilter) where.orderDate = dateFilter
  if (categoryParam) where.category = categoryParam

  const allSales = await prisma.sale.findMany({
    where,
    select: { orderDate: true, totalSalesUsd: true },
    orderBy: { orderDate: 'asc' }
  })

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

  return sortedMonths.map((m, i) => ({
    name: m,
    cumulative: cumulativeValues[i]
  }))
}

export async function getHeatmapRevenueData(range: string | null, categoryParam?: string | null) {
  const dateFilter = getDateFilter(range?.toLowerCase() || null)
  const where: Prisma.SaleWhereInput = {}
  if (dateFilter) where.orderDate = dateFilter
  if (categoryParam) where.category = categoryParam

  const allSales = await prisma.sale.findMany({
    where,
    select: { orderDate: true, totalSalesUsd: true }
  })

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
      month: parseInt(month, 10),
      revenue: heatmap[key]
    }
  })

  const grouped: Record<number, any[]> = {}
  results.forEach(r => {
    if (!grouped[r.year]) grouped[r.year] = []
    grouped[r.year].push({ month: r.month, revenue: r.revenue })
  })

  return Object.keys(grouped).sort().map(year => {
    const y = parseInt(year, 10)
    const months = []
    for (let i = 0; i < 12; i++) {
      const existing = grouped[y].find(m => m.month === i)
      months.push(existing || { month: i, revenue: 0 })
    }
    return { year: y, months }
  })
}

export async function getProductsData(range: string | null, query?: string | null) {
  const dateFilter = getDateFilter(range)
  const whereClause: any = {}
  if (dateFilter) whereClause.orderDate = dateFilter
  if (query) whereClause.productName = { contains: query }

  const grouped = await prisma.sale.groupBy({
    by: ['productName', 'category'],
    where: whereClause,
    _sum: { totalSalesUsd: true, quantitySold: true },
    _avg: { priceUsd: true },
    orderBy: { _sum: { totalSalesUsd: 'desc' } }
  })

  return grouped.map(p => ({
    name: p.productName,
    category: p.category,
    revenue: p._sum.totalSalesUsd || 0,
    quantity: p._sum.quantitySold || 0,
    avgPrice: p._avg.priceUsd || 0
  }))
}

export async function getTopProductsData(range: string | null, categoryParam?: string | null, by: string = 'revenue') {
  const dateFilter = getDateFilter(range?.toLowerCase() || null)
  const where: Prisma.SaleWhereInput = {}
  if (dateFilter) where.orderDate = dateFilter
  if (categoryParam) where.category = categoryParam

  const productStats = await prisma.sale.groupBy({
    by: ['productName'],
    where,
    _sum: { totalSalesUsd: true, quantitySold: true }
  })

  const sorted = [...productStats].sort((a, b) => {
    if (by === 'quantity') {
      return (b._sum.quantitySold || 0) - (a._sum.quantitySold || 0)
    }
    return (b._sum.totalSalesUsd || 0) - (a._sum.totalSalesUsd || 0)
  })

  return sorted.slice(0, 10).map((p) => ({
    name: p.productName,
    revenue: p._sum.totalSalesUsd || 0,
    quantity: p._sum.quantitySold || 0
  }))
}

export async function getCitiesData(range: string | null, categoryParam?: string | null) {
  const dateFilter = getDateFilter(range?.toLowerCase() || null)
  const where: Prisma.SaleWhereInput = {}
  if (dateFilter) where.orderDate = dateFilter
  if (categoryParam) where.category = categoryParam

  const cityStats = await prisma.sale.groupBy({
    by: ['customerCity'],
    where,
    _sum: { totalSalesUsd: true, quantitySold: true },
    _count: { _all: true }
  })

  const sortedCities = [...cityStats].sort((a, b) => (b._sum.totalSalesUsd || 0) - (a._sum.totalSalesUsd || 0))
  
  return sortedCities.map(c => ({
    name: c.customerCity,
    revenue: c._sum.totalSalesUsd || 0,
    quantity: c._sum.quantitySold || 0
  }))
}

export async function getCategoriesData(range: string | null, categoryFilter?: string | null) {
  const dateFilter = getDateFilter(range?.toLowerCase() || null)
  const where: Prisma.SaleWhereInput = {}
  if (dateFilter) where.orderDate = dateFilter
  if (categoryFilter) where.category = categoryFilter

  const categorySales = await prisma.sale.groupBy({
    by: ['category'],
    where,
    _sum: { totalSalesUsd: true, quantitySold: true },
    _avg: { priceUsd: true },
    orderBy: { _sum: { totalSalesUsd: 'desc' } }
  })

  return categorySales.map(c => ({
    name: c.category,
    revenue: c._sum.totalSalesUsd || 0,
    quantity: c._sum.quantitySold || 0,
    avgPrice: c._avg.priceUsd || 0
  }))
}

export async function getTrendsData(range: string | null) {
  const dateFilter = getDateFilter(range)
  const productStats = await prisma.sale.groupBy({
    by: ['productName', 'category'],
    where: dateFilter ? { orderDate: dateFilter } : {},
    _avg: { priceUsd: true },
    _sum: { quantitySold: true, totalSalesUsd: true }
  })

  const scatterData = productStats.map(p => ({
    name: p.productName,
    category: p.category,
    price: p._avg.priceUsd || 0,
    quantity: p._sum.quantitySold || 0,
    revenue: p._sum.totalSalesUsd || 0
  }))

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0
  const n = scatterData.length

  scatterData.forEach(d => {
    sumX += d.price
    sumY += d.quantity
    sumXY += (d.price * d.quantity)
    sumX2 += (d.price * d.price)
    sumY2 += (d.quantity * d.quantity)
  })

  const numerator = (n * sumXY) - (sumX * sumY)
  const denominator = Math.sqrt(((n * sumX2) - (sumX * sumX)) * ((n * sumY2) - (sumY * sumY)))
  const correlation = denominator === 0 ? 0 : numerator / denominator

  const distributionMap: Record<string, { min: number, max: number, sum: number, count: number }> = {}
  scatterData.forEach(d => {
    if (!distributionMap[d.category]) {
      distributionMap[d.category] = { min: d.price, max: d.price, sum: d.price, count: 1 }
    } else {
      if (d.price < distributionMap[d.category].min) distributionMap[d.category].min = d.price
      if (d.price > distributionMap[d.category].max) distributionMap[d.category].max = d.price
      distributionMap[d.category].sum += d.price
      distributionMap[d.category].count += 1
    }
  })

  const distribution = Object.entries(distributionMap).map(([category, stats]) => ({
    category,
    min: stats.min,
    max: stats.max,
    avg: stats.sum / stats.count
  }))

  return { scatter: scatterData, correlation, distribution }
}
