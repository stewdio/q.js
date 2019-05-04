'strict'




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
}
Q.Gate.prototype = Q.Matrix.prototype
//Q.Qubit.constructor = Q.Qubit




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

	'CNOT', new Q.Gate( Q.Matrix.CNOT ),
	'HADAMARD', new Q.Gate( Q.Matrix.HADAMARD )
	//Pauli-X
	//Pauli-Y
	//Pauli-Z
	//etc

)




Object.assign( Q.Gate.prototype, {

	destroy: function(){

		// this.domElement.parent.removeChild( this.domElement )
	},
	apply: function(){

		Array.from( arguments ).forEach( function(){})
		return this
	}
})



