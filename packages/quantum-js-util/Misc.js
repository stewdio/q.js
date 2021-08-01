const logger = require('./Logging');

const COLORS = [];
const ANIMALS = [];
const constants = {};

function dispatchEventToGlobal(event) {
  if(typeof window != undefined) {
    window.dispatchEvent(event);
  }
  else {
   //if window does exist, global == window is true. So maybe we can just do global.dispatchEvent instead of this wrapper?
   global.dispatchEvent(event);
   console.log(event);
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

module.exports = { createConstant, createConstants, getRandomName$, hueToColorName, colorIndexToHue, dispatchEventToGlobal, constants };
