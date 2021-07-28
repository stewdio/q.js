/* 
 *@jest-environment jsdom
 */
const {Circuit} = require('../Q-Circuit');

console.log(window == global ? "true": "false");
window.addEventListener( 'Q.Circuit.evaluate completed', function( event ) {
    console.log("event heard");
    console.log(event.detail.circuit.report$());
})
test('trivial', ()=> expect(1).toBe(1));
test("creating a basic circuit with only a hadamard", () => {
    let circuit = new Circuit(3, 3);

    circuit.set$('H', 1, 1);
    // console.log(circuit.toDiagram());
    // console.log(circuit.toAmazonBraket());
    circuit.evaluate$();
    expect(1).toBe(1);
})