'strict'




Q.Gate = function( matrix ){

	`
	
		SEE ALSO
	
	https://en.wikipedia.org/wiki/Quantum_logic_gate
	`

	const domElement = document.createElement( 'div' )
	domElement.classList.add( 'qc-gate' )
	domElement.innerHTML = '[]'
	Q.domElement.appendChild( domElement )

	this.index = Q.Gate.index
	Q.Gate.index += 1



	/*
	when hover over a gate we should see popup info about its state

	*/

}



Object.assign( Q.Gate, {

	index: 0,
	createConstant: function( key, value ){

		Q.Gate[ key ] = value
		Object.freeze( Q.Gate[ key ])
	},
	createConstants: function(){

		if( arguments.length % 2 !== 0 ){

			Q.error( 'Attempted to create constants with invalid (KEY, VALUE) pairs.' )
			return
		}
		for( let i = 0; i < arguments.length; i += 2 ){

			Q.Gate.createConstant( arguments[ i ], arguments[ i + 1 ])
		}
	}
})




Q.Gate.createConstants(

	'CNOT', new Q.Gate( Q.Matrix.CNOT ),
	'H', new Q.Gate()//  Hadamard
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



