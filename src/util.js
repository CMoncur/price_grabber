module.exports = {
  castToInt,
  isNum,
  weightedAverage,
}

// [ String ] -> [ Number ]
function castToInt (xs) {
  return xs
    .map((x) => Number(x))
    .filter((x) => isNum(x))
}

// isNum :: a -> Bool
function isNum (x) {
  return typeof(x) === "number" && !isNaN(x)
}

// weightedAverage :: [ Number ], [ Number ] -> Number
function weightedAverage(prices, volumes) {
  if (prices.length !== volumes.length) {
    throw new TypeError("Weighted Average expects two equal sized lists")
  }

  if (!prices.every((x) => isNum(x)) || !volumes.every((x) => isNum(x))) {
    throw new TypeError("Weighted Average lists must contain only numbers")
  }

  const largestVolume = volumes.reduce((x, xs) => {
    return x > xs ? x : xs
  }, 0)

  const volumeWeights = volumes.map((x) => x / largestVolume)

  const weightTotal = volumeWeights.reduce((x, xs) => x + xs)

  const weightedPriceTotal = prices
    .map((x, i) => x * volumeWeights[i])
    .reduce((x, xs) => x + xs)

  return weightedPriceTotal / weightTotal
}
