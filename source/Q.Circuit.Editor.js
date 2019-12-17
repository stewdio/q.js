
//  Copyright © 2019, Stewart Smith. See LICENSE for details.




Q.Circuit.Editor = function(){}
Q.Circuit.Editor.SPRITEMAP = `<svg style="display: none" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 60 60" style="enable-background:new 0 0 60 60;" xml:space="preserve">
	<g id="qjs-circuit-wire">
		<rect y="30" width="60" height="1"/>
	</g>
</svg>
<svg style="display: none"
	xmlns="http://www.w3.org/2000/svg" 
	xmlns:xlink="http://www.w3.org/1999/xlink" 
	x="0px" y="0px"
	viewBox="0 30 60 60">
	<symbol id="qjs-circuit-control-straight">
		<line x1="30" y1="0" x2="30" y2="60"/>
	</symbol>
	<symbol id="qjs-circuit-control-curved" viewBox="0 0 60 60" preserveAspectRatio="none">
		<path d="M30,0c13.8,0,25,13.4,25,30S43.8,60,30,60"/>
	</symbol>
</svg>
<svg style="display: none" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 40 40" style="enable-background:new 0 0 40 40;" xml:space="preserve">
	<g id="qjs-circuit-qubit-0">
		<path d="M24.4,21.6c-0.1,0.7-0.3,1.4-0.5,2.1s-0.6,1.3-1,1.8s-1,0.9-1.6,1.2s-1.3,0.5-2.2,0.4c-0.8,0-1.4-0.2-2-0.5
			s-0.9-0.8-1.2-1.3s-0.5-1.1-0.5-1.8s-0.1-1.3,0-2l0.5-3.4c0.1-0.7,0.3-1.4,0.5-2.1s0.6-1.3,1-1.8s1-0.9,1.6-1.2s1.3-0.5,2.2-0.4
			c0.5,0,1,0.1,1.4,0.3s0.7,0.4,1,0.6s0.5,0.6,0.7,0.9s0.3,0.7,0.4,1.1s0.2,0.8,0.2,1.3s0,0.9-0.1,1.4L24.4,21.6z M22.1,19.5
			L18,22.3c0,0.3,0,0.6,0,0.9s0,0.6,0.1,0.9s0.2,0.5,0.4,0.7S19,25,19.3,25c0.4,0,0.8-0.1,1-0.3s0.5-0.4,0.7-0.7s0.3-0.6,0.4-1
			s0.2-0.7,0.2-1L22.1,19.5z M18.3,20.3l4.1-2.8c0-0.3,0.1-0.6,0.1-0.9s0-0.6-0.1-0.9s-0.2-0.5-0.4-0.7s-0.5-0.3-0.8-0.3
			c-0.4,0-0.8,0.1-1,0.2s-0.5,0.4-0.7,0.7s-0.3,0.6-0.4,1s-0.2,0.7-0.2,1L18.3,20.3z"/>
		<polygon points="29.9,30.5 28.1,29.5 33.9,19.9 30.1,10.4 31.9,9.6 36.1,20.1"/>
	</g>
	<g id="qjs-circuit-qubit-1">
		<path d="M20.9,27h-2.7l1.9-10.8l-3.7,1.3l0.4-2.5l6.3-2.2h0.2L20.9,27z"/>
		<polygon points="29.9,30.5 28.1,29.5 33.9,19.9 30.1,10.4 31.9,9.6 36.1,20.1"/>
	</g>
	<g class="qjs-circuit-gate" id="qjs-circuit-operation-identity">
		<circle cx="20" cy="20" r="5"/>
	</g>
	<g class="qjs-circuit-gate" id="qjs-circuit-operation-controller">
		<circle cx="20" cy="20" r="8"/>
	</g>
	<g class="qjs-circuit-gate" id="qjs-circuit-operation-controlled">
		<circle cx="20" cy="20" r="15"/>
		<polygon class="qjs-circuit-operation-label" points="27,19 21,19 21,13 19,13 19,19 13,19 13,21 19,21 19,27 21,27 21,21 27,21 	"/>
	</g>
	<g class="qjs-circuit-gate" id="qjs-circuit-operation-unknown">
		<rect width="40" height="40"/>
		<g class="qjs-circuit-operation-label">
			<path d="M18.1,22.5c0.1-1.5,0.6-2.7,1.5-3.5l0.8-0.6c0.4-0.4,0.8-0.7,1-1.1s0.3-0.8,0.3-1.3c0-0.6-0.3-0.9-0.9-0.9
				c-0.4,0-0.7,0.1-1,0.4s-0.4,0.7-0.5,1.2l-3.2,0c0.1-1.3,0.6-2.3,1.5-3.1s2-1.1,3.4-1.1c0.8,0,1.6,0.2,2.2,0.5s1.1,0.8,1.4,1.3
				s0.4,1.2,0.4,2c-0.1,1.1-0.7,2.1-1.9,3.1l-1.1,0.9c-0.7,0.6-1.1,1.3-1.2,2.1L18.1,22.5z M17.1,25.5c0-0.5,0.2-0.9,0.5-1.2
				s0.8-0.5,1.3-0.5c0.5,0,0.9,0.2,1.2,0.5s0.5,0.7,0.5,1.1c0,0.5-0.2,0.9-0.5,1.2s-0.8,0.5-1.3,0.5c-0.5,0-0.9-0.1-1.2-0.4
				S17.1,26,17.1,25.5z"/>
		</g>
	</g>
	<g class="qjs-circuit-gate" id="qjs-circuit-operation-pi">
		<rect width="40" height="40"/>
		<g class="qjs-circuit-operation-label">
			<path d="M26.4,18.8h-1.7l-0.8,4.7l0,0.4c0,0.4,0.3,0.6,0.8,0.6c0.1,0,0.4,0,0.8,0l-0.2,2.4c-0.6,0.2-1.1,0.3-1.7,0.3
				c-1,0-1.7-0.3-2.2-0.9s-0.7-1.3-0.6-2.3l0.8-5.1h-2L17.9,27h-3.2l1.4-8.2h-1.7l0.4-2.4h11.9L26.4,18.8z"/>
		</g>
	</g>
	<g class="qjs-circuit-gate" id="qjs-circuit-operation-t">
		<rect width="40" height="40"/>
		<g class="qjs-circuit-operation-label">
			<path d="M27,15.4h-4.1l-2,11.6h-3.3l2-11.6h-4.1l0.5-2.6h11.5L27,15.4z"/>
		</g>
	</g>
	<g class="qjs-circuit-gate" id="qjs-circuit-operation-phase">
		<rect width="40" height="40"/>
		<g class="qjs-circuit-operation-label">
			<path class="st3" d="M21.7,23.2c0.1-0.7-0.3-1.3-1.2-1.7l-1.6-0.7c-2.2-1-3.3-2.4-3.2-4.1c0-0.8,0.3-1.5,0.8-2.1s1.2-1.1,2.1-1.5
				s1.9-0.5,2.9-0.5c1.4,0,2.5,0.4,3.4,1.2s1.3,1.9,1.3,3.2h-3.3c0-0.5-0.1-1-0.3-1.3s-0.7-0.5-1.2-0.5c-0.6,0-1.1,0.1-1.5,0.4
				s-0.7,0.6-0.8,1.1c-0.1,0.7,0.4,1.2,1.5,1.6s1.9,0.8,2.4,1.1c1.6,0.9,2.3,2.2,2.2,3.8c-0.1,0.8-0.3,1.5-0.8,2.2s-1.1,1.1-2,1.4
				s-1.8,0.5-2.8,0.5c-0.8,0-1.5-0.1-2.1-0.4s-1.2-0.6-1.7-1c-1-0.9-1.4-2-1.4-3.5l3.3,0c0,0.7,0.1,1.3,0.4,1.7s0.9,0.6,1.6,0.6
				c0.6,0,1-0.1,1.4-0.4S21.6,23.6,21.7,23.2z"/>
		</g>
	</g>
	<g class="qjs-circuit-gate" id="qjs-circuit-operation-pauli-z">
		<rect width="40" height="40"/>
		<g class="qjs-circuit-operation-label">
			<path d="M18.3,24.3l6.6,0L24.4,27H13.6l0.3-2l8.2-9.6l-6.6,0l0.5-2.6h10.7l-0.3,1.9L18.3,24.3z"/>
		</g>
	</g>
	<g class="qjs-circuit-gate" id="qjs-circuit-operation-pauli-y">
		<rect width="40" height="40"/>
		<g class="qjs-circuit-operation-label">
			<path d="M20.3,18.9l3.6-6.2h3.8L21.5,22l-0.8,5h-3.4l0.9-5.3l-2.8-8.9l3.5,0L20.3,18.9z"/>
		</g>
	</g>
	<g class="qjs-circuit-gate" id="qjs-circuit-operation-pauli-x">
		<rect width="40" height="40"/>
		<g class="qjs-circuit-operation-label">
			<path d="M20.4,17.5l3-4.7h4L22.3,20l2.8,7h-3.7l-1.6-4.8L16.8,27h-4l5.2-7.3l-2.7-6.9h3.7L20.4,17.5z"/>
		</g>
	</g>
	<g class="qjs-circuit-gate" id="qjs-circuit-operation-hadamard">
		<rect width="40" height="40"/>
		<g class="qjs-circuit-operation-label">
			<path d="M24.7,27h-3.3l1-5.9h-4.9l-1,5.9h-3.3l2.5-14.2H19l-1,5.6h4.9l1-5.6h3.3L24.7,27z"/>
		</g>
	</g>
</svg>`
Q.Circuit.Editor.addSpriteMap = function(){

	const spritemapEl = document.createElement( 'div' )
	spritemapEl.style.display =  'none'
	spritemapEl.innerHTML = Q.Circuit.Editor.SPRITEMAP 
	document.body.appendChild( spritemapEl )
}








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

	'HXYZSI'.split( '' ).forEach( function( label, i ){


		//  Find the actual gate.

		const gate = Q.Gate.findByLabel( label )


		//  Create the grid cell.
		//  We’ll wait to attach it to the layer.
		// (Is that just unecessary precaution here?)

		const cellEl = document.createElement( 'div' )
		cellEl.classList.add( 

			'qjs-circuit-cell',
			'qjs-circuit-operation',
			'qjs-circuit-operation-'+ gate.css
		)
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




	//  CIRCUIT LAYERS.


	//  Our background layer does 3 things:
	//  1. Holds space for the circuit’s width and height
	//     by creating cells that take up space regardless
	//     of whether or not they contain anything.
	//  2. Visually indicates if an item is highlighted,
	//     selected, etc. by holding a background color.
	//  3. Contains the horizontal “wires” where appropriate.

	const layerBackgroundEl = document.createElement( 'div' )
	circuitEl.appendChild( layerBackgroundEl )
	layerBackgroundEl.classList.add( 

		'qjs-circuit-layer',
		'qjs-circuit-layer-background'
	)

	const layerConnnectionsEl = document.createElement( 'div' )
	circuitEl.appendChild( layerConnnectionsEl )
	layerConnnectionsEl.classList.add( 

		'qjs-circuit-layer',
		'qjs-circuit-layer-connections'
	)
	
	const layerGrabbablesEl = document.createElement( 'div' )
	circuitEl.appendChild( layerGrabbablesEl )
	layerGrabbablesEl.classList.add(

		'qjs-circuit-layer',
		'qjs-circuit-layer-grabbables'
	)
	



	//  Create background layer.

	for( let m = 0; m < circuit.timewidth + 2; m ++ ){

		for( let r = 0; r < circuit.bandwidth + 1; r ++ ){

			const cellEl = document.createElement( 'div' )
			cellEl.classList.add( 'qjs-circuit-cell' )
			cellEl.style.gridColumn = m + 1
			cellEl.style.gridRow    = r + 1
			layerBackgroundEl.appendChild( cellEl )

			if( m === 0 ) cellEl.classList.add( 'qjs-circuit-register' )
			if( m === 1 ) cellEl.classList.add( 'qjs-circuit-input' )
			if( r === 0 ) cellEl.classList.add( 'qjs-circuit-moment' )
			if( m > 1 && r > 0 ){

				cellEl.classList.add( 'qjs-circuit-wire' )

				const wireSvgEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' )
				wireSvgEl.classList.add( 'qjs-circuit-wire' )
				cellEl.appendChild( wireSvgEl )
				
				const wireUseEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'use' )
				wireUseEl.setAttributeNS( 'http://www.w3.org/1999/xlink', 'xlink:href', '#qjs-circuit-wire' )
				wireSvgEl.appendChild( wireUseEl )
			}
		}
	}




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
		momentEl.addEventListener( 'click', Q.Circuit.GUI.select )
	
		for( let r = 1; r <= circuit.bandwidth; r ++ ){


			//  Identity gates.
			//  We’ll place one on EVERY cell,
			//  even if it will be overlayed by another operation.

			const identityEl = document.createElement( 'div' )
			identityEl.classList.add( 

				'qjs-circuit-cell', 
				'qjs-circuit-operation',
				'qjs-circuit-operation-identity'
			)
			identityEl.setAttribute( 'title', 'Identity' )
			identityEl.style.gridColumn = m + 2
			identityEl.style.gridRow    = r + 1
			identityEl.setAttribute( 'momentindex',   m )
			identityEl.setAttribute( 'registerindex', r )
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
			cellEl.classList.add( 
			
				'qjs-circuit-cell',
				'qjs-circuit-operation',
				'qjs-circuit-operation-'+ operation.gate.css
			)
			cellEl.setAttribute( 'title', operation.gate.name )
			cellEl.setAttribute( 'momentindex',   operation.momentIndex )
			cellEl.setAttribute( 'registerindex', registerIndex )
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
					connectionEl.setAttribute( 'momentindex', operation.momentIndex )
					connectionEl.setAttribute( 'registerindices', operation.registerIndices )

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

	Array.from( circuitEl.querySelectorAll( 

		'.qjs-circuit-cell'

	)).forEach( function( el ){

		el.addEventListener( 'mouseenter', Q.Circuit.GUI.highlight )
	})
	circuitEl.addEventListener( 'mouseleave', Q.Circuit.GUI.unhighlight )





	window.addEventListener( 'qjs clearThisInput$', function( event ){

		if( circuit === event.detail.circuit ){
			
			const {

				momentIndex,
				registerIndices
			
			} = event.detail


			//  Remove any operation at this moment
			//  with any overlap in the provided register indices.

			Array.from( circuitEl.querySelectorAll( 

				'.qjs-circuit-layer-grabbables [momentindex="'+ momentIndex +'"][registerindex]' 
			
			)).filter( function( op ){

				return (

					registerIndices.includes( +op.getAttribute( 'registerindex' )) &&
					!op.classList.contains( 'qjs-circuit-operation-identity' )
				)
			}).forEach( function( el ){

				el.parentNode.removeChild( el )
			})
			

			//  Remove any wires connected to this moment and register indices.

			Array.from( circuitEl.querySelectorAll(

				'.qjs-circuit-layer-connections [momentindex="'+ momentIndex +'"]'

			)).filter( function( el ){

				const wireRegisterIndices = el
					.getAttribute( 'registerindices' )
					.split( ',' )
					.reduce( function( array, n ){

						return +n

					}, [] )
				
				return registerIndices.includes( wireRegisterIndices )

			}).forEach( function( connectionEl ){

				connectionEl.parentNode.removeChild( connectionEl )
			})
		}
	})
	window.addEventListener( 'qjs set$ completed', function( event ){

		if( circuit === event.detail.circuit && event.detail.gate !== Q.Gate.IDENTITY ){
		
			const {

				gate,
				momentIndex,
				registerIndices
			
			} = event.detail


			// console.log( 'operation has been added. \nDOM should match this:\n'+ event.detail.circuit.toDiagram() )


			registerIndices.forEach( function( registerIndex, i ){

				const cellEl = document.createElement( 'div' )
				layerGrabbablesEl.appendChild( cellEl )
				cellEl.classList.add( 'qjs-circuit-operation' )
				cellEl.setAttribute( 'title', gate.name )
				cellEl.setAttribute( 'momentindex',   momentIndex )
				cellEl.setAttribute( 'registerindex', registerIndex )
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

				cellEl.addEventListener( 'mouseenter', Q.Circuit.GUI.highlight )
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

		
		//  Our first order of business is 
		//  to find the operation we grabbed to trigger this.		

		let operationEl = event.target
		while( operationEl.parentNode && 
			operationEl.operation === undefined ){

			operationEl = operationEl.parentNode
		}


		//  Did we really find an operation to grab?

		if( operationEl.operation ){

			event.preventDefault()
			event.stopPropagation()

			const 
			momentIndex   = +operationEl.getAttribute( 'momentindex' )
			registerIndex = +operationEl.getAttribute( 'registerindex' )
			

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

					return Math.min( min, +el.getAttribute( 'momentindex' ))

				}, Infinity ),
				registerIndexMin = selectedElements.reduce( function( min, el ){

					return Math.min( min, +el.getAttribute( 'registerindex' ))

				}, Infinity )


				//  Where are we supposed to make this clipboard appear? 

				const bounds = ( circuit ?

					circuitEl.querySelector( 

						'[momentindex="'+ momentIndexMin +'"]'+
						'[registerindex="'+ registerIndexMin +'"]'
					)
					: operationEl
				
				).getBoundingClientRect()
				clipboardElement.offsetX = window.pageXOffset + bounds.left - event.pageX
				clipboardElement.offsetY = window.pageYOffset + bounds.top  - event.pageY - 7
				document.body.appendChild( clipboardElement )


				//  We’ll need these values for checking for “self-drops”
				//  when we do onDrop later.

				clipboardElement.setAttribute( 'momentindex', momentIndex )
				clipboardElement.setAttribute( 'registerindex', registerIndex )
				clipboardElement.setAttribute( 'momentindexmin', momentIndexMin )
				clipboardElement.setAttribute( 'registerindexmin', registerIndexMin )
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
					cloneEl.style.gridColumn = 1 + ( +selectedElement.getAttribute( 'momentindex' ) - momentIndexMin )
					cloneEl.style.gridRow    = 1 + ( +selectedElement.getAttribute( 'registerindex' ) - registerIndexMin )
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

			const
			receivingEls = event.type === 'touchend' ? 
				document.elementsFromPoint( event.changedTouches[ 0 ].clientX, event.changedTouches[ 0 ].clientY ) :
				document.elementsFromPoint( event.clientX, event.clientY )

			let receivingEl = Array.from( receivingEls ).find( function( el ){

				return el.classList.contains( 'qjs-circuit-operation' )
			})


			//  If our receiving element is a Qjs Circuit operation,
			//  then we’re in business!

			if( receivingEl &&
				receivingEl.classList && 
				receivingEl.classList.contains( 'qjs-circuit-operation' )){
				

				//  What cell have we dropped on to?
				
				const
				receivingMomentIndex   = +receivingEl.getAttribute( 'momentindex' ),
				receivingRegisterIndex = +receivingEl.getAttribute( 'registerindex' ),
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
				clipboardMomentIndex   = +clipboardEl.getAttribute( 'momentindex' ),
				clipboardRegisterIndex = +clipboardEl.getAttribute( 'registerindex' )

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
					grabbedMomentIndex   = +grabbedEl.getAttribute( 'momentindex' ),
					grabbedRegisterIndex = +grabbedEl.getAttribute( 'registerindex' ),
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
				if( receivingCircuitTasks.length ) receivingCircuit.evaluate$()
				if( grabbedCircuit && 
					grabbedCircuit !== receivingCircuit && 
					grabbedCircuitTasks.length ){

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

		Array.from( circuitEl.querySelectorAll( '.qjs-circuit-cell' )).forEach( function( el ){

			const 
			style = getComputedStyle( el ),
			thisRow    = parseFloat( style.gridRowStart ),
			thisColumn = parseFloat( style.gridColumnStart )

			if(
				( selectedRow > 1 || selectedColumn > 1 ) &&
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
		Array.from( circuitEl.querySelectorAll( 

			// '.qjs-circuit-layer-grabbables *, .qjs-circuit-layer-wires *' 
			'.qjs-circuit-cell'

		)).forEach( function( el ){

			el.classList.remove( 'qjs-circuit-highlight' )
		})
	},
	



	select: function( event ){

		console.log( 'selection event', event )
	},
	unselect: function( event ){

		console.log( 'unselection event', event )
	}
}








const addEvents = function( el = document.body ){

	document.addEventListener( 'mousemove', Q.Circuit.GUI.onMove )
	document.addEventListener( 'touchmove', Q.Circuit.GUI.onMove )
	document.addEventListener( 'mouseup',   Q.Circuit.GUI.onDrop )
	document.addEventListener( 'touchend',  Q.Circuit.GUI.onDrop )
}
window.addEventListener( 'DOMContentLoaded', function(){

	Q.Circuit.Editor.addSpriteMap()
	addEvents()
})







