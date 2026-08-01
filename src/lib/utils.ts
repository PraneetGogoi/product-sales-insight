import { Prisma } from '@prisma/client'

export function getDateFilter(range: string | null): Prisma.DateTimeFilter | undefined {
  // Since the dataset is fixed to FY2024-2026, we find the max date from the DB.
  // Or we just hardcode the latest date we know the dataset has: 2026-05-31
  const maxDate = new Date('2026-05-31T23:59:59.999Z')
  
  if (!range || range === 'all time') {
    return undefined
  }
  
  const filterDate = new Date(maxDate)
  
  switch (range) {
    case 'last quarter':
      filterDate.setMonth(filterDate.getMonth() - 3)
      break
    case 'last month':
      filterDate.setMonth(filterDate.getMonth() - 1)
      break
    case 'last week':
      filterDate.setDate(filterDate.getDate() - 7)
      break
    default:
      return undefined
  }
  
  return {
    gte: filterDate,
    lte: maxDate
  }
}

export function formatCurrency(value: number) {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}k`
  }
  return `$${value.toFixed(0)}`
}
