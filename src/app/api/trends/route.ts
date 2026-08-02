import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDateFilter } from '@/lib/utils'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const range = searchParams.get('range') || 'All Time'

  try {
    const dateFilter = getDateFilter(range)
    
    // We fetch raw sales to calculate scatter, distribution, and correlation.
    // For large datasets, this might be slow, but SQLite handles this fine for our scale.
    // We'll group by category and product to get aggregate points for the scatter plot,
    // since plotting individual rows would be too noisy.
    
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

    // Calculate correlation (Price vs Quantity)
    // Formula: r = [ n(Σxy) - (Σx)(Σy) ] / sqrt( [nΣx^2 - (Σx)^2][nΣy^2 - (Σy)^2] )
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

    // Distribution Data (Min, Max, Avg by category)
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

    return NextResponse.json({
      scatter: scatterData,
      correlation: correlation,
      distribution: distribution
    })
  } catch (error) {
    console.error('Error fetching trends:', error)
    return NextResponse.json({ error: 'Failed to fetch trends' }, { status: 500 })
  }
}
