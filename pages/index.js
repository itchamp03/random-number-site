// pages/index.js

export async function getServerSideProps() {
  // Calculate a new number every 15 seconds (same for everyone)
  const now = new Date();
  const interval = 3 * 1000; // 15 seconds
  const timestamp = Math.floor(now.getTime() / interval); // Round to current interval
  const seed = timestamp; // Use this seed to get consistent number

  // Create a pseudo-random number based on the seed (same every 15 seconds)
  const random = (seed * 9301 + 49297) % 233280;
  const number = Math.floor((random / 233280) * 100) + 1;

  return {
    props: {
      number,
    },
  };
}

export default function Home({ number }) {
  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial" }}>
      <h1>Random Number Generator</h1>
      <p style={{ fontSize: "100px", margin: "20px 0" }}>{number}</p>
      <p>(This number updates every 15 seconds for everyone!)</p>
    </div>
  );
}
