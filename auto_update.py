import csv
import json
import time
import os

# Config
CSV_PATH = 'product_sales_dataset.csv'
JS_PATH = 'data.js'
INTERVAL = 5  # Check every 5 seconds

def convert_csv_to_js():
    if not os.path.exists(CSV_PATH):
        return
    
    try:
        with open(CSV_PATH, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            data = list(reader)

        # Convert numeric strings
        for row in data:
            for key in ['Price_USD', 'Quantity_Sold', 'Total_Sales_USD']:
                if key in row:
                    try: row[key] = float(row[key])
                    except: pass

        with open(JS_PATH, 'w', encoding='utf-8') as f:
            f.write(f"window.rawData = {json.dumps(data)};")
        
        print(f"[{time.strftime('%H:%M:%S')}] Updated data.js from {CSV_PATH}")
    except Exception as e:
        print(f"Error: {e}")

def main():
    print("NexusPulse Auto-Update Service Started...")
    print(f"Watching {CSV_PATH} and updating {JS_PATH} every {INTERVAL}s")
    
    last_mtime = 0
    while True:
        try:
            mtime = os.path.getmtime(CSV_PATH)
            if mtime != last_mtime:
                convert_csv_to_js()
                last_mtime = mtime
        except OSError:
            pass
        time.sleep(INTERVAL)

if __name__ == "__main__":
    main()
