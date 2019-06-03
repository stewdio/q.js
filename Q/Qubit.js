



Q.Qubit = function( a, b, dirac ){

	`
	A qubit is represented by Q.Matrix([ 𝒂 ],[ 𝒃 ]) where 𝒂 and 𝒃 are “complex 
	numbers” such that 𝒂 × 𝒂 + 𝒃 × 𝒃 = 1. If brevity’s your thing, that’s the 
	same as 𝒂² + 𝒃² = 1. https://en.wikipedia.org/wiki/Qubit  


	  EXAMPLE  

	  const ourQubit = new Q.Qubit( 0, 1 )  


	Our 𝒂 argument represents our qubit’s “control bit” while our 𝒃 argument 
	represents our quibit’s “target bit”—the part we are ultimately concerned 
	with. A qubit may be in superposition, ie.  its target bit is neither 0 
	or 1 and computationally exists as both 0 and 1 at the same time. The 
	probability that the qubit will “collapse” to 0 is 𝒂², while the 
	probability that the qubit will “collapse” to 1 is 𝒃². 
	https://en.wikipedia.org/wiki/Quantum_superposition   
	

		EXAMPLES  
	
	• Qubit( 1, 0 ) has a 100% chance of collapsing to 0.  
	• Qubit( 0, 1 ) has a 100% chance of collapsing to 1.  
	• Qubit( 1÷√2, 1÷√2 ) has a 50% chance of collapsing to 0 and a 50% 
	chance of collapsing to 1.  


		BLOCH SPHERE  

	If we plot all of the possible values for 𝒂 and 𝒃 on a standard graph 
	it will create a circle with a radius of 1 centered at the origin (0, 0); 
	ie. a unit circle. This is the result of our rule that 𝒂² + 𝒃² = 1. 
	https://en.wikipedia.org/wiki/Unit_circle).  
	
	             
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


	If we allow for complex numbers like 𝒊 then our 2D circle becomes a 3D 
	Bloch sphere. Our unit circle or unit sphere can be used as a state 
	machine for quantum compuation, though Q.js currently focusses on 
	matrices for calculation. 
	https://en.wikipedia.org/wiki/Bloch_sphere  
	

		CONSTANTS  

	Q.Qubit provides the following built-in Jones vectors. 
	https://en.wikipedia.org/wiki/Jones_calculus#Jones_vectors  
	• HORIZONTAL = new Q.Qubit( 1, 0 )  
	• VERTICAL   = new Q.Qubit( 0, 1 )  
	• DIAGONAL      = new Q.Qubit( 1÷√2,  1÷√2 )  
	• ANTI_DIAGONAL = new Q.Qubit( 1÷√2, -1÷√2 )  
	• RIGHT_HAND_CIRCULAR_POLARIZED = new Q.Qubit( 1÷√2, -1÷√2𝒊 )  
	• LEFT_HAND_CIRCULAR_POLARIZED  = new Q.Qubit( 1÷√2,  1÷√2𝒊 )  
	
	`


	//  If we’ve received an instance of Q.Matrix as our first argument
	//  then we’ll assume there are no further arguments
	//  and just use that matrix as our new Q.Qubit instance.

	if( Q.Matrix.isMatrixLike( a ) && b === undefined ){

		b = a.rows[ 1 ][ 0 ]
		a = a.rows[ 0 ][ 0 ]
	}
	else {


		//  All of our internal math now uses complex numbers
		//  rather than Number literals
		//  so we’d better convert!

		if( typeof a === 'number' ) a = new Q.ComplexNumber( a, 0 )
		if( typeof b === 'number' ) b = new Q.ComplexNumber( b, 0 )


		//  If we receive undefined (or garbage inputs)
		//  let’s try to make it useable.
		//  This way we can always call Q.Qubit with no arguments
		//  to make a new qubit available for computing with.

		if( a instanceof Q.ComplexNumber !== true ) a = new Q.ComplexNumber( 1, 0 )
		if( b instanceof Q.ComplexNumber !== true ){

			b = Q.ComplexNumber.ONE.subtract( a.multiply( a )).squareRoot()
		}
	}


	//  Fuzzy math! Thanks floating point numbers...

	//  I am DEEPLY WORRIED that for R> and L> we need to take the absolute value.
	//  Doesn’t that destroy our assertion that 𝒂² + 𝒃² = 1?!?!
	//  if( a.multiply( a ).add( b.multiply( b )).subtract( 1 ).isEqualTo( 0 ) === false )
	if( a.multiply( a ).absolute() + b.multiply( b ).absolute() - 1 > Q.EPSILON )
	 	return Q.error( `Q.Qubit could not accept the initialization values of a=${a} and b=${b} because their squares do not add up to 1.` )	

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


	//  Used for Dirac notation: |?⟩

	if( typeof dirac === 'string' ) this.dirac = dirac
	else {

		const found = Object.values( Q.Qubit.constants ).find( function( qubit ){

			return (

				a === qubit.controlBit && 
				b === qubit.targetBit
			)
		})
		if( found === undefined ) this.dirac = '?'
		else {

			this.dirac = found.dirac
			this.name  = found.name
		}
	}
}
Q.Qubit.prototype = Object.create( Q.Matrix.prototype )
Q.Qubit.prototype.constructor = Q.Qubit




Object.assign( Q.Qubit, {

	index: 0,
	help: function(){ return Q.help( this )},
	constants: {},
	createConstant: function( key, value ){

		Q.Qubit[ key ] = value
		Q.Qubit[ key ].name = key
		Q.Qubit.constants[ key ] = Q.Qubit[ key ]
		Object.freeze( Q.Qubit[ key ])
	},
	createConstants: Q.createConstants,
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


	//  Opposing pairs:
	//  |H⟩ and |V⟩
	//  |D⟩ and |A⟩
	//  |R⟩ and |L⟩

	'HORIZONTAL', new Q.Qubit( 1, 0, 'H' ),//  ZERO.
	'VERTICAL',   new Q.Qubit( 0, 1, 'V' ),//  ONE.
	'DIAGONAL',      new Q.Qubit( Math.SQRT1_2,  Math.SQRT1_2, 'D' ),
	'ANTI_DIAGONAL', new Q.Qubit( Math.SQRT1_2, -Math.SQRT1_2, 'A' ),
	'RIGHT_HAND_CIRCULAR_POLARIZED', new Q.Qubit( Math.SQRT1_2, new Q.ComplexNumber( 0, -Math.SQRT1_2 ), 'R' ),//  RHCP
	'LEFT_HAND_CIRCULAR_POLARIZED',  new Q.Qubit( Math.SQRT1_2, new Q.ComplexNumber( 0,  Math.SQRT1_2 ), 'L' ) //  LHCP
)




Object.assign( Q.Qubit.prototype, {

	copy$: function( matrix ){

		if( Q.Matrix.isMatrixLike( matrix ) !== true )
			return Q.error( `Q.Qubit attempted to copy something that was not a matrix in this qubit #${qubit.index}.`, this )

		if( Q.Matrix.haveEqualDimensions( matrix, this ) !== true )
			return Q.error( `Q.Qubit cannot copy matrix#${matrix.index} of dimensions ${matrix.columns.length}x${matrix.rows.length} in to this qubit #${this.index} of dimensions ${this.columns.length}x${this.rows.length} because their dimensions do not match.`, this )
		
		const that = this
		matrix.rows.forEach( function( row, r ){

			row.forEach( function( n, c ){

				that.rows[ r ][ c ] = n
			})
		})
		this.dirac = matrix.dirac
		return this
	},
	isEqualTo: function( otherQubit ){

		return ( 

			otherQubit instanceof Q.Qubit &&
			this.controlBit === otherQubit.controlBit &&
			this.targetBit  === otherQubit.targetBit 
		)
	},
	collapse: function(){

		return Q.Qubit.collapse( this )
	},
	collapse$: function(){
		
		this.copy$( Q.Qubit.collapse( this ))
		return this
	}
})



