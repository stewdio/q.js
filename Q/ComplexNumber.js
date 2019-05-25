



Q.ComplexNumber = function( real, imaginary ){

	`
	The set of “real numbers” (ℝ) contains any number that can be expressed 
	along an infinite timeline. https://en.wikipedia.org/wiki/Real_number  

	  …  -3  -2  -1   0  +1  +2  +3   …  
	  ┄───┴───┴───┴───┴───┴─┬─┴──┬┴┬──┄  
	                       √2    𝒆 π  


	Meanwhile, “imaginary numbers” (𝕀) consist of a real (ℝ) multiplier and 
	the symbol 𝒊, which is the impossible solution to the equation 𝒙² = −1. 
	Note that no number when multiplied by itself can ever result in a 
	negative product, but the concept of 𝒊 gives us a way to reason around 
	this imaginary scenario nonetheless. 
	https://en.wikipedia.org/wiki/Imaginary_number  

	  …  -3𝒊 -2𝒊  -1𝒊  0𝒊  +1𝒊 +2𝒊 +3𝒊  …  
	  ┄───┴───┴───┴───┴───┴───┴───┴───┄  


	A “complex number“ (ℂ) is a number that can be expressed in the form 
	𝒂 + 𝒃𝒊, where 𝒂 is the real component (ℝ) and 𝒃𝒊 is the imaginary 
	component (𝕀). https://en.wikipedia.org/wiki/Complex_number  


	Operation functions on Q.ComplexNumber instances generally accept as 
	arguments both sibling instances and pure Number instances, though the 
	value returned is always an instance of Q.ComplexNumber.

	`

	if( real instanceof Q.ComplexNumber ){

		real = Q.ComplexNumber.real
		imaginary = Q.ComplexNumber.imaginary
		Q.warn( 'Q.ComplexNumber tried to create a new instance with an argument that is already a Q.ComplexNumber — and that’s weird!' )
	}
	if( imaginary === undefined ) imaginary = 0
	if( Q.ComplexNumber.isNumberLike( real ) !== true || 
		Q.ComplexNumber.isNumberLike( imaginary ) !== true )
		return Q.error( 'Q.ComplexNumber attempted to create a new instance but the arguments provided were not actual numbers.' )

	this.real = real
	this.imaginary = imaginary	
	this.index = Q.ComplexNumber.index ++
}




Object.assign( Q.ComplexNumber, {

	index: 0,
	isNumberLike: function( n ){

		return typeof n === 'number' || n instanceof Number
	},
	conjugate: function( n ){

		return new Q.ComplexNumber( n.real, n.imaginary * -1 )
	},
	operate: function( 
		
		name,
		n0,
		n1,
		numberAndNumber,
		numberAndComplex,
		complexAndNumber,
		complexAndComplex ){

		if( Q.ComplexNumber.isNumberLike( n0 )){

			if( Q.ComplexNumber.isNumberLike( n1 )) return numberAndNumber( n0, n1 )
			else if( n1 instanceof Q.ComplexNumber ) return numberAndComplex( n0, n1 )
			else return Q.error( 'Q.ComplexNumber attempted to', name, 'with the number', n0, 'and something that is neither a Number or Q.ComplexNumber:', n1 )
		}
		else if( n0 instanceof Q.ComplexNumber ){

			if( Q.ComplexNumber.isNumberLike( n1 )) return complexAndNumber( n0, n1 )
			else if( n1 instanceof Q.ComplexNumber ) return complexAndComplex( n0, n1 )
			else return Q.error( 'Q.ComplexNumber attempted to', name, 'with the complex number', n0, 'and something that is neither a Number or Q.ComplexNumber:', n1 )
		}
		else return Q.error( 'Q.ComplexNumber attempted to', name, 'with something that is neither a Number or Q.ComplexNumber:', n0 )
	},
	multiply: function( n0, n1 ){
		
		return Q.ComplexNumber.operate(

			'multiply', n0, n1,
			function( n0, n1 ){
				
				return new Q.ComplexNumber( n0 * n1 )
			},
			function( n0, n1 ){

				return new Q.ComplexNumber( 

					n0 * n1.real,
					n0 * n1.imaginary
				)
			},
			function( n0, n1 ){

				return new Q.ComplexNumber( 

					n0.real * n1,
					n0.imaginary * n1
				)
			},
			function( n0, n1 ){


				//  FOIL Method that shit.
				//  https://en.wikipedia.org/wiki/FOIL_method

				const
				firsts = n0.real * n1.real,
				outers = n0.real * n1.imaginary,
				inners = n0.imaginary * n1.real,				
				lasts  = n0.imaginary * n1.imaginary * -1//  Because i² = -1.
				
				return new Q.ComplexNumber( 

					firsts + lasts,
					outers + inners
				)
			}
		)
	},
	divide: function( n0, n1 ){

		return Q.ComplexNumber.operate(

			'multiply', n0, n1,
			function( n0, n1 ){
				
				return new Q.ComplexNumber( n0 / n1 )
			},
			function( n0, n1 ){

				return new Q.ComplexNumber( n0 ).divide( n1 )
			},
			function( n0, n1 ){

				return new Q.ComplexNumber( 

					n0.real / n1,
					n0.imaginary / n1
				)
			},
			function( n0, n1 ){


				//  Ermergerd I had to look this up because it’s been so long.
				//  https://www.khanacademy.org/math/precalculus/imaginary-and-complex-numbers/complex-conjugates-and-dividing-complex-numbers/a/dividing-complex-numbers-review

				const 
				conjugate   = n1.conjugate(),
				numerator   = n0.multiply( conjugate ),
				denominator = n1.multiply( conjugate ).real

				return numerator.divide( denominator )
			}
		)
	},
	add: function( n0, n1 ){
		
		return Q.ComplexNumber.operate(

			'add', n0, n1,
			function( n0, n1 ){

				return new Q.ComplexNumber( n0 + n1 )
			},
			function( n0, n1 ){

				return new Q.ComplexNumber(

					n1.real + n0,
					n1.imaginary
				)
			},
			function( n0, n1 ){

				return new Q.ComplexNumber(

					n0.real + n1,
					n0.imaginary
				)
			},
			function( n0, n1 ){

				return new Q.ComplexNumber(

					n0.real + n1.real,
					n0.imaginary + n1.imaginary
				)
			}
		)
	},
	subtract: function( n0, n1 ){

		return Q.ComplexNumber.operate(

			'subtract', n0, n1,
			function( n0, n1 ){

				return new Q.ComplexNumber( n0 + n1 )
			},
			function( n0, n1 ){

				return new Q.ComplexNumber(

					n1.real - n0,
					n1.imaginary
				)
			},
			function( n0, n1 ){

				return new Q.ComplexNumber(

					n0.real - n1,
					n0.imaginary
				)
			},
			function( n0, n1 ){

				return new Q.ComplexNumber(

					n0.real - n1.real,
					n0.imaginary - n1.imaginary
				)
			}
		)
	}
})




Object.assign( Q.ComplexNumber.prototype, {


	//  NON-destructive operations.

	clone: function(){

		return new Q.ComplexNumber( this.real, this.imaginary )
	},
	reduce: function(){

		
		//  Note: this *might* kill function chaining.

		if( this.imaginary === 0 ) return this.real
		return this
	},
	conjugate: function(){

		return Q.ComplexNumber.conjugate( this )
	},
	multiply: function( otherComplexNumber ){

		return Q.ComplexNumber.multiply( this, otherComplexNumber )
	},
	divide: function( otherComplexNumber ){

		return Q.ComplexNumber.divide( this, otherComplexNumber )
	},
	add: function( otherComplexNumber ){

		return Q.ComplexNumber.add( this, otherComplexNumber )
	},
	subtract: function( otherComplexNumber ){

		return Q.ComplexNumber.subtract( this, otherComplexNumber )
	},
	toString: function(){

		
		//  Note: this kills function chaining.
		
		const reduced = this.reduce()
		if( Q.ComplexNumber.isNumberLike( reduced )) return ''+ reduced//  Because we promised a String!
		if( reduced.real === 0 ){

			return ( reduced.imaginary === 1 ? 'i' : reduced.imaginary +'i' )
		}
		return ''+ reduced.real +' '+ ( reduced.imaginary >= 0 ? '+' : '-' ) +' '+ Math.abs( reduced.imaginary ) +'i'
	},


	//  DESTRUCTIVE operations.

	copy$: function( otherComplexNumber ){
		
		if( otherComplexNumber instanceof Q.ComplexNumber !== true )
			return Q.error( `Q.ComplexNumber attempted to copy something that was not a complex number in to this complex number #${this.index}.`, this )
		
		this.real = otherComplexNumber.real
		this.imaginary = otherComplexNumber.imaginary
		return this
	},
	conjugate$: function(){

		return this.copy( this.conjugate() )
	},
	multiply$: function( otherComplexNumber ){

		return this.copy$( this.multiply( otherComplexNumber ))
	},
	divide$: function( otherComplexNumber ){

		return this.copy$( this.divide( otherComplexNumber ))
	},
	add$: function( otherComplexNumber ){

		return this.copy$( this.add( otherComplexNumber ))
	},
	subtract$: function( otherComplexNumber ){

		return this.copy$( this.subtract( otherComplexNumber ))
	}
})



