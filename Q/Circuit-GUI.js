



Q.Circuit.createDomMenu = function( targetEl ){

	const menuEl = document.createElement( 'div' )
	menuEl.classList.add( 'qjs-circuit-palette' )

	const layerOperationsEl = document.createElement( 'div' )
	layerOperationsEl.classList.add( 'qjs-circuit-layer' )
	menuEl.appendChild( layerOperationsEl )

	;[

		'I',
		'H',
		'X',
		'Y',
		'Z',
		'S',
		'T',
		'C'

	].forEach( function( label, i ){

		const operation = Q.Gate.findByLabel( label )

		const gateEl = document.createElement( 'div' )
		gateEl.setAttribute( 'title', operation.name )
		gateEl.style.gridRow    = 1
		gateEl.style.gridColumn = i + 1

		const gateSvgEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' )
		gateSvgEl.classList.add( 'qjs-circuit-gate' )
		gateSvgEl.operation = operation
		gateEl.appendChild( gateSvgEl )

		const useEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'use' )
		useEl.classList.add( 'qjs-circuit-gate-'+ operation.css )
		useEl.setAttributeNS( 'http://www.w3.org/1999/xlink', 'xlink:href', '#qjs-circuit-gate-'+ operation.css )
		gateSvgEl.appendChild( useEl )

		layerOperationsEl.appendChild( gateEl )
	})

	Array.from( menuEl.querySelectorAll( `

		svg.qjs-circuit-gate, 
		.qjs-circuit-moment, 
		.qjs-circuit-register, 
		.qjs-circuit-input` 

	)).forEach( function( el ){
		
		el.addEventListener( 'mousedown',  Q.Circuit.GUI.grab )
		el.addEventListener( 'touchstart', Q.Circuit.GUI.grab )
	})
	



	if( targetEl !== undefined && 
		typeof targetEl.appendChild === 'function' ){

		targetEl.appendChild( menuEl )
	}
	return menuEl
}








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
		registerEl.setAttribute( 'title', 'Register '+ i +' of '+ this.inputs.length )
		registerEl.classList.add( 'qjs-circuit-register' )
		registerEl.style.gridRow = i + 1
		registerEl.innerText     = i
		layerGrabbablesEl.appendChild( registerEl )

		const inputEl = document.createElement( 'div' )
		inputEl.classList.add( 'qjs-circuit-input' )
		inputEl.style.gridRow = i + 1
		inputEl.innerText     = circuit.inputs[ i - 1 ].beta.toText()
		
		layerGrabbablesEl.appendChild( inputEl )
	}


	//  Labels for moments.

	for( let m = 1; m <= circuit.timewidth; m ++ ){

		const momentEl = document.createElement( 'div' )
		momentEl.setAttribute( 'title', 'Moment '+ m +' of '+ table.length )
		momentEl.classList.add( 'qjs-circuit-moment' )
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

			const wireSvgEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' )
			wireSvgEl.classList.add( 'qjs-circuit-wire' )
			wireSvgEl.style.gridRow = o + 2
			wireSvgEl.style.gridColumn = m + 3
			
			const wireUseEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'use' )
			wireUseEl.setAttributeNS( 'http://www.w3.org/1999/xlink', 'xlink:href', '#qjs-circuit-wire' )
			wireSvgEl.appendChild( wireUseEl )
			
			layerWiresEl.appendChild( wireSvgEl )


			//  Identity gates.
			//  We’ll place one on EVERY cell,
			//  even if it will be overlayed by another gate!

			const identityEl = document.createElement( 'div' )
			identityEl.setAttribute( 'title', 'Identity' )
			identityEl.style.gridRow = o + 2
			identityEl.style.gridColumn = m + 3

			const identitySvgEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' )
			identitySvgEl.classList.add( 'qjs-circuit-gate' )
			identitySvgEl.operation = Q.Gate.IDENTITY
			identitySvgEl.setAttributeNS( 'http://www.w3.org/1999/xlink', 'momentIndex', m )
			identitySvgEl.setAttributeNS( 'http://www.w3.org/1999/xlink', 'registerIndex', o )
			identityEl.appendChild( identitySvgEl )

			const identityUseEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'use' )
			identityUseEl.setAttributeNS( 'http://www.w3.org/1999/xlink', 'xlink:href', '#qjs-circuit-gate-identity' )
			identityUseEl.classList.add( 'qjs-circuit-gate-identity' )
			identitySvgEl.appendChild( identityUseEl )			
			layerGrabbablesEl.appendChild( identityEl)

			
			//  Create non-identity gates.

			if( operation.nameCss !== 'identity' ){

				const gateEl = document.createElement( 'div' )
				gateEl.setAttribute( 'title', operation.name )
				gateEl.style.gridRow = o + 2
				gateEl.style.gridColumn = m + 3

				const gateSvgEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' )
				gateSvgEl.classList.add( 'qjs-circuit-gate' )
				gateSvgEl.operation = operation
				gateSvgEl.setAttributeNS( 'http://www.w3.org/1999/xlink', 'momentIndex', m )
				gateSvgEl.setAttributeNS( 'http://www.w3.org/1999/xlink', 'registerIndex', o )
				gateEl.appendChild( gateSvgEl )

				const useEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'use' )
				useEl.classList.add( 'qjs-circuit-gate-'+ operation.nameCss )
				useEl.setAttributeNS( 'http://www.w3.org/1999/xlink', 'xlink:href', '#qjs-circuit-gate-'+ operation.nameCss )
				gateSvgEl.appendChild( useEl )

				layerGrabbablesEl.appendChild( gateEl )
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

	Array.from( circuitEl.querySelectorAll( `

		svg.qjs-circuit-gate, 
		.qjs-circuit-moment, 
		.qjs-circuit-register, 
		.qjs-circuit-input` 

	)).forEach( function( el ){
		
		el.addEventListener( 'mousedown',  Q.Circuit.GUI.grab )
		el.addEventListener( 'touchstart', Q.Circuit.GUI.grab )
	})
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
		clipboardElement.classList.add( 'qjs-circuit-clipboard' )

const bounds = grabbedItem.getBoundingClientRect()

console.log( event.pageX, window.pageXOffset, bounds.left )

		clipboardElement.offsetX = window.pageXOffset + bounds.left - event.pageX - 10
		clipboardElement.offsetY = window.pageYOffset + bounds.top  - event.pageY - 30
		document.body.appendChild( clipboardElement )
		

		Q.Circuit.GUI.clipboardElement = clipboardElement


		clip.forEach( function( selectedElement, i, selectedElements ){


			//  This seems superfluous because these values
			//  should remain accessible from the DOM element, yes??
			
			selectedElements[ i ].momentIndex = selectedElement.getAttribute( 'momentIndex' )
			selectedElements[ i ].registerIndex = selectedElement.getAttribute( 'registerIndex' )


			//  ONLY if not clonable!

			//clipboardElement.appendChild( selectedElement )
			clipboardElement.appendChild( selectedElement.cloneNode( true ))
		})
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

		if( Q.Circuit.GUI.clipboardElement !== null ){
			
			// console.log( event.pageX, event.pageY )
			
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

		Q.Circuit.GUI.clipboard = null
		document.body.removeChild( Q.Circuit.GUI.clipboardElement )
		Q.Circuit.GUI.clipboardElement = null
		


		if( Q.Circuit.GUI.grabbedItem !== null ){


			//  What element are we dropping on to?
			//  Note that it may not be the event’s target element,
			//  if may be an ancestor node.

			let receivingEl = event.target
			if( event.type === 'touchend' ){

				const changedTouch = event.changedTouches[ 0 ],
				receivingEl = document.elementFromPoint( changedTouch.clientX, changedTouch.clientY )
			}
			while( receivingEl.parentNode && 
				receivingEl.operation === undefined ){

				receivingEl = receivingEl.parentNode
			}
			

			//  If our receiving element is a Qjs Circuit Gate,
			//  then we’re in business!

			if( receivingEl.classList && 
				receivingEl.classList.contains( 'qjs-circuit-gate' ) &&
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
							parent.removeChild( grabbedFromCircuitEl )
							parent.appendChild( grabbedFromCircuit.toDom() )
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


				if( circuit === bellPlus ){
							
					document.getElementById( 'bell-plus-report' ).innerText = bellPlus.report$()
					document.getElementById( 'bell-plus-diagram' ).innerText = bellPlus.toDiagram( true )
					document.getElementById( 'bell-plus-text' ).innerText = bellPlus.toText()
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







