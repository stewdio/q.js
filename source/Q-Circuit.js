
//  Copyright © 2019–2020, Stewart Smith. See LICENSE for details.




Q.Circuit = function( bandwidth, timewidth ){


	//  What number Circuit is this
	//  that we’re attempting to make here?
	
	this.index = Q.Circuit.index ++


	//  How many qubits (registers) shall we use?

	if( !Q.isUsefulInteger( bandwidth )) bandwidth = 3
	this.bandwidth = bandwidth


	//  How many operations can we perform on each qubit?
	//  Each operation counts as one moment; one clock tick.

	if( !Q.isUsefulInteger( timewidth )) timewidth = 5
	this.timewidth = timewidth


	//  We’ll start with Horizontal qubits (zeros) as inputs
	//  but we can of course modify this after initialization.

	this.qubits = new Array( bandwidth ).fill( Q.Qubit.HORIZONTAL )


	//  What operations will we perform on our qubits?
	
	this.operations = []


	//  Does our circuit need evaluation?
	//  Certainly, yes!
	// (And will again each time it is modified.)

	this.needsEvaluation = true
	

	//  When our circuit is evaluated 
	//  we store those results in this array.

	this.results = []
	this.matrix  = null
}




Object.assign( Q.Circuit, {

	index: 0,
	help: function(){ return Q.help( this )},
	constants: {},
	createConstant:  Q.createConstant,
	createConstants: Q.createConstants,


	fromText: function( text ){
		

		//  Is this a String Template -- as opposed to a regular String?
		//  If so, let’s convert it to a regular String.
		//  Yes, this maintains the line breaks.

		if( text.raw !== undefined ) text = ''+text.raw		
		return Q.Circuit.fromTableTransposed( 

			text
			.trim()
			.split( /\r?\n/ )
			.filter( function( item ){ return item.length })
			.map( function( item, r ){

				return item
				.trim()
				.split( /[-+\s+=+]/ )
				.filter( function( item ){ return item.length })
				.map( function( item, m ){

					//const matches = item.match( /(^\w+)(#(\w+))*(\.(\d+))*/ )
					const matches = item.match( /(^\w+)(\.(\w+))*(#(\d+))*/ )
					return {
						
						gateLabel:         matches[ 1 ],
						operationMomentId: matches[ 3 ],
						mappingIndex:     +matches[ 5 ]
					}
				})
			})
		)
	},
	fromTableTransposed: function( table ){

		const
		bandwidth = table.length,
		timewidth = table.reduce( function( max, moments ){

			return Math.max( max, moments.length )
		
		}, 0 ),
		circuit = new Q.Circuit( bandwidth, timewidth )
		
		circuit.bandwidth = bandwidth
		circuit.timewidth = timewidth
		for( let r = 0; r < bandwidth; r ++ ){

			const registerIndex = r + 1
			for( let m = 0; m < timewidth; m ++ ){

				const 
				momentIndex = m + 1,
				operation = table[ r ][ m ]

				let siblingHasBeenFound = false
				for( let s = 0; s < r; s ++ ){

					const sibling = table[ s ][ m ]
					if( operation.gateLabel === sibling.gateLabel &&
						operation.operationMomentId === sibling.operationMomentId &&
						Q.isUsefulInteger( operation.mappingIndex ) &&
						Q.isUsefulInteger( sibling.mappingIndex ) &&
						operation.mappingIndex !== sibling.mappingIndex ){


						//  We’ve found a sibling !

						const operationsIndex = circuit.operations.findIndex( function( operation ){

							return (

								operation.momentIndex === momentIndex &&
								operation.registerIndices.includes( s + 1 )
							)
						})
						// console.log( 'operationsIndex?', operationsIndex )
						circuit.operations[ operationsIndex ].registerIndices[ operation.mappingIndex ] = registerIndex
						siblingHasBeenFound = true
					}
				}
				if( siblingHasBeenFound === false && operation.gateLabel !== 'I' ){

					const 
					gate = Q.Gate.findByLabel( operation.gateLabel ),
					registerIndices = []

					if( Q.isUsefulInteger( operation.mappingIndex )){
					
						registerIndices[ operation.mappingIndex ] = registerIndex
					}
					else registerIndices[ 0 ] = registerIndex
					circuit.operations.push({

						momentIndex,
						registerIndices,
						gate,
						operationMomentId: operation.operationMomentId
					})
				}
			}
		}
		circuit.sort$()
		return circuit
	},




	controlled: function( U ){
		

		//  we should really just replace this with a nice Matrix.copy({}) command!!!!

		// console.log( 'U?', U )

		const 
		size   = U.getWidth(),
		result = Q.Matrix.createIdentity( size * 2 )

		// console.log( 'U', U.toTsv() )
		// console.log( 'size', size )
		// console.log( 'result', result.toTsv() )
		
		for( let x = 0; x < size; x ++ ){
			
			for( let y = 0; y < size; y ++ ){
				
				const v = U.read( x, y )
				// console.log( `value at ${x}, ${y}`, v )
				result.write$( x + size, y + size, v )
			}
		}
		return result
	},
	


	//  Return transformation over entire nqubit register that applies U to
	//  specified qubits (in order given).
	//  Algorithm from Lee Spector's "Automatic Quantum Computer Programming"
	//  Page 21 in the 2004 PDF?
	//  http://148.206.53.84/tesiuami/S_pdfs/AUTOMATIC%20QUANTUM%20COMPUTER%20PROGRAMMING.pdf

	expandMatrix: function( circuitBandwidth, U, qubitIndices ){
		
		// console.log( 'EXPANDING THE MATRIX...' )
		// console.log( 'this one: U', U.toTsv())

		const _qubits = []
		const n = Math.pow( 2, circuitBandwidth )
		

		// console.log( 'qubitIndices used by this operation:', qubitIndices )
		// console.log( 'qubits before slice', qubitIndices )
		// qubitIndices = qubitIndices.slice( 0 )
		// console.log( 'qubits AFTER slice', qubitIndices )
		

		

		for( let i = 0; i < qubitIndices.length; i ++ ){
			
			//qubitIndices[ i ] = ( circuitBandwidth - 1 ) - qubitIndices[ i ]
			qubitIndices[ i ] = ( circuitBandwidth - 0 ) - qubitIndices[ i ]
		}
		// console.log( 'qubits AFTER manipulation', qubitIndices )

		
		qubitIndices.reverse()
		for( let i = 0; i < circuitBandwidth; i ++ ){
			
			if( qubitIndices.indexOf( i ) == -1 ){
				
				_qubits.push( i )
			}
		}


		// console.log( 'qubitIndices vs _qubits:' )
		// console.log( 'qubitIndices', qubitIndices )
		// console.log( '_qubits', _qubits )
		


		const result = new Q.Matrix.createZero( n )


		// const X = numeric.rep([n, n], 0);
		// const Y = numeric.rep([n, n], 0);
		

		let i = n
		while( i -- ){
			
			let j = n
			while( j -- ){
				
				let
				bitsEqual = true,
				k = _qubits.length
				
				while( k -- ){
					
					if(( i & ( 1 << _qubits[ k ])) != ( j & ( 1 << _qubits[ k ]))){
						
						bitsEqual = false
						break
					}
				}
				if( bitsEqual ){

					// console.log( 'bits ARE equal' )
					
					let
					istar = 0,
					jstar = 0,
					k = qubitIndices.length
					
					while( k -- ){
						
						const q = qubitIndices[ k ]
						istar |= (( i & ( 1 << q )) >> q ) << k
						jstar |= (( j & ( 1 << q )) >> q ) << k
					}


					//console.log( 'U.read( istar, jstar )', U.read( istar, jstar ).toText() )

					// console.log( 'before write$', result.toTsv())

					// console.log( 'U.read at ', istar, jstar, '=', U.read( istar, jstar ).toText())
					result.write$( i, j, U.read( istar, jstar ))

					// console.log( 'after write$', result.toTsv())
					
					// X[i][j] = U.x[ istar ][ jstar ]
					// Y[i][j] = U.y[ istar ][ jstar ]
				}
				// else console.log('bits NOT equal')
			}
		}
		//return new numeric.T(X, Y);

		// console.log( 'expanded matrix to:', result.toTsv() )
		return result
	},




	evaluate: function( circuit ){


		// console.log( circuit.toDiagram() )


		window.dispatchEvent( new CustomEvent( 

			'qjs evaluate began', { 

				detail: { circuit }
			}
		))




		//  Create a new matrix (or more precisely, a vector)
		//  that is a 1 followed by all zeros.
		//
		//  ┌   ┐
		//  │ 1 │
		//  │ 0 │
		//  │ 0 │
		//  │ . │
		//  │ . │
		//  │ . │
		//  └   ┘

		const state = new Q.Matrix( 1, Math.pow( 2, circuit.bandwidth ))
		state.write$( 0, 0, 1 )




		//  Create a state matrix from this circuit’s input qubits.
		
		// const state2 = circuit.qubits.reduce( function( state, qubit, i ){

		// 	if( i > 0 ) return state.multiplyTensor( qubit )
		// 	else return state

		// }, circuit.qubits[ 0 ])
		// console.log( 'Initial state', state2.toTsv() )
		// console.log( 'multiplied', state2.multiplyTensor( state ).toTsv() )
		




		const operationsTotal = circuit.operations.length
		let operationsCompleted = 0
		let matrix = circuit.operations.reduce( function( state, operation, i ){



			let U
			if( operation.registerIndices.length < Infinity ){
			
				if( operation.registerIndices.length > 1 ){

					operation.gate = Q.Gate.PAULI_X
				}
				U = operation.gate.matrix
			} 
			else {
			
				//  This is for Quantum Fourier Transforms (QFT). 
				//  Will have to come back to this at a later date!
			}			
			// console.log( operation.gate.name, U.toTsv() )





			//  Yikes. May need to separate registerIndices in to controls[] and targets[] ??
			//  Works for now tho..... 

			for( let j = 0; j < operation.registerIndices.length - 1; j ++ ){
			
				U = Q.Circuit.controlled( U )
				// console.log( 'qubitIndex #', j, 'U = Q.Circuit.controlled( U )', U.toTsv() )
			}


			//  We need to send a COPY of the registerIndices Array
			//  to .expandMatrix()
			//  otherwise it *may* modify the actual registerIndices Array
			//  and wow -- tracking down that bug was painful!

			const registerIndices = operation.registerIndices.slice()


			state = Q.Circuit.expandMatrix( 

				circuit.bandwidth, 
				U, 
				registerIndices

			).multiply( state )




			operationsCompleted ++
			const progress = operationsCompleted / operationsTotal


			window.dispatchEvent( new CustomEvent( 'qjs evaluate progressed', { detail: {

				circuit,
				progress,
				operationsCompleted,
				operationsTotal,
				momentIndex: operation.momentIndex,
				registerIndices: operation.registerIndices,
				gate: operation.gate.name,
				state

			}}))


			// console.log( `\n\nProgress ... ${ Math.round( operationsCompleted / operationsTotal * 100 )}%`)
			// console.log( 'Moment .....', operation.momentIndex )
			// console.log( 'Registers ..', JSON.stringify( operation.registerIndices ))
			// console.log( 'Gate .......', operation.gate.name )
			// console.log( 'Intermediate result:', state.toTsv() )
			// console.log( '\n' )
			

			return state
			
		}, state )


		// console.log( 'result matrix', matrix.toTsv() )
	



		const outcomes = matrix.rows.reduce( function( outcomes, row, i ){

			outcomes.push({

				state: '|'+ parseInt( i, 10 ).toString( 2 ).padStart( circuit.bandwidth, '0' ) +'⟩',
				probability: Math.pow( row[ 0 ].absolute(), 2 )
			})
			return outcomes
		
		}, [] )



		circuit.needsEvaluation = false
		circuit.matrix = matrix
		circuit.results = outcomes



		window.dispatchEvent( new CustomEvent( 'qjs evaluate completed', { detail: {
		// circuit.dispatchEvent( new CustomEvent( 'evaluation complete', { detail: {

			circuit,
			results: outcomes

		}}))



		

		return matrix
	}
})







Object.assign( Q.Circuit.prototype, {

	clone: function(){

		const 
		original = this,
		clone = original.copy()

		clone.qubits  = original.qubits.slice()
		clone.results = original.results.slice()
		clone.needsEvaluation = original.needsEvaluation
		
		return clone
	},
	evaluate$: function(){

		Q.Circuit.evaluate( this )
		return this
	},
	report$: function( length ){

		if( this.needsEvaluation ) this.evaluate$()
		if( !Q.isUsefulInteger( length )) length = 20
		
		const 
		circuit = this,
		text = this.results.reduce( function( text, outcome, i ){

			const
			probabilityPositive = Math.round( outcome.probability * length ),
			probabilityNegative = length - probabilityPositive

			return text +'\n'
				+ ( i + 1 ).toString().padStart( Math.ceil( Math.log10( Math.pow( 2, circuit.qubits.length ))), ' ' ) +'  '
				+ outcome.state +'  '
				+ ''.padStart( probabilityPositive, '█' )
				+ ''.padStart( probabilityNegative, '░' )
				+ Q.round( Math.round( 100 * outcome.probability ), 8 ).toString().padStart( 4, ' ' ) +'% chance'

		}, '' ) + '\n'
		return text
	},
	try$: function(){

		if( this.needsEvaluation ) this.evaluate$()

		
		//  We need to “stack” our probabilities from 0..1.
		
		const outcomesStacked = new Array( this.results.length )
		this.results.reduce( function( sum, outcome, i ){

			sum += outcome.probability
			outcomesStacked[ i ] = sum
			return sum
		
		}, 0 )
		

		//  Now we can pick a random number
		//  and return the first outcome 
		//  with a probability equal to or greater than
		//  that random number. 
		
		const 
		randomNumber = Math.random(),
		randomIndex  = outcomesStacked.findIndex( function( index ){

			return randomNumber <= index
		})
		

		//  Output that to the console
		//  but return the random index
		//  so we can pipe that to something else
		//  should we want to :)
		
		// console.log( this.outcomes[ randomIndex ].state )
		return randomIndex
	},




	    ////////////////
	   //            //
	  //   Output   //
	 //            //
	////////////////


	sort$: function(){

		//  Sort this circuit’s operations
		//  primarily by momentIndex,
		//  then by the first registerIndex.

		this.operations.sort( function( a, b ){

			if( a.momentIndex === b.momentIndex ){


				//  Note that we are NOT sorting registerIndices here!
				//  We are merely asking which set of indices contain
				//  the lowest register index.
				//  If we instead sorted the registerIndices 
				//  we could confuse which qubit is the controller
				//  and which is the controlled!

				return Math.min( ...a.registerIndices ) - Math.min( b.registerIndices )
			}
			else {

				return a.momentIndex - b.momentIndex
			}
		})
		return this
	},
	





	    ///////////////////
	   //               //
	  //   Exporters   //
	 //               //
	///////////////////


	toTable: function(){

		const 
		table = new Array( this.timewidth ),
		circuit = this


		//  Sure, this is equal to table.length
		//  but isn’t legibility and convenience everything?

		table.timewidth = this.timewidth
		

		//  Similarly, this should be equal to table[ 0 ].length
		//  or really table[ i >= 0; i < table.length ].length,
		//  but again, lowest cognitive hurdle is key ;)

		table.bandwidth = this.bandwidth
		

		//  First, let’s establish a “blank” table
		//  that contains an identity operation
		//  for each register during each moment.

		table.fill( 0 ).forEach( function( element, index, array ){

			const operations = new Array( circuit.bandwidth )
			operations.fill( 0 ).forEach( function( element, index, array ){

				array[ index ] = {

					label:   'I',
					labelDisplay: 'I',
					name:    'Identity',
					nameCss: 'identity',
					gateInputIndex: 0,
					bandwidth: 0,
					thisGateAmongMultiQubitGatesIndex: 0,
					aSiblingIsAbove: false,
					aSiblingIsBelow: false
				}
			})
			array[ index ] = operations
		})


		//  Now iterate through the circuit’s operations list
		//  and note those operations in our table.
		//  NOTE: This relies on operations being pre-sorted with .sort$()
		//  prior to the .toTable() call.
		
		let 
		momentIndex = 1,
		multiRegisterOperationIndex = 0,
		operationsThisMoment = {}

		this.operations.forEach( function( operation, operationIndex, operations ){


			//  We need to keep track of
			//  how many multi-register operations
			//  occur during this moment.

			if( momentIndex !== operation.momentIndex ){

				table[ momentIndex ].operationsThisMoment = operationsThisMoment
				momentIndex = operation.momentIndex
				multiRegisterOperationIndex = 0
				operationsThisMoment = {}
			}
			if( operation.registerIndices.length > 1 ){

				table[ momentIndex - 1 ].multiRegisterOperationIndex = multiRegisterOperationIndex
				multiRegisterOperationIndex ++
			}
			if( operationsThisMoment[ operation.gate.label ] === undefined ){

				operationsThisMoment[ operation.gate.label ] = 1
			}
			else operationsThisMoment[ operation.gate.label ] ++


			//  By default, an operation’s CSS name
			//  is its regular name, all lowercase, 
			//  with all spaces replaced by hyphens.

			let nameCss = operation.gate.name.toLowerCase().replace( /\s+/g, '-' )

			
			operation.registerIndices.forEach( function( registerIndex, indexAmongSiblings ){

				let isMultiRegisterOperation = false
				if( operation.registerIndices.length > 1 ){

					isMultiRegisterOperation = true
					if(	indexAmongSiblings === operation.registerIndices.length - 1 ){

						nameCss = 'target'
					}
					else {

						nameCss = 'control'
					}

					//  May need to re-visit the code above in consideration of SWAPs.

				}
				table[ operation.momentIndex - 1 ][ registerIndex - 1 ] = {

					label:        operation.gate.label,
					labelDisplay: operation.gate.label,
					name:         operation.gate.name,
					nameCss,
					operationIndex,
					momentIndex: operation.momentIndex,
					registerIndex,
					isMultiRegisterOperation,
					multiRegisterOperationIndex,
					operationsOfThisTypeNow: operationsThisMoment[ operation.gate.label ],
					indexAmongSiblings,
					siblingExistsAbove: Math.min( ...operation.registerIndices ) < registerIndex,
					siblingExistsBelow: Math.max( ...operation.registerIndices ) > registerIndex
				}
			})
			//if( operationIndex === operations.length - 1 ){
				
				table[ momentIndex - 1 ].operationsThisMoment = operationsThisMoment
			//}
		})


		table.forEach( function( moment, m ){

			moment.forEach( function( operation, o ){

				if( operation.isMultiRegisterOperation ){

					if( moment.operationsThisMoment[ operation.label ] > 1 ){

						operation.labelDisplay = operation.label +'.'+ ( operation.operationsOfThisTypeNow - 1 )
					}
					operation.labelDisplay += '#'+ operation.indexAmongSiblings
				}
			})
		})


		//  Now we can easily read down each moment
		//  and establish the moment’s character width.
		//  Very useful for text-based diagrams ;)

		table.forEach( function( moment ){

			const maximumWidth = moment.reduce( function( maximumWidth, operation ){

				return Math.max( maximumWidth, operation.labelDisplay.length )
			
			}, 1 )
			moment.maximumCharacterWidth = maximumWidth
		})


		//  We can also do this for the table as a whole.
		
		table.maximumCharacterWidth = table.reduce( function( maximumWidth, moment ){

			return Math.max( maximumWidth, moment.maximumCharacterWidth )
		
		}, 1 )


		//  I think we’re done here.

		return table
	},
	toText: function( makeAllMomentsEqualWidth ){

		`
		Create a text representation of this circuit
		using only common characters,
		ie. no fancy box-drawing characters.
		This is the complement of Circuit.fromText()
		`

		const 
		table  = this.toTable(),
		output = new Array( table.bandwidth ).fill( '' )

		for( let x = 0; x < table.timewidth; x ++ ){

			for( let y = 0; y < table.bandwidth; y ++ ){

				let cellString = table[ x ][ y ].labelDisplay.padEnd( table[ x ].maximumCharacterWidth, '-' )
				if( makeAllMomentsEqualWidth && x < table.timewidth - 1 ){

					cellString = table[ x ][ y ].labelDisplay.padEnd( table.maximumCharacterWidth, '-' )
				}
				if( x > 0 ) cellString = '-'+ cellString
				output[ y ] += cellString
			}
		}
		return '\n'+ output.join( '\n' )
		// return output.join( '\n' )
	},
	toDiagram: function( makeAllMomentsEqualWidth ){

		`
		Create a text representation of this circuit
		using fancy box-drawing characters.
		`

		const 
		scope  = this,
		table  = this.toTable(),
		output = new Array( table.bandwidth * 3 + 1 ).fill( '' )

		output[ 0 ] = '        '
		scope.qubits.forEach( function( qubit, q ){

			const y3 = q * 3
			output[ y3 + 1 ] += '        '
			output[ y3 + 2 ] += 'r'+ ( q + 1 ) +'  |'+ qubit.beta.toText() +'⟩─'
			output[ y3 + 3 ] += '        '
		})
		for( let x = 0; x < table.timewidth; x ++ ){

			const padToLength = makeAllMomentsEqualWidth
				? table.maximumCharacterWidth
				: table[ x ].maximumCharacterWidth

			output[ 0 ] += Q.centerText( 'm'+ ( x + 1 ), padToLength + 4 )
			for( let y = 0; y < table.bandwidth; y ++ ){

				let 
				operation = table[ x ][ y ],
				first  = '',
				second = '',
				third  = ''

				if( operation.label === 'I' ){

					first  += '  '
					second += '──'
					third  += '  '
					
					first  += ' '.padEnd( padToLength )
					second += Q.centerText( '○', padToLength, '─' )
					third  += ' '.padEnd( padToLength )

					first  += '  '
					if( x < table.timewidth - 1 ) second += '──'
					else second += '  '
					third  += '  '
				}
				else {

					if( operation.isMultiRegisterOperation ){

						first  += '╭─'
						third  += '╰─'
					}
					else {
					
						first  += '┌─'
						third  += '└─'
					}
					second += '┤ '
					
					first  += '─'.padEnd( padToLength, '─' )
					second += Q.centerText( operation.labelDisplay, padToLength )
					third  += '─'.padEnd( padToLength, '─' )


					if( operation.isMultiRegisterOperation ){

						first  += '─╮'
						third  += '─╯'
					}
					else {

						first  += '─┐'
						third  += '─┘'
					}
					second += x < table.timewidth - 1 ? ' ├' : ' │'

					if( operation.isMultiRegisterOperation ){

						let n = ( operation.multiRegisterOperationIndex * 2 ) % ( table[ x ].maximumCharacterWidth + 1 ) + 1
						if( operation.siblingExistsAbove ){						

							first = first.substring( 0, n ) +'┴'+ first.substring( n + 1 )
						}
						if( operation.siblingExistsBelow ){

							third = third.substring( 0, n ) +'┬'+ third.substring( n + 1 )
						}					
					}
				}
				const y3 = y * 3				
				output[ y3 + 1 ] += first
				output[ y3 + 2 ] += second
				output[ y3 + 3 ] += third
			}
		}
		return '\n'+ output.join( '\n' )
	},




	//  Oh yes my friends... WebGL is coming!

	toShader: function(){

	},


	toAmazonBraket: function(){

		const header = `from braket.circuits import Circuit
from braket.aws import AwsQuantumSimulator

device_arn = “arn:aws:aqx:::quantum-simulator:aqx:qs1”
device = AwsQuantumSimulator(device_arn)
s3_folder = (“my_bucket”, “my_prefix”)

`
		//`qjs_circuit = Circuit().h(0).cnot(0,1)`
		const circuit = this.operations.reduce( function( string, operation ){

			let awsGate = operation.gate.AmazonBraketName !== undefined ?
				operation.gate.AmazonBraketName :
				operation.gate.label.substr( 0, 1 ).toLowerCase()

			if( operation.gate.label === 'X' && operation.registerIndices.length > 1 ){

				awsGate = 'cnot'
			}
			
			return string +'.'+ awsGate +'(' + 
				operation.registerIndices.reduce( function( string, registerIndex, r ){

					return string + (( r > 0 ) ? ',' : '' ) + ( registerIndex - 1 )

				}, '' ) + ')'

		}, 'qjs_circuit = Circuit()' )


		const footer = `\n\nprint(device.run(qjs_circuit, s3_folder).result().measurement_counts())`
		return header + circuit + footer
	},
	toLatex: function(){

		/*

		\Qcircuit @C=1em @R=.7em {
			& \ctrl{2} & \targ     & \gate{U}  & \qw \\
			& \qw      & \ctrl{-1} & \qw       & \qw \\
			& \targ    & \ctrl{-1} & \ctrl{-2} & \qw \\
			& \qw      & \ctrl{-1} & \qw       & \qw
		}

		No "&"" means it’s an input. So could also do this:
		\Qcircuit @C=1.4em @R=1.2em {

			a & i \\
			1 & x
		}
		*/

		return '\\Qcircuit @C=1.0em @R=0.7em {\n' +
		this.toTable()
		.reduce( function( array, moment, m ){

			moment.forEach( function( operation, o, operations ){

				let command = 'qw'
				if( operation.label !== 'I' ){

					if( operation.isMultiRegisterOperation ){

						if( operation.indexAmongSiblings === 0 ){

							if( operation.label === 'X' ) command = 'targ'
							else command = operation.label.toLowerCase()
						}
						else if( operation.indexAmongSiblings > 0 ) command = 'ctrl{?}'
					}
					else command = operation.label.toLowerCase()
				}
				operations[ o ].latexCommand = command
			})
			const maximumCharacterWidth = moment.reduce( function( maximumCharacterWidth, operation ){

				return Math.max( maximumCharacterWidth, operation.latexCommand.length )
			
			}, 0 )
			moment.forEach( function( operation, o ){

				array[ o ] += '& \\'+ operation.latexCommand.padEnd( maximumCharacterWidth ) +'  '
			})
			return array

		}, new Array( this.bandwidth ).fill( '\n\t' ))
		.join( '\\\\' ) + 
		'\n}'
	},


















	    //////////////
	   //          //
	  //   Edit   //
	 //          //
	//////////////


	fillEmptyOperations$: function(){

		`
		Step through each moment of this circuit,
		find any qubits that have no assigned operations
		and add an IDENTITY operation 
		for that qubit at that moment.
		`

		const scope = this
		if( this.inputs instanceof Array !== true ) this.inputs = []
		while( this.inputs.length < this.bandwidth ){

			this.inputs.push( Q.Qubit.HORIZONTAL )
		}
		this.moments.forEach( function( moment ){

			scope.inputs.forEach( function( qubit, q ){

				const qubitHasOperation = moment.find( function( operation ){

					return operation.qubitIndices.includes( q )
				})
				if( qubitHasOperation === undefined ){

					moment.push({ 

						gate: Q.Gate.IDENTITY,
						qubitIndices: [ q ]
					})
				}
			})
		})
		return this
	},
	removeHangingOperations$: function(){

		`
		First: If the inputs array is longer than 
		our designated bandwidth we need to trim it.
		Then: Step through each moment of this circuit
		and remove any “hanging” gate operations
		that contain qubit indices outside the expected range.
		This is useful after a copy() command
		that may contain stray qubit indices from multi-qubit gates
		or after a trim$() command with a similar result.
		`
		
		if( this.inputs.length > this.bandwidth ) this.inputs.splice( this.timewidth )
		const bandwidth = this.bandwidth
		this.moments = this.moments.map( function( moment ){

			moment = moment.filter( function( operation ){

				return operation.qubitIndices.every( function( index ){

					return index >= 0 && index < bandwidth
				})
			})
			return moment
		})
		return this
	},




	clearThisInput$: function( momentIndex, registerIndices ){

		const circuit = this

		if( registerIndices instanceof Array === false ){

			registerIndices = [ registerIndices ]
		}


		//  We need to dispatch an event based on the actual 
		//  operations found, with its full registerIndices intact.

		circuit.operations.filter( function( operation ){

			return (

				operation.momentIndex === momentIndex && 
				operation.registerIndices.some( function( registerIndex ){

					return registerIndices.includes( registerIndex )
				})
			)
		
		}).forEach( function( operation ){

			window.dispatchEvent( new CustomEvent( 

				'qjs clearThisInput$', { detail: { 

					circuit,
					momentIndex,
					registerIndices: operation.registerIndices
				}}
			))
		})
		

		//  And we need the operations’ indices -- not REGISTER indices,
		//  but the actual index of the operation itself -- so we can
		//  splice the operations array.

		let spliceIndex = 0
		while( spliceIndex >= 0 ){
			
			spliceIndex = circuit.operations.findIndex( function( operation, o ){

				return (

					operation.momentIndex === momentIndex && 
					operation.registerIndices.some( function( registerIndex ){

						return registerIndices.includes( registerIndex )
					})
				)
			})
			if( spliceIndex >= 0 ){

				circuit.operations.splice( spliceIndex, 1 )
			}
		}
		return circuit
	},




	get: function( momentIndex, registerIndex ){

		return this.operations.find( function( op ){

			return op.momentIndex === momentIndex && 
				op.registerIndices.includes( registerIndex )
		})
	},
	set$: function( momentIndex, gate, registerIndices, gateId, allowOverrun ){

		const circuit = this


		//  Is this a valid moment index?
		
		if( Q.isUsefulNumber( momentIndex ) !== true ||
			Number.isInteger( momentIndex ) !== true ||
			momentIndex < 1 || momentIndex > this.timewidth ){

			return Q.error( `Q.Circuit attempted to add a gate to circuit #${this.index} at a moment index that is not valid:`, momentIndex )
		}


		//  Is this a valid gate?

		if( typeof gate === 'string' ) gate = Q.Gate.findByLabel( gate )
		if( gate instanceof Q.Gate !== true ) return Q.error( `Q.Circuit attempted to add a gate to circuit #${this.index} at moment #${momentIndex} that is not a gate:`, gate )


		//  Are these valid register indices?

		if( allowOverrun !== true ){
		
			if( registerIndices instanceof Array !== true ) return Q.error( `Q.Circuit attempted to add a gate to circuit #${this.index} at moment #${momentIndex} with an invalid register indices array:`, registerIndices )
			if( registerIndices.length === 0 ) return Q.error( `Q.Circuit attempted to add a gate to circuit #${this.index} at moment #${momentIndex} with an empty register indices array:`, registerIndices )
			//if( registerIndices.length !== gate.bandwidth ) return Q.error( `Q.Circuit attempted to add a gate to circuit #${this.index} at moment #${momentIndex} but the number of register indices (${registerIndices}) did not match the gate’s bandwidth (${gate.bandwidth}).` )
			if( registerIndices.reduce( function( accumulator, registerIndex ){

				return accumulator && registerIndex > 0 && registerIndex <= circuit.bandwidth

			}, false )){

				return Q.warn( `Q.Circuit attempted to add a gate to circuit #${this.index} at moment #${momentIndex} with some out of range qubit indices:`, registerIndices )
			}
		}


		//  Ok, now we can check if this set$ command
		//  is redundant.

		const 
		existingOperation = circuit.get( momentIndex, registerIndices[ 0 ]),
		isRedundant = !!(

			existingOperation &&
			existingOperation.gate &&
			existingOperation.gate === gate &&
			JSON.stringify( existingOperation.registerIndices ) === JSON.stringify( registerIndices )
		)
		

		//  If it’s NOT redudant 
		//  then we’re clear to proceed.

		if( isRedundant !== true ){

			this.clearThisInput$( momentIndex, registerIndices )
			if( gate !== Q.Gate.IDENTITY ){
			
				this.operations.push({

					momentIndex,
					registerIndices,
					gate,
					gateId
				})
			}
			this.sort$()

			
			//  Emit an event that we have set an operation
			//  on this circuit.

			window.dispatchEvent( new CustomEvent( 

				'qjs set$ completed', { detail: { 

					circuit,
					gate,
					momentIndex,
					registerIndices
				}}
			))
		}
	},




	determineRanges: function( options ){

		if( options === undefined ) options = {}
		let {

			qubitFirstIndex,
			qubitRange,
			qubitLastIndex,
			momentFirstIndex,
			momentRange,
			momentLastIndex

		} = options

		if( typeof qubitFirstIndex !== 'number' ) qubitFirstIndex = 0
		if( typeof qubitLastIndex  !== 'number' && typeof qubitRange !== 'number' ) qubitLastIndex = this.bandwidth
		if( typeof qubitLastIndex  !== 'number' && typeof qubitRange === 'number' ) qubitLastIndex = qubitFirstIndex + qubitRange
		else if( typeof qubitLastIndex === 'number' && typeof qubitRange !== 'number' ) qubitRange = qubitLastIndex - qubitFirstIndex
		else return Q.error( `Q.Circuit attempted to copy a circuit but could not understand what qubits to copy.` )

		if( typeof momentFirstIndex !== 'number' ) momentFirstIndex = 0
		if( typeof momentLastIndex  !== 'number' && typeof momentRange !== 'number' ) momentLastIndex = this.timewidth
		if( typeof momentLastIndex  !== 'number' && typeof momentRange === 'number' ) momentLastIndex = momentFirstIndex + momentRange
		else if( typeof momentLastIndex === 'number' && typeof momentRange !== 'number' ) momentRange = momentLastIndex - momentFirstIndex
		else return Q.error( `Q.Circuit attempted to copy a circuit but could not understand what moments to copy.` )

		Q.log( 0.8, 
		
			'\nQ.Circuit copy operation:',
			'\n\n  qubitFirstIndex', qubitFirstIndex,
			'\n  qubitLastIndex ', qubitLastIndex,
			'\n  qubitRange     ', qubitRange,
			'\n\n  momentFirstIndex', momentFirstIndex,
			'\n  momentLastIndex ', momentLastIndex,
			'\n  momentRange     ', momentRange,
			'\n\n'
		)

		return {

			qubitFirstIndex,
			qubitRange,
			qubitLastIndex,
			momentFirstIndex,
			momentRange,
			momentLastIndex
		}
	},


	copy: function( options, isACutOperation ){

		const original = this
		let {

			registerFirstIndex,
			registerRange,
			registerLastIndex,
			momentFirstIndex,
			momentRange,
			momentLastIndex

		} = this.determineRanges( options )

		const copy = new Q.Circuit( registerRange, momentRange )

		original.operations
		.filter( function( operation ){

			return ( operation.registerIndices.every( function( registerIndex ){

				return (

					operation.momentIndex   >= momentFirstIndex &&
					operation.momentIndex   <  momentLastIndex &&
					operation.registerIndex >= registerFirstIndex && 
					operation.registerIndex <  registerLastIndex
				)
			}))
		})			
		.forEach( function( operation ){

			const adjustedRegisterIndices = operation.registerIndices.map( function( registerIndex ){

				return registerIndex - registerFirstIndex
			})
			copy.set$(

				1 + m - momentFirstIndex, 
				operation.gate, 
				adjustedRegisterIndices, 
				operation.gateId,
				true//  Allow overrun; ghost indices.
			)
		})


		//  The cut$() operation just calls copy()
		//  with the following boolean set to true.
		//  If this is a cut we need to 
		//  replace all gates in this area with identity gates.

		//  UPDATE !!!!
		//  will come back to fix!!
		//  with  new style it's now just a  matter  of 
		// splicing out these out of circuit.operations


		
		if( isACutOperation === true ){

			/*
			for( let m = momentFirstIndex; m < momentLastIndex; m ++ ){

				original.moments[ m ] = new Array( original.bandwidth )
				.fill( 0 )
				.map( function( qubit, q ){

					return { 

						gate: Q.Gate.IDENTITY,
						registerIndices: [ q ]
					}
				})
			}*/
		}
		return copy
	},
	cut$: function( options ){

		return this.copy( options, true )
	},







	/*




	If covers all moments for 1 or more qubits then 
	1. go through each moment and remove those qubits
	2. remove hanging operations. (right?? don’t want them?)




	*/

	spliceCut$: function( options ){

		let {

			qubitFirstIndex,
			qubitRange,
			qubitLastIndex,
			momentFirstIndex,
			momentRange,
			momentLastIndex

		} = this.determineRanges( options )


		//  Only three options are valid:
		//  1. Selection area covers ALL qubits for a series of moments.
		//  2. Selection area covers ALL moments for a seriies of qubits.
		//  3. Both of the above (splice the entire circuit).

		if( qubitRange  !== this.bandwidth &&
			momentRange !== this.timewidth ){

			return Q.error( `Q.Circuit attempted to splice circuit #${this.index} by an area that did not include all qubits _or_ all moments.` )
		}


		//  If the selection area covers all qubits for 1 or more moments
		//  then splice the moments array.
			
		if( qubitRange === this.bandwidth ){


			//  We cannot use Array.prototype.splice() for this
			//  because we need a DEEP copy of the array
			//  and splice() will only make a shallow copy.
			
			this.moments = this.moments.reduce( function( accumulator, moment, m ){

				if( m < momentFirstIndex - 1 || m >= momentLastIndex - 1 ) accumulator.push( moment )
				return accumulator
			
			}, [])
			this.timewidth -= momentRange

			//@@  And how do we implement splicePaste$() here?
		}


		//  If the selection area covers all moments for 1 or more qubits
		//  then iterate over each moment and remove those qubits.
	
		if( momentRange === this.timewidth ){


			//  First, let’s splice the inputs array.

			this.inputs.splice( qubitFirstIndex, qubitRange )
			//@@  this.inputs.splice( qubitFirstIndex, qubitRange, qubitsToPaste?? )
			

			//  Now we can make the proper adjustments
			//  to each of our moments.

			this.moments = this.moments.map( function( operations ){

				
				//  Remove operations that pertain to the removed qubits.
				//  Renumber the remaining operations’ qubitIndices.
				
				return operations.reduce( function( accumulator, operation ){

					if( operation.qubitIndices.every( function( index ){

						return index < qubitFirstIndex || index >= qubitLastIndex
					
					})) accumulator.push( operation )
					return accumulator
				
				}, [])
				.map( function( operation ){

					operation.qubitIndices = operation.qubitIndices.map( function( index ){

						return index >= qubitLastIndex ? index - qubitRange : index
					})
					return operation
				})
			})
			this.bandwidth -= qubitRange
		}
		

		//  Final clean up.

		this.removeHangingOperations$()
		this.fillEmptyOperations$()
		

		return this//  Or should we return the cut area?!
	},
	splicePaste$: function(){


	},
	




	//  This is where “hanging operations” get interesting!
	//  when you paste one circuit in to another
	//  and that clipboard circuit has hanging operations
	//  those can find a home in the circuit its being pasted in to!


	paste$: function( other, atMoment = 0, atQubit = 0, shouldClean = true ){

		const scope = this
		this.timewidth = Math.max( this.timewidth, atMoment + other.timewidth )
		this.bandwidth = Math.max( this.bandwidth, atQubit  + other.bandwidth )
		this.ensureMomentsAreReady$()
		this.fillEmptyOperations$()
		other.moments.forEach( function( moment, m ){

			moment.forEach( function( operation ){

				//console.log( 'past over w this:', m + atMoment, operation )

				scope.set$(

					m + atMoment + 1,
					operation.gate,
					operation.qubitIndices.map( function( qubitIndex ){

						return qubitIndex + atQubit
					}),
					operation.gateId,
					true
				)
			})
		})
		if( shouldClean ) this.removeHangingOperations$()
		this.fillEmptyOperations$()
		return this
	},
	pasteInsert$: function( other, atMoment, atQubit ){

		// if( other.alphandwidth !== this.bandwidth && 
		// 	other.timewidth !== this.timewidth ) return Q.error( 'Q.Circuit attempted to pasteInsert Circuit A', other, 'in to circuit B', this, 'but neither their bandwidth or timewidth matches.' )

		


		if( shouldClean ) this.removeHangingOperations$()
		this.fillEmptyOperations$()		
		return this

	},
	expand$: function(){

		//   expand either bandwidth or timewidth, fill w  identity


		this.fillEmptyOperations$()
		return thiis
	},







	trim$: function( options ){

		`
		Edit this circuit by trimming off moments, qubits, or both.
		We could have implemented trim$() as a wrapper around copy$(),
		similar to how cut$ is a wrapper around copy$().
		But this operates on the existing circuit 
		instead of returning a new one and returning that.
		`

		let {

			qubitFirstIndex,
			qubitRange,
			qubitLastIndex,
			momentFirstIndex,
			momentRange,
			momentLastIndex

		} = this.determineRanges( options )


		//  First, trim the moments down to desired size.

		this.moments = this.moments.slice( momentFirstIndex, momentLastIndex )
		this.timewidth = momentRange


		//  Then, trim the bandwidth down.

		this.inputs = this.inputs.slice( qubitFirstIndex, qubitLastIndex )
		this.bandwidth = qubitRange


		//  Finally, remove all gates where
		//  gate’s qubit indices contain an index < qubitFirstIndex,
		//  gate’s qubit indices contain an index > qubitLastIndex,
		//  and fill those holes with Identity gates.
		
		this.removeHangingOperations$()
		this.fillEmptyOperations$()

		return this
	}
})




Q.Circuit.BELL = Q`

	H-C0
	I-C1
`






/*
Q.Circuit.createConstants(

	'BELL', Q(`

		H-C0
		I-C1
	`),
	//https://docs.microsoft.com/en-us/quantum/concepts/circuits?view=qsharp-preview
	// 'TELEPORT', Q.(`
		
	// 	I-I--H-M---v
	// 	H-C0-I-M-v-v
	// 	I-C1-I-I-X-Z-
	// `)
)







*/




var grover = 

//  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20
`	H  X  W  C0 I  C0 I  I  I  C0 I  I  I  C0 I  X  H  X  I  W
	H  X  I  C1 W  C1 W  C0 I  I  I  C0 X  I  H  X  I  I  I  I
	H  X  I  I  I  I  I  C1 W  C1 W  C1 W  C1 I  W  X  H  X  I
	H  X  W  I  W  I  W  I  W  I  W  I  W  I  I  W  X  H  X  W
`







