



/*


Thinking that Gate might not be able to extend Matrix...
That it needs to be its own thing that contains .matrix
and we can have MULTIPLE inputs
AND MULTIPLE outputs
so we can do that trick to make our gates always reversible. 


*/


Q.Gate = function(){

	`
	
		SEE ALSO
	
	https://en.wikipedia.org/wiki/Quantum_logic_gate
	`

	Q.Matrix.apply( this, arguments )
	this.index = Q.Gate.index ++
	

	//  We need to be able to see and interact with this thing.

	// const domElement = document.createElement( 'div' )
	// domElement.classList.add( 'qc-gate' )
	// domElement.innerHTML = '[]'
	// Q.domElement.appendChild( domElement )
	// this.domElement = domElement

	/*


	Gate needs to have a location! 
	inputs!
	outputs!


	*/
}
Q.Gate.prototype = Q.Matrix.prototype
Q.Gate.constructor = Q.Gate




Object.assign( Q.Gate, {

	index: 0,
	help: function(){ return Q.help( this )},
	constants: {},
	createConstant: Q.createConstant,
	createConstants: Q.createConstants
})




Q.Gate.createConstants(


	//  Hadamard
	//   ┌───┐
	//  ─┤ H ├─
	//   └───┘

	'HADAMARD', new Q.Gate(
		[ Math.SQRT1_2,  Math.SQRT1_2 ],
		[ Math.SQRT1_2, -Math.SQRT1_2 ]),


	//  Pauli X
	//   ┌───┐
	//  ─┤ X ├─
	//   └───┘

	'PAULI_X', new Q.Gate(
		[ 0, 1 ],
		[ 1, 0 ]),


	//  Pauli Y
	//   ┌───┐
	//  ─┤ Y ├─
	//   └───┘

	'PAULI_Y', new Q.Gate(
		[ 0, new Q.ComplexNumber( 0, -1 )],
		[ new Q.ComplexNumber( 0, 1 ),  0 ]),


	//  Pauli Z
	//   ┌───┐
	//  ─┤ Z ├─
	//   └───┘

	'PAULI_Z', new Q.Gate(
		[ 1,  0 ],
		[ 0, -1 ]),


	//  Phase
	//   ┌───┐
	//  ─┤ S ├─
	//   └───┘

	'PHASE', new Q.Gate(
		[ 1, 0 ],
		[ 0, new Q.ComplexNumber( 0, 1 )]),


	//  π / 8
	//   ┌───┐
	//  ─┤ T ├─
	//   └───┘

	'PI_8', new Q.Gate(
		[ 1, 0 ],
		[ 0, Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, Math.PI / 4 )) ]),




	'CONTROLLED_NOT', new Q.Gate(//  C-NOT
		[ 1, 0, 0, 0 ],
		[ 0, 1, 0, 0 ],
		[ 0, 0, 0, 1 ],
		[ 0, 0, 1, 0 ]),

	'SWAP', new Q.Gate(
		[ 1, 0, 0, 0 ],
		[ 0, 0, 1, 0 ],
		[ 0, 1, 0, 0 ],
		[ 0, 0, 0, 1 ]),

	'CONTROLLED_Z', new Q.Gate(
		[ 1, 0, 0,  0 ],
		[ 0, 1, 0,  0 ],
		[ 0, 0, 1,  0 ],
		[ 0, 0, 0, -1 ]),

	'CONTROLLED_PHASE', new Q.Gate(
		[ 1, 0, 0, 0 ],
		[ 0, 1, 0, 0 ],
		[ 0, 0, 1, 0 ],
		[ 0, 0, 0, new Q.ComplexNumber( 0, 1 )]),

	'TOFFOLI', new Q.Gate(
		[ 1, 0, 0, 0, 0, 0, 0, 0 ],
		[ 0, 1, 0, 0, 0, 0, 0, 0 ],
		[ 0, 0, 1, 0, 0, 0, 0, 0 ],
		[ 0, 0, 0, 1, 0, 0, 0, 0 ],
		[ 0, 0, 0, 0, 1, 0, 0, 0 ],
		[ 0, 0, 0, 0, 0, 1, 0, 0 ],
		[ 0, 0, 0, 0, 0, 0, 0, 1 ],
		[ 0, 0, 0, 0, 0, 0, 1, 0 ]),

	'CONTROLLED_SWAP', new Q.Gate(//  Fredkin
		[ 1, 0, 0, 0, 0, 0, 0, 0 ],
		[ 0, 1, 0, 0, 0, 0, 0, 0 ],
		[ 0, 0, 1, 0, 0, 0, 0, 0 ],
		[ 0, 0, 0, 1, 0, 0, 0, 0 ],
		[ 0, 0, 0, 0, 1, 0, 0, 0 ],
		[ 0, 0, 0, 0, 0, 0, 1, 0 ],
		[ 0, 0, 0, 0, 0, 1, 0, 0 ],
		[ 0, 0, 0, 0, 0, 0, 0, 1 ])
)




Object.assign( Q.Gate.prototype, {

	destroy: function(){

		// this.domElement.parent.removeChild( this.domElement )
	},
	applyTo: function( qubit ){

		//Array.from( arguments ).forEach( function(){})
		return new Q.Qubit( this.multiply( qubit ))
	}
})



