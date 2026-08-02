import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function main() {
  const csvPath = path.join(process.cwd(), 'legacy', 'product_sales_dataset.csv')
  const fileContent = fs.readFileSync(csvPath, 'utf-8')
  
  const lines = fileContent.split('\n').map(line => line.trim()).filter(line => line.length > 0)
  
  const rawData = []
  let maxDate = new Date(0)
  
  // Skip header, start at index 1
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',')
    // Format: Product_ID,Product_Name,Category,Price_USD,Quantity_Sold,Total_Sales_USD,Order_Date,Customer_City
    if (values.length < 8) continue;
    
    // Notebook-style cleansing: drop rows missing any required field
    if (values.some(v => v.trim() === '')) continue;
    
    const d = new Date(values[6])
    if (d > maxDate) {
      maxDate = d
    }

    const priceUsd = parseFloat(values[3]);
    const quantitySold = parseInt(values[4], 10);
    
    // Notebook-style math fix: trust price * quantity over raw column
    const totalSalesUsd = priceUsd * quantitySold;

    rawData.push({
      productId: values[0].trim(),
      productName: values[1].trim(),
      category: values[2].trim(),
      priceUsd: priceUsd,
      quantitySold: quantitySold,
      totalSalesUsd: totalSalesUsd,
      orderDate: d,
      customerCity: values[7].trim()
    })
  }

  const now = new Date()
  const diffTime = now.getTime() - maxDate.getTime()
  
  const salesData = rawData.map(item => ({
    ...item,
    orderDate: new Date(item.orderDate.getTime() + diffTime)
  }))

  console.log(`Clearing existing data...`)
  await prisma.sale.deleteMany()

  console.log(`Seeding ${salesData.length} records with shifted dates...`)
  
  await prisma.sale.createMany({
    data: salesData,
  })
  
  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
