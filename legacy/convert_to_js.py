import csv
import json
import os

csv_path = '/Volumes/hard/product-sales-insight/product_sales_dataset.csv'
js_path = '/Volumes/hard/product-sales-insight/data.js'

def convert():
    if not os.path.exists(csv_path):
        print(f"Error: {csv_path} not found")
        return

    with open(csv_path, 'r') as f:
        reader = csv.DictReader(f)
        data = list(reader)

    # Convert numeric strings to numbers
    for row in data:
        for key in ['Price_USD', 'Quantity_Sold', 'Total_Sales_USD']:
            if key in row:
                try:
                    row[key] = float(row[key])
                except:
                    pass

    with open(js_path, 'w') as f:
        f.write(f"window.rawData = {json.dumps(data, indent=2)};")
    print(f"Successfully created {js_path}")

if __name__ == "__main__":
    convert()
