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


			//  Before we even attempt to parse this expression
			//  do we have matching pairs of parentheses?
			//  Every time we open a new scope we increment our depth
			//  and every time we close a scope we decrement our depth.



// ***** THIS NEEDS TO  ACTUALLY *INDIVIDUALLY*  MATCH (, [, {  INSTEAD


			const depthBalance = n.split( '' ).reduce( function( depth, c ){
			
				if( '([{'.indexOf() > -1 ) return depth + 1
				if( ')]}'.indexOf() > -1 ) return depth - 1
				return depth
		
			}, 0 ) === 0
			if( depthBalance !== 0 ) return Q.error( `Q.Expression attempted to parse an expression with mismatched parentheses; depth of ${depthBalance}.` )

/*


Get the inner most parens
reduce that
work outward

https://stackoverflow.com/questions/20906479/javascript-regex-innermost-parentheses-not-surrounded-by-quotes


/\([^()"]*(?:"[^"]*"[^()"]*)*\)/



*/





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


			if nesting structure looks correct

				work from inner-most to outter most

					combineLikeTerms( this )

			else return fucked



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



