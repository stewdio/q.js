const {Matrix} = require('../Q-Matrix');
console.log(Matrix.constants['IDENTITY_2X2'].toTsv());
test('trivial', () => expect(1).toBe(1));