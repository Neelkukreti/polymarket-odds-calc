#!/usr/bin/env python3
"""
Polymarket Odds Calculator
Calculate potential returns for multi-outcome prediction markets
"""

import argparse
import sys
from typing import List, Dict, Tuple
from dataclasses import dataclass
from tabulate import tabulate


@dataclass
class Outcome:
    """Represents a single prediction market outcome"""
    index: int
    price_cents: float
    investment: float
    
    @property
    def price_dollars(self) -> float:
        """Convert cents to dollars"""
        return self.price_cents / 100
    
    @property
    def shares(self) -> float:
        """Calculate number of shares purchased"""
        return self.investment / self.price_dollars
    
    @property
    def payout(self) -> float:
        """Calculate payout if this outcome wins ($1 per share)"""
        return self.shares
    
    def profit(self, total_investment: float) -> float:
        """Calculate net profit (payout - total investment)"""
        return self.payout - total_investment
    
    def roi(self, total_investment: float) -> float:
        """Calculate ROI multiple (payout / investment)"""
        if total_investment == 0:
            return 0
        return self.payout / total_investment


class PolymarketCalculator:
    """Calculator for Polymarket multi-outcome markets"""
    
    def __init__(self, total_investment: float, prices: List[float], 
                 distribution: List[float] = None):
        """
        Args:
            total_investment: Total amount to invest ($)
            prices: List of outcome prices in cents
            distribution: Optional custom investment per outcome ($)
                         If None, splits investment equally
        """
        self.total_investment = total_investment
        self.prices = prices
        self.num_outcomes = len(prices)
        
        # Calculate investment distribution
        if distribution is None:
            # Equal distribution
            investment_per_outcome = total_investment / self.num_outcomes
            self.distribution = [investment_per_outcome] * self.num_outcomes
        else:
            if len(distribution) != self.num_outcomes:
                raise ValueError("Distribution length must match number of outcomes")
            if sum(distribution) != total_investment:
                raise ValueError(f"Distribution sum (${sum(distribution)}) must equal total investment (${total_investment})")
            self.distribution = distribution
        
        # Create outcome objects
        self.outcomes = [
            Outcome(i + 1, price, investment)
            for i, (price, investment) in enumerate(zip(prices, self.distribution))
        ]
    
    def calculate(self) -> List[Dict]:
        """Calculate results for all outcomes"""
        results = []
        for outcome in self.outcomes:
            results.append({
                'Outcome': f"#{outcome.index} ({outcome.price_cents}c)",
                'Investment': f"${outcome.investment:.2f}",
                'Shares': f"{outcome.shares:.2f}",
                'Payout': f"${outcome.payout:.2f}",
                'Profit': f"${outcome.profit(self.total_investment):.2f}",
                'ROI': f"{outcome.roi(self.total_investment):.2f}x"
            })
        return results
    
    def get_best_roi(self) -> Outcome:
        """Find outcome with highest ROI"""
        return max(self.outcomes, key=lambda o: o.roi(self.total_investment))
    
    def get_worst_roi(self) -> Outcome:
        """Find outcome with lowest ROI"""
        return min(self.outcomes, key=lambda o: o.roi(self.total_investment))
    
    def print_results(self):
        """Print formatted results table"""
        results = self.calculate()
        
        print("\n" + "="*70)
        print(f"💰 Polymarket Odds Calculator")
        print("="*70)
        print(f"\nTotal Investment: ${self.total_investment:.2f}")
        print(f"Number of Outcomes: {self.num_outcomes}")
        
        if all(inv == self.distribution[0] for inv in self.distribution):
            print(f"Strategy: Equal distribution (${self.distribution[0]:.2f} per outcome)")
        else:
            print(f"Strategy: Custom distribution")
        
        print("\n" + tabulate(results, headers="keys", tablefmt="grid"))
        
        # Best/worst highlights
        best = self.get_best_roi()
        worst = self.get_worst_roi()
        
        print(f"\n⭐ Best ROI: Outcome #{best.index} ({best.price_cents}c) → "
              f"{best.roi(self.total_investment):.2f}x return")
        print(f"⚠️  Worst ROI: Outcome #{worst.index} ({worst.price_cents}c) → "
              f"{worst.roi(self.total_investment):.2f}x return")
        
        # Risk analysis
        profitable_count = sum(1 for o in self.outcomes 
                              if o.profit(self.total_investment) > 0)
        print(f"\n📊 Risk Analysis:")
        print(f"   Profitable outcomes: {profitable_count}/{self.num_outcomes}")
        print(f"   Breakeven outcome: ~{100 / self.num_outcomes:.1f}c price")
        
        print("\n" + "="*70 + "\n")


def interactive_mode():
    """Interactive CLI mode"""
    print("\n🎲 Polymarket Odds Calculator - Interactive Mode\n")
    
    # Get total investment
    while True:
        try:
            total = float(input("Total investment amount ($): "))
            if total <= 0:
                print("❌ Investment must be positive")
                continue
            break
        except ValueError:
            print("❌ Please enter a valid number")
    
    # Get outcome prices
    while True:
        try:
            prices_input = input("\nOutcome prices in cents (comma-separated, e.g., 1,2,3,4): ")
            prices = [float(p.strip()) for p in prices_input.split(',')]
            if any(p <= 0 or p > 100 for p in prices):
                print("❌ Prices must be between 0 and 100 cents")
                continue
            break
        except ValueError:
            print("❌ Please enter valid numbers separated by commas")
    
    # Ask about distribution
    print(f"\nDistribution strategy:")
    print(f"  1) Equal (${total / len(prices):.2f} per outcome)")
    print(f"  2) Custom amounts")
    
    distribution = None
    choice = input("\nChoose [1/2]: ").strip()
    
    if choice == "2":
        while True:
            try:
                dist_input = input(f"\nInvestment per outcome (comma-separated, must sum to ${total}): ")
                distribution = [float(d.strip()) for d in dist_input.split(',')]
                
                if len(distribution) != len(prices):
                    print(f"❌ Must provide {len(prices)} values")
                    continue
                
                if abs(sum(distribution) - total) > 0.01:  # Allow small float error
                    print(f"❌ Sum (${sum(distribution):.2f}) must equal total (${total:.2f})")
                    continue
                
                break
            except ValueError:
                print("❌ Please enter valid numbers")
    
    # Calculate and display
    calc = PolymarketCalculator(total, prices, distribution)
    calc.print_results()


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(
        description='Calculate Polymarket multi-outcome returns',
        epilog='Example: python calc.py --invest 20 --prices 1,2,3,4'
    )
    
    parser.add_argument(
        '--invest', '-i',
        type=float,
        help='Total investment amount ($)'
    )
    
    parser.add_argument(
        '--prices', '-p',
        type=str,
        help='Outcome prices in cents (comma-separated, e.g., 1,2,3,4)'
    )
    
    parser.add_argument(
        '--distribution', '-d',
        type=str,
        help='Custom investment per outcome (comma-separated, must sum to total)'
    )
    
    parser.add_argument(
        '--interactive',
        action='store_true',
        help='Run in interactive mode'
    )
    
    args = parser.parse_args()
    
    # Interactive mode
    if args.interactive or (not args.invest and not args.prices):
        interactive_mode()
        return
    
    # Command line mode
    if not args.invest or not args.prices:
        parser.print_help()
        sys.exit(1)
    
    try:
        prices = [float(p.strip()) for p in args.prices.split(',')]
        
        distribution = None
        if args.distribution:
            distribution = [float(d.strip()) for d in args.distribution.split(',')]
        
        calc = PolymarketCalculator(args.invest, prices, distribution)
        calc.print_results()
        
    except ValueError as e:
        print(f"❌ Error: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
