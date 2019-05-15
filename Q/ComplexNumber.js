'strict'




Q.ComplexNumber = function( real, imaginary ){

	`
	A complex number is a number that can be expressed in the 
	form a + bi, where a and b are real numbers, and i is a 
	solution of the equation x2 = −1. Because no real number 
	satisfies this equation, i is called an imaginary number. 
	For the complex number a + bi, a is called the real part, 
	and b is called the imaginary part.

	Operations on Q.ComplexNumber instances generally accept
	as arguments both sibling instances and pure Number instances
	but the value returned is always an instance of Q.ComplexNumber.


		SEE ALSO

	https://en.wikipedia.org/wiki/Complex_number

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
	toString: function( n ){

		return ''+ n.real +' '+ ( n.imaginary >= 0 ? '+' : '-' ) +' '+ Math.abs( n.imaginary ) +'i'
	},
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

		return Q.ComplexNumber.toString( this )//  Note: this kills function chaining.
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



