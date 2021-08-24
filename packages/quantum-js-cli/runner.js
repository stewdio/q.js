const {Q, Circuit, Gate, logger} = require('quantum-js-util');
const prompt_sync = require('prompt-sync')({sigint: true});
var readlineSync = require('readline-sync');
const mark = "> ";


function prepareCircuit(prompt = prompt_sync) {
    let selection = NaN;
    console.clear();
    let circuit;
    while(!selection) {
        //the following prompt requires the user to select between a number of options to create a circuit. they will enter the NUMBER that corresponds with the action they'd like.
        console.log("Please select a method (number value) to begin circuit creation: ");
        console.log("1. From Scratch\n" + 
                    "2. From Text Diagram\n");
        selection = Number(prompt(mark));
        switch(selection) {
            case 1:
                let num_registers = NaN;
                while(!num_registers || num_registers <= 0) {
                    console.log("Enter the number of qubits you would like to start out with.\n");
                    num_registers = Number(prompt(mark));
                }
                circuit = Q(num_registers, 8);
                break;
            case 2: 
                circuit = prepareCircuitFromTable();
                break;
            default:
                selection = NaN;
        }
    }
    if(!(circuit instanceof Circuit)) {
        logger.error("Failed to create circuit");
        process.exit();
    }
    console.log(circuit.toDiagram());
    return circuit;
}

function prepareCircuitFromTable() {
    let resultingCircuit;
    let tableString;
    let lines = [];
    console.log('Input (or paste) your table below and press [Enter] key twice to submit.');
    readlineSync.promptLoop(line => {
      lines.push(line);
      return !line;
    }, {prompt: ''});
    tableString = lines.join('\n');
    try {
        resultingCircuit = Q(tableString.trim());
    }
    catch(e) {
        return logger.error("Failed to create circuit from table.");
    }
    if(!(resultingCircuit instanceof Circuit) || resultingCircuit.bandwidth <= 0 || resultingCircuit.timewidth <= 0) return logger.error("Failed to create circuit from table.");
    return resultingCircuit;
}



function printMenu() {
    let menu = 
`-h, help           Print Q.js command line options (currently set)
    toDiagram       Print the current circuit as a text diagram
    toAmazonBraket  Export the current circuit as Python code using the Amazon Braket SDK. 
    toLaTeX         Print the current circuit as a LaTeX diagram 
    toText          Print as a table using only common characters (can be used to import later).
    report          Evaluate and current circuit's probability report
    clear           Clear the console
    newCircuit      Discard the current circuit and create a new circuit.
q, quit             Exit the command line
    `;
    console.log(menu);
    return menu;
}

function evaluateOperation(input, circuit) {
    let functionName = (/[^\s,\[\]()]+/g).exec(input)[0];
    let gate = Gate.findBySymbol(functionName);
    if(!gate) gate = Gate.findByNameCss(functionName)
    //checks that the function call is gate set$ operation and not another circuit operation.
    //Syntax: GateSymbol(momentIndex, [registerIndex0, registerIndex1,...])
        //Regex explanation: looks for the first INTEGER of the from "(digit0digit1digit2..." and removes the "(" at the beginning.
    let momentIndex = +(/\(\s*\d+/).exec(input)[0].substring(1);
    if(momentIndex > circuit.timewidth || momentIndex < 0) return logger.error("Moment index out of bounds");
    if(momentIndex === undefined) {
        return logger.error("Invalid gate set operation syntax");
    }
    
    let registerIndices;
    //This is a regex that selects an array of integers from a string, i.e. any substring of the form "[integer1, integer2, integer3...]"
    let arrayRegex = /\[(\s*\d+\s*,{0,1}\s*)+\]/g;
    try {
        registerIndices = (arrayRegex)
        .exec(input)[0]
        .slice(1, -1)
        .split(',')
        .map(index => +index);
    } 
    catch(e) {
        return logger.error("Invalid gate set operation syntax");
    }
    if(!registerIndices.every(index => {
        return index > 0 && index < circuit.bandwidth;
    })) return logger.error("Register index out of bounds");
    let newParameters = {};
    input = input.substring(arrayRegex.lastIndex);
    let commaSeparatedDecimalRegex = /\d+\.{0,1}\d*/g
    let input_params = [];
    while(value = commaSeparatedDecimalRegex.exec(input)) {
        input_params.push(Number(value[0]));
    }
    input_params.reverse();
    if(gate.has_parameters) {
        if(input_params.length > Object.keys(gate.parameters).length) return logger.error("b Invalid gate set operation syntax");
        Object.keys(gate.parameters).forEach(key => {
            newParameters[key] = input_params.pop();
            if(!newParameters[key]) {
                newParameters[key] = gate.parameters[key];
            }
        });
    }
    else if(input_params.length !== 0) return logger.error("Invalid gate set operation syntax");
    return circuit[functionName](momentIndex, registerIndices, newParameters);
}


function removeOperation(input, circuit) {
    let momentIndex = +(/\(\s*\d+/).exec(input)[0].substring(1);
    if(momentIndex === undefined) {
        return logger.error("Invalid gate set operation syntax");
    }
    //
    let registerIndices;
    let arrayRegex = /\[(\s*\d+\s*,{0,1}\s*)+\]/g;
    try {
        registerIndices = (arrayRegex)
        .exec(input)[0]
        .slice(1, -1)
        .split(',')
        .map(index => Number(index));
    } 
    catch(e) {
        return logger.error("Invalid gate set operation syntax");
    }
    if(input.substring(arrayRegex.lastIndex).trim() != ")") {
        return logger.error("Invalid gate set operation syntax");
    }
    let operationToRemove = circuit.get(momentIndex, registerIndices[0]);
    if(!operationToRemove) {
        return logger.log("No operation to remove");
    }
    if(registerIndices.every(index => {
        return operationToRemove.registerIndices.includes(index);
    })) return circuit.clear$(momentIndex, operationToRemove.registerIndices);
}

function evaluateInput(input, circuit, prompt=prompt_sync) {
    switch(input) {
        case "-h":
        case "help":
            printMenu();
            break;
        case "toDiagram":
            console.log(circuit.toDiagram());
            break;
        case "toAmazonBraket": 
            console.log(circuit.toAmazonBraket());
            break;
        case "toLaTeX": 
            console.log(circuit.toLatex());
            break;
        case "report":
            circuit.evaluate$();
            console.log(circuit.report$());
            break;
        case "clear":
            console.clear();
            break;
        case "toText":
            console.log(circuit.toText(true));
            break;
        case "newCircuit": 
            let response = prompt("Creating a new circuit will discard the current circuit. Enter yes to continue: ").toLowerCase();
            if(response !== "yes") console.log("Did not create new circuit.");
            else circuit = prepareCircuit();
            break;
        default:
            let circuitBackup = circuit.toText();
            let functionCallRegex = /((\w+-*)+\(\s*\d+\s*,\s*\[(\s*\d+\s*,{0,1}\s*)+\]\s*(,\s*\d+\.{0,1}\d*\s*)*\))/g;
            while(functionCall = functionCallRegex.exec(input)) {
                functionCall = functionCall[0];
                let functionName = (/[^\s,\[\]()]+/g).exec(functionCall)[0];
                //checks that the function call is gate set$ operation and not another circuit operation.
                //Syntax: GateSymbol(momentIndex, [registerIndex0, registerIndex1,...])
                if(circuit[functionName] instanceof Function && (Gate.findBySymbol(functionName) instanceof Gate || Gate.findByNameCss(functionName) instanceof Gate)) {
                    if(evaluateOperation(functionCall, circuit) === "(error)") {
                        circuit = Q(circuitBackup);
                        break;
                    }
                }
                //Syntax: clear(momentIndex, registerIndex)
                //If the registerIndex is the index of a multiqubit operation, we clear all indices associated with the operation under registerIndex
                else if(functionName == "remove") {
                    if(removeOperation(functionCall, circuit) === "(error)") {
                        circuit = circuitBackup;
                        break;
                    }
                }
            }
    }
    return circuit;
}


function run(prompt = prompt_sync) {
    let circuit = prepareCircuit(prompt);
    let input = prompt(mark);
    while(input !== "quit" && input !== "q" && circuit !== '(error)') {
        circuit = evaluateInput(input, circuit, prompt);
        input = prompt(mark);
    }
    
}

module.exports = {run, evaluateInput, removeOperation, evaluateOperation, printMenu, prepareCircuit};