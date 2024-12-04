export const detectWFormation = (data, symbol) => {
  const lows = data.map(d => d.low);
  const highs = data.map(d => d.high);

  // W Formasyonu Kontrolü
  const isWFormation =
    lows[lows.length - 4] < highs[lows.length - 5] &&
    lows[lows.length - 2] < lows[lows.length - 3] &&
    lows[lows.length - 2] < highs[lows.length - 1] &&
    lows[lows.length - 2] < lows[lows.length - 1];

  if (isWFormation) {
    
    return 'W';
  }

  return null;
};

export const detectMFormation = (data, symbol) => {
  const lows = data.map(d => d.low);
  const highs = data.map(d => d.high);

  // M Formasyonu Kontrolü
  const isMFormation =
    highs[highs.length - 4] > lows[lows.length - 5] &&
    highs[highs.length - 2] > highs[highs.length - 3] &&
    highs[highs.length - 2] > lows[highs.length - 1] &&
    highs[highs.length - 2] > highs[highs.length - 1];

  if (isMFormation) {
    
    return 'M';
  }

  return null;
};

export const detectHeadAndShoulders = historicalData => {
  const peaks = findLocalPeaks(historicalData);

  if (peaks.length >= 3) {
    const leftShoulder = peaks[0];
    const head = peaks[1];
    const rightShoulder = peaks[2];

    if (
      head.price > leftShoulder.price &&
      head.price > rightShoulder.price &&
      rightShoulder.price < leftShoulder.price
    ) {
      return "Head and Shoulders";
    }
  }
  return null;
};

export const detectInverseHeadAndShoulders = historicalData => {
  const troughs = findLocalTroughs(historicalData);

  if (troughs.length >= 3) {
    const leftShoulder = troughs[0];
    const head = troughs[1];
    const rightShoulder = troughs[2];

    if (
      head.price < leftShoulder.price &&
      head.price < rightShoulder.price &&
      rightShoulder.price > leftShoulder.price
    ) {
      return "Inverse Head and Shoulders";
    }
  }
  return null;
};

export const findLocalPeaks = historicalData => {
  const peaks = [];
  for (let i = 1; i < historicalData.length - 1; i++) {
    if (
      historicalData[i].price > historicalData[i - 1].price &&
      historicalData[i].price > historicalData[i + 1].price
    ) {
      peaks.push(historicalData[i]);
    }
  }
  return peaks;
};

export const findLocalTroughs = historicalData => {
  const troughs = [];
  for (let i = 1; i < historicalData.length - 1; i++) {
    if (
      historicalData[i].price < historicalData[i - 1].price &&
      historicalData[i].price < historicalData[i + 1].price
    ) {
      troughs.push(historicalData[i]);
    }
  }
  return troughs;
};

export const detectDoubleTop = historicalData => {
  const peaks = findLocalPeaks(historicalData);

  if (peaks.length >= 2) {
    const firstPeak = peaks[0];
    const secondPeak = peaks[1];

    if (Math.abs(firstPeak.price - secondPeak.price) <= 0.02) {
      return "Double Top";
    }
  }
  return null;
};

export const detectDoubleBottom = data => {
  for (let i = 3; i < data.length; i++) {
    const prevLow = data[i - 3].low;
    const currentLow = data[i - 1].low;
    const afterLow = data[i].low;

    if (
      Math.abs(prevLow - currentLow) < 0.02 &&
      Math.abs(currentLow - afterLow) < 0.02
    ) {
      return 'Double Bottom';
    }
  }
  return null;
};

export const detectTripleTop = data => {
  for (let i = 4; i < data.length; i++) {
    const prevTop = data[i - 4].high;
    const currentTop = data[i - 2].high;
    const afterTop = data[i].high;

    if (
      Math.abs(prevTop - currentTop) < 0.02 &&
      Math.abs(currentTop - afterTop) < 0.02
    ) {
      return 'Triple Top';
    }
  }
  return null;
};

export const detectTripleBottom = data => {
  for (let i = 4; i < data.length; i++) {
    const prevBottom = data[i - 4].low;
    const currentBottom = data[i - 2].low;
    const afterBottom = data[i].low;

    if (
      Math.abs(prevBottom - currentBottom) < 0.02 &&
      Math.abs(currentBottom - afterBottom) < 0.02
    ) {
      return 'Triple Bottom';
    }
  }
  return null;
};

export const detectHammerFormation = data => {
  for (let i = 1; i < data.length; i++) {
    const currentCandle = data[i];
    const previousCandle = data[i - 1];

    const bodyLength = Math.abs(currentCandle.open - currentCandle.close);
    const lowerShadowLength = Math.abs(currentCandle.low - Math.min(currentCandle.open, currentCandle.close));
    const upperShadowLength = Math.abs(Math.max(currentCandle.open, currentCandle.close) - currentCandle.high);

    const isHammer =
      bodyLength < (upperShadowLength * 0.3) && // Body is small compared to upper shadow
      lowerShadowLength > bodyLength * 2 && // Lower shadow is at least twice the body
      currentCandle.close > currentCandle.open && // Price is higher at the close
      (currentCandle.close > previousCandle.close || currentCandle.open > previousCandle.open); // The price is rising compared to the previous candle

    if (isHammer) {
      return 'Hammer Formation';
    }
  }
  return null;
};

export const detectInvertedHammerFormation = data => {
  for (let i = 1; i < data.length; i++) {
    const currentCandle = data[i];
    const previousCandle = data[i - 1];

    const bodyLength = Math.abs(currentCandle.open - currentCandle.close);
    const lowerShadowLength = Math.abs(currentCandle.low - Math.min(currentCandle.open, currentCandle.close));
    const upperShadowLength = Math.abs(Math.max(currentCandle.open, currentCandle.close) - currentCandle.high);

    const isInvertedHammer =
      bodyLength < (lowerShadowLength * 0.3) && // Body is small compared to lower shadow
      upperShadowLength > bodyLength * 2 && // Upper shadow is at least twice the body
      currentCandle.close > currentCandle.open && // Price is higher at the close
      (currentCandle.close > previousCandle.close || currentCandle.open > previousCandle.open); // The price is rising compared to the previous candle

    if (isInvertedHammer) {
      return 'Inverted Hammer Formation';
    }
  }
  return null;
};

export const detectFlag = (data) => {
  for (let i = 5; i < data.length; i++) {
    const highs = data.slice(i - 5, i).map(d => d.high);
    const lows = data.slice(i - 5, i).map(d => d.low);

    const isFlag = highs[0] > highs[1] &&
                   highs[1] > highs[2] &&
                   lows[0] > lows[1] &&
                   lows[1] > lows[2] &&
                   Math.abs(highs[3] - lows[3]) < 0.02 * highs[3];

    if (isFlag) {
      return "Flag";
    }
  }
  return null;
};

export const detectPennant = (data) => {
  for (let i = 5; i < data.length; i++) {
    const highs = data.slice(i - 5, i).map(d => d.high);
    const lows = data.slice(i - 5, i).map(d => d.low);

    const isPennant = highs[0] > highs[1] &&
                      highs[1] > highs[2] &&
                      lows[0] > lows[1] &&
                      lows[1] > lows[2] &&
                      Math.abs(highs[3] - lows[3]) < 0.01 * highs[3];

    if (isPennant) {
      return "Pennant";
    }
  }
  return null;
};

export const detectSymmetricalTriangle = (data) => {
  for (let i = 5; i < data.length; i++) {
    const highs = data.slice(i - 5, i).map(d => d.high);
    const lows = data.slice(i - 5, i).map(d => d.low);

    const isTriangle = highs[0] > highs[1] &&
                       highs[1] > highs[2] &&
                       lows[0] < lows[1] &&
                       lows[1] < lows[2] &&
                       Math.abs(highs[2] - lows[2]) < 0.02 * highs[2];

    if (isTriangle) {
      return "Symmetrical Triangle";
    }
  }
  return null;
};

export const detectAscendingTriangle = (data) => {
  for (let i = 5; i < data.length; i++) {
    const highs = data.slice(i - 5, i).map(d => d.high);
    const lows = data.slice(i - 5, i).map(d => d.low);

    const isAscendingTriangle = Math.abs(highs[0] - highs[1]) < 0.01 * highs[0] &&
                                lows[0] < lows[1] &&
                                lows[1] < lows[2] &&
                                Math.abs(highs[2] - highs[1]) < 0.01 * highs[2];

    if (isAscendingTriangle) {
      return "Ascending Triangle";
    }
  }
  return null;
};

export const detectDescendingTriangle = (data) => {
  for (let i = 5; i < data.length; i++) {
    const highs = data.slice(i - 5, i).map(d => d.high);
    const lows = data.slice(i - 5, i).map(d => d.low);

    const isDescendingTriangle = Math.abs(lows[0] - lows[1]) < 0.01 * lows[0] &&
                                 highs[0] > highs[1] &&
                                 highs[1] > highs[2] &&
                                 lows[2] < lows[1];

    if (isDescendingTriangle) {
      return "Descending Triangle";
    }
  }
  return null;
};

export const detectRectangle = (data) => {
  for (let i = 5; i < data.length; i++) {
    const highs = data.slice(i - 5, i).map(d => d.high);
    const lows = data.slice(i - 5, i).map(d => d.low);

    const isRectangle = Math.abs(highs[0] - highs[4]) < 0.01 * highs[0] &&
                        Math.abs(lows[0] - lows[4]) < 0.01 * lows[0] &&
                        highs.every((high, index) => high >= lows[index]);

    if (isRectangle) {
      return "Rectangle";
    }
  }
  return null;
};

export const detectRisingWedge = (data) => {
  for (let i = 5; i < data.length; i++) {
    const highs = data.slice(i - 5, i).map(d => d.high);
    const lows = data.slice(i - 5, i).map(d => d.low);

    const isRisingWedge = highs[0] < highs[1] &&
                          highs[1] < highs[2] &&
                          lows[0] < lows[1] &&
                          lows[1] < lows[2] &&
                          (highs[4] - lows[4]) < (highs[0] - lows[0]);

    if (isRisingWedge) {
      return "Rising Wedge";
    }
  }
  return null;
};

export const detectFallingWedge = (data) => {
  for (let i = 5; i < data.length; i++) {
    const highs = data.slice(i - 5, i).map(d => d.high);
    const lows = data.slice(i - 5, i).map(d => d.low);

    const isFallingWedge = highs[0] > highs[1] &&
                           highs[1] > highs[2] &&
                           lows[0] > lows[1] &&
                           lows[1] > lows[2] &&
                           (highs[4] - lows[4]) < (highs[0] - lows[0]);

    if (isFallingWedge) {
      return "Falling Wedge";
    }
  }
  return null;
};

export const detectElliottWave = (data) => {
  const waves = [];
  
  for (let i = 4; i < data.length; i++) {
    const wave1 = data[i - 4].high;
    const wave2 = data[i - 3].low;
    const wave3 = data[i - 2].high;
    const wave4 = data[i - 1].low;
    const wave5 = data[i].high;

    if (
      wave1 < wave3 && 
      wave3 > wave5 && 
      wave2 < wave4 && 
      wave4 < wave1 &&
      wave5 > wave3
    ) {
      waves.push({
        wave1,
        wave2,
        wave3,
        wave4,
        wave5
      });
    }
  }

  return waves.length > 0 ? "Elliott Dalga Formasyonu" : null;
};

export const detectChannel = (data) => {
  let upperTrendLine = [];
  let lowerTrendLine = [];

  for (let i = 1; i < data.length; i++) {
    const high = data[i].high;
    const low = data[i].low;

    if (upperTrendLine.length < 2 || high > upperTrendLine[1]) {
      upperTrendLine = [upperTrendLine[1] || high, high];
    }

    if (lowerTrendLine.length < 2 || low < lowerTrendLine[1]) {
      lowerTrendLine = [lowerTrendLine[1] || low, low];
    }

    if (upperTrendLine.length === 2 && lowerTrendLine.length === 2) {
      const upperSlope = upperTrendLine[1] - upperTrendLine[0];
      const lowerSlope = lowerTrendLine[1] - lowerTrendLine[0];

      if (Math.abs(upperSlope - lowerSlope) < 0.02) {
        return "Kanal Formasyonu";
      }
    }
  }

  return null;
};

export const detectParabolicMovement = (data) => {
  for (let i = 2; i < data.length; i++) {
    const prevSlope = data[i - 1].close - data[i - 2].close;
    const currSlope = data[i].close - data[i - 1].close;

    if (currSlope > prevSlope * 1.5) {
      return "Parabolik Hareket";
    }
  }

  return null;
};
