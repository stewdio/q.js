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

//Helper functions
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
  this.constants[key] = this[key];
  Object.freeze(this[key]);
}

function createConstants() {
  if (arguments.length % 2 !== 0) {
    return error(
      "Q attempted to create constants with invalid (KEY, VALUE) pairs."
    );
  }
  for (let i = 0; i < arguments.length; i += 2) {
    this.createConstant(arguments[i], arguments[i + 1]);
  }
}

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

COLORS = [];
ANIMALS = [];
constants = {};
function loop() {}

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

const namesIndex = 0;
const shuffledNames = [];
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

//Yes you can instead just define the functions in here using () => {} expressions, this is just seems neater...
module.exports = {
  log: log,
  error: error,
  help: help,
  warn: warn,
  isUsefulNumber: isUsefulNumber,
  isUsefulInteger: isUsefulInteger,
  hypotenuse: hypotenuse,
  logHypotenuse: logHypotenuse,
  hyperbolicSine: hyperbolicSine,
  hyperbolicCosine: hyperbolicCosine,
  round: round,
  createConstant: createConstant,
  createConstants: createConstants,
  toTitleCase: toTitleCase,
  centerText: centerText,
  getRandomName$: getRandomName$,
  hueToColorName: hueToColorName,
  colorIndexToHue: colorIndexToHue,
  constants: constants,
};
