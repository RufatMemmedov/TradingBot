import { client } from "../config/binanceConfig.js";

export const getHistoricalData = async (symbol, interval, limit = 100) => {
    try {
        const candles = await client.candles({ symbol, interval, limit });
        return candles.map(c => ({
            time: c.openTime,
            open: parseFloat(c.open),
            high: parseFloat(c.high),
            low: parseFloat(c.low),
            close: parseFloat(c.close),
            volume: parseFloat(c.volume),
        }));
    } catch (error) {
        console.error('Veri çekerken hata:', error.message);
        await new Promise(resolve => setTimeout(resolve, 3000));
        return getHistoricalData(symbol, interval, limit); // Tekrar dene
    }
}

// Minimum Sipariş Miktarını Al
export const getMinimumOrderQuantity =async  (symbol) => {
    const exchangeInfo = await client.futuresExchangeInfo();
    const symbolInfo = exchangeInfo.symbols.find(s => s.symbol === symbol);
    const filters = symbolInfo.filters;
  
    const lotSizeFilter = filters.find(f => f.filterType === 'LOT_SIZE');
    const minQty = parseFloat(lotSizeFilter.minQty); // Minimum lot miktarı
    const stepSize = parseFloat(lotSizeFilter.stepSize); // Adım boyutu
  
    return { minQty, stepSize };
  }
  