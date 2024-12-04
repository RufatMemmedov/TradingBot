import {
  setLeverage,
  getMinimumOrderQuantity,
  calculateStopLossPrice,
  calculateTakeProfitPrice
} from "./calculates.js";

import { client } from "../config/binanceConfig.js";
import { getFuturesBalance, checkActiveOrders } from "./checkBinance.js";
import { calculateIndicators, determineSignal } from "./calculates.js";
import { getHistoricalData } from "./dataAnalysis.js";
import {
  detectWFormation,
  detectMFormation,
  detectDoubleBottom,
  detectDoubleTop,
  detectHeadAndShoulders,
  detectInverseHeadAndShoulders,
  detectTripleBottom,
  detectTripleTop,
  detectFlag,
  detectPennant,
  detectInvertedHammerFormation,
  detectHammerFormation,
  detectSymmetricalTriangle,
  detectAscendingTriangle,
  detectDescendingTriangle,
  detectRectangle,
  detectRisingWedge,
  detectFallingWedge,
  detectElliottWave,
  detectChannel,
  detectParabolicMovement,

} from "./findFormations.js";


export const placeOrderWithLeverage = async (symbol, side, balance, leverage, atr, entryPrice) => {
  try {
    // Kaldıraç ayarlama
    await setLeverage(symbol, leverage);

    // Minimum Sipariş Miktarını Al
    const { minQty, stepSize } = await getMinimumOrderQuantity(symbol);

    // Bakiyenin %20'sini kullanarak pozisyon büyüklüğünü hesapla
    const positionSizeUSDT = balance * 0.2; // %20
    let quantity = parseFloat((positionSizeUSDT / entryPrice).toFixed(3)); // Miktar (3 ondalık hassasiyet)

    // Miktarı minimum sipariş miktarına yuvarlayın
    if (quantity < minQty) {
      quantity = minQty; // Minimum sipariş miktarına yuvarla
    }

    // Adım boyutuna uygun hale getirin
    if (quantity % stepSize !== 0) {
      quantity = Math.floor(quantity / stepSize) * stepSize; // Adım boyutuna yuvarla
    }

    // Stop Loss ve Take Profit Hesapla
    const stopLossPrice = calculateStopLossPrice(entryPrice, atr, side === 'BUY' ? 'buy' : 'sell');
    const takeProfitPrice = calculateTakeProfitPrice(entryPrice, atr, side === 'BUY' ? 'buy' : 'sell');

    // Market Emirleri
    const marketOrder = {
      symbol,
      side,
      quantity,
      type: 'MARKET',
    };

    // Emirleri Gönder
    await client.order(marketOrder);
    console.log(`${symbol} için ${side} emir açıldı. Miktar: ${quantity}`);

    // Stop Loss ve Take Profit Emirleri
    const stopOrder = {
      symbol,
      side: side === 'BUY' ? 'SELL' : 'BUY',
      quantity,
      type: 'STOP_MARKET',
      stopPrice: stopLossPrice,
      reduceOnly: true,
    };

    const takeProfitOrder = {
      symbol,
      side: side === 'BUY' ? 'SELL' : 'BUY',
      quantity,
      type: 'LIMIT',
      price: takeProfitPrice,
      timeInForce: 'GTC',
      reduceOnly: true,
    };

    await client.order(stopOrder);
    await client.order(takeProfitOrder);
    console.log(`${symbol} için TP ve SL emirleri yerleştirildi.`);
  } catch (error) {
    if (error.response) {
      // API hatası (örn. Binance API'si)
      console.error(`Binance API Hatası: ${error.response.data.msg}`);
    } else if (error.request) {
      // Ağ isteği hatası
      console.error(`Ağ İsteği Hatası: ${error.message}`);
    } else {
      // Diğer hatalar
      console.error(`Bilinmeyen Hata: ${error.message}`);
    }
    console.error('Hata Detayı:', error);
  }
}

export const getBestTradeOpportunity = async () => {

  const symbols = process.env.COINS.split(','); // Örnek coin isimleri
  const interval = '15m';
  const balance = await getFuturesBalance();

  for (let symbol of symbols) {
    try {
      const historicalData = await getHistoricalData(symbol, interval);
      const indicators = calculateIndicators(historicalData, symbol);
      const signal = determineSignal(symbol, indicators);


      const headAndShoulders = detectHeadAndShoulders(historicalData);
      const inverseHeadAndShoulders = detectInverseHeadAndShoulders(historicalData);
      const doubleTop = detectDoubleTop(historicalData);
      const doubleBottom = detectDoubleBottom(historicalData);
      const tripleTop = detectTripleTop(historicalData);
      const tripleBottom = detectTripleBottom(historicalData);
      const InvertedHammerFormation = detectInvertedHammerFormation(historicalData);
      const HammerFormation = detectHammerFormation(historicalData);
      const WFormation = detectWFormation(historicalData);
      const MFormation = detectMFormation(historicalData);
      const Flag = detectFlag(historicalData);
      const Pennant = detectPennant(historicalData);
      const SymmetricalTriangle = detectSymmetricalTriangle(historicalData);
      const AscendingTriangle = detectAscendingTriangle(historicalData);
      const DescendingTriangle = detectDescendingTriangle(historicalData);
      const Rectangle = detectRectangle(historicalData);
      const RisingWedge = detectRisingWedge(historicalData);
      const FallingWedge = detectFallingWedge(historicalData);
      const ElliottWave = detectElliottWave(historicalData);
      const Channel = detectChannel(historicalData);
      const ParabolicMovement = detectParabolicMovement(historicalData);

      // const  = (historicalData);

      const formationMapping = {
        headAndShoulders: "Baş ve Omuzlar",
        inverseHeadAndShoulders: "Ters Baş ve Omuzlar",
        doubleBottom: "Çift Dip (Double Bottom)",
        doubleTop: "Çift Tepe (Double Top)",
        tripleBottom: "Üçlü Dip (Triple Bottom)",
        tripleTop: "Üçlü Tepe (Triple Top)",
        InvertedHammerFormation: "Ters Çekiç (Inverted Hammer)",
        HammerFormation: "Çekiç (Hammer)",
        MFormation: "M",
        WFormation: "W",
        Flag: "Bayrak",
        ParabolicMovement: "Parabolik Hareket",
        Pennant: "Flama",
        SymmetricalTriangle: "Simetrik Üçgen",
        AscendingTriangle: "Yükselen Üçgen",
        DescendingTriangle: "Alçalan Üçgen",
        Rectangle: "Dikdörtgen",
        RisingWedge: "Yükselen Takoz",
        FallingWedge: "Alçalan Takoz",
        ElliottWave: "Dalga",
        Channel: "Kanal",


        // :"",
      };

      let detectedFormation = null;

      // İlk tespit edilen doğru formasyonu bul
      Object.keys(formationMapping).some((key) => {
        if (eval(key) && interval === '15m') {
          detectedFormation = formationMapping[key];
          return true; // İlk doğru tespit edilen formasyonu bulduğunda döngüden çık
        }
        return false;
      });

      // Sonuçları yazdır
      if (detectedFormation) {
        console.log(`Formasyon Tespit Edildi (${symbol}): ${detectedFormation}`);
      } else {
        console.log(`Formasyon bulunamadı (${symbol}).`);
      }



      // Signal kontrolü ve işlem stratejisi
      if (signal) {
        const entryPrice = historicalData[historicalData.length - 1].close;
        const atr = indicators.atr;

        const stopLossPrice = calculateStopLossPrice(entryPrice, atr, signal === 'BUY' ? 'buy' : 'sell');
        const takeProfitPrice = calculateTakeProfitPrice(entryPrice, atr, signal === 'BUY' ? 'buy' : 'sell');

        console.log(`Coin: ${symbol}`);
        console.log(`Analiz Sonuçları:`);
        console.log(`  RSI: ${indicators.rsi[indicators.rsi.length - 1]}`);
        console.log(`  Bollinger Üst: ${indicators.bb[indicators.bb.length - 1].upper}`);
        console.log(`  Bollinger Alt: ${indicators.bb[indicators.bb.length - 1].lower}`);
        console.log(`  ATR: ${indicators.atr[indicators.atr.length - 1]}`);
        console.log(`Sinyal: ${signal}`);
        console.log(`Giriş Fiyatı: ${entryPrice}`);
        console.log(`Take Profit Fiyatı: ${takeProfitPrice}`);
        console.log(`Stop Loss Fiyatı: ${stopLossPrice}`);
        console.log('-------------------------');

        if (!(await checkActiveOrders(symbol))) {
          await placeOrderWithLeverage(symbol, signal, balance, 10, atr, entryPrice);
        } else {
          console.log(`Aktif emir mevcut: ${symbol}`);
        }
      }
    } catch (error) {
      console.error(`Hata oluştu (${symbol}):`, error.message);
    }
  }
}
