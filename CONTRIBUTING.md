# Contributing to Polymarket Odds Calculator

Thanks for your interest in contributing! 🎉

## How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Add tests** (if applicable)
5. **Commit your changes**
   ```bash
   git commit -m "Add: your feature description"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request**

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/polymarket-odds-calc.git
cd polymarket-odds-calc

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the calculator
python calc.py --interactive
```

## Code Style

- Follow [PEP 8](https://pep8.org/) Python style guide
- Use type hints where appropriate
- Add docstrings to functions and classes
- Keep functions focused and testable

## Testing

```bash
# Run tests (once we add pytest)
pytest

# Test the calculator manually
python calc.py --invest 20 --prices 1,2,3,4
```

## Ideas for Contributors

### 🚀 High Priority
- [ ] Live Polymarket API integration
- [ ] Unit tests with pytest
- [ ] Web UI (Flask/FastAPI + React)
- [ ] Export results to CSV/JSON

### 🤖 Bot Integrations
- [ ] Discord bot
- [ ] Telegram bot
- [ ] Slack integration

### 📊 Features
- [ ] Historical odds tracking
- [ ] Portfolio management
- [ ] Multi-market analysis
- [ ] Risk/reward visualization (charts)
- [ ] Kelly Criterion calculator
- [ ] Arbitrage detection

### 📚 Documentation
- [ ] Add more examples
- [ ] Video tutorials
- [ ] Strategy guides
- [ ] API documentation

## Pull Request Guidelines

- Keep PRs focused (one feature/fix per PR)
- Update README if adding new features
- Add examples for new functionality
- Test your changes thoroughly

## Questions?

- Open an [issue](https://github.com/yourusername/polymarket-odds-calc/issues)
- Join our Discord (coming soon)

## Code of Conduct

Be respectful and constructive. We're all here to learn and build cool stuff together.

---

**Thank you for contributing!** 🙏
