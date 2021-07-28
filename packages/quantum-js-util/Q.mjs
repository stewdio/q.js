//  Copyright © 2019–2020, Stewart Smith. See LICENSE for details.


import Circuit from "./Q-Circuit.mjs";




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


export { Q };
export { Gate } from "./Q-Gate.mjs";
export { Matrix } from "./Q-Matrix.mjs";
export { Qubit } from "./Q-Qubit.mjs";
export { History } from "./Q-History.mjs";
export { ComplexNumber } from "./Q-ComplexNumber.mjs";
export * as logger from "./Logging.mjs";
export * as misc from "./Misc.mjs";
export { Circuit } from "./Q-Circuit.mjs";
