import { client } from "../config/binanceConfig.js";

import { RSI, BollingerBands, ATR } from "technicalindicators";
const accountInfo = await client.futuresAccountInfo();

// Teknik Göstergeleri Hesapla (Sembol ile birlikte)
export const calculateIndicators = (data, symbol) => {
  const closes = data.map(d => d.close);
  const highs = data.map(d => d.high);
  const lows = data.map(d => d.low);

  const rsi = RSI.calculate({ values: closes, period: 14 });
  const bb = BollingerBands.calculate({ values: closes, period: 20, stdDev: 2 });
  const atr = ATR.calculate({ high: highs, low: lows, close: closes, period: 14 });

  console.log(`Gösterge Bilgileri (${symbol}):`);
  console.log(`RSI: ${rsi[rsi.length - 1]}`);
  console.log(`Bollinger Bands (Üst): ${bb[bb.length - 1].upper}`);
  console.log(`Bollinger Bands (Alt): ${bb[bb.length - 1].lower}`);
  console.log(`ATR: ${atr[atr.length - 1]}`);
  console.log('-------------------------');

  return { rsi, bb, atr };
};

// Stop Loss ve Take Profit Hesaplama
export const getAtrMultiplier = atr => {
  const atrValue = atr[atr.length - 1];
  if (atrValue > 100) return 1.2; // Yüksek volatilite
  if (atrValue > 50) return 1.5;  // Orta volatilite
  return 2;                       // Düşük volatilite
};

export const calculateStopLossPrice = (entryPrice, atr, direction = 'buy') => {
  const atrMultiplier = getAtrMultiplier(atr);
  const atrValue = atr[atr.length - 1];
  return direction === 'buy'
    ? entryPrice - atrMultiplier * atrValue
    : entryPrice + atrMultiplier * atrValue;
};

export const calculateTakeProfitPrice = (entryPrice, atr, direction = 'buy') => {
  const atrMultiplier = getAtrMultiplier(atr) + 1; // TP için daha yüksek çarpan
  const atrValue = atr[atr.length - 1];
  return direction === 'buy'
    ? entryPrice + atrMultiplier * atrValue
    : entryPrice - atrMultiplier * atrValue;
};

// Kaldıraç Ayarı
export const setLeverage = async (symbol, leverage) => {
  try {
    // Kaldıraç seviyesini ayarla
    await client.futuresLeverage({
      symbol,
      leverage,
    });
    console.log(`${symbol} için kaldıraç ${leverage}x olarak ayarlandı.`);

    // Mevcut marjin tipini kontrol et
    const accountInfo = await client.futuresAccountInfo();
    const currentMarginType = accountInfo.positions.find(
      (position) => position.symbol === symbol
    )?.marginType;

    // Marjin tipini yalnızca farklıysa değiştir
    if (currentMarginType !== 'CROSSED') {
      const marginType = 'CROSSED'; // MarginType türü olarak belirt
      await client.futuresMarginType({
        symbol,
        marginType,
      });
      console.log(`${symbol} için margin modu '${marginType}' olarak ayarlandı.`);
    } else {
      console.log(`${symbol} için margin modu zaten 'CROSSED'.`);
    }
  } catch (error) {
    if (error.response?.data) {
      console.error(`Binance API Hatası: ${error.response.data.msg}`);
    } else {
      console.error('Kaldıraç ve Margin modu ayarlanırken hata oluştu:', error.message);
    }
    throw error;
  }
};
 

// Giriş Stratejisi
export const determineSignal = (symbol, indicators) => {
  const latestRSI = indicators.rsi[indicators.rsi.length - 1];

  if (latestRSI >= 26 && latestRSI <= 30) {
    console.log(`Sinyal: AL (${symbol}) - RSI: ${latestRSI}`);
    return 'BUY';
  }
  if (latestRSI >= 70 && latestRSI <= 74) {
    console.log(`Sinyal: SAT (${symbol}) - RSI: ${latestRSI}`);
    return 'SELL';
  }

  console.log(`Sinyal Yok (${symbol}) - RSI: ${latestRSI}`);
  return null;
}

// Minimum Sipariş Miktarını Al
export const getMinimumOrderQuantity = async (symbol) => {
  const exchangeInfo = await client.futuresExchangeInfo();
  const symbolInfo = exchangeInfo.symbols.find(s => s.symbol === symbol);
  const filters = symbolInfo.filters;

}
