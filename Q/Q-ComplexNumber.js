
//  Copyright © 2019–2020, Stewart Smith. See LICENSE for details.




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

		imaginary = real.imaginary
		real = real.real
		Q.warn( 'Q.ComplexNumber tried to create a new instance with an argument that is already a Q.ComplexNumber — and that’s weird!' )
	}
	else if( real === undefined ) real = 0
	if( imaginary === undefined ) imaginary = 0
	if(( Q.ComplexNumber.isNumberLike( real ) !== true && isNaN( real ) !== true ) || 
	   ( Q.ComplexNumber.isNumberLike( imaginary ) !== true && isNaN( imaginary ) !== true ))
		return Q.error( 'Q.ComplexNumber attempted to create a new instance but the arguments provided were not actual numbers.' )

	this.real = real
	this.imaginary = imaginary
	this.index = Q.ComplexNumber.index ++
}




Object.assign( Q.ComplexNumber, {

	index: 0,
	help: function(){ return Q.help( this )},
	constants: {},
	createConstant: Q.createConstant,
	createConstants: Q.createConstants,




	toText: function( rNumber, iNumber, roundToDecimal, padPositive ){


		//  Should we round these numbers?
		//  Our default is yes: to 3 digits.
		//  Otherwise round to specified decimal.

		if( typeof roundToDecimal !== 'number' ) roundToDecimal = 3
		const factor = Math.pow( 10, roundToDecimal )
		rNumber = Math.round( rNumber * factor ) / factor
		iNumber = Math.round( iNumber * factor ) / factor


		//  Convert padPositive 
		//  from a potential Boolean
		//  to a String.
		//  If we don’t receive a FALSE
		//  then we’ll pad the positive numbers.

		padPositive = padPositive === false ? '' : ' '


		//  We need the absolute values of each.

		let
		rAbsolute = Math.abs( rNumber ),
		iAbsolute = Math.abs( iNumber )


		//  And an absolute value string.

		let
		rText = rAbsolute.toString(),
		iText = iAbsolute.toString()


		//  Is this an IMAGINARY-ONLY number?
		//  Don’t worry: -0 === 0.

		if( rNumber === 0 ){

			if( iNumber ===  Infinity ) return padPositive +'∞i'
			if( iNumber === -Infinity ) return '-∞i'
			if( iNumber ===  0 ) return padPositive +'0'
			if( iNumber === -1 ) return '-i'
			if( iNumber ===  1 ) return padPositive +'i'
			if( iNumber >=   0 ) return padPositive + iText +'i'
			if( iNumber <    0 ) return '-'+ iText +'i'
			return iText +'i'//  NaN
		}
		

		//  This number contains a real component
		//  and may also contain an imaginary one as well.

		if( rNumber ===  Infinity ) rText = padPositive +'∞'
		else if( rNumber === -Infinity ) rText = '-∞'
		else if( rNumber >= 0 ) rText = padPositive + rText
		else if( rNumber <  0 ) rText = '-'+ rText

		if( iNumber ===  Infinity ) return rText +' + ∞i'
		if( iNumber === -Infinity ) return rText +' - ∞i'
		if( iNumber ===  0 ) return rText
		if( iNumber === -1 ) return rText +' - i'
		if( iNumber ===  1 ) return rText +' + i'
		if( iNumber >    0 ) return rText +' + '+ iText +'i'
		if( iNumber <    0 ) return rText +' - '+ iText +'i'
		return rText +' + '+ iText +'i'//  NaN
	},




	isNumberLike: function( n ){

		return isNaN( n ) === false && ( typeof n === 'number' || n instanceof Number )
	},
	isNaN: function( n ){
		
		return isNaN( n.real ) || isNaN( n.imaginary )
	},
	isZero: function( n ){

		return ( n.real === 0 || n.real === -0 ) &&
		       ( n.imaginary === 0 || n.imaginary === -0 )
	},
	isFinite: function( n ){

		return isFinite( n.real ) && isFinite( n.imaginary )
	},
	isInfinite: function( n ){
	
		return !( this.isNaN( n ) || this.isFinite( n ))
	},
	areEqual: function( a, b ){

		return Q.ComplexNumber.operate(

			'areEqual', a, b,
			function( a, b ){
				
				return Math.abs( a - b ) < Q.EPSILON
			},
			function( a, b ){

				return (

					Math.abs( a - b.real ) < Q.EPSILON &&
					Math.abs( b.imaginary ) < Q.EPSILON
				)
			},
			function( a, b ){

				return (

					Math.abs( a.real - b ) < Q.EPSILON &&
					Math.abs( a.imaginary ) < Q.EPSILON
				)
			},
			function( a, b ){

				return ( 
		
					Math.abs( a.real - b.real ) < Q.EPSILON &&
					Math.abs( a.imaginary - b.imaginary ) < Q.EPSILON
				)
			}
		)
	},




	absolute: function( n ){
	
		return Q.hypotenuse( n.real, n.imaginary )
	},
	conjugate: function( n ){

		return new Q.ComplexNumber( n.real, n.imaginary * -1 )
	},
	operate: function( 
		
		name,
		a,
		b,
		numberAndNumber,
		numberAndComplex,
		complexAndNumber,
		complexAndComplex ){

		if( Q.ComplexNumber.isNumberLike( a )){

			if( Q.ComplexNumber.isNumberLike( b )) return numberAndNumber( a, b )
			else if( b instanceof Q.ComplexNumber ) return numberAndComplex( a, b )
			else return Q.error( 'Q.ComplexNumber attempted to', name, 'with the number', a, 'and something that is neither a Number or Q.ComplexNumber:', b )
		}
		else if( a instanceof Q.ComplexNumber ){

			if( Q.ComplexNumber.isNumberLike( b )) return complexAndNumber( a, b )
			else if( b instanceof Q.ComplexNumber ) return complexAndComplex( a, b )
			else return Q.error( 'Q.ComplexNumber attempted to', name, 'with the complex number', a, 'and something that is neither a Number or Q.ComplexNumber:', b )
		}
		else return Q.error( 'Q.ComplexNumber attempted to', name, 'with something that is neither a Number or Q.ComplexNumber:', a )
	},	




	sine: function( n ){

		const
		a = n.real,
		b = n.imaginary
		
		return new Q.ComplexNumber(
		
			Math.sin( a ) * Q.hyperbolicCosine( b ),
			Math.cos( a ) * Q.hyperbolicSine( b )
		)
	},
	cosine: function( n ){

		const
		a = n.real,
		b = n.imaginary
		
		return new Q.ComplexNumber(
		
			 Math.cos( a ) * Q.hyperbolicCosine( b ),
			-Math.sin( a ) * Q.hyperbolicSine( b )
		)
	},
    arcCosine: function( n ){
    	
		const
		a  = n.real,
		b  = n.imaginary,
		t1 = Q.ComplexNumber.squareRoot( new Q.ComplexNumber(

			b * b - a * a + 1,
			a * b * -2
		
		)),
		t2 = Q.ComplexNumber.log( new Q.ComplexNumber(
			
			t1.real - b,
			t1.imaginary + a
		))
		return new Q.ComplexNumber( Math.PI / 2 - t2.imaginary, t2.real )
	},
	arcTangent: function( n ){

		const
		a = n.real,
		b = n.imaginary

		if( a === 0 ){

			if( b ===  1 ) return new Q.ComplexNumber( 0,  Infinity )
			if( b === -1 ) return new Q.ComplexNumber( 0, -Infinity )
		}

		const 
		d = a * a + ( 1 - b ) * ( 1 - b ),
		t = Q.ComplexNumber.log( new Q.ComplexNumber(
			
			( 1 - b * b - a * a ) / d,
			a / d * -2

		))
		return new Q.ComplexNumber( t.imaginary / 2, t.real / 2 )
	},




	power: function( a, b ){

		if( Q.ComplexNumber.isNumberLike( a )) a = new Q.ComplexNumber( a )
		if( Q.ComplexNumber.isNumberLike( b )) b = new Q.ComplexNumber( b )


		//  Anything raised to the Zero power is 1.

		if( b.isZero() ) return Q.ComplexNumber.ONE


		//  Zero raised to any power is 0.
		//  Note: What happens if b.real is zero or negative?
		//        What happens if b.imaginary is negative?
		//        Do we really need those conditionals??

		if( a.isZero() &&
			b.real > 0 && 
			b.imaginary >= 0 ){

			return Q.ComplexNumber.ZERO
		}


		//  If our exponent is Real (has no Imaginary component)
		//  then we’re really just raising to a power.
		
		if( b.imaginary === 0 ){

			if( a.real >= 0 && a.imaginary === 0 ){

				return new Q.ComplexNumber( Math.pow( a.real, b.real ), 0 )
			}
			else if( a.real === 0 ){//  If our base is Imaginary (has no Real component).

				switch(( b.real % 4 + 4 ) % 4 ){
			
					case 0:
						return new Q.ComplexNumber( Math.pow( a.imaginary, b.real ), 0 )
					case 1:
						return new Q.ComplexNumber( 0, Math.pow( a.imaginary, b.real ))
					case 2:
						return new Q.ComplexNumber( -Math.pow( a.imaginary, b.real ), 0 )
					case 3:
						return new Q.ComplexNumber( 0, -Math.pow( a.imaginary, b.real ))
				}
			}
		}


		const
		arctangent2 = Math.atan2( a.imaginary, a.real ),
		logHypotenuse = Q.logHypotenuse( a.real, a.imaginary ),
		x = Math.exp( b.real * logHypotenuse - b.imaginary * arctangent2 ),
		y = b.imaginary * logHypotenuse + b.real * arctangent2

		return new Q.ComplexNumber(
		
			x * Math.cos( y ),
			x * Math.sin( y )
		)
	},
	squareRoot: function( a ){

		const 
		result = new Q.ComplexNumber( 0, 0 ),
		absolute = Q.ComplexNumber.absolute( a )

		if( a.real >= 0 ){

			if( a.imaginary === 0 ){
				
				result.real = Math.sqrt( a.real )//  and imaginary already equals 0.
			}
			else {
				
				result.real = Math.sqrt( 2 * ( absolute + a.real )) /  2
			}
		} 
		else {
			
			result.real = Math.abs( a.imaginary ) / Math.sqrt( 2 * ( absolute - a.real ))
		}
		if( a.real <= 0 ){
			
			result.imaginary = Math.sqrt( 2 * ( absolute - a.real )) / 2
		}
		else {
			
			result.imaginary = Math.abs( a.imaginary ) / Math.sqrt( 2 * ( absolute + a.real ))
		}
		if( a.imaginary < 0 ) result.imaginary *= -1
		return result
	},
	log: function( a ){

		return new Q.ComplexNumber(
		
			Q.logHypotenuse( a.real, a.imaginary ),
			Math.atan2( a.imaginary, a.real )
		)
	},
	multiply: function( a, b ){
		
		return Q.ComplexNumber.operate(

			'multiply', a, b,
			function( a, b ){
				
				return new Q.ComplexNumber( a * b )
			},
			function( a, b ){

				return new Q.ComplexNumber( 

					a * b.real,
					a * b.imaginary
				)
			},
			function( a, b ){

				return new Q.ComplexNumber( 

					a.real * b,
					a.imaginary * b
				)
			},
			function( a, b ){


				//  FOIL Method that shit.
				//  https://en.wikipedia.org/wiki/FOIL_method

				const
				firsts = a.real * b.real,
				outers = a.real * b.imaginary,
				inners = a.imaginary * b.real,				
				lasts  = a.imaginary * b.imaginary * -1//  Because i² = -1.
				
				return new Q.ComplexNumber( 

					firsts + lasts,
					outers + inners
				)
			}
		)
	},
	divide: function( a, b ){

		return Q.ComplexNumber.operate(

			'divide', a, b,
			function( a, b ){
				
				return new Q.ComplexNumber( a / b )
			},
			function( a, b ){

				return new Q.ComplexNumber( a ).divide( b )
			},
			function( a, b ){

				return new Q.ComplexNumber( 

					a.real / b,
					a.imaginary / b
				)
			},
			function( a, b ){


				//  Ermergerd I had to look this up because it’s been so long.
				//  https://www.khanacademy.org/math/precalculus/imaginary-and-complex-numbers/complex-conjugates-and-dividing-complex-numbers/a/dividing-complex-numbers-review

				const 
				conjugate   = b.conjugate(),
				numerator   = a.multiply( conjugate ),


				//  The .imaginary will be ZERO for sure, 
				//  so this forces a ComplexNumber.divide( Number ) ;)
				
				denominator = b.multiply( conjugate ).real

				return numerator.divide( denominator )
			}
		)
	},
	add: function( a, b ){
		
		return Q.ComplexNumber.operate(

			'add', a, b,
			function( a, b ){

				return new Q.ComplexNumber( a + b )
			},
			function( a, b ){

				return new Q.ComplexNumber(

					b.real + a,
					b.imaginary
				)
			},
			function( a, b ){

				return new Q.ComplexNumber(

					a.real + b,
					a.imaginary
				)
			},
			function( a, b ){

				return new Q.ComplexNumber(

					a.real + b.real,
					a.imaginary + b.imaginary
				)
			}
		)
	},
	subtract: function( a, b ){

		return Q.ComplexNumber.operate(

			'subtract', a, b,
			function( a, b ){

				return new Q.ComplexNumber( a - b )
			},
			function( a, b ){

				return new Q.ComplexNumber(

					b.real - a,
					b.imaginary
				)
			},
			function( a, b ){

				return new Q.ComplexNumber(

					a.real - b,
					a.imaginary
				)
			},
			function( a, b ){

				return new Q.ComplexNumber(

					a.real - b.real,
					a.imaginary - b.imaginary
				)
			}
		)
	}
})




Q.ComplexNumber.createConstants(

	'ZERO',     new Q.ComplexNumber( 0, 0 ),
	'ONE',      new Q.ComplexNumber( 1, 0 ),
	'E',        new Q.ComplexNumber( Math.E,  0 ),
	'PI',       new Q.ComplexNumber( Math.PI, 0 ),
	'I',        new Q.ComplexNumber( 0, 1 ),
	'EPSILON',  new Q.ComplexNumber( Q.EPSILON, Q.EPSILON ),
	'INFINITY', new Q.ComplexNumber( Infinity, Infinity ),
	'NAN',      new Q.ComplexNumber( NaN, NaN )
)




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
	toText: function( roundToDecimal, padPositive ){


		//  Note: this will kill function chaining.

		return Q.ComplexNumber.toText( this.real, this.imaginary, roundToDecimal, padPositive )
	},


	isNaN: function( n ){
		
		return Q.ComplexNumber.isNaN( this )//  Returned boolean will kill function chaining.
	},
	isZero: function( n ){

		return Q.ComplexNumber.isZero( this )//  Returned boolean will kill function chaining.
	},
	isFinite: function( n ){

		return Q.ComplexNumber.isFinite( this )//  Returned boolean will kill function chaining.
	},
	isInfinite: function( n ){
	
		return Q.ComplexNumber.isInfinite( this )//  Returned boolean will kill function chaining.
	},
	isEqualTo: function( b ){

		return Q.ComplexNumber.areEqual( this, b )//  Returned boolean will kill function chaining.
	},


	absolute: function(){
	
		return Q.ComplexNumber.absolute( this )//  Returned number will kill function chaining.
	},
	conjugate: function(){

		return Q.ComplexNumber.conjugate( this )
	},
	

	power: function( b ){

		return Q.ComplexNumber.power( this, b )
	},
	squareRoot: function(){

		return Q.ComplexNumber.squareRoot( this )
	},
	log: function(){

		return Q.ComplexNumber.log( this )
	},
	multiply: function( b ){

		return Q.ComplexNumber.multiply( this, b )
	},
	divide: function( b ){

		return Q.ComplexNumber.divide( this, b )
	},
	add: function( b ){

		return Q.ComplexNumber.add( this, b )
	},
	subtract: function( b ){

		return Q.ComplexNumber.subtract( this, b )
	},




	//  DESTRUCTIVE operations.

	copy$: function( b ){
		
		if( b instanceof Q.ComplexNumber !== true )
			return Q.error( `Q.ComplexNumber attempted to copy something that was not a complex number in to this complex number #${this.index}.`, this )
		
		this.real = b.real
		this.imaginary = b.imaginary
		return this
	},
	conjugate$: function(){

		return this.copy$( this.conjugate() )
	},
	power$: function( b ){

		return this.copy$( this.power( b ))
	},
	squareRoot$: function(){

		return this.copy$( this.squareRoot() )
	},
	log$: function(){

		return this.copy$( this.log() )
	},
	multiply$: function( b ){

		return this.copy$( this.multiply( b ))
	},
	divide$: function( b ){

		return this.copy$( this.divide( b ))
	},
	add$: function( b ){

		return this.copy$( this.add( b ))
	},
	subtract$: function( b ){

		return this.copy$( this.subtract( b ))
	}
})



