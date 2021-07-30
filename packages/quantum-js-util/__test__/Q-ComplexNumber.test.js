const { ComplexNumber } = require("../Q-ComplexNumber");

describe("Testing uniqueness of object instantiation", () => {
  const number_1 = new ComplexNumber(1, 1);
  test("Check that the ComplexNumber '1 + 1j' is created.", () => {
    expect(number_1).toBeDefined();
    expect(number_1.real).toBe(1);
    expect(number_1.imaginary).toBe(1);
  });
  const number_1_index = +number_1.index;
  const number_2 = new ComplexNumber(2, 2);
  test("Check that the '1 + 1j' ComplexNumber has not changed on creation of new ComplexNumber, number_2", () => {
    expect(number_1).toBeDefined();
    expect(number_1.real).toBe(1);
    expect(number_1.imaginary).toBe(1);
    expect(number_1.index).toBe(number_1_index);
  });
  test("Check that the '1 + 1j' ComplexNumber and number_2 are separate instances of ComplexNumber", () => {
    expect(number_2).toBeDefined();
    expect(number_1).not.toBe(number_2);
  });
  test("Check that number_2 represents the complex number '2 + 2j'", () => {
    expect(number_2.real).toBe(2);
    expect(number_2.imaginary).toBe(2);
  });
  test("Check that number_2.index is 1 + number_1.index", () => {
    expect(number_2.index).toBe(number_1.index + 1);
  });
});



describe("Testing instance functions.", () => {
  const number_1 = new ComplexNumber(1, 1);
  describe("Testing clone() function", () => {
    const number_1_clone = number_1.clone();
    test("Clone() returns a new instance of ComplexNumber", () => {
      expect(number_1_clone).toBeDefined();
      expect(number_1_clone instanceof ComplexNumber).toBeTruthy();
      expect(number_1_clone).not.toBe(number_1);
    });
    test("Clone represents the complex number '1 + 1j'", () => {
      expect(number_1_clone.real).toBe(1);
      expect(number_1_clone.imaginary).toBe(1);
    });
  });
  describe("Testing reduce() function", () => {
    test("Check that the '1 + 1j' ComplexNumber reduce() returns the same instance", () => {
      let result = number_1.reduce();
      expect(result).toBe(number_1);
    });
    test("Check that number_2 ('2 + 0j') .reduce() returns the number 2", () => {
      const number_2 = new ComplexNumber(2, 0);
      let result = number_2.reduce();
      expect(result).toBe(2);
    });
  });
  describe("Testing isZero() function", () => {
    test("Check that number_1.isZero() is false", () => {
      expect(number_1.isZero()).toBeFalsy();
    });
    test("Check that the '0 + 0j' ComplexNumber .isZero() is true", () => {
      const number_2 = new ComplexNumber(0, 0);
      expect(number_2.isZero()).toBeTruthy();
    });
  });
  describe("Testing isFinite() function", () => {
    test("Check that number_1.isFinite() is true", () => {
      expect(number_1.isFinite()).toBeTruthy();
    });
    test("Check that the 'Infinity + Infinity j' ComplexNumber .isFinite is false", () => {
      const number_infinite = new ComplexNumber(Infinity, Infinity);
      expect(number_infinite.isFinite()).toBeFalsy();
    });
  });
  describe("Testing isInfinite() function", () => {
    test("Check that number_1.isFinite() is false", () => {
      expect(number_1.isInfinite()).toBeFalsy();
    });
    test("Check that the 'Infinity + Infinity j' ComplexNumber .isFinite is true", () => {
      const number_infinite = new ComplexNumber(Infinity, Infinity);
      expect(number_infinite.isInfinite()).toBeTruthy();
    });
  });
  describe("Testing isEqualTo() function", () => {
    test("Test that the '1 + 1j' ComplexNumber is equal to another instance of the ComplexNumber representing '1 + 1j'", () => {
      const number_2 = new ComplexNumber(1, 1);
      expect(number_1.isEqualTo(number_2)).toBeTruthy();
    });
    test("Test that the '1 + 1j' ComplexNumber is not equal to another instance of the ComplexNumber representing '2 + 1j'", () => {
      const number_2 = new ComplexNumber(2, 1);
      expect(number_1.isEqualTo(number_2)).toBeFalsy();
    });
  });
  describe("Testing absolute() function", () => {
    test("Check that the '-4 + 0j' ComplexNumber .absolute() is 4", () => {
      const number_2 = new ComplexNumber(-4, 0);
      expect(number_2.absolute()).toBe(4);
    });
    test("Check that the '-3 + 4j' ComplexNumber .absolute() is 5", () => {
      const number_2 = new ComplexNumber(-3, 4);
      expect(number_2.absolute()).toBe(5);
    });
  });
  describe("Testing conjugate() function", ()=> {
    test("Check that the '1 + 1j' ComplexNumber .conjugate() is the ComplexNumber representing '1 - 1j'", ()=> {
        const result = number_1.conjugate();
        expect(result instanceof ComplexNumber).toBeTruthy();
        const expected_result = new ComplexNumber(1, -1);
        expect(result.isEqualTo(expected_result)).toBeTruthy();
    });
    test("Check that the '0 + 0j' ComplexNumber .conjugate() is the ComplexNumber representing '0 + 0j'", ()=> {
        const number_2 = new ComplexNumber(0, 0);
        const result = number_2.conjugate();
        expect(result.isZero()).toBeTruthy();
    });
  });
  describe("Testing power() function", ()=> {
      test("Check that ComplexNumber '2 + 0j' raised to the 5th power is the ComplexNumber '32 + 0j'", ()=> {
          const number_2 = new ComplexNumber(2, 0);
          const result = number_2.power(5);
          const expected_result = new ComplexNumber(32, 0);
          expect(result.isEqualTo(expected_result)).toBeTruthy();
      })
      test("Check that ComplexNumber '2 + 0j' raised to the -5th power is the ComplexNumber '1/32 + 0j'", ()=> {
        const number_2 = new ComplexNumber(2, 0);
        const result = number_2.power(-5);
        const expected_result = new ComplexNumber(1/32, 0);
        expect(result.isEqualTo(expected_result)).toBeTruthy();
    })
      test("Implement Test for ComplexNumber with non-zero imaginary component!", ()=>{
          expect(2).toBe(1);
      });
  });
});
