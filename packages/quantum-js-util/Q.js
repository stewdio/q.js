//  Copyright © 2019–2020, Stewart Smith. See LICENSE for details.

const misc = require('./Misc');
const mathf = require('./Math-Functions');
const {Circuit} = require('./Q-Circuit');



Q = function () {
  //  Did we send arguments of the form
  //  ( bandwidth, timewidth )?

  if (
    arguments.length === 2 &&
    Array.from(arguments).every(function (argument) {
      return mathf.isUsefulInteger(argument);
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

module.exports = {Q};

