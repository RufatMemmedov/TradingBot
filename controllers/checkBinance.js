import { client } from "../config/binanceConfig.js";


// TP ve SL seviyelerini al
async function getTakeProfitAndStopLoss(symbol) {
    try {
      const orders = await client.futuresOpenOrders({ symbol });
      orders.forEach(order => {
        if (order.type === 'TAKE_PROFIT_MARKET') {
          console.log(`Take Profit Emir (${symbol}): ${order.price}`);
        }
        if (order.type === 'STOP_MARKET') {
          console.log(`Stop Loss Emir (${symbol}): ${order.stopPrice}`);
        }
  
      });
    } catch (error) {
      console.error('TP/SL emirleri alınırken hata oluştu:', error.message);
    }
  }

export const getActivePositions = async () => {
    try {
        const positions = await client.futuresPositionRisk();
        positions.forEach(position => {
            if (parseFloat(position.positionAmt) !== 0) {
                console.log(`Pozisyon Bilgileri (${position.symbol}):`);
                console.log(`Miktar: ${position.positionAmt}`);
                console.log(`Giriş Fiyatı: ${position.entryPrice}`);
                console.log(`Likidasyon Fiyatı: ${position.liquidationPrice}`);
                console.log(`Mark Fiyatı: ${position.markPrice}`);
                console.log('-------------------------');

                getTakeProfitAndStopLoss(position.symbol);
            }
        });
    } catch (error) {
        console.error('Pozisyonlar alınırken hata oluştu:', error.message);
    }
};


// Kullanıcı Futures Bakiyesini Al
export const getFuturesBalance = async () => {
    try {
        const accountInfo = await client.futuresAccountBalance();
        const usdtBalance = accountInfo.find(b => b.asset === 'USDT');
        console.log(`Futures Bakiyesi (USDT): ${parseFloat(usdtBalance.balance)}`);
        return parseFloat(usdtBalance.balance);
    } catch (error) {
        console.error('Futures bakiyesi alınırken hata:', error.message);
    }
};

// Mevcut Aktif Emirleri Kontrol Et
export const checkActiveOrders = async  (symbol) => {
    try {
      const openOrders = await client.openOrders({ symbol });
      return openOrders.length > 0;
    } catch (error) {
      console.error('Aktif emirleri kontrol ederken hata:', error.message);
      return false;
    }
  }
  