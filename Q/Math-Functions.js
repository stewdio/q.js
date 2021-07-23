//math functions
function hypotenuse(x, y) {
  let a = Math.abs(x),
    b = Math.abs(y);

  if (a < 2048 && b < 2048) {
    return Math.sqrt(a * a + b * b);
  }
  if (a < b) {
    a = b;
    b = x / y;
  } else b = y / x;
  return a * Math.sqrt(1 + b * b);
}

function logHypotenuse(x, y) {
  const a = Math.abs(x),
    b = Math.abs(y);

  if (x === 0) return Math.log(b);
  if (y === 0) return Math.log(a);
  if (a < 2048 && b < 2048) {
    return Math.log(x * x + y * y) / 2;
  }
  return Math.log(x / Math.cos(Math.atan2(y, x)));
}

function hyperbolicSine(n) {
  return (Math.exp(n) - Math.exp(-n)) / 2;
}

function hyperbolicCosine(n) {
  return (Math.exp(n) + Math.exp(-n)) / 2;
}

function round(n, d) {
  if (typeof d !== "number") d = 0;
  const f = Math.pow(10, d);
  return Math.round(n * f) / f;
}

function isUsefulNumber(n) {
  return (
    isNaN(n) === false &&
    (typeof n === "number" || n instanceof Number) &&
    n !== Infinity &&
    n !== -Infinity
  );
}

function isUsefulInteger(n) {
  return isUsefulNumber(n) && Number.isInteger(n);
}

module.exports = {
  isUsefulNumber: isUsefulNumber,
  isUsefulInteger: isUsefulInteger,
  hypotenuse: hypotenuse,
  logHypotenuse: logHypotenuse,
  hyperbolicSine: hyperbolicSine,
  hyperbolicCosine: hyperbolicCosine,
  round: round,
};
