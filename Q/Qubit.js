'strict'




Q.Qubit = function( a, b ){

	`
	  A qubit is represented by Q.Matrix([ a ],[ b ])
	  where ‘a’ and ‘b’ are (ideally) complex numbers 
	  such that a² + b² = 1. 

	 ‘a’ represents the “control bit” while ‘b’ represents
	  the “target bit.” A qubit may be in superposition, ie.
	  its target bit is neither 0 or 1 and computationally
	  exists as BOTH 0 and 1 at the same time. The probability
	  that the qubit will “collapse” to 0 is a², while the
	  probability that the qubit will “collapse” to 1 is b².


		EXAMPLES

	• Qubit( 1, 0 ) has a 100% chance of collapsing to 0.
	• Qubit( 0, 1 ) has a 100% chance of collapsing to 1.
	• Qubit( 1÷√2, 1÷√2 ) has a 50% chance of collapsing to 0
	  and a 50% chance of collapsing to 1.


		BLOCH SPHERE

	  If we plot all of the possible values for ‘a’ and ‘b’ 
	  on a standard graph it will create a circle with a radius 
	  of 1, centered at the origin (0, 0) -- a unit circle.
	  This is the visual result of our rule that a² + b² = 1:

	             
	               ( 0, 1 )  Vertical
	                   │
	   ( -1÷√2, 1÷√2 ) │ ( 1÷√2, 1÷√2 )  Diagonal
	                ╲  │  ╱
	                 ╲ │ ╱
	                  ╲│╱
	  ( -1, 0 )────────╳────────( 1, 0 )  Horizontal
	                  ╱│╲
	                 ╱ │ ╲
	                ╱  │  ╲
	  ( -1÷√2, -1÷√2 ) │ ( 1÷√2, -1÷√2 )  Anti-diagonal
	                   │
	                   │
	               ( 0, -1 )


	  If we allow complex numbers like ‘i’ (√-1) then our 
	  2D circle becomes a 3D sphere like so:
	  https://en.wikipedia.org/wiki/Bloch_sphere
	  For our current (simple) purposes we can use real numbers 
	  and a 2D unit circle.

	  Our unit circle or unit sphere can be used as a state 
	  machine for quantum compuation.
	
	`

	if( Q.Matrix.isMatrixLike( a )){

		b = a.rows[ 1 ][ 0 ]
		a = a.rows[ 0 ][ 0 ]
	}
	else {

		if( typeof a !== 'number' ) a = 1
		if( typeof b !== 'number' ) b = Math.sqrt( 1 - Math.pow( a, 2 ))
	}


	//  Fuzzy math! Thanks floating point numbers...

	const 
	n = Math.pow( a, 2 ) + Math.pow( b, 2 ),
	t = Number.EPSILON * 2

	if( Math.abs( n - 1 ) > t )
		return Q.error( `Q.Qubit could not accept the initialization values of a=${a} and b=${b} for qbit${this.index} because their squares do not add up to 1.` )	

	Q.Matrix.call( this, [ a ],[ b ])
	this.index = Q.Qubit.index ++


	//  Convenience getters and setters for this qubit’s
	//  controll bit and target bit.

	Object.defineProperty( this, 'controlBit', { 

		get: function(){ return this.rows[ 0 ][ 0 ]},
		set: function( n ){ this.rows[ 0 ][ 0 ] = n }
	})
	Object.defineProperty( this, 'targetBit', { 

		get: function(){ return this.rows[ 1 ][ 0 ]},
		set: function( n ){ this.rows[ 1 ][ 0 ] = n }
	})
}
Q.Qubit.prototype = Object.create( Q.Matrix.prototype )
Q.Qubit.prototype.constructor = Q.Qubit




Object.assign( Q.Qubit, {

	index: 0,
	createConstant: function( key, value ){

		Q.Qubit[ key ] = value
		Object.freeze( Q.Qubit[ key ])
	},
	createConstants: function(){

		if( arguments.length % 2 !== 0 ){

			return Q.error( 'Q.Qubit attempted to create constants with invalid (KEY, VALUE) pairs.' )
		}
		for( let i = 0; i < arguments.length; i += 2 ){

			Q.Qubit.createConstant( arguments[ i ], arguments[ i + 1 ])
		}
	},
	collapse: function( qubit ){

		const 
		a2 = Math.pow( qubit.rows[ 0 ][ 0 ], 2 ),
		randomNumberRange = Math.pow( 2, 32 ) - 1,
		randomNumber = new Uint32Array( 1 )
				
		window.crypto.getRandomValues( randomNumber )
		const randomNumberNormalized = randomNumber / randomNumberRange

		if( randomNumberNormalized <= a2 ){

			return new Q.Qubit( 1, 0 )
		}
		else return new Q.Qubit( 0, 1 )
	}
})




Q.Qubit.createConstants(

	'HORIZONTAL', new Q.Qubit( 1, 0 ),//  ZERO.
	'VERTICAL', new Q.Qubit( 0, 1 ),//  ONE.
	'DIAGONAL', new Q.Qubit( Math.SQRT1_2,  Math.SQRT1_2 ),
	'ANTI_DIAGONAL', new Q.Qubit( Math.SQRT1_2, -Math.SQRT1_2 )
	/*


	We want to actually operate off the unit circle
	or BLOCH SPHERE!

	https://en.wikipedia.org/wiki/Bloch_sphere
	https://en.wikipedia.org/wiki/Jones_calculus#Jones_vectors


	Horizontal 
	.dirac = '|H⟩'
	.ket = 'H'
	.jones = Q.Matrix(
		[ 1 ],
		[ 0 ])

	Vertical
	.dirac = '|V⟩'
	.ket = 'V'
	.jones = Q.Matrix(
		[ 0 ],
		[ 1 ])


	Diagonal
	.dirac = '|D⟩'
	L+45
	.ket = 'D'
	.jones = Q.Matrix(
		[ 1 ],
		[ 1 ]).multiplyScalar( 1 / Math.SQRT2 )

	Anti-diagonal
	.dirac = '|A⟩'
	L-45
	.ket = 'A'
	.jones = Q.Matrix(
		[  1 ],
		[ -1 ]).multiplyScalar( 1 / Math.SQRT2 )


	Right-hand circular polarized (RHCP)
	.dirac = '|R⟩'
	.ket = 'R'
	.jones = Q.Matrix(
		[  1 ],
		[ -i ]).multiplyScalar( 1 / Math.SQRT2 )

	Left-hand circular polarized (RHCP)
	.dirac = '|L⟩'
	.ket = 'L'
	.jones = Q.Matrix(
		[  1 ],
		[ +i ]).multiplyScalar( 1 / Math.SQRT2 )



	Opposing pairs:
	| H ⟩ and | V ⟩
	| D ⟩ and | A ⟩
	| R ⟩ and | L ⟩



	*/
)




Object.assign( Q.Qubit.prototype, {

	collapse: function(){

		return Q.Qubit.collapse( this )
	},
	collapse$: function(){
		
		this.copy$( Q.Qubit.collapse( this ))
		return this
	}
})



