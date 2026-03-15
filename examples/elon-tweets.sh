#!/bin/bash
# Example: Elon Musk tweet count prediction market
# Market: "How many times will Elon Musk tweet between March 6-13?"

cd "$(dirname "$0")/.."
source venv/bin/activate

echo "📊 Example: Elon Musk Tweet Count Market"
echo "==========================================="
echo ""
echo "Outcomes:"
echo "  100-120 tweets: 1c"
echo "  121-140 tweets: 2c"
echo "  141-160 tweets: 3c"
echo "  161-180 tweets: 4c"
echo ""
echo "Strategy: Equal $5 investment per outcome"
echo ""

python calc.py --invest 20 --prices 1,2,3,4
