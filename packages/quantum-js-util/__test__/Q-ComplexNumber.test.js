const {ComplexNumber} = require('../Q-ComplexNumber');
const {constants} = require('../Misc');
console.log(ComplexNumber)
let num = new ComplexNumber(4, 0);
// console.log("constants: ", num.constants)
// console.log("misc.constants: ", constants);
console.log(ComplexNumber.E)
test("Trivial", () => expect(1).toBe(1));
