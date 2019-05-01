'strict'




Q.Matrix = function(){

	`
	Creates a matrix of arbitrary dimensions.
	Expects an argument list of arrays 
	where each array represents a row of column values.
	Automatically determines matrix dimensions 
	based on the number of arguments (rows)
	and length of each row (number of columns).
	Throws an error if the row lengths are not equal.
	

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

	const index = Q.Matrix.index
	this.index = index
	Q.Matrix.index ++


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




Object.assign( Q.Matrix, {

	index: 0,
	isWithinRange: function( n, min, max ){

		return typeof n === 'number' && 
			n >= min && 
			n <= max && 
			n == parseInt( n )
	},
	create: function( size, f ){

		if( typeof s !== 'number' ) s = 2
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

			Q.error( 'Attempted to create constants with invalid (KEY, VALUE) pairs.' )
			return
		}
		for( let i = 0; i < arguments.length; i += 2 ){

			Q.Matrix.createConstant( arguments[ i ], arguments[ i + 1 ])
		}
	},
	haveEqualDimensions: function( m0, m1 ){

		return m0.rows.length === m1.rows.length && m0.columns.length === m1.columns.length
	}
})




Q.Matrix.createConstants(

	'IDENTITY_2X2', Q.Matrix.createIdentity( 2 ),
	'IDENTITY_3X3', Q.Matrix.createIdentity( 3 ),
	'IDENTITY_4X4', Q.Matrix.createIdentity( 4 ),
	
	'CNOT', new Q.Matrix(
		[ 1, 0, 0, 0 ],
		[ 0, 1, 0, 0 ],
		[ 0, 0, 0, 1 ],
		[ 0, 0, 1, 0 ]),//  Can we do this by passing a clever function to Q.Matrix.create() instead?
	
	'TEST_MAP_9X9', new Q.Matrix(
		[ 11, 21, 31, 41, 51, 61, 71, 81, 91 ],
		[ 12, 22, 32, 42, 52, 62, 72, 82, 92 ],
		[ 13, 23, 33, 43, 53, 63, 73, 83, 93 ],
		[ 14, 24, 34, 44, 54, 64, 74, 84, 94 ],
		[ 15, 25, 35, 45, 55, 65, 75, 85, 95 ],
		[ 16, 26, 36, 46, 56, 66, 76, 86, 96 ],
		[ 17, 27, 37, 47, 57, 67, 77, 87, 97 ],
		[ 18, 28, 38, 48, 58, 68, 78, 88, 98 ],
		[ 19, 29, 39, 49, 59, 69, 79, 89, 99 ]),

	'TEST_9', new Q.Matrix(
		[ 0, 1, 2 ],
		[ 3, 4, 5 ],
		[ 6, 7, 8 ])
)




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




	//  Read.

	addressRead: function( x, y ){

		`
		Equivalent to 
			this.columns[ x ][ y ] 
		or 
			this.rows[ y ][ x ]
		but with safety checks.
		`
		
		if( this.isValidAddress( x, y )) return this.rows[ y ][ x ]
		return Q.error( `Invalid cell address for Matrix#${this.index}: (x=${x}, y=${y})`, this )
	},
	clone: function(){

		return new Q.Matrix( ...this.rows )
	},
	toArray: function(){

		return this.rows.flat()
	},
	toCSV: function(){

		return this.rows.reduce( function( csv, row ){

			return csv +'\n'+ row.reduce( function( csv, cell, c ){

				return csv + ( c > 0 ? ',' : '' ) + cell
			
			}, '' )
		
		}, '' )
	},
	toTSV: function(){

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




	//  Write.

	addressWrite: function( x, y, n ){

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
	copy: function( matrix ){

		if( matrix instanceof Q.Matrix === true ){

			if( Q.Matrix.haveEqualDimensions( matrix, this ) !== true )
				return Q.error( `Cannot copy Matrix#${matrix.index} of dimensions ${matrix.columns.length}x${matrix.rows.length} in to this Matrix#${this.index} of dimensions ${this.columns.length}x${this.rows.length}.`, this )
			
			matrix.rows.forEach( function( row, r ){

				row.forEach( function( n, c ){
				
					this.rows[ r ][ c ] = n
				})
			})
			return this
		}
		return Q.error( `Attempted to copy something that was not a Matrix in to this Matrix#${m0.index}.`, this )
	},
	fromArray: function(){

		//  so.... we need to decide on how we figure out the intended dimensions.
		//  explicit argument pass?
		//  educated guess? (try for a square?)
		return this
	},
	fromCSV: function(){

		//  ingest by \n and ,
		return this
	},
	fromTSV: function(){

		//  ingest by \n and \t
		return this
	},
	fromHTML: function(){

		// break apart by TR / TD
		return this
	},




	//  Operate (NON-destructive).

	add: function( matrix ){

		if( Q.Matrix.haveEqualDimensions( matrix, this ) !== true )
			return Q.error( `Cannot add Matrix#${matrix.index} of dimensions ${matrix.columns.length}x${matrix.rows.length} to this Matrix#${this.index} of dimensions ${this.columns.length}x${this.rows.length}.`, this )

		return new Q.Matrix( ...this.rows.reduce( function( resultMatrixRow, row, r ){

			resultMatrixRow.push( row.reduce( function( resultMatrixColumn, cell, c ){

				resultMatrixColumn.push( cell + matrix.rows[ r ][ c ])
				return resultMatrixColumn

			}, [] ))
			return resultMatrixRow

		}, [] ))
	},
	multiplyScalar: function( s ){

		if( typeof s !== 'number' ){

			return Q.error( `Attempted to multiply this Matrix#${this.index} by an invalid scalar: ${s}.` )
		}
		return new Q.Matrix( ...this.rows.reduce( function( resultMatrixRow, row ){

			resultMatrixRow.push( row.reduce( function( resultMatrixColumn, cell ){

				resultMatrixColumn.push( cell * s )
				return resultMatrixColumn
			
			}, [] ))
			return resultMatrixRow

		}, [] ))
	},
	multiply: function( m1 ){

		`
		Two matrices can be multiplied only when 
		the number of columns in the first matrix
		equals the number of rows in the second matrix.
		Reminder: Matrix multiplication is not commutative
		so the order in which you multiply matters.


			SEE ALSO

		https://en.wikipedia.org/wiki/Matrix_multiplication
		`

		const m0 = this
		if( m1 instanceof Q.Matrix !== true ){

			return Q.error( `Attempted to multiply this Matrix#${m0.index} by something that was not a Matrix.` )
		}
		if( m0.columns.length !== m1.rows.length ){

			return Q.error( `Attempted to multiply Matrix#${m0.index}(cols==${m0.columns.length}) by Matrix#${m1.index}(rows==${m1.rows.length}).` )
		}
		const resultMatrix = []
		m0.rows.forEach( function( m0Row ){//  Each row of THIS matrix

			const resultMatrixRow = []
			m1.columns.forEach( function( m1Column ){//  Each column of OTHER matrix

				let sum = 0
				m1Column.forEach( function( m1Cell, index ){//  Work down the column of OTHER matrix

					sum += m0Row[ index ] * m1Cell
				})
				resultMatrixRow.push( sum )
			})
			resultMatrix.push( resultMatrixRow )
		})
		return new Q.Matrix( ...resultMatrix )
	},
	multiplyTensor: function( m1 ){

		`
		https://en.wikipedia.org/wiki/Tensor_product
		`

		const m0 = this
		return this
	}
})



