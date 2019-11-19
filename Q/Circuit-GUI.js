



Q.Circuit.createDomMenu = function(){

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
		gateEl.appendChild( gateSvgEl )

		const useEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'use' )
		useEl.classList.add( 'qjs-circuit-gate-'+ operation.css )
		useEl.setAttributeNS( 'http://www.w3.org/1999/xlink', 'xlink:href', '#qjs-circuit-gate-'+ operation.css )
		useEl.operation = operation
		gateSvgEl.appendChild( useEl )

		layerOperationsEl.appendChild( gateEl )
	})
	return menuEl
}








Q.Circuit.prototype.toDom = function(){

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
			wireSvgEl.style.gridRow = ( o + 2 )
			wireSvgEl.style.gridColumn = ( m + 3 )			
			
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
				gateSvgEl.operation = operation//  hehehehehe.
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


	//  All done. Return our document fragment.

	return circuitEl
}







/*


https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API

https://mdn.github.io/dom-examples/drag-and-drop/copy-move-DataTransfer.html

https://mdn.github.io/dom-examples/drag-and-drop/copy-move-DataTransferItemList.html

*/

let
grabbedItem = null





const
highlight = function( event ){

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
unhighlight = function( event ){


	let circuitEl = event.target
	while( circuitEl.parentNode && !circuitEl.classList.contains( 'qjs-circuit' )){

		circuitEl = circuitEl.parentNode
	}
	Array.from( circuitEl.querySelectorAll( '.qjs-circuit-layer-grabbables *, .qjs-circuit-layer-wires *' )).forEach( function( el ){

		el.classList.remove( 'qjs-circuit-highlight' )
	})
},
grab = function( event ){
	
	event.preventDefault()
	event.stopPropagation()
	grabbedItem = event.target
	// console.log( 'grabbed', event )
	console.log( 'grabbing this', grabbedItem.operation )
},
move = function(){


},
drop = function( event ){

	if( grabbedItem !== null ){
	
		let dropTarget = event.target
		while( dropTarget.classList && !dropTarget.classList.contains( 'qjs-circuit-gate' )){

			dropTarget = dropTarget.parentNode
		}
		
		let circuitEl = event.target
		while( circuitEl.parentNode && !circuitEl.classList.contains( 'qjs-circuit' )){

			circuitEl = circuitEl.parentNode
		}
		const circuit = circuitEl.circuit



		if( dropTarget.classList && dropTarget.classList.contains( 'qjs-circuit-gate' )){

			const 
			operationToInsert  = grabbedItem.operation,
			operationToReplace = dropTarget.operation
			
			// console.log( 'found!', operation )
			console.log( 'REMOVE ops at moment #', operationToReplace.momentIndex, 'containing register #', operationToReplace.registerIndex )			
			console.log( 'and replace with: ', operationToInsert.label )
			// console.log( 'on circuit:', circuit )

			circuit.set$( operationToReplace.momentIndex + 1, Q.Gate.findByLabel( operationToInsert.label ), [ operationToReplace.registerIndex ])
			console.log( circuit.toDiagram() )
			console.log( circuit.evaluate$() )
			console.log( circuit.report$() )
		}
		else {

			console.log( 'dropped on to NOTHING' )
		}
		grabbedItem = null
	}
},
addEvents = function( el = document.body ){

	Array.from( el.querySelectorAll( 'svg.qjs-circuit-gate, .qjs-circuit-moment, .qjs-circuit-register, .qjs-circuit-input' )).forEach( function( el ){

		
		el.addEventListener( 'mousedown', grab )
		el.addEventListener( 'touchstart', grab )

		// el.addEventListener( 'mouseup', drop )
		// el.addEventListener( 'touchend', drop )
	})
	document.addEventListener( 'mouseup', drop )
	document.addEventListener( 'touchend', drop )






	Array.from( document.querySelectorAll( '.qjs-circuit-layer > *' )).forEach( function( el ){

		el.addEventListener( 'mouseover', highlight )		
	})
	Array.from( document.querySelectorAll( '.qjs-circuit' )).forEach( function( el ){

		el.addEventListener( 'mouseout', unhighlight )
	})



	//  need to add an  unhighlight for mouseout of any circuit.
}




window.addEventListener( 'DOMContentLoaded', function(){

	addEvents()
})







