// pages/index.js

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

export async function getServerSideProps() {
  const timestamp = Math.floor(Date.now() / 10000); // updates every 10 seconds

  const updatedStocks = STOCKS.map(stock => {
    const seed = timestamp + stock.symbol.charCodeAt(0);
    const price = simulatePrice(stock.price, stock.volatility, seed);
    return {
      ...stock,
      price,
    };
  });

  const history = updatedStocks.map(stock => ({
    symbol: stock.symbol,
    prev: stock.price,
    high: stock.price,
    low: stock.price,
  }));

  return {
    props: {
      stocks: updatedStocks,
      history,
      lastUpdated: new Date().toISOString(),
    },
  };
}

export default function Home({ stocks, history, lastUpdated }) {
  const tableStyle = {
    margin: 'auto',
    fontSize: '20px',
    marginTop: '30px',
    borderCollapse: 'collapse',
    minWidth: '700px',
    background: '#fff',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  };
  const cellStyle = {
    padding: '12px 18px',
    border: '1px solid #e0e0e0',
    textAlign: 'center',
  };
  const headerStyle = {
    ...cellStyle,
    background: '#f5f5f5',
    fontWeight: 'bold',
    fontSize: '22px',
  };

  return (
    <div style={{ fontFamily: 'Arial', textAlign: 'center', padding: '30px', background: '#f9fafb', minHeight: '100vh' }}>
      <h1 style={{ color: '#222', marginBottom: 0 }}>📈 Fake Stock Ticker</h1>
      <p style={{ color: '#666', marginTop: 8 }}>Prices update every 10 seconds</p>
      <p style={{ color: '#999', fontSize: '14px', marginTop: '-10px' }}>
        Last updated: {new Date(lastUpdated).toLocaleTimeString()}
      </p>
      <table style={tableStyle}>
        <caption style={{ captionSide: 'bottom', fontSize: '16px', marginTop: '10px', color: '#888' }}>
          Simulated stock prices for demonstration purposes only.
        </caption>
        <thead>
          <tr>
            <th style={headerStyle}>Symbol</th>
            <th style={headerStyle}>Price (USD)</th>
            <th style={headerStyle}>Change (%)</th>
            <th style={headerStyle}>Highest</th>
            <th style={headerStyle}>Lowest</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map(stock => {
            const hist = history.find(h => h.symbol === stock.symbol) || {};
            const prev = hist.prev ?? stock.price;
            const high = hist.high ?? stock.price;
            const low = hist.low ?? stock.price;
            const diff = stock.price - prev;
            const percent = prev !== 0 ? (diff / prev) * 100 : 0;
            const percentStr = percent === 0 ? '0.00%' : `${percent > 0 ? '+' : ''}${percent.toFixed(2)}%`;
            const color = percent > 0 ? '#1ca21c' : percent < 0 ? '#d32f2f' : '#888';

            return (
              <tr key={stock.symbol}>
                <td style={cellStyle}>{stock.symbol}</td>
                <td style={cellStyle}>
                  ${stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td style={{ ...cellStyle, color, fontWeight: 'bold' }}>{percentStr}</td>
                <td style={cellStyle}>
                  ${high.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td style={cellStyle}>
                  ${low.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
