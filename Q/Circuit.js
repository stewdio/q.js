
//  Copyright © 2019, Stewart Smith. See LICENSE for details.




Q.Circuit = function( bandwidth, timewidth ){


	//  What number Circuit is this
	//  that we’re attempting to make here?
	
	this.index = Q.Circuit.index ++


	//  How many qubits (registers) shall we use?

	if( !Q.isUsefulNumber( bandwidth )) bandwidth = 3
	this.bandwidth = bandwidth


	//  How many operations can we perform on each qubit?
	//  Each operation counts as one moment; one clock tick.

	if( !Q.isUsefulNumber( timewidth )) timewidth = 5
	this.timewidth = timewidth


	//  This is the rational thing to do: assume all input qubits are 0.
	//  However, let’s say you want to take a section of a circuit
	//  and snip that out to work on it separately. 
	//  You cannot do that in real life -- but here you can!
	//  Just assign those inputs to whatever you need :)

	this.inputs = new Array( bandwidth ).fill( Q.Qubit.HORIZONTAL )


	//  x
	
	this.operations = []


	//  Does our circuit need evaluation?
	//  Certainly, yes!
	// (And will again each time it is modified.)

	this.needsEvaluation = true
	

	//  When our circuit is evaluated 
	//  we store that result in its matrix.

	this.matrix = null
}








Object.assign( Q.Circuit, {

	index: 0,
	help: function(){ return Q.help( this )},
	constants: {},
	createConstant:  Q.createConstant,
	createConstants: Q.createConstants,






	controlled: function( U ){
		
		// console.log( 'U?', U )

		const 
		size = U.getWidth(),
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
			
			qubitIndices[ i ] = ( circuitBandwidth - 1 ) - qubitIndices[ i ]
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




	evaluate: function( circuit, x ){

		if( x === undefined ){


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

			x = new Q.Matrix( 1, circuit.bandwidth * 2 )
			x.write$( 0, 0, 1 )
		}



		// console.log( '\n\n\nabout to eval this circuit!')
		// console.log( 'what is circuit??', circuit )
		// console.log( 'what is X??', x )
		// console.log( 'this circuit', circuit.toDiagram() )

		const operationsTotal = circuit.operations.length
		let operationsCompleted = 0
		let matrix = circuit.operations.reduce( function( x, operation ){

			let U
			if( operation.registerIndices.length < Infinity ){
			
				U = operation.gate.matrix
			} 
			else {
			
				//  This is for Quantum Fourier Transforms (QFT). 
				//  Will have to come back to this at a later date!
			}			
			// console.log( 'U = operation.gate.matrix', U.toTsv() )



			/*

			WHEN I TAKE THIS OUT IT WORKS !

			for( let j = 0; j < operation.qubitIndices.length; j ++ ){
			
				U = Q.Circuit.controlled( U )
				console.log( 'qubitIndex #', j, 'U = Q.Circuit.controlled( U )', U.toTsv() )
			}*/




			//  We need to send a COPY of the registerIndices Array
			//  to .expandMatrix()
			//  otherwise it *may* modify the actual registerIndices Array
			//  and wow -- tracking down that bug was painful!

			const registerIndices = operation.registerIndices.slice()


			// console.log( 'ABOUT TO MULTIPLY' )
			// console.log( 'x???', x.toTsv() )

			if( x instanceof Q.Matrix ){
			
				// console.log( 'x is a matrix. good. EXPANDING it...' )
				x = Q.Circuit.expandMatrix( circuit.bandwidth, U, registerIndices ).multiply( x )
				// x = x.multiply( Q.Circuit.expandMatrix( circuit.bandwidth, U, operation.qubitIndices ))
			}
			else {

				// console.log( 'huh...  x wants a matrix... and we didn’t have one (BAD!)') 
				x = Q.Circuit.expandMatrix( circuit.bandwidth, U, registerIndices )
			}


			operationsCompleted ++
			// console.log( `\n\nProgress ... ${ Math.round( operationsCompleted / operationsTotal * 100 )}%`)
			// console.log( 'Moment .....', operation.momentIndex )
			// console.log( 'Registers ..', JSON.stringify( operation.registerIndices ))
			// console.log( 'Gate .......', operation.gate.name )
			// console.log( 'Intermediate result:', x.toTsv() )
			

			return x
			
		}, x )


	



		const outcomes = matrix.rows.reduce( function( outcomes, row, i ){

			outcomes.push({

				state: '|'+ parseInt( i, 10 ).toString( 2 ).padStart( circuit.bandwidth, '0' ) +'⟩',
				probability: Math.pow( row[ 0 ].absolute(), 2 )
			})
			return outcomes
		
		}, [] )

		





		return {

			matrix,
			outcomes
		}
	},



	





	fromText: function( text ){


		//  Is this a String Template -- as opposed to a regular String?
		//  If so, let’s convert it to a regular String.
		//  Yes, this maintains the line breaks.

		if( text.raw !== undefined ) text = ''+text.raw


		//  Break this text up in to registers (by line returns)
		//  and then each register in to moments (by non-word chars).

		const 
		lines = text.split( '\n' ).reduce( function( cleaned, line ){

			const trimmed = line.trim()			
			if( trimmed.length ) cleaned.push( trimmed.toUpperCase().split( /\W+/ ))
			return cleaned

		}, [] ),
		bandwidth = lines.length


		//  Validate the circuit’s moments.
		//  They should be equal for each series of qubit operations.

		const timewidth = lines[ 0 ].length
		lines.forEach( function( line, l ){

			if( line.length !== timewidth ) return Q.error( `Q.Circuit attempted to create a new circuit from text input but the amount of time implied in the submitted text is not consistent.` )
		})


		//  Create the new circuit
		//  then attempt to populate it with actual gates.

		const circuit = new Q.Circuit( bandwidth, timewidth )
		lines.forEach( function( register, r ){

			register.forEach( function( moment, m ){


				//  We’re expecting that
				//  for each MOMENT of each REGISTER
				//  there is an OPERATION
				//  and it is identified by a letter,
				//  and possibly disambiguated by a number.

				let
				letters = moment.match( /^[A-Za-z]+/ ),
				numbers = moment.match( /\d+$/ )


				//  Let’s see if we can find this operation
				//  by its letter code.

				if( letters !== null ) letters = letters[ 0 ]
				const gate = new Q.Gate.findByLabel( letters )
				if( gate instanceof Q.Gate !== true ) return Q.error( `Q.Circuit attempted to create a new circuit from text input but could not identify this submitted gate: ${ moment }.` )


				//  If this operation only accepts a single qubit input
				//  then we are done and done here.

				if( gate.bandwidth == 1 ){

					circuit.set$( m + 1, gate, [ r ])
				}


				//  But if this gate accepts more than one input
				//  we need to do some fancy footwork.

				else if( gate.bandwidth > 1 ){

					let operation, gateId, inputIndex
					if( numbers !== null ) numbers = numbers[ 0 ]
					

					//  If we receive a single digit number
					//  then we know this digit is just an input index
					//  and NOT a gateId.

					if( numbers.length === 1 ){

						inputIndex = numbers.substr( 0, 1 )


						//  We may already have this gate on file.
						//  If so, we’d better find it!

						operation = circuit.operations.find( function( operation ){

							return operation.momentIndex === m &&
								operation.gate.label === gate.label
						})
					}

					
					//  If we received a double digit number
					//  then the first number is a gate id
					//  and the second one is an input index.
					
					else if( numbers.length === 2 ){

						gateId = numbers.substr( 0, 1 )
						inputIndex = numbers.substr( 1, 1 )


						//  Similar to above, 
						//  but there might be more than one gate of this type
						//  so we need to check IDs.

						operation = circuit.operations.find( function( operation ){

							return (

								operation.momentIndex === m &&
								operation.gate.label === gate.label &&
								operation.gateId === gateId
							)
						})
					}

				

					//  If we’ve found this gate for this moment already
					//  all we need to do is set this input index to this qubit index.

					if( operation !== undefined ){

						circuit.clearThisInput$( m, [ r ])
						operation.registerIndices[ inputIndex ] = r					
					}
					else {
					
						
						//  Looks like this gate isn’t attached to this moment yet
						//  so we’ll attach it,
						//  but we’ll only supply this particular qubit’s index
						//  for the gate’s input indices.

						const registerIndices = []
						registerIndices[ inputIndex ] = r
						// if( gateId !== undefined ){

						// 	console.log( 'setting gate.id to gateId', gateId )
						// 	gate.id = gateId
						// }
						circuit.set$( m + 1, gate, registerIndices, gateId )
					}
				}
			})
		})
		return circuit
	}
})







Object.assign( Q.Circuit.prototype, {

	clone: function(){

		const 
		original = this,
		clone    = original.copy()

		//clone.results = original.results.clone()
		clone.inputs  = original.inputs.slice()
		
		return clone
	},
	evaluate$: function(){

		Object.assign( this, Q.Circuit.evaluate( this ))
		this.needsEvaluation = false
		return this
	},
	report$: function(){

		if( this.needsEvaluation ) this.evaluate$()
		const 
		circuit = this,
		text = this.outcomes.reduce( function( text, outcome, i ){

			return text +'\n'
				+ ( i + 1 ).toString().padStart( Math.ceil( Math.log10( Math.pow( 2, circuit.inputs.length ))), ' ' ) +'  '
				+ outcome.state
				+' '+ Q.round( 100 * outcome.probability, 8 ).toString().padStart( 3, ' ' ) +'% chance'
				+'  '+ ''.padStart( Math.round( outcome.probability * 32 ), '█' )

		}, '' ) + '\n\n'
		return text
	},
	try$: function(){

		if( this.needsEvaluation ) this.evaluate$()

		
		//  We need to “stack” our probabilities from 0..1.
		
		const outcomesStacked = new Array( this.outcomes.length )
		this.outcomes.reduce( function( sum, outcome, i ){

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
		momentIndex = 0,
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

				table[ momentIndex ].multiRegisterOperationIndex = multiRegisterOperationIndex
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

						nameCss = 'controlled'
					}
					else {

						nameCss = 'controller'
					}

					//  May need to re-visit the code above in consideration of SWAPs.

				}
				table[ operation.momentIndex ][ registerIndex ] = {

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
			if( operationIndex === operations.length - 1 ){
				
				table[ momentIndex ].operationsThisMoment = operationsThisMoment
			}
		})


		table.forEach( function( moment, m ){

			moment.forEach( function( operation, o ){

				if( operation.isMultiRegisterOperation ){

					if( moment.operationsThisMoment[ operation.label ] > 1 ){

						operation.labelDisplay = operation.label +''+ ( operation.operationsOfThisTypeNow - 1 )
					}
					operation.labelDisplay += ''+ operation.indexAmongSiblings
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
		scope.inputs.forEach( function( qubit, q ){

			const y3 = q * 3
			output[ y3 + 1 ] += '        '
			output[ y3 + 2 ] += 'r'+ q +'  |'+ qubit.beta.toText() +'⟩─'
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
	toDomGRID: function( target ){

		`
		Create a functioning document object model fragment
		that can uses CSS and responds to user interaction events
		to manifest a graphic user interface for this circuit.

		OBVIOUSLY THIS IS NOT COMPLETE !
		`

		const 
		scope = this,
		table = this.toTable()


		//  Create the circuit DOM element;
		//  acts as a container for all circuit-related things.

		const circuitElement = document.createElement( 'div' )
		circuitElement.classList.add( 'qjs-circuit' )
		circuitElement.setAttribute( 'title', 'Q Circuit #'+ scope.index )
		Object.assign( circuitElement.dataset, {

			type:     'Q.Circuit',
			index:     scope.index,
			bandwidth: scope.bandwidth,
			timewidth: scope.timewidth
		})


		

		scope.inputs.forEach( function( qubit, q ){

			//const rowElement = document.createElement( 'tr' )
			

			//  Input qubits.

			const inputElement = document.createElement( 'div' )
			inputElement.classList.add( 'qjs-input' )
			inputElement.setAttribute( 'title', qubit.name )
			inputElement.innerText = qubit.beta.toText() +'⟩' 
			Object.assign( inputElement.dataset, {

				type:        'Q.Qubit',
				index:        qubit.index,
				braReal:      qubit.alpha.real,
				braImaginary: qubit.alpha.imaginary,
				ketReal:      qubit.beta.real,
				ketImaginary: qubit.beta.imaginary,
			})
			circuitElement.appendChild( inputElement )

			
			//  Moments.
			/*
			table.forEach( function( moment ){

				const 
				operation = moment[ q ],
				tdElement = document.createElement( 'td' ),
				operationElement = document.createElement( 'div' )

				operationElement.classList.add( 'qjs-operation' )
				if( operation.label === 'I' ) operationElement.classList.add( 'identity' )
				//if( operation.label === 'I' ) operationElement.classList.add( 'entangled' )
				operationElement.innerText = operation.label

				

				// rowElement.appendChild( 
					
				// 	document.createElement( 'td' ).appendChild( operationElement )
				// )


				tdElement.appendChild( operationElement )
				rowElement.appendChild( tdElement )
			})*/


			// circuitElement.appendChild( rowElement )
		})


		//  Perhaps we don’t need this here?
		//  Is it best to return the DOM package
		//  and leave appending to whoever called this?

		if( target === undefined ) target = document.body
		target.appendChild( circuitElement )


		//  Yield a DOM package.

		return circuitElement
	},
	
































	toDom: function(){ 
	//toDom: function( target ){ 

		`
		Create a functioning document object model fragment
		that can uses CSS and responds to user interaction events
		to manifest a graphic user interface for this circuit.

		OBVIOUSLY THIS IS NOT COMPLETE !
		`

		const 
		scope = this,
		table = this.toTable()


		//  Create the circuit DOM element;
		//  acts as a container for all circuit-related things.

		const circuitElement = document.createElement( 'table' )
		circuitElement.classList.add( 'qjs-circuit' )
		circuitElement.setAttribute( 'title', 'Q Circuit #'+ scope.index )
		Object.assign( circuitElement.dataset, {

			type:     'Q.Circuit',
			index:     scope.index,
			bandwidth: scope.bandwidth,
			timewidth: scope.timewidth
		})


		//  Moment labels

		const timewidthElement = document.createElement( 'tr' )
		timewidthElement.classList.add( 'qjs-moment-labels' )
		
		const nullCell = document.createElement( 'td' )
		nullCell.classList.add( 'qjs-null-cell' )
		timewidthElement.appendChild( nullCell )
		
		const moment0Element = document.createElement( 'td' )
		moment0Element.classList.add( 'qjs-moment-label' )
		//moment0Element.innerText = 't0'
		//moment0Element.innerHTML = 'moment<br>0'
		moment0Element.innerHTML = 'moment <strong>0</strong>'
		timewidthElement.appendChild( moment0Element )
		table.forEach( function( moment, m ){

			const momentElement = document.createElement( 'td' )
			momentElement.classList.add( 'qjs-moment-label', 'qjs-moment-label-movable' )
			//momentElement.innerText = 't'+ ( m + 1 )
			//momentElement.innerHTML = 'moment<br>'+ ( m + 1 )
			momentElement.innerHTML = 'moment <strong>'+ ( m + 1 ) +'</strong>'
			timewidthElement.appendChild( momentElement )
		})
		circuitElement.appendChild( timewidthElement )
		

		scope.inputs.forEach( function( qubit, q ){

			const rowElement = document.createElement( 'tr' )
			

			//  Qubit register labels.

			const registerElement = document.createElement( 'td' )
			registerElement.classList.add( 'qjs-register', 'qjs-qubit-label' )
			registerElement.setAttribute( 'title', 'Register #'+ q )
			registerElement.innerHTML = 'qubit <strong>'+ q +'</strong>'
			rowElement.appendChild( registerElement )


			//  Input qubits.

			const inputElement = document.createElement( 'td' )
			inputElement.classList.add( 'qjs-input' )
			inputElement.setAttribute( 'title', qubit.name )
			inputElement.innerText = qubit.beta.toText() +'⟩' 
			Object.assign( inputElement.dataset, {

				type:        'Q.Qubit',
				index:        qubit.index,
				braReal:      qubit.alpha.real,
				braImaginary: qubit.alpha.imaginary,
				ketReal:      qubit.beta.real,
				ketImaginary: qubit.beta.imaginary,
			})
			rowElement.appendChild( inputElement )

			
			//  Moments.

			table.forEach( function( moment ){

				const 
				operation = moment[ q ],
				tdElement = document.createElement( 'td' ),
				wireElement = document.createElement( 'div' ),
				operationElement = document.createElement( 'div' )

				wireElement.classList.add( 'qjs-wire' )
				tdElement.appendChild( wireElement )

				// console.log( 'operation', operation )

				operationElement.classList.add( 'qjs-operation' )
				if( operation.label === 'I' ) operationElement.classList.add( 'qjs-operation-identity' )
				if( operation.bandwidth > 1 ){

					operationElement.classList.add( 'qjs-operation-entangled' )
					if( operation.gateInputIndex === 0 ) operationElement.classList.add( 'qjs-operation-control' )
					else operationElement.classList.add( 'qjs-operation-target' )
				}
				operationElement.innerText = operation.label


				tdElement.appendChild( operationElement )
				rowElement.appendChild( tdElement )
			})


			circuitElement.appendChild( rowElement )
		})







		/*

			
			Interaction notes.

			Not sure about click-and-drag to move individual gates
			because we need to be able to draw selection boxes around an area of gates.
			Could sort of accomplish that
			by having larger gaps between gates; whitespace to click between.


		*/


		//@@@@@@@  make this 

		const 
		elements  = Array.from( circuitElement.querySelectorAll( 'td' )),
		highlight = function( event ){

			const 
			el = event.target,
			x  = el.cellIndex,
			y  = el.parentNode.rowIndex

			if( x === 0 && y === 0 ) return
			el.classList.add( 'qjs-highlighted' )
			elements.forEach( function( other ){

				const
				otherX = other.cellIndex,
				otherY = other.parentNode.rowIndex

				if(( x === 0 && y === otherY ) ||
				   ( y === 0 && x === otherX )){

					other.classList.add( 'qjs-highlighted' )
				}
				if( 
					
					x > 0 && y > 0 && (

						( otherX === x && otherY === 0 ) || 
						( otherX === 0 && otherY === y )
					)
				){
				
					other.classList.add( 'qjs-highlighted' )
				}
			})
		},
		unhighlight = function(){

			elements.forEach( function( el ){

				el.classList.remove( 'qjs-highlighted' )
			})
		}
		elements.forEach( function( el ){

			el.addEventListener( 'mouseenter',  highlight )
			el.addEventListener( 'touchstart',  highlight )
			el.addEventListener( 'mouseleave',  unhighlight )
			el.addEventListener( 'touchend',    unhighlight )
		})


		//  Perhaps we don’t need this here?
		//  Is it best to return the DOM package
		//  and leave appending to whoever called this?

		//if( target === undefined ) target = document.body
		//target.appendChild( circuitElement )


		//  Yield a DOM package.

		return circuitElement
	},

	


	//  Oh yes my friends... WebGL is coming!

	toShader: function(){

	},























	    //////////////
	   //          //
	  //   Edit   //
	 //          //
	//////////////


	ensureMomentsAreReady$: function(){

		if( this.moments instanceof Array !== true ) this.moments = []
		for( let m = 0; m < this.timewidth; m ++ ){

			if( this.moments[ m ] instanceof Array !== true ) this.moments[ m ] = []
		}
		return this
	},
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

		if( registerIndices instanceof Array === false ){

			registerIndices = [ registerIndices ]
		}
		let operationsToRemove = 0
		while( operationsToRemove >= 0 ){
			
			operationsToRemove = this.operations.findIndex( function( operation, o ){

				return (

					operation.momentIndex === momentIndex && 
					operation.registerIndices.some( function( registerIndex ){

						return registerIndices.includes( registerIndex )
					})
				)
			})
			if( operationsToRemove >= 0 ){


				//  NOTE: Should we call remove$() here instead?
				//  and within there add that to an UNDO stack!
				
				this.operations.splice( operationsToRemove, 1 )
			}
		}
		return this
	},
	






	get: function( momentIndex, registerIndex ){

		return this.operations.find( function( op ){

			return op.momentIndex === momentIndex && 
				op.registerIndices.includes( registerIndex )
		})
	},
	set$: function( momentIndex, gate, registerIndices, gateId, allowOverrun ){

		const circuit = this


		//  We’re pretending that this Array is ONE-indexed, 
		//  rather than ZERO-indexed.
		//  This is because “moment 0” is the raw input state.

		momentIndex --


		//  Is this a valid moment index?
		
		if( momentIndex < 0 || momentIndex > this.timewidth - 1 ) return Q.error( `Q.Circuit attempted to add a gate to circuit #${this.index} at a moment index that is not valid:`, momentIndex )


		//  Is this a valid gate?

		if( gate instanceof Q.Gate !== true ) return Q.error( `Q.Circuit attempted to add a gate to circuit #${this.index} at moment #${momentIndex} that is not a gate:`, gate )


		//  Are these valid input indices?

		if( allowOverrun !== true ){
		
			if( registerIndices instanceof Array !== true ) return Q.error( `Q.Circuit attempted to add a gate to circuit #${this.index} at moment #${momentIndex} with an invalid qubit indices array:`, registerIndices )
			if( registerIndices.length === 0 ) return Q.error( `Q.Circuit attempted to add a gate to circuit #${this.index} at moment #${momentIndex} with an empty input qubit array:`, registerIndices )
			
			
			//  We’ve had to comment this check out because 
			//  we can’t know in a single pass 
			//  if we have all the indices needed
			//  for a multi-qubit gate:

			//if( qubitIndices.length !== gate.bandwidth ) return Q.error( `Q.Circuit attempted to add a gate to circuit #${this.index} at moment #${momentIndex} but the number of qubit indices (${qubitIndices}) did not match the gate’s bandwidth (${gate.bandwidth}).` )
			

			if( registerIndices.reduce( function( accumulator, qubitIndex ){

				return accumulator && qubitIndex >= 0 && qubitIndex < circuit.bandwidth

			}, false )){

				return Q.error( `Q.Circuit attempted to add a gate to circuit #${this.index} at moment #${momentIndex} with some out of range qubit indices:`, registerIndices )
			}
		}
		this.clearThisInput$( momentIndex, registerIndices )
		this.operations.push({

			momentIndex,
			registerIndices,
			gate,
			gateId
		})
		this.sort$()	
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










