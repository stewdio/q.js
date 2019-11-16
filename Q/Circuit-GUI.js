


Q.Circuit.prototype.toDom = function(){

	const 
	circuit = this,
	table = this.toTable()

	const circuitEl = document.createElement( 'div' )
	circuitEl.classList.add( 'qjs-circuit' )


	//  Circuit layers.

	const layerWiresEl = document.createElement( 'div' )
	layerWiresEl.classList.add( 'qjs-circuit-layer' )
	layerWiresEl.classList.add( 'qjs-circuit-layer-wires' )
	circuitEl.appendChild( layerWiresEl )
	
	const layerIdentitiesEl = document.createElement( 'div' )
	layerIdentitiesEl.classList.add( 'qjs-circuit-layer' )
	layerIdentitiesEl.classList.add( 'qjs-circuit-layer-identities' )
	circuitEl.appendChild( layerIdentitiesEl )
	
	const layerConnnectionsEl = document.createElement( 'div' )
	layerConnnectionsEl.classList.add( 'qjs-circuit-layer' )
	layerConnnectionsEl.classList.add( 'qjs-circuit-layer-connections' )
	circuitEl.appendChild( layerConnnectionsEl )
	
	const layerGrabbablesEl = document.createElement( 'div' )
	layerGrabbablesEl.classList.add( 'qjs-circuit-layer' )
	layerGrabbablesEl.classList.add( 'qjs-circuit-layer-grabbables' )
	circuitEl.appendChild( layerGrabbablesEl )




	this.inputs.forEach( function( input, i ){

/*
		const wireEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' )
		wireEl.classList.add( 'qjs-circuit-wire' )
		const useEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'use' )
		useEl.setAttributeNS( 'http://www.w3.org/1999/xlink', 'xlink:href', '#qjs-circuit-wire' )
		wireEl.appendChild( useEl )
		wireEl.style.gridRow = ( i + 2 )
		wireEl.style.gridColumnEnd = ( circuit.timewidth + 2 )
		layerWiresEl.appendChild( wireEl )
		*/
	
		const qubitEl = document.createElement( 'div' )
		qubitEl.classList.add( 'qjs-circuit-qubit' )
		qubitEl.style.gridRow = ( i + 2 )
		qubitEl.innerHTML = 'r<code><strong>'+ i +'</strong></code>'
		layerGrabbablesEl.appendChild( qubitEl )

		const inputEl = document.createElement( 'div' )
		inputEl.classList.add( 'qjs-circuit-input' )
		inputEl.style.gridRow = ( i + 2 )
		inputEl.innerHTML = '0⟩'//FIX later!
		
		layerGrabbablesEl.appendChild( inputEl )

	})




	const menuEl = document.createElement( 'div' )
	menuEl.classList.add( 'qjs-circuit-menu' )
	layerGrabbablesEl.appendChild( menuEl )

	const momentZeroEl = document.createElement( 'div' )
	momentZeroEl.classList.add( 'qjs-circuit-moment' )
	momentZeroEl.style.gridColumn = 0
	momentZeroEl.innerHTML = 'm<code><strong>0</strong></code>'
	
	layerGrabbablesEl.appendChild( momentZeroEl )


/*	this.moments.forEach( function( moment, m ){

		const momentEl = document.createElement( 'div' )
		momentEl.classList.add( 'qjs-circuit-moment' )
		momentEl.style.gridColumn = ( m + 3 )
		momentEl.innerHTML = 't<code><strong>'+ ( m + 1 ) +'</strong></code>'
		layerGrabbablesEl.appendChild( momentEl )
	})
	*/

	
	table.forEach( function( moment, m ){


		const momentEl = document.createElement( 'div' )
		momentEl.classList.add( 'qjs-circuit-moment' )
		momentEl.style.gridColumn = ( m + 3 )
		momentEl.innerHTML = 'm<code><strong>'+ ( m + 1 ) +'</strong></code>'
		layerGrabbablesEl.appendChild( momentEl )


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


			//  Place an identity gate on every cell
			//  even if it will be overlayed by another gate!

			const identitySvgEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' )
			identitySvgEl.classList.add( 'qjs-circuit-gate' )
			identitySvgEl.setAttribute( 'title', 'Identity' )//  Sadly this needs to be on a DIV to work!!
			identitySvgEl.style.gridRow = ( o + 2 )
			identitySvgEl.style.gridColumn = ( m + 3 )			

			const identityUseEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'use' )
			identityUseEl.setAttributeNS( 'http://www.w3.org/1999/xlink', 'xlink:href', '#qjs-circuit-gate-identity' )
			identityUseEl.classList.add( 'qjs-circuit-gate-identity' )
			identitySvgEl.appendChild( identityUseEl )
			
			layerIdentitiesEl.appendChild( identitySvgEl )


			//  x

			if( operation.nameCss !== 'identity' ){

				const gateEl = document.createElement( 'div' )
				gateEl.setAttribute( 'title', operation.name )
				gateEl.style.gridRow = ( o + 2 )
				gateEl.style.gridColumn = ( m + 3 )

				const gateSvgEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' )
				gateSvgEl.classList.add( 'qjs-circuit-gate' )
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
					// connectionSvgEl.setAttributeNS( 'http://www.w3.org/1999/xlink', 'preserveAspectRatio', 'none' )
					// connectionSvgEl.setAttributeNS( 'http://www.w3.org/1999/xlink', 'width', '100%' )
					// connectionSvgEl.setAttributeNS( 'http://www.w3.org/1999/xlink', 'height', '100%' )
					connectionEl.appendChild( connectionSvgEl )


					const connectionUseEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'use' )					
					connectionUseEl.setAttributeNS( 'http://www.w3.org/1999/xlink', 'xlink:href', '#qjs-circuit-control-'+ connectorType )
					
					// connectionUseEl.setAttributeNS( 'http://www.w3.org/1999/xlink', 'preserveAspectRatio', 'none' )
					// connectionUseEl.setAttributeNS( 'http://www.w3.org/1999/xlink', 'width', '100%' )
					// connectionUseEl.setAttributeNS( 'http://www.w3.org/1999/xlink', 'height', '150%' )
					connectionSvgEl.appendChild( connectionUseEl )
					
					
					layerConnnectionsEl.appendChild( connectionEl )
				})
		})


	})


	// console.log( 'circuitEl?', circuitEl )

	return circuitEl
}







/*


https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API

https://mdn.github.io/dom-examples/drag-and-drop/copy-move-DataTransfer.html

https://mdn.github.io/dom-examples/drag-and-drop/copy-move-DataTransferItemList.html

*/

const
grab = function( event ){
	
	event.preventDefault()
	event.stopPropagation()
	console.log( 'grabbed', event )
},
move = function(){


},
drop = function( event ){

	console.log( 'dropped', event )
},
addEvents = function( el = document.body ){

	Array.from( el.querySelectorAll( '.qjs-circuit-gate' )).forEach( function( el ){

		el.addEventListener( 'mousedown', grab )
		el.addEventListener( 'touchstart', grab )

		el.addEventListener( 'mouseup', drop )
		el.addEventListener( 'touchend', drop )
	})
}




window.addEventListener( 'DOMContentLoaded', function(){

	addEvents()
})







