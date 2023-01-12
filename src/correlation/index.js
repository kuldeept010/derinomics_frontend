import { mean, standardDeviation } from "./deviation";

export default function correlationCoefficientR(x, y) {
  var xMean = mean(x)
  var yMean = mean(y)

  var xDeviation = standardDeviation(x)
  var yDeviation = standardDeviation(y)

  var sum = 0;
  for (let i = 0; i < x.length; i++) {
    sum += ((x[i] - xMean) / xDeviation) * ((y[i] - yMean) / yDeviation)
  }

  return sum / (x.length - 1)
}
