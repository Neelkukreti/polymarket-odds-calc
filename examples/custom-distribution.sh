#!/bin/bash
# Example: Custom distribution strategy
# Betting more on cheaper outcomes (higher ROI)

cd "$(dirname "$0")/.."
source venv/bin/activate

echo "📊 Example: Custom Distribution (Weighted toward cheap outcomes)"
echo "=================================================================="
echo ""
echo "Total: $100"
echo "Distribution:"
echo "  Outcome 1 (1c): $50"
echo "  Outcome 2 (2c): $30"
echo "  Outcome 3 (5c): $15"
echo "  Outcome 4 (10c): $5"
echo ""

python calc.py --invest 100 --prices 1,2,5,10 --distribution 50,30,15,5
