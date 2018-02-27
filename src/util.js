module.exports = {
  isNum,
  weightedAverage,
}

// isNum :: a -> Bool
function isNum (x) {
  return typeof(x) === "number" && !isNaN(x)
}

// weightedAverage :: [ Number ], [ Number ] -> Number
function weightedAverage(prices, volumes) {
  console.log(prices)
  console.log(volumes)

  return 1
}
