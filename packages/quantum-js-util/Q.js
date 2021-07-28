//  Copyright © 2019–2020, Stewart Smith. See LICENSE for details.

const logger = require('./Logging');
const misc = require('./Misc');
const mathf = require('./Math-Functions');
const {ComplexNumber} = require('./Q-ComplexNumber');
const {Gate} = require('./Q-Gate');
const {Qubit} = require('./Q-Qubit');
const {Matrix} = require('./Q-Matrix');
const {History} = require('./Q-History');
const {Circuit} = require('./Q-ComplexNumber');



const Q = function () {
  //  Did we send arguments of the form
  //  ( bandwidth, timewidth )?

  if (
    arguments.length === 2 &&
    Array.from(arguments).every(function (argument) {
      return isUsefulInteger(argument);
    })
  ) {
    return new Circuit(arguments[0], arguments[1]);
  }

  //  Otherwise assume we are creating a circuit
  //  from a text block.

  return Circuit.fromText(arguments[0]);
};


console.log(`


  QQQQQQ
QQ      QQ
QQ      QQ
QQ      QQ
QQ  QQ  QQ
QQ    QQ 
  QQQQ  ${misc.constants.REVISION}    



https://quantumjavascript.app



`);

module.exports = {logger, misc, mathf, ComplexNumber, Matrix, Gate, Qubit, History, Circuit, Q};

