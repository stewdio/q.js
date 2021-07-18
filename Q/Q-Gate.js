
//  Copyright © 2019–2020, Stewart Smith. See LICENSE for details.




Q.Gate = function( params ){

	Object.assign( this, params )
	this.index = Q.Gate.index ++
	
	if( typeof this.symbol !== 'string' ) this.symbol = '?'
	if( typeof this.symbolAmazonBraket !== 'string' ) this.symbolAmazonBraket = this.symbol.toLowerCase()
	
	
	//  We use symbols as unique identifiers
	//  among gate CONSTANTS
	//  so if you use the same symbol for a non-constant
	//  that’s not a deal breaker
	//  but it is good to know.

	const 
	scope = this,
	foundConstant = Object
	.values( Q.Gate.constants )
	.find( function( gate ){ 

		return gate.symbol === scope.symbol
	})

	if( foundConstant ){
		
		Q.warn( `Q.Gate is creating a new instance, #${ this.index }, that uses the same symbol as a pre-existing Gate constant:`, foundConstant )
	}

	if( typeof this.name    !== 'string' ) this.name    = 'Unknown'
	if( typeof this.nameCss !== 'string' ) this.nameCss = 'unknown'


	//  If our gate’s matrix is to be 
	//  dynamically created or updated
	//  then we ouoght to do that now.

	if( typeof this.updateMatrix$ === 'function' ) this.updateMatrix$()


	//  Every gate must have an applyToQubit method.
	//  If it doesn’t exist we’ll create one
	//  based on whether a matrix property exists or not.

	if( typeof this.applyToQubit !== 'function' ){

		if( this.matrix instanceof Q.Matrix === true ){
		
			this.applyToQubit = function( qubit ){ 

				return new Q.Qubit( this.matrix.multiply( qubit ))
			}
		}
		else {

			this.applyToQubit = function( qubit ){ return qubit }
		}
	}
}




Object.assign( Q.Gate, {

	index: 0,
	constants: {},
	createConstant:  Q.createConstant,
	createConstants: Q.createConstants,
	findBy: function( key, value ){

		return (
			
			Object
			.values( Q.Gate.constants )
			.find( function( item ){

				if( typeof value === 'string' && 
					typeof item[ key ] === 'string' ){

					return value.toLowerCase() === item[ key ].toLowerCase()
				}
				return value === item[ key ]
			})
		)
	},
	findBySymbol: function( symbol ){

		return Q.Gate.findBy( 'symbol', symbol )
	},
	findByName: function( name ){

		return Q.Gate.findBy( 'name', name )
	}
})




Object.assign( Q.Gate.prototype, {

	clone: function( params ){

		return new Q.Gate( Object.assign( {}, this, params ))
	},
	applyToQubits: function(){

		return Array.from( arguments ).map( this.applyToQubit.bind( this ))
	},
	set$: function( key, value ){

		this[ key ] = value
		return this
	},
	setSymbol$: function( value ){

		return this.set$( 'symbol', value )
	}
})




Q.Gate.createConstants(


	//  Operate on a single qubit.

	'IDENTITY', new Q.Gate({

		symbol:    'I',
		symbolAmazonBraket: 'i',
		symbolSvg: '',
		name:      'Identity',
		nameCss:   'identity',
		matrix: Q.Matrix.IDENTITY_2X2
	}),
	'CURSOR', new Q.Gate({

		symbol:    '*',
		symbolAmazonBraket: 'i',
		symbolSvg: '',
		name:      'Identity',
		nameCss:   'identity',
		matrix: Q.Matrix.IDENTITY_2X2
	}),
	'MEASURE', new Q.Gate({

		symbol:    'M',
		symbolAmazonBraket: 'm',
		symbolSvg: '',
		name:      'Measure',
		nameCss:   'measure',
		matrix: Q.Matrix.IDENTITY_2X2,
		applyToQubit: function( state ){}
	}),
	'HADAMARD', new Q.Gate({

		symbol:    'H',
		symbolAmazonBraket: 'h',
		symbolSvg: '',
		name:      'Hadamard',
		nameCss:   'hadamard',
		matrix: new Q.Matrix(
			[ Math.SQRT1_2,  Math.SQRT1_2 ],
			[ Math.SQRT1_2, -Math.SQRT1_2 ])
	}),
	'PAULI_X', new Q.Gate({

		symbol:    'X',
		symbolAmazonBraket: 'x',
		symbolSvg: '',
		name:      'Pauli X',
		nameCss:   'pauli-x',
		matrix: new Q.Matrix(
			[ 0, 1 ],
			[ 1, 0 ])
	}),
	'PAULI_Y', new Q.Gate({

		symbol:    'Y',
		symbolAmazonBraket: 'y',
		symbolSvg: '',
		name:      'Pauli Y',
		nameCss:   'pauli-y',
		matrix: new Q.Matrix(
			[ 0, new Q.ComplexNumber( 0, -1 )],
			[ new Q.ComplexNumber( 0, 1 ), 0 ])
	}),
	'PAULI_Z', new Q.Gate({

		symbol:    'Z',
		symbolAmazonBraket: 'z',
		symbolSvg: '',
		name:      'Pauli Z',
		nameCss:   'pauli-z',
		matrix: new Q.Matrix(
			[ 1,  0 ],
			[ 0, -1 ])
	}),
	'PHASE', new Q.Gate({

		symbol:    'P',
		symbolAmazonBraket: 'p',//  !!! Double check this !!!
		symbolSvg: '',
		name:      'Phase',
		nameCss:   'phase',
		phi:        1,
		updateMatrix$: function( phi ){

			if( Q.isUsefulNumber( phi ) === true ) this.phi = phi
			this.matrix = new Q.Matrix(
				[ 1, 0 ],
				[ 0, Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, this.phi ))])
			return this
		},
		applyToQubit: function( qubit, phi ){

			if( Q.isUsefulNumber( phi ) !== true ) phi = this.phi
			const matrix = new Q.Matrix(
				[ 1, 0 ],
				[ 0, Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, phi ))])
			return new Q.Qubit( matrix.multiply( qubit ))
		}
	}),
	'PI_8', new Q.Gate({

		symbol:    'T',
		symbolAmazonBraket: 't',//  !!! Double check this !!!
		symbolSvg: '',
		name:      'π ÷ 8',
		nameCss:   'pi8',
		matrix: new Q.Matrix(
			[ 1, 0 ],
			[ 0, Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, Math.PI / 4 )) ])
	}),
	'BLOCH', new Q.Gate({

		symbol:    'B',
		//symbolAmazonBraket: Does not exist.
		symbolSvg: '',
		name:      'Bloch sphere',
		nameCss:   'bloch',
		applyToQubit: function( qubit ){

			//  Create Bloch sphere visualizer instance.
		}
	}),


	//  Operate on 2 qubits.

	'SWAP', new Q.Gate({

		symbol:    'S',
		symbolAmazonBraket: 's',//  !!! Double check this !!!
		symbolSvg: '',
		name:      'Swap',
		nameCss:   'swap',
		matrix: new Q.Matrix(
			[ 1, 0, 0, 0 ],
			[ 0, 0, 1, 0 ],
			[ 0, 1, 0, 0 ],
			[ 0, 0, 0, 1 ])
	}),
	'SWAP1_2', new Q.Gate({

		symbol:    '√S',
		//symbolAmazonBraket: !!! UNKNOWN !!!
		symbolSvg: '',
		name:      '√Swap',
		nameCss:   'swap1-2',
		matrix: new Q.Matrix(
			[ 1, 0, 0, 0 ],
			[ 0, new Q.ComplexNumber( 0.5,  0.5 ), new Q.ComplexNumber( 0.5, -0.5 ), 0 ],
			[ 0, new Q.ComplexNumber( 0.5, -0.5 ), new Q.ComplexNumber( 0.5,  0.5 ), 0 ],
			[ 0, 0, 0, 1 ])
	})
	/*


	All further gates,
	such as Toffoli (CCNOT)
	or Fredkin (CSWAP)
	can be easily constructed
	from the above gates
	using Q conveniences.


	*/
)	



