'strict'




Q.Expression = function( n ){

	`

	A simple mathematical expression parser and operation handler.
	Or at least, that’s the goal. Eventually. When I grow up.
	Don’t look at me. DO NOT. FUCKING. LOOK AT ME.


		SEE ALSO

	https://en.wikipedia.org/wiki/Expression_(mathematics)

	`


	Object.assign( this, Q.Expression.parse( n ))
}




Object.assign( Q.Expression, {

	parse: function( n ){

		if( n instanceof Q.Expression ) return n
		if( typeof n === 'number' ){

			return { 

				real:      n, 
				imaginary: 0,
				variables: {}
			}
		}
		if( typeof n === 'string' ){

			/*
				
				Split this string up in to *any* type of real number,
				and then split any remaining bits up in to single chars.
				https://regexr.com
				
				\d+     Match any digit, 1 or more times.
				\.?     Match a decimal point (period), 0 or 1 times.
				\d*     Match any digit, 0 or more times.
				e[+-]?  Match an “e” (for 10^x expressions) with a “+” or “-” after it, 0 or 1 times.
				\d+     Match any digit, 1 or more times.
				
				|       or
				
				\d+     Match any digit, 1 or more times.
				\.?     Match a decimal point (period), 0 or 1 times.
				\d*     Match any digit, 0 or more times.
				
				|       or
				
				\.      Match a decimal point (period), 1 time.
				\d+     Match any digit, 1 or more times.
				
				|       or
				
				.       Match a decimal point (period), 1 time.

			
			*/
			const 
			numberPattern = /\d+\.?\d*e[+-]?\d+|\d+\.?\d*|\.\d+|./g,
			tokens = n.match( numberPattern )
			
			console.log( tokens )

			/*  
				parse out:
				real numbers (if any)
				imaginary numbers (if any)
				other variables (if any)
				operators
				automatically reduce / simplify / combineLikeTerms()
			*/

			/*


			if contains parens

				if matching number of close-parens

					if nesting structure looks correct

						work from inner-most to outter most

							combineLikeTerms( this )

					else return fucked

				else return fucked

			else combineLikeTerms( this )




			*/

			return { 

				real:      0, 
				imaginary: 0,
				variables: {}
			}
		}
		return false
	}
})




Object.assign( Q.Expression.prototype, {

	toString: function(){},

	combineLikeTerms: function(){},

	raiseTo: function(){},
	multiply: function(){},
	divide: function(){},
	add: function(){},
	subtract: function(){}
})



