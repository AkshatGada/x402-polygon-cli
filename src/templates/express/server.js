import express from "express";
import { paymentMiddleware } from "x402-express";

const app = express();

const FACILITATOR_URL = process.env.FACILITATOR_URL || "https://x402-amoy.polygon.technology";

console.log("=".repeat(80));
console.log("🚀 X402 Seller Server Configuration");
console.log("=".repeat(80));
console.log(`📍 Facilitator URL: ${FACILITATOR_URL}`);
console.log(`💰 Receiving Wallet: ${process.env.WALLET_ADDRESS || 'SET_IN_ENV'}`);
console.log(`🌐 Network: ${process.env.NETWORK || 'polygon-amoy'}`);
console.log("=".repeat(80));

app.use(paymentMiddleware(
  process.env.WALLET_ADDRESS || "0x0000000000000000000000000000000000000000",
  {
    "GET /weather": {
      price: "$0.001",
      network: process.env.NETWORK || "polygon-amoy",
    },
  },
  {
    url: FACILITATOR_URL,
  }
));

// Implement your route
app.get("/weather", (req, res) => {
  res.send({
    report: {
      weather: "cloudy",
      temperature: 70,
    },
  });
});

const PORT = process.env.PORT || 4021;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

