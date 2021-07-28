//  Copyright © 2019–2020, Stewart Smith. See LICENSE for details.
import { Matrix } from "./Q-Matrix.mjs";
import { Gate } from "./Q-Gate.mjs";
import { ComplexNumber } from "./Q-ComplexNumber.mjs";
import * as misc from "./Misc.mjs"
const logger = require("./Logging.mjs");

Qubit = function (a, b, symbol, name) {
  //  If we’ve received an instance of Matrix as our first argument
  //  then we’ll assume there are no further arguments
  //  and just use that matrix as our new Qubit instance.

  if (Matrix.isMatrixLike(a) && b === undefined) {
    b = a.rows[1][0];
    a = a.rows[0][0];
  } else {
    //  All of our internal math now uses complex numbers
    //  rather than Number literals
    //  so we’d better convert!

    if (typeof a === "number") a = new ComplexNumber(a, 0);
    if (typeof b === "number") b = new ComplexNumber(b, 0);

    //  If we receive undefined (or garbage inputs)
    //  let’s try to make it useable.
    //  This way we can always call Qubit with no arguments
    //  to make a new qubit available for computing with.

    if (a instanceof ComplexNumber !== true) a = new ComplexNumber(1, 0);
    if (b instanceof ComplexNumber !== true) {
      //  1 - |𝒂|² = |𝒃|²
      //  So this does NOT account for if 𝒃 ought to be imaginary or not.
      //  Perhaps for completeness we could randomly decide
      //  to flip the real and imaginary components of 𝒃 after this line?

      b = ComplexNumber.ONE.subtract(Math.pow(a.absolute(), 2)).squareRoot();
    }
  }

  //  Sanity check!
  //  Does this constraint hold true? |𝒂|² + |𝒃|² = 1

  if (
    Math.pow(a.absolute(), 2) + Math.pow(b.absolute(), 2) - 1 >
    misc.constants.EPSILON
  )
    return logger.error(
      `Qubit could not accept the initialization values of a=${a} and b=${b} because their squares do not add up to 1.`
    );

  Matrix.call(this, [a], [b]);
  this.index = Qubit.index++;

  //  Convenience getters and setters for this qubit’s
  //  controll bit and target bit.

  Object.defineProperty(this, "alpha", {
    get: function () {
      return this.rows[0][0];
    },
    set: function (n) {
      this.rows[0][0] = n;
    },
  });
  Object.defineProperty(this, "beta", {
    get: function () {
      return this.rows[1][0];
    },
    set: function (n) {
      this.rows[1][0] = n;
    },
  });

  //  Used for Dirac notation: |?⟩

  if (typeof symbol === "string") this.symbol = symbol;
  if (typeof name === "string") this.name = name;
  if (this.symbol === undefined || this.name === undefined) {
    const found = Object.values(Qubit.constants).find(function (qubit) {
      return a.isEqualTo(qubit.alpha) && b.isEqualTo(qubit.beta);
    });
    if (found === undefined) {
      this.symbol = "?";
      this.name = "Unnamed";
    } else {
      if (this.symbol === undefined) this.symbol = found.symbol;
      if (this.name === undefined) this.name = found.name;
    }
  }
};
//Qubit inherits from Matrix.
Qubit.prototype = Object.create(Matrix.prototype);
Qubit.prototype.constructor = Qubit;

Object.assign(Qubit, {
  index: 0,
  help: function () {
    return help(this);
  },
  constants: {},
  createConstant: function (key, value) {
    this[key] = value;
    this.constants[key] = this[key];
    Object.freeze(this[key]);
  },
  createConstants: function () {
    if (arguments.length % 2 !== 0) {
      return logger.error(
        "Q attempted to create constants with invalid (KEY, VALUE) pairs."
      );
    }
    for (let i = 0; i < arguments.length; i += 2) {
      this.createConstant(arguments[i], arguments[i + 1]);
    }
  },

  findBy: function (key, value) {
    return Object.values(Qubit.constants).find(function (item) {
      if (typeof value === "string" && typeof item[key] === "string") {
        return value.toLowerCase() === item[key].toLowerCase();
      }
      return value === item[key];
    });
  },
  findBySymbol: function (symbol) {
    return Qubit.findBy("symbol", symbol);
  },
  findByName: function (name) {
    return Qubit.findBy("name", name);
  },
  findByBeta: function (beta) {
    if (beta instanceof ComplexNumber === false) {
      beta = new ComplexNumber(beta);
    }
    return Object.values(Qubit.constants).find(function (qubit) {
      return qubit.beta.isEqualTo(beta);
    });
  },
  areEqual: function (qubit0, qubit1) {
    return (
      qubit0.alpha.isEqualTo(qubit1.alpha) && qubit0.beta.isEqualTo(qubit1.beta)
    );
  },
  collapse: function (qubit) {
    const alpha2 = Math.pow(qubit.alpha.absolute(), 2),
      beta2 = Math.pow(qubit.beta.absolute(), 2),
      randomNumberRange = Math.pow(2, 32) - 1,
      randomNumber = new Uint32Array(1);

    // console.log( 'alpha^2', alpha2 )
    // console.log( 'beta^2', beta2 )
    window.crypto.getRandomValues(randomNumber);
    const randomNumberNormalized = randomNumber / randomNumberRange;
    if (randomNumberNormalized <= alpha2) {
      return new Qubit(1, 0);
    } else return new Qubit(0, 1);
  },
  applyGate: function (qubit, gate, ...args) {
    //TODO test...currently you're updating the gate's matrix property rather than returning a separate instance of the matrix.
    //this is okay if "gate" is not one of the constants. otherwise, it's bad.
    `
		This is means of inverting what comes first:
		the Gate or the Qubit?
		If the Gate only operates on a single qubit,
		then it doesn’t matter and we can do this:
		`;

    if (gate instanceof Gate === false)
      return logger.error(
        `Qubit attempted to apply something that was not a gate to this qubit #${qubit.index}.`
      );
    if (gate == Gate.findBy(gate.symbol))
      return logger.error(`Qubit attempted to apply a reference to the gate constant ${gate.symbol} rather than
															a copy. This is disallowed.`);
    else {
      gate.updateMatrix$(...args);
      return new Qubit(gate.matrix.multiply(qubit));
    }
  },
  toText: function (qubit) {
    //return `|${qubit.beta.toText()}⟩`
    return qubit.alpha.toText() + "\n" + qubit.beta.toText();
  },
  toStateVectorText: function (qubit) {
    return `|${qubit.beta.toText()}⟩`;
  },
  toStateVectorHtml: function (qubit) {
    return `<span class="Q-state-vector ket">${qubit.beta.toText()}</span>`;
  },

  //  This code was a pain in the ass to figure out.
  //  I’m not fluent in trigonometry
  //  and none of the quantum primers actually lay out
  //  how to convert arbitrary qubit states
  //  to Bloch Sphere representation.
  //  Oh, they provide equivalencies for specific states, sure.
  //  I hope this is useful to you
  //  unless you are porting this to a terrible language
  //  like C# or Java or something ;)

  toBlochSphere: function (qubit) {
    `
		Based on this qubit’s state return the
		Polar angle θ (theta),
		azimuth angle ϕ (phi),
		Bloch vector,
		corrected surface coordinate.

		https://en.wikipedia.org/wiki/Bloch_sphere
		`;

    //  Polar angle θ (theta).

    const theta = ComplexNumber.arcCosine(qubit.alpha).multiply(2);
    if (isNaN(theta.real)) theta.real = 0;
    if (isNaN(theta.imaginary)) theta.imaginary = 0;

    //  Azimuth angle ϕ (phi).

    const phi = ComplexNumber.log(
      qubit.beta.divide(ComplexNumber.sine(theta.divide(2)))
    ).divide(ComplexNumber.I);
    if (isNaN(phi.real)) phi.real = 0;
    if (isNaN(phi.imaginary)) phi.imaginary = 0;

    //  Bloch vector.

    const vector = {
      x: ComplexNumber.sine(theta).multiply(ComplexNumber.cosine(phi)).real,
      y: ComplexNumber.sine(theta).multiply(ComplexNumber.sine(phi)).real,
      z: ComplexNumber.cosine(theta).real,
    };

    //  Bloch vector’s axes are wonked.
    //  Let’s “correct” them for use with Three.js, etc.

    const position = {
      x: vector.y,
      y: vector.z,
      z: vector.x,
    };

    return {
      //  Wow does this make tweening easier down the road.

      alphaReal: qubit.alpha.real,
      alphaImaginary: qubit.alpha.imaginary,
      betaReal: qubit.beta.real,
      betaImaginary: qubit.beta.imaginary,

      //  Ummm... I’m only returnig the REAL portions. Please forgive me!

      theta: theta.real,
      phi: phi.real,
      vector, //  Wonked YZX vector for maths because maths.
      position, //  Un-wonked XYZ for use by actual 3D engines.
    };
  },
  fromBlochVector: function (x, y, z) {
    //basically  from a Pauli  Rotation
  },
});

Qubit.createConstants(
  //  Opposing pairs:
  //  |H⟩ and |V⟩
  //  |D⟩ and |A⟩
  //  |R⟩ and |L⟩

  "HORIZONTAL",
  new Qubit(1, 0, "H", "Horizontal"), //  ZERO.
  "VERTICAL",
  new Qubit(0, 1, "V", "Vertical"), //  ONE.
  "DIAGONAL",
  new Qubit(Math.SQRT1_2, Math.SQRT1_2, "D", "Diagonal"),
  "ANTI_DIAGONAL",
  new Qubit(Math.SQRT1_2, -Math.SQRT1_2, "A", "Anti-diagonal"),
  "RIGHT_HAND_CIRCULAR_POLARIZED",
  new Qubit(
    Math.SQRT1_2,
    new ComplexNumber(0, -Math.SQRT1_2),
    "R",
    "Right-hand Circular Polarized"
  ), //  RHCP
  "LEFT_HAND_CIRCULAR_POLARIZED",
  new Qubit(
    Math.SQRT1_2,
    new ComplexNumber(0, Math.SQRT1_2),
    "L",
    "Left-hand Circular Polarized"
  ) //  LHCP
);

Object.assign(Qubit.prototype, {
  copy$: function (matrix) {
    if (Matrix.isMatrixLike(matrix) !== true)
      return logger.error(
        `Qubit attempted to copy something that was not a matrix in this qubit #${qubit.index}.`,
        this
      );

    if (Matrix.haveEqualDimensions(matrix, this) !== true)
      return logger.error(
        `Qubit cannot copy matrix#${matrix.index} of dimensions ${matrix.columns.length}x${matrix.rows.length} in to this qubit #${this.index} of dimensions ${this.columns.length}x${this.rows.length} because their dimensions do not match.`,
        this
      );

    const that = this;
    matrix.rows.forEach(function (row, r) {
      row.forEach(function (n, c) {
        that.rows[r][c] = n;
      });
    });
    this.dirac = matrix.dirac;
    return this;
  },
  clone: function () {
    return new Qubit(this.alpha, this.beta);
  },
  isEqualTo: function (otherQubit) {
    return Qubit.areEqual(this, otherQubit); //  Returns a Boolean, breaks function chaining!
  },
  collapse: function () {
    return Qubit.collapse(this);
  },
  applyGate: function (gate, ...args) {
    return Qubit.applyGate(this, gate, ...args);
  },
  toText: function () {
    return Qubit.toText(this); //  Returns a String, breaks function chaining!
  },
  toStateVectorText: function () {
    return Qubit.toStateVectorText(this); //  Returns a String, breaks function chaining!
  },
  toStateVectorHtml: function () {
    return Qubit.toStateVectorHtml(this); //  Returns a String, breaks function chaining!
  },
  toBlochSphere: function () {
    return Qubit.toBlochSphere(this); //  Returns an Object, breaks function chaining!
  },
  collapse$: function () {
    return this.copy$(Qubit.collapse(this));
  },
  applyGate$: function (gate) {
    return this.copy$(Qubit.applyGate(this, gate));
  },
});

export { Qubit };
