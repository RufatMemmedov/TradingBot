// W Formasyonu için giriş, SL ve TP hesaplaması
export const calculateWFormation = (data) => {
    const lows = data.map(d => d.low);
    const highs = data.map(d => d.high);
  
    const neckline = Math.max(highs[highs.length - 4], highs[highs.length - 2]);
    const stopLoss = Math.min(lows[lows.length - 4], lows[lows.length - 2]);
    const takeProfit = neckline + (neckline - stopLoss);
  
    return {
      entry: neckline,
      stopLoss,
      takeProfit,
    };
  };
  
  // M Formasyonu için giriş, SL ve TP hesaplaması
  export const calculateMFormation = (data) => {
    const lows = data.map(d => d.low);
    const highs = data.map(d => d.high);
  
    const neckline = Math.min(lows[lows.length - 4], lows[lows.length - 2]);
    const stopLoss = Math.max(highs[highs.length - 4], highs[highs.length - 2]);
    const takeProfit = neckline - (stopLoss - neckline);
  
    return {
      entry: neckline,
      stopLoss,
      takeProfit,
    };
  };
  
  // Baş ve Omuzlar Formasyonu için giriş, SL ve TP hesaplaması
  export const calculateHeadAndShoulders = (peaks) => {
    const leftShoulder = peaks[0];
    const head = peaks[1];
    const rightShoulder = peaks[2];
  
    const neckline = Math.min(leftShoulder.price, rightShoulder.price);
    const stopLoss = head.price;
    const takeProfit = neckline - (head.price - neckline);
  
    return {
      entry: neckline,
      stopLoss,
      takeProfit,
    };
  };
  
  // Ters Baş ve Omuzlar Formasyonu için giriş, SL ve TP hesaplaması
  export const calculateInverseHeadAndShoulders = (troughs) => {
    const leftShoulder = troughs[0];
    const head = troughs[1];
    const rightShoulder = troughs[2];
  
    const neckline = Math.max(leftShoulder.price, rightShoulder.price);
    const stopLoss = head.price;
    const takeProfit = neckline + (neckline - head.price);
  
    return {
      entry: neckline,
      stopLoss,
      takeProfit,
    };
  };
  