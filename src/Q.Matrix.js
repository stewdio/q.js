'strict'




Q.Matrix = function(){

	`
	Creates a matrix of arbitrary dimensions.
	Expects an argument list of equal-length arrays 
	where each array represents a row of column values.
	Automatically determines matrix dimensions 
	based on the number of arguments (rows)
	and length of each row (number of columns).
	Throws an error if the row lengths are not equal.

	Limitation: A matrix cannot change its dimensions
	after initialization and cannot contain matrices.
	

		EXAMPLES

	const myMatrix = new Q.Matrix(
		
		[ 1, 0, 0, 0 ],
		[ 0, 1, 0, 0 ],
		[ 0, 0, 1, 0 ],
		[ 0, 0, 0, 1 ]
	)

	
		SEE ALSO

	https://en.wikipedia.org/wiki/Matrix_(mathematics)

	`


	//  We’re keeping track of how many matrices are
	//  actually being generated. Just curiosity.

	this.index = Q.Matrix.index ++


	//  Matrices’ primary organization is by rows,
	//  which is more congruent with our written langauge
	//  which primarily organization by horizontally juxtaposed glyphs.
	//  That means it’s easier to write an instance invocation in code
	//  and easier to read when inspecting properties in the console.

	this.rows = Array.from( arguments )
	let columnLength = null
	this.rows.forEach( function( row ){

		if( typeof row === 'number' ) row = [ row ]
		if( columnLength === null ) columnLength = row.length
		else if( columnLength !== row.length ){

			Q.error( `Matrix#${index} was malformed.`, this )
		}
	})


	//  But for convenience we can also organize by columns.
	//  Note this represents the transposed version of itself!

	const matrix = this
	this.columns = []
	for( let x = 0; x < columnLength; x ++ ){
	
		const column = []
		for( let y = 0; y < this.rows.length; y ++ ){

			Object.defineProperty( column, y, { 

				get: function(){ return matrix.rows[ y ][ x ]},
				set: function( n ){ matrix.rows[ y ][ x ] = n }
			})
		}
		this.columns.push( column )
	}
}






    ////////////////////////
   //                    //
  //   Static methods   //
 //                    //
////////////////////////


Object.assign( Q.Matrix, {

	index: 0,
	isWithinRange: function( n, min, max ){

		return typeof n === 'number' && 
			n >= min && 
			n <= max && 
			n == parseInt( n )
	},
	create: function( size, f ){

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
	
		return new Q.Matrix.create( size )
	},
	createOne: function( size ){
	
		return new Q.Matrix.create( size, function(){ return 1 })
	},
	createIdentity: function( size ){

		return new Q.Matrix.create( size, function( x, y ){ return x === y ? 1 : 0 })
	},
	createConstant: function( key, value ){

		Q.Matrix[ key ] = value
		Object.freeze( Q.Matrix[ key ])
	},
	createConstants: function(){

		if( arguments.length % 2 !== 0 ){

			Q.error( 'Q.Matrix attempted to create constants with invalid (KEY, VALUE) pairs.' )
			return
		}
		for( let i = 0; i < arguments.length; i += 2 ){

			Q.Matrix.createConstant( arguments[ i ], arguments[ i + 1 ])
		}
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

	


	//  Ingest.

	fromArray: function( array ){

		//  so.... we need to decide on how we figure out the intended dimensions.
		//  explicit argument pass?
		//  educated guess? (try for a square?)
		return this
	},
	fromXSV: function( input, separator ){

		const 
		inputRows  = input.split( '\n' ),
		outputRows = []

		inputRows.forEach( function( inputRow ){

			inputRow = inputRow.trim()
			if( inputRow === '' ) return
			
			const outputRow = []
			inputRow.split( separator ).forEach( function( cellValue ){

				outputRow.push( cellValue )
			})
			outputRows.push( outputRow )
		})
		return new Q.Matrix( ...outputRows )
	},
	fromCSV: function( csv ){

		return Q.Matrix.fromXSV( csv, ',' )
	},
	fromTSV: function( tsv ){

		return Q.Matrix.fromXSV( tsv, '\t' )
	},
	fromHTML: function( html ){

		//  from HTML code? or domElements?
		//  break apart by TR / TD
		return 'OMFG some other day get off my back'
	},




	//  Operate NON-destructive.

	add: function( matrix0, matrix1 ){

		if( matrix0 instanceof Q.Matrix !== true ||
			matrix1 instanceof Q.Matrix !== true ){

			return Q.error( `Q.Matrix attempted to add something that was not a matrix.` )
		}
		if( Q.Matrix.haveEqualDimensions( matrix0, matrix1 ) !== true )
			return Q.error( `Q.Matrix cannot add matrix#${matrix0.index} of dimensions ${matrix0.columns.length}x${matrix0.rows.length} to matrix#${matrix1.index} of dimensions ${matrix1.columns.length}x${matrix1.rows.length}.`)

		return new Q.Matrix( ...matrix0.rows.reduce( function( resultMatrixRow, row, r ){

			resultMatrixRow.push( row.reduce( function( resultMatrixColumn, cellValue, c ){

				resultMatrixColumn.push( cellValue + matrix1.rows[ r ][ c ])
				return resultMatrixColumn

			}, [] ))
			return resultMatrixRow

		}, [] ))
	},
	multiplyScalar: function( matrix, s ){

		if( matrix instanceof Q.Matrix !== true ){

			return Q.error( `Q.Matrix attempted to scale something that was not a matrix.` )
		}
		if( typeof s !== 'number' ){

			return Q.error( `Q.Matrix attempted to scale this matrix#${matrix.index} by an invalid scalar: ${s}.` )
		}
		return new Q.Matrix( ...this.rows.reduce( function( resultMatrixRow, row ){

			resultMatrixRow.push( row.reduce( function( resultMatrixColumn, cell ){

				resultMatrixColumn.push( cell * s )
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

		if( matrix0 instanceof Q.Matrix !== true ||
			matrix1 instanceof Q.Matrix !== true ){

			return Q.error( `Q.Matrix attempted to multiply something that was not a matrix.` )
		}
		if( matrix0.columns.length !== matrix1.rows.length ){

			return Q.error( `Q.Matrix attempted to multiply Matrix#${matrix0.index}(cols==${matrix0.columns.length}) by Matrix#${matrix1.index}(rows==${matrix1.rows.length}) but their dimensions were not compatible for this.` )
		}
		const resultMatrix = []
		matrix0.rows.forEach( function( matrix0Row ){//  Each row of THIS matrix

			const resultMatrixRow = []
			matrix1.columns.forEach( function( matrix1Column ){//  Each column of OTHER matrix

				let sum = 0
				matrix1Column.forEach( function( matrix1CellValue, index ){//  Work down the column of OTHER matrix

					sum += matrix0Row[ index ] * matrix1CellValue
				})
				resultMatrixRow.push( sum )
			})
			resultMatrix.push( resultMatrixRow )
		})
		return new Q.Matrix( ...resultMatrix )
	},
	multiplyTensor: function( matrix0, matrix1 ){

		`
		https://en.wikipedia.org/wiki/Kronecker_product
		https://en.wikipedia.org/wiki/Tensor_product
		`

		if( matrix0 instanceof Q.Matrix !== true ||
			matrix1 instanceof Q.Matrix !== true ){

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

					matrix0.rows[ matrix0Y ][ matrix0X ] * matrix1.rows[ matrix1Y ][ matrix1X ]
				)
			}
			resultMatrix.push( resultMatrixRow )
		}
		return new Q.Matrix( ...resultMatrix )
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
		
	'NEGATION_2X2', new Q.Matrix(
		[ 0, 1 ],
		[ 1, 0 ]),

	'CONSTANT0_2X2', new Q.Matrix(
		[ 1, 1 ],
		[ 0, 0 ]),

	'CONSTANT1_2X2', new Q.Matrix(
		[ 0, 0 ],
		[ 1, 1 ]),

	'CNOT', new Q.Matrix(
		[ 1, 0, 0, 0 ],
		[ 0, 1, 0, 0 ],
		[ 0, 0, 0, 1 ],
		[ 0, 0, 1, 0 ]),

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






    //////////////////////////
   //                      //
  //   Instance methods   //
 //                      //
//////////////////////////


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




	//  Read NON-destructive by nature. (Except quantum!)

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
	toArray: function(){

		return this.rows.flat()
	},
	toCSV: function(){

		`
		Creates a comma-separated-values table and returns it as a string.
		`

		return this.rows.reduce( function( csv, row ){

			return csv +'\n'+ row.reduce( function( csv, cell, c ){

				return csv + ( c > 0 ? ',' : '' ) + cell
			
			}, '' )
		
		}, '' )
	},
	toTSV: function(){

		`
		Creates a tab-separated-values table and returns it as a string.
		`

		return this.rows.reduce( function( csv, row ){

			return csv +'\n'+ row.reduce( function( csv, cell, c ){

				return csv + ( c > 0 ? '\t' : '' ) + cell
			
			}, '' )
		
		}, '' )
	},
	toHTML: function(){

		`
		Creates HTML table code and returns it as a string.
		`
		
		return this.rows.reduce( function( html, row ){

			return html + row.reduce( function( html, cell ){

				return html +'\n\t\t<td>'+ cell +'</td>'
			
			}, '\n\t<tr>' ) + '\n\t</tr>'
		
		}, '\n<table>' ) +'\n</table>'
	},




	//  Write DESTRUCTIVE by nature.

	write$: function( x, y, n ){

		`
		Equivalent to 
		this.columns[ x ][ y ] = n 
		or 
		this.rows[ y ][ x ] = n
		but with safety checks.
		`

		if( this.isValidAddress( x, y )){

			if( typeof n !== 'number' ) return Q.error( `Attempted to write an invalid value (${n}) to Matrix#${this.index} at x=${x}, y=${y}`, this )
			this.rows[ y ][ x ] = n
			return this
		}
		return Q.error( `Invalid cell address for Matrix#${this.index}: x=${x}, y=${y}`, this )
	},
	copy$: function( matrix ){

		if( matrix instanceof Q.Matrix !== true )
			return Q.error( `Q.Matrix attempted to copy something that was not a matrix in to this matrix#${m0.index}.`, this )

		if( Q.Matrix.haveEqualDimensions( matrix, this ) !== true )
			return Q.error( `Q.Matrix cannot copy matrix#${matrix.index} of dimensions ${matrix.columns.length}x${matrix.rows.length} in to this Matrix#${this.index} of dimensions ${this.columns.length}x${this.rows.length} because their dimensions do not match.`, this )
		
		matrix.rows.forEach( function( row, r ){

			row.forEach( function( n, c ){
			
				this.rows[ r ][ c ] = n
			})
		})
		return this
	},
	fromArray$: function( array ){

		return this.copy$( Q.Matrix.fromArray( array ))
	},
	fromCSV$: function( csv ){

		return this.copy$( Q.Matrix.fromCSV( csv ))
	},
	fromTSV$: function( tsv ){

		return this.copy$( Q.Matrix.fromTSV( tsv ))
	},
	fromHTML$: function( html ){

		return this.copy$( Q.Matrix.fromHTML( html ))
	},




	//  Operate NON-destructive

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

		return this.copy$( Q.Matrix.add( this, otherMatrix ))
	},
	multiplyScalar$: function( scalar ){

		return this.copy$( Q.Matrix.multiplyScalar( this, scalar ))
	}
})



