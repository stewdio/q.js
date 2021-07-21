/**
 * @jest-environment jsdom
 */


//TODO: ask for the breadth of these tests; ex. should I be testing functions on every single gate operation?

var Q = require('../q-old');

/*
 * Q-Gate.js; File contains all valid gate operations in the Q library. 
 */

/* 
 * Testing basic getters (.findBySymbol(), .findByName()) for basic correctness.
 */
beforeEach(() => {
    Q.Matrix.index = 0
});

test(`Q.Gate.findBySymbol(), with symbol 'I'. Should return Identity gate object.`, () => {
    expect(Q.Gate.findBySymbol( 'I' )).toEqual({
        index: 0,
        symbol:    'I',
		symbolAmazonBraket: 'i',
		symbolSvg: '',
		name:      'Identity',
		nameCss:   'identity',
		matrix: Q.Matrix.IDENTITY_2X2,
        parameters: {}, 
        applyToQubit: expect.any(Function)
    })
})

test(`Q.Gate.findByName(), with name 'Identity'. Should return Identity gate object.`, () => {
    expect(Q.Gate.findByName( 'Identity' )).toEqual({
        index: 0,
        symbol:    'I',
		symbolAmazonBraket: 'i',
		symbolSvg: '',
		name:      'Identity',
		nameCss:   'identity',
		matrix: Q.Matrix.IDENTITY_2X2,
        parameters: {}, 
        applyToQubit: expect.any(Function)
    })
})

/*
 * Testing basic getters (.findBySymbol(), .findByName())for invalid gate requests
 * 
 */

test(`Q.Gate.findBySymbol(), with symbol 'n/a', which should return undefined`, () => {
    expect(Q.Gate.findBySymbol( 'n/a' )).toBeUndefined()
})

test(`Q.Gate.findByName(), with name 'n/a
', which should return undefined`, () => {
    expect(Q.Gate.findByName( 'n/a' )).toBeUndefined()
})

/*
 * Test that Q.Gate.prototype.clone() returns a deep copy of a gate operation and not a reference. 
 */

test(`Check that Q.Gate.prototype.clone() returns a deep copy of the passed in gate`, () => {
    let new_gate = Q.Gate.prototype.clone( Q.Gate.findBySymbol( 'U' ))
    expect( new_gate ).not.toBe( Q.Gate.findBySymbol( 'U' ))
    expect( Q.Gate.findBySymbol( 'U' ) ).toBe( Q.Gate.findBySymbol( 'U' ))
})


/*
 * The following series of functions will test the updateMatrix$ function for a few of the 
 * gate operations included in Q. Not all gate operations need to recalculate their matrix.
 * But all parameterized qubits calculate their matrix in the same way. 
 * 
 * Traditional edge cases (divide by 0, restricted input domain) are non-existent as
 * none of the [currently] includes gates' matrices have restricted domains for inputs. 
 *
 * Checking CSV strings as values should be the same; deep copies will never match due to Q.Matrix.index attribute. 
 */

test(`updateMatrix$ for the phase gate with parameter (phi = -π)`, () => {
    const gate = Q.Gate.prototype.clone( Q.Gate.findBySymbol( 'P' ));
    const expected_result = Q.Matrix.toCsv( new Q.Matrix(
        [1, 0],
        [0, Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, -Math.PI ))]
    ));
    gate.updateMatrix$(-Math.PI);
    expect( Q.Matrix.toCsv( gate.matrix )).toBe( expected_result );
})

//This test surprisingly&indirectly helped uncover a problem calculating live probability results :D 
test(`updateMatrix$ for the unitary gate with parameters (phi = -π,`
    + ` theta = π, lambda = -π)`, () => {
    const gate = Q.Gate.prototype.clone( Q.Gate.findBySymbol( 'U' ));
    
    //creating expected matrix converted to a Csv string for comparison
    const phi = -Math.PI;
    const theta = Math.PI;
    const lambda = -Math.PI;
    const a = Q.ComplexNumber.multiply(
        Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, -( phi + lambda ) / 2 )),  Math.cos( theta / 2 ));
    const b = Q.ComplexNumber.multiply(
         Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, -( phi - lambda ) / 2 )), -Math.sin( theta / 2 ));
    const c = Q.ComplexNumber.multiply(
        Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, ( phi - lambda ) / 2 )), Math.sin( theta / 2 ));
    const d = Q.ComplexNumber.multiply(
        Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, ( phi + lambda ) / 2 )), Math.cos( theta / 2 ));
    const expected_result = Q.Matrix.toCsv( new Q.Matrix(
        [a, b],
        [c, d]
    )) 

    //updating the current gate with the values phi, theta, lambda
    gate.updateMatrix$( phi, theta, lambda )
    expect( Q.Matrix.toCsv( gate.matrix )).toBe( expected_result );
});

/*
 * The following methods test simply the creation of the parameter input div when a valid gate operation
 * in the circuit is doubleclicked.
 * 
 */
('H,X,Y,Z,P,Rx,Ry,Rz,U,V,V†,S*,S†,T,T†,00,01,10,√S,iS,XX,XY,YY,ZZ,*'.split(',')).forEach(( element ) => {
    let operation = Q.Gate.prototype.clone( Q.Gate.findBySymbol( element ) );
    let test_message = "Check that gate operation with symbol [" + element + "] exists and is found by Q.Gate.findBySymbol()";
    test(test_message, () => {
        expect(operation).toBeDefined();
    })
    let description = "Checking circuit set for operation [" + operation.name + "] is valid"
    describe(description, () => {
        document.body.innerHTML =
        '<div>' +
        '  <div id="container" />' +
        '</div>';
        let container = document.getElementById( 'container' );
        const circuit = new Q.Circuit(2, 2);
        const parameters = {};
        Object.assign(parameters, operation.parameters);
        const register_indices = operation.is_multi_qubit ? [1, 2] : [1];
        circuit.set$( operation.symbol, 1, register_indices, parameters );
        container.appendChild(circuit.toDom());
        const operationEl = (container.querySelector('.Q-circuit-operation' ));
        test_message = "Check that the operation icon for operation [" + operation.name + "] exists"
        test(test_message, () => {
            expect(operationEl).toBeDefined();
        })
        
        if( operation.is_multi_qubit ) {
            test_message = "Check that multi-qubit gate operation [" + operation.name + "] takes up two register indices in the circuit";
            test(test_message, () => {
                expect(operationEl.getAttribute( 'register-indices' ).split(',').length).toBe( 2 );
            })
        }

        if( operation.has_parameters ) {
            const parameters = operation.parameters;
            test_message = "Since operation [" + operation.name + "] 'has_parameters', operation.parameters should NOT be empty"
            test(test_message, () => {
                expect(parameters).toBeDefined();
                expect(Object.keys(parameters).length)
            })

            let clientRect = operationEl.getBoundingClientRect();
            let clientX = clientRect.left;
            let clientY = clientRect.top;
            const event = {
                'clientX' : clientX,
                'clientY' : clientY
            }
            Q.Circuit.Editor.onDoubleclick( event, operationEl );
            expect( document.querySelector( '.Q-parameters-box' ).style.display ).toBe('block');
            // Check that the correct number of textboxes were created.
            // Setting the values 1 and 3 as the usual case is 1 parameter with the exception of the unitary gate.
            // This can be generalized by using Object.keys(parameters).length but this is more exact for testing purposes.
            const textboxes = document.querySelectorAll( '.Q-parameter-box-input' );
            test_message = "The number of parameter-input textboxes generated for operation [" + operation.name + "] on a double click must be "
                            + operation.symbol === 'U' ? '3' : '1';
            test(test_message, () => {
                let expected_result = operation.symbol === 'U' ? 3 : 1;
                expect( Object.keys( operation.parameters ).length ).toBe( expected_result );
                expect( Array.from( textboxes ).length ).toBe( expected_result );
            })
        }
    })
})

/*
 * The following test checks various responses to the parameter textboxes to a change event.
 * These tests can be generalized for input for any single-qubit operation.
 *
 */ 

describe("Checking the responses to adding different inputs to a parameter textbox for the PHASE operation", () => {
    beforeEach(() => {
        let operation = Q.Gate.findBySymbol( 'P' );
        document.body.innerHTML =
        '<div>' +
        '  <div id="container" />' +
        '</div>';
        let container = document.getElementById( 'container' );
        const circuit = new Q.Circuit(1, 1);
        circuit.set$( operation.symbol, 1, [1], {'phi': 1} );
        container.appendChild(circuit.toDom());
        const operationEl = (container.querySelector('.Q-circuit-operation' ));
        let clientRect = operationEl.getBoundingClientRect();
        let clientX = clientRect.left;
        let clientY = clientRect.top;
        const event = {
            'clientX' : clientX,
            'clientY' : clientY
        }
        Q.Circuit.Editor.onDoubleclick( event, operationEl );
    })
    test("Check that the textbox default value is equal to 1, the 'phi' value of the operation", () => {
        const textbox = document.querySelector( '.Q-parameter-box-input' );
        expect( +( textbox.value ) ).toBe( 1 );
    })

    test("Check that the textbox retains decimal/number ('1.234') values inputted after a change event", () => {

        const operationEl = (container.querySelector('.Q-circuit-operation' ));
        const textbox = document.querySelector( '.Q-parameter-box-input' );
        textbox.value = '1.234';
        let event = new Event('change');
        textbox.dispatchEvent( event );
        expect( textbox.value ).toBe( '1.234' );
        expect( operationEl.getAttribute( 'phi' ) ).toBe( '1.234' );
    })

    test("Check that the textbox removes invalid values ('4/2') inputted after a change event", () => {
        const evaluate = require("mathjs");

        const operationEl = (container.querySelector('.Q-circuit-operation' ));
        const textbox = document.querySelector( '.Q-parameter-box-input' );
        textbox.value = '4/2';
        let event = new Event('change');
        textbox.dispatchEvent( event );
        expect( textbox.value ).toBe( '1' );
        expect( operationEl.getAttribute( 'phi' ) ).toBe( '1' );
    })

    test("Check that the textbox removes invalid values ('1.23abcd') inputted after a change event", () => {
        const operationEl = (container.querySelector('.Q-circuit-operation' ));
        const textbox = document.querySelector( '.Q-parameter-box-input' );
        textbox.value = '1.23abcd';
        let event = new Event('change');
        textbox.dispatchEvent( event );
        expect( textbox.value ).toBe( '1' );
        expect( operationEl.getAttribute( 'phi' ) ).toBe( '1' );
    })

    test("Check that the textbox removes invalid values ('1.23/0') inputted after a change event", () => {
        const operationEl = (container.querySelector('.Q-circuit-operation' ));
        const textbox = document.querySelector( '.Q-parameter-box-input' );
        textbox.value = '1.23/0';
        let event = new Event('change');
        textbox.dispatchEvent( event );
        expect( textbox.value ).toBe( '1' );
        expect( operationEl.getAttribute( 'phi' ) ).toBe( '1' );
    })

})

/*
 * The following series of tests checks that the circuit and editor are updated upon exiting the parameter input box
 * of a gate with a single parameter
 *
 */

describe("Exiting the parameter box after changing the parameter of a single-parameter gate (PHASE)", () => {
    let operation = Q.Gate.findBySymbol( 'P' );
    document.body.innerHTML =
    '<div>' +
    '  <div id="container" />' +
    '</div>';
    let container = document.getElementById( 'container' );
    const circuit = new Q.Circuit(1, 1);
    circuit.set$( operation.symbol, 1, [1], {'phi': 1} );
    container.appendChild(circuit.toDom());
    let operationEl = (container.querySelector('.Q-circuit-operation' ));
    let clientRect = operationEl.getBoundingClientRect();
    let clientX = clientRect.left;
    let clientY = clientRect.top;
    let event = {
        'clientX' : clientX,
        'clientY' : clientY
    }
    // The following sequence is was proven valid by the previous tests.
    Q.Circuit.Editor.onDoubleclick( event, operationEl );
    const textbox = document.querySelector( '.Q-parameter-box-input' );
    textbox.value = '1.234';
    textbox.dispatchEvent( new Event( 'change' ) );
    //Mimic an exit event
    const exitButton = document.querySelector( '.Q-parameter-box-exit' );
    event = { 
        target: exitButton
    }
    Q.Circuit.Editor.onPointerPress( event );
    const parameterEl = document.querySelector( '.Q-parameters-box' )
    test("Check that pressing the exit button exits the parameter box", () => {
        expect( parameterEl.style.display ).toBe('none');
        expect( parameterEl.innerHTML ).toBe( "" );
    })

    //Checking that the circuit && editor were set with the updated values 
    test("Checking that PHASE circuit operation and editor tile were updated with the new 'phi' parameter", () => {
        //checking for operationEl again as .Editor$ is destructive
        operationEl = (container.querySelector('.Q-circuit-operation' ));
        expect( operationEl.getAttribute( 'gate-symbol' ) ).toBe( 'P' );
        expect( operationEl.getAttribute( 'phi' )).toBe( '1.234' );
        expect( circuit.operations[0].gate.symbol ).toBe( 'P' );
        expect( circuit.operations[0].gate.parameters[ 'phi' ] ).toBe( 1.234 );
    })
})

