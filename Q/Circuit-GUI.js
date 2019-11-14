







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







