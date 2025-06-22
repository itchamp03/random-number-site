// pages/index.js

// Starting stock prices and volatilities
const STOCKS = [
  { symbol: 'AAPL', price: 190, volatility: 0.02 },
  { symbol: 'GOOG', price: 2800, volatility: 0.015 },
  { symbol: 'TSLA', price: 700, volatility: 0.03 },
  { symbol: 'AMZN', price: 3300, volatility: 0.017 },
  { symbol: 'MSFT', price: 320, volatility: 0.01 },
];

// Deterministic pseudo-random generator
function pseudoRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x); // Returns a number between 0 and 1
}

// Price simulator based on seed and volatility
function simulatePrice(basePrice, volatility, seed) {
  const changePercent = (pseudoRandom(seed) * 2 - 1) * volatility;
  return +(basePrice * (1 + changePercent)).toFixed(2);
}

export async function getServerSideProps() {
  const now = new Date();
  const interval = 10 * 1000; // 10 seconds
  const timestamp = Math.floor(now.getTime() / interval);

  const stocks = STOCKS.map(stock => {
    const seed = timestamp + stock.symbol.charCodeAt(0); // Unique seed per stock
    const updatedPrice = simulatePrice(stock.price, stock.volatility, seed);
    return {
      ...stock,
      price: updatedPrice,
    };
  });

  return {
    props: {
      stocks,
    },
  };
}

export default function Home({ stocks }) {
  return (
    <div style={{ fontFamily: 'Arial', textAlign: 'center', padding: '30px' }}>
      <h1>Fake Stock Ticker</h1>
      <p>Prices update every 10 seconds (same for everyone)</p>
      <table style={{ margin: 'auto', fontSize: '24px', marginTop: '30px' }}>
        <thead>
          <tr>
            <th style={{ padding: '10px' }}>Symbol</th>
            <th style={{ padding: '10px' }}>Price (USD)</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map(stock => (
            <tr key={stock.symbol}>
              <td style={{ padding: '10px' }}>{stock.symbol}</td>
              <td style={{ padding: '10px' }}>${stock.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
