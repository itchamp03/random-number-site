import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';

const SYMBOLS = ['AAPL', 'GOOG', 'TSLA', 'AMZN', 'MSFT'];

export default function Home() {
  const [stocks, setStocks] = useState({});

  useEffect(() => {
    const stockRefs = SYMBOLS.map(symbol => {
      const r = ref(db, `stocks/${symbol}`);
      return onValue(r, snapshot => {
        setStocks(prev => ({
          ...prev,
          [symbol]: snapshot.val(),
        }));
      });
    });

    return () => {
      stockRefs.forEach(unsub => unsub());
    };
  }, []);

  return (
    <div style={{ fontFamily: 'Arial', padding: '30px', background: '#f5f5f5' }}>
      <h1>📈 Live Fake Stock Prices</h1>
      <table style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Price</th>
            <th>High</th>
            <th>Low</th>
          </tr>
        </thead>
        <tbody>
          {SYMBOLS.map(symbol => {
            const stock = stocks[symbol];
            if (!stock) return null;
            return (
              <tr key={symbol}>
                <td>{symbol}</td>
                <td>${stock.price.toFixed(2)}</td>
                <td>${stock.high.toFixed(2)}</td>
                <td>${stock.low.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
