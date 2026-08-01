import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function main() {
  const csvPath = path.join(process.cwd(), 'legacy', 'product_sales_dataset.csv')
  const fileContent = fs.readFileSync(csvPath, 'utf-8')
  
  const lines = fileContent.split('\n').map(line => line.trim()).filter(line => line.length > 0)
  
  const salesData = []
  
  // Skip header, start at index 1
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',')
    // Format: Product_ID,Product_Name,Category,Price_USD,Quantity_Sold,Total_Sales_USD,Order_Date,Customer_City
    if (values.length < 8) continue;
    
    salesData.push({
      productId: parseInt(values[0], 10),
      productName: values[1],
      category: values[2],
      priceUsd: parseFloat(values[3]),
      quantitySold: parseInt(values[4], 10),
      totalSalesUsd: parseFloat(values[5]),
      orderDate: new Date(values[6]),
      customerCity: values[7]
    })
  }

  console.log(`Clearing existing data...`)
  await prisma.sale.deleteMany()

  console.log(`Seeding ${salesData.length} records...`)
  
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
