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

module.exports = {
  log: log,
  error: error,
  help: help,
  warn: warn,
  toTitleCase: toTitleCase,
  centerText: centerText,
};
