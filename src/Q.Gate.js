'strict'


/*



unclear to me at this point if better for Gate to extend Matrix
or for Gate to just have a .matrix property

probably the latter...



*/
Q.Gate = function( matrix ){

	`
	
		SEE ALSO
	
	https://en.wikipedia.org/wiki/Quantum_logic_gate
	`

	Q.Matrix.call( this )
	this.index = Q.Gate.index ++


	const domElement = document.createElement( 'div' )
	domElement.classList.add( 'qc-gate' )
	domElement.innerHTML = '[]'
	Q.domElement.appendChild( domElement )

	

	this.domElement = domElement

	/*
	when hover over a gate we should see popup info about its state

	*/

}


//  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain

Q.Gate.prototype = Q.Matrix.prototype
Q.Gate.constructor = Q.Gate





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



