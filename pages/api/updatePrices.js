// pages/api/updatePrices.js
import { db } from '@/lib/firebase';
import { ref, set, get } from 'firebase/database';

const STOCKS = [
  { symbol: 'AAPL', price: 190, volatility: 0.02 },
  { symbol: 'GOOG', price: 2800, volatility: 0.015 },
  { symbol: 'TSLA', price: 700, volatility: 0.03 },
  { symbol: 'AMZN', price: 3300, volatility: 0.017 },
  { symbol: 'MSFT', price: 320, volatility: 0.01 },
];

function pseudoRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function simulatePrice(basePrice, volatility, seed) {
  const changePercent = (pseudoRandom(seed) * 2 - 1) * volatility;
  return +(basePrice * (1 + changePercent)).toFixed(2);
}

export default async function handler(req, res) {
  const timestamp = Math.floor(Date.now() / 10000);

  const updates = {};

  for (const stock of STOCKS) {
    const seed = timestamp + stock.symbol.charCodeAt(0);
    const newPrice = simulatePrice(stock.price, stock.volatility, seed);

    const stockRef = ref(db, `stocks/${stock.symbol}`);
    const snapshot = await get(stockRef);
    const prev = snapshot.exists() ? snapshot.val() : { high: newPrice, low: newPrice };

    updates[stock.symbol] = {
      price: newPrice,
      high: Math.max(newPrice, prev.high),
      low: Math.min(newPrice, prev.low),
    };
  }

  await Promise.all(
    Object.entries(updates).map(([symbol, data]) =>
      set(ref(db, `stocks/${symbol}`), data)
    )
  );

  res.status(200).json({ success: true, updates });
}
