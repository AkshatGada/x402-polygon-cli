import { config } from "dotenv";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { paymentMiddleware, Network, Resource } from "x402-hono";

config();

const facilitatorUrl = (process.env.FACILITATOR_URL || "https://x402-amoy.polygon.technology") as Resource;
const payTo = (process.env.WALLET_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;
const network = (process.env.NETWORK || "polygon-amoy") as Network;

if (!facilitatorUrl || !payTo || payTo === "0x0000000000000000000000000000000000000000") {
  console.error("Missing required environment variables: FACILITATOR_URL and WALLET_ADDRESS");
  process.exit(1);
}

const app = new Hono();

console.log("=".repeat(80));
console.log("🚀 X402 Seller Server Configuration");
console.log("=".repeat(80));
console.log(`📍 Facilitator URL: ${facilitatorUrl}`);
console.log(`💰 Receiving Wallet: ${payTo}`);
console.log(`🌐 Network: ${network}`);
console.log("=".repeat(80));

app.use(
  paymentMiddleware(
    payTo,
    {
      "/weather": {
        price: "$0.001",
        network,
      },
    },
    {
      url: facilitatorUrl,
    },
  ),
);

app.get("/weather", c => {
  return c.json({
    report: {
      weather: "sunny",
      temperature: 70,
    },
  });
});

const PORT = parseInt(process.env.PORT || "4021", 10);
serve({
  fetch: app.fetch,
  port: PORT,
});

