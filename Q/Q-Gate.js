//  Copyright © 2019–2020, Stewart Smith. See LICENSE for details.


	Q.Gate = function( params ){
	
		Object.assign( this, params )
		this.index = Q.Gate.index ++
		
		if( typeof this.symbol !== 'string' ) this.symbol = '?'
		if( typeof this.symbolAmazonBraket !== 'string' ) this.symbolAmazonBraket = this.symbol.toLowerCase()
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
	
	
	
	
	Q.Gate.createConstants (
	
	
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
				[ 1, 0 ]),
			//ltnln: NOTE! can_be_controlled refers to whether or not the Braket SDK supports a controlled
			//application of this gate; if we want Q to be able to support controlled gated regardless of whether
			//or not Braket can, this must be changed..
			can_be_controlled:  true
			},
		),
		'PAULI_Y', new Q.Gate({
	
			symbol:    'Y',
			symbolAmazonBraket: 'y',
			symbolSvg: '',
			name:      'Pauli Y',
			nameCss:   'pauli-y',
			matrix: new Q.Matrix(
				[ 0, new Q.ComplexNumber( 0, -1 )],
				[ new Q.ComplexNumber( 0, 1 ), 0 ]),
			can_be_controlled:  true
			},
		),
		'PAULI_Z', new Q.Gate({
	
			symbol:    'Z',
			symbolAmazonBraket: 'z',
			symbolSvg: '',
			name:      'Pauli Z',
			nameCss:   'pauli-z',
			matrix: new Q.Matrix(
				[ 1,  0 ],
				[ 0, -1 ]),
			can_be_controlled:  true
			},
			),
		'PHASE', new Q.Gate({
	
			symbol:    'P',
			symbolAmazonBraket: 'phaseshift',//  ltnln edit: change from 'p' to 'phaseshift'
			symbolSvg: '',
			name:      'Phase',
			nameCss:   'phase',
			parameters: { "phi" : 1 },
			updateMatrix$: function( phi ){
				if( Q.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ]  = +phi;
				this.matrix = new Q.Matrix(
					[ 1, 0 ],
					[ 0, Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, this.parameters[ "phi" ] ))])
				return this
			},
			applyToQubit: function( qubit, phi ){
	
				if( Q.isUsefulNumber( phi ) !== true ) phi = this.parameters[ "phi" ]
				const matrix = new Q.Matrix(
					[ 1, 0 ],
					[ 0, Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, phi ))])
				return new Q.Qubit( matrix.multiply( qubit ))
			},
			can_be_controlled:  true,
			has_parameters:		true
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
		'RX', new Q.Gate({
	
			symbol:		'Rx',
			symbolAmazonBraket:	'rx', 
			symbolSvg:  '', 
			name:       'X Rotation', 
			nameCss: 	'x-rotation', 
			parameters: { "phi" : Math.PI / 2 },
			updateMatrix$: function( phi ){
	
				if( Q.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ] = +phi
				this.matrix = new Q.Matrix(
					[ Math.cos( this.parameters[ "phi" ] / 2 ), new Q.ComplexNumber( 0, -Math.sin( this.parameters[ "phi" ] / 2 )) ],
					[ new Q.ComplexNumber( 0, -Math.sin( this.parameters[ "phi" ] / 2 )), Math.cos( this.parameters[ "phi" ] / 2 )])
				return this
			},
			applyToQubit: function( qubit, phi ){
	
				if( Q.isUsefulNumber( phi ) !== true ) phi = this.parameters[ "phi" ]
				const matrix = new Q.Matrix(
					[ Math.cos( phi / 2 ), new Q.ComplexNumber( 0, -Math.sin( phi / 2 )) ],
					[ new Q.ComplexNumber( 0, -Math.sin( phi / 2 )), Math.cos( phi / 2 )])
				return new Q.Qubit( matrix.multiply( qubit ))
			},
			has_parameters:		true
		}),
		'RY', new Q.Gate({
	
			symbol:		'Ry',
			symbolAmazonBraket:	'ry', 
			symbolSvg:  '', 
			name:       'Y Rotation', 
			nameCss: 	'y-rotation',
			parameters: { "phi" : Math.PI / 2 },
			updateMatrix$: function( phi ){
	
				if( Q.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ] = +phi
				this.matrix = new Q.Matrix(
					[ Math.cos( this.parameters[ "phi" ] / 2 ), -Math.sin( phi / 2 ) ],
					[ Math.sin( this.parameters[ "phi" ] / 2 ), Math.cos( this.parameters[ "phi" ] / 2 )])
				return this
			},
			applyToQubit: function( qubit, phi ){
	
				if( Q.isUsefulNumber( phi ) !== true ) phi = this.parameters[ "phi" ]
				const matrix = new Q.Matrix(
					[ Math.cos( phi / 2 ), -Math.sin( phi / 2 ) ],
					[ Math.sin( phi / 2 ), Math.cos( phi / 2 )])
				return new Q.Qubit( matrix.multiply( qubit ))
			},
			has_parameters:		true
		}),
		'RZ', new Q.Gate({
	
			symbol:		'Rz',
			symbolAmazonBraket:	'rz', 
			symbolSvg:  '', 
			name:       'Z Rotation', 
			nameCss: 	'z-rotation',
			parameters: { "phi" : Math.PI / 2 },
			updateMatrix$: function( phi ){
	
				if( Q.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ] = +phi
				this.matrix = new Q.Matrix(
					[ Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, -this.parameters[ "phi" ] / 2 )), 0 ],
					[ 0, Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, this.parameters[ "phi" ] / 2 ))])
				return this
			},
			applyToQubit: function( qubit, phi ){
	
				if( Q.isUsefulNumber( phi ) !== true ) phi = this.parameters[ "phi" ]
				const matrix = new Q.Matrix(
					[ Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, -phi / 2 )), 0 ],
					[ 0, Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, phi / 2 ))])
				return new Q.Qubit( matrix.multiply( qubit ))
			},
			has_parameters:		true
		}),
		'UNITARY', new Q.Gate({
	
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
	
				if( (Q.isUsefulNumber( +phi ) === true) && (Q.isUsefulNumber( +theta ) === true) && (Q.isUsefulNumber( +lambda ) === true) ) {
					this.parameters[ "phi" ] = +phi;
					this.parameters[ "theta" ] = +theta;
					this.parameters[ "lambda" ] = +lambda;
				} 
				const a = Q.ComplexNumber.multiply(
					Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, -( this.parameters[ "phi" ] + this.parameters[ "lambda" ] ) / 2 )),  Math.cos( this.parameters[ "theta" ] / 2 ))
				const b = Q.ComplexNumber.multiply(
						Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, -( this.parameters[ "phi" ] - this.parameters[ "lambda" ] ) / 2 )), -Math.sin( this.parameters[ "theta" ] / 2 ))
				const c = Q.ComplexNumber.multiply(
					Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, ( this.parameters[ "phi" ] - this.parameters[ "lambda" ] ) / 2 )), Math.sin( this.parameters[ "theta" ] / 2 ))
				const d = Q.ComplexNumber.multiply(
					Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, ( this.parameters[ "phi" ] + this.parameters[ "lambda" ] ) / 2 )), Math.cos( this.parameters[ "theta" ] / 2 ))
				this.matrix = new Q.Matrix(
					[ a, b ], 
					[ c, d ])
				return this
			},
			applyToQubit: function( qubit, phi, theta, lambda ){
				if( Q.isUsefulNumber( phi ) === true ) phi = this.parameters[ "phi" ]
				if( Q.isUsefulNumber( theta ) === true ) theta = this.parameters[ "theta" ]
				if( Q.isUsefulNumber( lambda ) === true ) lambda = this.parameters[ "lambda" ]
				const a = Q.ComplexNumber.multiply(
					Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, -( phi + lambda ) / 2 )),  Math.cos( theta / 2 ));
				const b = Q.ComplexNumber.multiply(
						Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, -( phi - lambda ) / 2 )), -Math.sin( theta / 2 ));
				const c = Q.ComplexNumber.multiply(
					Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, ( phi - lambda ) / 2 )), Math.sin( theta / 2 ));
				const d = Q.ComplexNumber.multiply(
					Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, ( phi + lambda ) / 2 )), Math.cos( theta / 2 ));
				const matrix = new Q.Matrix(
					[ a, b ],
					[ c, d ])
				return new Q.Qubit( matrix.multiply( qubit ))
			},
			has_parameters:		true
		}),
		'NOT1_2', new Q.Gate({
	
			symbol:    'V',
			symbolAmazonBraket: 'v',
			symbolSvg: '',
			name:      '√Not',
			nameCss:   'not1-2',
			matrix: new Q.Matrix(
				[ new Q.ComplexNumber( 1, 1 ) / 2,  new Q.ComplexNumber( 1, -1 ) / 2 ],
				[ new Q.ComplexNumber( 1, -1 ) / 2, new Q.ComplexNumber( 1, 1 ) / 2 ])
		}),
		'PI_8_Dagger', new Q.Gate({
	
			symbol:    'T†',
			symbolAmazonBraket: 'ti',
			symbolSvg: '',
			name:      'PI_8_Dagger',
			nameCss:   'pi8-dagger',
			matrix: new Q.Matrix(
				[ 1, 0 ],
				[ 0, Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, -Math.PI / 4 )) ])
		}),
		'NOT1_2_Dagger', new Q.Gate({
	
			symbol:    'V†',
			symbolAmazonBraket: 'vi',
			symbolSvg: '',
			name:      '√Not_Dagger',
			nameCss:   'not1-2-dagger',
			matrix: new Q.Matrix(
				[ new Q.ComplexNumber( 1, -1 ) / 2,  new Q.ComplexNumber( 1, 1 ) / 2 ],
				[ new Q.ComplexNumber( 1, 1 ) / 2, new Q.ComplexNumber( 1, -1 ) / 2 ])
		}),
		//Note that S, S_Dagger, PI_8, and PI_8_Dagger can all be implemented by applying the PHASE gate
		//using certain values of phi. 
		//These gates are included for completeness. 
		'S', new Q.Gate({
			symbol:    'S*', //Gotta think of a better symbol name...
			symbolAmazonBraket: 's',
			symbolSvg: '',
			name:      'π ÷ 4',
			nameCss:   'pi4',
			matrix: new Q.Matrix(
				[ 1, 0 ],
				[ 0, new Q.ComplexNumber( 0, 1 ) ])
		}),
		'S_Dagger', new Q.Gate({
	
			symbol:    'S†',
			symbolAmazonBraket: 'si',
			symbolSvg: '',
			name:      'π ÷ 4 Dagger',
			nameCss:   'pi4-dagger',
			matrix: new Q.Matrix(
				[ 1, 0 ],
				[ 0, Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, -1 )) ])
		}),
		//  Operate on 2 qubits.
		'SWAP', new Q.Gate({
	
			symbol:    'S', 
			symbolAmazonBraket: 'swap',
			symbolSvg: '',
			name:      'Swap',
			nameCss:   'swap',
			parameters: { "phi" : 0.0 },
			updateMatrix$: function( phi ) {
				
				if( Q.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ] = +phi
				this.matrix = new Q.Matrix(
					[ 1, 0, 0, 0 ],
					[ 0, 0, Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, this.parameters[ "phi" ] )), 0 ],
					[ 0, Q.ComplexNumber.E.power(new Q.ComplexNumber( 0, this.parameters[ "phi" ] )), 0, 0 ],
					[ 0, 0, 0, 1 ])
				return this
			},
			applyToQubit: function( qubit, phi ) {
	
				if( Q.isUsefulNumber( phi ) !== true) phi = this.parameters[ "phi" ]
				const matrix = new Q.Matrix( 
					[ 1, 0, 0, 0 ],
					[ 0, 0, Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, phi )), 0 ],
					[ 0, new Q.ComplexNumber( 0, 1 ), 0, 0 ],
					[ 0, 0, 0, 1 ]
				)
				return new Q.Qubit( matrix.multiply( qubit ))
			},
			can_be_controlled:  true,
			has_parameters: 	true,
			is_multi_qubit: 	true
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
				[ 0, 0, 0, 1 ]),
			is_multi_qubit: 	true
		}),
		'ISWAP', new Q.Gate({
			
			symbol:    'iS',
			symbolAmazonBraket: 'iswap',
			symbolSvg: '',
			name:      'Imaginary Swap',
			nameCss:   'iswap',
			matrix: new Q.Matrix(
				[ 1, 0, 0, 0 ],
				[ 0, 0, new Q.ComplexNumber( 0, 1 ), 0 ],
				[ 0, new Q.ComplexNumber( 0, 1 ), 0, 0 ],
				[ 0, 0, 0, 1 ]),
				is_multi_qubit:	true
		}),
		'ISING-XX', new Q.Gate({
	
			symbol:    'XX', 
			symbolAmazonBraket: 'xx', 
			symbolSvg: '', 
			name:      'Ising XX Coupling',
			nameCss:   'ising-xx-coupling',
			parameters: { "phi" : 1 },
			updateMatrix$: function( phi ) {
				
				if( Q.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ] = +phi
				this.matrix = new Q.Matrix(
					[ Math.cos( this.parameters[ "phi" ] / 2 ), 0, 0, new Q.ComplexNumber( 0, -Math.sin( this.parameters[ "phi" ] / 2 )) ],
					[ 0, Math.cos( this.parameters[ "phi" ] / 2 ), new Q.ComplexNumber( 0, -Math.sin( this.parameters[ "phi" ] / 2 )), 0 ],
					[ 0, new Q.ComplexNumber( 0, -Math.sin( this.parameters[ "phi" ] / 2 )), Math.cos( this.parameters[ "phi" ] / 2 ), 0 ],
					[ new Q.ComplexNumber( 0, -Math.sin( this.parameters[ "phi" ] / 2 )), 0, 0, Math.cos( this.parameters[ "phi" ] / 2 ) ])
				return this
			},
			applyToQubit: function( qubit, phi ) {
				if( Q.isUsefulNumber( phi ) !== true) phi = this.parameters[ "phi" ]
				const matrix = new Q.Matrix( 
					[ Math.cos( phi / 2 ), 0, 0, new Q.ComplexNumber( 0, -Math.sin( phi / 2 )) ],
					[ 0, Math.cos( phi / 2 ), new Q.ComplexNumber( 0, -Math.sin( phi / 2 )), 0 ],
					[ 0, new Q.ComplexNumber( 0, -Math.sin( phi / 2 )), Math.cos( phi / 2 ), 0 ],
					[ new Q.ComplexNumber( 0, -Math.sin( phi / 2 )), 0, 0, Math.cos( phi / 2 ) ]
				)
				return new Q.Qubit( matrix.multiply( qubit ))
			},
			is_multi_qubit: true,
			has_parameters:		true 
		}), 
		'ISING-XY', new Q.Gate({
	
			symbol:    'XY', 
			symbolAmazonBraket: 'xy', 
			symbolSvg: '', 
			name:      'Ising XY Coupling',
			nameCss:   'ising-xy-coupling',
			parameters: { "phi" : 1 },
			updateMatrix$: function( phi ) {
				
				if( Q.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ] = +phi
				this.matrix = new Q.Matrix(
					[ 1, 0, 0, 0 ],
					[ 0, Math.cos( this.parameters[ "phi" ] / 2 ), new Q.ComplexNumber( 0, Math.sin( this.parameters[ "phi" ] / 2 )), 0 ],
					[ 0, new Q.ComplexNumber( 0, Math.sin( this.parameters[ "phi" ] / 2 )), Math.cos( this.parameters[ "phi" ] / 2 ), 0 ],
					[ 0, 0, 0, 1 ])
				return this
			},
			applyToQubit: function( qubit, phi ) {
				if( Q.isUsefulNumber( phi ) !== true) phi = this.parameters[ "phi" ]
				const matrix = new Q.Matrix( 
					[ 1, 0, 0, 0 ],
					[ 0, Math.cos( phi / 2 ), new Q.ComplexNumber( 0, Math.sin( phi / 2 )), 0 ],
					[ 0, new Q.ComplexNumber( 0, Math.sin( phi / 2 )), Math.cos( phi / 2 ), 0 ],
					[ 0, 0, 0, 1 ]
				)
				return new Q.Qubit( matrix.multiply( qubit ))
			},
			is_multi_qubit: true,
			has_parameters:		true	 	 
		}), 
		'ISING-YY', new Q.Gate({
			
			symbol:    'YY', 
			symbolAmazonBraket: 'yy', 
			symbolSvg: '', 
			name:      'Ising YY Coupling',
			nameCss:   'ising-yy-coupling',
			parameters: { "phi" : 1 },
			updateMatrix$: function( phi ) {
				
				if( Q.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ] = +phi
				this.matrix = new Q.Matrix(
					[ Math.cos( this.parameters[ "phi" ] / 2 ), 0, 0, new Q.ComplexNumber( 0, Math.sin( this.parameters[ "phi" ] / 2 )) ],
					[ 0, Math.cos( this.parameters[ "phi" ] / 2 ), new Q.ComplexNumber( 0, -Math.sin( this.parameters[ "phi" ] / 2 )), 0 ],
					[ 0, new Q.ComplexNumber( 0, -Math.sin( this.parameters[ "phi" ] / 2 )), Math.cos( this.parameters[ "phi" ] / 2 ), 0 ],
					[ new Q.ComplexNumber( 0, -Math.sin( this.parameters[ "phi" ] / 2 )), 0, 0, Math.cos( this.parameters[ "phi" ] / 2 ) ])
				return this
			},
			applyToQubit: function( qubit, phi ) {
				if( Q.isUsefulNumber( phi ) !== true) phi = this.parameters[ "phi" ]
				const matrix = new Q.Matrix( 
					[ Math.cos( phi / 2 ), 0, 0, new Q.ComplexNumber( 0, -Math.sin( phi / 2 )) ],
					[ 0, Math.cos( phi / 2 ), new Q.ComplexNumber( 0, -Math.sin( phi / 2 )), 0 ],
					[ 0, new Q.ComplexNumber( 0, -Math.sin( phi / 2 )), Math.cos( phi / 2 ), 0 ],
					[ new Q.ComplexNumber( 0, Math.sin( phi / 2 )), 0, 0, Math.cos( phi / 2 ) ]
				)
				return new Q.Qubit( matrix.multiply( qubit ))
			},
			is_multi_qubit: true,
			has_parameters:		true
		}), 
		'ISING-ZZ', new Q.Gate({
	
			symbol:    'ZZ', 
			symbolAmazonBraket: 'zz', 
			symbolSvg: '', 
			name:      'Ising ZZ Coupling',
			nameCss:   'ising-zz-coupling',
			parameters: { "phi" : 1 },
			updateMatrix$: function( phi ) {
				
				if( Q.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ] = +phi
				this.matrix = new Q.Matrix(
					[ Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, this.parameters[ "phi" ] / 2 )), 0, 0, 0 ],
					[ 0, Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, this.parameters[ "phi" ] / 2 )), 0, 0 ],
					[ 0, 0, Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, this.parameters[ "phi" ] / 2 )), 0],
					[ 0, 0, 0, Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, -this.parameters[ "phi" ] / 2 )) ])
				return this
			},
			applyToQubit: function( qubit, phi ) {
				if( Q.isUsefulNumber( phi ) !== true) phi = this.parameters[ "phi" ]
				const matrix = new Q.Matrix( 
					[ Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, phi / 2 )), 0, 0, 0 ],
					[ 0, Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, phi / 2 )), 0, 0 ],
					[ 0, 0, Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, phi / 2 )), 0],
					[ 0, 0, 0, Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, -phi / 2 )) ]
				)
				return new Q.Qubit( matrix.multiply( qubit ))
			},
			is_multi_qubit: true,
			has_parameters:		true	 
		}), 
		'CPhase00', new Q.Gate({
	
			symbol:    '00', //placeholder 
			symbolAmazonBraket: 'cphaseshift00', 
			symbolSvg: '', 
			name:      'Controlled Phase Shift 00',
			nameCss:   'cphase00',
			parameters: { "phi" : 1 },
			updateMatrix$: function( phi ) {
				
				if( Q.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ] = +phi
				this.matrix = new Q.Matrix(
					[ Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, this.parameters[ "phi" ] )), 0, 0, 0 ],
					[ 0, 1, 0, 0 ],
					[ 0, 0, 1, 0 ],
					[ 0, 0, 0, 1 ])
				return this
			},
			applyToQubit: function( qubit, phi ) {
				if( Q.isUsefulNumber( phi ) !== true) phi = this.parameters[ "phi" ]
				const matrix = new Q.Matrix( 
					[ Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, phi )), 0, 0, 0 ],
					[ 0, 1, 0, 0 ],
					[ 0, 0, 1, 0 ],
					[ 0, 0, 0, 1 ]
				)
				return new Q.Qubit( matrix.multiply( qubit ))
			},
			is_multi_qubit: true,
			has_parameters:		true	 	 
		}),
		'CPhase01', new Q.Gate({
	
			symbol:    '01', //placeholder 
			symbolAmazonBraket: 'cphaseshift01', 
			symbolSvg: '', 
			name:      'Controlled Phase Shift 01',
			nameCss:   'cphase01',
			parameters: { "phi" : 1 },
			updateMatrix$: function( phi ) {
				
				if( Q.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ] = +phi
				this.matrix = new Q.Matrix(
					[ 1, 0, 0, 0 ],
					[ 0, Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, this.parameters[ "phi" ] )), 0, 0 ],
					[ 0, 0, 1, 0 ],
					[ 0, 0, 0, 1 ])
				return this
			},
			applyToQubit: function( qubit, phi ) {
				if( Q.isUsefulNumber( phi ) !== true) phi = this.parameters[ "phi" ]
				const matrix = new Q.Matrix( 
					[ 1, 0, 0, 0 ],
					[ 0, Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, phi)), 0, 0 ],
					[ 0, 0, 1, 0 ],
					[ 0, 0, 0, 1 ]
				)
				return new Q.Qubit( matrix.multiply( qubit ))
			},
			is_multi_qubit: true,
			has_parameters:		true	 	 
		}),
		'CPhase10', new Q.Gate({
	
			symbol:    '10', //placeholder 
			symbolAmazonBraket: 'cphaseshift10', 
			symbolSvg: '', 
			name:      'Controlled Phase Shift 10',
			nameCss:   'cphase01',
			parameters: { "phi" : 1 },
			updateMatrix$: function( phi ) {
				
				if( Q.isUsefulNumber( +phi ) === true ) this.parameters[ "phi" ] = +phi
				this.matrix = new Q.Matrix(
					[ 1, 0, 0, 0 ],
					[ 0, 1, 0, 0 ],
					[ 0, 0, Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, this.parameters[ "phi" ] )), 0 ],
					[ 0, 0, 0, 1 ])
				return this
			},
			applyToQubit: function( qubit, phi ) {
				if( Q.isUsefulNumber( phi ) !== true) phi = this.parameters[ "phi" ]
				const matrix = new Q.Matrix( 
					[ 1, 0, 0, 0 ],
					[ 0, 1, 0, 0 ],
					[ 0, 0, Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, phi)), 0 ],
					[ 0, 0, 0, 1 ]
				)
				return new Q.Qubit( matrix.multiply( qubit ))
			},
			is_multi_qubit: 	true,
			has_parameters:		true	 
		}), 
		'CSWAP', new Q.Gate({
	
			symbol:    'CSWAP',
			symbolAmazonBraket: 'cswap', 
			symbolSvg: '', 
			name:      'Controlled Swap',
			nameCss:   'controlled-swap',
			matrix: new Q.Matrix(
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
	
	
	dex = Q.Gate.index ++
	
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



