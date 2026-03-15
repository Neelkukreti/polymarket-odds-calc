# Polymarket Odds Calculator 🎲

**Calculate potential returns when investing in multiple prediction market outcomes on Polymarket.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)

## What It Does

Polymarket lets you bet on prediction markets where each outcome has a price in cents (representing probability). This calculator helps you:

- 📊 Calculate shares bought for each outcome
- 💰 See potential payouts and profits
- 🎯 Compare ROI across different outcomes
- ⚡ Quickly evaluate multi-outcome spread strategies

## Quick Start

```bash
# Clone the repo
git clone https://github.com/yourusername/polymarket-odds-calc.git
cd polymarket-odds-calc

# Install dependencies
pip install -r requirements.txt

# Run the calculator
python calc.py
```

## How It Works

In Polymarket:
- Each outcome has a price in cents (1c = $0.01)
- If the outcome wins, payout is **$1 per share**
- Your profit depends on the price you bought at

### Example Market

**"How many times will Elon Musk tweet this week?"**

| Range | Price |
|-------|-------|
| 100-120 | 1c |
| 121-140 | 2c |
| 141-160 | 3c |
| 161-180 | 4c |

### Strategy: Equal Investment ($20 total, $5 per outcome)

**Outcome 1 (1c)**
- Shares: 5 / 0.01 = **500 shares**
- If wins: 500 × $1 = **$500 payout**
- Profit: **$480** (24x ROI)

**Outcome 2 (2c)**
- Shares: 5 / 0.02 = **250 shares**
- If wins: 250 × $1 = **$250 payout**
- Profit: **$230** (12.5x ROI)

**Outcome 3 (3c)**
- Shares: 5 / 0.03 = **166.67 shares**
- If wins: **$166.67 payout**
- Profit: **$146.67** (8.33x ROI)

**Outcome 4 (4c)**
- Shares: 5 / 0.04 = **125 shares**
- If wins: **$125 payout**
- Profit: **$105** (6.25x ROI)

## Usage

### Interactive Mode

```bash
python calc.py
```

Follow the prompts:
1. Enter total investment amount
2. Enter outcome prices (comma-separated)
3. View results table

### Command Line Mode

```bash
# Calculate with $20 total, outcomes at 1c, 2c, 3c, 4c
python calc.py --invest 20 --prices 1,2,3,4

# Custom investment per outcome
python calc.py --invest 20 --prices 1,2,3,4 --distribution 10,5,3,2
```

### Discord/Telegram Bot (Optional)

```bash
# Discord
/polymarket-calc 20 1 2 3 4

# Telegram
/calc 20 1,2,3,4
```

*(Bot integration guide in [docs/BOT.md](docs/BOT.md))*

## Features

✅ **Equal distribution** - Split investment evenly across outcomes  
✅ **Custom distribution** - Manually set investment per outcome  
✅ **ROI ranking** - Highlights best risk/reward outcomes  
✅ **Profit visualization** - See potential returns at a glance  
✅ **Export results** - Save calculations to CSV/JSON  
🚧 **Live Polymarket API** - Fetch real-time odds (coming soon)  
🚧 **Bot integration** - Discord/Telegram support (coming soon)

## Installation

### Requirements
- Python 3.8+
- pip

### Setup

```bash
# Clone
git clone https://github.com/yourusername/polymarket-odds-calc.git
cd polymarket-odds-calc

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run
python calc.py
```

## Examples

### Equal Investment Strategy
```bash
$ python calc.py --invest 100 --prices 1,2,5,10

Total Investment: $100
Investment per outcome: $25

Outcome 1 (1c)  → 2500 shares → $2500 payout → $2400 profit (25x ROI) ⭐
Outcome 2 (2c)  → 1250 shares → $1250 payout → $1150 profit (12.5x ROI)
Outcome 3 (5c)  → 500 shares  → $500 payout  → $400 profit (5x ROI)
Outcome 4 (10c) → 250 shares  → $250 payout  → $150 profit (2.5x ROI)

Best ROI: Outcome 1 (25x)
```

### Custom Distribution
```bash
$ python calc.py --invest 100 --prices 1,2,5,10 --distribution 50,30,15,5

Outcome 1 (1c)  → 5000 shares → $5000 payout → $4900 profit (50x ROI) ⭐
Outcome 2 (2c)  → 1500 shares → $1500 payout → $1400 profit (15x ROI)
Outcome 3 (5c)  → 300 shares  → $300 payout  → $200 profit (3x ROI)
Outcome 4 (10c) → 50 shares   → $50 payout   → -$50 loss (-0.5x ROI)
```

## Documentation

- [How Polymarket Works](docs/POLYMARKET.md)
- [Advanced Strategies](docs/STRATEGIES.md)
- [Bot Integration](docs/BOT.md)
- [API Reference](docs/API.md)

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Ideas for contributors:
- [ ] Live API integration with Polymarket
- [ ] Web UI (Flask/FastAPI + React)
- [ ] Telegram bot integration
- [ ] Discord bot integration
- [ ] Historical odds tracking
- [ ] Portfolio tracking

## License

MIT License - see [LICENSE](LICENSE) for details.

## Disclaimer

⚠️ **This tool is for educational purposes only.**

- Not financial advice
- Prediction markets involve risk
- Always do your own research
- Only invest what you can afford to lose

## Support

- 🐛 [Report bugs](https://github.com/yourusername/polymarket-odds-calc/issues)
- 💡 [Request features](https://github.com/yourusername/polymarket-odds-calc/issues)
- 💬 [Join Discord](https://discord.gg/yourserver) (coming soon)

## Credits

Built by [@yourname](https://github.com/yourname)

Inspired by the Polymarket community 🙌

---

**Star ⭐ this repo if you find it useful!**
