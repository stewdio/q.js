



/*


Thinking that Gate might not be able to extend Matrix...
That it needs to be its own thing that contains .matrix
and we can have MULTIPLE inputs
AND MULTIPLE outputs
so we can do that trick to make our gates always reversible. 


*/


Q.Gate = function( matrix ){

	`
	
		SEE ALSO
	
	https://en.wikipedia.org/wiki/Quantum_logic_gate
	`

	Q.Matrix.call( this, ...matrix.rows )
	this.index = Q.Gate.index ++
	

	//  We need to be able to see and interact with this thing.

	const domElement = document.createElement( 'div' )
	domElement.classList.add( 'qc-gate' )
	domElement.innerHTML = '[]'
	Q.domElement.appendChild( domElement )
	this.domElement = domElement

	/*


	Gate needs to have a location! 
	inputs!
	outputs!


	*/
}
Q.Gate.prototype = Q.Matrix.prototype
//Q.Gate.constructor = Q.Gate




Object.assign( Q.Gate, {

	index: 0,
	createConstant: function( key, value ){

		Q.Gate[ key ] = value
		Object.freeze( Q.Gate[ key ])
	},
	createConstants: function(){

		if( arguments.length % 2 !== 0 ){

			return Q.error( 'Q.Gate attempted to create constants with invalid (KEY, VALUE) pairs.' )
		}
		for( let i = 0; i < arguments.length; i += 2 ){

			Q.Gate.createConstant( arguments[ i ], arguments[ i + 1 ])
		}
	}
})




Q.Gate.createConstants(


	//  Hadamard
	//   ┌───┐
	//  ─┤ H ├─
	//   └───┘

	'HADAMARD', new Q.Gate( Q.Matrix.HADAMARD ),


	//  Pauli X
	//   ┌───┐
	//  ─┤ X ├─
	//   └───┘

	'PAULI_X', new Q.Gate( Q.Matrix.PAULI_X ),


	//  Pauli Y
	//   ┌───┐
	//  ─┤ Y ├─
	//   └───┘

	// 'PAULI_Y', new Q.Gate( Q.Matrix.PAULI_Y ),


	//  Pauli Z
	//   ┌───┐
	//  ─┤ Z ├─
	//   └───┘

	'PAULI_Z', new Q.Gate( Q.Matrix.PAULI_Z ),


	//  Phase
	//   ┌───┐
	//  ─┤ S ├─
	//   └───┘

	// 'PHASE', new Q.Gate( Q.Matrix.PHASE ),


	//  π / 8
	//   ┌───┐
	//  ─┤ T ├─
	//   └───┘

	// 'PI_8', new Q.Gate( Q.Matrix.PI_8 ),




	'CONTROLLED_NOT', new Q.Gate( Q.Matrix.CONTROLLED_NOT ),
	'SWAP', new Q.Gate( Q.Matrix.SWAP ),
	'CONTROLLED_Z', new Q.Gate( Q.Matrix.CONTROLLED_Z ),
	// 'CONTROLLED_PHASE', new Q.Gate( Q.Matrix.PHASE ),
	'TOFFOLI', new Q.Gate( Q.Matrix.TOFFOLI ),
	'CONTROLLED_SWAP', new Q.Gate( Q.Matrix.CONTROLLED_SWAP )
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



