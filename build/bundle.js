(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
let {logger, mathf, misc, ComplexNumber, Matrix, Gate, Qubit, Circuit, History, Q} = require('quantum-js-util');
let {Editor, BlochSphere, braket} = require('quantum-js-vis');
global.misc = misc;
global.logger = logger;
global.mathf = mathf;


}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"quantum-js-util":13,"quantum-js-vis":16}],2:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
//Logging functions

function log(verbosity = 0.5, verbosityThreshold, ...remainingArguments) {
  if (verbosity >= verbosityThreshold) console.log(...remainingArguments);
  return "(log)";
}

function error() {
  console.error(...arguments);
  return "(error)";
}

function warn() {
  console.warn(...arguments);
  return "(error)";
}

function extractDocumentation(f) {
  `
        I wanted a way to document code
        that was cleaner, more legible, and more elegant
        than the bullshit we put up with today.
        Also wanted it to print nicely in the console.
        `;

  f = f.toString();

  const begin = f.indexOf("`") + 1,
    end = f.indexOf("`", begin),
    lines = f.substring(begin, end).split("\n");

  function countPrefixTabs(text) {
    //  Is counting tabs “manually”
    //  actually more performant than regex?

    let count = (index = 0);
    while (text.charAt(index++) === "\t") count++;
    return count;
  }

  //-------------------  TO DO!
  //  we should check that there is ONLY whitespace between the function opening and the tick mark!
  //  otherwise it’s not documentation.

  let tabs = Number.MAX_SAFE_INTEGER;

  lines.forEach(function (line) {
    if (line) {
      const lineTabs = countPrefixTabs(line);
      if (tabs > lineTabs) tabs = lineTabs;
    }
  });
  lines.forEach(function (line, i) {
    if (line.trim() === "") line = "\n\n";
    lines[i] = line.substring(tabs).replace(/ {2}$/, "\n");
  });
  return lines.join("");
}

function help(f) {
  if (f === undefined) f = Q;
  return extractDocumentation(f);
}

function toTitleCase(text) {
  text = text.replace(/_/g, " ");
  return text
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.replace(word[0], word[0].toUpperCase());
    })
    .join(" ");
}

function centerText(text, length, filler) {
  if (length > text.length) {
    if (typeof filler !== "string") filler = " ";

    const padLengthLeft = Math.floor((length - text.length) / 2),
      padLengthRight = length - text.length - padLengthLeft;

    return text
      .padStart(padLengthLeft + text.length, filler)
      .padEnd(length, filler);
  } else return text;
}

module.exports = { log, error, help, warn, toTitleCase, centerText };

},{}],4:[function(require,module,exports){
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


module.exports = { isUsefulNumber, isUsefulInteger, hypotenuse, logHypotenuse, hyperbolicCosine, hyperbolicSine, round };

},{}],5:[function(require,module,exports){
(function (process,global){(function (){
const logger = require('./Logging');

const constants = {};
function dispatchCustomEventToGlobal(event_name, detail, terminate_on_error=false, silent=true) {
  try {
    const event = new CustomEvent(event_name, detail);
    if(typeof window != undefined) {
      window.dispatchEvent(event);
    }
    else {
     //if window does exist, global == window is true. So maybe we can just do global.dispatchEvent instead of this wrapper?
     global.dispatchEvent(event);
     if(!silent) console.log(event);
    }
  } catch(e) {
    //When running in node, CustomEvent and documents don't exist. We can emulate using a JSDOM package
    if(!silent) logger.error("Could not dispatch custom event.");
    if(terminate_on_error) process.exit();
  }
  
}

function createConstant(key, value) {
  //Object.freeze( value )
  this[key] = value;
  // Object.defineProperty( this, key, {

  // 	value,
  // 	writable: false
  // })
  // Object.defineProperty( this.constants, key, {

  // 	value,
  // 	writable: false
  // })
  constants[key] = this[key];
  Object.freeze(this[key]);
}

function createConstants() {
  if (arguments.length % 2 !== 0) {
    return logger.error(
      "Q attempted to create constants with invalid (KEY, VALUE) pairs."
    );
  }
  for (let i = 0; i < arguments.length; i += 2) {
    createConstant(arguments[i], arguments[i + 1]);
  }
}
// function loop() {}

let namesIndex = 0;
let shuffledNames = [];
function shuffleNames$() {
  let m = [];
  for (let c = 0; c < COLORS.length; c++) {
    for (let a = 0; a < ANIMALS.length; a++) {
      m.push([c, a, Math.random()]);
    }
  }
  shuffledNames = m.sort(function (a, b) {
    return a[2] - b[2];
  });
}

function getRandomName$() {
  if (shuffledNames.length === 0) shuffleNames$();
  const pair = shuffledNames[namesIndex],
    name = COLORS[pair[0]] + " " + ANIMALS[pair[1]];

  namesIndex = (namesIndex + 1) % shuffledNames.length;
  return name;
}

function hueToColorName(hue) {
  hue = hue % 360;
  hue = Math.floor(hue / 10);
  return COLORS[hue];
}

function colorIndexToHue(i) {
  return i * 10;
}

createConstants(
  "REVISION",
  19,

  //  Yeah... F’ing floating point numbers, Man!
  //  Here’s the issue:
  //  var a = new Q.ComplexNumber( 1, 2 )
  //  a.multiply(a).isEqualTo( a.power( new Q.ComplexNumber( 2, 0 )))
  //  That’s only true if Q.EPSILON >= Number.EPSILON * 6

  "EPSILON",
  Number.EPSILON * 6,

  "RADIANS_TO_DEGREES",
  180 / Math.PI,


  "ANIMALS",
  [
    "Aardvark",
    "Albatross",
    "Alligator",
    "Alpaca",
    "Ant",
    "Anteater",
    "Antelope",
    "Ape",
    "Armadillo",
    "Baboon",
    "Badger",
    "Barracuda",
    "Bat",
    "Bear",
    "Beaver",
    "Bee",
    "Bison",
    "Boar",
    "Buffalo",
    "Butterfly",
    "Camel",
    "Caribou",
    "Cat",
    "Caterpillar",
    "Cattle",
    "Chamois",
    "Cheetah",
    "Chicken",
    "Chimpanzee",
    "Chinchilla",
    "Chough",
    "Clam",
    "Cobra",
    "Cod",
    "Cormorant",
    "Coyote",
    "Crab",
    "Crane",
    "Crocodile",
    "Crow",
    "Curlew",
    "Deer",
    "Dinosaur",
    "Dog",
    "Dogfish",
    "Dolphin",
    "Donkey",
    "Dotterel",
    "Dove",
    "Dragonfly",
    "Duck",
    "Dugong",
    "Dunlin",
    "Eagle",
    "Echidna",
    "Eel",
    "Eland",
    "Elephant",
    "Elephant seal",
    "Elk",
    "Emu",
    "Falcon",
    "Ferret",
    "Finch",
    "Fish",
    "Flamingo",
    "Fly",
    "Fox",
    "Frog",
    "Galago",
    "Gaur",
    "Gazelle",
    "Gerbil",
    "Giant Panda",
    "Giraffe",
    "Gnat",
    "Gnu",
    "Goat",
    "Goose",
    "Goldfinch",
    "Goldfish",
    "Gorilla",
    "Goshawk",
    "Grasshopper",
    "Grouse",
    "Guanaco",
    "Guinea fowl",
    "Guinea pig",
    "Gull",
    "Guppy",
    "Hamster",
    "Hare",
    "Hawk",
    "Hedgehog",
    "Hen",
    "Heron",
    "Herring",
    "Hippopotamus",
    "Hornet",
    "Horse",
    "Human",
    "Hummingbird",
    "Hyena",
    "Ide",
    "Jackal",
    "Jaguar",
    "Jay",
    "Jellyfish",
    "Kangaroo",
    "Koala",
    "Koi",
    "Komodo dragon",
    "Kouprey",
    "Kudu",
    "Lapwing",
    "Lark",
    "Lemur",
    "Leopard",
    "Lion",
    "Llama",
    "Lobster",
    "Locust",
    "Loris",
    "Louse",
    "Lyrebird",
    "Magpie",
    "Mallard",
    "Manatee",
    "Marten",
    "Meerkat",
    "Mink",
    "Mole",
    "Monkey",
    "Moose",
    "Mouse",
    "Mosquito",
    "Mule",
    "Narwhal",
    "Newt",
    "Nightingale",
    "Octopus",
    "Okapi",
    "Opossum",
    "Oryx",
    "Ostrich",
    "Otter",
    "Owl",
    "Ox",
    "Oyster",
    "Panther",
    "Parrot",
    "Partridge",
    "Peafowl",
    "Pelican",
    "Penguin",
    "Pheasant",
    "Pig",
    "Pigeon",
    "Pony",
    "Porcupine",
    "Porpoise",
    "Prairie Dog",
    "Quail",
    "Quelea",
    "Rabbit",
    "Raccoon",
    "Rail",
    "Ram",
    "Raven",
    "Reindeer",
    "Rhinoceros",
    "Rook",
    "Ruff",
    "Salamander",
    "Salmon",
    "Sand Dollar",
    "Sandpiper",
    "Sardine",
    "Scorpion",
    "Sea lion",
    "Sea Urchin",
    "Seahorse",
    "Seal",
    "Shark",
    "Sheep",
    "Shrew",
    "Shrimp",
    "Skunk",
    "Snail",
    "Snake",
    "Sow",
    "Spider",
    "Squid",
    "Squirrel",
    "Starling",
    "Stingray",
    "Stinkbug",
    "Stork",
    "Swallow",
    "Swan",
    "Tapir",
    "Tarsier",
    "Termite",
    "Tiger",
    "Toad",
    "Trout",
    "Tui",
    "Turkey",
    "Turtle",
    //  U
    "Vicuña",
    "Viper",
    "Vulture",
    "Wallaby",
    "Walrus",
    "Wasp",
    "Water buffalo",
    "Weasel",
    "Whale",
    "Wolf",
    "Wolverine",
    "Wombat",
    "Woodcock",
    "Woodpecker",
    "Worm",
    "Wren",
    //  X
    "Yak",
    "Zebra",
  ],
  "ANIMALS3",
  [
    "ape",
    "bee",
    "cat",
    "dog",
    "elk",
    "fox",
    "gup",
    "hen",
    "ide",
    "jay",
    "koi",
    "leo",
    "moo",
    "nit",
    "owl",
    "pig",
    //  Q ?
    "ram",
    "sow",
    "tui",
    //  U ?
    //  V ?
    //  W ?
    //  X ?
    "yak",
    "zeb",
  ],
  "COLORS",
  [
    "Red", //    0  RED
    "Scarlet", //   10
    "Tawny", //   20
    "Carrot", //   30
    "Pumpkin", //   40
    "Mustard", //   50
    "Lemon", //   60  Yellow
    "Lime", //   70
    "Spring bud", //   80
    "Spring grass", //   90
    "Pear", //  100
    "Kelly", //  110
    "Green", //  120  GREEN
    "Malachite", //  130
    "Sea green", //  140
    "Sea foam", //  150
    "Aquamarine", //  160
    "Turquoise", //  170
    "Cyan", //  180  Cyan
    "Pacific blue", //  190
    "Baby blue", //  200
    "Ocean blue", //  210
    "Sapphire", //  220
    "Azure", //  230
    "Blue", //  240  BLUE
    "Cobalt", //  250
    "Indigo", //  260
    "Violet", //  270
    "Lavender", //  280
    "Purple", //  290
    "Magenta", //  300  Magenta
    "Hot pink", //  310
    "Fuschia", //  320
    "Ruby", //  330
    "Crimson", //  340
    "Carmine", //  350
  ]
);

module.exports = { createConstant, createConstants, getRandomName$, hueToColorName, colorIndexToHue, dispatchCustomEventToGlobal, constants };

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Logging":3,"_process":2}],6:[function(require,module,exports){

//  Copyright © 2019–2020, Stewart Smith. See LICENSE for details.


//
const logger = require('./Logging');
const misc = require('./Misc');
const mathf = require('./Math-Functions');
const {ComplexNumber} = require('./Q-ComplexNumber');
const {Gate} = require('./Q-Gate');
const {Qubit} = require('./Q-Qubit');
const {Matrix} = require('./Q-Matrix');
const {History} = require('./Q-History');




Circuit = function( bandwidth, timewidth ){

	//  What number Circuit is this
	//  that we’re attempting to make here?
	
	this.index = Circuit.index ++


	//  How many qubits (registers) shall we use?

	if( !mathf.isUsefulInteger( bandwidth )) bandwidth = 3
	this.bandwidth = bandwidth


	//  How many operations can we perform on each qubit?
	//  Each operation counts as one moment; one clock tick.

	if( !mathf.isUsefulInteger( timewidth )) timewidth = 5
	this.timewidth = timewidth


	//  We’ll start with Horizontal qubits (zeros) as inputs
	//  but we can of course modify this after initialization.

	this.qubits = new Array( bandwidth ).fill( Qubit.HORIZONTAL )


	//  What operations will we perform on our qubits?
	
	this.operations = []


	//  Does our circuit need evaluation?
	//  Certainly, yes!
	// (And will again each time it is modified.)

	this.needsEvaluation = true
	

	//  When our circuit is evaluated 
	//  we store those results in this array.

	this.results = []
	this.matrix  = null


	//  Undo / Redo history.
	this.history = new History( this )

}




Object.assign( Circuit, {
	index: 0,
	help: function(){ return logger.help( this )},
	constants: {},
	createConstant:  misc.createConstant,
	createConstants: misc.createConstants,


	fromText: function( text ){


		//  This is a quick way to enable `fromText()`
		//  to return a default new Circuit().

		if( text === undefined ) return new Circuit()

		//  Is this a String Template -- as opposed to a regular String?
		//  If so, let’s convert it to a regular String.
		//  Yes, this maintains the line breaks.

		if( text.raw !== undefined ) text = ''+text.raw		
		return Circuit.fromTableTransposed( 

			text
			.trim()
			.split( /\r?\n/ )
			.filter( function( item ){ return item.length })
			.map( function( item, r ){

				return item
				.trim()
				.split( /[-+\s+=+]/ )
				.filter( function( item ){ return item.length })
				.map( function( item, m ){

					//const matches = item.match( /(^\w+)(#(\w+))*(\.(\d+))*/ )
					const matches = item.match( /(^\w+)(\.(\w+))*(#(\d+))*/ )
					return {
						
						gateSymbol:        matches[ 1 ],
						operationMomentId: matches[ 3 ],
						mappingIndex:     +matches[ 5 ]
					}
				})
			})
		)
	},















//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//  Working out a new syntax here... Patience please!


	fromText2: function( text ){


		text = `
			H  C  C
			I  C1 C1
			I  X1 S1
			I  X1 S1`


		//  This is a quick way to enable `fromText()`
		//  to return a default new Circuit().

		if( text === undefined ) return new Circuit()


		//  Is this a String Template -- as opposed to a regular String?
		//  If so, let’s convert it to a regular String.
		//  Yes, this maintains the line breaks.

		if( text.raw !== undefined ) text = ''+text.raw



		text
		.trim()
		.split( /\r?\n/ )
		.filter( function( item ){ return item.length })
		.map( function( item, r ){

			return item
			.trim()
			.split( /[-+\s+=+]/ )
			.filter( function( item ){ return item.length })
			.map( function( item, m ){

				// +++++++++++++++++++++++
				// need to map LETTER[] optional NUMBER ]

				const matches = item.match( /(^\w+)(\.(\w+))*(#(\d+))*/ )

				//const matches = item.match( /(^\w+)(#(\w+))*(\.(\d+))*/ )
				// const matches = item.match( /(^\w+)(\.(\w+))*(#(\d+))*/ )
				// return {
					
				// 	gateSymbol:         matches[ 1 ],
				// 	operationMomentId: matches[ 3 ],
				// 	mappingIndex:     +matches[ 5 ]
				// }
			})
		})

	},



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++











	fromTableTransposed: function( table ){
		const
		bandwidth = table.length,
		timewidth = table.reduce( function( max, moments ){

			return Math.max( max, moments.length )
		
		}, 0 ),
		circuit = new Circuit( bandwidth, timewidth )
		
		circuit.bandwidth = bandwidth
		circuit.timewidth = timewidth
		for( let r = 0; r < bandwidth; r ++ ){

			const registerIndex = r + 1
			for( let m = 0; m < timewidth; m ++ ){

				const 
				momentIndex = m + 1,
				operation = table[ r ][ m ]
				let siblingHasBeenFound = false
				for( let s = 0; s < r; s ++ ){

					const sibling = table[ s ][ m ]
					if( operation.gateSymbol === sibling.gateSymbol &&
						operation.operationMomentId === sibling.operationMomentId &&
						mathf.isUsefulInteger( operation.mappingIndex ) &&
						mathf.isUsefulInteger( sibling.mappingIndex ) &&
						operation.mappingIndex !== sibling.mappingIndex ){


						//  We’ve found a sibling !
						const operationsIndex = circuit.operations.findIndex( function( operation ){

							return (

								operation.momentIndex === momentIndex &&
								operation.registerIndices.includes( s + 1 )
							)
						})
						// console.log( 'operationsIndex?', operationsIndex )
						circuit.operations[ operationsIndex ].registerIndices[ operation.mappingIndex ] = registerIndex
						circuit.operations[ operationsIndex ].isControlled = operation.gateSymbol != '*'//  Q.Gate.SWAP.
						siblingHasBeenFound = true
					}
				}
				if( siblingHasBeenFound === false && operation.gateSymbol !== 'I' ){

					const 
					gate = Gate.findBySymbol( operation.gateSymbol ),
					registerIndices = []					

					if( mathf.isUsefulInteger( operation.mappingIndex )){
					
						registerIndices[ operation.mappingIndex ] = registerIndex
					}
					else registerIndices[ 0 ] = registerIndex					
					circuit.operations.push({

						gate,
						momentIndex,
						registerIndices,
						isControlled: false,
						operationMomentId: operation.operationMomentId
					})
				}
			}
		}
		circuit.sort$()
		return circuit
	},




	controlled: function( U ){
		

		//  we should really just replace this with a nice Matrix.copy({}) command!!!!

		// console.log( 'U?', U )

		const 
		size   = U.getWidth(),
		result = Matrix.createIdentity( size * 2 )

		// console.log( 'U', U.toTsv() )
		// console.log( 'size', size )
		// console.log( 'result', result.toTsv() )
		
		for( let x = 0; x < size; x ++ ){
			
			for( let y = 0; y < size; y ++ ){
				const v = U.read( x, y )
				// console.log( `value at ${x}, ${y}`, v )
				result.write$( x + size, y + size, v )
			}
		}
		return result
	},

	//given an operation, return whether or not it is a valid control operation on the circuit-editor. 
	isControlledOperation:  function( operation ) {
		return (!operation.gate.is_multi_qubit || operation.gate.name === 'Swap') //assumption: we won't allow controlled multi-qubit operations
																				  //..except swap or CNOT
		&& (operation.registerIndices.length >= 2) 
		&& (operation.gate.can_be_controlled)
	},


	//  Return transformation over entire nqubit register that applies U to
	//  specified qubits (in order given).
	//  Algorithm from Lee Spector's "Automatic Quantum Computer Programming"
	//  Page 21 in the 2004 PDF?
	//  http://148.206.53.84/tesiuami/S_pdfs/AUTOMATIC%20QUANTUM%20COMPUTER%20PROGRAMMING.pdf

	expandMatrix: function( circuitBandwidth, U, qubitIndices ){
		// console.log( 'EXPANDING THE MATRIX...' )
		// console.log( 'this one: U', U.toTsv())

		const _qubits = []
		const n = Math.pow( 2, circuitBandwidth )
		

		// console.log( 'qubitIndices used by this operation:', qubitIndices )
		// console.log( 'qubits before slice', qubitIndices )
		// qubitIndices = qubitIndices.slice( 0 )
		// console.log( 'qubits AFTER slice', qubitIndices )
		

		

		for( let i = 0; i < qubitIndices.length; i ++ ){
			
			//qubitIndices[ i ] = ( circuitBandwidth - 1 ) - qubitIndices[ i ]
			qubitIndices[ i ] -= 1
		}
		// console.log( 'qubits AFTER manipulation', qubitIndices )

		
		qubitIndices.reverse()
		for( let i = 0; i < circuitBandwidth; i ++ ){
			
			if( qubitIndices.indexOf( i ) == -1 ){
				
				_qubits.push( i )
			}
		}


		// console.log( 'qubitIndices vs _qubits:' )
		// console.log( 'qubitIndices', qubitIndices )
		// console.log( '_qubits', _qubits )
		


		const result = new Matrix.createZero( n )


		// const X = numeric.rep([n, n], 0);
		// const Y = numeric.rep([n, n], 0);
		

		let i = n
		while( i -- ){
			
			let j = n
			while( j -- ){
				
				let
				bitsEqual = true,
				k = _qubits.length
				
				while( k -- ){
					
					if(( i & ( 1 << _qubits[ k ])) != ( j & ( 1 << _qubits[ k ]))){
						
						bitsEqual = false
						break
					}
				}
				if( bitsEqual ){

					// console.log( 'bits ARE equal' )
					let
					istar = 0,
					jstar = 0,
					k = qubitIndices.length
					
					while( k -- ){
						
						const q = qubitIndices[ k ]
						istar |= (( i & ( 1 << q )) >> q ) << k
						jstar |= (( j & ( 1 << q )) >> q ) << k
					}
					//console.log( 'U.read( istar, jstar )', U.read( istar, jstar ).toText() )

					// console.log( 'before write$', result.toTsv())

					// console.log( 'U.read at ', istar, jstar, '=', U.read( istar, jstar ).toText())
					result.write$( i, j, U.read( istar, jstar ))

					// console.log( 'after write$', result.toTsv())
					
					// X[i][j] = U.x[ istar ][ jstar ]
					// Y[i][j] = U.y[ istar ][ jstar ]
				}
				// else console.log('bits NOT equal')
			}
		}
		//return new numeric.T(X, Y);

		// console.log( 'expanded matrix to:', result.toTsv() )
		return result
	},


	evaluate: function( circuit ){


		// console.log( circuit.toDiagram() )

		misc.dispatchCustomEventToGlobal(

			'Circuit.evaluate began', { 

				detail: { circuit }
			}
		);


		//  Our circuit’s operations must be in the correct order
		//  before we attempt to step through them!

		circuit.sort$()



		//  Create a new matrix (or more precisely, a vector)
		//  that is a 1 followed by all zeros.
		//
		//  ┌   ┐
		//  │ 1 │
		//  │ 0 │
		//  │ 0 │
		//  │ . │
		//  │ . │
		//  │ . │
		//  └   ┘

		const state = new Matrix( 1, Math.pow( 2, circuit.bandwidth ))
		state.write$( 0, 0, 1 )




		//  Create a state matrix from this circuit’s input qubits.
		
		// const state2 = circuit.qubits.reduce( function( state, qubit, i ){

		// 	if( i > 0 ) return state.multiplyTensor( qubit )
		// 	else return state

		// }, circuit.qubits[ 0 ])
		// console.log( 'Initial state', state2.toTsv() )
		// console.log( 'multiplied', state2.multiplyTensor( state ).toTsv() )
		




		const operationsTotal = circuit.operations.length
		let operationsCompleted = 0
		let matrix = circuit.operations.reduce( function( state, operation, i ){


			let U
			if( operation.registerIndices.length < Infinity ){
			
				if( operation.isControlled ){
				//if( operation.registerIndices.length > 1 ){

					// operation.gate = Q.Gate.PAULI_X
					//  why the F was this hardcoded in there?? what was i thinking?!
					//  OH I KNOW !
					//  that was from back when i represented this as "C" -- its own gate
					//  rather than an X with multiple registers.
					//  so now no need for this "if" block at all.
					//  will remove in a few cycles.
				}
				U = operation.gate.matrix
			} 
			else {
			
				//  This is for Quantum Fourier Transforms (QFT). 
				//  Will have to come back to this at a later date!
			}			
			// console.log( operation.gate.name, U.toTsv() )





			//  Yikes. May need to separate registerIndices in to controls[] and targets[] ??
			//  Works for now tho..... 
			// Houston we have a problem. Turns out, not every gate with registerIndices.length > 1 is
			// controlled.
			// This is a nasty fix, leads to a lot of edge cases. But just experimenting. 
			if( Circuit.isControlledOperation(operation) ) {
				const scale = operation.registerIndices.length - ( operation.gate.is_multi_qubit ? 2 : 1)
				for( let j = 0; j < scale; j ++ ){
				
					U = Circuit.controlled( U )
					// console.log( 'qubitIndex #', j, 'U = Circuit.controlled( U )', U.toTsv() )
				}
			}


			//  We need to send a COPY of the registerIndices Array
			//  to .expandMatrix()
			//  otherwise it *may* modify the actual registerIndices Array
			//  and wow -- tracking down that bug was painful!

			const registerIndices = operation.registerIndices.slice()
			state = Circuit.expandMatrix( 

				circuit.bandwidth, 
				U, 
				registerIndices

			).multiply( state )
			


			operationsCompleted ++
			const progress = operationsCompleted / operationsTotal


			misc.dispatchCustomEventToGlobal('Circuit.evaluate progressed', { detail: {

				circuit,
				progress,
				operationsCompleted,
				operationsTotal,
				momentIndex: operation.momentIndex,
				registerIndices: operation.registerIndices,
				gate: operation.gate.name,
				state

			}})


			// console.log( `\n\nProgress ... ${ Math.round( operationsCompleted / operationsTotal * 100 )}%`)
			// console.log( 'Moment .....', operation.momentIndex )
			// console.log( 'Registers ..', JSON.stringify( operation.registerIndices ))
			// console.log( 'Gate .......', operation.gate.name )
			// console.log( 'Intermediate result:', state.toTsv() )
			// console.log( '\n' )
			

			return state
			
		}, state )


	



		const outcomes = matrix.rows.reduce( function( outcomes, row, i ){

			outcomes.push({

				state: '|'+ parseInt( i, 10 ).toString( 2 ).padStart( circuit.bandwidth, '0' ) +'⟩',
				probability: Math.pow( row[ 0 ].absolute(), 2 )
			})
			return outcomes
		
		}, [] )



		circuit.needsEvaluation = false
		circuit.matrix = matrix
		circuit.results = outcomes



		misc.dispatchCustomEventToGlobal('Circuit.evaluate completed', { detail: {
		// circuit.dispatchEvent( new CustomEvent( 'evaluation complete', { detail: {

			circuit,
			results: outcomes

		}})




		return matrix
	}
})







Object.assign( Circuit.prototype, {

	clone: function(){

		const 
		original = this,
		clone = original.copy()

		clone.qubits  = original.qubits.slice()
		clone.results = original.results.slice()
		clone.needsEvaluation = original.needsEvaluation
		
		return clone
	},
	evaluate$: function(){

		Circuit.evaluate( this )
		return this
	},
	report$: function( length ){

		if( this.needsEvaluation ) this.evaluate$()
		if( !mathf.isUsefulInteger( length )) length = 20
		
		const 
		circuit = this,
		text = this.results.reduce( function( text, outcome, i ){

			const
			probabilityPositive = Math.round( outcome.probability * length ),
			probabilityNegative = length - probabilityPositive

			return text +'\n'
				+ ( i + 1 ).toString().padStart( Math.ceil( Math.log10( Math.pow( 2, circuit.qubits.length ))), ' ' ) +'  '
				+ outcome.state +'  '
				+ ''.padStart( probabilityPositive, '█' )
				+ ''.padStart( probabilityNegative, '░' )
				+ mathf.round( Math.round( 100 * outcome.probability ), 8 ).toString().padStart( 4, ' ' ) +'% chance'

		}, '' ) + '\n'
		return text
	},
	try$: function(){

		if( this.needsEvaluation ) this.evaluate$()

		
		//  We need to “stack” our probabilities from 0..1.
		
		const outcomesStacked = new Array( this.results.length )
		this.results.reduce( function( sum, outcome, i ){

			sum += outcome.probability
			outcomesStacked[ i ] = sum
			return sum
		
		}, 0 )
		

		//  Now we can pick a random number
		//  and return the first outcome 
		//  with a probability equal to or greater than
		//  that random number. 
		
		const 
		randomNumber = Math.random(),
		randomIndex  = outcomesStacked.findIndex( function( index ){

			return randomNumber <= index
		})
		

		//  Output that to the console
		//  but return the random index
		//  so we can pipe that to something else
		//  should we want to :)
		
		// console.log( this.outcomes[ randomIndex ].state )
		return randomIndex
	},




	    ////////////////
	   //            //
	  //   Output   //
	 //            //
	////////////////


	//  This is absolutely required by toTable.

	sort$: function(){


		//  Sort this circuit’s operations
		//  primarily by momentIndex,
		//  then by the first registerIndex.

		this.operations.sort( function( a, b ){

			if( a.momentIndex === b.momentIndex ){


				//  Note that we are NOT sorting registerIndices here!
				//  We are merely asking which set of indices contain
				//  the lowest register index.
				//  If we instead sorted the registerIndices 
				//  we could confuse which qubit is the controller
				//  and which is the controlled!

				return Math.min( ...a.registerIndices ) - Math.min( b.registerIndices )
			}
			else {

				return a.momentIndex - b.momentIndex
			}
		})
		return this
	},
	





	    ///////////////////
	   //               //
	  //   Exporters   //
	 //               //
	///////////////////


	//  Many export functions rely on toTable
	//  and toTable itself absolutely relies on 
	//  a circuit’s operations to be SORTED correctly.
	//  We could force circuit.sort$() here,
	//  but then toTable would become toTable$
	//  and every exporter that relies on it would 
	//  also become destructive.

	toTable: function(){

		const 
		table = new Array( this.timewidth ),
		circuit = this


		//  Sure, this is equal to table.length
		//  but isn’t legibility and convenience everything?

		table.timewidth = this.timewidth
		

		//  Similarly, this should be equal to table[ 0 ].length
		//  or really table[ i >= 0; i < table.length ].length,
		//  but again, lowest cognitive hurdle is key ;)

		table.bandwidth = this.bandwidth
		

		//  First, let’s establish a “blank” table
		//  that contains an identity operation
		//  for each register during each moment.

		table.fill( 0 ).forEach( function( element, index, array ){

			const operations = new Array( circuit.bandwidth )
			operations.fill( 0 ).forEach( function( element, index, array ){

				array[ index ] = {

					symbol:   'I',
					symbolDisplay: 'I',
					name:    'Identity',
					nameCss: 'identity',
					gateInputIndex: 0,
					bandwidth: 0,
					thisGateAmongMultiQubitGatesIndex: 0,
					aSiblingIsAbove: false,
					aSiblingIsBelow: false
				}
			})
			array[ index ] = operations
		})


		//  Now iterate through the circuit’s operations list
		//  and note those operations in our table.
		//  NOTE: This relies on operations being pre-sorted with .sort$()
		//  prior to the .toTable() call.
		
		let 
		momentIndex = 1,
		multiRegisterOperationIndex = 0,
		gateTypesUsedThisMoment = {}

		this.operations.forEach( function( operation, operationIndex, operations ){


			//  We need to keep track of
			//  how many multi-register operations
			//  occur during this moment.

			if( momentIndex !== operation.momentIndex ){

				table[ momentIndex ].gateTypesUsedThisMoment = gateTypesUsedThisMoment
				momentIndex = operation.momentIndex
				multiRegisterOperationIndex = 0
				gateTypesUsedThisMoment = {}
			}
			if( operation.registerIndices.length > 1 ){

				table[ momentIndex - 1 ].multiRegisterOperationIndex = multiRegisterOperationIndex
				multiRegisterOperationIndex ++
			}
			if( gateTypesUsedThisMoment[ operation.gate.symbol ] === undefined ){

				gateTypesUsedThisMoment[ operation.gate.symbol ] = 1
			}
			else gateTypesUsedThisMoment[ operation.gate.symbol ] ++


			//  By default, an operation’s CSS name
			//  is its regular name, all lowercase, 
			//  with all spaces replaced by hyphens.

			let nameCss = operation.gate.name.toLowerCase().replace( /\s+/g, '-' )

			
			operation.registerIndices.forEach( function( registerIndex, indexAmongSiblings ){

				let isMultiRegisterOperation = false
				if( operation.registerIndices.length > 1 ){

					isMultiRegisterOperation = true
					if(	indexAmongSiblings === operation.registerIndices.length - 1 ){

						nameCss = 'target'
					}
					else {

						nameCss = 'control'
					}

					//  May need to re-visit the code above in consideration of SWAPs.

				}
				table[ operation.momentIndex - 1 ][ registerIndex - 1 ] = {

					symbol:        operation.gate.symbol,
					symbolDisplay: operation.gate.symbol,
					name:         operation.gate.name,
					nameCss,
					operationIndex,
					momentIndex: operation.momentIndex,
					registerIndex,
					isMultiRegisterOperation,
					multiRegisterOperationIndex,
					gatesOfThisTypeNow: gateTypesUsedThisMoment[ operation.gate.symbol ],
					indexAmongSiblings,
					siblingExistsAbove: Math.min( ...operation.registerIndices ) < registerIndex,
					siblingExistsBelow: Math.max( ...operation.registerIndices ) > registerIndex
				}
			})

/*


++++++++++++++++++++++

Non-fatal problem to solve here:

Previously we were concerned with “gates of this type used this moment”
when we were thinking about CNOT as its own special gate.
But now that we treat CNOT as just connected X gates,
we now have situations 
where a moment can have one “CNOT” but also a stand-alone X gate
and toTable will symbol the “CNOT” as X.0 
(never X.1, because it’s the only multi-register gate that moment)
but still uses the symbol X.0 instead of just X
because there’s another stand-alone X there tripping the logic!!!





*/


			// if( operationIndex === operations.length - 1 ){
				
				table[ momentIndex - 1 ].gateTypesUsedThisMoment = gateTypesUsedThisMoment
			// }
		})











		table.forEach( function( moment, m ){

			moment.forEach( function( operation, o ){

				if( operation.isMultiRegisterOperation ){

					if( moment.gateTypesUsedThisMoment[ operation.symbol ] > 1 ){

						operation.symbolDisplay = operation.symbol +'.'+ ( operation.gatesOfThisTypeNow - 1 )
					}
					operation.symbolDisplay += '#'+ operation.indexAmongSiblings
				}
			})
		})


		//  Now we can easily read down each moment
		//  and establish the moment’s character width.
		//  Very useful for text-based diagrams ;)

		table.forEach( function( moment ){

			const maximumWidth = moment.reduce( function( maximumWidth, operation ){

				return Math.max( maximumWidth, operation.symbolDisplay.length )
			
			}, 1 )
			moment.maximumCharacterWidth = maximumWidth
		})


		//  We can also do this for the table as a whole.
		
		table.maximumCharacterWidth = table.reduce( function( maximumWidth, moment ){

			return Math.max( maximumWidth, moment.maximumCharacterWidth )
		
		}, 1 )


		//  I think we’re done here.

		return table
	},
	toText: function( makeAllMomentsEqualWidth ){

		`
		Create a text representation of this circuit
		using only common characters,
		ie. no fancy box-drawing characters.
		This is the complement of Circuit.fromText()
		`

		const 
		table  = this.toTable(),
		output = new Array( table.bandwidth ).fill( '' )

		for( let x = 0; x < table.timewidth; x ++ ){

			for( let y = 0; y < table.bandwidth; y ++ ){

				let cellString = table[ x ][ y ].symbolDisplay.padEnd( table[ x ].maximumCharacterWidth, '-' )
				if( makeAllMomentsEqualWidth && x < table.timewidth - 1 ){

					cellString = table[ x ][ y ].symbolDisplay.padEnd( table.maximumCharacterWidth, '-' )
				}
				if( x > 0 ) cellString = '-'+ cellString
				output[ y ] += cellString
			}
		}
		return '\n'+ output.join( '\n' )
		// return output.join( '\n' )
	},
	toDiagram: function( makeAllMomentsEqualWidth ){

		`
		Create a text representation of this circuit
		using fancy box-drawing characters.
		`

		const 
		scope  = this,
		table  = this.toTable(),
		output = new Array( table.bandwidth * 3 + 1 ).fill( '' )

		output[ 0 ] = '        '
		scope.qubits.forEach( function( qubit, q ){

			const y3 = q * 3
			output[ y3 + 1 ] += '        '
			output[ y3 + 2 ] += 'r'+ ( q + 1 ) +'  |'+ qubit.beta.toText().trim() +'⟩─'
			output[ y3 + 3 ] += '        '
		})
		for( let x = 0; x < table.timewidth; x ++ ){

			const padToLength = makeAllMomentsEqualWidth
				? table.maximumCharacterWidth
				: table[ x ].maximumCharacterWidth

			output[ 0 ] += logger.centerText( 'm'+ ( x + 1 ), padToLength + 4 )
			for( let y = 0; y < table.bandwidth; y ++ ){

				let 
				operation = table[ x ][ y ],
				first  = '',
				second = '',
				third  = ''

				if( operation.symbol === 'I' ){

					first  += '  '
					second += '──'
					third  += '  '
					
					first  += ' '.padEnd( padToLength )
					second += logger.centerText( '○', padToLength, '─' )
					third  += ' '.padEnd( padToLength )

					first  += '  '
					if( x < table.timewidth - 1 ) second += '──'
					else second += '  '
					third  += '  '
				}
				else {

					if( operation.isMultiRegisterOperation ){

						first  += '╭─'
						third  += '╰─'
					}
					else {
					
						first  += '┌─'
						third  += '└─'
					}
					second += '┤ '
					
					first  += '─'.padEnd( padToLength, '─' )
					second += logger.centerText( operation.symbolDisplay, padToLength )
					third  += '─'.padEnd( padToLength, '─' )


					if( operation.isMultiRegisterOperation ){

						first  += '─╮'
						third  += '─╯'
					}
					else {

						first  += '─┐'
						third  += '─┘'
					}
					second += x < table.timewidth - 1 ? ' ├' : ' │'

					if( operation.isMultiRegisterOperation ){

						let n = ( operation.multiRegisterOperationIndex * 2 ) % ( table[ x ].maximumCharacterWidth + 1 ) + 1
						if( operation.siblingExistsAbove ){						

							first = first.substring( 0, n ) +'┴'+ first.substring( n + 1 )
						}
						if( operation.siblingExistsBelow ){

							third = third.substring( 0, n ) +'┬'+ third.substring( n + 1 )
						}					
					}
				}
				const y3 = y * 3				
				output[ y3 + 1 ] += first
				output[ y3 + 2 ] += second
				output[ y3 + 3 ] += third
			}
		}
		return '\n'+ output.join( '\n' )
	},




	//  Oh yes my friends... WebGL is coming!

	toShader: function(){

	},
	toGoogleCirq: function(){
/*


cirq.GridQubit(4,5)

https://cirq.readthedocs.io/en/stable/tutorial.html

*/
		const header = `import cirq`

		return headers
	},
	toAmazonBraket: function(){
		let isValidBraketCircuit = true
		const header = `import boto3
from braket.aws import AwsDevice
from braket.circuits import Circuit

my_bucket = f"amazon-braket-Your-Bucket-Name" # the name of the bucket
my_prefix = "Your-Folder-Name" # the name of the folder in the bucket
s3_folder = (my_bucket, my_prefix)\n
device = LocalSimulator()\n\n`
//TODO (ltnln): Syntax is different for simulators and actual quantum computers. Should there be a default? Should there be a way to change?
//vs an actual quantum computer? May not be necessary. 
		let variables = ''
		let num_unitaries = 0
		//`qjs_circuit = Circuit().h(0).cnot(0,1)`
		//ltnln change: from gate.AmazonBraketName -> gate.symbolAmazonBraket
		let circuit = this.operations.reduce( function( string, operation ){
			let awsGate = operation.gate.symbolAmazonBraket
			isValidBraketCircuit &= awsGate !== undefined
			if( operation.gate.symbolAmazonBraket === undefined ) isValidBraketCircuit = false
			if( operation.gate.symbol === 'X' ) {
				if( operation.registerIndices.length === 1 ) awsGate = operation.gate.symbolAmazonBraket
				else if( operation.registerIndices.length === 2 ) awsGate = 'cnot'
				else if( operation.registerIndices.length === 3) awsGate = 'ccnot'
				else isValidBraketCircuit = false
			}

			else if( operation.gate.symbol === 'S' ) {
				if( operation.gate.parameters["phi"] === 0 ) {
					awsGate = operation.registerIndices.length == 2 ? awsGate : "cswap"
					return string +'.'+ awsGate +'(' +
				operation.registerIndices.reduce( function( string, registerIndex, r ){

					return string + (( r > 0 ) ? ',' : '' ) + ( registerIndex - 1 )

					}, '' ) + ')'
				}
				awsGate = 'pswap'
			}
			//ltnln note: removed the if( operation.gate.symbol == '*') branch as it should be covered by
        	//the inclusion of the CURSOR gate. 
			else if( ['Y','Z','P'].includes( operation.gate.symbol) ) {
				if( operation.registerIndices.length === 1) awsGate = operation.gate.symbolAmazonBraket
				else if( operation.registerIndices.length === 2 ) awsGate = (operation.gate.symbol === 'Y') ? 'cy' : (operation.gate.symbol === 'Z') ? 'cz' : 'cphaseshift'
				else isValidBraketCircuit = false
			}
			//for all unitary gates, there must be a line of code to initialize the matrix for use
        	//in Braket's .u(matrix=my_unitary, targets[0]) function
			else if( operation.gate.symbol === 'U') {
				//check that this truly works as a unique id
				isValidBraketCircuit &= operation.registerIndices.length === 1
				const new_matrix = `unitary_` + num_unitaries
				num_unitaries++
				//https://en.wikipedia.org/wiki/Unitary_matrix; source for the unitary matrix values implemented below. 
				const a = ComplexNumber.toText(Math.cos(-(operation.gate.parameters[ "phi" ] + operation.gate.parameters[ "lambda" ])*Math.cos(operation.gate.parameters[ "theta" ] / 2) / 2),
												Math.sin(-(operation.gate.parameters[ "phi" ] + operation.gate.parameters[ "lambda" ])*Math.cos(operation.gate.parameters[ "theta" ] / 2) / 2))
												.replace('i', 'j')
				const b = ComplexNumber.toText(-Math.cos(-(operation.gate.parameters[ "phi" ] - operation.gate.parameters[ "lambda" ])*Math.sin(operation.gate.parameters[ "theta" ] / 2) / 2),
												-Math.sin(-(operation.gate.parameters[ "phi" ] - operation.gate.parameters[ "lambda" ])*Math.sin(operation.gate.parameters[ "theta" ] / 2)) / 2)
												.replace('i', 'j')
				const c = ComplexNumber.toText(Math.cos((operation.gate.parameters[ "phi" ] - operation.gate.parameters[ "lambda" ])*Math.sin(operation.gate.parameters[ "theta" ] / 2) / 2),
												-Math.sin((operation.gate.parameters[ "phi" ] - operation.gate.parameters[ "lambda" ])*Math.sin(operation.gate.parameters[ "theta" ] / 2)) / 2)
												.replace('i', 'j')
				const d = ComplexNumber.toText(Math.cos((operation.gate.parameters[ "phi" ] + operation.gate.parameters[ "lambda" ])*Math.cos(operation.gate.parameters[ "theta" ] / 2) / 2),
												Math.sin((operation.gate.parameters[ "phi" ] + operation.gate.parameters[ "lambda" ])*Math.cos(operation.gate.parameters[ "theta" ] / 2)) / 2)
												.replace('i', 'j')  
				variables += new_matrix + ` = np.array(` + 
							`[[` + a + ', ' + b + `],`+
							`[` + c + ', ' + d + `]])\n`
				return string +'.'+ awsGate +'(' + new_matrix +','+
				operation.registerIndices.reduce( function( string, registerIndex, r ){

					return string + (( r > 0 ) ? ',' : '' ) + ( registerIndex - 1 )

				}, '' ) + ')'
			}
			// I believe this line should ensure that we don't include any controlled single-qubit gates that aren't allowed in Braket. 
			// The registerIndices.length > 1 technically shouldn't be necessary, but if changes are made later, it's just for safety. 
			else isValidBraketCircuit &= (operation.registerIndices.length === 1) || ( operation.registerIndices.length > 1 && operation.gate.is_multi_qubit )
			return string +'.'+ awsGate +'(' + 
				operation.registerIndices.reduce( function( string, registerIndex, r ){

					return string + (( r > 0 ) ? ',' : '' ) + ( registerIndex - 1 )

				}, '' ) + ((operation.gate.has_parameters) ?
				Object.values( operation.gate.parameters ).reduce( function( string, parameter ) {
					return string + "," + parameter
				}, '') 
				: '') + ')'

		}, 'qjs_circuit = Circuit()' )
		variables += '\n'
		if( this.operations.length === 0 ) circuit +=  '.i(0)'//  Quick fix to avoid an error here!

		const footer = `\n\ntask = device.run(qjs_circuit, s3_folder, shots=100)
print(task.result().measurement_counts)`
		return isValidBraketCircuit ? header + variables + circuit + footer : `###This circuit is not representable as a Braket circuit!###`
	},
	toLatex: function(){

		/*

		\Qcircuit @C=1em @R=.7em {
			& \ctrl{2} & \targ     & \gate{U}  & \qw \\
			& \qw      & \ctrl{-1} & \qw       & \qw \\
			& \targ    & \ctrl{-1} & \ctrl{-2} & \qw \\
			& \qw      & \ctrl{-1} & \qw       & \qw
		}

		No "&"" means it’s an input. So could also do this:
		\Qcircuit @C=1.4em @R=1.2em {

			a & i \\
			1 & x
		}
		*/

		return '\\Qcircuit @C=1.0em @R=0.7em {\n' +
		this.toTable()
		.reduce( function( array, moment, m ){

			moment.forEach( function( operation, o, operations ){

				let command = 'qw'
				if( operation.symbol !== 'I' ){

					if( operation.isMultiRegisterOperation ){

						if( operation.indexAmongSiblings === 0 ){

							if( operation.symbol === 'X' ) command = 'targ'
							else command = operation.symbol.toLowerCase()
						}
						else if( operation.indexAmongSiblings > 0 ) command = 'ctrl{?}'
					}
					else command = operation.symbol.toLowerCase()
				}
				operations[ o ].latexCommand = command
			})
			const maximumCharacterWidth = moment.reduce( function( maximumCharacterWidth, operation ){

				return Math.max( maximumCharacterWidth, operation.latexCommand.length )
			
			}, 0 )
			moment.forEach( function( operation, o ){

				array[ o ] += '& \\'+ operation.latexCommand.padEnd( maximumCharacterWidth ) +'  '
			})
			return array

		}, new Array( this.bandwidth ).fill( '\n\t' ))
		.join( '\\\\' ) + 
		'\n}'
	},






	    //////////////
	   //          //
	  //   Edit   //
	 //          //
	//////////////


	get: function( momentIndex, registerIndex ){

		return this.operations.find( function( op ){

			return op.momentIndex === momentIndex && 
				op.registerIndices.includes( registerIndex )
		})
	},
	clear$: function( momentIndex, registerIndices ){

		const circuit = this


		//  Validate our arguments.
		
		if( arguments.length !== 2 ) 
			logger.warn( `Circuit.clear$ expected 2 arguments but received ${ arguments.length }.` )
		if( mathf.isUsefulInteger( momentIndex ) !== true )
			return logger.error( `Circuit attempted to clear an input on Circuit #${ circuit.index } using an invalid moment index:`, momentIndex )
		if( mathf.isUsefulInteger( registerIndices )) registerIndices = [ registerIndices ]
		if( registerIndices instanceof Array !== true )
			return logger.error( `Circuit attempted to clear an input on Circuit #${ circuit.index } using an invalid register indices array:`, registerIndices )


		//  Let’s find any operations 
		//  with a footprint at this moment index and one of these register indices
		//  and collect not only their content, but their index in the operations array.
		// (We’ll need that index to splice the operations array later.)

		const foundOperations = circuit.operations.reduce( function( filtered, operation, o ){

			if( operation.momentIndex === momentIndex && 
				operation.registerIndices.some( function( registerIndex ){

					return registerIndices.includes( registerIndex )
				})
			) filtered.push({

				index: o,
				momentIndex: operation.momentIndex,
				registerIndices: operation.registerIndices,
				gate: operation.gate
			})
			return filtered

		}, [] )


		//  Because we held on to each found operation’s index
		//  within the circuit’s operations array
		//  we can now easily splice them out of the array.

		foundOperations.reduce( function( deletionsSoFar, operation ){

			circuit.operations.splice( operation.index - deletionsSoFar, 1 )
			return deletionsSoFar + 1

		}, 0 )


		//  IMPORTANT!
		//  Operations must be sorted properly
		//  for toTable to work reliably with
		//  multi-register operations!!
				
		this.sort$()


		//  Let’s make history.

		if( foundOperations.length ){

			this.history.record$({

				redo: {
					
					name: 'clear$',
					func:  circuit.clear$,				
					args:  Array.from( arguments )
				},
				undo: foundOperations.reduce( function( undos, operation ){

					undos.push({

						name: 'set$',
						func: circuit.set$,
						args: [

							operation.gate,
							operation.momentIndex,
							operation.registerIndices
						]
					})
					return undos
				
				}, [] )
			})


			//  Let anyone listening, 
			//  including any circuit editor interfaces,
			//  know about what we’ve just completed here.

			foundOperations.forEach( function( operation ){

				misc.dispatchCustomEventToGlobal(

					'Circuit.clear$', { detail: { 

						circuit,
						momentIndex,
						registerIndices: operation.registerIndices
					}}
				)
			})
		}


		//  Enable that “fluent interface” method chaining :)

		return circuit
	},
	

	setProperty$: function( key, value ){

		this[ key ] = value
		return this
	},
	setName$: function( name ){

		if( typeof name === 'function' ) name = name()
		return this.setProperty$( 'name', name )
	},


	set$: function( gate, momentIndex, registerIndices, parameters = {} ){

		const circuit = this

		//  Is this a valid gate?
		// 	We clone the gate rather than using the constant; this way, if we change it's parameters, we don't change the constant. 
		if( typeof gate === 'string' ) gate = Gate.prototype.clone( Gate.findBySymbol( gate ) )
		if( gate instanceof Gate !== true ) return logger.error( `Circuit attempted to add a gate (${ gate }) to circuit #${ this.index } at moment #${ momentIndex } that is not a gate:`, gate )


		//  Is this a valid moment index?
		
		if( mathf.isUsefulNumber( momentIndex ) !== true ||
			Number.isInteger( momentIndex ) !== true ||
			momentIndex < 1 || momentIndex > this.timewidth ){

			return logger.error( `Circuit attempted to add a gate to circuit #${ this.index } at a moment index that is not valid:`, momentIndex )
		}


		//  Are these valid register indices?

		if( typeof registerIndices === 'number' ) registerIndices = [ registerIndices ]
		if( registerIndices instanceof Array !== true ) return logger.error( `Circuit attempted to add a gate to circuit #${ this.index } at moment #${ momentIndex } with an invalid register indices array:`, registerIndices )
		if( registerIndices.length === 0 ) return logger.error( `Circuit attempted to add a gate to circuit #${ this.index } at moment #${ momentIndex } with an empty register indices array:`, registerIndices )
		if( registerIndices.reduce( function( accumulator, registerIndex ){

			// console.log(accumulator && 
			// 	registerIndex > 0 && 
			// 	registerIndex <= circuit.bandwidth)
			return (

				accumulator && 
				registerIndex > 0 && 
				registerIndex <= circuit.bandwidth
			)

		}, false )){

			return logger.warn( `Circuit attempted to add a gate to circuit #${ this.index } at moment #${ momentIndex } with some out of range qubit indices:`, registerIndices )
		}


		//  Ok, now we can check if this set$ command
		//  is redundant.

		const
		isRedundant = !!circuit.operations.find( function( operation ){

			return (

				momentIndex === operation.momentIndex &&
				gate === operation.gate &&
				registerIndices.length === operation.registerIndices.length &&
				registerIndices.every( val => operation.registerIndices.includes( val ))
			)
		})


		//  If it’s NOT redundant 
		//  then we’re clear to proceed.

		if( isRedundant !== true ){


			//  If there’s already an operation here,
			//  we’d better get rid of it!
			//  This will also entirely remove any multi-register operations
			//  that happen to have a component at this moment / register.
			
			this.clear$( momentIndex, registerIndices )
			

			//  Finally. 
			//  Finally we can actually set this operation.
			//  Aren’t you glad we handle all this for you?

			const 
			//TODO: For ltnln (have to fix)
			//		a) allow users to control whatever they want! Just because it's not allowed in Braket 
			//		doesn't mean they shouldn't be allowed to do it in Q! (Probably fixable by adjusting toAmazonBraket)
			//		b) Controlling a multi_qubit gate will not treat the control icon like a control gate!
			isControlled = registerIndices.length > 1 && gate !== Gate.SWAP && gate.can_be_controlled !== undefined
			operation = {

				gate,
				momentIndex,
				registerIndices,
				isControlled
			}
			//perform parameter update here!!! 
			if(gate.has_parameters) gate.updateMatrix$.apply( gate, Object.values(parameters) )
			this.operations.push( operation )

			
			//  IMPORTANT!
			//  Operations must be sorted properly
			//  for toTable to work reliably with
			//  multi-register operations!!
			
			this.sort$()


			//  Let’s make history.
			const redo_args = Array.from( arguments )
			Object.assign( redo_args[ redo_args.length - 1 ], parameters )
			this.history.record$({

				redo: {
					
					name: 'set$',
					func: circuit.set$,
					args: redo_args
				},
				undo: [{

					name: 'clear$',
					func: circuit.clear$,
					args: [ momentIndex, registerIndices ]
				}]
			})

			
			//  Emit an event that we have set an operation
			//  on this circuit.

			misc.dispatchCustomEventToGlobal(

				'Circuit.set$', { detail: { 

					circuit,
					operation
				}}
			)
		}
		return circuit
	},




	determineRanges: function( options ){

		if( options === undefined ) options = {}
		let {

			qubitFirstIndex,
			qubitRange,
			qubitLastIndex,
			momentFirstIndex,
			momentRange,
			momentLastIndex

		} = options

		if( typeof qubitFirstIndex !== 'number' ) qubitFirstIndex = 0
		if( typeof qubitLastIndex  !== 'number' && typeof qubitRange !== 'number' ) qubitLastIndex = this.bandwidth
		if( typeof qubitLastIndex  !== 'number' && typeof qubitRange === 'number' ) qubitLastIndex = qubitFirstIndex + qubitRange
		else if( typeof qubitLastIndex === 'number' && typeof qubitRange !== 'number' ) qubitRange = qubitLastIndex - qubitFirstIndex
		else return logger.error( `Circuit attempted to copy a circuit but could not understand what qubits to copy.` )

		if( typeof momentFirstIndex !== 'number' ) momentFirstIndex = 0
		if( typeof momentLastIndex  !== 'number' && typeof momentRange !== 'number' ) momentLastIndex = this.timewidth
		if( typeof momentLastIndex  !== 'number' && typeof momentRange === 'number' ) momentLastIndex = momentFirstIndex + momentRange
		else if( typeof momentLastIndex === 'number' && typeof momentRange !== 'number' ) momentRange = momentLastIndex - momentFirstIndex
		else return logger.error( `Circuit attempted to copy a circuit but could not understand what moments to copy.` )

		logger.log( 0.8, 
		
			'\nCircuit copy operation:',
			'\n\n  qubitFirstIndex', qubitFirstIndex,
			'\n  qubitLastIndex ', qubitLastIndex,
			'\n  qubitRange     ', qubitRange,
			'\n\n  momentFirstIndex', momentFirstIndex,
			'\n  momentLastIndex ', momentLastIndex,
			'\n  momentRange     ', momentRange,
			'\n\n'
		)

		return {

			qubitFirstIndex,
			qubitRange,
			qubitLastIndex,
			momentFirstIndex,
			momentRange,
			momentLastIndex
		}
	},


	copy: function( options, isACutOperation ){

		const original = this
		let {

			registerFirstIndex,
			registerRange,
			registerLastIndex,
			momentFirstIndex,
			momentRange,
			momentLastIndex

		} = this.determineRanges( options )

		const copy = new Circuit( registerRange, momentRange )

		original.operations
		.filter( function( operation ){

			return ( operation.registerIndices.every( function( registerIndex ){

				return (

					operation.momentIndex   >= momentFirstIndex &&
					operation.momentIndex   <  momentLastIndex &&
					operation.registerIndex >= registerFirstIndex && 
					operation.registerIndex <  registerLastIndex
				)
			}))
		})			
		.forEach( function( operation ){

			const adjustedRegisterIndices = operation.registerIndices.map( function( registerIndex ){

				return registerIndex - registerFirstIndex
			})
			copy.set$(

				operation.gate, 
				1 + m - momentFirstIndex, 
				adjustedRegisterIndices
			)
		})


		//  The cut$() operation just calls copy()
		//  with the following boolean set to true.
		//  If this is a cut we need to 
		//  replace all gates in this area with identity gates.

		//  UPDATE !!!!
		//  will come back to fix!!
		//  with  new style it's now just a  matter  of 
		// splicing out these out of circuit.operations


		
		if( isACutOperation === true ){

			/*
			for( let m = momentFirstIndex; m < momentLastIndex; m ++ ){

				original.moments[ m ] = new Array( original.bandwidth )
				.fill( 0 )
				.map( function( qubit, q ){

					return { 

						gate: Q.Gate.IDENTITY,
						registerIndices: [ q ]
					}
				})
			}*/
		}
		return copy
	},
	cut$: function( options ){

		return this.copy( options, true )
	},







	/*




	If covers all moments for 1 or more qubits then 
	1. go through each moment and remove those qubits
	2. remove hanging operations. (right?? don’t want them?)




	*/

	spliceCut$: function( options ){

		let {

			qubitFirstIndex,
			qubitRange,
			qubitLastIndex,
			momentFirstIndex,
			momentRange,
			momentLastIndex

		} = this.determineRanges( options )


		//  Only three options are valid:
		//  1. Selection area covers ALL qubits for a series of moments.
		//  2. Selection area covers ALL moments for a seriies of qubits.
		//  3. Both of the above (splice the entire circuit).

		if( qubitRange  !== this.bandwidth &&
			momentRange !== this.timewidth ){

			return logger.error( `Circuit attempted to splice circuit #${this.index} by an area that did not include all qubits _or_ all moments.` )
		}


		//  If the selection area covers all qubits for 1 or more moments
		//  then splice the moments array.
			
		if( qubitRange === this.bandwidth ){


			//  We cannot use Array.prototype.splice() for this
			//  because we need a DEEP copy of the array
			//  and splice() will only make a shallow copy.
			
			this.moments = this.moments.reduce( function( accumulator, moment, m ){

				if( m < momentFirstIndex - 1 || m >= momentLastIndex - 1 ) accumulator.push( moment )
				return accumulator
			
			}, [])
			this.timewidth -= momentRange

			//@@  And how do we implement splicePaste$() here?
		}


		//  If the selection area covers all moments for 1 or more qubits
		//  then iterate over each moment and remove those qubits.
	
		if( momentRange === this.timewidth ){


			//  First, let’s splice the inputs array.

			this.inputs.splice( qubitFirstIndex, qubitRange )
			//@@  this.inputs.splice( qubitFirstIndex, qubitRange, qubitsToPaste?? )
			

			//  Now we can make the proper adjustments
			//  to each of our moments.

			this.moments = this.moments.map( function( operations ){

				
				//  Remove operations that pertain to the removed qubits.
				//  Renumber the remaining operations’ qubitIndices.
				
				return operations.reduce( function( accumulator, operation ){

					if( operation.qubitIndices.every( function( index ){

						return index < qubitFirstIndex || index >= qubitLastIndex
					
					})) accumulator.push( operation )
					return accumulator
				
				}, [])
				.map( function( operation ){

					operation.qubitIndices = operation.qubitIndices.map( function( index ){

						return index >= qubitLastIndex ? index - qubitRange : index
					})
					return operation
				})
			})
			this.bandwidth -= qubitRange
		}
		

		//  Final clean up.

		this.removeHangingOperations$()
		this.fillEmptyOperations$()
		

		return this//  Or should we return the cut area?!
	},
	splicePaste$: function(){


	},
	




	//  This is where “hanging operations” get interesting!
	//  when you paste one circuit in to another
	//  and that clipboard circuit has hanging operations
	//  those can find a home in the circuit its being pasted in to!


	paste$: function( other, atMoment = 0, atQubit = 0, shouldClean = true ){

		const scope = this
		this.timewidth = Math.max( this.timewidth, atMoment + other.timewidth )
		this.bandwidth = Math.max( this.bandwidth, atQubit  + other.bandwidth )
		this.ensureMomentsAreReady$()
		this.fillEmptyOperations$()
		other.moments.forEach( function( moment, m ){

			moment.forEach( function( operation ){

				//console.log( 'past over w this:', m + atMoment, operation )

				scope.set$(

					operation.gate,
					m + atMoment + 1,
					operation.qubitIndices.map( function( qubitIndex ){

						return qubitIndex + atQubit
					})
				)
			})
		})
		if( shouldClean ) this.removeHangingOperations$()
		this.fillEmptyOperations$()
		return this
	},
	pasteInsert$: function( other, atMoment, atQubit ){

		// if( other.alphandwidth !== this.bandwidth && 
		// 	other.timewidth !== this.timewidth ) return error( 'Circuit attempted to pasteInsert Circuit A', other, 'in to circuit B', this, 'but neither their bandwidth or timewidth matches.' )

		


		if( shouldClean ) this.removeHangingOperations$()
		this.fillEmptyOperations$()		
		return this

	},
	expand$: function(){

		//   expand either bandwidth or timewidth, fill w  identity


		this.fillEmptyOperations$()
		return thiis
	},







	trim$: function( options ){

		`
		Edit this circuit by trimming off moments, qubits, or both.
		We could have implemented trim$() as a wrapper around copy$(),
		similar to how cut$ is a wrapper around copy$().
		But this operates on the existing circuit 
		instead of returning a new one and returning that.
		`

		let {

			qubitFirstIndex,
			qubitRange,
			qubitLastIndex,
			momentFirstIndex,
			momentRange,
			momentLastIndex

		} = this.determineRanges( options )


		//  First, trim the moments down to desired size.

		this.moments = this.moments.slice( momentFirstIndex, momentLastIndex )
		this.timewidth = momentRange


		//  Then, trim the bandwidth down.

		this.inputs = this.inputs.slice( qubitFirstIndex, qubitLastIndex )
		this.bandwidth = qubitRange


		//  Finally, remove all gates where
		//  gate’s qubit indices contain an index < qubitFirstIndex,
		//  gate’s qubit indices contain an index > qubitLastIndex,
		//  and fill those holes with Identity gates.
		
		this.removeHangingOperations$()
		this.fillEmptyOperations$()

		return this
	}
})







//  Against my predilection for verbose clarity...
//  I offer you super short convenience methods
//  that do NOT use the $ suffix to delcare they are destructive.
//  Don’t shoot your foot off.
Object.entries( Gate.constants ).forEach( function( entry ){

	const 
	gateConstantName = entry[ 0 ],
	gate = entry[ 1 ],
	set$ = function( momentIndex, registerIndexOrIndices ){

		this.set$( gate, momentIndex, registerIndexOrIndices )
		return this
	}
	Circuit.prototype[ gateConstantName ] = set$
	Circuit.prototype[ gate.symbol ] = set$
	Circuit.prototype[ gate.symbol.toLowerCase() ] = set$
})



/*
const bells = [


	//  Verbose without shortcuts.

	new Circuit( 2, 2 )
		.set$( Q.Gate.HADAMARD, 1, [ 1 ])
		.set$( Q.Gate.PAULI_X,  2, [ 1 , 2 ]),

	new Circuit( 2, 2 )
		.set$( Q.Gate.HADAMARD, 1, 1 )
		.set$( Q.Gate.PAULI_X,  2, [ 1 , 2 ]),


	//  Uses Q.Gate.findBySymbol() to lookup gates.

	new Circuit( 2, 2 )
		.set$( 'H', 1, [ 1 ])
		.set$( 'X', 2, [ 1 , 2 ]),

	new Circuit( 2, 2 )
		.set$( 'H', 1, 1 )
		.set$( 'X', 2, [ 1 , 2 ]),


	//  Convenience gate functions -- constant name.

	new Circuit( 2, 2 )
		.HADAMARD( 1, [ 1 ])
		.PAULI_X(  2, [ 1, 2 ]),

	new Circuit( 2, 2 )
		.HADAMARD( 1, 1 )
		.PAULI_X(  2, [ 1, 2 ]),


	//  Convenience gate functions -- uppercase symbol.

	new Circuit( 2, 2 )
		.H( 1, [ 1 ])
		.X( 2, [ 1, 2 ]),

	new Circuit( 2, 2 )
		.H( 1, 1 )
		.X( 2, [ 1, 2 ]),


	//  Convenience gate functions -- lowercase symbol.

	new Circuit( 2, 2 )
		.h( 1, [ 1 ])
		.x( 2, [ 1, 2 ]),

	new Circuit( 2, 2 )//  Perhaps the closest to Braket style.
		.h( 1, 1 )
		.x( 2, [ 1, 2 ]),


	//  Q function -- bandwidth / timewidth arguments.

	Q( 2, 2 )
		.h( 1, [ 1 ])
		.x( 2, [ 1, 2 ]),

	Q( 2, 2 )
		.h( 1, 1 )
		.x( 2, [ 1, 2 ]),


	//  Q function -- text block argument
	//  with operation symbols
	//  and operation component IDs.

	Q`
		H-X.0#0
		I-X.0#1`,

	
	//  Q function -- text block argument
	//  using only component IDs
	// (ie. no operation symbols)
	//  because the operation that the 
	//  components should belong to is NOT ambiguous.
	
	Q`
		H-X#0
		I-X#1`,


	//  Q function -- text block argument
	//  as above, but using only whitespace
	//  to partition between moments.

	Q`
		H X#0
		I X#1`	
],
bellsAreEqual = !!bells.reduce( function( a, b ){

	return a.toText() === b.toText() ? a : NaN

})
if( bellsAreEqual ){

	console.log( `\n\nYES. All of ${ bells.length } our “Bell” circuits are equal.\n\n`, bells ) 
}
*/







Circuit.createConstants(

	'BELL', new  Circuit.fromText(`

		H  X#0
		I  X#1
	`),	
	// 'GROVER', Q`

	// 	H  X  *#0  X#0  I    X#0  I    I    I    X#0  I    I    I    X#0  I  X    H  X  I  *#0
	// 	H  X  I    X#1  *#0  X#1  *#0  X#0  I    I    I    X#0  X    I    H  X    I  I  I  I
	// 	H  X  I    I    I    I    I    X#1  *#0  X#1  *#0  X#1  *#0  X#1  I  *#0  X  H  X  I
	// 	H  X  *#1  I    *#1  I    *#1  I    *#1  I    *#1  I    *#1  I    I  *#1  X  H  X  *#1
	// `

	//https://docs.microsoft.com/en-us/quantum/concepts/circuits?view=qsharp-preview
	// 'TELEPORT', Q.(`
		
	// 	I-I--H-M---v
	// 	H-C0-I-M-v-v
	// 	I-C1-I-I-X-Z-
	// `)
)


module.exports = {Circuit};


},{"./Logging":3,"./Math-Functions":4,"./Misc":5,"./Q-ComplexNumber":7,"./Q-Gate":8,"./Q-History":9,"./Q-Matrix":10,"./Q-Qubit":11}],7:[function(require,module,exports){
//  Copyright © 2019–2020, Stewart Smith. See LICENSE for details.

const { warn, error, help } = require('./Logging');
const mathf = require('./Math-Functions');
const misc = require('./Misc');
const EPSILON = misc.constants.EPSILON;
ComplexNumber = function (real, imaginary) {
  `
	The set of “real numbers” (ℝ) contains any number that can be expressed 
	along an infinite timeline. https://en.wikipedia.org/wiki/Real_number  

	  …  -3  -2  -1   0  +1  +2  +3   …  
	  ┄───┴───┴───┴───┴───┴─┬─┴──┬┴┬──┄  
	                       √2    𝒆 π  


	Meanwhile, “imaginary numbers” (𝕀) consist of a real (ℝ) multiplier and 
	the symbol 𝒊, which is the impossible solution to the equation 𝒙² = −1. 
	Note that no number when multiplied by itself can ever result in a 
	negative product, but the concept of 𝒊 gives us a way to reason around 
	this imaginary scenario nonetheless. 
	https://en.wikipedia.org/wiki/Imaginary_number  

	  …  -3𝒊 -2𝒊  -1𝒊  0𝒊  +1𝒊 +2𝒊 +3𝒊  …  
	  ┄───┴───┴───┴───┴───┴───┴───┴───┄  


	A “complex number“ (ℂ) is a number that can be expressed in the form 
	𝒂 + 𝒃𝒊, where 𝒂 is the real component (ℝ) and 𝒃𝒊 is the imaginary 
	component (𝕀). https://en.wikipedia.org/wiki/Complex_number  


	Operation functions on ComplexNumber instances generally accept as 
	arguments both sibling instances and pure Number instances, though the 
	value returned is always an instance of ComplexNumber.

	`;

  if (real instanceof ComplexNumber) {
    imaginary = real.imaginary;
    real = real.real;
    warn(
      "ComplexNumber tried to create a new instance with an argument that is already a ComplexNumber — and that’s weird!"
    );
  } else if (real === undefined) real = 0;
  if (imaginary === undefined) imaginary = 0;
  if (
    (ComplexNumber.isNumberLike(real) !== true && isNaN(real) !== true) ||
    (ComplexNumber.isNumberLike(imaginary) !== true &&
      isNaN(imaginary) !== true)
  )
    return error(
      "ComplexNumber attempted to create a new instance but the arguments provided were not actual numbers."
    );

  this.real = real;
  this.imaginary = imaginary;
  this.index = ComplexNumber.index++;
};

Object.assign(ComplexNumber, {
  index: 0,
  help: function () {
    return help(this);
  },
  constants: {},
  createConstant: function (key, value) {
    //Object.freeze( value )
    this[key] = value;
    // Object.defineProperty( this, key, {

    // 	value,
    // 	writable: false
    // })
    // Object.defineProperty( this.constants, key, {

    // 	value,
    // 	writable: false
    // })
    this.constants[key] = this[key];
    Object.freeze(this[key]);
  },
  createConstants: function () {
    if (arguments.length % 2 !== 0) {
      return error(
        "Q attempted to create constants with invalid (KEY, VALUE) pairs."
      );
    }
    for (let i = 0; i < arguments.length; i += 2) {
      this.createConstant(arguments[i], arguments[i + 1]);
    }
  },

  toText: function (rNumber, iNumber, roundToDecimal, padPositive) {
    //  Should we round these numbers?
    //  Our default is yes: to 3 digits.
    //  Otherwise round to specified decimal.

    if (typeof roundToDecimal !== "number") roundToDecimal = 3;
    const factor = Math.pow(10, roundToDecimal);
    rNumber = Math.round(rNumber * factor) / factor;
    iNumber = Math.round(iNumber * factor) / factor;

    //  Convert padPositive
    //  from a potential Boolean
    //  to a String.
    //  If we don’t receive a FALSE
    //  then we’ll pad the positive numbers.

    padPositive = padPositive === false ? "" : " ";

    //  We need the absolute values of each.

    let rAbsolute = Math.abs(rNumber),
      iAbsolute = Math.abs(iNumber);

    //  And an absolute value string.

    let rText = rAbsolute.toString(),
      iText = iAbsolute.toString();

    //  Is this an IMAGINARY-ONLY number?
    //  Don’t worry: -0 === 0.

    if (rNumber === 0) {
      if (iNumber === Infinity) return padPositive + "∞i";
      if (iNumber === -Infinity) return "-∞i";
      if (iNumber === 0) return padPositive + "0";
      if (iNumber === -1) return "-i";
      if (iNumber === 1) return padPositive + "i";
      if (iNumber >= 0) return padPositive + iText + "i";
      if (iNumber < 0) return "-" + iText + "i";
      return iText + "i"; //  NaN
    }

    //  This number contains a real component
    //  and may also contain an imaginary one as well.

    if (rNumber === Infinity) rText = padPositive + "∞";
    else if (rNumber === -Infinity) rText = "-∞";
    else if (rNumber >= 0) rText = padPositive + rText;
    else if (rNumber < 0) rText = "-" + rText;

    if (iNumber === Infinity) return rText + " + ∞i";
    if (iNumber === -Infinity) return rText + " - ∞i";
    if (iNumber === 0) return rText;
    if (iNumber === -1) return rText + " - i";
    if (iNumber === 1) return rText + " + i";
    if (iNumber > 0) return rText + " + " + iText + "i";
    if (iNumber < 0) return rText + " - " + iText + "i";
    return rText + " + " + iText + "i"; //  NaN
  },

  isNumberLike: function (n) {
    return isNaN(n) === false && (typeof n === "number" || n instanceof Number);
  },
  isNaN: function (n) {
    return isNaN(n.real) || isNaN(n.imaginary);
  },
  isZero: function (n) {
    return (
      (n.real === 0 || n.real === -0) &&
      (n.imaginary === 0 || n.imaginary === -0)
    );
  },
  isFinite: function (n) {
    return isFinite(n.real) && isFinite(n.imaginary);
  },
  isInfinite: function (n) {
    return !(this.isNaN(n) || this.isFinite(n));
  },
  areEqual: function (a, b) {
    return ComplexNumber.operate(
      "areEqual",
      a,
      b,
      function (a, b) {
        return Math.abs(a - b) < EPSILON;
      },
      function (a, b) {
        return (
          Math.abs(a - b.real) < EPSILON && Math.abs(b.imaginary) < EPSILON
        );
      },
      function (a, b) {
        return (
          Math.abs(a.real - b) < EPSILON && Math.abs(a.imaginary) < EPSILON
        );
      },
      function (a, b) {
        return (
          Math.abs(a.real - b.real) < EPSILON &&
          Math.abs(a.imaginary - b.imaginary) < EPSILON
        );
      }
    );
  },

  absolute: function (n) {
    return mathf.hypotenuse(n.real, n.imaginary);
  },
  conjugate: function (n) {
    return new ComplexNumber(n.real, n.imaginary * -1);
  },
  operate: function (
    name,
    a,
    b,
    numberAndNumber,
    numberAndComplex,
    complexAndNumber,
    complexAndComplex
  ) {
    if (ComplexNumber.isNumberLike(a)) {
      if (ComplexNumber.isNumberLike(b)) return numberAndNumber(a, b);
      else if (b instanceof ComplexNumber) return numberAndComplex(a, b);
      else
        return error(
          "ComplexNumber attempted to",
          name,
          "with the number",
          a,
          "and something that is neither a Number or ComplexNumber:",
          b
        );
    } else if (a instanceof ComplexNumber) {
      if (ComplexNumber.isNumberLike(b)) return complexAndNumber(a, b);
      else if (b instanceof ComplexNumber) return complexAndComplex(a, b);
      else
        return error(
          "ComplexNumber attempted to",
          name,
          "with the complex number",
          a,
          "and something that is neither a Number or ComplexNumber:",
          b
        );
    } else
      return error(
        "ComplexNumber attempted to",
        name,
        "with something that is neither a Number or ComplexNumber:",
        a
      );
  },

  sine: function (n) {
    const a = n.real,
      b = n.imaginary;

    return new ComplexNumber(
      Math.sin(a) * mathf.hyperbolicCosine(b),
      Math.cos(a) * mathf.hyperbolicSine(b)
    );
  },
  cosine: function (n) {
    const a = n.real,
      b = n.imaginary;

    return new ComplexNumber(
      Math.cos(a) * mathf.hyperbolicCosine(b),
      -Math.sin(a) * mathf.hyperbolicSine(b)
    );
  },
  arcCosine: function (n) {
    const a = n.real,
      b = n.imaginary,
      t1 = ComplexNumber.squareRoot(
        new ComplexNumber(b * b - a * a + 1, a * b * -2)
      ),
      t2 = ComplexNumber.log(new ComplexNumber(t1.real - b, t1.imaginary + a));
    return new ComplexNumber(Math.PI / 2 - t2.imaginary, t2.real);
  },
  arcTangent: function (n) {
    const a = n.real,
      b = n.imaginary;

    if (a === 0) {
      if (b === 1) return new ComplexNumber(0, Infinity);
      if (b === -1) return new ComplexNumber(0, -Infinity);
    }

    const d = a * a + (1 - b) * (1 - b),
      t = ComplexNumber.log(
        new ComplexNumber((1 - b * b - a * a) / d, (a / d) * -2)
      );
    return new ComplexNumber(t.imaginary / 2, t.real / 2);
  },

  power: function (a, b) {
    if (ComplexNumber.isNumberLike(a)) a = new ComplexNumber(a);
    if (ComplexNumber.isNumberLike(b)) b = new ComplexNumber(b);

    //  Anything raised to the Zero power is 1.

    if (b.isZero()) return ComplexNumber.ONE;

    //  Zero raised to any power is 0.
    //  Note: What happens if b.real is zero or negative?
    //        What happens if b.imaginary is negative?
    //        Do we really need those conditionals??

    if (a.isZero() && b.real > 0 && b.imaginary >= 0) {
      return ComplexNumber.ZERO;
    }

    //  If our exponent is Real (has no Imaginary component)
    //  then we’re really just raising to a power.

    if (b.imaginary === 0) {
      if (a.real >= 0 && a.imaginary === 0) {
        return new ComplexNumber(Math.pow(a.real, b.real), 0);
      } else if (a.real === 0) {
        //  If our base is Imaginary (has no Real component).

        switch (((b.real % 4) + 4) % 4) {
          case 0:
            return new ComplexNumber(Math.pow(a.imaginary, b.real), 0);
          case 1:
            return new ComplexNumber(0, Math.pow(a.imaginary, b.real));
          case 2:
            return new ComplexNumber(-Math.pow(a.imaginary, b.real), 0);
          case 3:
            return new ComplexNumber(0, -Math.pow(a.imaginary, b.real));
        }
      }
    }

    const arctangent2 = Math.atan2(a.imaginary, a.real),
      logHypotenuse = mathf.logHypotenuse(a.real, a.imaginary),
      x = Math.exp(b.real * logHypotenuse - b.imaginary * arctangent2),
      y = b.imaginary * logHypotenuse + b.real * arctangent2;

    return new ComplexNumber(x * Math.cos(y), x * Math.sin(y));
  },
  squareRoot: function (a) {
    const result = new ComplexNumber(0, 0),
      absolute = ComplexNumber.absolute(a);

    if (a.real >= 0) {
      if (a.imaginary === 0) {
        result.real = Math.sqrt(a.real); //  and imaginary already equals 0.
      } else {
        result.real = Math.sqrt(2 * (absolute + a.real)) / 2;
      }
    } else {
      result.real = Math.abs(a.imaginary) / Math.sqrt(2 * (absolute - a.real));
    }
    if (a.real <= 0) {
      result.imaginary = Math.sqrt(2 * (absolute - a.real)) / 2;
    } else {
      result.imaginary =
        Math.abs(a.imaginary) / Math.sqrt(2 * (absolute + a.real));
    }
    if (a.imaginary < 0) result.imaginary *= -1;
    return result;
  },
  log: function (a) {
    return new ComplexNumber(
      mathf.logHypotenuse(a.real, a.imaginary),
      Math.atan2(a.imaginary, a.real)
    );
  },
  multiply: function (a, b) {
    return ComplexNumber.operate(
      "multiply",
      a,
      b,
      function (a, b) {
        return new ComplexNumber(a * b);
      },
      function (a, b) {
        return new ComplexNumber(a * b.real, a * b.imaginary);
      },
      function (a, b) {
        return new ComplexNumber(a.real * b, a.imaginary * b);
      },
      function (a, b) {
        //  FOIL Method that shit.
        //  https://en.wikipedia.org/wiki/FOIL_method

        const firsts = a.real * b.real,
          outers = a.real * b.imaginary,
          inners = a.imaginary * b.real,
          lasts = a.imaginary * b.imaginary * -1; //  Because i² = -1.

        return new ComplexNumber(firsts + lasts, outers + inners);
      }
    );
  },
  divide: function (a, b) {
    return ComplexNumber.operate(
      "divide",
      a,
      b,
      function (a, b) {
        return new ComplexNumber(a / b);
      },
      function (a, b) {
        return new ComplexNumber(a).divide(b);
      },
      function (a, b) {
        return new ComplexNumber(a.real / b, a.imaginary / b);
      },
      function (a, b) {
        //  Ermergerd I had to look this up because it’s been so long.
        //  https://www.khanacademy.org/math/precalculus/imaginary-and-complex-numbers/complex-conjugates-and-dividing-complex-numbers/a/dividing-complex-numbers-review

        const conjugate = b.conjugate(),
          numerator = a.multiply(conjugate),
          //  The .imaginary will be ZERO for sure,
          //  so this forces a ComplexNumber.divide( Number ) ;)

          denominator = b.multiply(conjugate).real;

        return numerator.divide(denominator);
      }
    );
  },
  add: function (a, b) {
    return ComplexNumber.operate(
      "add",
      a,
      b,
      function (a, b) {
        return new ComplexNumber(a + b);
      },
      function (a, b) {
        return new ComplexNumber(b.real + a, b.imaginary);
      },
      function (a, b) {
        return new ComplexNumber(a.real + b, a.imaginary);
      },
      function (a, b) {
        return new ComplexNumber(a.real + b.real, a.imaginary + b.imaginary);
      }
    );
  },
  subtract: function (a, b) {
    return ComplexNumber.operate(
      "subtract",
      a,
      b,
      function (a, b) {
        return new ComplexNumber(a - b);
      },
      function (a, b) {
        return new ComplexNumber(b.real - a, b.imaginary);
      },
      function (a, b) {
        return new ComplexNumber(a.real - b, a.imaginary);
      },
      function (a, b) {
        return new ComplexNumber(a.real - b.real, a.imaginary - b.imaginary);
      }
    );
  },
});

ComplexNumber.createConstants(
  "ZERO",
  new ComplexNumber(0, 0),
  "ONE",
  new ComplexNumber(1, 0),
  "E",
  new ComplexNumber(Math.E, 0),
  "PI",
  new ComplexNumber(Math.PI, 0),
  "I",
  new ComplexNumber(0, 1),
  "EPSILON",
  new ComplexNumber(EPSILON, EPSILON),
  "INFINITY",
  new ComplexNumber(Infinity, Infinity),
  "NAN",
  new ComplexNumber(NaN, NaN)
);

Object.assign(ComplexNumber.prototype, {
  //  NON-destructive operations.

  clone: function () {
    return new ComplexNumber(this.real, this.imaginary);
  },
  reduce: function () {
    //  Note: this *might* kill function chaining.

    if (this.imaginary === 0) return this.real;
    return this;
  },
  toText: function (roundToDecimal, padPositive) {
    //  Note: this will kill function chaining.

    return ComplexNumber.toText(
      this.real,
      this.imaginary,
      roundToDecimal,
      padPositive
    );
  },

  isNaN: function (n) {
    return ComplexNumber.isNaN(this); //  Returned boolean will kill function chaining.
  },
  isZero: function (n) {
    return ComplexNumber.isZero(this); //  Returned boolean will kill function chaining.
  },
  isFinite: function (n) {
    return ComplexNumber.isFinite(this); //  Returned boolean will kill function chaining.
  },
  isInfinite: function (n) {
    return ComplexNumber.isInfinite(this); //  Returned boolean will kill function chaining.
  },
  isEqualTo: function (b) {
    return ComplexNumber.areEqual(this, b); //  Returned boolean will kill function chaining.
  },

  absolute: function () {
    return ComplexNumber.absolute(this); //  Returned number will kill function chaining.
  },
  conjugate: function () {
    return ComplexNumber.conjugate(this);
  },

  power: function (b) {
    return ComplexNumber.power(this, b);
  },
  squareRoot: function () {
    return ComplexNumber.squareRoot(this);
  },
  log: function () {
    return ComplexNumber.log(this);
  },
  multiply: function (b) {
    return ComplexNumber.multiply(this, b);
  },
  divide: function (b) {
    return ComplexNumber.divide(this, b);
  },
  add: function (b) {
    return ComplexNumber.add(this, b);
  },
  subtract: function (b) {
    return ComplexNumber.subtract(this, b);
  },

  //  DESTRUCTIVE operations.

  copy$: function (b) {
    if (b instanceof ComplexNumber !== true)
      return error(
        `ComplexNumber attempted to copy something that was not a complex number in to this complex number #${this.index}.`,
        this
      );

    this.real = b.real;
    this.imaginary = b.imaginary;
    return this;
  },
  conjugate$: function () {
    return this.copy$(this.conjugate());
  },
  power$: function (b) {
    return this.copy$(this.power(b));
  },
  squareRoot$: function () {
    return this.copy$(this.squareRoot());
  },
  log$: function () {
    return this.copy$(this.log());
  },
  multiply$: function (b) {
    return this.copy$(this.multiply(b));
  },
  divide$: function (b) {
    return this.copy$(this.divide(b));
  },
  add$: function (b) {
    return this.copy$(this.add(b));
  },
  subtract$: function (b) {
    return this.copy$(this.subtract(b));
  },
});

module.exports = { ComplexNumber };

},{"./Logging":3,"./Math-Functions":4,"./Misc":5}],8:[function(require,module,exports){

//  Copyright © 2019–2020, Stewart Smith. See LICENSE for details.

const mathf = require('./Math-Functions');
const logger = require('./Logging');
const { ComplexNumber } = require('./Q-ComplexNumber');
const {Matrix} = require('./Q-Matrix');
Gate = function( params ){

	Object.assign( this, params )
	this.index = Gate.index ++
	
	if( typeof this.symbol !== 'string' ) this.symbol = '?'
	const parameters = Object.assign( {}, params.parameters )
	this.parameters = parameters
	
	//  We use symbols as unique identifiers
	//  among gate CONSTANTS
	//  so if you use the same symbol for a non-constant
	//  that’s not a deal breaker
	//  but it is good to know.

	const 
	scope = this,
	foundConstant = Object
	.values( Gate.constants )
	.find( function( gate ){ 

		return gate.symbol === scope.symbol
	})

	if( foundConstant ){
		
		logger.warn( `Gate is creating a new instance, #${ this.index }, that uses the same symbol as a pre-existing Gate constant:`, foundConstant )
	}

	if( typeof this.name    !== 'string' ) this.name    = 'Unknown'
	if( typeof this.nameCss !== 'string' ) this.nameCss = 'unknown'


	//  If our gate’s matrix is to be 
	//  dynamically created or updated
	//  then we ouoght to do that now.

	if( typeof this.updateMatrix$ === 'function' ) this.updateMatrix$()


	//  Every gate must have an applyToQubit method.
	//  If it doesn’t exist we’ll create one
	//  based on whether a matrix property exists or not.
	
	//Hi there. LTNLN here. We're just gonna toss the applyToQubit function entirely...Gate from here on is independent of Qubit! :)..
}



Object.assign( Gate, {
	
	index: 0,
	constants: {},
	createConstant:  function( key, value ){
		this[ key ] = value
		this.constants[ key ] = this[ key ]
		Object.freeze( this[ key ])
	},
	createConstants: function(){

		if( arguments.length % 2 !== 0 ){

			return logger.error( 'Q attempted to create constants with invalid (KEY, VALUE) pairs.' )
		}
		for( let i = 0; i < arguments.length; i += 2 ){

			this.createConstant( arguments[ i ], arguments[ i + 1 ])
		}
	},
	findBy: function( key, value ){

		return (
			
			Object
			.values( Gate.constants )
			.find( function( item ){

				if( typeof value === 'string' && 
					typeof item[ key ] === 'string' ){

					return value.toLowerCase() === item[ key ].toLowerCase()
				}
				return value === item[ key ]
			})
		)
	},
	findBySymbol: function( symbol ){

		return Gate.findBy( 'symbol', symbol )
	},
	findByName: function( name ){

		return Gate.findBy( 'name', name )
	}
})




Object.assign( Gate.prototype, {

	clone: function( params ){

		return new Gate( Object.assign( {}, this, params ))
	},
	set$: function( key, value ){

		this[ key ] = value
		return this
	},
	setSymbol$: function( value ){

		return this.set$( 'symbol', value )
	}
})




Gate.createConstants (


	//  Operate on a single qubit.

	'IDENTITY', new Gate({

		symbol:    'I',
		symbolAmazonBraket: 'i',
		symbolSvg: '',
		name:      'Identity',
		nameCss:   'identity',
		matrix: Matrix.IDENTITY_2X2
	}),
	'CURSOR', new Gate({

		symbol:    '*',
		symbolAmazonBraket: 'i',
		symbolSvg: '',
		name:      'Identity',
		nameCss:   'identity',
		matrix: Matrix.IDENTITY_2X2
	}),
	'MEASURE', new Gate({

		symbol:    'M',
		symbolAmazonBraket: 'm',
		symbolSvg: '',
		name:      'Measure',
		nameCss:   'measure',
		matrix: Matrix.IDENTITY_2X2,
	}),
	'HADAMARD', new Gate({

		symbol:    'H',
		symbolAmazonBraket: 'h',
		symbolSvg: '',
		name:      'Hadamard',
		nameCss:   'hadamard',
		matrix: new Matrix(
			[ Math.SQRT1_2,  Math.SQRT1_2 ],
			[ Math.SQRT1_2, -Math.SQRT1_2 ])
	}),
	'PAULI_X', new Gate({

		symbol:    'X',
		symbolAmazonBraket: 'x',
		symbolSvg: '',
		name:      'Pauli X',
		nameCss:   'pauli-x',
		matrix: new Matrix(
			[ 0, 1 ],
			[ 1, 0 ]),
		//ltnln: NOTE! can_be_controlled refers to whether or not the Braket SDK supports a controlled
		//application of this gate; if we want Q to be able to support controlled gated regardless of whether
		//or not Braket can, this must be changed..
		can_be_controlled:  true
		},
	),
	'PAULI_Y', new Gate({

		symbol:    'Y',
		symbolAmazonBraket: 'y',
		symbolSvg: '',
		name:      'Pauli Y',
		nameCss:   'pauli-y',
		matrix: new Matrix(
			[ 0, new ComplexNumber( 0, -1 )],
			[ new ComplexNumber( 0, 1 ), 0 ]),
		can_be_controlled:  true
		},
	),
	'PAULI_Z', new Gate({

		symbol:    'Z',
		symbolAmazonBraket: 'z',
		symbolSvg: '',
		name:      'Pauli Z',
		nameCss:   'pauli-z',
		matrix: new Matrix(
			[ 1,  0 ],
			[ 0, -1 ]),
		can_be_controlled:  true
		},
		),
	'PHASE', new Gate({

		symbol:    'P',
		symbolAmazonBraket: 'phaseshift',//  ltnln edit: change from 'p' to 'phaseshift'
		symbolSvg: '',
		name:      'Phase',
		nameCss:   'phase',
		parameters: { "phi" : 1 },
		updateMatrix$: function( phi ){
			if( mathf.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ]  = +phi;
			this.matrix = new Matrix(
				[ 1, 0 ],
				[ 0, ComplexNumber.E.power( new ComplexNumber( 0, this.parameters[ "phi" ] ))])
			return this
		},
		can_be_controlled:  true,
		has_parameters:		true
	}),
	'PI_8', new Gate({

		symbol:    'T',
		symbolAmazonBraket: 't',//  !!! Double check this !!!
		symbolSvg: '',
		name:      'π ÷ 8',
		nameCss:   'pi8',
		matrix: new Matrix(
			[ 1, 0 ],
			[ 0, ComplexNumber.E.power( new ComplexNumber( 0, Math.PI / 4 )) ])
	}),
	'BLOCH', new Gate({

		symbol:    'B',
		//symbolAmazonBraket: Does not exist.
		symbolSvg: '',
		name:      'Bloch sphere',
		nameCss:   'bloch',
		// applyToQubit: function( qubit ){

		// 	//  Create Bloch sphere visualizer instance.
		// }
	}),
	'RX', new Gate({

		symbol:		'Rx',
		symbolAmazonBraket:	'rx', 
		symbolSvg:  '', 
		name:       'X Rotation', 
		nameCss: 	'x-rotation', 
		parameters: { "phi" : Math.PI / 2 },
		updateMatrix$: function( phi ){

			if( mathf.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ] = +phi
			this.matrix = new Matrix(
				[ Math.cos( this.parameters[ "phi" ] / 2 ), new ComplexNumber( 0, -Math.sin( this.parameters[ "phi" ] / 2 )) ],
				[ new ComplexNumber( 0, -Math.sin( this.parameters[ "phi" ] / 2 )), Math.cos( this.parameters[ "phi" ] / 2 )])
			return this
		},
		has_parameters:		true
	}),
	'RY', new Gate({

		symbol:		'Ry',
		symbolAmazonBraket:	'ry', 
		symbolSvg:  '', 
		name:       'Y Rotation', 
		nameCss: 	'y-rotation',
		parameters: { "phi" : Math.PI / 2 },
		updateMatrix$: function( phi ){

			if( mathf.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ] = +phi
			this.matrix = new Matrix(
				[ Math.cos( this.parameters[ "phi" ] / 2 ), -Math.sin( phi / 2 ) ],
				[ Math.sin( this.parameters[ "phi" ] / 2 ), Math.cos( this.parameters[ "phi" ] / 2 )])
			return this
		},
		has_parameters:		true
	}),
	'RZ', new Gate({

		symbol:		'Rz',
		symbolAmazonBraket:	'rz', 
		symbolSvg:  '', 
		name:       'Z Rotation', 
		nameCss: 	'z-rotation',
		parameters: { "phi" : Math.PI / 2 },
		updateMatrix$: function( phi ){

			if( mathf.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ] = +phi
			this.matrix = new Matrix(
				[ ComplexNumber.E.power( new ComplexNumber( 0, -this.parameters[ "phi" ] / 2 )), 0 ],
				[ 0, ComplexNumber.E.power( new ComplexNumber( 0, this.parameters[ "phi" ] / 2 ))])
			return this
		},
		has_parameters:		true
	}),
	'UNITARY', new Gate({

		symbol:    'U',
		symbolAmazonBraket: 'unitary',
		symbolSvg: '',
		name:      'Unitary',
		nameCss:   'unitary',
		//toAmazonBraket will have to use the following matrix as an argument for unitary()
		parameters: { "phi" : Math.PI / 2,
					"theta" : Math.PI / 2,
					"lambda" : Math.PI / 2 },
		updateMatrix$: function( phi, theta, lambda ){

			if( (mathf.isUsefulNumber( +phi ) === true) && (mathf.isUsefulNumber( +theta ) === true) && (mathf.isUsefulNumber( +lambda ) === true) ) {
				this.parameters[ "phi" ] = +phi;
				this.parameters[ "theta" ] = +theta;
				this.parameters[ "lambda" ] = +lambda;
			} 
			const a = ComplexNumber.multiply(
				ComplexNumber.E.power( new ComplexNumber( 0, -( this.parameters[ "phi" ] + this.parameters[ "lambda" ] ) / 2 )),  Math.cos( this.parameters[ "theta" ] / 2 ))
			const b = ComplexNumber.multiply(
					ComplexNumber.E.power( new ComplexNumber( 0, -( this.parameters[ "phi" ] - this.parameters[ "lambda" ] ) / 2 )), -Math.sin( this.parameters[ "theta" ] / 2 ))
			const c = ComplexNumber.multiply(
				ComplexNumber.E.power( new ComplexNumber( 0, ( this.parameters[ "phi" ] - this.parameters[ "lambda" ] ) / 2 )), Math.sin( this.parameters[ "theta" ] / 2 ))
			const d = ComplexNumber.multiply(
				ComplexNumber.E.power( new ComplexNumber( 0, ( this.parameters[ "phi" ] + this.parameters[ "lambda" ] ) / 2 )), Math.cos( this.parameters[ "theta" ] / 2 ))
			this.matrix = new Matrix(
				[ a, b ], 
				[ c, d ])
			return this
		},
		has_parameters:		true
	}),
	'NOT1_2', new Gate({

		symbol:    'V',
		symbolAmazonBraket: 'v',
		symbolSvg: '',
		name:      '√Not',
		nameCss:   'not1-2',
		matrix: new Matrix(
			[ new ComplexNumber( 1, 1 ) / 2,  new ComplexNumber( 1, -1 ) / 2 ],
			[ new ComplexNumber( 1, -1 ) / 2, new ComplexNumber( 1, 1 ) / 2 ])
	}),
	'PI_8_Dagger', new Gate({

		symbol:    'T†',
		symbolAmazonBraket: 'ti',
		symbolSvg: '',
		name:      'PI_8_Dagger',
		nameCss:   'pi8-dagger',
		matrix: new Matrix(
			[ 1, 0 ],
			[ 0, ComplexNumber.E.power( new ComplexNumber( 0, -Math.PI / 4 )) ])
	}),
	'NOT1_2_Dagger', new Gate({

		symbol:    'V†',
		symbolAmazonBraket: 'vi',
		symbolSvg: '',
		name:      '√Not_Dagger',
		nameCss:   'not1-2-dagger',
		matrix: new Matrix(
			[ new ComplexNumber( 1, -1 ) / 2,  new ComplexNumber( 1, 1 ) / 2 ],
			[ new ComplexNumber( 1, 1 ) / 2, new ComplexNumber( 1, -1 ) / 2 ])
	}),
	//Note that S, S_Dagger, PI_8, and PI_8_Dagger can all be implemented by applying the PHASE gate
	//using certain values of phi. 
	//These gates are included for completeness. 
	'S', new Gate({
		symbol:    'S*', //Gotta think of a better symbol name...
		symbolAmazonBraket: 's',
		symbolSvg: '',
		name:      'π ÷ 4',
		nameCss:   'pi4',
		matrix: new Matrix(
			[ 1, 0 ],
			[ 0, new ComplexNumber( 0, 1 ) ])
	}),
	'S_Dagger', new Gate({

		symbol:    'S†',
		symbolAmazonBraket: 'si',
		symbolSvg: '',
		name:      'π ÷ 4 Dagger',
		nameCss:   'pi4-dagger',
		matrix: new Matrix(
			[ 1, 0 ],
			[ 0, ComplexNumber.E.power( new ComplexNumber( 0, -1 )) ])
	}),
	//  Operate on 2 qubits.
	'SWAP', new Gate({

		symbol:    'S', 
		symbolAmazonBraket: 'swap',
		symbolSvg: '',
		name:      'Swap',
		nameCss:   'swap',
		parameters: { "phi" : 0.0 },
		updateMatrix$: function( phi ) {
			
			if( mathf.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ] = +phi
			this.matrix = new Matrix(
				[ 1, 0, 0, 0 ],
				[ 0, 0, ComplexNumber.E.power( new ComplexNumber( 0, this.parameters[ "phi" ] )), 0 ],
				[ 0, ComplexNumber.E.power(new ComplexNumber( 0, this.parameters[ "phi" ] )), 0, 0 ],
				[ 0, 0, 0, 1 ])
			return this
		},
		can_be_controlled:  true,
		has_parameters: 	true,
		is_multi_qubit: 	true
	}),
	'SWAP1_2', new Gate({

		symbol:    '√S',
		//symbolAmazonBraket: !!! UNKNOWN !!!
		symbolSvg: '',
		name:      '√Swap',
		nameCss:   'swap1-2',
		matrix: new Matrix(
			[ 1, 0, 0, 0 ],
			[ 0, new ComplexNumber( 0.5,  0.5 ), new ComplexNumber( 0.5, -0.5 ), 0 ],
			[ 0, new ComplexNumber( 0.5, -0.5 ), new ComplexNumber( 0.5,  0.5 ), 0 ],
			[ 0, 0, 0, 1 ]),
		is_multi_qubit: 	true
	}),
	'ISWAP', new Gate({
		
		symbol:    'iS',
		symbolAmazonBraket: 'iswap',
		symbolSvg: '',
		name:      'Imaginary Swap',
		nameCss:   'iswap',
		matrix: new Matrix(
			[ 1, 0, 0, 0 ],
			[ 0, 0, new ComplexNumber( 0, 1 ), 0 ],
			[ 0, new ComplexNumber( 0, 1 ), 0, 0 ],
			[ 0, 0, 0, 1 ]),
			is_multi_qubit:	true
	}),
	'ISING-XX', new Gate({

		symbol:    'XX', 
		symbolAmazonBraket: 'xx', 
		symbolSvg: '', 
		name:      'Ising XX Coupling',
		nameCss:   'ising-xx-coupling',
		parameters: { "phi" : 1 },
		updateMatrix$: function( phi ) {
			
			if( mathf.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ] = +phi
			this.matrix = new Matrix(
				[ Math.cos( this.parameters[ "phi" ] / 2 ), 0, 0, new ComplexNumber( 0, -Math.sin( this.parameters[ "phi" ] / 2 )) ],
				[ 0, Math.cos( this.parameters[ "phi" ] / 2 ), new ComplexNumber( 0, -Math.sin( this.parameters[ "phi" ] / 2 )), 0 ],
				[ 0, new ComplexNumber( 0, -Math.sin( this.parameters[ "phi" ] / 2 )), Math.cos( this.parameters[ "phi" ] / 2 ), 0 ],
				[ new ComplexNumber( 0, -Math.sin( this.parameters[ "phi" ] / 2 )), 0, 0, Math.cos( this.parameters[ "phi" ] / 2 ) ])
			return this
		},
		is_multi_qubit: true,
		has_parameters:		true 
	}), 
	'ISING-XY', new Gate({

		symbol:    'XY', 
		symbolAmazonBraket: 'xy', 
		symbolSvg: '', 
		name:      'Ising XY Coupling',
		nameCss:   'ising-xy-coupling',
		parameters: { "phi" : 1 },
		updateMatrix$: function( phi ) {
			
			if( mathf.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ] = +phi
			this.matrix = new Matrix(
				[ 1, 0, 0, 0 ],
				[ 0, Math.cos( this.parameters[ "phi" ] / 2 ), new ComplexNumber( 0, Math.sin( this.parameters[ "phi" ] / 2 )), 0 ],
				[ 0, new ComplexNumber( 0, Math.sin( this.parameters[ "phi" ] / 2 )), Math.cos( this.parameters[ "phi" ] / 2 ), 0 ],
				[ 0, 0, 0, 1 ])
			return this
		},
		is_multi_qubit: true,
		has_parameters:		true	 	 
	}), 
	'ISING-YY', new Gate({
		
		symbol:    'YY', 
		symbolAmazonBraket: 'yy', 
		symbolSvg: '', 
		name:      'Ising YY Coupling',
		nameCss:   'ising-yy-coupling',
		parameters: { "phi" : 1 },
		updateMatrix$: function( phi ) {
			
			if( mathf.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ] = +phi
			this.matrix = new Matrix(
				[ Math.cos( this.parameters[ "phi" ] / 2 ), 0, 0, new ComplexNumber( 0, Math.sin( this.parameters[ "phi" ] / 2 )) ],
				[ 0, Math.cos( this.parameters[ "phi" ] / 2 ), new ComplexNumber( 0, -Math.sin( this.parameters[ "phi" ] / 2 )), 0 ],
				[ 0, new ComplexNumber( 0, -Math.sin( this.parameters[ "phi" ] / 2 )), Math.cos( this.parameters[ "phi" ] / 2 ), 0 ],
				[ new ComplexNumber( 0, -Math.sin( this.parameters[ "phi" ] / 2 )), 0, 0, Math.cos( this.parameters[ "phi" ] / 2 ) ])
			return this
		},
		is_multi_qubit: true,
		has_parameters:		true
	}), 
	'ISING-ZZ', new Gate({

		symbol:    'ZZ', 
		symbolAmazonBraket: 'zz', 
		symbolSvg: '', 
		name:      'Ising ZZ Coupling',
		nameCss:   'ising-zz-coupling',
		parameters: { "phi" : 1 },
		updateMatrix$: function( phi ) {
			
			if( mathf.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ] = +phi
			this.matrix = new Matrix(
				[ ComplexNumber.E.power( new ComplexNumber( 0, this.parameters[ "phi" ] / 2 )), 0, 0, 0 ],
				[ 0, ComplexNumber.E.power( new ComplexNumber( 0, this.parameters[ "phi" ] / 2 )), 0, 0 ],
				[ 0, 0, ComplexNumber.E.power( new ComplexNumber( 0, this.parameters[ "phi" ] / 2 )), 0],
				[ 0, 0, 0, ComplexNumber.E.power( new ComplexNumber( 0, -this.parameters[ "phi" ] / 2 )) ])
			return this
		},
		is_multi_qubit: true,
		has_parameters:		true	 
	}), 
	'CPhase00', new Gate({

		symbol:    '00', //placeholder 
		symbolAmazonBraket: 'cphaseshift00', 
		symbolSvg: '', 
		name:      'Controlled Phase Shift 00',
		nameCss:   'cphase00',
		parameters: { "phi" : 1 },
		updateMatrix$: function( phi ) {
			
			if( mathf.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ] = +phi
			this.matrix = new Matrix(
				[ ComplexNumber.E.power( new ComplexNumber( 0, this.parameters[ "phi" ] )), 0, 0, 0 ],
				[ 0, 1, 0, 0 ],
				[ 0, 0, 1, 0 ],
				[ 0, 0, 0, 1 ])
			return this
		},
		is_multi_qubit: true,
		has_parameters:		true	 	 
	}),
	'CPhase01', new Gate({

		symbol:    '01', //placeholder 
		symbolAmazonBraket: 'cphaseshift01', 
		symbolSvg: '', 
		name:      'Controlled Phase Shift 01',
		nameCss:   'cphase01',
		parameters: { "phi" : 1 },
		updateMatrix$: function( phi ) {
			
			if( mathf.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ] = +phi
			this.matrix = new Matrix(
				[ 1, 0, 0, 0 ],
				[ 0, ComplexNumber.E.power( new ComplexNumber( 0, this.parameters[ "phi" ] )), 0, 0 ],
				[ 0, 0, 1, 0 ],
				[ 0, 0, 0, 1 ])
			return this
		},
		is_multi_qubit: true,
		has_parameters:		true	 	 
	}),
	'CPhase10', new Gate({

		symbol:    '10', //placeholder 
		symbolAmazonBraket: 'cphaseshift10', 
		symbolSvg: '', 
		name:      'Controlled Phase Shift 10',
		nameCss:   'cphase01',
		parameters: { "phi" : 1 },
		updateMatrix$: function( phi ) {
			
			if( mathf.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ] = +phi
			this.matrix = new Matrix(
				[ 1, 0, 0, 0 ],
				[ 0, 1, 0, 0 ],
				[ 0, 0, ComplexNumber.E.power( new ComplexNumber( 0, this.parameters[ "phi" ] )), 0 ],
				[ 0, 0, 0, 1 ])
			return this
		},
		is_multi_qubit: 	true,
		has_parameters:		true	 
	}), 
	'CSWAP', new Gate({

		symbol:    'CSWAP',
		symbolAmazonBraket: 'cswap', 
		symbolSvg: '', 
		name:      'Controlled Swap',
		nameCss:   'controlled-swap',
		matrix: new Matrix(
			[1, 0, 0, 0, 0, 0, 0, 0],
			[0, 1, 0, 0, 0, 0, 0, 0],
			[0, 0, 1, 0, 0, 0, 0, 0],
			[0, 0, 0, 1, 0, 0, 0, 0],
			[0, 0, 0, 0, 1, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 1, 0],
			[0, 0, 0, 0, 0, 1, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 1]
		)
	})	 
	/*


	All further gates,
	such as Toffoli (CCNOT)
	or Fredkin (CSWAP)
	can be easily constructed
	from the above gates
	using Q conveniences.


	*/
)



module.exports = { Gate };
},{"./Logging":3,"./Math-Functions":4,"./Q-ComplexNumber":7,"./Q-Matrix":10}],9:[function(require,module,exports){

//  Copyright © 2019–2020, Stewart Smith. See LICENSE for details.

const {dispatchCustomEventToGlobal} = require('./Misc');


History = function( instance ){

	this.instance = instance
	this.entries = [[{

		redo:  {},
		undo: [{}]
	}]]
	this.index = 0
	this.isRecording = true
}




Object.assign( History.prototype, {

	assess: function(){

		const instance = this.instance
		if( this.index > 0 ){

			dispatchCustomEventToGlobal(
				'History undo is capable', { detail: { instance }}
			);
		}
		else {

			dispatchCustomEventToGlobal(
				'History undo is depleted', { detail: { instance }}
			)
		}
		if( this.index + 1 < this.entries.length ){

			dispatchCustomEventToGlobal(
				'History redo is capable', { detail: { instance }}
			)
		}
		else {

			dispatchCustomEventToGlobal(
				'History redo is depleted', { detail: { instance }}
			)
		}
		return this
	},
	createEntry$: function(){
		
		this.entries.splice( this.index + 1 )
		this.entries.push([])
		this.index = this.entries.length - 1
	},
	record$: function( entry ){
		

		//  Are we recording this history?
		//  Usually, yes.
		//  But if our history state is “playback”
		//  then we will NOT record this.

		if( this.isRecording ){
		
			this.entries[ this.index ].push( entry )
			this.index = this.entries.length - 1
			this.assess()
		}
		return this
	},
	step$: function( direction ){


		//  If we are stepping backward (undo)
		//  we cannot go back further than index === 0
		//  which we would happen if index is already 0
		//  before we subtract 1.
		//  Similarly, if stepping forward (redo)
		//  we cannot go further than index === entries.length - 1
		//  which would happen if the index is already entries.length
		//  before we add 1.

		if(
			( direction < 0 && this.index < 1 ) || 
			( direction > 0 && this.index > this.entries.length - 2 )
		) return false


		//  Before we step backward (undo) or forward (redo)
		//  we need to turn OFF history recording.

		this.isRecording = false

		const 
		instance = this.instance,
		command = direction < 0 ? 'undo' : 'redo'


		//  If we are stepping forward (redo)
		//  then we need to advance the history index
		//  BEFORE we execute.

		if( direction > 0 ) this.index ++


		//  Take this history entry, which itself is an Array.
		//  It may contain several tasks.
		//  Put my thing down, flip and reverse it.
		//  .ti esrever dna pilf ,nwod gniht ym tuP

		const entry = direction > 0 ?
			Array.from( this.entries[ this.index ]) :
			Array.from( this.entries[ this.index ]).reverse()

		entry
		.reduce( function( tasks, subentry, s ){

			return tasks.concat( subentry[ command ])

		}, [] )
		.forEach( function( task, i ){

			if( typeof task.func === 'function' ){

				task.func.apply( instance, task.args )
			}
		})


		//  If we are stepping backward (undo)
		//  then we decrement the history index
		//  AFTER the execution above.

		if( direction < 0 ) this.index --
		

		//  It’s now safe to turn recording back on.

		this.isRecording = true


		//  Emit an event so the GUI or anyone else listening
		//  can know if we have available undo or redo commands
		//  based on where or index is.
		
		this.assess()
		return true
	},
	undo$: function(){ return this.step$( -1 )},
	redo$: function(){ return this.step$(  1 )},
	report: function(){

		const argsParse = function( output, entry, i ){

			if( i > 0 ) output += ',  '
			return output + ( typeof entry === 'object' && entry.name ? entry.name : entry )
		}
		return this.entries.reduce( function( output, entry, i ){

			output += '\n\n'+ i + ' ════════════════════════════════════════'+
			entry.reduce( function( output, entry, i ){

				output += '\n\n    '+ i +' ────────────────────────────────────────\n'
				if( entry.redo ){
				
					output += '\n        ⟳ Redo   ── '+ entry.redo.name +'  '
					if( entry.redo.args ) output += entry.redo.args.reduce( argsParse, '' )
				}
				output += entry.undo.reduce( function( output, entry, i ){

					output += '\n        ⟲ Undo '+ i +' ── '+ entry.name +'  '
					if( entry.args ) output += entry.args.reduce( argsParse, '' )
					return output

				}, '' )

				return output

			}, '' )
			return output
		
		}, 'History entry cursor: '+ this.index )		
	}
})



module.exports = { History };
},{"./Misc":5}],10:[function(require,module,exports){
//  Copyright © 2019–2020, Stewart Smith. See LICENSE for details.

const logger = require('./Logging');
const {ComplexNumber} = require('./Q-ComplexNumber');

Matrix = function () {
  //  We’re keeping track of how many matrices are
  //  actually being generated. Just curiosity.

  this.index = Matrix.index++;

  let matrixWidth = null;

  //  Has Matrix been called with two numerical arguments?
  //  If so, we need to create an empty Matrix
  //  with dimensions of those values.

  if (arguments.length == 1 && ComplexNumber.isNumberLike(arguments[0])) {
    matrixWidth = arguments[0];
    this.rows = new Array(matrixWidth).fill(0).map(function () {
      return new Array(matrixWidth).fill(0);
    });
  } else if (
    arguments.length == 2 &&
    ComplexNumber.isNumberLike(arguments[0]) &&
    ComplexNumber.isNumberLike(arguments[1])
  ) {
    matrixWidth = arguments[0];
    this.rows = new Array(arguments[1]).fill(0).map(function () {
      return new Array(matrixWidth).fill(0);
    });
  } else {
    //  Matrices’ primary organization is by rows,
    //  which is more congruent with our written langauge;
    //  primarily organizated by horizontally juxtaposed glyphs.
    //  That means it’s easier to write an instance invocation in code
    //  and easier to read when inspecting properties in the console.

    let matrixWidthIsBroken = false;
    this.rows = Array.from(arguments);
    this.rows.forEach(function (row) {
      if (row instanceof Array !== true) row = [row];
      if (matrixWidth === null) matrixWidth = row.length;
      else if (matrixWidth !== row.length) matrixWidthIsBroken = true;
    });
    if (matrixWidthIsBroken)
      return logger.error(
        `Matrix found upon initialization that matrix#${this.index} row lengths were not equal. You are going to have a bad time.`,
        this
      );
  }

  //  But for convenience we can also organize by columns.
  //  Note this represents the transposed version of itself!

  const matrix = this;
  this.columns = [];
  for (let x = 0; x < matrixWidth; x++) {
    const column = [];
    for (let y = 0; y < this.rows.length; y++) {
      //  Since we’re combing through here
      //  this is a good time to convert Number to ComplexNumber!

      const value = matrix.rows[y][x];
      if (typeof value === "number") {
        // console.log('Created a  complex number!')
        matrix.rows[y][x] = new ComplexNumber(value);
      } else if (value instanceof ComplexNumber === false) {
        return logger.error(
          `Matrix found upon initialization that matrix#${this.index} contained non-quantitative values. A+ for creativity, but F for functionality.`,
          this
        );
      }

      // console.log( x, y, matrix.rows[ y ][ x ])

      Object.defineProperty(column, y, {
        get: function () {
          return matrix.rows[y][x];
        },
        set: function (n) {
          matrix.rows[y][x] = n;
        },
      });
    }
    this.columns.push(column);
  }
};

///////////////////////////
//                       //
//   Static properties   //
//                       //
///////////////////////////

Object.assign(Matrix, {
  index: 0,
  help: function () {
    return logger.help(this);
  },
  constants: {}, //  Only holds references; an easy way to look up what constants exist.
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

  isMatrixLike: function (obj) {
    //return obj instanceof Matrix || Matrix.prototype.isPrototypeOf( obj )
    return obj instanceof this || this.prototype.isPrototypeOf(obj);
  },
  isWithinRange: function (n, minimum, maximum) {
    return (
      typeof n === "number" && n >= minimum && n <= maximum && n == parseInt(n)
    );
  },
  getWidth: function (matrix) {
    return matrix.columns.length;
  },
  getHeight: function (matrix) {
    return matrix.rows.length;
  },
  haveEqualDimensions: function (matrix0, matrix1) {
    return (
      matrix0.rows.length === matrix1.rows.length &&
      matrix0.columns.length === matrix1.columns.length
    );
  },
  areEqual: function (matrix0, matrix1) {
    if (matrix0 instanceof Matrix !== true) return false;
    if (matrix1 instanceof Matrix !== true) return false;
    if (Matrix.haveEqualDimensions(matrix0, matrix1) !== true) return false;
    return matrix0.rows.reduce(function (state, row, r) {
      return (
        state &&
        row.reduce(function (state, cellValue, c) {
          return state && cellValue.isEqualTo(matrix1.rows[r][c]);
        }, true)
      );
    }, true);
  },

  createSquare: function (size, f) {
    if (typeof size !== "number") size = 2;
    if (typeof f !== "function")
      f = function () {
        return 0;
      };
    const data = [];
    for (let y = 0; y < size; y++) {
      const row = [];
      for (let x = 0; x < size; x++) {
        row.push(f(x, y));
      }
      data.push(row);
    }
    return new Matrix(...data);
  },
  createZero: function (size) {
    return new Matrix.createSquare(size);
  },
  createOne: function (size) {
    return new Matrix.createSquare(size, function () {
      return 1;
    });
  },
  createIdentity: function (size) {
    return new Matrix.createSquare(size, function (x, y) {
      return x === y ? 1 : 0;
    });
  },

  //  Import FROM a format.

  from: function (format) {
    if (typeof format !== "string") format = "Array";
    const f = Matrix["from" + format];
    format = format.toLowerCase();
    if (typeof f !== "function")
      return logger.error(
        `Matrix could not find an importer for “${format}” data.`
      );
    return f;
  },
  fromArray: function (array) {
    return new Matrix(...array);
  },
  fromXsv: function (input, rowSeparator, valueSeparator) {
    `
		Ingest string data organized by row, then by column
		where rows are separated by one token (default: \n)
		and column values are separated by another token
		(default: \t).

		`;

    if (typeof rowSeparator !== "string") rowSeparator = "\n";
    if (typeof valueSeparator !== "string") valueSeparator = "\t";

    const inputRows = input.split(rowSeparator),
      outputRows = [];

    inputRows.forEach(function (inputRow) {
      inputRow = inputRow.trim();
      if (inputRow === "") return;

      const outputRow = [];
      inputRow.split(valueSeparator).forEach(function (cellValue) {
        outputRow.push(parseFloat(cellValue));
      });
      outputRows.push(outputRow);
    });
    return new Matrix(...outputRows);
  },
  fromCsv: function (csv) {
    return Matrix.fromXsv(csv.replace(/\r/g, "\n"), "\n", ",");
  },
  fromTsv: function (tsv) {
    return Matrix.fromXsv(tsv, "\n", "\t");
  },
  fromHtml: function (html) {
    return Matrix.fromXsv(
      html
        .replace(/\r?\n|\r|<tr>|<td>/g, "")
        .replace(/<\/td>(\s*)<\/tr>/g, "</tr>")
        .match(/<table>(.*)<\/table>/i)[1],
      "</tr>",
      "</td>"
    );
  },

  //  Export TO a format.

  toXsv: function (matrix, rowSeparator, valueSeparator) {
    return matrix.rows.reduce(function (xsv, row) {
      return (
        xsv +
        rowSeparator +
        row.reduce(function (xsv, cell, c) {
          return xsv + (c > 0 ? valueSeparator : "") + cell.toText();
        }, "")
      );
    }, "");
  },
  toCsv: function (matrix) {
    return Matrix.toXsv(matrix, "\n", ",");
  },
  toTsv: function (matrix) {
    return Matrix.toXsv(matrix, "\n", "\t");
  },

  //  Operate NON-destructive.

  add: function (matrix0, matrix1) {
    if (
      Matrix.isMatrixLike(matrix0) !== true ||
      Matrix.isMatrixLike(matrix1) !== true
    ) {
      return logger.error(
        `Matrix attempted to add something that was not a matrix.`
      );
    }
    if (Matrix.haveEqualDimensions(matrix0, matrix1) !== true)
      return logger.error(
        `Matrix cannot add matrix#${matrix0.index} of dimensions ${matrix0.columns.length}x${matrix0.rows.length} to matrix#${matrix1.index} of dimensions ${matrix1.columns.length}x${matrix1.rows.length}.`
      );

    return new Matrix(
      ...matrix0.rows.reduce(function (resultMatrixRow, row, r) {
        resultMatrixRow.push(
          row.reduce(function (resultMatrixColumn, cellValue, c) {
            // resultMatrixColumn.push( cellValue + matrix1.rows[ r ][ c ])
            resultMatrixColumn.push(cellValue.add(matrix1.rows[r][c]));
            return resultMatrixColumn;
          }, [])
        );
        return resultMatrixRow;
      }, [])
    );
  },
  multiplyScalar: function (matrix, scalar) {
    if (Matrix.isMatrixLike(matrix) !== true) {
      return logger.error(
        `Matrix attempted to scale something that was not a matrix.`
      );
    }
    if (typeof scalar !== "number") {
      return logger.error(
        `Matrix attempted to scale this matrix#${matrix.index} by an invalid scalar: ${scalar}.`
      );
    }
    return new Matrix(
      ...matrix.rows.reduce(function (resultMatrixRow, row) {
        resultMatrixRow.push(
          row.reduce(function (resultMatrixColumn, cellValue) {
            // resultMatrixColumn.push( cellValue * scalar )
            resultMatrixColumn.push(cellValue.multiply(scalar));
            return resultMatrixColumn;
          }, [])
        );
        return resultMatrixRow;
      }, [])
    );
  },
  multiply: function (matrix0, matrix1) {
    `
		Two matrices can be multiplied only when 
		the number of columns in the first matrix
		equals the number of rows in the second matrix.
		Reminder: Matrix multiplication is not commutative
		so the order in which you multiply matters.


			SEE ALSO

		https://en.wikipedia.org/wiki/Matrix_multiplication
		`;

    if (
      Matrix.isMatrixLike(matrix0) !== true ||
      Matrix.isMatrixLike(matrix1) !== true
    ) {
      return logger.error(
        `Matrix attempted to multiply something that was not a matrix.`
      );
    }
    if (matrix0.columns.length !== matrix1.rows.length) {
      return logger.error(
        `Matrix attempted to multiply Matrix#${matrix0.index}(cols==${matrix0.columns.length}) by Matrix#${matrix1.index}(rows==${matrix1.rows.length}) but their dimensions were not compatible for this.`
      );
    }
    const resultMatrix = [];
    matrix0.rows.forEach(function (matrix0Row) {
      //  Each row of THIS matrix

      const resultMatrixRow = [];
      matrix1.columns.forEach(function (matrix1Column) {
        //  Each column of OTHER matrix

        const sum = new ComplexNumber();
        matrix1Column.forEach(function (matrix1CellValue, index) {
          //  Work down the column of OTHER matrix

          sum.add$(matrix0Row[index].multiply(matrix1CellValue));
        });
        resultMatrixRow.push(sum);
      });
      resultMatrix.push(resultMatrixRow);
    });
    //return new Matrix( ...resultMatrix )
    return new this(...resultMatrix);
  },
  multiplyTensor: function (matrix0, matrix1) {
    `
		https://en.wikipedia.org/wiki/Kronecker_product
		https://en.wikipedia.org/wiki/Tensor_product
		`;

    if (
      Matrix.isMatrixLike(matrix0) !== true ||
      Matrix.isMatrixLike(matrix1) !== true
    ) {
      return logger.error(
        `Matrix attempted to tensor something that was not a matrix.`
      );
    }

    const resultMatrix = [],
      resultMatrixWidth = matrix0.columns.length * matrix1.columns.length,
      resultMatrixHeight = matrix0.rows.length * matrix1.rows.length;

    for (let y = 0; y < resultMatrixHeight; y++) {
      const resultMatrixRow = [];
      for (let x = 0; x < resultMatrixWidth; x++) {
        const matrix0X = Math.floor(x / matrix0.columns.length),
          matrix0Y = Math.floor(y / matrix0.rows.length),
          matrix1X = x % matrix1.columns.length,
          matrix1Y = y % matrix1.rows.length;

        resultMatrixRow.push(
          //matrix0.rows[ matrix0Y ][ matrix0X ] * matrix1.rows[ matrix1Y ][ matrix1X ]
          matrix0.rows[matrix0Y][matrix0X].multiply(
            matrix1.rows[matrix1Y][matrix1X]
          )
        );
      }
      resultMatrix.push(resultMatrixRow);
    }
    return new Matrix(...resultMatrix);
  },
});

//////////////////////////////
//                          //
//   Prototype properties   //
//                          //
//////////////////////////////

Object.assign(Matrix.prototype, {
  isValidRow: function (r) {
    return Matrix.isWithinRange(r, 0, this.rows.length - 1);
  },
  isValidColumn: function (c) {
    return Matrix.isWithinRange(c, 0, this.columns.length - 1);
  },
  isValidAddress: function (x, y) {
    return this.isValidRow(y) && this.isValidColumn(x);
  },
  getWidth: function () {
    return Matrix.getWidth(this);
  },
  getHeight: function () {
    return Matrix.getHeight(this);
  },

  //  Read NON-destructive by nature. (Except quantum reads of course! ROFL!!)

  read: function (x, y) {
    `
		Equivalent to 
		this.columns[ x ][ y ] 
		or 
		this.rows[ y ][ x ]
		but with safety checks.
		`;

    if (this.isValidAddress(x, y)) return this.rows[y][x];
    return logger.error(
      `Matrix could not read from cell address (x=${x}, y=${y}) in matrix#${this.index}.`,
      this
    );
  },
  clone: function () {
    return new Matrix(...this.rows);
  },
  isEqualTo: function (otherMatrix) {
    return Matrix.areEqual(this, otherMatrix);
  },

  toArray: function () {
    return this.rows;
  },
  toXsv: function (rowSeparator, valueSeparator) {
    return Matrix.toXsv(this, rowSeparator, valueSeparator);
  },
  toCsv: function () {
    return Matrix.toXsv(this, "\n", ",");
  },
  toTsv: function () {
    return Matrix.toXsv(this, "\n", "\t");
  },
  toHtml: function () {
    return (
      this.rows.reduce(function (html, row) {
        return (
          html +
          row.reduce(function (html, cell) {
            return html + "\n\t\t<td>" + cell.toText() + "</td>";
          }, "\n\t<tr>") +
          "\n\t</tr>"
        );
      }, "\n<table>") + "\n</table>"
    );
  },

  //  Write is DESTRUCTIVE by nature. Not cuz I hate ya.

  write$: function (x, y, n) {
    `
		Equivalent to 
		this.columns[ x ][ y ] = n 
		or 
		this.rows[ y ][ x ] = n
		but with safety checks.
		`;

    if (this.isValidAddress(x, y)) {
      if (ComplexNumber.isNumberLike(n)) n = new ComplexNumber(n);
      if (n instanceof ComplexNumber !== true)
        return logger.error(
          `Attempted to write an invalid value (${n}) to matrix#${this.index} at x=${x}, y=${y}`,
          this
        );
      this.rows[y][x] = n;
      return this;
    }
    return logger.error(
      `Invalid cell address for Matrix#${this.index}: x=${x}, y=${y}`,
      this
    );
  },
  copy$: function (matrix) {
    if (Matrix.isMatrixLike(matrix) !== true)
      return logger.error(
        `Matrix attempted to copy something that was not a matrix in to this matrix#${matrix.index}.`,
        this
      );

    if (Matrix.haveEqualDimensions(matrix, this) !== true)
      return logger.error(
        `Matrix cannot copy matrix#${matrix.index} of dimensions ${matrix.columns.length}x${matrix.rows.length} in to this matrix#${this.index} of dimensions ${this.columns.length}x${this.rows.length} because their dimensions do not match.`,
        this
      );

    const that = this;
    matrix.rows.forEach(function (row, r) {
      row.forEach(function (n, c) {
        that.rows[r][c] = n;
      });
    });
    return this;
  },
  fromArray$: function (array) {
    return this.copy$(Matrix.fromArray(array));
  },
  fromCsv$: function (csv) {
    return this.copy$(Matrix.fromCsv(csv));
  },
  fromTsv$: function (tsv) {
    return this.copy$(Matrix.fromTsv(tsv));
  },
  fromHtml$: function (html) {
    return this.copy$(Matrix.fromHtml(html));
  },

  //  Operate NON-destructive.

  add: function (otherMatrix) {
    return Matrix.add(this, otherMatrix);
  },
  multiplyScalar: function (scalar) {
    return Matrix.multiplyScalar(this, scalar);
  },
  multiply: function (otherMatrix) {
    return Matrix.multiply(this, otherMatrix);
  },
  multiplyTensor: function (otherMatrix) {
    return Matrix.multiplyTensor(this, otherMatrix);
  },

  //  Operate DESTRUCTIVE.

  add$: function (otherMatrix) {
    return this.copy$(this.add(otherMatrix));
  },
  multiplyScalar$: function (scalar) {
    return this.copy$(this.multiplyScalar(scalar));
  },
});

//////////////////////////
//                      //
//   Static constants   //
//                      //
//////////////////////////

Matrix.createConstants(
  "IDENTITY_2X2",
  Matrix.createIdentity(2),
  "IDENTITY_3X3",
  Matrix.createIdentity(3),
  "IDENTITY_4X4",
  Matrix.createIdentity(4),

  "CONSTANT0_2X2",
  new Matrix([1, 1], [0, 0]),

  "CONSTANT1_2X2",
  new Matrix([0, 0], [1, 1]),

  "NEGATION_2X2",
  new Matrix([0, 1], [1, 0]),

  "TEST_MAP_9X9",
  new Matrix(
    [11, 21, 31, 41, 51, 61, 71, 81, 91],
    [12, 22, 32, 42, 52, 62, 72, 82, 92],
    [13, 23, 33, 43, 53, 63, 73, 83, 93],
    [14, 24, 34, 44, 54, 64, 74, 84, 94],
    [15, 25, 35, 45, 55, 65, 75, 85, 95],
    [16, 26, 36, 46, 56, 66, 76, 86, 96],
    [17, 27, 37, 47, 57, 67, 77, 87, 97],
    [18, 28, 38, 48, 58, 68, 78, 88, 98],
    [19, 29, 39, 49, 59, 69, 79, 89, 99]
  )
);

module.exports = { Matrix };
},{"./Logging":3,"./Q-ComplexNumber":7}],11:[function(require,module,exports){
//  Copyright © 2019–2020, Stewart Smith. See LICENSE for details.
const { Matrix } = require("./Q-Matrix");
const { Gate } = require("./Q-Gate");
const { ComplexNumber } = require("./Q-ComplexNumber");
const misc = require("./Misc");
const logger = require("./Logging");

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
    return logger.help(this);
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

module.exports = { Qubit };

},{"./Logging":3,"./Misc":5,"./Q-ComplexNumber":7,"./Q-Gate":8,"./Q-Matrix":10}],12:[function(require,module,exports){
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


},{"./Math-Functions":4,"./Misc":5,"./Q-Circuit":6}],13:[function(require,module,exports){
const logger = require('./Logging');
const misc = require('./Misc');
const mathf = require('./Math-Functions');
const {ComplexNumber} = require('./Q-ComplexNumber');
const {Gate} = require('./Q-Gate');
const {Qubit} = require('./Q-Qubit');
const {Matrix} = require('./Q-Matrix');
const {History} = require('./Q-History');
const {Circuit} = require('./Q-Circuit');
const {Q} = require('./Q.js');

module.exports = {logger, misc, mathf, ComplexNumber, Matrix, Gate, Qubit, History, Circuit, Q};

},{"./Logging":3,"./Math-Functions":4,"./Misc":5,"./Q-Circuit":6,"./Q-ComplexNumber":7,"./Q-Gate":8,"./Q-History":9,"./Q-Matrix":10,"./Q-Qubit":11,"./Q.js":12}],14:[function(require,module,exports){

//  Copyright © 2019–2020, Stewart Smith. See LICENSE for details.



const {Qubit} = require('quantum-js-util');
BlochSphere = function( onValueChange ){

	Object.assign( this, {

		isRotating:    false,
		radius:        1,
		radiusSafe:    1.01,
		axesLineWidth: 0.01,
		arcLineWidth:  0.015,
		state:         Qubit.LEFT_HAND_CIRCULAR_POLARIZED.toBlochSphere(),
		target:        Qubit.HORIZONTAL.toBlochSphere(),
		group:         new THREE.Group(),
		onValueChange
	})


	//  Create the surface of the Bloch sphere.

	const surface = new THREE.Mesh( 

		new THREE.SphereGeometry( this.radius, 64, 64 ),
		new THREE.MeshPhongMaterial({

			side: THREE.FrontSide,
			map: BlochSphere.makeSurface(),
			transparent: true,
			opacity: 0.97
		})
	)
	surface.receiveShadow = true
	this.group.add( surface )




	//  Create the X, Y, and Z axis lines.

	const 
	xAxis = new THREE.Mesh(

		new THREE.BoxGeometry( this.axesLineWidth, this.axesLineWidth, this.radius * 2.5 ),
		new THREE.MeshBasicMaterial({ color: BlochSphere.xAxisColor })
	),
	yAxis = new THREE.Mesh(

		new THREE.BoxGeometry( this.radius * 2.5, this.axesLineWidth, this.axesLineWidth ),
		new THREE.MeshBasicMaterial({ color: BlochSphere.yAxisColor })
	),
	zAxis = new THREE.Mesh(

		new THREE.BoxGeometry( this.axesLineWidth, this.radius * 2.5, this.axesLineWidth ),
		new THREE.MeshBasicMaterial({ color: BlochSphere.zAxisColor })
	)

	this.group.add( xAxis, yAxis, zAxis )


	//  Create X, Y, and Z arrow heads,
	//  indicating positive directions for all three.

	const 
	arrowLength     = 0.101,//  I know, weird, right?
	arrowHeadLength = 0.1,
	arrowHeadWidth  = 0.1

	this.group.add( new THREE.ArrowHelper( 

		new THREE.Vector3( 0, 0, 1.00 ), 
		new THREE.Vector3( 0, 0, 1.25 ),
		arrowLength, 
		BlochSphere.xAxisColor,//  Red
		arrowHeadLength, 
		arrowHeadWidth
	))
	this.group.add( new THREE.ArrowHelper( 

		new THREE.Vector3( 1.00, 0, 0 ), 
		new THREE.Vector3( 1.25, 0, 0 ), 
		arrowLength, 
		BlochSphere.yAxisColor,//  Green
		arrowHeadLength, 
		arrowHeadWidth
	))
	this.group.add( new THREE.ArrowHelper( 

		new THREE.Vector3( 0, 1.00, 0 ), 
		new THREE.Vector3( 0, 1.25, 0 ), 
		arrowLength, 
		BlochSphere.zAxisColor,//  Blue
		arrowHeadLength, 
		arrowHeadWidth
	))


	//  Create the X, Y, and Z axis labels.

	const
	axesLabelStyle = {

		width:  128,
		height: 128,
		fillStyle: BlochSphere.vectorColor,//'#505962',
		font: 'bold italic 64px Georgia, "Times New Roman", serif'
	},
	xAxisLabel = new THREE.Sprite( 

		new THREE.SpriteMaterial({ 

			map: Object.assign( SurfaceText( axesLabelStyle ))
		})
	),
	yAxisLabel = new THREE.Sprite( 

		new THREE.SpriteMaterial({ 

			map: Object.assign( SurfaceText( axesLabelStyle ))
		})
	),
	zAxisLabel = new THREE.Sprite( 

		new THREE.SpriteMaterial({ 

			map: Object.assign( SurfaceText( axesLabelStyle ))
		})
	)

	xAxisLabel.material.map.print( 'x' )
	xAxisLabel.position.set( 0, 0, 1.45 )
	xAxisLabel.scale.set( 0.25, 0.25, 0.25 )
	xAxis.add( xAxisLabel )

	yAxisLabel.material.map.print( 'y' )
	yAxisLabel.position.set( 1.45, 0, 0 )
	yAxisLabel.scale.set( 0.25, 0.25, 0.25 )
	yAxis.add( yAxisLabel )

	zAxisLabel.material.map.print( 'z' )
	zAxisLabel.position.set( 0, 1.45, 0 )
	zAxisLabel.scale.set( 0.25, 0.25, 0.25 )
	zAxis.add( zAxisLabel )


	this.blochColor = new THREE.Color()


	//  Create the line from the sphere’s origin 
	//  out to where the Bloch vector intersects
	//  with the sphere’s surface.

	this.blochVector = new THREE.Mesh(

		new THREE.BoxGeometry( 0.04, 0.04, this.radius ),
		new THREE.MeshBasicMaterial({ color: BlochSphere.vectorColor })
	)
	this.blochVector.geometry.translate( 0, 0, 0.5 )
	this.group.add( this.blochVector )


	//  Create the cone that indicates the Bloch vector
	//  and points to where that vectors
	//  intersects with the surface of the sphere.

	this.blochPointer = new THREE.Mesh(

		new THREE.CylinderBufferGeometry( 0, 0.5, 1, 32, 1 ),
		new THREE.MeshPhongMaterial({ color: BlochSphere.vectorColor })
	)
	this.blochPointer.geometry.translate( 0, -0.5, 0 )
	this.blochPointer.geometry.rotateX( Math.PI / 2 )
	this.blochPointer.geometry.scale( 0.2, 0.2, 0.2 )
	this.blochPointer.lookAt( new THREE.Vector3() )
	this.blochPointer.receiveShadow = true
	this.blochPointer.castShadow = true
	this.group.add( this.blochPointer )


	//  Create the Theta ring that will belt the sphere.

	const
	arcR = this.radiusSafe * Math.sin( Math.PI / 2 ),
	arcH = this.radiusSafe * Math.cos( Math.PI / 2 ),
	thetaGeometry = BlochSphere.createLatitudeArc( arcR, 128, Math.PI / 2, Math.PI * 2 ),
	thetaLine = new MeshLine(),
	thetaPhiMaterial = new MeshLineMaterial({

		color: BlochSphere.thetaPhiColor,//0x505962,
		lineWidth: this.arcLineWidth * 3,
		sizeAttenuation: true
	})

	thetaGeometry.rotateX( Math.PI / 2 )
	thetaGeometry.rotateY( Math.PI / 2 )
	thetaGeometry.translate( 0, arcH, 0 )
	thetaLine.setGeometry( thetaGeometry )

	this.thetaMesh = new THREE.Mesh( 

		thetaLine.geometry,
		thetaPhiMaterial
	)
	this.group.add( this.thetaMesh )


	//  Create the Phi arc that will draw from the north pole
	//  down to wherever the Theta arc rests.

	this.phiGeometry = BlochSphere.createLongitudeArc( this.radiusSafe, 64, 0, Math.PI * 2 ),
	this.phiLine = new MeshLine()
	this.phiLine.setGeometry( this.phiGeometry )
	this.phiMesh = new THREE.Mesh( 

		this.phiLine.geometry,
		thetaPhiMaterial
	)
	this.group.add( this.phiMesh )




	//  Time to put plans to action.

	BlochSphere.prototype.setTargetState.call( this )
}






    ////////////////
   //            //
  //   Static   //
 //            //
////////////////


Object.assign( BlochSphere, {

	xAxisColor:    0x333333,//  Was 0xCF1717 (red)
	yAxisColor:    0x333333,//  Was 0x59A112 (green)
	zAxisColor:    0x333333,//  Was 0x0F66BD (blue)
	vectorColor:   0xFFFFFF,//  Was 0xF2B90D (yellow)
	thetaPhiColor: 0x333333,//  Was 0xF2B90D (yellow)


	//  It’s important that we build the texture
	//  right here and now, rather than load an image.
	//  Why? Because if we load a pre-existing image
	//  we run into CORS problems using file:/// !

	makeSurface: function(){

		const
		width  = 2048,
		height = width / 2

		const canvas  = document.createElement( 'canvas' )
		canvas.width  = width
		canvas.height = height
		
		const context = canvas.getContext( '2d' )
		context.fillStyle = 'hsl( 210, 20%, 100% )'
		context.fillRect( 0, 0, width, height )


		//  Create the base hue gradient for our texture.

		const 
		hueGradient = context.createLinearGradient( 0, height / 2, width, height / 2 ),
		hueSteps    = 180,
		huesPerStep = 360 / hueSteps

		for( let i = 0; i <= hueSteps; i ++ ){

			hueGradient.addColorStop( i / hueSteps, 'hsl( '+ ( i * huesPerStep - 90 ) +', 100%, 50% )' )
		}
		context.fillStyle = hueGradient
		context.fillRect( 0, 0, width, height )


		//  For both the northern gradient (to white)
		//  and the southern gradient (to black)
		//  we’ll leave a thin band of full saturation
		//  near the equator.

		const whiteGradient = context.createLinearGradient( width / 2, 0, width / 2, height / 2 )
		whiteGradient.addColorStop( 0.000, 'hsla( 0, 0%, 100%, 1 )' )
		whiteGradient.addColorStop( 0.125, 'hsla( 0, 0%, 100%, 1 )' )
		whiteGradient.addColorStop( 0.875, 'hsla( 0, 0%, 100%, 0 )' )
		context.fillStyle = whiteGradient
		context.fillRect( 0, 0, width, height / 2 )

		const blackGradient = context.createLinearGradient( width / 2, height / 2, width / 2, height )
		blackGradient.addColorStop( 0.125, 'hsla( 0, 0%, 0%, 0 )' )
		blackGradient.addColorStop( 0.875, 'hsla( 0, 0%, 0%, 1 )' )
		blackGradient.addColorStop( 1.000, 'hsla( 0, 0%, 0%, 1 )' )
		context.fillStyle = blackGradient
		context.fillRect( 0, height / 2, width, height )


		//  Create lines of latitude and longitude.
		//  Note this is an inverse Mercatur projection ;)

		context.fillStyle = 'hsla( 0, 0%, 0%, 0.2 )'
		const yStep = height / 16
		for( let y = 0; y <= height; y += yStep ){

			context.fillRect( 0, y, width, 1 )
		}
		const xStep = width / 16
		for( let x = 0; x <= width; x += xStep ){

			context.fillRect( x, 0, 1, height )
		}


		//  Prepare the THREE texture and return it
		//  so we can use it as a material map.

		const texture = new THREE.CanvasTexture( canvas )
		texture.needsUpdate = true
		return texture
	},




	createLongitudeArc: function( radius, segments, thetaStart, thetaLength ){

		const geometry = new THREE.CircleGeometry( radius, segments, thetaStart, thetaLength )
		geometry.vertices.shift()
		

		//  This is NOT NORMALLY necessary 
		//  because we expect this to only be 
		//  between PI/2 and PI*2 
		// (so the length is only Math.PI instead of PI*2).

		if( thetaLength >= Math.PI * 2 ){

			geometry.vertices.push( geometry.vertices[ 0 ].clone() )
		}
		return geometry
	},
	createLatitudeArc: function( radius, segments, phiStart, phiLength ){

		const geometry = new THREE.CircleGeometry( radius, segments, phiStart, phiLength )
		geometry.vertices.shift()
		if( phiLength >= 2 * Math.PI ){

			geometry.vertices.push( geometry.vertices[ 0 ].clone() )
		}
		return geometry
	},
	createQuadSphere: function( options ){

		let {

			radius,
			phiStart,
			phiLength,
			thetaStart,
			thetaLength,
			latitudeLinesTotal,
			longitudeLinesTotal,
			latitudeLineSegments,
			longitudeLineSegments,
			latitudeLinesAttributes,
			longitudeLinesAttributes

		} = options

		if( typeof radius !== 'number' ) radius = 1
		if( typeof phiStart !== 'number' ) phiStart = Math.PI / 2
		if( typeof phiLength !== 'number' ) phiLength = Math.PI * 2
		if( typeof thetaStart !== 'number' ) thetaStart = 0
		if( typeof thetaLength !== 'number' ) thetaLength = Math.PI
		if( typeof latitudeLinesTotal !== 'number' ) latitudeLinesTotal = 16
		if( typeof longitudeLinesTotal !== 'number' ) longitudeLinesTotal = 16
		if( typeof latitudeLineSegments !== 'number' ) latitudeLineSegments = 64
		if( typeof longitudeLineSegments !== 'number' ) longitudeLineSegments = 64
		if( typeof latitudeLinesAttributes === 'undefined' ) latitudeLinesAttributes = { color: 0xCCCCCC }
		if( typeof longitudeLinesAttributes === 'undefined' ) longitudeLinesAttributes = { color: 0xCCCCCC }

		const
		sphere = new THREE.Group(),
		latitudeLinesMaterial  = new THREE.LineBasicMaterial( latitudeLinesAttributes ),
		longitudeLinesMaterial = new THREE.LineBasicMaterial( longitudeLinesAttributes )


		//  Lines of longitude.
		//  https://en.wikipedia.org/wiki/Longitude

		for( 
			
			let 
			phiDelta = phiLength / longitudeLinesTotal, 
			phi = phiStart, 
			arc = BlochSphere.createLongitudeArc( radius, longitudeLineSegments, thetaStart + Math.PI / 2, thetaLength ); 
			phi < phiStart + phiLength + phiDelta; 
			phi += phiDelta ){
		
			const geometry = arc.clone()
			geometry.rotateY( phi )
			sphere.add( new THREE.Line( geometry, longitudeLinesMaterial ))
		}


		//  Lines of latitude.
		//  https://en.wikipedia.org/wiki/Latitude

		for (

			let 
			thetaDelta = thetaLength / latitudeLinesTotal,
			theta = thetaStart; 
			theta < thetaStart + thetaLength;
			theta += thetaDelta ){
			
			if( theta === 0 ) continue
			
			const
			arcR = radius * Math.sin( theta ),
			arcH = radius * Math.cos( theta ),
			geometry = BlochSphere.createLatitudeArc( arcR, latitudeLineSegments, phiStart, phiLength )
		
			geometry.rotateX( Math.PI / 2 )
			geometry.rotateY( Math.PI / 2 )
			geometry.translate( 0, arcH, 0 )
			sphere.add( new THREE.Line( geometry, latitudeLinesMaterial ))
		}


		return sphere
	}
})






    ///////////////
   //           //
  //   Proto   //
 //           //
///////////////


Object.assign( BlochSphere.prototype, {

	update: function(){

		if( this.isRotating ) this.group.rotation.y += Math.PI / 4096
	},
	setTargetState: function( target ){
		
		if( target === undefined ) target = Qubit.HORIZONTAL.toBlochSphere()


		//  Always take the shortest path around
		//  even if it crosses the 0˚ / 360˚ boundary,
		//  ie. between Anti-Diagonal (-90˚) and 
		//  Right0-and circular polarized (180˚).

		const 
		rangeHalf = Math.PI,
		distance  = this.state.phi - target.phi

		if( Math.abs( distance ) > rangeHalf ){

			this.state.phi += Math.sign( distance ) * rangeHalf * -2
		}


		//  Cheap hack to test if we need to update values
		//  from within the updateBlochVector method.

		Object.assign( this.target, target )

		
		//  Create the tween.

		window.tween = new TWEEN.Tween( this.state )
		.to( target, 1000 )
		.easing( TWEEN.Easing.Quadratic.InOut )
		.onUpdate( this.updateBlochVector.bind( this ))
		.start()
	},
	updateBlochVector: function( state ){


		//  Move the big-ass surface pointer.

		if( state.theta !== this.target.theta ||
			state.phi !== this.target.phi ){

			this.blochPointer.position.set(
				
				Math.sin( state.theta ) * Math.sin( state.phi ),
				Math.cos( state.theta ),
				Math.sin( state.theta ) * Math.cos( state.phi )
			)
			this.blochPointer.lookAt( new THREE.Vector3() )
			this.blochVector.lookAt( this.blochPointer.getWorldPosition( new THREE.Vector3() ))


			//  Determine the correct HSL color
			//  based on Phi and Theta.

			let hue = state.phi * THREE.Math.RAD2DEG
			if( hue < 0 ) hue = 360 + hue
			this.blochColor.setHSL(

				hue / 360,
				1,
				1 - ( state.theta / Math.PI )
			)
			this.blochPointer.material.color = this.blochColor
			this.blochVector.material.color  = this.blochColor
			
			if( state.theta !== this.target.theta ){


				//  Slide the Theta ring from the north pole
				//  down as far south as it needs to go
				//  and scale its radius so it belts the sphere.

				const thetaScaleSafe = Math.max( state.theta, 0.01 )
				this.thetaMesh.scale.set(

					Math.sin( thetaScaleSafe ),
					1,
					Math.sin( thetaScaleSafe )
				)
				this.thetaMesh.position.y = Math.cos( state.theta )
			

				//  Redraw the Phi arc to extend from the north pole
				//  down to only as far as the Theta ring sits.
				//  Then rotate the whole Phi arc about the poles.

				for( 

					let 
					i = 0, 
					limit = this.phiGeometry.vertices.length; 

					i < limit;
					i ++ ){

					const gain = i / ( limit -  1 )
					this.phiGeometry.vertices[ i ].set(

						Math.sin( state.theta * gain ) * this.radiusSafe,
						Math.cos( state.theta * gain ) * this.radiusSafe,
						0
					)
				}
				this.phiLine.setGeometry( this.phiGeometry )
			}
			if( state.phi !== this.target.phi ){

				this.phiMesh.rotation.y = state.phi - Math.PI / 2
			}		
			if( typeof this.onValueChange === 'function' ) this.onValueChange.call( this )
		}	
	}
})



module.exports = {BlochSphere}




},{"quantum-js-util":13}],15:[function(require,module,exports){
//  Copyright © 2019–2020, Stewart Smith. See LICENSE for details.
const {Q, Circuit, Gate, logger, misc, mathf } = require('quantum-js-util');
Editor = function( circuit, targetEl ){
	//  First order of business,
	//  we require a valid circuit.

	if( circuit instanceof Circuit !== true ) circuit = new Circuit()
	this.circuit = circuit
	this.index = Editor.index ++


	//  Editor is all about the DOM
	//  so we’re going to get some use out of this
	//  stupid (but convenient) shorthand here.

	const createDiv = function(){

		return document.createElement( 'div' )
	}

	




	//  We want to “name” our circuit editor instance
	//  but more importantly we want to give it a unique DOM ID.
	//  Keep in mind we can have MULTIPLE editors
	//  for the SAME circuit!
	//  This is a verbose way to do it,
	//  but each step is clear and I needed clarity today! ;)

	this.name = typeof circuit.name === 'string' ?
		circuit.name :
		'Q Editor '+ this.index


	//  If we’ve been passed a target DOM element
	//  we should use that as our circuit element.

	if( typeof targetEl === 'string' ) targetEl = document.getElementById( targetEl )	
	const circuitEl = targetEl instanceof HTMLElement ? targetEl : createDiv()
	circuitEl.classList.add( 'Q-circuit' )


	//  If the target element already has an ID
	//  then we want to use that as our domID.

	if( typeof circuitEl.getAttribute( 'id' ) === 'string' ){

		this.domId = circuitEl.getAttribute( 'id' )
	}


	//  Otherwise let’s transform our name value
	//  into a usable domId.

	else {

		let domIdBase = this.name
			.replace( /^[^a-z]+|[^\w:.-]+/gi, '-' ),
		domId = domIdBase,
		domIdAttempt = 1

		while( document.getElementById( domId ) !== null ){

			domIdAttempt ++
			domId = domIdBase +'-'+ domIdAttempt
		}
		this.domId = domId
		circuitEl.setAttribute( 'id', this.domId )
	}




	//  We want a way to easily get to the circuit 
	//  from this interface’s DOM element.
	// (But we don’t need a way to reference this DOM element
	//  from the circuit. A circuit can have many DOM elements!)
	//  And we also want an easy way to reference this DOM element
	//  from this Editor instance.

	circuitEl.circuit = circuit
	this.domElement = circuitEl


	//  Create a toolbar for containing buttons.

	const toolbarEl = createDiv()
	circuitEl.appendChild( toolbarEl )
	toolbarEl.classList.add( 'Q-circuit-toolbar' )


	//  Create a toggle switch for locking the circuit.

	const lockToggle = createDiv()
	toolbarEl.appendChild( lockToggle )
	lockToggle.classList.add( 'Q-circuit-button', 'Q-circuit-toggle', 'Q-circuit-toggle-lock' )
	lockToggle.setAttribute( 'title', 'Lock / unlock' )
	lockToggle.innerText = '🔓'


	//  Create an “Undo” button
	//  that enables and disables
	//  based on available undo history.

	const undoButton = createDiv()
	toolbarEl.appendChild( undoButton )
	undoButton.classList.add( 'Q-circuit-button', 'Q-circuit-button-undo' )
	undoButton.setAttribute( 'title', 'Undo' )
	undoButton.setAttribute( 'Q-disabled', 'Q-disabled' )
	undoButton.innerHTML = '⟲'
	window.addEventListener( 'History undo is depleted', function( event ){

		if( event.detail.instance === circuit )
			undoButton.setAttribute( 'Q-disabled', 'Q-disabled' )
	})
	window.addEventListener( 'History undo is capable', function( event ){

		if( event.detail.instance === circuit )
			undoButton.removeAttribute( 'Q-disabled' )
	})


	//  Create an “Redo” button
	//  that enables and disables
	//  based on available redo history.

	const redoButton = createDiv()
	toolbarEl.appendChild( redoButton )
	redoButton.classList.add( 'Q-circuit-button', 'Q-circuit-button-redo' )
	redoButton.setAttribute( 'title', 'Redo' )
	redoButton.setAttribute( 'Q-disabled', 'Q-disabled' )
	redoButton.innerHTML = '⟳'
	window.addEventListener( 'History redo is depleted', function( event ){

		if( event.detail.instance === circuit )
			redoButton.setAttribute( 'Q-disabled', 'Q-disabled' )
	})
	window.addEventListener( 'History redo is capable', function( event ){

		if( event.detail.instance === circuit )
			redoButton.removeAttribute( 'Q-disabled' )
	})


	//  Create a button for joining 
	//  an “identity cursor”
	//  and one or more same-gate operations
	//  into a controlled operation.
	// (Will be enabled / disabled from elsewhere.)

	const controlButton = createDiv()
	toolbarEl.appendChild( controlButton )
	controlButton.classList.add( 'Q-circuit-button', 'Q-circuit-toggle', 'Q-circuit-toggle-control' )
	controlButton.setAttribute( 'title', 'Create controlled operation' )
	controlButton.setAttribute( 'Q-disabled', 'Q-disabled' )
	controlButton.innerText = 'C'


	//  Create a button for joining 
	//  two “identity cursors”
	//  into a swap operation.
	// (Will be enabled / disabled from elsewhere.)

	const swapButton = createDiv()
	toolbarEl.appendChild( swapButton )
	swapButton.classList.add( 'Q-circuit-button', 'Q-circuit-toggle-swap' )
	swapButton.setAttribute( 'title', 'Create swap operation' )
	swapButton.setAttribute( 'Q-disabled', 'Q-disabled' )
	swapButton.innerText = 'S'


	//  Create a circuit board container
	//  so we can house a scrollable circuit board.

	const boardContainerEl = createDiv()
	circuitEl.appendChild( boardContainerEl )
	boardContainerEl.classList.add( 'Q-circuit-board-container' )
	//boardContainerEl.addEventListener( 'touchstart', Editor.onPointerPress )
	boardContainerEl.addEventListener( 'mouseleave', function(){
		Editor.unhighlightAll( circuitEl )
	})

	const boardEl = createDiv()
	boardContainerEl.appendChild( boardEl )
	boardEl.classList.add( 'Q-circuit-board' )

	const backgroundEl = createDiv()
	boardEl.appendChild( backgroundEl )
	backgroundEl.classList.add( 'Q-circuit-board-background' )

	const parameterEl = createDiv()
	boardEl.appendChild( parameterEl )
	parameterEl.classList.add( 'Q-parameters-box' )
	//  Create background highlight bars 
	//  for each row.

	for( let i = 0; i < circuit.bandwidth; i ++ ){

		const rowEl = createDiv()
		backgroundEl.appendChild( rowEl )
		rowEl.style.position = 'relative'
		rowEl.style.gridRowStart = i + 2
		rowEl.style.gridColumnStart = 1
		rowEl.style.gridColumnEnd = Editor.momentIndexToGridColumn( circuit.timewidth ) + 1
		rowEl.setAttribute( 'register-index', i + 1 )

		const wireEl = createDiv()
		rowEl.appendChild( wireEl )
		wireEl.classList.add( 'Q-circuit-register-wire' )
	}


	//  Create background highlight bars 
	//  for each column.

	for( let i = 0; i < circuit.timewidth; i ++ ){

		const columnEl = createDiv()
		backgroundEl.appendChild( columnEl )
		columnEl.style.gridRowStart = 2
		columnEl.style.gridRowEnd = Editor.registerIndexToGridRow( circuit.bandwidth ) + 1
		columnEl.style.gridColumnStart = i + 3
		columnEl.setAttribute( 'moment-index', i + 1 )
	}


	//  Create the circuit board foreground
	//  for all interactive elements.

	const foregroundEl = createDiv()
	boardEl.appendChild( foregroundEl )
	foregroundEl.classList.add( 'Q-circuit-board-foreground' )


	//  Add “Select All” toggle button to upper-left corner.

	const selectallEl = createDiv()
	foregroundEl.appendChild( selectallEl )
	selectallEl.classList.add( 'Q-circuit-header', 'Q-circuit-selectall' )	
	selectallEl.setAttribute( 'title', 'Select all' )
	selectallEl.setAttribute( 'moment-index', '0' )
	selectallEl.setAttribute( 'register-index', '0' )
	selectallEl.innerHTML = '&searr;'


	//  Add register index symbols to left-hand column.
	
	for( let i = 0; i < circuit.bandwidth; i ++ ){

		const 
		registerIndex = i + 1,
		registersymbolEl = createDiv()
		
		foregroundEl.appendChild( registersymbolEl )
		registersymbolEl.classList.add( 'Q-circuit-header', 'Q-circuit-register-label' )
		registersymbolEl.setAttribute( 'title', 'Register '+ registerIndex +' of '+ circuit.bandwidth )
		registersymbolEl.setAttribute( 'register-index', registerIndex )
		registersymbolEl.style.gridRowStart = Editor.registerIndexToGridRow( registerIndex )
		registersymbolEl.innerText = registerIndex
	}


	//  Add “Add register” button.q
	
	const addRegisterEl = createDiv()
	foregroundEl.appendChild( addRegisterEl )
	addRegisterEl.classList.add( 'Q-circuit-header', 'Q-circuit-register-add' )
	addRegisterEl.setAttribute( 'title', 'Add register' )
	addRegisterEl.style.gridRowStart = Editor.registerIndexToGridRow( circuit.bandwidth + 1 )
	addRegisterEl.innerText = '+'


	//  Add moment index symbols to top row.

	for( let i = 0; i < circuit.timewidth; i ++ ){

		const 
		momentIndex = i + 1,
		momentsymbolEl = createDiv()

		foregroundEl.appendChild( momentsymbolEl )
		momentsymbolEl.classList.add( 'Q-circuit-header', 'Q-circuit-moment-label' )
		momentsymbolEl.setAttribute( 'title', 'Moment '+ momentIndex +' of '+ circuit.timewidth )
		momentsymbolEl.setAttribute( 'moment-index', momentIndex )
		momentsymbolEl.style.gridColumnStart = Editor.momentIndexToGridColumn( momentIndex )
		momentsymbolEl.innerText = momentIndex
	}


	//  Add “Add moment” button.
	
	const addMomentEl = createDiv()
	foregroundEl.appendChild( addMomentEl )
	addMomentEl.classList.add( 'Q-circuit-header', 'Q-circuit-moment-add' )
	addMomentEl.setAttribute( 'title', 'Add moment' )
	addMomentEl.style.gridColumnStart = Editor.momentIndexToGridColumn( circuit.timewidth + 1 )
	addMomentEl.innerText = '+'


	//  Add input values.

	circuit.qubits.forEach( function( qubit, i ){

		const 
		rowIndex = i + 1,
		inputEl = createDiv()
		
		inputEl.classList.add( 'Q-circuit-header', 'Q-circuit-input' )
		inputEl.setAttribute( 'title', `Qubit #${ rowIndex } starting value` )
		inputEl.setAttribute( 'register-index', rowIndex )
		inputEl.style.gridRowStart = Editor.registerIndexToGridRow( rowIndex )
		inputEl.innerText = qubit.beta.toText()
		foregroundEl.appendChild( inputEl )
	})


	//  Add operations.

	circuit.operations.forEach( function( operation ){
		Editor.set( circuitEl, operation )
	})


	//  Add event listeners.

	circuitEl.addEventListener( 'mousedown',  Editor.onPointerPress )
	circuitEl.addEventListener( 'touchstart', Editor.onPointerPress )
	window.addEventListener( 
	
		'Circuit.set$', 
		 Editor.prototype.onExternalSet.bind( this )
	)
	window.addEventListener(

		'Circuit.clear$',
		Editor.prototype.onExternalClear.bind( this )
	)


	//  How can we interact with this circuit
	//  through code? (How cool is this?!)

	const referenceEl = document.createElement( 'p' )
	circuitEl.appendChild( referenceEl )
	referenceEl.innerHTML = `
		This circuit is accessible in your 
		<a href="https://quantumjavascript.app/#Open_your_JavaScript_console" target="_blank">JavaScript console</a>
		as <code>document.getElementById('${ this.domId }').circuit</code>`
	//document.getElementById('Q-Editor-0').circuit
	//$('#${ this.domId }')


	//  Put a note in the JavaScript console
	//  that includes how to reference the circuit via code
	//  and an ASCII diagram for reference.

	logger.warn( 0.5,
		`\n\nCreated a DOM interface for $('#${ this.domId }').circuit\n\n`,
		 circuit.toDiagram(),
		'\n\n\n'
	)
}


//  Augment Circuit to have this functionality.

Circuit.toDom = function( circuit, targetEl ){

	return new Editor( circuit, targetEl ).domElement
}
Circuit.prototype.toDom = function( targetEl ){

	return new Editor( this, targetEl ).domElement
}








Object.assign( Editor, {

	index: 0,
	help: function(){ return logger.help( this )},
	dragEl: null,
	gridColumnToMomentIndex: function( gridColumn  ){ return +gridColumn - 2 },
	momentIndexToGridColumn: function( momentIndex ){ return momentIndex + 2 },
	gridRowToRegisterIndex:  function( gridRow ){ return +gridRow - 1 },
	registerIndexToGridRow:  function( registerIndex ){ return registerIndex + 1 },
	gridSize: 4,//  CSS: grid-auto-columns = grid-auto-rows = 4rem.
	pointToGrid: function( p ){

		
		//  Take a 1-dimensional point value
		// (so either an X or a Y but not both)
		//  and return what CSS grid cell contains it
		//  based on our 4rem × 4rem grid setup.
		
		const rem = parseFloat( getComputedStyle( document.documentElement ).fontSize )
		return 1 + Math.floor( p / ( rem * Editor.gridSize ))
	},
	gridToPoint: function( g ){


		//  Take a 1-dimensional grid cell value
		// (so either a row or a column but not both)
		//  and return the minimum point value it contains.

		const  rem = parseFloat( getComputedStyle( document.documentElement ).fontSize )
		return rem * Editor.gridSize * ( g - 1 )
	},
	getInteractionCoordinates: function( event, pageOrClient ){

		if( typeof pageOrClient !== 'string' ) pageOrClient = 'client'//page
		if( event.changedTouches && 
			event.changedTouches.length ) return {

			x: event.changedTouches[ 0 ][ pageOrClient +'X' ],
			y: event.changedTouches[ 0 ][ pageOrClient +'Y' ]
		}
		return {
			x: event[ pageOrClient +'X' ],
			y: event[ pageOrClient +'Y' ]
		}
	},
	createNewElement :function(element_type, element_parent, element_css) {
		element = document.createElement(element_type)
		if(element_css) element.classList.add(element_css)
		if(element_parent) element_parent.appendChild( element )
		return element
	},
	createPalette: function( targetEl ){

		if( typeof targetEl === 'string' ) targetEl = document.getElementById( targetEl )	

		const 
		paletteEl = targetEl instanceof HTMLElement ? targetEl : document.createElement( 'div' ),
		randomRangeAndSign = function(  min, max ){

			const r = min + Math.random() * ( max - min )
			return Math.floor( Math.random() * 2 ) ? r : -r
		}
		
		//ltnln: added missing Braket operations. 
		paletteEl.classList.add( 'Q-circuit-palette' );
		'H,X,Y,Z,P,Rx,Ry,Rz,U,V,V†,S*,S†,T,T†,00,01,10,√S,iS,XX,XY,YY,ZZ,*'
		.split( ',' )
		.forEach( function( symbol ){

			const gate = Gate.findBySymbol( symbol )

			const operationEl = document.createElement( 'div' )
			paletteEl.appendChild( operationEl )
			operationEl.classList.add( 'Q-circuit-operation' )
			operationEl.classList.add( 'Q-circuit-operation-'+ gate.nameCss )
			operationEl.setAttribute( 'gate-symbol', symbol )
			operationEl.setAttribute( 'title', gate.name )

			const tileEl = document.createElement( 'div' )
			operationEl.appendChild( tileEl )
			tileEl.classList.add( 'Q-circuit-operation-tile' )
			if( symbol !== Gate.CURSOR.symbol ) tileEl.innerText = symbol

			;[ 'before', 'after' ].forEach( function( layer ){

				tileEl.style.setProperty( '--Q-'+ layer +'-rotation', randomRangeAndSign( 0.5, 4 ) +'deg' )
				tileEl.style.setProperty( '--Q-'+ layer +'-x', randomRangeAndSign( 1, 4 ) +'px' )
				tileEl.style.setProperty( '--Q-'+ layer +'-y', randomRangeAndSign( 1, 3 ) +'px' )
			})
		})

		paletteEl.addEventListener( 'mousedown',  Editor.onPointerPress )
		paletteEl.addEventListener( 'touchstart', Editor.onPointerPress )
		return paletteEl
	},
	toDom: function( circuit, targetEl ){

		return new Editor( circuit, targetEl ).domElement
	}
})






    /////////////////////////
   //                     //
  //   Operation CLEAR   //
 //                     //
/////////////////////////


Editor.prototype.onExternalClear = function( event ){

	if( event.detail.circuit === this.circuit ){

		Editor.clear( this.domElement, {

			momentIndex: event.detail.momentIndex,
			registerIndices: event.detail.registerIndices
		})
	}
}
Editor.clear = function( circuitEl, operation ){

	const momentIndex = operation.momentIndex
	operation.registerIndices.forEach( function( registerIndex ){

		Array
		.from( circuitEl.querySelectorAll(

			`[moment-index="${ momentIndex }"]`+
			`[register-index="${ registerIndex }"]`
		
		))
		.forEach( function( op ){

			op.parentNode.removeChild( op )
		})
	})
}






    ///////////////////////
   //                   //
  //   Operation SET   //
 //                   //
///////////////////////


Editor.prototype.onExternalSet = function( event ){

	if( event.detail.circuit === this.circuit ){

		Editor.set( this.domElement, event.detail.operation )
	}
}
Editor.set = function( circuitEl, operation ){
	const
	backgroundEl = circuitEl.querySelector( '.Q-circuit-board-background' ),
	foregroundEl = circuitEl.querySelector( '.Q-circuit-board-foreground' ),
	circuit = circuitEl.circuit,
	operationIndex = circuitEl.circuit.operations.indexOf( operation )

	operation.registerIndices.forEach( function( registerIndex, i ){
		const operationEl = document.createElement( 'div' )
		foregroundEl.appendChild( operationEl )
		operationEl.classList.add( 'Q-circuit-operation', 'Q-circuit-operation-'+ operation.gate.nameCss )
		// operationEl.setAttribute( 'operation-index', operationIndex )		
		operationEl.setAttribute( 'gate-symbol', operation.gate.symbol )
		operationEl.setAttribute( 'gate-index', operation.gate.index )//  Used as an application-wide unique ID!
		operationEl.setAttribute( 'moment-index', operation.momentIndex )
		operationEl.setAttribute( 'register-index', registerIndex )
		operationEl.setAttribute( 'register-array-index', i )//  Where within the registerIndices array is this operations fragment located?
		operationEl.setAttribute( 'is-controlled', operation.isControlled )
		operationEl.setAttribute( 'title', operation.gate.name )
		operationEl.style.gridColumnStart = Editor.momentIndexToGridColumn( operation.momentIndex )
		operationEl.style.gridRowStart = Editor.registerIndexToGridRow( registerIndex )
		if( operation.gate.has_parameters ) Object.keys(operation.gate.parameters).forEach( element => {
			operationEl.setAttribute( element, operation.gate.parameters[element] ) //adds a parameter attribute to the operation!
		})
		const tileEl = document.createElement( 'div' )
		operationEl.appendChild( tileEl )
		tileEl.classList.add( 'Q-circuit-operation-tile' )		
		if( operation.gate.symbol !== Gate.CURSOR.symbol ) tileEl.innerText = operation.gate.symbol


		//  Add operation link wires
		//  for multi-qubit operations.

		if( operation.registerIndices.length > 1 ){

			operationEl.setAttribute( 'register-indices', operation.registerIndices )
			operationEl.setAttribute( 'register-indices-index', i )
			operationEl.setAttribute( 
				
				'sibling-indices', 
				 operation.registerIndices
				.filter( function( siblingRegisterIndex ){

					return registerIndex !== siblingRegisterIndex
				})
			)
			operation.registerIndices.forEach( function( registerIndex, i ){

				if( i < operation.registerIndices.length - 1 ){			

					const 
					siblingRegisterIndex = operation.registerIndices[ i + 1 ],
					registerDelta = Math.abs( siblingRegisterIndex - registerIndex ),
					start = Math.min( registerIndex, siblingRegisterIndex ),
					end   = Math.max( registerIndex, siblingRegisterIndex ),
					containerEl = document.createElement( 'div' ),
					linkEl = document.createElement( 'div' )

					backgroundEl.appendChild( containerEl )							
					containerEl.setAttribute( 'moment-index', operation.momentIndex )
					containerEl.setAttribute( 'register-index', registerIndex )
					containerEl.classList.add( 'Q-circuit-operation-link-container' )
					containerEl.style.gridRowStart = Editor.registerIndexToGridRow( start )
					containerEl.style.gridRowEnd   = Editor.registerIndexToGridRow( end + 1 )
					containerEl.style.gridColumn   = Editor.momentIndexToGridColumn( operation.momentIndex )

					containerEl.appendChild( linkEl )
					linkEl.classList.add( 'Q-circuit-operation-link' )
					if( registerDelta > 1 ) linkEl.classList.add( 'Q-circuit-operation-link-curved' )
				}
			})
			if( operation.isControlled && i === 0 ){
				operationEl.classList.add( 'Q-circuit-operation-control' )
				operationEl.setAttribute( 'title', 'Control' )
				tileEl.innerText = ''
			}
			else operationEl.classList.add( 'Q-circuit-operation-target' )
		}
	})
}




Editor.isValidControlCandidate = function( circuitEl ){

	const
	selectedOperations = Array
	.from( circuitEl.querySelectorAll( '.Q-circuit-cell-selected' ))


	//  We must have at least two operations selected,
	//  hopefully a control and something else,
	//  in order to attempt a join.

	if( selectedOperations.length < 2 ) return false

	
	//  Note the different moment indices present
	//  among the selected operations.

	const moments = selectedOperations.reduce( function( moments, operationEl ){

		moments[ operationEl.getAttribute( 'moment-index' )] = true
		return moments

	}, {} )


	//  All selected operations must be in the same moment.

	if( Object.keys( moments ).length > 1 ) return false


	//  If there are multi-register operations present,
	//  regardless of whether those are controls or swaps,
	//  all siblings must be present 
	//  in order to join a new gate to this selection.

	//  I’m sure we can make this whole routine much more efficient
	//  but its results are correct and boy am I tired ;)

	const allSiblingsPresent = selectedOperations
	.reduce( function( status, operationEl ){

		const registerIndicesString = operationEl.getAttribute( 'register-indices' )


		//  If it’s a single-register operation
		//  there’s no need to search further.

		if( !registerIndicesString ) return status


		//  How many registers are in use
		//  by this operation?

		const 
		registerIndicesLength = registerIndicesString
			.split( ',' )
			.map( function( registerIndex ){

				return +registerIndex
			})
			.length,
		

		//  How many of this operation’s siblings
		// (including itself) can we find?

		allSiblingsLength = selectedOperations
		.reduce( function( siblings, operationEl ){

			if( operationEl.getAttribute( 'register-indices' ) === registerIndicesString ){
				
				siblings.push( operationEl )
			}
			return siblings

		}, [])
		.length


		//  Did we find all of the siblings for this operation?
		//  Square that with previous searches.

		return status && allSiblingsLength === registerIndicesLength

	}, true )


	//  If we’re missing some siblings
	//  then we cannot modify whatever we have selected here.

	if( allSiblingsPresent !== true ) return false

	//  Note the different gate types present
	//  among the selected operations.

	const gates = selectedOperations.reduce( function( gates, operationEl ){
		const gateSymbol = operationEl.getAttribute( 'gate-symbol' )
		if( !mathf.isUsefulInteger( gates[ gateSymbol ])) gates[ gateSymbol ] = 1
		else gates[ gateSymbol ] ++
		return gates

	}, {} )


	//  Note if each operation is already controlled or not.

	const { 

		totalControlled, 
		totalNotControlled 

	} = selectedOperations
	.reduce( function( stats, operationEl ){

		if( operationEl.getAttribute( 'is-controlled' ) === 'true' )
			stats.totalControlled ++
		else stats.totalNotControlled ++
		return stats

	}, { 

		totalControlled:    0, 
		totalNotControlled: 0
	})

	//  This could be ONE “identity cursor” 
	//  and one or more of a regular single gate
	//  that is NOT already controlled.

	if( gates[ Gate.CURSOR.symbol ] === 1 && 
		Object.keys( gates ).length === 2 &&
		totalNotControlled === selectedOperations.length ){

		return true
	}


	//  There’s NO “identity cursor”
	//  but there is one or more of specific gate type
	//  and at least one of those is already controlled.

	if( gates[ Gate.CURSOR.symbol ] === undefined &&
		Object.keys( gates ).length === 1 &&
		totalControlled > 0 &&
		totalNotControlled > 0 ){

		return true
	}


	//  Any other combination allowed? Nope!

	return false
}
Editor.createControl = function( circuitEl ){

	if( Editor.isValidControlCandidate( circuitEl ) !== true ) return this


	const
	circuit = circuitEl.circuit,
	selectedOperations = Array
		.from( circuitEl.querySelectorAll( '.Q-circuit-cell-selected' )),
	

	//  Are any of these controlled operations??
	//  If so, we need to find its control component
	//  and re-use it.

	existingControlEl = selectedOperations.find( function( operationEl ){

		return (

			operationEl.getAttribute( 'is-controlled' ) === 'true' &&
			operationEl.getAttribute( 'register-array-index' ) === '0'
		)
	}),

	
	//  One control. One or more targets.
	
	control = existingControlEl || selectedOperations
		.find( function( el ){

			return el.getAttribute( 'gate-symbol' ) === Gate.CURSOR.symbol
		}),
	targets = selectedOperations
		.reduce( function( targets, el ){

			//if( el.getAttribute( 'gate-symbol' ) !== '!' ) targets.push( el )
			if( el !== control ) targets.push( el )
			return targets

		}, [] )


	//  Ready to roll.

	circuit.history.createEntry$()
	selectedOperations.forEach( function( operationEl ){

		circuit.clear$(

			+operationEl.getAttribute( 'moment-index' ),
			+operationEl.getAttribute( 'register-index' )
		)
	})
	circuit.set$(
		targets[ 0 ].getAttribute( 'gate-symbol' ),
		+control.getAttribute( 'moment-index' ),
		[ +control.getAttribute( 'register-index' )].concat(

			targets.reduce( function( registers, operationEl ){

				registers.push( +operationEl.getAttribute( 'register-index' ))
				return registers

			}, [] )
		)
	)

	
	//  Update our toolbar button states.
	
	Editor.onSelectionChanged( circuitEl )
	Editor.onCircuitChanged( circuitEl )	
	
	return this
}




Editor.isValidSwapCandidate = function( circuitEl ){

	const
	selectedOperations = Array
		.from( circuitEl.querySelectorAll( '.Q-circuit-cell-selected' ))


	//  We can only swap between two registers.
	//  No crazy rotation-swap bullshit. (Yet.)
	if( selectedOperations.length !== 2 ) return false


	//  Both operations must be “identity cursors.”
	//  If so, we are good to go.

	areBothCursors = selectedOperations.every( function( operationEl ){

		return operationEl.getAttribute( 'gate-symbol' ) === Gate.CURSOR.symbol
	})
	if( areBothCursors ) return true


	//  Otherwise this is not a valid swap candidate.

	return false
}
Editor.createSwap = function( circuitEl ){

	if( Editor.isValidSwapCandidate( circuitEl ) !== true ) return this

	const
	selectedOperations = Array
		.from( circuitEl.querySelectorAll( '.Q-circuit-cell-selected' )),
	momentIndex = +selectedOperations[ 0 ].getAttribute( 'moment-index' )
	registerIndices = selectedOperations
	.reduce( function( registerIndices, operationEl ){

		registerIndices.push( +operationEl.getAttribute( 'register-index' ))
		return registerIndices

	}, [] ),
	circuit = circuitEl.circuit


	//  Create the swap operation.

	circuit.history.createEntry$()
	selectedOperations.forEach( function( operation ){

		circuit.clear$(

			+operation.getAttribute( 'moment-index' ),
			+operation.getAttribute( 'register-index' )
		)
	})
	circuit.set$(

		Gate.SWAP,
		momentIndex,
		registerIndices
	)


	//  Update our toolbar button states.

	Editor.onSelectionChanged( circuitEl )
	Editor.onCircuitChanged( circuitEl )

	return this
}




Editor.onSelectionChanged = function( circuitEl ){

	const controlButtonEl = circuitEl.querySelector( '.Q-circuit-toggle-control' )
	if( Editor.isValidControlCandidate( circuitEl )){

		controlButtonEl.removeAttribute( 'Q-disabled' )
	}
	else controlButtonEl.setAttribute( 'Q-disabled', true )

	const swapButtonEl = circuitEl.querySelector( '.Q-circuit-toggle-swap' )
	if( Editor.isValidSwapCandidate( circuitEl )){

		swapButtonEl.removeAttribute( 'Q-disabled' )
	}
	else swapButtonEl.setAttribute( 'Q-disabled', true )
}
Editor.onCircuitChanged = function( circuitEl ){

	const circuit = circuitEl.circuit
	window.dispatchEvent( new CustomEvent( 

		'Q gui altered circuit', 
		{ detail: { circuit: circuit }}
	))

	//  Should we trigger a circuit.evaluate$() here?
	//  Particularly when we move all that to a new thread??
	//  console.log( originCircuit.report$() ) ??
}





Editor.unhighlightAll = function( circuitEl ){

	Array.from( circuitEl.querySelectorAll( 

		'.Q-circuit-board-background > div,'+
		'.Q-circuit-board-foreground > div'
	))
	.forEach( function( el ){

		el.classList.remove( 'Q-circuit-cell-highlighted' )
	})
}






    //////////////////////
   //                  //
  //   Pointer MOVE   //
 //                  //
//////////////////////


Editor.onPointerMove = function( event ){


	//  We need our cursor coordinates straight away.
	//  We’ll use that both for dragging (immediately below)
	//  and for hover highlighting (further below).
	//  Let’s also hold on to a list of all DOM elements
	//  that contain this X, Y point
	//  and also see if one of those is a circuit board container.

	const 
	{ x, y } = Editor.getInteractionCoordinates( event ),
	foundEls = document.elementsFromPoint( x, y ),
	boardContainerEl = foundEls.find( function( el ){

		return el.classList.contains( 'Q-circuit-board-container' )
	})
	

	//  Are we in the middle of a circuit clipboard drag?
	//  If so we need to move that thing!

	if( Editor.dragEl !== null ){


		//  ex. Don’t scroll on touch devices!

		event.preventDefault()
		

		//  This was a very useful resource
		//  for a reality check on DOM coordinates:
		//  https://javascript.info/coordinates

		Editor.dragEl.style.left = ( x + window.pageXOffset + Editor.dragEl.offsetX ) +'px'
		Editor.dragEl.style.top  = ( y + window.pageYOffset + Editor.dragEl.offsetY ) +'px'

		if( !boardContainerEl && Editor.dragEl.circuitEl ) Editor.dragEl.classList.add( 'Q-circuit-clipboard-danger' )
		else Editor.dragEl.classList.remove( 'Q-circuit-clipboard-danger' )
	}


	//  If we’re not over a circuit board container
	//  then there’s no highlighting work to do
	//  so let’s bail now.

	if( !boardContainerEl ) return


	//  Now we know we have a circuit board
	//  so we must have a circuit
	//  and if that’s locked then highlighting changes allowed!

	const circuitEl = boardContainerEl.closest( '.Q-circuit' )
	if( circuitEl.classList.contains( 'Q-circuit-locked' )) return


	//  Ok, we’ve found a circuit board.
	//  First, un-highlight everything.

	Array.from( boardContainerEl.querySelectorAll(`

		.Q-circuit-board-background > div, 
		.Q-circuit-board-foreground > div
	
	`)).forEach( function( el ){

		el.classList.remove( 'Q-circuit-cell-highlighted' )
	})


	//  Let’s prioritize any element that is “sticky”
	//  which means it can appear OVER another grid cell.


	const
	cellEl = foundEls.find( function( el ){

		const style = window.getComputedStyle( el )
		return (

			style.position === 'sticky' && ( 

				el.getAttribute( 'moment-index' ) !== null ||
				el.getAttribute( 'register-index' ) !== null
			)
		)
	}),
	highlightByQuery = function( query ){

		Array.from( boardContainerEl.querySelectorAll( query ))
		.forEach( function( el ){

			el.classList.add( 'Q-circuit-cell-highlighted' )
		})
	}


	//  If we’ve found one of these “sticky” cells
	//  let’s use its moment and/or register data
	//  to highlight moments or registers (or all).

	if( cellEl ){

		const 
		momentIndex   = cellEl.getAttribute( 'moment-index' ),
		registerIndex = cellEl.getAttribute( 'register-index' )
		
		if( momentIndex === null ){
			
			highlightByQuery( `div[register-index="${ registerIndex }"]` )
			return
		}
		if( registerIndex === null ){

			highlightByQuery( `div[moment-index="${ momentIndex }"]` )
			return
		}
		highlightByQuery(`

			.Q-circuit-board-background > div[moment-index],
			.Q-circuit-board-foreground > .Q-circuit-operation

		`)
		return
	}


	//  Ok, we know we’re hovering over the circuit board
	//  but we’re not on a “sticky” cell.
	//  We might be over an operation, but we might not.
	//  No matter -- we’ll infer the moment and register indices
	//  from the cursor position.

	const
	boardElBounds = boardContainerEl.getBoundingClientRect(),
	xLocal        = x - boardElBounds.left + boardContainerEl.scrollLeft + 1,
	yLocal        = y - boardElBounds.top  + boardContainerEl.scrollTop + 1,
	columnIndex   = Editor.pointToGrid( xLocal ),
	rowIndex      = Editor.pointToGrid( yLocal ),
	momentIndex   = Editor.gridColumnToMomentIndex( columnIndex ),
	registerIndex = Editor.gridRowToRegisterIndex( rowIndex )


	//  If this hover is “out of bounds”
	//  ie. on the same row or column as an “Add register” or “Add moment” button
	//  then let’s not highlight anything.

	if( momentIndex > circuitEl.circuit.timewidth ||
		registerIndex > circuitEl.circuit.bandwidth ) return
	

	//  If we’re at 0, 0 or below that either means
	//  we’re over the “Select all” button (already taken care of above)
	//  or over the lock toggle button.
	//  Either way, it’s time to bail.

	if( momentIndex < 1 || registerIndex < 1 ) return


	//  If we’ve made it this far that means 
	//  we have valid moment and register indices.
	//  Highlight them!

	highlightByQuery(`

		div[moment-index="${ momentIndex }"],
		div[register-index="${ registerIndex }"]
	`)
	return
}



    ///////////////////////
   //                   //
  //   Pointer PRESS   //
 //                   //
///////////////////////


Editor.onPointerPress = function( event ){
	//  This is just a safety net
	//  in case something terrible has ocurred.
	// (ex. Did the user click and then their mouse ran
	//  outside the window but browser didn’t catch it?)

	if( Editor.dragEl !== null ){

		Editor.onPointerRelease( event )
		return
	}
	const 
	targetEl  = event.target,
	circuitEl = targetEl.closest( '.Q-circuit' ),
	paletteEl = targetEl.closest( '.Q-circuit-palette' )
	parameterEl = targetEl.closest( '.Q-parameters-box' )

	//  If we can’t find a circuit that’s a really bad sign
	//  considering this event should be fired when a circuit
	//  is clicked on. So... bail!

	if( !circuitEl && !paletteEl ) return

	//  This is a bit of a gamble.
	//  There’s a possibility we’re not going to drag anything,
	//  but we’ll prep these variables here anyway
	//  because both branches of if( circuitEl ) and if( paletteEl )
	//  below will have access to this scope.
	
	dragEl = document.createElement( 'div' )
	dragEl.classList.add( 'Q-circuit-clipboard' )
	const { x, y } = Editor.getInteractionCoordinates( event )


	//  Are we dealing with a circuit interface?
	//  ie. NOT a palette interface.

	if( circuitEl && !parameterEl ){
	
		//  Shall we toggle the circuit lock?

		const
		circuit = circuitEl.circuit,
		circuitIsLocked = circuitEl.classList.contains( 'Q-circuit-locked' ),
		lockEl = targetEl.closest( '.Q-circuit-toggle-lock' )
		
		if( lockEl ){

			// const toolbarEl = Array.from( circuitEl.querySelectorAll( '.Q-circuit-button' ))
			if( circuitIsLocked ){

				circuitEl.classList.remove( 'Q-circuit-locked' )
				lockEl.innerText = '🔓'
			}
			else {

				circuitEl.classList.add( 'Q-circuit-locked' )
				lockEl.innerText = '🔒'
				Editor.unhighlightAll( circuitEl )
			}


			//  We’ve toggled the circuit lock button
			//  so we should prevent further propagation
			//  before proceeding further.
			//  That includes running all this code again
			//  if it was originally fired by a mouse event
			//  and about to be fired by a touch event!

			event.preventDefault()
			event.stopPropagation()
			return
		}


		//  If our circuit is already “locked”
		//  then there’s nothing more to do here.
		
		if( circuitIsLocked ) {

			logger.warn( `User attempted to interact with a circuit editor but it was locked.` )
			return
		}


		const
		cellEl = targetEl.closest(`

			.Q-circuit-board-foreground > div,
			.Q-circuit-palette > div
		`),
		undoEl        = targetEl.closest( '.Q-circuit-button-undo' ),
		redoEl        = targetEl.closest( '.Q-circuit-button-redo' ),
		controlEl     = targetEl.closest( '.Q-circuit-toggle-control' ),
		swapEl        = targetEl.closest( '.Q-circuit-toggle-swap' ),
		addMomentEl   = targetEl.closest( '.Q-circuit-moment-add' ),
		addRegisterEl = targetEl.closest( '.Q-circuit-register-add' )

		if( !cellEl &&
			!undoEl &&
			!redoEl &&
			!controlEl &&
			!swapEl &&
			!addMomentEl &&
			!addRegisterEl ) return


		//  By this point we know that the circuit is unlocked
		//  and that we’ll activate a button / drag event / etc.
		//  So we need to hault futher event propagation
		//  including running this exact code again if this was
		//  fired by a touch event and about to again by mouse.
		//  This may SEEM redundant because we did this above
		//  within the lock-toggle button code
		//  but we needed to NOT stop propagation if the circuit
		//  was already locked -- for scrolling and such.

		event.preventDefault()
		event.stopPropagation()


		if( undoEl && circuit.history.undo$() ){

			Editor.onSelectionChanged( circuitEl )
			Editor.onCircuitChanged( circuitEl )	
		}
		if( redoEl && circuit.history.redo$() ){

			Editor.onSelectionChanged( circuitEl )
			Editor.onCircuitChanged( circuitEl )	
		}
		if( controlEl ) Editor.createControl( circuitEl )
		if( swapEl ) Editor.createSwap( circuitEl )
		if( addMomentEl   ) console.log( '→ Add moment' )
		if( addRegisterEl ) console.log( '→ Add register' )


		//  We’re done dealing with external buttons.
		//  So if we can’t find a circuit CELL
		//  then there’s nothing more to do here.

		if( !cellEl ) return

		//  Once we know what cell we’ve pressed on
		//  we can get the momentIndex and registerIndex
		//  from its pre-defined attributes.
		//  NOTE that we are getting CSS grid column and row
		//  from our own conversion function and NOT from
		//  asking its styles. Why? Because browsers convert
		//  grid commands to a shorthand less easily parsable
		//  and therefore makes our code and reasoning 
		//  more prone to quirks / errors. Trust me!

		const
		momentIndex   = +cellEl.getAttribute( 'moment-index' ),
		registerIndex = +cellEl.getAttribute( 'register-index' ),
		columnIndex   = Editor.momentIndexToGridColumn( momentIndex ),
		rowIndex      = Editor.registerIndexToGridRow( registerIndex )


		//  Looks like our circuit is NOT locked
		//  and we have a valid circuit CELL
		//  so let’s find everything else we could need.

		const
		selectallEl     = targetEl.closest( '.Q-circuit-selectall' ),
		registersymbolEl = targetEl.closest( '.Q-circuit-register-label' ),
		momentsymbolEl   = targetEl.closest( '.Q-circuit-moment-label' ),
		inputEl         = targetEl.closest( '.Q-circuit-input' ),
		operationEl     = targetEl.closest( '.Q-circuit-operation' )
		
		//  +++++++++++++++
		//  We’ll have to add some input editing capability later...
		//  Of course you can already do this in code!
		//  For now though most quantum code assumes all qubits
		//  begin with a value of zero so this is mostly ok ;)

		if( inputEl ){

			console.log( '→ Edit input Qubit value at', registerIndex )
			return
		}


		//  Let’s inspect a group of items via a CSS query.
		//  If any of them are NOT “selected” (highlighted)
		//  then select them all.
		//  But if ALL of them are already selected
		//  then UNSELECT them all.

		function toggleSelection( query ){

			const 
			operations = Array.from( circuitEl.querySelectorAll( query )),
			operationsSelectedLength = operations.reduce( function( sum, element ){

				sum += +element.classList.contains( 'Q-circuit-cell-selected' )
				return sum
			
			}, 0 )

			if( operationsSelectedLength === operations.length ){

				operations.forEach( function( el ){
					el.classList.remove( 'Q-circuit-cell-selected' )
				})
			}
			else {

				operations.forEach( function( el ){

					el.classList.add( 'Q-circuit-cell-selected' )
				})
			}
			Editor.onSelectionChanged( circuitEl )
		}


		//  Clicking on the “selectAll” button
		//  or any of the Moment symbols / Register symbols
		//  causes a selection toggle.
		//  In the future we may want to add
		//  dragging of entire Moment columns / Register rows
		//  to splice them out / insert them elsewhere
		//  when a user clicks and drags them.

		if( selectallEl ){

			toggleSelection( '.Q-circuit-operation' )
			return
		}
		if( momentsymbolEl ){

			toggleSelection( `.Q-circuit-operation[moment-index="${ momentIndex }"]` )
			return
		}
		if( registersymbolEl ){

			toggleSelection( `.Q-circuit-operation[register-index="${ registerIndex }"]` )
			return
		}


		//  Right here we can made a big decision:
		//  If you’re not pressing on an operation
		//  then GO HOME.

		if( !operationEl ) return
		// If we've doubleclicked on an operation and the operation has parameters, we should be able
		// to edit those parameters regardless of whether or not the circuit is locked.
		if( event.detail == 2) {
			const operation = Gate.findBySymbol(operationEl.getAttribute( 'gate-symbol' ))
			if( operation.has_parameters ) {
				Editor.onDoubleclick( event, operationEl )
				return
			}
		}

		//  Ok now we know we are dealing with an operation.
		//  This preserved selection state information
		//  will be useful for when onPointerRelease is fired.

		if( operationEl.classList.contains( 'Q-circuit-cell-selected' )){
			operationEl.wasSelected = true
		}
		else operationEl.wasSelected = false


		//  And now we can proceed knowing that 
		//  we need to select this operation
		//  and possibly drag it
		//  as well as any other selected operations.

		operationEl.classList.add( 'Q-circuit-cell-selected' )
		const selectedOperations = Array.from( circuitEl.querySelectorAll( '.Q-circuit-cell-selected' ))		
		dragEl.circuitEl = circuitEl
		dragEl.originEl  = circuitEl.querySelector( '.Q-circuit-board-foreground' )

	
		//  These are the default values; 
		//  will be used if we’re only dragging one operation around.
		//  But if dragging more than one operation
		//  and we’re dragging the clipboard by an operation
		//  that is NOT in the upper-left corner of the clipboard
		//  then we need to know what the offset is.
		// (Will be calculated below.)
		
		dragEl.columnIndexOffset = 1
		dragEl.rowIndexOffset = 1


		//  Now collect all of the selected operations,
		//  rip them from the circuit board’s foreground layer
		//  and place them on the clipboard.
		
		let
		columnIndexMin = Infinity,
		rowIndexMin = Infinity

		selectedOperations.forEach( function( el ){


			//  WORTH REPEATING:
			//  Once we know what cell we’ve pressed on
			//  we can get the momentIndex and registerIndex
			//  from its pre-defined attributes.
			//  NOTE that we are getting CSS grid column and row
			//  from our own conversion function and NOT from
			//  asking its styles. Why? Because browsers convert
			//  grid commands to a shorthand less easily parsable
			//  and therefore makes our code and reasoning 
			//  more prone to quirks / errors. Trust me!

			const
			momentIndex   = +el.getAttribute( 'moment-index' ),
			registerIndex = +el.getAttribute( 'register-index' ),
			columnIndex   = Editor.momentIndexToGridColumn( momentIndex ),
			rowIndex      = Editor.registerIndexToGridRow( registerIndex )

			columnIndexMin = Math.min( columnIndexMin, columnIndex )
			rowIndexMin = Math.min( rowIndexMin, rowIndex )
			el.classList.remove( 'Q-circuit-cell-selected' )
			el.origin = { momentIndex, registerIndex, columnIndex, rowIndex }
			dragEl.appendChild( el )
		})
		selectedOperations.forEach( function( el ){

			const 
			columnIndexForClipboard = 1 + el.origin.columnIndex - columnIndexMin,
			rowIndexForClipboard    = 1 + el.origin.rowIndex - rowIndexMin
			
			el.style.gridColumn = columnIndexForClipboard
			el.style.gridRow = rowIndexForClipboard


			//  If this operation element is the one we grabbed
			// (mostly relevant if we’re moving multiple operations at once)
			//  we need to know what the “offset” so everything can be
			//  placed correctly relative to this drag-and-dropped item.

			if( el.origin.columnIndex === columnIndex &&
				el.origin.rowIndex === rowIndex ){

				dragEl.columnIndexOffset = columnIndexForClipboard
				dragEl.rowIndexOffset = rowIndexForClipboard
			}
		})
	

		//  We need an XY offset that describes the difference
		//  between the mouse / finger press position
		//  and the clipboard’s intended upper-left position.
		//  To do that we need to know the press position (obviously!),
		//  the upper-left bounds of the circuit board’s foreground,
		//  and the intended upper-left bound of clipboard.

		const
		boardEl = circuitEl.querySelector( '.Q-circuit-board-foreground' ),
		bounds  = boardEl.getBoundingClientRect(),
		minX    = Editor.gridToPoint( columnIndexMin ),
		minY    = Editor.gridToPoint( rowIndexMin )		
		
		dragEl.offsetX = bounds.left + minX - x
		dragEl.offsetY = bounds.top  + minY - y
		dragEl.momentIndex = momentIndex
		dragEl.registerIndex = registerIndex
	}
	else if( paletteEl ){
		const operationEl = targetEl.closest( '.Q-circuit-operation' )

		if( !operationEl ) return
		
		const
		bounds   = operationEl.getBoundingClientRect(),
		{ x, y } = Editor.getInteractionCoordinates( event )

		dragEl.appendChild( operationEl.cloneNode( true ))
		dragEl.originEl = paletteEl
		dragEl.offsetX  = bounds.left - x
		dragEl.offsetY  = bounds.top  - y
	}
	else if( parameterEl ){
		const exitEl = targetEl.closest( '.Q-parameter-box-exit' )
		if( !exitEl ) return
		parameterEl.style.display = 'none'
		const foregroundEl = circuitEl.querySelector( '.Q-circuit-board-foreground' )
		operationEl = foregroundEl.querySelector( 	`[moment-index="${ parameterEl.getAttribute( 'operation-moment-index' )}"]` +
													`[register-index="${ parameterEl.getAttribute( 'operation-register-index' )}"]` )
		parameters = {}
		operationSkeleton = Gate.findBySymbol( operationEl.getAttribute( 'gate-symbol' ))
		Object.keys( operationSkeleton.parameters ).forEach( key => {
			parameters[ key ] = operationEl.getAttribute( key ) ? operationEl.getAttribute( key ) : operationSkeleton.parameters[ key ]
		})
		//upon exiting, we should update the circuit!!!
		circuitEl.circuit.set$(
			operationEl.getAttribute( 'gate-symbol' ),
			+operationEl.getAttribute( 'moment-index' ),
			operationEl.getAttribute( 'register-indices' ) ? operationEl.getAttribute( 'register-indices' ).split(',').map( i => +i ) :
			[ +operationEl.getAttribute( 'register-index' )],
			parameters
		)
		//on exiting the parameter-input-box, we should update the circuit!!
		parameterEl.innerHTML = ""
		return
	}
	dragEl.timestamp = Date.now()


	//  Append the clipboard to the document,
	//  establish a global reference to it,
	//  and trigger a draw of it in the correct spot.
	
	document.body.appendChild( dragEl )
	Editor.dragEl = dragEl
	Editor.onPointerMove( event )
}






    /////////////////////////
   //                     //
  //   Pointer RELEASE   //
 //                     //
/////////////////////////


Editor.onPointerRelease = function( event ){


	//  If there’s no dragEl then bail immediately.
	if( Editor.dragEl === null ) return
	//  Looks like we’re moving forward with this plan,
	//  so we’ll take control of the input now.
	event.preventDefault()
	event.stopPropagation()


	//  We can’t get the drop target from the event.
	//  Think about it: What was under the mouse / finger
	//  when this drop event was fired? THE CLIPBOARD !
	//  So instead we need to peek at what elements are
	//  under the mouse / finger, skipping element [0]
	//  because that will be the clipboard.

	const { x, y } = Editor.getInteractionCoordinates( event )
	const boardContainerAll = document.querySelectorAll(".Q-circuit-board-container")
	if( boardContainerAll.length === 0 ) return 
	let boardContainerEl = Array.from(boardContainerAll).find((element) => {
		let rect = element.getBoundingClientRect()
		let clientX = rect.left
		let clientY = rect.top
		let height = element.offsetHeight
		let width = element.offsetWidth
		return ( x >= clientX && x <= clientX + width ) && ( y >= clientY && y <= clientY + height )
	})
	returnToOrigin = function(){


		//  We can only do a “true” return to origin
		//  if we were dragging from a circuit.
		//  If we were dragging from a palette
		//  we can just stop dragging.

		if( Editor.dragEl.circuitEl ){
		
			Array.from( Editor.dragEl.children ).forEach( function( el ){

				Editor.dragEl.originEl.appendChild( el )
				el.style.gridColumn = el.origin.columnIndex
				el.style.gridRow    = el.origin.rowIndex
				if( el.wasSelected === true ) el.classList.remove( 'Q-circuit-cell-selected' )
				else el.classList.add( 'Q-circuit-cell-selected' )
			})
			Editor.onSelectionChanged( Editor.dragEl.circuitEl )
		}
		document.body.removeChild( Editor.dragEl )
		Editor.dragEl = null
	}


	//  If we have not dragged on to a circuit board
	//  then we’re throwing away this operation.

	if( !boardContainerEl ){
	
		if( Editor.dragEl.circuitEl ){

			const 
			originCircuitEl = Editor.dragEl.circuitEl
			originCircuit = originCircuitEl.circuit
			
			originCircuit.history.createEntry$()
			Array
			.from( Editor.dragEl.children )
			.forEach( function( child ){

				originCircuit.clear$(

					child.origin.momentIndex,
					child.origin.registerIndex
				)
			})
			Editor.onSelectionChanged( originCircuitEl )
			Editor.onCircuitChanged( originCircuitEl )
		}


		//  TIME TO DIE.
		//  Let’s keep a private reference to 
		//  the current clipboard.
		
		let clipboardToDestroy = Editor.dragEl


		//  Now we can remove our dragging reference.

		Editor.dragEl = null


		//  Add our CSS animation routine
		//  which will run for 1 second.
		//  If we were SUPER AWESOME
		//  we would have also calculated drag momentum
		//  and we’d let this glide away!

		clipboardToDestroy.classList.add( 'Q-circuit-clipboard-destroy' )

		
		//  And around the time that animation is completing
		//  we can go ahead and remove our clipboard from the DOM
		//  and kill the reference.

		setTimeout( function(){

			document.body.removeChild( clipboardToDestroy )
			clipboardToDestroy = null

		}, 500 )
		

		//  No more to do here. Goodbye.

		return
	}


	//  If we couldn’t determine a circuitEl
	//  from the drop target,
	//  or if there is a target circuit but it’s locked,
	//  then we need to return these dragged items
	//  to their original circuit.

	const circuitEl = boardContainerEl.closest( '.Q-circuit' )
	if( circuitEl.classList.contains( 'Q-circuit-locked' )){

		returnToOrigin()
		return
	}


	//  Time to get serious.
	//  Where exactly are we dropping on to this circuit??

	const 
	circuit    = circuitEl.circuit,
	bounds     = boardContainerEl.getBoundingClientRect(),
	droppedAtX = x - bounds.left + boardContainerEl.scrollLeft,
	droppedAtY = y - bounds.top  + boardContainerEl.scrollTop,
	droppedAtMomentIndex = Editor.gridColumnToMomentIndex( 

		Editor.pointToGrid( droppedAtX )
	),
	droppedAtRegisterIndex = Editor.gridRowToRegisterIndex(

		Editor.pointToGrid( droppedAtY )
	),
	foregroundEl = circuitEl.querySelector( '.Q-circuit-board-foreground' )


	//  If this is a self-drop
	//  we can also just return to origin and bail.

	if( Editor.dragEl.circuitEl === circuitEl &&
		Editor.dragEl.momentIndex === droppedAtMomentIndex &&
		Editor.dragEl.registerIndex === droppedAtRegisterIndex ){

		returnToOrigin()
		return
	}


	//  Is this a valid drop target within this circuit?

	if(
		droppedAtMomentIndex   < 1 || 
		droppedAtMomentIndex   > circuit.timewidth ||
		droppedAtRegisterIndex < 1 ||
		droppedAtRegisterIndex > circuit.bandwidth
	){
		returnToOrigin()
		return
	}
	

	//  Finally! Work is about to be done!
	//  All we need to do is tell the circuit itself
	//  where we need to place these dragged items.
	//  It will do all the validation for us
	//  and then fire events that will place new elements
	//  where they need to go!

	const 
	draggedOperations    = Array.from( Editor.dragEl.children ),
	draggedMomentDelta   = droppedAtMomentIndex - Editor.dragEl.momentIndex,
	draggedRegisterDelta = droppedAtRegisterIndex - Editor.dragEl.registerIndex,
	setCommands = []


	//  Whatever the next action is that we perform on the circuit,
	//  this was user-initiated via the graphic user interface (GUI).

	circuit.history.createEntry$()


	//  Now let’s work our way through each of the dragged operations.
	//  If some of these are components of a multi-register operation
	//  the sibling components will get spliced out of the array
	//  to avoid processing any specific operation more than once.

	draggedOperations.forEach( function( childEl, i ){

		let
		momentIndexTarget   = droppedAtMomentIndex, 
		registerIndexTarget = droppedAtRegisterIndex
		
		if( Editor.dragEl.circuitEl ){

			momentIndexTarget   += childEl.origin.momentIndex   - Editor.dragEl.momentIndex
			registerIndexTarget += childEl.origin.registerIndex - Editor.dragEl.registerIndex
		}


		//  Is this a multi-register operation?
		//  If so, this is also a from-circuit drop
		//  rather than a from-palette drop.

		const registerIndicesString = childEl.getAttribute( 'register-indices' )
		if( registerIndicesString ){

			//  What are ALL of the registerIndices
			//  associated with this multi-register operation?
			// (We may use them later as a checklist.)

			const
			registerIndices = registerIndicesString
			.split( ',' )
			.map( function( str ){ return +str }),


			//  Lets look for ALL of the sibling components of this operation.
			//  Later we’ll check and see if the length of this array
			//  is equal to the total number of components for this operation.
			//  If they’re equal then we know we’re dragging the WHOLE thing.
			//  Otherwise we need to determine if it needs to break apart
			//  and if so, what that nature of that break might be.
			
			foundComponents = Array.from( 

				Editor.dragEl.querySelectorAll( 

					`[moment-index="${ childEl.origin.momentIndex }"]`+
					`[register-indices="${ registerIndicesString }"]`
				)
			)
			.sort( function( a, b ){

				const 
				aRegisterIndicesIndex = +a.getAttribute( 'register-indices-index' ),
				bRegisterIndicesIndex = +b.getAttribute( 'register-indices-index' )
				
				return aRegisterIndicesIndex - bRegisterIndicesIndex
			}),
			allComponents = Array.from( Editor.dragEl.circuitEl.querySelectorAll(

				`[moment-index="${ childEl.origin.momentIndex }"]`+
				`[register-indices="${ registerIndicesString }"]`
			)),
			remainingComponents = allComponents.filter( function( componentEl, i ){

				return !foundComponents.includes( componentEl )
			}),


			//  We can’t pick the gate symbol 
			//  off the 0th gate in the register indices array
			//  because that will be an identity / control / null gate.
			//  We need to look at slot 1.

			component1 = Editor.dragEl.querySelector( 

				`[moment-index="${ childEl.origin.momentIndex }"]`+
				`[register-index="${ registerIndices[ 1 ] }"]`
			),
			gatesymbol = component1 ? 
				component1.getAttribute( 'gate-symbol' ) : 
				childEl.getAttribute( 'gate-symbol' )


			//  We needed to grab the above gatesymbol information
			//  before we sent any clear$ commands
			//  which would in turn delete those componentEls.
			//  We’ve just completed that, 
			//  so now’s the time to send a clear$ command
			//  before we do any set$ commands.

			draggedOperations.forEach( function( childEl ){

				Editor.dragEl.circuitEl.circuit.clear$(

					childEl.origin.momentIndex,
					childEl.origin.registerIndex
				)
			})


			//  FULL MULTI-REGISTER DRAG (TO ANY POSITION ON ANY CIRCUIT).
			//  If we are dragging all of the components
			//  of a multi-register operation
			//  then we are good to go.

			if( registerIndices.length === foundComponents.length ){

				const operationSkeleton = Gate.findBySymbol( gatesymbol )
				parameters = {}
				if( operationSkeleton.has_parameters ) {
					Object.keys( operationSkeleton.parameters ).forEach( key => {
						parameters[ key ] = childEl.getAttribute( key ) ? childEl.getAttribute( key ) : operationSkeleton.parameters[ key ]
					})
				}
				//circuit.set$( 
				setCommands.push([

					gatesymbol,
					momentIndexTarget,


					//  We need to remap EACH register index here
					//  according to the drop position.
					//  Let’s let set$ do all the validation on this.
					
					registerIndices.map( function( registerIndex ){

						const siblingDelta = registerIndex - childEl.origin.registerIndex
						registerIndexTarget = droppedAtRegisterIndex
						if( Editor.dragEl.circuitEl ){

							registerIndexTarget += childEl.origin.registerIndex - Editor.dragEl.registerIndex + siblingDelta
						}
						return registerIndexTarget
					}),
					parameters
				// )
				])
			}


			//  IN-MOMENT (IN-CIRCUIT) PARTIAL MULTI-REGISTER DRAG.
			//  It appears we are NOT dragging all components
			//  of a multi-register operation.
			//  But if we’re dragging within the same circuit
			//  and we’re staying within the same moment index
			//  that might be ok!

			else if( Editor.dragEl.circuitEl === circuitEl &&
				momentIndexTarget === childEl.origin.momentIndex ){
				

				//  We must ensure that only one component
				//  can sit at each register index.
				//  This copies registerIndices, 
				//  but inverts the key : property relationship.
				const registerMap = registerIndices
				.reduce( function( registerMap, registerIndex, r ){

					registerMap[ registerIndex ] = r
					return registerMap

				}, {} )


				//  First, we must remove each dragged component
				//  from the register it was sitting at.

				foundComponents.forEach( function( component ){

					const componentRegisterIndex = +component.getAttribute( 'register-index' )


					//  Remove this component from 
					//  where this component used to be.

					delete registerMap[ componentRegisterIndex ]
				})


				//  Now we can seat it at its new position.
				//  Note: This may OVERWRITE one of its siblings!
				//  And that’s ok.
				foundComponents.forEach( function( component ){

					const 
					componentRegisterIndex = +component.getAttribute( 'register-index' ),
					registerGrabDelta = componentRegisterIndex - Editor.dragEl.registerIndex


					//  Now put it where it wants to go,
					//  possibly overwriting a sibling component!
					//ltnln: if a multiqubit operation component that requires a sibling, overwrites its sibling, both/all components should be destroyed
					registerMap[
	
					 	componentRegisterIndex + draggedRegisterDelta

					 ] = +component.getAttribute( 'register-indices-index' )
				})


				//  Now let’s flip that registerMap
				//  back into an array of register indices.

				const fixedRegistersIndices = Object.entries( registerMap )
				.reduce( function( registers, entry, i ){

					registers[ +entry[ 1 ]] = +entry[ 0 ]
					return registers

				}, [] )


				//  This will remove any blank entries in the array
				//  ie. if a dragged sibling overwrote a seated one.

				.filter( function( entry ){
					return mathf.isUsefulInteger( entry )
				})

				const operationSkeleton = Gate.findBySymbol( childEl.getAttribute( 'gate-symbol' ) )
				parameters = {}
				if( operationSkeleton.has_parameters ) {
					Object.keys( operationSkeleton.parameters ).forEach( key => {
						parameters[ key ] = childEl.getAttribute( key ) ? childEl.getAttribute( key ) : operationSkeleton.parameters[ key ]
					})
				}
				//  Finally, we’re ready to set.
				// circuit.set$( 
				setCommands.push([
					//ltnln: if a component of an operation that requires a sibling pair overwrites its sibling, we want it removed entirely. 
					fixedRegistersIndices.length < 2 && Gate.findBySymbol( childEl.getAttribute( 'gate-symbol' ) ).is_multi_qubit ?
					Gate.NOOP : 
					childEl.getAttribute( 'gate-symbol' ), 
					momentIndexTarget,
					fixedRegistersIndices,
					parameters
				// )
				])
			}
			else {
				remainingComponents.forEach( function( componentEl, i ){
					//circuit.set$( 
					const operationSkeleton = Gate.findBySymbol( componentEl.getAttribute( 'gate-symbol' ) )
					parameters = {}
					if( operationSkeleton.has_parameters ) {
						Object.keys( operationSkeleton.parameters ).forEach( key => {
							parameters[ key ] = +componentEl.getAttribute( key ) ? +componentEl.getAttribute( key ) : operationSkeleton.parameters[ key ]
						})
					}
					setCommands.push([

						+componentEl.getAttribute( 'register-indices-index' ) && !Gate.findBySymbol( childEl.getAttribute( 'gate-symbol' ) ).is_multi_qubit ? 
							gatesymbol : 
							Gate.NOOP,
						+componentEl.getAttribute( 'moment-index' ),
						+componentEl.getAttribute( 'register-index' ),
						parameters
					// )
					])
				})


				//  Finally, let’s separate and update
				//  all the components that were part of the drag.

				foundComponents.forEach( function( componentEl ){
					const operationSkeleton = Gate.findBySymbol( componentEl.getAttribute( 'gate-symbol' ) )
					parameters = {}
					if( operationSkeleton.has_parameters ) {
						Object.keys( operationSkeleton.parameters ).forEach( key => {
							parameters[ key ] = +componentEl.getAttribute( key ) ? +componentEl.getAttribute( key ) : operationSkeleton.parameters[ key ]
						})
					}
					setCommands.push([
						//ltnln: temporary fix: certain multiqubit operations should only be represented in pairs of registers. If one is removed (i.e. a single component of the pair)
						//then the entire operation should be removed. 
						+componentEl.getAttribute( 'register-indices-index' ) && !Gate.findBySymbol( componentEl.getAttribute( 'gate-symbol' ) ).is_multi_qubit ? 
							componentEl.getAttribute( 'gate-symbol' ) : 
							Gate.NOOP,
						+componentEl.getAttribute( 'moment-index' ) + draggedMomentDelta,
						+componentEl.getAttribute( 'register-index' ) + draggedRegisterDelta,
						parameters
					// )
					])
				})
			}


			//  We’ve just completed the movement 
			//  of a multi-register operation.
			//  But all of the sibling components 
			//  will also trigger this process
			//  unless we remove them 
			//  from the draggd operations array.

			let j = i + 1
			while( j < draggedOperations.length ){

				const possibleSibling = draggedOperations[ j ]
				if( possibleSibling.getAttribute( 'gate-symbol' ) === gatesymbol &&
					possibleSibling.getAttribute( 'register-indices' ) === registerIndicesString ){

					draggedOperations.splice( j, 1 )
				}
				else j ++
			}
		}


		//  This is just a single-register operation.
		//  How simple this looks 
		//  compared to all the gibberish above.
		
		else {
			
			
			//  First, if this operation comes from a circuit
			// (and not a circuit palette)
			//  make sure the old positions are cleared away.
			
			if( Editor.dragEl.circuitEl ){

				draggedOperations.forEach( function( childEl ){

					Editor.dragEl.circuitEl.circuit.clear$(

						childEl.origin.momentIndex,
						childEl.origin.registerIndex
					)
				})
			}


			//  And now set$ the operation 
			//  in its new home.

			// circuit.set$( 
			let registerIndices = [ registerIndexTarget ]
			//ltnln: By default, multiqubit gates appear in pairs on the circuit rather than
			//		requiring the user to have to pair them like with Swap/CNot. 
			const operationSkeleton =  Gate.findBySymbol( childEl.getAttribute( 'gate-symbol' ))
			if(operationSkeleton.is_multi_qubit ) {
				registerIndices.push( registerIndexTarget == circuit.bandwidth ? registerIndexTarget - 1 : registerIndexTarget + 1)
			}
			let parameters = {}
			if( operationSkeleton.has_parameters ) {
				Object.keys( operationSkeleton.parameters ).forEach( key => {
					parameters[ key ] = childEl.getAttribute( key ) ? childEl.getAttribute( key ) : operationSkeleton.parameters[ key ]
				})
			}
			setCommands.push([
				childEl.getAttribute( 'gate-symbol' ), 
				momentIndexTarget,
				registerIndices, 
				parameters
			// )
			])
		}
	})
	

	//  DO IT DO IT DO IT

	setCommands.forEach( function( setCommand ){

		circuit.set$.apply( circuit, setCommand )
	})


	//  Are we capable of making controls? Swaps?

	Editor.onSelectionChanged( circuitEl )
	Editor.onCircuitChanged( circuitEl )


	//  If the original circuit and destination circuit
	//  are not the same thing
	//  then we need to also eval the original circuit.

	if( Editor.dragEl.circuitEl &&
		Editor.dragEl.circuitEl !== circuitEl ){

		const originCircuitEl = Editor.dragEl.circuitEl
		Editor.onSelectionChanged( originCircuitEl )
		Editor.onCircuitChanged( originCircuitEl )
	}


	//  We’re finally done here.
	//  Clean up and go home.
	//  It’s been a long journey.
	//  I love you all.

	document.body.removeChild( Editor.dragEl )
	Editor.dragEl = null
}


	/////////////////////////
   //                     //
  // Pointer DOUBLECLICK //
 //                     //
/////////////////////////
//ltnln: my trying out an idea for parameterized gates...
Editor.onDoubleclick = function( event, operationEl ) {
	const operation = Gate.findBySymbol( operationEl.getAttribute( 'gate-symbol' ))
	const { x, y } = Editor.getInteractionCoordinates( event )
	const boardContainerAll = document.querySelectorAll(".Q-circuit-board-container")
	if( boardContainerAll.length === 0 ) return 
	let boardContainerEl = Array.from(boardContainerAll).find((element) => {
		let rect = element.getBoundingClientRect()
		let clientX = rect.left
		let clientY = rect.top
		let height = element.offsetHeight
		let width = element.offsetWidth
		return ( x >= clientX && x <= clientX + width ) && ( y >= clientY && y <= clientY + height )
	})
	if( !boardContainerEl ) return;
	const parameterEl = boardContainerEl.querySelector('.Q-parameters-box')
	const exit = Editor.createNewElement( 'button', parameterEl, 'Q-parameter-box-exit')
	exit.appendChild(document.createTextNode( '⬅' ))
	parameterEl.setAttribute( "operation-moment-index", operationEl.getAttribute( 'moment-index' ))
	parameterEl.setAttribute( "operation-register-index", operationEl.getAttribute( 'register-index' ))
	//here we generate queries for each parameter that the gate operation takes!
	const parameters = Object.keys(operation.parameters)
	parameters.forEach( element => {
		if( operation.parameters && operation.parameters[element] !== null ) {
			const input_fields = document.createElement( 'div' )
			parameterEl.appendChild( input_fields )
			input_fields.classList.add( 'Q-parameter-box-input-container' )

			const label = Editor.createNewElement( "span", input_fields, 'Q-parameter-input-label' )
			label.appendChild(document.createTextNode( element ))

			const textbox = Editor.createNewElement( "input", input_fields, 'Q-parameter-box-input')
			textbox.setAttribute( 'type', 'text' )
			textbox.setAttribute( 'placeholder', element )
			textbox.setAttribute( 'value', operationEl.getAttribute(element) ? operationEl.getAttribute(element) : operation.parameters[element] )
			//set textbox to update the operation instance (cellEl)'s parameters on value change
			textbox.addEventListener( "change", () => {
				let parameterValue = +textbox.value;
				let oldValue = operationEl.getAttribute( element )
				if( !oldValue ) oldValue = operation.parameters[ element ]
				if( parameterValue === null || parameterValue === Infinity ) textbox.value = oldValue.toString()
				else {
					operationEl.setAttribute( element, parameterValue )
					textbox.value = parameterValue
				}
			})


		}
	})
	parameterEl.classList.toggle('overlay')
	parameterEl.style.display = 'block'
}



    ///////////////////
   //               //
  //   Listeners   //
 //               //
///////////////////


//  These listeners must be appliedm
//  to the entire WINDOW (and not just document.body!)

window.addEventListener( 'mousemove', Editor.onPointerMove )
window.addEventListener( 'touchmove', Editor.onPointerMove )
window.addEventListener( 'mouseup',   Editor.onPointerRelease )
window.addEventListener( 'touchend',  Editor.onPointerRelease )
module.exports = {Editor}
},{"quantum-js-util":13}],16:[function(require,module,exports){
const {Editor} = require('./Q-Circuit-Editor');
const {circuit} = require('quantum-js-util');
const {BlochSphere} = require('./Q-BlochSphere');
console.log("Welcome to Q.js! The GUI experience!\n");

braket = function(){


	//  Create the HTML bits we need,
	//  contain them all together,
	//  and output them to Jupyter.
	if( arguments.length === 0 || arguments.length > 3 ) return;
	const element = arguments[0];
	const args = (Array.from(arguments)).slice(1);
	let circuit
	if(args.length === 0) {
		circuit = new Q( 4, 8 )
	}
	else if(args.length === 1) {
		circuit = new Q( args[0] )
	}
	else { 
		if(args[0] <= 0 || args[1] <= 0) circuit = new Q(4, 8);
		else circuit = new Q( args[0], args[1] )
	}
	container = document.createElement( 'div' )
	let paletteEl = Editor.createPalette();
	paletteEl.style.width = "50%";
	container.appendChild( paletteEl );
	container.appendChild( circuit.toDom() )
	element.html( container )


	//  Weâ€™re going to take this SLOOOOOOOOWLY
	//  because there are many potential things to debug.

	const thisCell = Jupyter.notebook.get_selected_cell()
	// console.log( 'thisCell', thisCell )
	
	const thisCellIndex = Jupyter.notebook.get_cells().indexOf( thisCell )
	// console.log( 'thisCellIndex', thisCellIndex )

	const nextCell = Jupyter.notebook.insert_cell_below( 'code', thisCellIndex - 1 )
	const nextNextCell = Jupyter.notebook.insert_cell_below( 'markdown', Jupyter.notebook.get_cells().indexOf( thisCell ) - 1 )
	// console.log( 'nextCell', nextCell )

	nextCell.set_text( circuit.toAmazonBraket() )
	nextNextCell.set_text( circuit.report$() )
	





	window.addEventListener( 'Q gui altered circuit', function( event ){

		// updatePlaygroundFromDom( event.detail.circuit )
		if( event.detail.circuit === circuit ){
			
			console.log( 'Updating circuit from GUI', circuit )
			circuit.evaluate$()
			nextCell.set_text( circuit.toAmazonBraket() )

		}
	})

	window.addEventListener( 'Circuit.evaluate completed', function( event ) {
		if( event.detail.circuit === circuit ) {
			nextNextCell.set_text( circuit.report$() ) 
		}
	})



	// nextCell.render()

	// console.log( 'thisCell', thisCell )
	// console.log( 'nextCell', nextCell )
	// console.log( 'thisCellIndex', thisCellIndex )

	// code = Jupyter.notebook.insert_cell_{0}('code');
	// code.set_text(atob("{1}"))

	// var t_cell = Jupyter.notebook.get_selected_cell()
	// t_cell.set_text('<!--\\n' + t_cell.get_text() + '\\n--> \\n{}')
	// var t_index = Jupyter.notebook.get_cells().indexOf(t_cell)
	// Jupyter.notebook.to_markdown(t_index)
	// Jupyter.notebook.get_cell(t_index).render()
}


module.exports = {Editor, BlochSphere, braket};
},{"./Q-BlochSphere":14,"./Q-Circuit-Editor":15,"quantum-js-util":13}]},{},[1]);
