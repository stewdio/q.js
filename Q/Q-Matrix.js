
//  Copyright © 2019–2020, Stewart Smith. See LICENSE for details.




Q.Matrix = function(){


	//  We’re keeping track of how many matrices are
	//  actually being generated. Just curiosity.

	this.index = Q.Matrix.index ++


	let matrixWidth = null


	//  Has Matrix been called with two numerical arguments?
	//  If so, we need to create an empty Matrix 
	//  with dimensions of those values.
	
	if( arguments.length == 1 &&
		Q.ComplexNumber.isNumberLike( arguments[ 0 ])){

		matrixWidth = arguments[ 0 ]
		this.rows = new Array( matrixWidth ).fill( 0 ).map( function(){

			return new Array( matrixWidth ).fill( 0 )
		})
	}
	else if( arguments.length == 2 &&
		Q.ComplexNumber.isNumberLike( arguments[ 0 ]) &&
	    Q.ComplexNumber.isNumberLike( arguments[ 1 ])){

		matrixWidth = arguments[ 0 ]
		this.rows = new Array( arguments[ 1 ]).fill( 0 ).map( function(){

			return new Array( matrixWidth ).fill( 0 )
		})
	}
	else {

		//  Matrices’ primary organization is by rows,
		//  which is more congruent with our written langauge;
		//  primarily organizated by horizontally juxtaposed glyphs.
		//  That means it’s easier to write an instance invocation in code
		//  and easier to read when inspecting properties in the console.

		let matrixWidthIsBroken = false
		this.rows = Array.from( arguments )
		this.rows.forEach( function( row ){

			if( row instanceof Array !== true ) row = [ row ]
			if( matrixWidth === null ) matrixWidth = row.length
			else if( matrixWidth !== row.length ) matrixWidthIsBroken = true
		})
		if( matrixWidthIsBroken )
			return Q.error( `Q.Matrix found upon initialization that matrix#${this.index} row lengths were not equal. You are going to have a bad time.`, this )
	}






	//  But for convenience we can also organize by columns.
	//  Note this represents the transposed version of itself!

	const matrix = this
	this.columns = []
	for( let x = 0; x < matrixWidth; x ++ ){
	
		const column = []
		for( let y = 0; y < this.rows.length; y ++ ){


			//  Since we’re combing through here
			//  this is a good time to convert Number to ComplexNumber!

			const value = matrix.rows[ y ][ x ]
			if( typeof value === 'number' ){
				
				// console.log('Created a  complex number!')
				matrix.rows[ y ][ x ] = new Q.ComplexNumber( value )
			}
			else if( value instanceof Q.ComplexNumber === false ){
				return Q.error( `Q.Matrix found upon initialization that matrix#${this.index} contained non-quantitative values. A+ for creativity, but F for functionality.`, this )
			}

			// console.log( x, y, matrix.rows[ y ][ x ])
			

			Object.defineProperty( column, y, { 

				get: function(){ return matrix.rows[ y ][ x ]},
				set: function( n ){ matrix.rows[ y ][ x ] = n }
			})
		}
		this.columns.push( column )
	}
}






    ///////////////////////////
   //                       //
  //   Static properties   //
 //                       //
///////////////////////////


Object.assign( Q.Matrix, {

	index: 0,
	help: function(){ return Q.help( this )},
	constants: {},//  Only holds references; an easy way to look up what constants exist.
	createConstant:  Q.createConstant,
	createConstants: Q.createConstants,


	isMatrixLike: function( obj ){

		//return obj instanceof Q.Matrix || Q.Matrix.prototype.isPrototypeOf( obj )
		return obj instanceof this || this.prototype.isPrototypeOf( obj )
	},
	isWithinRange: function( n, minimum, maximum ){

		return typeof n === 'number' && 
			n >= minimum && 
			n <= maximum && 
			n == parseInt( n )
	},
	getWidth: function( matrix ){

		return matrix.columns.length
	},
	getHeight: function( matrix ){

		return matrix.rows.length
	},
	haveEqualDimensions: function( matrix0, matrix1 ){

		return (
		
			matrix0.rows.length === matrix1.rows.length && 
			matrix0.columns.length === matrix1.columns.length
		)
	},
	areEqual: function( matrix0, matrix1 ){

		if( matrix0 instanceof Q.Matrix !== true ) return false
		if( matrix1 instanceof Q.Matrix !== true ) return false
		if( Q.Matrix.haveEqualDimensions( matrix0, matrix1 ) !== true ) return false
		return matrix0.rows.reduce( function( state, row, r ){

			return state && row.reduce( function( state, cellValue, c ){

				return state && cellValue.isEqualTo( matrix1.rows[ r ][ c ])

			}, true )

		}, true )
	},




	createSquare: function( size, f ){

		if( typeof size !== 'number' ) size = 2
		if( typeof f !== 'function' ) f = function(){ return 0 }
		const data = []
		for( let y = 0; y < size; y ++ ){

			const row = []
			for( let x = 0; x < size; x ++ ){

				row.push( f( x, y ))
			}
			data.push( row )
		}
		return new Q.Matrix( ...data )
	},
	createZero: function( size ){
	
		return new Q.Matrix.createSquare( size )
	},
	createOne: function( size ){
	
		return new Q.Matrix.createSquare( size, function(){ return 1 })
	},
	createIdentity: function( size ){

		return new Q.Matrix.createSquare( size, function( x, y ){ return x === y ? 1 : 0 })
	},

	


	//  Import FROM a format.

	from: function( format ){

		if( typeof format !== 'string' ) format = 'Array'
		const f = Q.Matrix[ 'from'+ format ]
		format = format.toLowerCase()
		if( typeof f !== 'function' )
			return Q.error( `Q.Matrix could not find an importer for “${format}” data.` )
		return f
	},
	fromArray: function( array ){

		return new Q.Matrix( ...array )
	},
	fromXsv: function( input, rowSeparator, valueSeparator ){

		`
		Ingest string data organized by row, then by column
		where rows are separated by one token (default: \n)
		and column values are separated by another token
		(default: \t).

		`

		if( typeof rowSeparator   !== 'string' ) rowSeparator   = '\n'
		if( typeof valueSeparator !== 'string' ) valueSeparator = '\t'

		const 
		inputRows  = input.split( rowSeparator ),
		outputRows = []

		inputRows.forEach( function( inputRow ){

			inputRow = inputRow.trim()
			if( inputRow === '' ) return
			
			const outputRow = []
			inputRow.split( valueSeparator ).forEach( function( cellValue ){

				outputRow.push( parseFloat( cellValue ))
			})
			outputRows.push( outputRow )
		})
		return new Q.Matrix( ...outputRows )
	},
	fromCsv: function( csv ){

		return Q.Matrix.fromXsv( csv.replace( /\r/g, '\n' ), '\n', ',' )
	},
	fromTsv: function( tsv ){

		return Q.Matrix.fromXsv( tsv, '\n', '\t' )
	},
	fromHtml: function( html ){

		return Q.Matrix.fromXsv(

			html
				.replace( /\r?\n|\r|<tr>|<td>/g, '' )
				.replace( /<\/td>(\s*)<\/tr>/g, '</tr>' )
				.match( /<table>(.*)<\/table>/i )[ 1 ],
			'</tr>',
			'</td>'
		)
	},




	//  Export TO a format.

	toXsv: function( matrix, rowSeparator, valueSeparator ){
		
		return matrix.rows.reduce( function( xsv, row ){

			return xsv + rowSeparator + row.reduce( function( xsv, cell, c ){

				return xsv + ( c > 0 ? valueSeparator : '' ) + cell.toText()
			
			}, '' )
		
		}, '' )
	},
	toCsv: function( matrix ){

		return Q.Matrix.toXsv( matrix, '\n', ',' )
	},
	toTsv: function( matrix ){

		return Q.Matrix.toXsv( matrix, '\n', '\t' )
	},




	//  Operate NON-destructive.

	add: function( matrix0, matrix1 ){

		if( Q.Matrix.isMatrixLike( matrix0 ) !== true ||
			Q.Matrix.isMatrixLike( matrix1 ) !== true ){

			return Q.error( `Q.Matrix attempted to add something that was not a matrix.` )
		}
		if( Q.Matrix.haveEqualDimensions( matrix0, matrix1 ) !== true )
			return Q.error( `Q.Matrix cannot add matrix#${matrix0.index} of dimensions ${matrix0.columns.length}x${matrix0.rows.length} to matrix#${matrix1.index} of dimensions ${matrix1.columns.length}x${matrix1.rows.length}.`)

		return new Q.Matrix( ...matrix0.rows.reduce( function( resultMatrixRow, row, r ){

			resultMatrixRow.push( row.reduce( function( resultMatrixColumn, cellValue, c ){

				// resultMatrixColumn.push( cellValue + matrix1.rows[ r ][ c ])
				resultMatrixColumn.push( cellValue.add( matrix1.rows[ r ][ c ]))
				return resultMatrixColumn

			}, [] ))
			return resultMatrixRow

		}, [] ))
	},
	multiplyScalar: function( matrix, scalar ){

		if( Q.Matrix.isMatrixLike( matrix ) !== true ){

			return Q.error( `Q.Matrix attempted to scale something that was not a matrix.` )
		}
		if( typeof scalar !== 'number' ){

			return Q.error( `Q.Matrix attempted to scale this matrix#${matrix.index} by an invalid scalar: ${scalar}.` )
		}
		return new Q.Matrix( ...matrix.rows.reduce( function( resultMatrixRow, row ){

			resultMatrixRow.push( row.reduce( function( resultMatrixColumn, cellValue ){

				// resultMatrixColumn.push( cellValue * scalar )
				resultMatrixColumn.push( cellValue.multiply( scalar ))
				return resultMatrixColumn
			
			}, [] ))
			return resultMatrixRow

		}, [] ))
	},
	multiply: function( matrix0, matrix1 ){

		`
		Two matrices can be multiplied only when 
		the number of columns in the first matrix
		equals the number of rows in the second matrix.
		Reminder: Matrix multiplication is not commutative
		so the order in which you multiply matters.


			SEE ALSO

		https://en.wikipedia.org/wiki/Matrix_multiplication
		`

		if( Q.Matrix.isMatrixLike( matrix0 ) !== true ||
			Q.Matrix.isMatrixLike( matrix1 ) !== true ){

			return Q.error( `Q.Matrix attempted to multiply something that was not a matrix.` )
		}
		if( matrix0.columns.length !== matrix1.rows.length ){

			return Q.error( `Q.Matrix attempted to multiply Matrix#${matrix0.index}(cols==${matrix0.columns.length}) by Matrix#${matrix1.index}(rows==${matrix1.rows.length}) but their dimensions were not compatible for this.` )
		}
		const resultMatrix = []
		matrix0.rows.forEach( function( matrix0Row ){//  Each row of THIS matrix

			const resultMatrixRow = []
			matrix1.columns.forEach( function( matrix1Column ){//  Each column of OTHER matrix

				const sum = new Q.ComplexNumber()
				matrix1Column.forEach( function( matrix1CellValue, index ){//  Work down the column of OTHER matrix

					sum.add$( matrix0Row[ index ].multiply( matrix1CellValue ))
				})
				resultMatrixRow.push( sum )
			})
			resultMatrix.push( resultMatrixRow )
		})
		//return new Q.Matrix( ...resultMatrix )
		return new this( ...resultMatrix )
	},
	multiplyTensor: function( matrix0, matrix1 ){

		`
		https://en.wikipedia.org/wiki/Kronecker_product
		https://en.wikipedia.org/wiki/Tensor_product
		`

		if( Q.Matrix.isMatrixLike( matrix0 ) !== true ||
			Q.Matrix.isMatrixLike( matrix1 ) !== true ){

			return Q.error( `Q.Matrix attempted to tensor something that was not a matrix.` )
		}

		const 
		resultMatrix = [],
		resultMatrixWidth  = matrix0.columns.length * matrix1.columns.length,
		resultMatrixHeight = matrix0.rows.length * matrix1.rows.length

		for( let y = 0; y < resultMatrixHeight; y ++ ){

			const resultMatrixRow = []
			for( let x = 0; x < resultMatrixWidth; x ++ ){

				const 
				matrix0X = Math.floor( x / matrix0.columns.length ),
				matrix0Y = Math.floor( y / matrix0.rows.length ),
				matrix1X = x % matrix1.columns.length,
				matrix1Y = y % matrix1.rows.length

				resultMatrixRow.push( 

					//matrix0.rows[ matrix0Y ][ matrix0X ] * matrix1.rows[ matrix1Y ][ matrix1X ]
					matrix0.rows[ matrix0Y ][ matrix0X ].multiply( matrix1.rows[ matrix1Y ][ matrix1X ])
				)
			}
			resultMatrix.push( resultMatrixRow )
		}
		return new Q.Matrix( ...resultMatrix )
	}
})






    //////////////////////////////
   //                          //
  //   Prototype properties   //
 //                          //
//////////////////////////////


Object.assign( Q.Matrix.prototype, {

	isValidRow: function( r ){

		return Q.Matrix.isWithinRange( r, 0, this.rows.length - 1 )
	},
	isValidColumn: function( c ){

		return Q.Matrix.isWithinRange( c, 0, this.columns.length - 1 )
	},
	isValidAddress: function( x, y ){

		return this.isValidRow( y ) && this.isValidColumn( x )
	},
	getWidth: function(){

		return Q.Matrix.getWidth( this )
	},
	getHeight: function(){

		return Q.Matrix.getHeight( this )
	},




	//  Read NON-destructive by nature. (Except quantum reads of course! ROFL!!)

	read: function( x, y ){

		`
		Equivalent to 
		this.columns[ x ][ y ] 
		or 
		this.rows[ y ][ x ]
		but with safety checks.
		`
		
		if( this.isValidAddress( x, y )) return this.rows[ y ][ x ]
		return Q.error( `Q.Matrix could not read from cell address (x=${x}, y=${y}) in matrix#${this.index}.`, this )
	},
	clone: function(){

		return new Q.Matrix( ...this.rows )
	},
	isEqualTo: function( otherMatrix ){

		return Q.Matrix.areEqual( this, otherMatrix )
	},


	toArray: function(){

		return this.rows
	},
	toXsv: function( rowSeparator, valueSeparator ){
		
		return Q.Matrix.toXsv( this, rowSeparator, valueSeparator )
	},
	toCsv: function(){

		return Q.Matrix.toXsv( this, '\n', ',' )
	},
	toTsv: function(){

		return Q.Matrix.toXsv( this, '\n', '\t' )
	},
	toHtml: function(){
		
		return this.rows.reduce( function( html, row ){

			return html + row.reduce( function( html, cell ){

				return html +'\n\t\t<td>'+ cell.toText() +'</td>'
			
			}, '\n\t<tr>' ) + '\n\t</tr>'
		
		}, '\n<table>' ) +'\n</table>'
	},




	//  Write is DESTRUCTIVE by nature. Not cuz I hate ya.

	write$: function( x, y, n ){

		`
		Equivalent to 
		this.columns[ x ][ y ] = n 
		or 
		this.rows[ y ][ x ] = n
		but with safety checks.
		`

		if( this.isValidAddress( x, y )){

			if( Q.ComplexNumber.isNumberLike( n )) n = new Q.ComplexNumber( n )
			if( n instanceof Q.ComplexNumber !== true ) return Q.error( `Attempted to write an invalid value (${n}) to matrix#${this.index} at x=${x}, y=${y}`, this )
			this.rows[ y ][ x ] = n
			return this
		}
		return Q.error( `Invalid cell address for Matrix#${this.index}: x=${x}, y=${y}`, this )
	},
	copy$: function( matrix ){

		if( Q.Matrix.isMatrixLike( matrix ) !== true )
			return Q.error( `Q.Matrix attempted to copy something that was not a matrix in to this matrix#${matrix.index}.`, this )

		if( Q.Matrix.haveEqualDimensions( matrix, this ) !== true )
			return Q.error( `Q.Matrix cannot copy matrix#${matrix.index} of dimensions ${matrix.columns.length}x${matrix.rows.length} in to this matrix#${this.index} of dimensions ${this.columns.length}x${this.rows.length} because their dimensions do not match.`, this )
		
		const that = this
		matrix.rows.forEach( function( row, r ){

			row.forEach( function( n, c ){

				that.rows[ r ][ c ] = n
			})
		})
		return this
	},
	fromArray$: function( array ){

		return this.copy$( Q.Matrix.fromArray( array ))
	},
	fromCsv$: function( csv ){

		return this.copy$( Q.Matrix.fromCsv( csv ))
	},
	fromTsv$: function( tsv ){

		return this.copy$( Q.Matrix.fromTsv( tsv ))
	},
	fromHtml$: function( html ){

		return this.copy$( Q.Matrix.fromHtml( html ))
	},




	//  Operate NON-destructive.

	add: function( otherMatrix ){

		return Q.Matrix.add( this, otherMatrix )
	},
	multiplyScalar: function( scalar ){

		return Q.Matrix.multiplyScalar( this, scalar )
	},
	multiply: function( otherMatrix ){

		return Q.Matrix.multiply( this, otherMatrix )
	},
	multiplyTensor: function( otherMatrix ){

		return Q.Matrix.multiplyTensor( this, otherMatrix )
	},




	//  Operate DESTRUCTIVE.

	add$: function( otherMatrix ){

		return this.copy$( this.add( otherMatrix ))
	},
	multiplyScalar$: function( scalar ){

		return this.copy$( this.multiplyScalar( scalar ))
	}
})






    //////////////////////////
   //                      //
  //   Static constants   //
 //                      //
//////////////////////////


Q.Matrix.createConstants(

	'IDENTITY_2X2', Q.Matrix.createIdentity( 2 ),
	'IDENTITY_3X3', Q.Matrix.createIdentity( 3 ),
	'IDENTITY_4X4', Q.Matrix.createIdentity( 4 ),

	'CONSTANT0_2X2', new Q.Matrix(
		[ 1, 1 ],
		[ 0, 0 ]),

	'CONSTANT1_2X2', new Q.Matrix(
		[ 0, 0 ],
		[ 1, 1 ]),

	'NEGATION_2X2', new Q.Matrix(
		[ 0, 1 ],
		[ 1, 0 ]),

	'TEST_MAP_9X9', new Q.Matrix(
		[ 11, 21, 31, 41, 51, 61, 71, 81, 91 ],
		[ 12, 22, 32, 42, 52, 62, 72, 82, 92 ],
		[ 13, 23, 33, 43, 53, 63, 73, 83, 93 ],
		[ 14, 24, 34, 44, 54, 64, 74, 84, 94 ],
		[ 15, 25, 35, 45, 55, 65, 75, 85, 95 ],
		[ 16, 26, 36, 46, 56, 66, 76, 86, 96 ],
		[ 17, 27, 37, 47, 57, 67, 77, 87, 97 ],
		[ 18, 28, 38, 48, 58, 68, 78, 88, 98 ],
		[ 19, 29, 39, 49, 59, 69, 79, 89, 99 ])
)



