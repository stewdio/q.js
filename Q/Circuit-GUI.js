
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

	'IHXYZS'.split( '' ).forEach( function( label, i ){// T? C?


		//  Find the actual operation.

		const operation = Q.Gate.findByLabel( label )


		//  Create the grid cell.
		//  We’ll wait to attach it to the layer.
		// (Is that just unecessary precaution here?)

		const cellEl = document.createElement( 'div' )
		cellEl.classList.add( 'qjs-circuit-cell' )
		cellEl.setAttribute( 'title', operation.name )
		cellEl.style.gridRow    = 1
		cellEl.style.gridColumn = i + 1


		//  Create an SVG container to hold our reference.

		const svgEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' )
		svgEl.classList.add( 'qjs-circuit-operation' )
		svgEl.operation = operation
		cellEl.appendChild( svgEl )


		//  Find the proper SVG element to reference
		//  and attach it to the SVG tag we just created.

		const useEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'use' )
		useEl.classList.add( 'qjs-circuit-operation-'+ operation.css )
		useEl.setAttributeNS( 'http://www.w3.org/1999/xlink', 'xlink:href', '#qjs-circuit-operation-'+ operation.css )
		svgEl.appendChild( useEl )

		layerOperationsEl.appendChild( cellEl )
	})


	//  Add interaction listeners
	//  so we can grab and drag these operations
	//  on to circuits.

	Array.from( containerEl.querySelectorAll( '.qjs-circuit-cell' ))

		.forEach( function( el ){
		
			el.addEventListener( 'mousedown',  Q.Circuit.GUI.grab )
			el.addEventListener( 'touchstart', Q.Circuit.GUI.grab )
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

	const 
	circuit = this,
	table = this.toTable()

	const circuitEl = document.createElement( 'div' )
	circuitEl.classList.add( 'qjs-circuit' )
	circuitEl.circuit = circuit//  EVIL LAUGH !


	//  Circuit layers.

	const layerWiresEl = document.createElement( 'div' )
	layerWiresEl.classList.add( 'qjs-circuit-layer' )
	layerWiresEl.classList.add( 'qjs-circuit-layer-wires' )
	circuitEl.appendChild( layerWiresEl )
		
	const layerConnnectionsEl = document.createElement( 'div' )
	layerConnnectionsEl.classList.add( 'qjs-circuit-layer' )
	layerConnnectionsEl.classList.add( 'qjs-circuit-layer-connections' )
	circuitEl.appendChild( layerConnnectionsEl )
	
	const layerGrabbablesEl = document.createElement( 'div' )
	layerGrabbablesEl.classList.add( 'qjs-circuit-layer' )
	layerGrabbablesEl.classList.add( 'qjs-circuit-layer-grabbables' )
	circuitEl.appendChild( layerGrabbablesEl )


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
		inputEl.innerText     = circuit.inputs[ i - 1 ].beta.toText()
		layerGrabbablesEl.appendChild( inputEl )
	}


	//  Labels for moments.

	for( let m = 1; m <= circuit.timewidth; m ++ ){

		const momentEl = document.createElement( 'div' )
		momentEl.setAttribute( 'title', 'Moment '+ m +' of '+ table.length )
		momentEl.classList.add( 'qjs-circuit-cell', 'qjs-circuit-moment' )
		momentEl.style.gridColumn = m + 2
		momentEl.innerText = m
		layerGrabbablesEl.appendChild( momentEl )
	}


	//  Circuit menu.

	const menuEl = document.createElement( 'div' )
	menuEl.classList.add( 'qjs-circuit-menu' )
	layerGrabbablesEl.appendChild( menuEl )




	//  Loop through each operation of each moment.
	
	table.forEach( function( moment, m ){

		moment.forEach( function( operation, o ){


			//  Wires.

			const wireEl = document.createElement( 'div' )
			wireEl.classList.add( 'qjs-circuit-cell' )

			const wireSvgEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' )
			wireSvgEl.classList.add( 'qjs-circuit-wire' )
			wireSvgEl.style.gridRow    = o + 2
			wireSvgEl.style.gridColumn = m + 3
			wireEl.appendChild( wireSvgEl )
			
			const wireUseEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'use' )
			wireUseEl.setAttributeNS( 'http://www.w3.org/1999/xlink', 'xlink:href', '#qjs-circuit-wire' )
			wireSvgEl.appendChild( wireUseEl )
			layerWiresEl.appendChild( wireSvgEl )


			//  Identity gates.
			//  We’ll place one on EVERY cell,
			//  even if it will be overlayed by another operation.

			const identityEl = document.createElement( 'div' )
			identityEl.classList.add( 'qjs-circuit-cell' )
			identityEl.setAttribute( 'title', 'Identity' )
			identityEl.style.gridRow    = o + 2
			identityEl.style.gridColumn = m + 3

			const identitySvgEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' )
			identitySvgEl.classList.add( 'qjs-circuit-operation' )
			identitySvgEl.operation = Q.Gate.IDENTITY
			identitySvgEl.setAttributeNS( 'http://www.w3.org/1999/xlink', 'momentIndex', m )
			identitySvgEl.setAttributeNS( 'http://www.w3.org/1999/xlink', 'registerIndex', o )
			identityEl.appendChild( identitySvgEl )

			const identityUseEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'use' )
			identityUseEl.setAttributeNS( 'http://www.w3.org/1999/xlink', 'xlink:href', '#qjs-circuit-operation-identity' )
			identityUseEl.classList.add( 'qjs-circuit-operation-identity' )
			identitySvgEl.appendChild( identityUseEl )			
			layerGrabbablesEl.appendChild( identityEl)

			
			//  Create non-identity gates.

			if( operation.nameCss !== 'identity' ){

				const cellEl = document.createElement( 'div' )
				cellEl.classList.add( 'qjs-circuit-cell' )
				cellEl.setAttribute( 'title', operation.name )
				cellEl.style.gridRow    = o + 2
				cellEl.style.gridColumn = m + 3

				const svgEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' )
				svgEl.classList.add( 'qjs-circuit-operation' )
				svgEl.operation = operation
				svgEl.setAttributeNS( 'http://www.w3.org/1999/xlink', 'momentIndex', m )
				svgEl.setAttributeNS( 'http://www.w3.org/1999/xlink', 'registerIndex', o )
				cellEl.appendChild( svgEl )

				const useEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'use' )
				// useEl.classList.add( 'qjs-circuit-operation-'+ operation.nameCss )
				useEl.setAttributeNS( 'http://www.w3.org/1999/xlink', 'xlink:href', '#qjs-circuit-operation-'+ operation.nameCss )
				svgEl.appendChild( useEl )

				layerGrabbablesEl.appendChild( cellEl )
			}
		})


		//  Now... did we have any multi-register operations during this moment?
		//  If so, we need to draw connectors between each register.
		//  If the operation’s registers are adjacent, use straight connector.
		//  Otherwise use a curved connector.
		
		multiRegisterOperations = moment.reduce( function( collection, operation ){

			if( operation.isMultiRegisterOperation &&
				operation.indexAmongSiblings === 0 ){

				collection.push( operation )
			}
			return collection

		}, [] ).forEach( function( operation ){
			
			circuit.operations[ operation.operationIndex ]
			.registerIndices.filter( function( element ){

				return element !== operation.registerIndex
			})
			.forEach( function( siblingRegisterIndex ){

				const registerDelta = siblingRegisterIndex - operation.registerIndex
				let connectorType = 'curved'
				if( Math.abs( registerDelta ) === 1 ) connectorType = 'straight'				

				const
				start = Math.min( operation.registerIndex, siblingRegisterIndex ),
				end   = Math.max( operation.registerIndex, siblingRegisterIndex )

				const connectionEl = document.createElement( 'div' )
				connectionEl.style.gridRowStart = start + 2
				connectionEl.style.gridRowEnd   = end + 2
				connectionEl.style.gridColumn   = operation.momentIndex + 3

				const connectionSvgEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' )
				connectionEl.appendChild( connectionSvgEl )

				const connectionUseEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'use' )					
				connectionUseEl.setAttributeNS( 'http://www.w3.org/1999/xlink', 'xlink:href', '#qjs-circuit-control-'+ connectorType )
				connectionSvgEl.appendChild( connectionUseEl )
				
				layerConnnectionsEl.appendChild( connectionEl )
			})
		})


		
	})




	//  Add events to our circuit.

	// svg.qjs-circuit-operation, 
	// .qjs-circuit-moment, 
	// .qjs-circuit-register, 
	// .qjs-circuit-input
	Array.from( circuitEl.querySelectorAll( 'svg.qjs-circuit-operation' ))

		.forEach( function( el ){
			
			el.addEventListener( 'mousedown',  Q.Circuit.GUI.grab )
			el.addEventListener( 'touchstart', Q.Circuit.GUI.grab )
		}
	)
	Array.from( circuitEl.querySelectorAll( '.qjs-circuit-layer > *' )).forEach( function( el ){

		el.addEventListener( 'mouseover', Q.Circuit.GUI.highlight )		
	})
	circuitEl.addEventListener( 'mouseout', Q.Circuit.GUI.unhighlight )




	//  All done.

	if( targetEl !== undefined &&
		typeof targetEl.appendChild === 'function' ){

		targetEl.appendChild(  circuitEl )
		return this
	}
	else return circuitEl
}











Q.Circuit.GUI = {

	clipboard: null,
	clipboardElement: null,
	grabbedItem: null,
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
	},
	grab: function( event ){
		
		event.preventDefault()
		event.stopPropagation()

		
		//  We might be grabbing directly on the USE element
		//  or more broadly on the SVG element (where the operation is stored).
		//  Either way we’ll find the operation we’re intending to drag!

		let grabbedItem = event.target
		while( grabbedItem.parentNode && 
			grabbedItem.operation === undefined ){

			grabbedItem = grabbedItem.parentNode
		}
		Q.Circuit.GUI.grabbedItem = grabbedItem


		//  We need to find the containing circuit DOM element
		//  and likewise find the circuit object reference.

		let circuitElement = grabbedItem
		while( circuitElement.parentNode && 
			circuitElement.circuit === undefined ){

			circuitElement = circuitElement.parentNode
		}
		const circuit = circuitElement.circuit		







		//  Now we can construct the clipboard.

		const clip = [ grabbedItem ]//  Temporary measure as we transition to new system here:
		clip.circuitElement = circuitElement
		clip.circuit = circuitElement.circuit
		


		const clipboardElement = document.createElement( 'div' )
		clipboardElement.circuit = clip.circuit//  OMG this is all very messy.
		clipboardElement.classList.add( 'qjs-circuit-clipboard' )

		const gateLayer = document.createElement( 'div' )
		gateLayer.classList.add( 'qjs-circuit-layer' )
		gateLayer.classList.add( 'qjs-circuit-layer-grabbables' )
		clipboardElement.appendChild( gateLayer )

		const cellEl = document.createElement( 'div' )
		cellEl.classList.add( 'qjs-circuit-cell' )
		gateLayer.appendChild( cellEl )




		const bounds = grabbedItem.getBoundingClientRect()

		// console.log( event.pageX, window.pageXOffset, bounds.left )

		clipboardElement.offsetX = window.pageXOffset + bounds.left - event.pageX - 10
		clipboardElement.offsetY = window.pageYOffset + bounds.top  - event.pageY - 10
		document.body.appendChild( clipboardElement )
		

		Q.Circuit.GUI.clipboardElement = clipboardElement


		clip.forEach( function( selectedElement, i, selectedElements ){


			//  This seems superfluous because these values
			//  should remain accessible from the DOM element, yes??
			
			selectedElements[ i ].momentIndex = selectedElement.getAttribute( 'momentIndex' )
			selectedElements[ i ].registerIndex = selectedElement.getAttribute( 'registerIndex' )


			//  ONLY if not clonable!

			//clipboardElement.appendChild( selectedElement )

			// const cellContainer = documen.createElement( 'div' )
			// cellContainer.classList.add( '.qjs-circuit-layer' )

			


			// THIS F’D UP I-OS!!

			// if( clip.circuit === undefined || 
			// 	grabbedItem.operation.label === 'I' ){

			// 	cellEl.appendChild( selectedElement.cloneNode( true ))
			// }
			// else cellEl.appendChild( selectedElement )
		

			

			cellEl.appendChild( selectedElement.cloneNode( true ))
			if( clip.circuit === undefined || 
				grabbedItem.operation.label === 'I' ){

				//cellEl.appendChild( selectedElement.cloneNode( true ))
			}
			else {

				selectedElement.style.display = 'none'
			}


		})
		

// console.log( 'ok did we do it?' )
// console.log( 'cellEl', cellEl )


		// if( event.type === 'touchstart' ){

		// 	console.log( 'attempting BAD touch fix here....' )
		// 	event.target.addEventListener( 'touchmove', Q.Circuit.GUI.move )
		// }


		Q.Circuit.GUI.move( event )




		/*


			ok. we need to actually collect an ARRAY of grabbed items
			in case we grab multiple items at once
			(like if we grab a ROW or COLUMN or AREA of shit)

			and we need to -- at the moment of the grab --
			note each momentIndex, registerIndex, and what circuit they all came from.

			clip.circuitElement
			clip.circuit
			clip[ 0 ] = {
	
				operation: { gate, momentIndex, registerIndices }
				momentIndex
				registerIndex
			}
			clip[ 1 ]...
			...

			
			REMOVE all of these elements from the circuitEl
			and APPEND them to a new clipboard
			so this will be a “circuit clip” or “circuit snippet”

			give that snippetEl a “selected” state (yellow)
			and also a “dragging” state (box shadow)

			and make it follow the mouse’s movements!


		*/
	},
	move: function( event ){


		// console.log( 'Q.Circuit.GUI.clipboardElement:', Q.Circuit.GUI.clipboardElement )
		if( Q.Circuit.GUI.clipboardElement !== null ){
			
			event.preventDefault()
			event.stopPropagation()
			// console.log( 'X,Y:', event.pageX, event.pageY )
			
			const 
			clipboardElement = Q.Circuit.GUI.clipboardElement,
			offsetX = clipboardElement.offsetX,
			offsetY = clipboardElement.offsetY

			clipboardElement.style.top  = ( event.pageY + offsetY ) +'px'
			clipboardElement.style.left = ( event.pageX + offsetX ) +'px'
		}
	},
	drop: function( event ){


		//  Come back and fix this:

		if( Q.Circuit.GUI.clipboardElement !== null ){
			
			Q.Circuit.GUI.clipboard = null
			document.body.removeChild( Q.Circuit.GUI.clipboardElement )
			Q.Circuit.GUI.clipboardElement = null
		}
		


		if( Q.Circuit.GUI.grabbedItem !== null ){


			//  What element are we dropping on to?
			//  Note that it may not be the event’s target element,
			//  if may be an ancestor node.

			let receivingEl = event.target
			if( event.type === 'touchend' ){

				const changedTouch = event.changedTouches[ 0 ]
				receivingEl = document.elementFromPoint( 
				
					changedTouch.clientX, 
					changedTouch.clientY 
				)
				//document.getElementById( 'bell-plus-text' ).innerText = (!!receivingEl) +'   \n'+ JSON.stringify( changedTouch )
			}
			while( receivingEl.parentNode && 
				receivingEl.operation === undefined ){

				receivingEl = receivingEl.parentNode
			}
			

			//  If our receiving element is a Qjs Circuit Gate,
			//  then we’re in business!

			if( receivingEl.classList && 
				receivingEl.classList.contains( 'qjs-circuit-operation' ) &&
				receivingEl !== Q.Circuit.GUI.grabbedItem ){
				

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
				grabbedEl = Q.Circuit.GUI.grabbedItem,
				grabbedMomentIndex   = +grabbedEl.getAttribute( 'momentIndex' ),
				grabbedRegisterIndex = +grabbedEl.getAttribute( 'registerIndex' )


				//  What operation did we drag on to here?
				//  And what operation will we be replacing?
				
				const 
				operationToInsert  = grabbedEl.operation,
				operationToReplace = receivingEl.operation
				

				//  What cell have we dropped on to?
				
				const
				receivingMomentIndex   = +receivingEl.getAttribute( 'momentIndex' ),
				receivingRegisterIndex = +receivingEl.getAttribute( 'registerIndex' )


				//  We expect that the containing DIV for the circuit
				//  is an ancestor of the receiving element.
				//  Our actual Q.Circuit reference will be attached to that!

				let circuitEl = receivingEl
				while( circuitEl.parentNode && 
					!circuitEl.classList.contains( 'qjs-circuit' )){

					circuitEl = circuitEl.parentNode
				}
				const circuit = circuitEl.circuit





				// console.log( 'operationToInsert',  operationToInsert )
				// console.log( 'operationToReplace', operationToReplace )
				// console.log( 'REMOVE op at moment #', receivingMomentIndex, ', register #', receivingRegisterIndex )			
				// console.log( 'and replace with: ', operationToInsert.label )
				// console.log( 'on circuit:', circuit )




				//  x

				circuit.set$(

					receivingMomentIndex + 1, 
					//operationToInsert,
					Q.Gate.findByLabel( operationToInsert.label ),
					[ receivingRegisterIndex ]
				)


				//  Do we need to find the circuit that grabbedEl came from?

				if( Q.isUsefulNumber( grabbedMomentIndex ) && 
					Q.isUsefulNumber( grabbedRegisterIndex )){

					
					//  Find the circuit that grabbedEl came from.
					//  Sure, it’s probably the SAME circuit we’re dropping on to
					//  but since that’s not a constraint of ours
					//  we don’t truly know, do we?

					let grabbedFromCircuitEl = grabbedEl
					while( grabbedFromCircuitEl.parentNode && 
						!grabbedFromCircuitEl.classList.contains( 'qjs-circuit' )){

						grabbedFromCircuitEl = grabbedFromCircuitEl.parentNode
					}
					const grabbedFromCircuit = grabbedFromCircuitEl.circuit



					if( grabbedFromCircuit ){

						grabbedFromCircuit.clearThisInput$( grabbedMomentIndex, grabbedRegisterIndex )
						if( grabbedFromCircuit !== circuit ){
							
							const parent = grabbedFromCircuitEl.parentNode
							if( parent ){
							
								parent.removeChild( grabbedFromCircuitEl )
								parent.appendChild( grabbedFromCircuit.toDom() )
							}
						}
						grabbedFromCircuit.needsEvaluation = true
					}
				}



			


				//operationToInsert.momentIndex = operationToReplace.momentIndex
				//operationToInsert.registerIndex = operationToReplace.registerIndex


				// console.log( circuit.toDiagram() )
				// console.log( circuit.evaluate$() )
				// console.log( circuit.report$() )



				
				//  ********************************************************************************
				//  well this is stupid and temporary!
				//  must come back and fix / make generic / use events?
				//  and also need to remove event listeners, all that stuff
				//  because WOW this is just bad practice!
				//  but the demo works ;)


				const parent = circuitEl.parentNode
				parent.removeChild( circuitEl )
				parent.appendChild( circuit.toDom() )
				circuit.needsEvaluation = true


				if( circuit === bellState ){
							
					document.getElementById( 'bell-plus-report' ).innerText = bellState.report$()
					document.getElementById( 'bell-plus-diagram' ).innerText = bellState.toDiagram( true )
					document.getElementById( 'bell-plus-text' ).innerText = bellState.toText()
				}
				if( circuit === whiplash ){
								
					document.getElementById( 'whiplash-diagram' ).innerText = whiplash.toDiagram( true )
					document.getElementById( 'whiplash-text' ).innerText = whiplash.toText()
				}
				//  ********************************************************************************
			



			}
			else {

				console.log( 'dropped on to NOTHING' )
			}
			Q.Circuit.GUI.grabbedItem = null
		}
	}
}







const addEvents = function( el = document.body ){

	document.addEventListener( 'mousemove',  Q.Circuit.GUI.move )
	document.addEventListener( 'touchmove',  Q.Circuit.GUI.move )

	document.addEventListener( 'mouseup',  Q.Circuit.GUI.drop )	
	document.addEventListener( 'touchend', Q.Circuit.GUI.drop )
}




window.addEventListener( 'DOMContentLoaded', function(){

	addEvents()
})







