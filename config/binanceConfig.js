import dotenv from 'dotenv';
import Binance from 'binance-api-node'; // ESM içe aktarma

dotenv.config();

// Binance API Anahtarları
export const client = Binance.default({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_SECRET_KEY,
});
