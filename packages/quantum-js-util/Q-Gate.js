
//  Copyright © 2019–2020, Stewart Smith. See LICENSE for details.

const mathf = require('./Math-Functions');
const logger = require('./Logging');
const { ComplexNumber } = require('./Q-ComplexNumber');
const {Matrix} = require('./Q-Matrix');
Gate = function( params ){

	Object.assign( this, params )
	this.index = Gate.index ++
	
	if( typeof this.symbol !== 'string' ) this.symbol = '?'
	const parameters = Object.assign( {}, params.parameters )
	this.parameters = parameters
	
	//  We use symbols as unique identifiers
	//  among gate CONSTANTS
	//  so if you use the same symbol for a non-constant
	//  that’s not a deal breaker
	//  but it is good to know.

	const 
	scope = this,
	foundConstant = Object
	.values( Gate.constants )
	.find( function( gate ){ 

		return gate.symbol === scope.symbol
	})

	if( foundConstant ){
		
		logger.warn( `Gate is creating a new instance, #${ this.index }, that uses the same symbol as a pre-existing Gate constant:`, foundConstant )
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
	
	//Hi there. LTNLN here. We're just gonna toss the applyToQubit function entirely...Gate from here on is independent of Qubit! :)..
}



Object.assign( Gate, {
	
	index: 0,
	constants: {},
	createConstant:  function( key, value ){
		this[ key ] = value
		this.constants[ key ] = this[ key ]
		Object.freeze( this[ key ])
	},
	createConstants: function(){

		if( arguments.length % 2 !== 0 ){

			return logger.error( 'Q attempted to create constants with invalid (KEY, VALUE) pairs.' )
		}
		for( let i = 0; i < arguments.length; i += 2 ){

			this.createConstant( arguments[ i ], arguments[ i + 1 ])
		}
	},
	findBy: function( key, value ){

		return (
			
			Object
			.values( Gate.constants )
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

		return Gate.findBy( 'symbol', symbol )
	},
	findByName: function( name ){

		return Gate.findBy( 'name', name )
	},
	findByNameCss: function( nameCss  ) {
		return Gate.findBy( 'nameCss', nameCss )
	}
})




Object.assign( Gate.prototype, {

	clone: function( params ){

		return new Gate( Object.assign( {}, this, params ))
	},
	set$: function( key, value ){

		this[ key ] = value
		return this
	},
	setSymbol$: function( value ){

		return this.set$( 'symbol', value )
	}
})




Gate.createConstants (


	//  Operate on a single qubit.

	'IDENTITY', new Gate({

		symbol:    'I',
		symbolAmazonBraket: 'i',
		symbolSvg: '',
		name:      'Identity',
		nameCss:   'identity',
		matrix: Matrix.IDENTITY_2X2
	}),
	'CURSOR', new Gate({

		symbol:    '*',
		symbolAmazonBraket: 'i',
		symbolSvg: '',
		name:      'Identity',
		nameCss:   'identity',
		matrix: Matrix.IDENTITY_2X2
	}),
	'MEASURE', new Gate({

		symbol:    'M',
		symbolAmazonBraket: 'm',
		symbolSvg: '',
		name:      'Measure',
		nameCss:   'measure',
		matrix: Matrix.IDENTITY_2X2,
	}),
	'HADAMARD', new Gate({

		symbol:    'H',
		symbolAmazonBraket: 'h',
		symbolSvg: '',
		name:      'Hadamard',
		nameCss:   'hadamard',
		matrix: new Matrix(
			[ Math.SQRT1_2,  Math.SQRT1_2 ],
			[ Math.SQRT1_2, -Math.SQRT1_2 ])
	}),
	'PAULI_X', new Gate({

		symbol:    'X',
		symbolAmazonBraket: 'x',
		symbolSvg: '',
		name:      'Pauli X',
		nameCss:   'pauli-x',
		matrix: new Matrix(
			[ 0, 1 ],
			[ 1, 0 ]),
		//ltnln: NOTE! can_be_controlled refers to whether or not the Braket SDK supports a controlled
		//application of this gate; if we want Q to be able to support controlled gated regardless of whether
		//or not Braket can, this must be changed..
		can_be_controlled:  true
		},
	),
	'PAULI_Y', new Gate({

		symbol:    'Y',
		symbolAmazonBraket: 'y',
		symbolSvg: '',
		name:      'Pauli Y',
		nameCss:   'pauli-y',
		matrix: new Matrix(
			[ 0, new ComplexNumber( 0, -1 )],
			[ new ComplexNumber( 0, 1 ), 0 ]),
		can_be_controlled:  true
		},
	),
	'PAULI_Z', new Gate({

		symbol:    'Z',
		symbolAmazonBraket: 'z',
		symbolSvg: '',
		name:      'Pauli Z',
		nameCss:   'pauli-z',
		matrix: new Matrix(
			[ 1,  0 ],
			[ 0, -1 ]),
		can_be_controlled:  true
		},
		),
	'PHASE', new Gate({

		symbol:    'P',
		symbolAmazonBraket: 'phaseshift',//  ltnln edit: change from 'p' to 'phaseshift'
		symbolSvg: '',
		name:      'Phase',
		nameCss:   'phase',
		parameters: { "phi" : 1 },
		updateMatrix$: function( phi ){
			if( mathf.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ]  = +phi;
			this.matrix = new Matrix(
				[ 1, 0 ],
				[ 0, ComplexNumber.E.power( new ComplexNumber( 0, this.parameters[ "phi" ] ))])
			return this
		},
		can_be_controlled:  true,
		has_parameters:		true
	}),
	'PI_8', new Gate({

		symbol:    'T',
		symbolAmazonBraket: 't',//  !!! Double check this !!!
		symbolSvg: '',
		name:      'π ÷ 8',
		nameCss:   'pi8',
		matrix: new Matrix(
			[ 1, 0 ],
			[ 0, ComplexNumber.E.power( new ComplexNumber( 0, Math.PI / 4 )) ])
	}),
	'BLOCH', new Gate({

		symbol:    'B',
		//symbolAmazonBraket: Does not exist.
		symbolSvg: '',
		name:      'Bloch sphere',
		nameCss:   'bloch',
		// applyToQubit: function( qubit ){

		// 	//  Create Bloch sphere visualizer instance.
		// }
	}),
	'RX', new Gate({

		symbol:		'Rx',
		symbolAmazonBraket:	'rx', 
		symbolSvg:  '', 
		name:       'X Rotation', 
		nameCss: 	'x-rotation', 
		parameters: { "phi" : Math.PI / 2 },
		updateMatrix$: function( phi ){

			if( mathf.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ] = +phi
			this.matrix = new Matrix(
				[ Math.cos( this.parameters[ "phi" ] / 2 ), new ComplexNumber( 0, -Math.sin( this.parameters[ "phi" ] / 2 )) ],
				[ new ComplexNumber( 0, -Math.sin( this.parameters[ "phi" ] / 2 )), Math.cos( this.parameters[ "phi" ] / 2 )])
			return this
		},
		has_parameters:		true
	}),
	'RY', new Gate({

		symbol:		'Ry',
		symbolAmazonBraket:	'ry', 
		symbolSvg:  '', 
		name:       'Y Rotation', 
		nameCss: 	'y-rotation',
		parameters: { "phi" : Math.PI / 2 },
		updateMatrix$: function( phi ){

			if( mathf.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ] = +phi
			this.matrix = new Matrix(
				[ Math.cos( this.parameters[ "phi" ] / 2 ), -Math.sin( phi / 2 ) ],
				[ Math.sin( this.parameters[ "phi" ] / 2 ), Math.cos( this.parameters[ "phi" ] / 2 )])
			return this
		},
		has_parameters:		true
	}),
	'RZ', new Gate({

		symbol:		'Rz',
		symbolAmazonBraket:	'rz', 
		symbolSvg:  '', 
		name:       'Z Rotation', 
		nameCss: 	'z-rotation',
		parameters: { "phi" : Math.PI / 2 },
		updateMatrix$: function( phi ){

			if( mathf.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ] = +phi
			this.matrix = new Matrix(
				[ ComplexNumber.E.power( new ComplexNumber( 0, -this.parameters[ "phi" ] / 2 )), 0 ],
				[ 0, ComplexNumber.E.power( new ComplexNumber( 0, this.parameters[ "phi" ] / 2 ))])
			return this
		},
		has_parameters:		true
	}),
	'UNITARY', new Gate({

		symbol:    'U',
		symbolAmazonBraket: 'unitary',
		symbolSvg: '',
		name:      'Unitary',
		nameCss:   'unitary',
		//toAmazonBraket will have to use the following matrix as an argument for unitary()
		parameters: { "phi" : Math.PI / 2,
					"theta" : Math.PI / 2,
					"lambda" : Math.PI / 2 },
		updateMatrix$: function( phi, theta, lambda ){

			if( (mathf.isUsefulNumber( +phi ) === true) && (mathf.isUsefulNumber( +theta ) === true) && (mathf.isUsefulNumber( +lambda ) === true) ) {
				this.parameters[ "phi" ] = +phi;
				this.parameters[ "theta" ] = +theta;
				this.parameters[ "lambda" ] = +lambda;
			} 
			const a = ComplexNumber.multiply(
				ComplexNumber.E.power( new ComplexNumber( 0, -( this.parameters[ "phi" ] + this.parameters[ "lambda" ] ) / 2 )),  Math.cos( this.parameters[ "theta" ] / 2 ))
			const b = ComplexNumber.multiply(
					ComplexNumber.E.power( new ComplexNumber( 0, -( this.parameters[ "phi" ] - this.parameters[ "lambda" ] ) / 2 )), -Math.sin( this.parameters[ "theta" ] / 2 ))
			const c = ComplexNumber.multiply(
				ComplexNumber.E.power( new ComplexNumber( 0, ( this.parameters[ "phi" ] - this.parameters[ "lambda" ] ) / 2 )), Math.sin( this.parameters[ "theta" ] / 2 ))
			const d = ComplexNumber.multiply(
				ComplexNumber.E.power( new ComplexNumber( 0, ( this.parameters[ "phi" ] + this.parameters[ "lambda" ] ) / 2 )), Math.cos( this.parameters[ "theta" ] / 2 ))
			this.matrix = new Matrix(
				[ a, b ], 
				[ c, d ])
			return this
		},
		has_parameters:		true
	}),
	'NOT1_2', new Gate({

		symbol:    'V',
		symbolAmazonBraket: 'v',
		symbolSvg: '',
		name:      '√Not',
		nameCss:   'not1-2',
		matrix: new Matrix(
			[ new ComplexNumber( 1, 1 ) / 2,  new ComplexNumber( 1, -1 ) / 2 ],
			[ new ComplexNumber( 1, -1 ) / 2, new ComplexNumber( 1, 1 ) / 2 ])
	}),
	'PI_8_Dagger', new Gate({

		symbol:    'T†',
		symbolAmazonBraket: 'ti',
		symbolSvg: '',
		name:      'PI_8_Dagger',
		nameCss:   'pi8-dagger',
		matrix: new Matrix(
			[ 1, 0 ],
			[ 0, ComplexNumber.E.power( new ComplexNumber( 0, -Math.PI / 4 )) ])
	}),
	'NOT1_2_Dagger', new Gate({

		symbol:    'V†',
		symbolAmazonBraket: 'vi',
		symbolSvg: '',
		name:      '√Not_Dagger',
		nameCss:   'not1-2-dagger',
		matrix: new Matrix(
			[ new ComplexNumber( 1, -1 ) / 2,  new ComplexNumber( 1, 1 ) / 2 ],
			[ new ComplexNumber( 1, 1 ) / 2, new ComplexNumber( 1, -1 ) / 2 ])
	}),
	//Note that S, S_Dagger, PI_8, and PI_8_Dagger can all be implemented by applying the PHASE gate
	//using certain values of phi. 
	//These gates are included for completeness. 
	'S', new Gate({
		symbol:    'S*', //Gotta think of a better symbol name...
		symbolAmazonBraket: 's',
		symbolSvg: '',
		name:      'π ÷ 4',
		nameCss:   'pi4',
		matrix: new Matrix(
			[ 1, 0 ],
			[ 0, new ComplexNumber( 0, 1 ) ])
	}),
	'S_Dagger', new Gate({

		symbol:    'S†',
		symbolAmazonBraket: 'si',
		symbolSvg: '',
		name:      'π ÷ 4 Dagger',
		nameCss:   'pi4-dagger',
		matrix: new Matrix(
			[ 1, 0 ],
			[ 0, ComplexNumber.E.power( new ComplexNumber( 0, -1 )) ])
	}),
	//  Operate on 2 qubits.
	'SWAP', new Gate({

		symbol:    'S', 
		symbolAmazonBraket: 'swap',
		symbolSvg: '',
		name:      'Swap',
		nameCss:   'swap',
		parameters: { "phi" : 0.0 },
		updateMatrix$: function( phi ) {
			
			if( mathf.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ] = +phi
			this.matrix = new Matrix(
				[ 1, 0, 0, 0 ],
				[ 0, 0, ComplexNumber.E.power( new ComplexNumber( 0, this.parameters[ "phi" ] )), 0 ],
				[ 0, ComplexNumber.E.power(new ComplexNumber( 0, this.parameters[ "phi" ] )), 0, 0 ],
				[ 0, 0, 0, 1 ])
			return this
		},
		can_be_controlled:  true,
		has_parameters: 	true,
		is_multi_qubit: 	true
	}),
	'SWAP1_2', new Gate({

		symbol:    '√S',
		//symbolAmazonBraket: !!! UNKNOWN !!!
		symbolSvg: '',
		name:      '√Swap',
		nameCss:   'swap1-2',
		matrix: new Matrix(
			[ 1, 0, 0, 0 ],
			[ 0, new ComplexNumber( 0.5,  0.5 ), new ComplexNumber( 0.5, -0.5 ), 0 ],
			[ 0, new ComplexNumber( 0.5, -0.5 ), new ComplexNumber( 0.5,  0.5 ), 0 ],
			[ 0, 0, 0, 1 ]),
		is_multi_qubit: 	true
	}),
	'ISWAP', new Gate({
		
		symbol:    'iS',
		symbolAmazonBraket: 'iswap',
		symbolSvg: '',
		name:      'Imaginary Swap',
		nameCss:   'iswap',
		matrix: new Matrix(
			[ 1, 0, 0, 0 ],
			[ 0, 0, new ComplexNumber( 0, 1 ), 0 ],
			[ 0, new ComplexNumber( 0, 1 ), 0, 0 ],
			[ 0, 0, 0, 1 ]),
			is_multi_qubit:	true
	}),
	'ISING-XX', new Gate({

		symbol:    'XX', 
		symbolAmazonBraket: 'xx', 
		symbolSvg: '', 
		name:      'Ising XX Coupling',
		nameCss:   'ising-xx-coupling',
		parameters: { "phi" : 1 },
		updateMatrix$: function( phi ) {
			
			if( mathf.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ] = +phi
			this.matrix = new Matrix(
				[ Math.cos( this.parameters[ "phi" ] / 2 ), 0, 0, new ComplexNumber( 0, -Math.sin( this.parameters[ "phi" ] / 2 )) ],
				[ 0, Math.cos( this.parameters[ "phi" ] / 2 ), new ComplexNumber( 0, -Math.sin( this.parameters[ "phi" ] / 2 )), 0 ],
				[ 0, new ComplexNumber( 0, -Math.sin( this.parameters[ "phi" ] / 2 )), Math.cos( this.parameters[ "phi" ] / 2 ), 0 ],
				[ new ComplexNumber( 0, -Math.sin( this.parameters[ "phi" ] / 2 )), 0, 0, Math.cos( this.parameters[ "phi" ] / 2 ) ])
			return this
		},
		is_multi_qubit: true,
		has_parameters:		true 
	}), 
	'ISING-XY', new Gate({

		symbol:    'XY', 
		symbolAmazonBraket: 'xy', 
		symbolSvg: '', 
		name:      'Ising XY Coupling',
		nameCss:   'ising-xy-coupling',
		parameters: { "phi" : 1 },
		updateMatrix$: function( phi ) {
			
			if( mathf.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ] = +phi
			this.matrix = new Matrix(
				[ 1, 0, 0, 0 ],
				[ 0, Math.cos( this.parameters[ "phi" ] / 2 ), new ComplexNumber( 0, Math.sin( this.parameters[ "phi" ] / 2 )), 0 ],
				[ 0, new ComplexNumber( 0, Math.sin( this.parameters[ "phi" ] / 2 )), Math.cos( this.parameters[ "phi" ] / 2 ), 0 ],
				[ 0, 0, 0, 1 ])
			return this
		},
		is_multi_qubit: true,
		has_parameters:		true	 	 
	}), 
	'ISING-YY', new Gate({
		
		symbol:    'YY', 
		symbolAmazonBraket: 'yy', 
		symbolSvg: '', 
		name:      'Ising YY Coupling',
		nameCss:   'ising-yy-coupling',
		parameters: { "phi" : 1 },
		updateMatrix$: function( phi ) {
			
			if( mathf.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ] = +phi
			this.matrix = new Matrix(
				[ Math.cos( this.parameters[ "phi" ] / 2 ), 0, 0, new ComplexNumber( 0, Math.sin( this.parameters[ "phi" ] / 2 )) ],
				[ 0, Math.cos( this.parameters[ "phi" ] / 2 ), new ComplexNumber( 0, -Math.sin( this.parameters[ "phi" ] / 2 )), 0 ],
				[ 0, new ComplexNumber( 0, -Math.sin( this.parameters[ "phi" ] / 2 )), Math.cos( this.parameters[ "phi" ] / 2 ), 0 ],
				[ new ComplexNumber( 0, -Math.sin( this.parameters[ "phi" ] / 2 )), 0, 0, Math.cos( this.parameters[ "phi" ] / 2 ) ])
			return this
		},
		is_multi_qubit: true,
		has_parameters:		true
	}), 
	'ISING-ZZ', new Gate({

		symbol:    'ZZ', 
		symbolAmazonBraket: 'zz', 
		symbolSvg: '', 
		name:      'Ising ZZ Coupling',
		nameCss:   'ising-zz-coupling',
		parameters: { "phi" : 1 },
		updateMatrix$: function( phi ) {
			
			if( mathf.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ] = +phi
			this.matrix = new Matrix(
				[ ComplexNumber.E.power( new ComplexNumber( 0, this.parameters[ "phi" ] / 2 )), 0, 0, 0 ],
				[ 0, ComplexNumber.E.power( new ComplexNumber( 0, this.parameters[ "phi" ] / 2 )), 0, 0 ],
				[ 0, 0, ComplexNumber.E.power( new ComplexNumber( 0, this.parameters[ "phi" ] / 2 )), 0],
				[ 0, 0, 0, ComplexNumber.E.power( new ComplexNumber( 0, -this.parameters[ "phi" ] / 2 )) ])
			return this
		},
		is_multi_qubit: true,
		has_parameters:		true	 
	}), 
	'CPhase00', new Gate({

		symbol:    '00', //placeholder 
		symbolAmazonBraket: 'cphaseshift00', 
		symbolSvg: '', 
		name:      'Controlled Phase Shift 00',
		nameCss:   'cphase00',
		parameters: { "phi" : 1 },
		updateMatrix$: function( phi ) {
			
			if( mathf.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ] = +phi
			this.matrix = new Matrix(
				[ ComplexNumber.E.power( new ComplexNumber( 0, this.parameters[ "phi" ] )), 0, 0, 0 ],
				[ 0, 1, 0, 0 ],
				[ 0, 0, 1, 0 ],
				[ 0, 0, 0, 1 ])
			return this
		},
		is_multi_qubit: true,
		has_parameters:		true	 	 
	}),
	'CPhase01', new Gate({

		symbol:    '01', //placeholder 
		symbolAmazonBraket: 'cphaseshift01', 
		symbolSvg: '', 
		name:      'Controlled Phase Shift 01',
		nameCss:   'cphase01',
		parameters: { "phi" : 1 },
		updateMatrix$: function( phi ) {
			
			if( mathf.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ] = +phi
			this.matrix = new Matrix(
				[ 1, 0, 0, 0 ],
				[ 0, ComplexNumber.E.power( new ComplexNumber( 0, this.parameters[ "phi" ] )), 0, 0 ],
				[ 0, 0, 1, 0 ],
				[ 0, 0, 0, 1 ])
			return this
		},
		is_multi_qubit: true,
		has_parameters:		true	 	 
	}),
	'CPhase10', new Gate({

		symbol:    '10', //placeholder 
		symbolAmazonBraket: 'cphaseshift10', 
		symbolSvg: '', 
		name:      'Controlled Phase Shift 10',
		nameCss:   'cphase01',
		parameters: { "phi" : 1 },
		updateMatrix$: function( phi ) {
			
			if( mathf.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ] = +phi
			this.matrix = new Matrix(
				[ 1, 0, 0, 0 ],
				[ 0, 1, 0, 0 ],
				[ 0, 0, ComplexNumber.E.power( new ComplexNumber( 0, this.parameters[ "phi" ] )), 0 ],
				[ 0, 0, 0, 1 ])
			return this
		},
		is_multi_qubit: 	true,
		has_parameters:		true	 
	}), 
	'CSWAP', new Gate({

		symbol:    'CSWAP',
		symbolAmazonBraket: 'cswap', 
		symbolSvg: '', 
		name:      'Controlled Swap',
		nameCss:   'controlled-swap',
		matrix: new Matrix(
			[1, 0, 0, 0, 0, 0, 0, 0],
			[0, 1, 0, 0, 0, 0, 0, 0],
			[0, 0, 1, 0, 0, 0, 0, 0],
			[0, 0, 0, 1, 0, 0, 0, 0],
			[0, 0, 0, 0, 1, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 1, 0],
			[0, 0, 0, 0, 0, 1, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 1]
		)
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



module.exports = { Gate };