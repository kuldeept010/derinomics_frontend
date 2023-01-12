export const mean = (dataset) => {
  var sum = dataset.reduce((a, b) => a + b, 0);
  var m = sum / dataset.length;
  return m;
}

export const deviation = (dataset, unbiased) => {

  var m = mean(dataset)

  var total = 0;
  dataset.forEach(val => {
    total += Math.pow(val - m, 2);
  });

  var n = dataset.length;
  if (unbiased) {
    n--;
  }

  return Math.sqrt(total / n);
}

export const standardDeviation = (dataset) => {
  return deviation(dataset, true);
}

export const populationStandardDeviation = (dataset) => {
  return deviation(dataset)
}
