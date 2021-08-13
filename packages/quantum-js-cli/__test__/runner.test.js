const runner = require('../runner');
const quantumjs = require('quantum-js-util');


describe("Checking evaluateInput calls the correct functions and/or logs the correct information given a certain input", () => {
    //create empty circuit.
    let circuit = quantumjs.Q();
    console.log = jest.fn();
    test("Testing evaluateInput() with input 'help' and an empty circuit.", () => {
        let expectedText = runner.printMenu();
        runner.evaluateInput("help", circuit);
        expect(console.log).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith(expectedText);
    })
    test("Testing evaluateInput() with input '-h' and an empty circuit.", () => {
        let expectedText = runner.printMenu();
        runner.evaluateInput("-h", circuit);
        expect(console.log).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith(expectedText);
    })
    test("Testing evaluateInput() with input 'toAmazonBraket' and an empty circuit", () => {
        runner.evaluateInput("toAmazonBraket", circuit);
        expectedText = circuit.toAmazonBraket();
        expect(console.log).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith(expectedText);
    })
    test("Testing evaluateInput() with input 'toDiagram' and an empty circuit", () => {
        runner.evaluateInput("toDiagram", circuit);
        expectedText = circuit.toDiagram();
        expect(console.log).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith(expectedText);
    })
    test("Testing evaluateInput() with input 'toLaTeX' and an empty circuit", () => {
        runner.evaluateInput("toLaTeX", circuit);
        expectedText = circuit.toLatex();
        expect(console.log).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith(expectedText);
    })
    test("Testing evaluateInput() with input 'report' and an empty circuit", () => {
        runner.evaluateInput("report", circuit);
        expectedText = circuit.report$();
        expect(console.log).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith(expectedText);
    })
    test("Testing evaluateInput() with input 'toText' and an empty circuit", () => {
        runner.evaluateInput("toText", circuit);
        expectedText = circuit.toAmazonBraket();
        expect(console.log).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith(expectedText);
    })
    test("Testing evaluateInput() with input 'clear' and an empty circuit", () => {
        console.clear = jest.fn();
        runner.evaluateInput("clear", circuit);
        expectedText = circuit.toAmazonBraket();
        expect(console.clear).toHaveBeenCalled();
    })
})

//Gate operation syntax is of the regex form /(\w+\(\s*\d+\s*,\s*\[(\s*\d+\s*,{0,1}\s*)+\](,\s*\d+\.{0,1}\d+\s*)*\))/g
//or more easily described: 
//'gate-symbol(moment-index, [registerIndex0, registerIndex1,...], parameter0, parameter1,...)' with white space allowed liberally
describe("Testing various forms of gate-operation call expression and see that evaluateOperation is called", ()=> {
    //create empty circuit.
    test("Check that evaluateOperation is called once for input 'h(1, [1])'", () => {
        let circuit = quantumjs.Q();
        runner.evaluateInput("h(1, [1])", circuit);
        expect(circuit.get(1, 1).gate.symbol).toBe('H');
    })
    //messing with the white space
    test("Check that evaluateOperation is called once for input 'h( 1 , [ 1 ])'", () => {
        let circuit = quantumjs.Q();
        runner.evaluateInput("h( 1 , [ 1 ])", circuit)
        expect(circuit.get(1, 1).gate.symbol).toBe('H');
    })
    //while this doesn't update the circuit, it should still call evaluateOperation which detects the flaw later.
    test("Check that no operation is added for 'h( 1 , [ 1 ], 3)' as the Hadamard operation takes no parameters", () => {
        let circuit = quantumjs.Q();
        runner.evaluateInput("h( 1 , [ 1 ], 3)", circuit)
        expect(circuit.get(1, 1)).toBeUndefined();
    }) 
    test("Check that evaluateOperation is called for input 'x(1, [1, 2])'", () => {
        let circuit = quantumjs.Q();
        runner.evaluateInput("x(1, [1, 2])", circuit)
        expect(circuit.get(1, 1).gate.symbol).toBe("X");
        expect(circuit.get(1, 2).gate.symbol).toBe("X");
    })
    //messing with the white space
    test("Check that evaluateOperation is called for input 'x( 1, [ 1,   2 ]   )'", () => {
        let circuit = quantumjs.Q();
        runner.evaluateInput("x(1, [1, 2])", circuit)
        expect(circuit.get(1, 1).gate.symbol).toBe("X");
        expect(circuit.get(1, 2).gate.symbol).toBe("X");
    })
    describe("Check that gateSymbol(...,[...]) is valid for all gate constants in the Gate module using their nameCss value", ()=> {
        Object.entries(quantumjs.Gate.constants).forEach(function(entry) {
            let gate = entry[1];
            let input = gate.nameCss + (gate.is_multi_qubit ? "(1, [1, 2])" : "(1, [1])");
            test("Checking that evaluate operation is called once for the input '" + input + "'", () => {
                let circuit = quantumjs.Q();
                runner.evaluateInput(input, circuit);
                expect(circuit.get(1, 1).gate.nameCss).toBe(gate.nameCss);
                if(gate.is_multi_qubit) {
                    expect(circuit.get(1, 2).gate.nameCss).toBe(gate.nameCss);
                }
            })
        })
    })

    
})


describe("Testing removal operations (of the same regex form as above) and that removeOperation() is called", () => {
    test("Check that removeOperation is called once for input remove(1, [1])", () => {
        let circuit = quantumjs.Q();
        //Set a hadamard operation on the circuit.
        circuit.set$('H', 1, [1]);
        runner.evaluateInput('remove(1, [1])', circuit);
        expect(circuit.get(1, 1)).toBeUndefined();
    })
    //messing with the whitepsace
    test("Check that removeOperation is called once for input remove( 1 , [ 1 ] )", () => {
        let circuit = quantumjs.Q();
        //Set a hadamard operation on the circuit.
        circuit.set$('H', 1, [1]);
        runner.evaluateInput('remove( 1 , [ 1 ] )', circuit);
        expect(circuit.get(1, 1)).toBeUndefined();
    })
    test("Check that removeOperation removes all sibling indices of the operation x(1, [1, 2]) when remove(1, [1]) is called", ()=> {
        let circuit = quantumjs.Q();
        circuit.set$('X', 1, [1, 2]);
        runner.evaluateInput('remove(1, [1])', circuit);
        expect(circuit.get(1, 1)).toBeUndefined();
        expect(circuit.get(1, 2)).toBeUndefined();
    })
    test("Check that the removeOperation does NOT remove any operation given a set of indices that are not siblings", ()=> {
        let circuit = quantumjs.Q();
        //Set a hadamard operation on the circuit.
        circuit.set$('H', 1, [1]);
        runner.evaluateInput('remove(1, [1, 2])', circuit);
        expect(circuit.get(1, 1)).toBeDefined();
        expect(circuit.get(1, 1).gate.symbol).toBe('H');
    })
})

describe("Check that parameters parameterized gates can be input and set properly", ()=> {
    test("Check that the input 'u(1, [1], 3, 2, 5)' results in the creation of a unitary gate with phi=3,theta=2,lambda=5", ()=>{
        let circuit = quantumjs.Q(4, 4);
        runner.evaluateInput("u(1, [1], 3, 2, 5)", circuit);
        let result = circuit.get(1, 1).gate;
        expect(result.symbol).toBe('U');
        expect(result.parameters['phi']).toBe(3);
        expect(result.parameters['theta']).toBe(2);
        expect(result.parameters['lambda']).toBe(5);
    })
    //messing with whitespace
    test("Check that the input 'u(1, [1], 3  , 2  , 5  )' results in the creation of a unitary gate with phi=3,theta=2,lambda=5", ()=>{
        let circuit = quantumjs.Q(4, 4);
        runner.evaluateInput("u(1, [1], 3  , 2  , 5  )", circuit);
        let result = circuit.get(1, 1).gate;
        expect(result.symbol).toBe('U');
        expect(result.parameters['phi']).toBe(3);
        expect(result.parameters['theta']).toBe(2);
        expect(result.parameters['lambda']).toBe(5);
    })
    //checking regex accepts decimal values
    test("Check that the input 'u(1, [1], 3.93, 2.24, 5.12)' results in the creation of a unitary gate with phi=3,theta=2,lambda=5", ()=>{
        let circuit = quantumjs.Q(4, 4);
        runner.evaluateInput("u(1, [1], 3.93, 2.24, 5.12)", circuit);
        let result = circuit.get(1, 1).gate;
        expect(result.symbol).toBe('U');
        expect(result.parameters['phi']).toBe(3.93);
        expect(result.parameters['theta']).toBe(2.24);
        expect(result.parameters['lambda']).toBe(5.12);
    })
    //check that too many parameters results in a failed set operation
    test("Check that the input 'u(1, [1], 1, 2, 3, 4)' does NOT result creation of a unitary gate", ()=>{
        let circuit = quantumjs.Q(4, 4);
        runner.evaluateInput("u(1, [1], 1, 2, 3, 4)", circuit);
        expect(circuit.get(1, [1])).toBeUndefined();
    })
    test("Check that the input 'u(1, [1], 1, 2)' does result creation of a unitary gate with phi=1,theta=2,lambda=[default]", ()=>{
        let circuit = quantumjs.Q(4, 4);
        runner.evaluateInput("u(1, [1], 1, 2)", circuit);
        let result = circuit.get(1, 1).gate;
        let defaultUnitary = Gate.findBySymbol('U');
        expect(result.symbol).toBe('U');
        expect(result.parameters['phi']).toBe(1);
        expect(result.parameters['theta']).toBe(2);
        expect(result.parameters['lambda']).toBe(defaultUnitary.parameters['lambda']);
    })
})


describe("Test various combinations of set and remove operations chained together", ()=> {
    test("Check that the input 'h(1, [1]).x(2, [1])' results in valid gate set operations", ()=> {
        let circuit = quantumjs.Q(4, 4);
        runner.evaluateInput("h(1, [1]).x(2, [1])", circuit);
        expect(circuit.get(1, 1).gate.symbol).toBe('H');
        expect(circuit.get(2, 1).gate.symbol).toBe('X');
    })
    //Messing with the whitespace
    test("Check that the input 'h(1,  [ 1 ]).x( 2 , [ 1 ] )' results in valid gate set operations", ()=> {
        let circuit = quantumjs.Q(4, 4);
        runner.evaluateInput("h(1,  [ 1 ]).x( 2 , [ 1 ] )", circuit);
        expect(circuit.get(1, 1).gate.symbol).toBe('H');
        expect(circuit.get(2, 1).gate.symbol).toBe('X');
    })
    test("Check that the input 'h(1, [1]).x(2, [1, 2]).p(1, [3], 3.14159)' results in valid gate set operations", ()=> {
        let circuit = quantumjs.Q(4, 4);
        runner.evaluateInput("h(1, [1]).x(2, [1, 2]).p(1, [3], 3.14159)", circuit);
        expect(circuit.get(1, 1).gate.symbol).toBe('H');
        expect(circuit.get(2, 1).gate.symbol).toBe('X');
        expect(circuit.get(2, 1).registerIndices).toEqual([1, 2]);
        expect(circuit.get(1, 3).gate.symbol).toBe('P');
        expect(circuit.get(1, 3).gate.parameters['phi']).toBe(3.14159);
    })
    test("Check that the input 'h(1, [1]).x(2, [1, 2]).remove(1, [1]).p(1, [3], 3.14159)' results in valid gate set operations", ()=> {
        let circuit = quantumjs.Q(4, 4);
        runner.evaluateInput("h(1, [1]).x(2, [1, 2]).remove(1, [1]).p(1, [3], 3.14159)", circuit);
        expect(circuit.get(1, 1)).toBeUndefined();
        expect(circuit.get(2, 1).gate.symbol).toBe('X');
        expect(circuit.get(2, 1).registerIndices).toEqual([1, 2]);
        expect(circuit.get(1, 3).gate.symbol).toBe('P');
        expect(circuit.get(1, 3).gate.parameters['phi']).toBe(3.14159);
    })
})