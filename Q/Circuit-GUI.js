


Q.Circuit.prototype.toDom = function(){

	const 
	circuit = this,
	table = this.toTable()

	const circuitEl = document.createElement( 'div' )
	circuitEl.classList.add( 'qjs-circuit' )

	const backgroundEl = document.createElement( 'div' )
	backgroundEl.classList.add( 'qjs-circuit-background-layer' )
	
	const connnectionsEl = document.createElement( 'div' )
	connnectionsEl.classList.add( 'qjs-circuit-connections-layer' )
	circuitEl.appendChild( connnectionsEl )
	//  <div style="grid-row: 2; grid-column: 4;"><svg><use xlink:href="#qjs-circuit-control-straight"/></svg></div>

	const grabablesEl = document.createElement( 'div' )
	grabablesEl.classList.add( 'qjs-circuit-grabables-layer' )




	this.inputs.forEach( function( input, i ){

		const wireEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' )
		wireEl.classList.add( 'qjs-circuit-wire' )
		const useEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'use' )
		useEl.setAttributeNS( 'http://www.w3.org/1999/xlink', 'xlink:href', '#qjs-circuit-wire' )
		wireEl.appendChild( useEl )
		wireEl.style.gridRow = ( i + 1 )
		// wireEl.style.gridColumnEnd = ( circuit.timewidth + 2 )
		backgroundEl.appendChild( wireEl )
	
		const qubitEl = document.createElement( 'div' )
		qubitEl.classList.add( 'qjs-circuit-qubit' )
		qubitEl.style.gridRow = ( i + 2 )
		qubitEl.innerHTML = 'q<code><strong>'+ i +'</strong></code>'
		grabablesEl.appendChild( qubitEl )

		const inputEl = document.createElement( 'div' )
		inputEl.classList.add( 'qjs-circuit-input' )
		inputEl.style.gridRow = ( i + 2 )
		inputEl.innerHTML = '0⟩'//FIX later!
		grabablesEl.appendChild( inputEl )

	})
	circuitEl.appendChild( backgroundEl )




	const menuEl = document.createElement( 'div' )
	menuEl.classList.add( 'qjs-circuit-menu' )
	grabablesEl.appendChild( menuEl )

	const momentZeroEl = document.createElement( 'div' )
	momentZeroEl.classList.add( 'qjs-circuit-moment' )
	momentZeroEl.style.gridColumn = 0
	momentZeroEl.innerHTML = 't<code><strong>0</strong></code>'
	grabablesEl.appendChild( momentZeroEl )

	this.moments.forEach( function( moment, m ){

		const momentEl = document.createElement( 'div' )
		momentEl.classList.add( 'qjs-circuit-moment' )
		momentEl.style.gridColumn = ( m + 3 )
		momentEl.innerHTML = 't<code><strong>'+ ( m + 1 ) +'</strong></code>'
		grabablesEl.appendChild( momentEl )
	})
	

	table.forEach( function( moment, m ){

		moment.forEach( function( operation, o ){


			//  Background.

			const wireSvgEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' )
			wireSvgEl.classList.add( 'qjs-circuit-wire' )
			const wireUseEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'use' )
			wireUseEl.setAttributeNS( 'http://www.w3.org/1999/xlink', 'xlink:href', '#qjs-circuit-wire' )
			wireSvgEl.appendChild( wireUseEl )
			wireSvgEl.style.gridRow = ( o + 2 )
			wireSvgEl.style.gridColumn = ( m + 3 )
			backgroundEl.appendChild( wireSvgEl )



			const gateEl = document.createElement( 'div' )
			gateEl.style.gridRow = ( o + 2 )
			gateEl.style.gridColumn = ( m + 3 )

			const gateSvgEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' )
			gateSvgEl.classList.add( 'qjs-circuit-gate' )
			gateEl.appendChild( gateSvgEl )

console.log( operation.nameCss )

			const useEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'use' )
			useEl.setAttributeNS( 'http://www.w3.org/1999/xlink', 'xlink:href', '#qjs-circuit-gate-'+ operation.nameCss )
			gateSvgEl.appendChild( useEl )

			grabablesEl.appendChild( gateEl )
		})
	})

	circuitEl.appendChild( grabablesEl )
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







