
//  Copyright © 2019, Stewart Smith. See LICENSE for details.






//  Circuit Palette

//  ╭───────────────────┬───╮
//  │ H X Y Z S T π M … │ @ │
//  ╰───────────────────┴───╯


Q.Circuit.createDomPalette = function( targetEl ){


	//  Proving a target element to attach to is optional.
	//  If it is provided then we need to know 
	//  if it’s already designated as a palette. 
	//  If yes, we attach child elements directly to it.
	//  Otherwise we create our own container element first,
	//  then attach child elements to that.

	let containerEl
	if( targetEl instanceof HTMLElement && 
		targetEl.classList.contains( 'qjs-circuit-palette' )){

		containerEl = targetEl
	}
	else {

		containerEl = document.createElement( 'div' )
		containerEl.classList.add( 'qjs-circuit-palette' )
	}


	//  Create a layer (grid container) 
	//  to atatch our operations to.

	const layerOperationsEl = document.createElement( 'div' )
	layerOperationsEl.classList.add( 'qjs-circuit-layer' )
	containerEl.appendChild( layerOperationsEl )


	//  Now we can create and attach individual operations
	//  to our palette.

	'IHXYZS'.split( '' ).forEach( function( label, i ){


		//  Find the actual gate.

		const gate = Q.Gate.findByLabel( label )


		//  Create the grid cell.
		//  We’ll wait to attach it to the layer.
		// (Is that just unecessary precaution here?)

		const cellEl = document.createElement( 'div' )
		cellEl.classList.add( 'qjs-circuit-operation' )
		cellEl.setAttribute( 'title', gate.name )
		cellEl.operation = { gate }//  Note: Obviously no momentIndex or registerIndices!


		//  Create an SVG container to hold our reference.

		const svgEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' )
		cellEl.appendChild( svgEl )


		//  Find the proper SVG element to reference
		//  and attach it to the SVG tag we just created.

		const useEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'use' )
		useEl.setAttributeNS(

			'http://www.w3.org/1999/xlink',
			'xlink:href',
			'#qjs-circuit-operation-'+ gate.css
		)
		svgEl.appendChild( useEl )

		layerOperationsEl.appendChild( cellEl )
	})


	//  Add interaction listeners
	//  so we can grab and drag these operations
	//  on to circuits.

	Array.from( containerEl.querySelectorAll( '.qjs-circuit-operation' ))

		.forEach( function( el ){
		
			el.addEventListener( 'mousedown',  Q.Circuit.GUI.onGrab )
			el.addEventListener( 'touchstart', Q.Circuit.GUI.onGrab )
		}
	)
	

	//  Finally, if we received a target element
	//  and that element did NOT use a palette CSS class
	//  then we ought to attach all this to the target.
	
	if( targetEl !== containerEl &&
		targetEl instanceof HTMLElement ){

		targetEl.appendChild( containerEl )
	}

	
	//  Be a good citizen and ALWAYS return our work.
	
	return containerEl
}






//  Interactive circuit	

//     Menu     Moments
//    ╭───────┬───┬───┬───┬───╮
//    │ ≡     │ 1 │ 2 │ 3 │ + │ Add moment
//    ├───┬───┼───┼───┼───┼───╯
//  R │ 0 │|0⟩│ H │ C0│ X │ -
//  e ├───┼───┼───┼───┼───┤
//  g │ 1 │|0⟩│ I │ C1│ X │ -
//  s ├───┼───┴───┴───┴───┘
//    │ + │ -   -   -   -
//    ╰───╯
//      Add
//      register


Q.Circuit.prototype.toDom = function( targetEl ){

	const circuit = this

	const circuitEl = document.createElement( 'div' )
	circuitEl.classList.add( 'qjs-circuit' )
	circuitEl.circuit = circuit


	//  Circuit layers.

	const layerWiresEl = document.createElement( 'div' )
	circuitEl.appendChild( layerWiresEl )
	layerWiresEl.classList.add( 'qjs-circuit-layer' )
	layerWiresEl.classList.add( 'qjs-circuit-layer-wires' )
	
	const layerConnnectionsEl = document.createElement( 'div' )
	circuitEl.appendChild( layerConnnectionsEl )
	layerConnnectionsEl.classList.add( 'qjs-circuit-layer' )
	layerConnnectionsEl.classList.add( 'qjs-circuit-layer-connections' )	
	
	const layerGrabbablesEl = document.createElement( 'div' )
	circuitEl.appendChild( layerGrabbablesEl )
	layerGrabbablesEl.classList.add( 'qjs-circuit-layer' )
	layerGrabbablesEl.classList.add( 'qjs-circuit-layer-grabbables' )
	

	//  Labels for registers and input qubit values.

	for( let i = 1; i <= circuit.bandwidth; i ++ ){

		const registerEl = document.createElement( 'div' )
		registerEl.setAttribute( 'title', 'Register '+ i +' of '+ circuit.bandwidth )
		registerEl.classList.add( 'qjs-circuit-cell', 'qjs-circuit-register' )
		registerEl.style.gridRow = i + 1
		registerEl.innerText     = i
		layerGrabbablesEl.appendChild( registerEl )

		const inputEl = document.createElement( 'div' )
		inputEl.classList.add( 'qjs-circuit-cell', 'qjs-circuit-input' )
		inputEl.style.gridRow = i + 1
		inputEl.innerText     = circuit.qubits[ i - 1 ].beta.toText()
		layerGrabbablesEl.appendChild( inputEl )
	}


	//  Labels for moments.

	for( let m = 1; m <= circuit.timewidth; m ++ ){

		const momentEl = document.createElement( 'div' )
		momentEl.setAttribute( 'title', 'Moment '+ m +' of '+ circuit.timewidth )
		momentEl.classList.add( 'qjs-circuit-cell', 'qjs-circuit-moment' )
		momentEl.style.gridColumn = m + 2
		momentEl.innerText = m
		layerGrabbablesEl.appendChild( momentEl )
	
		for( let r = 1; r <= circuit.bandwidth; r ++ ){


			//  Register wires.

			const wireEl = document.createElement( 'div' )
			wireEl.classList.add( 'qjs-circuit-cell' )

			const wireSvgEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' )
			wireSvgEl.classList.add( 'qjs-circuit-wire' )
			wireSvgEl.style.gridColumn = m + 2
			wireSvgEl.style.gridRow    = r + 1
			wireEl.appendChild( wireSvgEl )
			
			const wireUseEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'use' )
			wireUseEl.setAttributeNS( 'http://www.w3.org/1999/xlink', 'xlink:href', '#qjs-circuit-wire' )
			wireSvgEl.appendChild( wireUseEl )
			layerWiresEl.appendChild( wireSvgEl )


			//  Identity gates.
			//  We’ll place one on EVERY cell,
			//  even if it will be overlayed by another operation.

			const identityEl = document.createElement( 'div' )
			identityEl.classList.add( 'qjs-circuit-operation' )
			identityEl.classList.add( 'qjs-circuit-operation-identity' )
			identityEl.setAttribute( 'title', 'Identity' )
			identityEl.style.gridColumn = m + 2
			identityEl.style.gridRow    = r + 1
			identityEl.setAttribute( 'momentIndex',   m )
			identityEl.setAttribute( 'registerIndex', r )
			identityEl.operation = { gate: Q.Gate.IDENTITY }

			const identitySvgEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' )
			identityEl.appendChild( identitySvgEl )

			const identityUseEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'use' )
			identityUseEl.setAttributeNS( 'http://www.w3.org/1999/xlink', 'xlink:href', '#qjs-circuit-operation-identity' )
			identityUseEl.classList.add( 'qjs-circuit-operation-identity' )
			identitySvgEl.appendChild( identityUseEl )			
			layerGrabbablesEl.appendChild( identityEl)
		}
	}


	//  Circuit menu.

	const menuEl = document.createElement( 'div' )
	menuEl.classList.add( 'qjs-circuit-menu' )
	layerGrabbablesEl.appendChild( menuEl )


	//  Operations.

	circuit.operations.forEach( function( operation ){

		operation.registerIndices.forEach( function( registerIndex, i ){

			const cellEl = document.createElement( 'div' )
			layerGrabbablesEl.appendChild( cellEl )
			cellEl.classList.add( 'qjs-circuit-operation' )
			cellEl.classList.add( 'qjs-circuit-operation-'+ operation.gate.css )
			cellEl.setAttribute( 'title', operation.gate.name )
			cellEl.setAttribute( 'momentIndex',   operation.momentIndex )
			cellEl.setAttribute( 'registerIndex', registerIndex )
			cellEl.style.gridColumn = operation.momentIndex + 2
			cellEl.style.gridRow    = registerIndex + 1
			cellEl.operation        = operation

			const svgEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' )
			cellEl.appendChild( svgEl )
			const useEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'use' )
			svgEl.appendChild( useEl )
			
			let css = operation.gate.css
			if( operation.registerIndices.length > 1 ){

				if( i === operation.registerIndices.length - 1 ){

					css = 'controlled'
				}
				else css = 'controller'
			}
			useEl.setAttributeNS(

				'http://www.w3.org/1999/xlink',
				'xlink:href',
				'#qjs-circuit-operation-'+ css
			)
		})


		//  Control wires.

		if( operation.registerIndices.length > 1 ){

			operation.registerIndices.forEach( function( registerIndex, i ){

				if( i < operation.registerIndices.length - 1 ){			

					const 
					siblingRegisterIndex = operation.registerIndices[ i + 1 ],
					registerDelta = Math.abs( siblingRegisterIndex - registerIndex )
					
					let connectorType = 'curved'
					if( registerDelta === 1 ) connectorType = 'straight'

					const
					start = Math.min( registerIndex, siblingRegisterIndex ),
					end   = Math.max( registerIndex, siblingRegisterIndex )

					const connectionEl = document.createElement( 'div' )
					connectionEl.style.gridRowStart = start + 1
					connectionEl.style.gridRowEnd   = end + 1
					connectionEl.style.gridColumn   = operation.momentIndex + 2

					const connectionSvgEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' )
					connectionEl.appendChild( connectionSvgEl )

					const connectionUseEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'use' )					
					connectionUseEl.setAttributeNS( 

						'http://www.w3.org/1999/xlink', 
						'xlink:href', 
						'#qjs-circuit-control-'+ connectorType
					)
					connectionSvgEl.appendChild( connectionUseEl )
					
					layerConnnectionsEl.appendChild( connectionEl )
				}
			})
		}
	})


	//  SELECT.
	//  Tapping adds to selection basket.

	circuitEl.setAttribute( 'qjs-circuit-mode', 'qjs-circuit-operation-select' )
	

	//  CONTROL.
	//  Drag one circuit to other ... controls??

	circuitEl.setAttribute( 'qjs-circuit-mode', 'qjs-circuit-operation-control' )


	//  MOVE.
	//  Tapping grabs the object to move and drop it elsewhere.

	circuitEl.setAttribute( 'qjs-circuit-mode', 'qjs-circuit-operation-move' )




	//  Add event listeners for selecting and grabbing.

	circuitEl.addEventListener( 'mousedown',  Q.Circuit.GUI.onGrab )
	circuitEl.addEventListener( 'touchstart', Q.Circuit.GUI.onGrab )
	

	//  Add event listeners for highlighting.

	Array.from( circuitEl.querySelectorAll( '.qjs-circuit-layer > *' )).forEach( function( el ){

		el.addEventListener( 'mouseover', Q.Circuit.GUI.highlight )		
	})
	circuitEl.addEventListener( 'mouseout', Q.Circuit.GUI.unhighlight )





	window.addEventListener( 'qjs clearThisInput$', function( event ){

		if( circuit === event.detail.circuit ){
			
			const {

				momentIndex,
				registerIndices
			
			} = event.detail


			Array.from( circuitEl.querySelectorAll( 

				'.qjs-circuit-layer-grabbables [momentIndex="'+ momentIndex +'"][registerIndex]' 
			
			)).filter( function( op ){

				return (

					registerIndices.includes( +op.getAttribute( 'registerIndex' )) &&
					!op.classList.contains( 'qjs-circuit-operation-identity' )
				)
			}).forEach( function( el ){

				el.parentNode.removeChild( el )
			})
			

			//  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			//  NOW... WTF do we do about wires between registers
			//  that we might need to remove?!?!?!?!?!?!?
		}
	})
	window.addEventListener( 'qjs set$ completed', function( event ){

		if( circuit === event.detail.circuit ){
		
			const {

				gate,
				momentIndex,
				registerIndices
			
			} = event.detail


			console.log( 'operation has been added. \nDOM should match this:\n'+ event.detail.circuit.toDiagram() )


			registerIndices.forEach( function( registerIndex, i ){

				const cellEl = document.createElement( 'div' )
				layerGrabbablesEl.appendChild( cellEl )
				cellEl.classList.add( 'qjs-circuit-operation' )
				cellEl.setAttribute( 'title', gate.name )
				cellEl.setAttribute( 'momentIndex',   momentIndex )
				cellEl.setAttribute( 'registerIndex', registerIndex )
				cellEl.style.gridColumn = momentIndex   + 2
				cellEl.style.gridRow    = registerIndex + 1
				cellEl.operation = { gate }

				const svgEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' )
				cellEl.appendChild( svgEl )
				const useEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'use' )
				svgEl.appendChild( useEl )
				let css = gate.css
				if( registerIndices.length > 1 ){

					if( i === registerIndices.length - 1 ){

						css = 'controlled'
					}
					else css = 'controller'
				}
				useEl.setAttributeNS(

					'http://www.w3.org/1999/xlink',
					'xlink:href',
					'#qjs-circuit-operation-'+ css
				)
			})


			//  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			//  NOW... WTF do we do about wires between registers
		}
	})


	//  All done.

	if( targetEl !== undefined &&
		typeof targetEl.appendChild === 'function' ){

		targetEl.appendChild(  circuitEl )
		return this
	}
	else return circuitEl
}






Q.Circuit.GUI = {

	clipboardElement: null,

	


	//  Attached to a .qjs-circuit element.
	
	onGrab: function( event ){

		event.preventDefault()
		event.stopPropagation()

		
		//  Our first order of business is 
		//  to find the operation we grabbed to trigger this.		

		let operationEl = event.target
		while( operationEl.parentNode && 
			operationEl.operation === undefined ){

			operationEl = operationEl.parentNode
		}

		const 
		momentIndex   = +operationEl.getAttribute( 'momentIndex' )
		registerIndex = +operationEl.getAttribute( 'registerIndex' )
		

		//  Now we need to find the containing circuit DOM element
		//  and likewise find the circuit object reference.

		let circuitEl = operationEl
		while( circuitEl.parentNode && 
			!circuitEl.classList.contains( 'qjs-circuit' ) &&
			!circuitEl.classList.contains( 'qjs-circuit-palette' )){

			circuitEl = circuitEl.parentNode
		}
		const circuit = circuitEl.circuit
		

		//  We need a reference to the actual Q.Circuit instance,
		//  and to know its interaction mode.

		let circuitMode = null
		if( circuit ){

			circuitMode = circuitEl.getAttribute( 'qjs-circuit-mode' )
		}


		operationEl.wasSelected = operationEl.classList.contains( 'qjs-selected' )
		operationEl.classList.add( 'qjs-selected' )
		const selectedElements = Array.from( circuitEl.querySelectorAll( '.qjs-selected' ))
		

		if( selectedElements.length ){


			//  Create the clipboard container elements.

			const clipboardElement = document.createElement( 'div' )
			clipboardElement.circuit = circuit
			clipboardElement.classList.add( 'qjs-circuit-clipboard' )

			const operationsEl = document.createElement( 'div' )
			operationsEl.classList.add( 'qjs-circuit-layer' )
			operationsEl.classList.add( 'qjs-circuit-layer-grabbables' )
			clipboardElement.appendChild( operationsEl )
			
			
			//  Before we can attach the selected operation to the clipboard
			//  we need to know what the lowest momentIndex is
			//  and what the lowest registerIndex is.

			const 
			momentIndexMin = selectedElements.reduce( function( min, el ){

				return Math.min( min, +el.getAttribute( 'momentIndex' ))

			}, Infinity ),
			registerIndexMin = selectedElements.reduce( function( min, el ){

				return Math.min( min, +el.getAttribute( 'registerIndex' ))

			}, Infinity )


			//  Where are we supposed to make this clipboard appear? 

			const bounds = ( circuit ?

				circuitEl.querySelector( 

					'[momentIndex="'+ momentIndexMin +'"]'+
					'[registerIndex="'+ registerIndexMin +'"]'
				)
				: operationEl
			
			).getBoundingClientRect()
			clipboardElement.offsetX = window.pageXOffset + bounds.left - event.pageX
			clipboardElement.offsetY = window.pageYOffset + bounds.top  - event.pageY - 7
			document.body.appendChild( clipboardElement )


			//  We’ll need these values for checking for “self-drops”
			//  when we do onDrop later.

			clipboardElement.setAttribute( 'momentIndex', momentIndex )
			clipboardElement.setAttribute( 'registerIndex', registerIndex )
			clipboardElement.setAttribute( 'momentIndexMin', momentIndexMin )
			clipboardElement.setAttribute( 'registerIndexMin', registerIndexMin )
			clipboardElement.circuit   = circuit
			clipboardElement.circuitEl = circuitEl


			//  Attach each selected operation to the clipboard element.
			
			selectedElements.forEach( function( selectedElement ){


				//  We cannot remove the selected element from its current DOM node
				//  otherwise iOS freaks out because it was the event target
				//  so instead we must clone.

				const cloneEl      = selectedElement.cloneNode( true )
				cloneEl.operation  = selectedElement.operation
				cloneEl.originalEl = selectedElement
				cloneEl.style.gridColumn = 1 + ( +selectedElement.getAttribute( 'momentIndex' ) - momentIndexMin )
				cloneEl.style.gridRow    = 1 + ( +selectedElement.getAttribute( 'registerIndex' ) - registerIndexMin )
				operationsEl.appendChild( cloneEl )
				

				//  Should we hide the original element?
				//  If it’s not an Identity operation, then yes.

				if( circuitMode !== null && 
					operationEl.operation.gate.label !== 'I' ){

					selectedElement.style.display = 'none'
				}
			})


			//  Ok. Let’s make the clipboard official and trigger a redraw!

			Q.Circuit.GUI.clipboardElement = clipboardElement
			Q.Circuit.GUI.onMove( event )
		}
	},




	//  Attached with document.addEventListener
	//  and NOT attached to a circuit element.
	
	onMove: function( event ){

		if( Q.Circuit.GUI.clipboardElement !== null ){

			event.preventDefault()
			event.stopPropagation()

			const 
			clipboardElement = Q.Circuit.GUI.clipboardElement,
			offsetX = clipboardElement.offsetX,
			offsetY = clipboardElement.offsetY,
			displayState = clipboardElement.style.display


			//  Move the clipboard to match the location
			//  of our mouse cursor or finger.
			
			clipboardElement.style.top  = ( event.pageY + offsetY ) +'px'
			clipboardElement.style.left = ( event.pageX + offsetX ) +'px'
		}
	},




	//  Attached with document.addEventListener
	//  and NOT attached to a circuit element.

	onDrop: function( event ){

		if( Q.Circuit.GUI.clipboardElement !== null ){

			document.body.removeChild( Q.Circuit.GUI.clipboardElement )


			//  Receiving element, ie. What are we dropping on to?
			
			let 
			receivingEls = document.elementsFromPoint( event.clientX, event.clientY ),
			receivingEl  = Array.from( receivingEls ).find( function( el ){

				return el.classList.contains( 'qjs-circuit-operation' )
			})


			//  If our receiving element is a Qjs Circuit operation,
			//  then we’re in business!

			if( receivingEl &&
				receivingEl.classList && 
				receivingEl.classList.contains( 'qjs-circuit-operation' )){
				

				//  What cell have we dropped on to?
				
				const
				receivingMomentIndex   = +receivingEl.getAttribute( 'momentIndex' ),
				receivingRegisterIndex = +receivingEl.getAttribute( 'registerIndex' ),
				receivingOperation     =  receivingEl.operation


				//  Find the receiving circuit element
				//  and a reference to the receiving circuit object itself.

				let receivingCircuitEl = receivingEl
				while( receivingCircuitEl.parentNode && 
					!receivingCircuitEl.circuit ){

					receivingCircuitEl = receivingCircuitEl.parentNode
				}
				const receivingCircuit = receivingCircuitEl.circuit


				const
				grabbedCircuitTasks   = [],
				receivingCircuitTasks = []

				const 
				clipboardEl = Q.Circuit.GUI.clipboardElement,
				clipboardMomentIndex   = +clipboardEl.getAttribute( 'momentIndex' ),
				clipboardRegisterIndex = +clipboardEl.getAttribute( 'registerIndex' )

				const
				grabbedCircuit   = clipboardEl.circuit,
				grabbedCircuitEl = clipboardEl.circuitEl


				//  For each operation contained within the clipboard:

				Array.from( Q.Circuit.GUI.clipboardElement.querySelectorAll( '.qjs-circuit-operation' )).forEach( function( grabbedEl, i ){


					//  What element did we drag and drop on to here?
					//  Note that these momentIndex and registerIndex attributes
					//  may be undefined. That’s ok! 
					//  That just means there’s no “cut” operation to perform after.
					//  Also note that storing the momentIndex as a tag attribute
					//  is redudant because it is indeed contained within operation.
					//  However -- operation does NOT contain the cell’s registerIndex!
					//  It instead contains a registerIndices Array, remember? ;)
					//  And that may contain multiple elements; some unrelated to this cell!
					//  So we must store the registerIndex in this way.
					
					const
					grabbedMomentIndex   = +grabbedEl.getAttribute( 'momentIndex' ),
					grabbedRegisterIndex = +grabbedEl.getAttribute( 'registerIndex' ),
					grabbedOperation     =  grabbedEl.operation


					//  Did we drop an operation right on to itself??
					//  If so, we should NOT update the circuit!
					
					if( grabbedCircuit &&
						grabbedCircuitEl === receivingCircuitEl &&
						clipboardMomentIndex   === receivingMomentIndex &&
						clipboardRegisterIndex === receivingRegisterIndex ){

						grabbedEl.originalEl.style.display = 'block'


						//  Tapping an operation and NOT moving it
						//  is a way to toggle selection state.
						
						if( grabbedEl.originalEl.wasSelected ){

							grabbedEl.originalEl.classList.remove( 'qjs-selected' )
						}
						else {

							grabbedEl.originalEl.classList.add( 'qjs-selected' )
						}
					}
					

					//  This is NOT a self-drop.
					//  But is it a drop on to or from a circuit PALETTE?
					//  Is it a drop between different circuits?
					//  Still some unknowns going on up to this point.

					else {

						grabbedEl.originalEl.classList.remove( 'qjs-selected' )


						//  Are we actually dropping on to a valid circuit?
						//  If so, then we’re going to need to do some circuit updating.

						if( receivingCircuit ){


							//  If this came from a valid circuit
							//  and not a circuit PALETTE
							//  then we need to update that circuit.

							if( grabbedCircuit ){

								grabbedCircuitTasks.push({

									momentIndex:   grabbedMomentIndex,
									registerIndex: grabbedRegisterIndex
								})
							}


							//  Time to update this receiving circuit.

							receivingCircuitTasks.push({

								momentIndex: receivingMomentIndex + grabbedMomentIndex - clipboardMomentIndex,
								gate: grabbedOperation.gate,
								registerIndices: [ receivingRegisterIndex + grabbedRegisterIndex - clipboardRegisterIndex ]
							})
						}
					}
				})
				if( grabbedCircuit ){
				
					grabbedCircuitTasks.forEach( function( task ){

						grabbedCircuit.clearThisInput$( task.momentIndex, task.registerIndex )
					})
				}
				receivingCircuitTasks.forEach( function( task ){

					receivingCircuit.set$( 

						task.momentIndex,
						task.gate,
						task.registerIndices
					)
				})
				if( receivingCircuitTasks ) receivingCircuit.evaluate$()
				if( grabbedCircuit && 
					grabbedCircuit !== receivingCircuit && 
					grabbedCircuitTasks ){

					grabbedCircuit.evaluate$()
				}
			}


			//  We dragged an operation, sure...
			//  But we dropped on to nothing useful!

			else {
				
				console.log( 'dropped on nothing' )
				Array.from( Q.Circuit.GUI.clipboardElement.querySelectorAll( '.qjs-circuit-operation' )).forEach( function( grabbedEl ){

					grabbedEl.originalEl.style.display = 'block'
				})
			}
		}
		

		//  Very important to kill this on any mouse-up event.

		Q.Circuit.GUI.clipboardElement = null
	},




	highlight: function( event ){

		let cellEl = event.target
		while( cellEl.parentNode && cellEl.tagName.toLowerCase() !== 'div' ){
			
			cellEl = cellEl.parentNode
		}

		let layerEl = event.target
		while( layerEl.parentNode && !layerEl.classList.contains( 'qjs-circuit-layer' )){

			layerEl = layerEl.parentNode
		}

		let circuitEl = layerEl.parentNode

		const 
		style  = getComputedStyle( cellEl ),
		selectedRow    = parseFloat( style.gridRowStart ),
		selectedColumn = parseFloat( style.gridColumnStart )

		Array.from( circuitEl.querySelectorAll( '.qjs-circuit-layer-grabbables *, .qjs-circuit-layer-wires *' )).forEach( function( el ){

			const 
			style = getComputedStyle( el ),
			thisRow    = parseFloat( style.gridRowStart ),
			thisColumn = parseFloat( style.gridColumnStart )

			if(
				( thisRow > 1 || thisColumn > 1 ) && (//  Don’t highlight the menu area.


					( selectedRow === 1 && thisColumn === selectedColumn ) ||//  If on a moment label, only highlight its column.
					( selectedColumn < 3 && thisRow === selectedRow      ) ||//  If on a register label, only highlight its row.
					( 
						selectedRow > 1 && 
						selectedColumn > 2 && 
						( thisRow === selectedRow || thisColumn === selectedColumn )
					)
				)
			){

				el.classList.add( 'qjs-circuit-highlight' )
			}
			else {

				el.classList.remove( 'qjs-circuit-highlight' )
			}
		})
	},
	unhighlight: function( event ){


		let circuitEl = event.target
		while( circuitEl.parentNode && !circuitEl.classList.contains( 'qjs-circuit' )){

			circuitEl = circuitEl.parentNode
		}
		Array.from( circuitEl.querySelectorAll( '.qjs-circuit-layer-grabbables *, .qjs-circuit-layer-wires *' )).forEach( function( el ){

			el.classList.remove( 'qjs-circuit-highlight' )
		})
	}
}








const addEvents = function( el = document.body ){

	document.addEventListener( 'mousemove', Q.Circuit.GUI.onMove )
	document.addEventListener( 'touchmove', Q.Circuit.GUI.onMove )
	document.addEventListener( 'mouseup',   Q.Circuit.GUI.onDrop )
	document.addEventListener( 'touchend',  Q.Circuit.GUI.onDrop )
}
window.addEventListener( 'DOMContentLoaded', function(){

	addEvents()
})







