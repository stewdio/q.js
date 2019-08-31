



Q.Circuit = function( bandwidth, timewidth ){

	`
	Currently, Q.Circuit is missing hardware-specific rules.
	ie. What qubits count as “next to each other”?
	Is this a flat circuit architecture? Circular? Etc.

	Also would like to return a Function object instead of regular object
	that calls prototype.run$() so can do SUPER SHORT syntax like:
	Q'H-M'() instead of Q'H-M'.run$()
	(And if can we get rid of the hyphens, even better.)

	`

	
	this.index = Q.Circuit.index ++


	//  How many qubits (registers) do we use?

	if( typeof bandwidth !== 'number' ) bandwidth = 3
	this.bandwidth = bandwidth


	//  How many gates can we use per qubit?
	//  Each one counts as one clock tick.

	if( typeof timewidth !== 'number' ) timewidth = 5
	this.timewidth = timewidth
	

	//  This is the rational thing to do: assume all input qubits are 0.
	//  However, let’s say you want to take a section of a circuit
	//  and snip that out to work on it separately. 
	//  You cannot do that in real life -- but here you can!
	//  Just assign those inputs to whatever you need :)

	this.inputs = new Array( bandwidth ).fill( Q.Qubit.HORIZONTAL )	
	

	//  Each moment is a collection of operations to run (gates),
	//  including what qubits to use in that operation.
	//  We’re going to begin by filling each moment with one
	//  IDENTITY gate per qubit.
	
	this.moments = new Array( timewidth )
		.fill( 0 )
		.map( function( moment, m ){

			const gates = new Array( bandwidth )
				.fill( 0 )
				.map( function( qubit, q ){

					return { 

						gate: Q.Gate.IDENTITY,
						qubitIndices: [ q ]
					}
				})
			gates.momentIndex = m
			return gates
		})

	this.results = []
	// Function.call( this )
}
// Q.Circuit.prototype = Object.create( Function.prototype )
// Q.Circuit.prototype.constructor = Q.Circuit




Object.assign( Q.Circuit, {

	index: 0,
	help: function(){ return Q.help( this )},
	constants: {},
	createConstant:  Q.createConstant,
	createConstants: Q.createConstants,


	fromText: function( text ){


		//  Is this a String Template? (As opposed to a regular String.)

		if( text.raw !== undefined ) text = ''+text.raw


		//  Break this text up in to registers (by line returns)
		//  and then each register in to moments (by non-word chars).

		const 
		linesRaw = text.split( '\n' ),
		lines = linesRaw.reduce( function( cleaned, line ){

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


		//  Create the new circuit to populate
		//  and attempt to flesh it out with actual gates.

		const p = new Q.Circuit( bandwidth, timewidth )
		lines.forEach( function( line, l ){

			line.forEach( function( moment, m ){

				let
				letters = moment.match( /^[A-Za-z]+/ ),
				numbers = moment.match( /\d+$/ )


				//  Hopefully the operation listed for this moment
				//  began with some letters that we can use
				//  to look up gates by label!

				if( letters !== null ) letters = letters[ 0 ]
				const gate = new Q.Gate.findByLabel( letters )
				if( gate instanceof Q.Gate !== true ) return Q.error( `Q.Circuit attempted to create a new circuit from text input but could not identify this submitted gate: ${ moment }.` )


				//  If this gate only accepts a single qubit input
				//  then we are done and DONE :)

				if( gate.bandwidth == 1 ){

					p.add$( m + 1, gate, [ l ])
				}


				//  But if this gate accepts more than one input
				//  we need to do some fancy footwork.

				else if( gate.bandwidth > 1 ){

					let operation, gateId, inputIndex

					if( numbers !== null ) numbers = numbers[ 0 ]
					

					//  If we receive a single digit number
					//  then we know this digital is just an input index.
					//  (And NOT a gateId.)

					if( numbers.length === 1 ){

						inputIndex = numbers.substr( 0, 1 )


						//  We may already have this gate on file.
						//  If so, we’d better find it!

						operation = p.moments[ m ].find( function( operation ){

							return operation.gate.label === gate.label
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

						operation = p.moments[ m ].find( function( operation ){

							// console.log( 'gateId', gateId, 'operation.gateId',  operation.gateId )
							return operation.gate.label === gate.label && operation.gateId === gateId
						})
						// console.log( 'gateId?', gateId )
						// console.log( 'found this gate!', operation )
					}
				

					//  If we’ve found this gate for this moment already
					//  all we need to do is set this input index to this qubit index.

					if( operation !== undefined ){

						p.clearThisInput$( p.moments[ m ], [ l ])
						operation.qubitIndices[ inputIndex ] = l						
					}
					else {
					
						
						//  Looks like this gate isn’t attached to this moment yet
						//  so we’ll attach it,
						//  but we’ll only supply this particular qubit’s index
						//  for the gate’s input indices.

						const inputIndices = []
						inputIndices[ inputIndex ] = l
						// if( gateId !== undefined ){

						// 	console.log( 'setting gate.id to gateId', gateId )
						// 	gate.id = gateId
						// }
						p.add$( m + 1, gate, inputIndices, gateId )
					}
				}
			})
		})
		return p
	},




	/*************************************************************************


	Ok: We want to be able to easily slice and dice circuits so you can have
	some “favorite snippets” you can glue in to other circuits and so on.
	That will be fun. When we get to it.


	*************************************************************************/

	copy: function(){},
	cut: function(){},
	paste: function(){},
	getMoment: function(){

		return {

			to: function( moment ){}
		}
	}
})








Object.assign( Q.Circuit.prototype, {

	clone: function(){

		const 
		original = this,
		clone    = original.copy()

		clone.results = original.results.slice()
		clone.inputs  = original.inputs.slice()
		
		return clone
	},




	    ////////////////
	   //            //
	  //   Output   //
	 //            //
	////////////////


	toTable: function(){

		`
		Our circuit already exists as an Array of moments.
		But within each moment is an Array of gates, NOT qubits.
		If a moment contains a multi-qubit gate 
		then the number of elements in that moment will be LESS
		than the number of qubits being operated on.
		Yet when we draw a diagram of our circuit we do
		need to draw a token for each moment of a qubit’s path.
		Here’s how we do that translation.
		`

		const 
		table = new Array( this.bandwidth )
		scope = this


		//  Sure, this is equal to table.length
		//  but isn’t legibility and convenience everything?

		table.timewidth = this.timewidth
		

		//  Similarly, this should be equal to table[ 0 ].length
		//  or really table[ i >= 0; i < table.length ].length,
		//  but again, least cognitive barrier is key.

		table.bandwidth = this.bandwidth
		

		//  Walk through this circuit moment-by-moment. 

		this.moments.forEach( function( moment, m ){

			table[ m ] = new Array( scope.timewidth )			
			const multiQubitGates = moment.reduce( function( accumulation, operation ){

				if( operation.qubitIndices.length > 1 ) accumulation.push( operation )
				return accumulation

			}, [] )
			table[ m ].multiQubitGatesTotal = multiQubitGates.length
			scope.inputs.forEach( function( qubit, q ){

				const operation = moment.find( function( operation ){

					return operation.qubitIndices.includes( q )
				})
				if( operation !== undefined ){
				
					const
					inputIndex = operation.qubitIndices.findIndex( function( index ){

						return index === q
					}),
					label = operation.gate.label,
					operationsWithSameGatesThisMoment = moment.reduce( function( siblings, operation ){

						if( operation.gate.bandwidth > 1 && operation.gate.label === label ) siblings.push( operation )
						return siblings

					}, []),
					thisGateId = operationsWithSameGatesThisMoment.findIndex( function( operation ){

						return operation.qubitIndices.includes( q )
					}),
					thisGateAmongMultiQubitGatesIndex = multiQubitGates.findIndex( function( op ){

						return op === operation
					})


					//  Compile a String output for this qubit at this moment.

					let 
					output = label,
					aSiblingIsAbove = false,
					aSiblingIsBelow = false

					if( operation.qubitIndices.length > 1 ){ 
					
						if( operationsWithSameGatesThisMoment.length > 1 ) output += thisGateId
						output += inputIndex

						//  need to know—are the sibling qubits for  this qubit; their q# lower or higher than q

						aSiblingIsAbove = operation.qubitIndices.some( function( siblingQubitIndex ){

							return siblingQubitIndex < q
						})
						aSiblingIsBelow = operation.qubitIndices.some( function( siblingQubitIndex ){

							return siblingQubitIndex > q
						})
					}
					table[ m ][ q ] = {

						label: output,
						gateInputIndex: inputIndex,              //  This is #n
						bandwidth: operation.qubitIndices.length,//  of this many inputs.
						thisGateAmongMultiQubitGatesIndex,
						aSiblingIsAbove,
						aSiblingIsBelow
					}
				}
				else {

					table[ m ][ q ] = {

						label: '?',
						gateInputIndex: q,
						bandwidth: 0,
						thisGateAmongMultiQubitGatesIndex: 0,
						aSiblingIsAbove: false,
						aSiblingIsBelow: false
					}
				}
			})
		})


		//  Now we can easily read down each moment
		//  and establish the moment’s character width.
		//  Very useful for text-based diagrams ;)

		table.forEach( function( moment ){

			const maximumWidth = moment.reduce( function( maximumWidth, operation ){

				return Math.max( maximumWidth, operation.label.length )
			
			}, 1 )
			moment.maximumCharacterWidth = maximumWidth
		})


		//  We can also do this for the table as a whole.
		

		table.maximumMomentCharacterWidth = table.reduce( function( maximumWidth, moment ){

			return Math.max( maximumWidth, moment.maximumCharacterWidth )
		
		}, 1 )
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

				let cellString = table[ x ][ y ].label.padEnd( table[ x ].maximumCharacterWidth, '-' )
				if( makeAllMomentsEqualWidth && x < table.timewidth - 1 ){

					cellString = table[ x ][ y ].label.padEnd( table.maximumMomentCharacterWidth, '-' )
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
		table  = this.toTable(),
		output = new Array( table.bandwidth * 3 + 1 ).fill( '' )

		output[ 0 ] = '    t0  '
		scope.inputs.forEach( function( qubit, q ){

			const y3 = q * 3
			output[ y3 + 1 ] += '        '
			output[ y3 + 2 ] += 'q'+ q +'  |'+ qubit.ket.toText() +'⟩─'
			output[ y3 + 3 ] += '        '
		})
		for( let x = 0; x < table.timewidth; x ++ ){

			const padToLength = makeAllMomentsEqualWidth
				? table.maximumMomentCharacterWidth
				: table[ x ].maximumCharacterWidth

			output[ 0 ] += Q.centerText( 't'+ ( x + 1 ), padToLength + 4 )
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

					if( x < table.timewidth - 1 ){

						first  += '  '
						second += '──'
						third  += '  '
					}
				}
				else {

					first  += '┌─'
					second += '┤ '
					third  += '└─'
					
					first  += '─'.padEnd( padToLength, '─' )
					second += Q.centerText( operation.label, padToLength )
					third  += '─'.padEnd( padToLength, '─' )
				
					first  += '─┐'
					second += x < table.timewidth - 1 ? ' ├' : ' │'
					third  += '─┘'

					if( operation.bandwidth > 1 ){

						let n = operation.thisGateAmongMultiQubitGatesIndex % ( table[ x ].maximumCharacterWidth + 1 ) + 1
						if( operation.aSiblingIsAbove ){						

							first = first.substring( 0, n ) +'┴'+ first.substring( n + 1 )
						}
						if( operation.aSiblingIsBelow ){

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
	toDom: function(){

		`
		Create a functioning document object model fragment
		that can uses CSS and responds to user interaction events
		to manifest a graphic user interface for this circuit.

		OBVIOUSLY THIS IS NOT COMPLETE !
		`

		const circuitElement = document.createElement( 'div' )
		circuitElement.classList.add( 'circuit' )

		//  Magic needs to happen HERE.

		return circuitElement
	},




	    //////////////
	   //          //
	  //   Edit   //
	 //          //
	//////////////


	removeHangingOperations$: function(){

		`
		Step through each moment of this circuit
		and remove any “hanging” gate operations
		that contain qubit indices outside the expected range.
		This is useful after a copy() command
		that may contain stray qubit indices from multi-qubit gates
		or after a trim$() command with a similar result.
		`

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
	fillEmptyOperations$: function(){

		`
		Step through each moment of this circuit,
		find any qubits that have no assigned operations
		and add an IDENTITY operation 
		for that qubit at that moment.
		`

		const scope = this
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
	



	clearThisInput$: function( moment, qubitIndices ){

		let gatesToRemove = 0
		while( gatesToRemove >= 0 ){
		
			gatesToRemove = moment.findIndex( function( gate, o ){

				const shouldRemoveThisGate = gate.qubitIndices.some( function( qubitIndex ){

					return qubitIndices.includes( qubitIndex )
				})
				return shouldRemoveThisGate
			})
			

			//  NOTE: Should we call remove$() here instead?
			//  and within there add that to an UNDO stack!

			if( gatesToRemove >= 0 ) moment.splice( gatesToRemove, 1 )
		}
	},
	add$: function( momentIndex, gate, qubitIndices, gateId, allowOverrun ){

		const scope = this


		//  We’re pretending that this Array is ONE-indexed, 
		//  rather than ZERO-indexed.
		//  This is because “moment 0” is the raw input state.

		momentIndex --


		//  Is this a valid moment index?
		
		if( momentIndex < 0 || momentIndex > this.moments.length - 1 ) return Q.error( `Q.Circuit attempted to add a gate to circuit #${this.index} at a moment index that is not valid:`, momentIndex )
		const moment = this.moments[ momentIndex ]


		//  Is this a valid gate?

		if( gate instanceof Q.Gate !== true ) return Q.error( `Q.Circuit attempted to add a gate to circuit #${this.index} at moment #${momentIndex} that is not a gate:`, gate )


		//  Are these valid input indices?

		if( allowOverrun !== true ){
		
			if( qubitIndices instanceof Array !== true ) return Q.error( `Q.Circuit attempted to add a gate to circuit #${this.index} at moment #${momentIndex} with an invalid qubit indices array:`, qubitIndices )
			if( qubitIndices.length === 0 ) return Q.error( `Q.Circuit attempted to add a gate to circuit #${this.index} at moment #${momentIndex} with an empty input qubit array:`, qubitIndices )
			
			
			//  We’ve had to comment this check out because 
			//  we can’t know in a single pass 
			//  if we have all the indices needed
			//  for a multi-qubit gate:

			//if( qubitIndices.length !== gate.bandwidth ) return Q.error( `Q.Circuit attempted to add a gate to circuit #${this.index} at moment #${momentIndex} but the number of qubit indices (${qubitIndices}) did not match the gate’s bandwidth (${gate.bandwidth}).` )
			

			if( qubitIndices.reduce( function( accumulator, qubitIndex ){

				return accumulator && qubitIndex >= 0 && qubitIndex < scope.bandwidth

			}, false )){

				return Q.error( `Q.Circuit attempted to add a gate to circuit #${this.index} at moment #${momentIndex} with some out of range qubit indices:`, qubitIndices )
			}
		}
		this.clearThisInput$( moment, qubitIndices )
		moment.push({ 

			gate,
			gateId,
			qubitIndices
		})
	},
	remove$: function(){

		//  TO DO: Replace removed gate with Q.Gate.IDENTITY(s).
		//  Also consider creating an UNDO stack.
		return this
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

			qubitFirstIndex,
			qubitRange,
			qubitLastIndex,
			momentFirstIndex,
			momentRange,
			momentLastIndex

		} = this.determineRanges( options )

		const copy = new Q.Circuit( qubitRange, momentRange )
		for( let m = momentFirstIndex; m < momentLastIndex; m ++ ){

			original.moments[ m ]
			.filter( function( operation ){

				return ( operation.qubitIndices.every( function( qubitIndex ){

					return qubitIndex >= qubitFirstIndex && qubitIndex < qubitLastIndex
				}))
			})			
			.forEach( function( operation ){

				const adjustedQubitIndices = operation.qubitIndices.map( function( qubitIndex ){

					return qubitIndex - qubitFirstIndex
				})
				copy.add$(

					1 + m - momentFirstIndex, 
					operation.gate, 
					adjustedQubitIndices, 
					operation.gateId,
					true//  Allow overrun; ghost indices.
				)
			})
		}


		//  The cut$() operation just calls copy()
		//  with the following boolean set to true.
		//  If this is a cut we need to 
		//  replace all gates in this area with identity gates.
		
		if( isACutOperation === true ){

			for( let m = momentFirstIndex; m < momentLastIndex; m ++ ){

				original.moments[ m ] = new Array( original.bandwidth )
				.fill( 0 )
				.map( function( qubit, q ){

					return { 

						gate: Q.Gate.IDENTITY,
						qubitIndices: [ q ]
					}
				})
			}
		}
		return copy
	},
	cut$: function( options ){

		return this.copy( options, true )
	},
	




	//  This is where “hanging operations” get interesting!
	//  when you paste one circuit in to another
	//  and that clipboard circuit has hanging operations
	//  those can find a home in the circuit its being pasted in to!


	pasteOver$: function( circuit, atMoment, atQubit, shouldClean = true ){

		/*

			
			begnning t from atMoment to atMoment + circuit.timewidth

				if t > this.timewidth

					increase this.timewidth

				q from atQubit to atQubit + circuit.bandwidth

					if q > this.bandwidth

						increase this.bandwidth
		*/

		//

		if( shouldClean ) this.removeHangingOperations$()
		this.fillEmptyOperations$()
		
		return this
	},
	pasteInsert$: function(){


		if( shouldClean ) this.removeHangingOperations$()
		this.fillEmptyOperations$()
		
		return this

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
	},
	






	    /////////////////
	   //             //
	  //   Execute   //
	 //             //
	/////////////////


	run$: function( n ){

		`
		Ok, right now this is a really simple, contained “run” solution.
		But we probably want threading and a Q{} render queue, yeah?
		Also likely need a “run$” solution that mutates circuit state
		to keep track of averages always -- unless circuit is modified.
		(Even then, do we track averages / state across UNDO branches??)

		`
		

		//  Quantum circuits deal in probabilities.
		//  Running a circuit once doesn’t mean all that much.
		//  We ought to run it many, many times.

		const states = []
		if( n === undefined ) n = 1
		for( let i = 0; i < n; i ++ ){

			const state = this.inputs.slice()


			//  Step through this quantum circuit one step at a time,
			//  applying each moment’s operation to our state.

			this.moments.forEach( function( moment ){

				moment.forEach( function( operation ){

					operation.gate.applyTo(

						...operation.qubitIndices.reduce( function( accumulation, qubitIndex ){

							accumulation.push( state[ qubitIndex ])
							return accumulation

						}, [] )
					
					).forEach( function( outputQubit, qubitIndex ){

						state[ operation.qubitIndices[ qubitIndex ]] = outputQubit
					})
				})
			})


			//  We have our result for this run. 
			//  Push it to the stack.

			states.push( state.map( function( qubit ){
				
				return qubit.ket.real
			}))
		}
		

		//  This averages operation may need to be in the loop itself,
		//  possibly on a clutch so it only executes every X number of loops.
		//  This way we can set n = Infinity so it runs 
		//  until we tell it to stop :)

		const results = states
			.reduce( function( accumulation, state, s ){

				state.forEach( function( qubit, q ){

					accumulation[ q ] += qubit
				})
				return accumulation

			}, new Array( this.bandwidth ).fill( 0 ))
			.map( function( qubit ){

				return qubit / n
			})


		//console.log( 'Ran circuit', n, 'times with average result of:', results )
		
		//  ***** Def come back and clean this idea up!! threading??
		this.results = results

		return this
	}
})



