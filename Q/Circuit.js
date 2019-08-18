



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
	add$: function( momentIndex, gate, qubitIndices, gateId ){

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

		if( qubitIndices instanceof Array !== true ) return Q.error( `Q.Circuit attempted to add a gate to circuit #${this.index} at moment #${momentIndex} with an invalid qubit indices array:`, qubitIndices )
		if( qubitIndices.length === 0 ) return Q.error( `Q.Circuit attempted to add a gate to circuit #${this.index} at moment #${momentIndex} with an empty input qubit array:`, qubitIndices )
		//if( qubitIndices.length !== gate.bandwidth ) return Q.error( `Q.Circuit attempted to add a gate to circuit #${this.index} at moment #${momentIndex} but the number of qubit indices (${qubitIndices}) did not match the gate’s bandwidth (${gate.bandwidth}).` )
		if( qubitIndices.reduce( function( accumulator, qubitIndex ){

			return accumulator && qubitIndex >= 0 && qubitIndex < scope.bandwidth

		}, false )){

			return Q.error( `Q.Circuit attempted to add a gate to circuit #${this.index} at moment #${momentIndex} with some out of range qubit indices:`, qubitIndices )
		}



		this.clearThisInput$( moment, qubitIndices )


		//  NEED TO EXTRACT THIS OUT SO CAN CALL IT INDEPENDENTLY!!
		//  WHY? CAUSE WHEN ADDING 2ND INPUT FOR AN EXISTING GATE
		//  NEED TO MAKE SURE THAT INPUT INDEX IS CLEARED FIRST!
		/*
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
		*/





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
	},




	//  Our circuit already exists as an Array of moments.
	//  But within each moment is an Array of gates, NOT qubits.
	//  If a moment contains a multi-qubit gate 
	//  then the number of elements in that moment will be LESS
	//  than the number of qubits being operated on.
	//  Yet when we draw a diagram of our circuit we do
	//  need to draw a token for each moment of a qubit’s path.
	//  Here’s how we do that translation.

	toTable: function(){

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
		

		//  

		this.moments.forEach( function( moment, m ){

			table[ m ] = new Array( scope.timewidth )
			scope.inputs.forEach( function( qubit, q ){

				const 
				operation = moment.find( function( operation ){

					return operation.qubitIndices.includes( q )
				}),
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
				})


				//  Compile a String output for this qubit at this moment.

				let output = label
				if( operationsWithSameGatesThisMoment.length > 1 ) output += thisGateId
				if( operation.qubitIndices.length > 1 ) output += inputIndex
				table[ m ][ q ] = output
			})
		})


		//  Now we can easily read down each moment
		//  and establish the moment’s character width.
		//  Very useful for text-based diagrams ;)

		table.forEach( function( moment ){

			const maximumWidth = moment.reduce( function( maximumWidth, operationString ){

				return Math.max( maximumWidth, operationString.length )
			
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

		const 
		table  = this.toTable(),
		output = new Array( table.bandwidth ).fill( '' )

		for( let x = 0; x < table.timewidth; x ++ ){

			for( let y = 0; y < table.bandwidth; y ++ ){

				let cellString = table[ x ][ y ]
				while( cellString.length < table[ x ].maximumCharacterWidth ){

					cellString += '-'
				}
				if( makeAllMomentsEqualWidth && x < table.timewidth - 1 ){

					while( cellString.length < table.maximumMomentCharacterWidth ){

						cellString += '-'
					}
				}
				if( x > 0 ) cellString = '-'+ cellString
				output[ y ] += cellString
			}
		}
		return '\n'+ output.join( '\n' )
	},







	toTextOOPS: function(){

		return this.toTable().reduce( function( rowString, moment, m ){

			rowString.push( moment.reduce( function( columnString, operationString ){

				if( m > 0 ) columnString += '-'
				return columnString + operationString

			}, '' ))
			return rowString

		}, [] ).join( '\n' )
	},





	toDiagram: function(){

		`
		Right now this function can’t distinguish between inputs for multi-qubit gates
		or multiple multi-qubit gates per moment!
		Gimme a hot minute here ;)
		`

		const 
		scope = this,
		graph = new Array( this.bandwidth * 3 + 1 ).fill( '' )

		graph[ 0 ] = '\n    t0  '
		scope.inputs.forEach( function( qubit, q ){

			const y = q * 3
			graph[ y + 1 ] += '        '
			graph[ y + 2 ] += 'q'+ q +'  |'+ qubit.ket.toText() +'⟩─'
			graph[ y + 3 ] += '        '
		})

		this.moments.forEach( function( moment, m ){

			graph[ 0 ] += ' t'+ (m+1) +'  '
			scope.inputs.forEach( function( qubit, q ){

				const 
				operation = moment.find( function( operation ){

					return operation.qubitIndices.includes( q )
				
				}),
				label = operation.gate.label
			
				let 
				first  = '',
				second = '',
				third  = ''

				if( label === 'I' ){

					first  += '   '
					second += '──○'
					third  += '   '
					if( m < scope.moments.length - 1 ){

						first  += '  '
						second += '──'
						third  += '  '
					}
				}
				else {

					if( operation.qubitIndices.length === 1 ){
					
						first  += '┌───┐'
						second += '┤ '+ label +' '
						third  += '└───┘'
						if( m < scope.moments.length - 1 ) second +='├'
						else second += '│'
					}
					else {

						//x	
					}
				}

				const y = q * 3
				graph[ y + 1 ] += first
				graph[ y + 2 ] += second
				graph[ y + 3 ] += third
			})
		})
		return  graph.join( '\n' )
	},
	toDom: function(){

		const circuitElement = document.createElement( 'div' )
		circuitElement.classList.add( 'circuit' )
	}
})



