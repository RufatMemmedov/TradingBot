import { getActivePositions } from "./controllers/checkBinance.js";
import { getBestTradeOpportunity } from "./controllers/order.js";

async function main() {
    try {
        let activePositions = await getActivePositions();
        let lastUpdatedTime = Date.now();

        while (true) {
            // Pozisyonları her dakika bir güncelle
            if (Date.now() - lastUpdatedTime >= 60000) {
                activePositions = await getActivePositions();
                lastUpdatedTime = Date.now();
                console.log('Aktif pozisyonlar güncellendi.');
            }

            // En iyi ticaret fırsatını gönder
            await getBestTradeOpportunity();
            console.log('Bir sonraki fırsat için bekleniyor...');

            // 30 saniye bekle
            await new Promise(resolve => setTimeout(resolve, 30000));
        }
    } catch (error) {
        console.error('Ana işlem sırasında hata:', error);
    }
}

main();
