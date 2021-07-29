
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


	//  Undo / Redo history.

	this.history = new Q.History( this )
}




Object.assign( Q.Circuit, {

	index: 0,
	help: function(){ return Q.help( this )},
	constants: {},
	createConstant:  Q.createConstant,
	createConstants: Q.createConstants,


	fromText: function( text ){


		//  This is a quick way to enable `fromText()`
		//  to return a default new Q.Circuit().

		if( text === undefined ) return new Q.Circuit()


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
						
						gateSymbol:        matches[ 1 ],
						operationMomentId: matches[ 3 ],
						mappingIndex:     +matches[ 5 ]
					}
				})
			})
		)
	},















//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//  Working out a new syntax here... Patience please!


	fromText2: function( text ){


		text = `
			H  C  C
			I  C1 C1
			I  X1 S1
			I  X1 S1`


		//  This is a quick way to enable `fromText()`
		//  to return a default new Q.Circuit().

		if( text === undefined ) return new Q.Circuit()


		//  Is this a String Template -- as opposed to a regular String?
		//  If so, let’s convert it to a regular String.
		//  Yes, this maintains the line breaks.

		if( text.raw !== undefined ) text = ''+text.raw



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

				// +++++++++++++++++++++++
				// need to map LETTER[] optional NUMBER ]

				const matches = item.match( /(^\w+)(\.(\w+))*(#(\d+))*/ )

				//const matches = item.match( /(^\w+)(#(\w+))*(\.(\d+))*/ )
				// const matches = item.match( /(^\w+)(\.(\w+))*(#(\d+))*/ )
				// return {
					
				// 	gateSymbol:         matches[ 1 ],
				// 	operationMomentId: matches[ 3 ],
				// 	mappingIndex:     +matches[ 5 ]
				// }
			})
		})

	},



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++











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
					if( operation.gateSymbol === sibling.gateSymbol &&
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
						circuit.operations[ operationsIndex ].isControlled = operation.gateSymbol != '*'//  Q.Gate.SWAP.
						siblingHasBeenFound = true
					}
				}
				if( siblingHasBeenFound === false && operation.gateSymbol !== 'I' ){

					const 
					gate = Q.Gate.findBySymbol( operation.gateSymbol ),
					registerIndices = []					

					if( Q.isUsefulInteger( operation.mappingIndex )){
					
						registerIndices[ operation.mappingIndex ] = registerIndex
					}
					else registerIndices[ 0 ] = registerIndex					
					circuit.operations.push({

						gate,
						momentIndex,
						registerIndices,
						isControlled: false,
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

			'Q.Circuit.evaluate began', { 

				detail: { circuit }
			}
		))


		//  Our circuit’s operations must be in the correct order
		//  before we attempt to step through them!

		circuit.sort$()



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
			
				if( operation.isControlled ){
				//if( operation.registerIndices.length > 1 ){

					// operation.gate = Q.Gate.PAULI_X
					//  why the F was this hardcoded in there?? what was i thinking?!
					//  OH I KNOW !
					//  that was from back when i represented this as "C" -- its own gate
					//  rather than an X with multiple registers.
					//  so now no need for this "if" block at all.
					//  will remove in a few cycles.
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


			window.dispatchEvent( new CustomEvent( 'Q.Circuit.evaluate progressed', { detail: {

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



		window.dispatchEvent( new CustomEvent( 'Q.Circuit.evaluate completed', { detail: {
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


	//  This is absolutely required by toTable.

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


	//  Many export functions rely on toTable
	//  and toTable itself absolutely relies on 
	//  a circuit’s operations to be SORTED correctly.
	//  We could force circuit.sort$() here,
	//  but then toTable would become toTable$
	//  and every exporter that relies on it would 
	//  also become destructive.

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

					symbol:   'I',
					symbolDisplay: 'I',
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
		gateTypesUsedThisMoment = {}

		this.operations.forEach( function( operation, operationIndex, operations ){


			//  We need to keep track of
			//  how many multi-register operations
			//  occur during this moment.

			if( momentIndex !== operation.momentIndex ){

				table[ momentIndex ].gateTypesUsedThisMoment = gateTypesUsedThisMoment
				momentIndex = operation.momentIndex
				multiRegisterOperationIndex = 0
				gateTypesUsedThisMoment = {}
			}
			if( operation.registerIndices.length > 1 ){

				table[ momentIndex - 1 ].multiRegisterOperationIndex = multiRegisterOperationIndex
				multiRegisterOperationIndex ++
			}
			if( gateTypesUsedThisMoment[ operation.gate.symbol ] === undefined ){

				gateTypesUsedThisMoment[ operation.gate.symbol ] = 1
			}
			else gateTypesUsedThisMoment[ operation.gate.symbol ] ++


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

					symbol:        operation.gate.symbol,
					symbolDisplay: operation.gate.symbol,
					name:         operation.gate.name,
					nameCss,
					operationIndex,
					momentIndex: operation.momentIndex,
					registerIndex,
					isMultiRegisterOperation,
					multiRegisterOperationIndex,
					gatesOfThisTypeNow: gateTypesUsedThisMoment[ operation.gate.symbol ],
					indexAmongSiblings,
					siblingExistsAbove: Math.min( ...operation.registerIndices ) < registerIndex,
					siblingExistsBelow: Math.max( ...operation.registerIndices ) > registerIndex
				}
			})

/*


++++++++++++++++++++++

Non-fatal problem to solve here:

Previously we were concerned with “gates of this type used this moment”
when we were thinking about CNOT as its own special gate.
But now that we treat CNOT as just connected X gates,
we now have situations 
where a moment can have one “CNOT” but also a stand-alone X gate
and toTable will symbol the “CNOT” as X.0 
(never X.1, because it’s the only multi-register gate that moment)
but still uses the symbol X.0 instead of just X
because there’s another stand-alone X there tripping the logic!!!





*/


			// if( operationIndex === operations.length - 1 ){
				
				table[ momentIndex - 1 ].gateTypesUsedThisMoment = gateTypesUsedThisMoment
			// }
		})











		table.forEach( function( moment, m ){

			moment.forEach( function( operation, o ){

				if( operation.isMultiRegisterOperation ){

					if( moment.gateTypesUsedThisMoment[ operation.symbol ] > 1 ){

						operation.symbolDisplay = operation.symbol +'.'+ ( operation.gatesOfThisTypeNow - 1 )
					}
					operation.symbolDisplay += '#'+ operation.indexAmongSiblings
				}
			})
		})


		//  Now we can easily read down each moment
		//  and establish the moment’s character width.
		//  Very useful for text-based diagrams ;)

		table.forEach( function( moment ){

			const maximumWidth = moment.reduce( function( maximumWidth, operation ){

				return Math.max( maximumWidth, operation.symbolDisplay.length )
			
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

				let cellString = table[ x ][ y ].symbolDisplay.padEnd( table[ x ].maximumCharacterWidth, '-' )
				if( makeAllMomentsEqualWidth && x < table.timewidth - 1 ){

					cellString = table[ x ][ y ].symbolDisplay.padEnd( table.maximumCharacterWidth, '-' )
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
			output[ y3 + 2 ] += 'r'+ ( q + 1 ) +'  |'+ qubit.beta.toText().trim() +'⟩─'
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

				if( operation.symbol === 'I' ){

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
					second += Q.centerText( operation.symbolDisplay, padToLength )
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
	toGoogleCirq: function(){
/*


cirq.GridQubit(4,5)

https://cirq.readthedocs.io/en/stable/tutorial.html

*/
		const header = `import cirq`

		return headers
	},
	toAmazonBraket: function(){

		const header = `import boto3
from braket.aws import AwsQuantumSimulator, AwsQuantumSimulatorArns
from braket.circuits import Circuit

aws_account_id = boto3.client("sts").get_caller_identity()["Account"]
device = AwsQuantumSimulator(AwsQuantumSimulatorArns.QS1)
s3_folder = (f"braket-output-{aws_account_id}", "folder-name")

`
		//`qjs_circuit = Circuit().h(0).cnot(0,1)`
		let circuit = this.operations.reduce( function( string, operation ){

			let awsGate = operation.gate.AmazonBraketName !== undefined ?
				operation.gate.AmazonBraketName :
				operation.gate.symbol.substr( 0, 1 ).toLowerCase()

			if( operation.gate.symbol === 'X' && 
				operation.registerIndices.length > 1 ){

				awsGate = 'cnot'
			}
			if( operation.gate.symbol === '*' ){

				awsGate = 'i'
			}
			
			return string +'.'+ awsGate +'(' + 
				operation.registerIndices.reduce( function( string, registerIndex, r ){

					return string + (( r > 0 ) ? ',' : '' ) + ( registerIndex - 1 )

				}, '' ) + ')'

		}, 'qjs_circuit = Circuit()' )
		if( this.operations.length === 0 ) circuit +=  '.i(0)'//  Quick fix to avoid an error here!

		const footer = `\n\ntask = device.run(qjs_circuit, s3_folder, shots=100)
print(task.result().measurement_counts)`
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
				if( operation.symbol !== 'I' ){

					if( operation.isMultiRegisterOperation ){

						if( operation.indexAmongSiblings === 0 ){

							if( operation.symbol === 'X' ) command = 'targ'
							else command = operation.symbol.toLowerCase()
						}
						else if( operation.indexAmongSiblings > 0 ) command = 'ctrl{?}'
					}
					else command = operation.symbol.toLowerCase()
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


	get: function( momentIndex, registerIndex ){

		return this.operations.find( function( op ){

			return op.momentIndex === momentIndex && 
				op.registerIndices.includes( registerIndex )
		})
	},
	clear$: function( momentIndex, registerIndices ){

		const circuit = this


		//  Validate our arguments.
		
		if( arguments.length !== 2 ) 
			Q.warn( `Q.Circuit.clear$ expected 2 arguments but received ${ arguments.length }.` )
		if( Q.isUsefulInteger( momentIndex ) !== true )
			return Q.error( `Q.Circuit attempted to clear an input on Circuit #${ circuit.index } using an invalid moment index:`, momentIndex )
		if( Q.isUsefulInteger( registerIndices )) registerIndices = [ registerIndices ]
		if( registerIndices instanceof Array !== true )
			return Q.error( `Q.Circuit attempted to clear an input on Circuit #${ circuit.index } using an invalid register indices array:`, registerIndices )


		//  Let’s find any operations 
		//  with a footprint at this moment index and one of these register indices
		//  and collect not only their content, but their index in the operations array.
		// (We’ll need that index to splice the operations array later.)

		const foundOperations = circuit.operations.reduce( function( filtered, operation, o ){

			if( operation.momentIndex === momentIndex && 
				operation.registerIndices.some( function( registerIndex ){

					return registerIndices.includes( registerIndex )
				})
			) filtered.push({

				index: o,
				momentIndex: operation.momentIndex,
				registerIndices: operation.registerIndices,
				gate: operation.gate
			})
			return filtered

		}, [] )


		//  Because we held on to each found operation’s index
		//  within the circuit’s operations array
		//  we can now easily splice them out of the array.

		foundOperations.reduce( function( deletionsSoFar, operation ){

			circuit.operations.splice( operation.index - deletionsSoFar, 1 )
			return deletionsSoFar + 1

		}, 0 )


		//  IMPORTANT!
		//  Operations must be sorted properly
		//  for toTable to work reliably with
		//  multi-register operations!!
				
		this.sort$()


		//  Let’s make history.

		if( foundOperations.length ){

			this.history.record$({

				redo: {
					
					name: 'clear$',
					func:  circuit.clear$,				
					args:  Array.from( arguments )
				},
				undo: foundOperations.reduce( function( undos, operation ){

					undos.push({

						name: 'set$',
						func: circuit.set$,
						args: [

							operation.gate,
							operation.momentIndex,
							operation.registerIndices
						]
					})
					return undos
				
				}, [] )
			})


			//  Let anyone listening, 
			//  including any circuit editor interfaces,
			//  know about what we’ve just completed here.

			foundOperations.forEach( function( operation ){

				window.dispatchEvent( new CustomEvent( 

					'Q.Circuit.clear$', { detail: { 

						circuit,
						momentIndex,
						registerIndices: operation.registerIndices
					}}
				))
			})
		}


		//  Enable that “fluent interface” method chaining :)

		return circuit
	},
	

	setProperty$: function( key, value ){

		this[ key ] = value
		return this
	},
	setName$: function( name ){

		if( typeof name === 'function' ) name = name()
		return this.setProperty$( 'name', name )
	},


	set$: function( gate, momentIndex, registerIndices ){

		const circuit = this


		//  Is this a valid gate?

		if( typeof gate === 'string' ) gate = Q.Gate.findBySymbol( gate )
		if( gate instanceof Q.Gate !== true ) return Q.error( `Q.Circuit attempted to add a gate to circuit #${ this.index } at moment #${ momentIndex } that is not a gate:`, gate )


		//  Is this a valid moment index?
		
		if( Q.isUsefulNumber( momentIndex ) !== true ||
			Number.isInteger( momentIndex ) !== true ||
			momentIndex < 1 || momentIndex > this.timewidth ){

			return Q.error( `Q.Circuit attempted to add a gate to circuit #${ this.index } at a moment index that is not valid:`, momentIndex )
		}


		//  Are these valid register indices?

		if( typeof registerIndices === 'number' ) registerIndices = [ registerIndices ]
		if( registerIndices instanceof Array !== true ) return Q.error( `Q.Circuit attempted to add a gate to circuit #${ this.index } at moment #${ momentIndex } with an invalid register indices array:`, registerIndices )
		if( registerIndices.length === 0 ) return Q.error( `Q.Circuit attempted to add a gate to circuit #${ this.index } at moment #${ momentIndex } with an empty register indices array:`, registerIndices )
		if( registerIndices.reduce( function( accumulator, registerIndex ){

			// console.log(accumulator && 
			// 	registerIndex > 0 && 
			// 	registerIndex <= circuit.bandwidth)
			return (

				accumulator && 
				registerIndex > 0 && 
				registerIndex <= circuit.bandwidth
			)

		}, false )){

			return Q.warn( `Q.Circuit attempted to add a gate to circuit #${ this.index } at moment #${ momentIndex } with some out of range qubit indices:`, registerIndices )
		}


		//  Ok, now we can check if this set$ command
		//  is redundant.

		const
		isRedundant = !!circuit.operations.find( function( operation ){

			return (

				momentIndex === operation.momentIndex &&
				gate === operation.gate &&
				registerIndices.length === operation.registerIndices.length &&
				registerIndices.every( val => operation.registerIndices.includes( val ))
			)
		})


		//  If it’s NOT redundant 
		//  then we’re clear to proceed.

		if( isRedundant !== true ){


			//  If there’s already an operation here,
			//  we’d better get rid of it!
			//  This will also entirely remove any multi-register operations
			//  that happen to have a component at this moment / register.
			
			this.clear$( momentIndex, registerIndices )
			

			//  Finally. 
			//  Finally we can actually set this operation.
			//  Aren’t you glad we handle all this for you?

			const 
			isControlled = registerIndices.length > 1 && gate !== Q.Gate.SWAP,
			operation = {

				gate,
				momentIndex,
				registerIndices,
				isControlled
			}
			this.operations.push( operation )

			
			//  IMPORTANT!
			//  Operations must be sorted properly
			//  for toTable to work reliably with
			//  multi-register operations!!
			
			this.sort$()


			//  Let’s make history.

			this.history.record$({

				redo: {
					
					name: 'set$',
					func: circuit.set$,
					args: Array.from( arguments )
				},
				undo: [{

					name: 'clear$',
					func: circuit.clear$,
					args: [ momentIndex, registerIndices ]
				}]
			})

			
			//  Emit an event that we have set an operation
			//  on this circuit.

			window.dispatchEvent( new CustomEvent( 

				'Q.Circuit.set$', { detail: { 

					circuit,
					operation
				}}
			))
		}
		return circuit
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

				operation.gate, 
				1 + m - momentFirstIndex, 
				adjustedRegisterIndices
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

					operation.gate,
					m + atMoment + 1,
					operation.qubitIndices.map( function( qubitIndex ){

						return qubitIndex + atQubit
					})
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







//  Against my predilection for verbose clarity...
//  I offer you super short convenience methods
//  that do NOT use the $ suffix to delcare they are destructive.
//  Don’t shoot your foot off.

Object.entries( Q.Gate.constants ).forEach( function( entry ){

	const 
	gateConstantName = entry[ 0 ],
	gate = entry[ 1 ],
	set$ = function( momentIndex, registerIndexOrIndices ){

		this.set$( gate, momentIndex, registerIndexOrIndices )
		return this
	}
	Q.Circuit.prototype[ gateConstantName ] = set$
	Q.Circuit.prototype[ gate.symbol ] = set$
	Q.Circuit.prototype[ gate.symbol.toLowerCase() ] = set$
})



/*
const bells = [


	//  Verbose without shortcuts.

	new Q.Circuit( 2, 2 )
		.set$( Q.Gate.HADAMARD, 1, [ 1 ])
		.set$( Q.Gate.PAULI_X,  2, [ 1 , 2 ]),

	new Q.Circuit( 2, 2 )
		.set$( Q.Gate.HADAMARD, 1, 1 )
		.set$( Q.Gate.PAULI_X,  2, [ 1 , 2 ]),


	//  Uses Q.Gate.findBySymbol() to lookup gates.

	new Q.Circuit( 2, 2 )
		.set$( 'H', 1, [ 1 ])
		.set$( 'X', 2, [ 1 , 2 ]),

	new Q.Circuit( 2, 2 )
		.set$( 'H', 1, 1 )
		.set$( 'X', 2, [ 1 , 2 ]),


	//  Convenience gate functions -- constant name.

	new Q.Circuit( 2, 2 )
		.HADAMARD( 1, [ 1 ])
		.PAULI_X(  2, [ 1, 2 ]),

	new Q.Circuit( 2, 2 )
		.HADAMARD( 1, 1 )
		.PAULI_X(  2, [ 1, 2 ]),


	//  Convenience gate functions -- uppercase symbol.

	new Q.Circuit( 2, 2 )
		.H( 1, [ 1 ])
		.X( 2, [ 1, 2 ]),

	new Q.Circuit( 2, 2 )
		.H( 1, 1 )
		.X( 2, [ 1, 2 ]),


	//  Convenience gate functions -- lowercase symbol.

	new Q.Circuit( 2, 2 )
		.h( 1, [ 1 ])
		.x( 2, [ 1, 2 ]),

	new Q.Circuit( 2, 2 )//  Perhaps the closest to Braket style.
		.h( 1, 1 )
		.x( 2, [ 1, 2 ]),


	//  Q function -- bandwidth / timewidth arguments.

	Q( 2, 2 )
		.h( 1, [ 1 ])
		.x( 2, [ 1, 2 ]),

	Q( 2, 2 )
		.h( 1, 1 )
		.x( 2, [ 1, 2 ]),


	//  Q function -- text block argument
	//  with operation symbols
	//  and operation component IDs.

	Q`
		H-X.0#0
		I-X.0#1`,

	
	//  Q function -- text block argument
	//  using only component IDs
	// (ie. no operation symbols)
	//  because the operation that the 
	//  components should belong to is NOT ambiguous.
	
	Q`
		H-X#0
		I-X#1`,


	//  Q function -- text block argument
	//  as above, but using only whitespace
	//  to partition between moments.

	Q`
		H X#0
		I X#1`	
],
bellsAreEqual = !!bells.reduce( function( a, b ){

	return a.toText() === b.toText() ? a : NaN

})
if( bellsAreEqual ){

	console.log( `\n\nYES. All of ${ bells.length } our “Bell” circuits are equal.\n\n`, bells ) 
}
*/







Q.Circuit.createConstants(

	'BELL', Q`

		H  X#0
		I  X#1
	`,	
	// 'GROVER', Q`

	// 	H  X  *#0  X#0  I    X#0  I    I    I    X#0  I    I    I    X#0  I  X    H  X  I  *#0
	// 	H  X  I    X#1  *#0  X#1  *#0  X#0  I    I    I    X#0  X    I    H  X    I  I  I  I
	// 	H  X  I    I    I    I    I    X#1  *#0  X#1  *#0  X#1  *#0  X#1  I  *#0  X  H  X  I
	// 	H  X  *#1  I    *#1  I    *#1  I    *#1  I    *#1  I    *#1  I    I  *#1  X  H  X  *#1
	// `

	//https://docs.microsoft.com/en-us/quantum/concepts/circuits?view=qsharp-preview
	// 'TELEPORT', Q.(`
		
	// 	I-I--H-M---v
	// 	H-C0-I-M-v-v
	// 	I-C1-I-I-X-Z-
	// `)
)




