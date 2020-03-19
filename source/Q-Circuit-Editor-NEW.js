
//  Copyright © 2019–2020, Stewart Smith. See LICENSE for details.




Q.Circuit.Editor = {

	dragEl: null,
	gridColumnToMomentIndex: function( gridColumn  ){ return +gridColumn - 2 },
	momentIndexToGridColumn: function( momentIndex ){ return momentIndex + 2 },
	gridRowToRegisterIndex:  function( gridRow ){ return +gridRow - 1 },
	registerIndexToGridRow:  function( registerIndex ){ return registerIndex + 1 },
	gridSize: 4,//  CSS: grid-auto-columns = grid-auto-rows = 4rem.
	pointToGrid: function( p ){

		
		//  Take a 1-dimensional point value
		// (so either an X or a Y but not both)
		//  and return what CSS grid cell contains it
		//  based on our 4rem × 4rem grid setup.
		
		const rem = parseFloat( getComputedStyle( document.documentElement ).fontSize )
		return 1 + Math.floor( p / ( rem * Q.Circuit.Editor.gridSize ))
	},
	gridToPoint: function( g ){


		//  Take a 1-dimensional grid cell value
		// (so either a row or a column but not both)
		//  and return the minimum point value it contains.

		const  rem = parseFloat( getComputedStyle( document.documentElement ).fontSize )
		return rem * Q.Circuit.Editor.gridSize * ( g - 1 )
	},
	getInteractionCoordinates: function( event, pageOrClient ){

		if( typeof pageOrClient !== 'string' ) pageOrClient = 'page'
		if( event.changedTouches && 
			event.changedTouches.length ) return {

			x: event.changedTouches[ 0 ][ pageOrClient +'X' ],
			y: event.changedTouches[ 0 ][ pageOrClient +'Y' ]
		}
		return {

			x: event[ pageOrClient +'X' ],
			y: event[ pageOrClient +'Y' ]
		}
	}
}






    /////////////////////
   //                 //
  //   Press BEGAN   //
 //                 //
/////////////////////


Q.Circuit.Editor.onPressBegan = function( event ){


	//  This is just a safety net
	//  in case something terrible has ocurred.
	// (ex. Did the user click and then their mouse ran
	//  outside the window but browser didn’t catch it?)

	if( Q.Circuit.Editor.dragEl !== null ){

		Q.Circuit.Editor.onPressEnded( event )
		return
	}


	const 
	targetEl  = event.target,
	circuitEl = targetEl.closest( '.Q-circuit' ),
	paletteEl = targetEl.closest( '.Q-circuit-palette' )


	//  If we can’t find a circuit that’s a really bad sign
	//  considering this event should be fired when a circuit
	//  is clicked on. So... bail!

	if( !circuitEl && !paletteEl ) return


	//  Shall we toggle the circuit lock?

	if( circuitEl ){
	
		let circuitIsLocked = circuitEl.classList.contains( 'Q-circuit-locked' )
		const lockEl = targetEl.closest( '.Q-circuit-button-lock' )
		if( lockEl ){//  If this event was fired on the lock toggle button...

			console.log( '→ Lock toggle' )
			if( circuitIsLocked ) circuitEl.classList.remove( 'Q-circuit-locked' )
			else circuitEl.classList.add( 'Q-circuit-locked' )


			//  We’ve toggled the circuit lock button
			//  so we should prevent further propagation
			//  before proceeding further.
			//  That includes running all this code again
			//  if it was originally fired by a mouse event
			//  and about to be fired by a touch event!

			event.preventDefault()
			event.stopPropagation()
			return
		}


		//  If our circuit is already “locked”
		//  then there’s nothing more to do here.
		
		if( circuitIsLocked ) {

			console.log( 'circuit is LOCKED!' )
			return
		}
	}





	//  +++
	//  Come back and add fuctionality here ;)

	const
	cellEl = targetEl.closest( '.Q-circuit-board-foreground > div' ),
	undoEl = targetEl.closest( '.Q-circuit-button-undo' ),
	redoEl = targetEl.closest( '.Q-circuit-button-redo' ),
	addMomentEl   = targetEl.closest( '.Q-circuit-moment-add' ),
	addRegisterEl = targetEl.closest( '.Q-circuit-register-add' )
	


	if( !cellEl &&
		!undoEl &&
		!redoEl &&
		!addMomentEl &&
		!addRegisterEl ) return


	//  By this point we know that the circuit is unlocked
	//  and that we’ll activate a button / drag event / etc.
	//  So we need to hault futher event propagation
	//  including running this exact code again if this was
	//  fired by a touch event and about to again by mouse.
	//  This may SEEM redundant because we did this above
	//  within the lock-toggle button code
	//  but we needed to NOT stop propagation if the circuit
	//  was already locked -- for scrolling and such.

	event.preventDefault()
	event.stopPropagation()





	if( undoEl ) console.log( '→ Undo' )
	if( redoEl ) console.log( '→ Redo' )
	if( addMomentEl   ) console.log( '→ Add moment' )
	if( addRegisterEl ) console.log( '→ Add register' )


	//  We’re done dealing with external buttons.
	//  So if we can’t find a circuit CELL
	//  then there’s nothing more to do here.

	if( !cellEl ) return


	//  Once we know what cell we’ve pressed on
	//  we can determine its CSS grid column and row,
	//  as well as the corresponding moment and register.

	const
	columnIndex   = +cellEl.style.gridColumnStart,
	rowIndex      = +cellEl.style.gridRowStart,
	momentIndex   = Q.Circuit.Editor.gridColumnToMomentIndex( columnIndex ),
	registerIndex = Q.Circuit.Editor.gridRowToRegisterIndex( rowIndex )


	//  Looks like our circuit is NOT locked
	//  and we have a valid circuit CELL
	//  so let’s find everything else we could need.

	const
	selectallEl     = targetEl.closest( '.Q-circuit-selectall' ),
	registerLabelEl = targetEl.closest( '.Q-circuit-register-label' ),
	momentLabelEl   = targetEl.closest( '.Q-circuit-moment-label' ),
	inputEl         = targetEl.closest( '.Q-circuit-input' ),
	operationEl     = targetEl.closest( '.Q-circuit-operation' )
	

	//  Hmmmm....
	//  We’ll have to add some input editing capability later...
	//  Of course you can already do this in code!
	//  For now though most quantum code assumes all qubits
	//  begin with a value of zero so this is mostly ok ;)

	if( inputEl ){

		console.log( '→ Edit input Qubit value at', registerIndex )
		return
	}


	//  Let’s inspect a group of items via a CSS query.
	//  If any of them are NOT “selected” (highlighted)
	//  then select them all.
	//  But if ALL of them are already selected
	//  then UNSELECT them all.

	function toggleSelection( query ){

		const 
		operations = Array.from( circuitEl.querySelectorAll( query )),
		operationsSelectedLength = operations.reduce( function( sum, element ){

			sum += +element.classList.contains( 'Q-circuit-cell-selected' )
			return sum
		
		}, 0 )

		if( operationsSelectedLength === operations.length ){

			operations.forEach( function( el ){

				el.classList.remove( 'Q-circuit-cell-selected' )
			})
		}
		else {

			operations.forEach( function( el ){

				el.classList.add( 'Q-circuit-cell-selected' )
			})
		}
	}


	//  Clicking on the “selectAll” button
	//  or any of the Moment labels / Register labels
	//  causes a selection toggle.
	//  In the future we may want to add
	//  dragging of entire Moment columns / Register rows
	//  to splice them out / insert them elsewhere
	//  when a user clicks and drags them.

	if( selectallEl ){

		toggleSelection( '.Q-circuit-operation' )
		return
	}
	if( momentLabelEl ){

		toggleSelection( '.Q-circuit-operation[style*="grid-column: '+ 
			Q.Circuit.Editor.momentIndexToGridColumn( momentIndex ) +'"]' )
		return
	}
	if( registerLabelEl ){

		toggleSelection( '.Q-circuit-operation[style*="grid-row: '+ 
			Q.Circuit.Editor.registerIndexToGridRow( registerIndex ) +'"]' )
		return
	}


	//  Right here we can made a big decision:
	//  If you’re not pressing on an operation
	//  then GO HOME.

	if( !operationEl ) return


	//  Similarly, 
	//  if you’re just here deselecting an operation
	//  then deselect it and GO HOME.
	//  +++ 
	//  We need to DELAY this toggle-off until after 
	//  a possible drag has occurred!

	if( operationEl.classList.contains( 'Q-circuit-cell-selected' )){

		operationEl.classList.remove( 'Q-circuit-cell-selected' )
		return
	}


	//  And now we can proceed knowing that 
	//  we need to select this operation
	//  and possibly drag it
	//  as well as any other selected operations.

	operationEl.classList.add( 'Q-circuit-cell-selected' )
	
	const 
	selectedOperations = Array.from( circuitEl.querySelectorAll( '.Q-circuit-cell-selected' )),
	dragEl = document.createElement( 'div' )

	dragEl.classList.add( 'Q-circuit-clipboard' )
	dragEl.origin = {

		circuitEl: circuitEl,
		foregroundEl: circuitEl.querySelector( '.Q-circuit-board-foreground' )
	}

	
	//  These are the default values; 
	//  will be used if we’re only dragging one operation around.
	//  But if dragging more than one operation
	//  and we’re dragging the clipboard by an operation
	//  that is NOT in the upper-left corner of the clipboard
	//  then we need to know what the offset is.
	// (Will be calculated below.)
	
	dragEl.columnOffset = 1
	dragEl.rowOffset = 1


	//  Now collect all of the selected operations,
	//  rip them from the circuit board’s foreground layer
	//  and place them on the clipboard.
	
	let 
	minColumn = Infinity,
	minRow    = Infinity
	
	selectedOperations.forEach( function( el ){


		//  Note here that we must ask for the style’s
		//  grid-column-START and grid-row-START
		//  which is NOT the exact command we added to
		//  each DIV’s style attribute. Strange, eh?
		//  Finding some real CSS grid quirks here.

		let
		column = +el.style.gridColumnStart,
		row    = +el.style.gridRowStart

		minColumn = Math.min( minColumn, column )
		minRow    = Math.min( minRow, row )
		el.classList.remove( 'Q-circuit-cell-selected' )
		el.origin = {

			gridColumn: column,
			gridRow:    row
		}
		dragEl.appendChild( el )
	})
	selectedOperations.forEach( function( el ){


		//  THIS IS INTENSE so pay attention.
		//  We CANNOT use the following syntax:
		//    el.style.gridColumn = el.origin.gridColumn
		//    el.style.gridRow    = el.origin.gridRow
		//  Why? Because the browser will CONVERT IT
		//  to the short “grid-area” syntax
		//  and we will then be unable to search by
		//  either grid-column or grid-row!
		//  So instead we must pretend we are just
		//  adding styles to a DIV by hand:

		const 
		gridColumnForClipboard = 1 + el.origin.gridColumn - minColumn,
		gridRowForClipboard    = 1 + el.origin.gridRow - minRow

		el.setAttribute( 

			'style', 
			`grid-column: ${gridColumnForClipboard}; grid-row: ${gridRowForClipboard};` 
		)


		//  If this operation element is the one we grabbed
		// (mostly relevant if we’re moving multiple operations at once)
		//  we need to know what the “offset” so everything can be
		//  placed correctly relative to this drag-and-dropped item.

		if( el.origin.gridColumn === columnIndex &&
			el.origin.gridRow === rowIndex ){

			dragEl.columnOffset = gridColumnForClipboard
			dragEl.rowOffset = gridRowForClipboard
		}
	})


	//  We need an XY offset that describes the difference
	//  between the mouse / finger press position
	//  and the clipboard’s intended upper-left position.
	//  To do that we need to know the press position (obviously!),
	//  the upper-left bounds of the circuit board’s foreground,
	//  and the intended upper-left bound of clipboard.

	const
	foregroundEl = circuitEl.querySelector( '.Q-circuit-board-foreground' ),
	bounds   = foregroundEl.getBoundingClientRect(),
	minX     = Q.Circuit.Editor.gridToPoint( minColumn ),
	minY     = Q.Circuit.Editor.gridToPoint( minRow ),
	{ x, y } = Q.Circuit.Editor.getInteractionCoordinates( event, 'client' )
	
	dragEl.offsetX = bounds.left + minX - x
	dragEl.offsetY = bounds.top  + minY - y
	dragEl.momentIndex = momentIndex
	dragEl.registerIndex = registerIndex
	dragEl.timestamp = Date.now()


	//  Append the clipboard to the document,
	//  establish a global reference to it,
	//  and trigger a draw of it in the correct spot.
	
	document.body.appendChild( dragEl )
	Q.Circuit.Editor.dragEl = dragEl
	Q.Circuit.Editor.onDragged( event )
}






    /////////////////
   //             //
  //   Hovered   //
 //             //
/////////////////


Q.Circuit.Editor.onHovered = function( event ){


	//  First, un-highlight everything.

	const 
	circuitEl = event.target.closest( '.Q-circuit' )
	foregroundEl = event.target.closest( '.Q-circuit-board-foreground' )
	
	Array.from( circuitEl.querySelectorAll( '.Q-circuit-board-foreground > div' ))
	.forEach( function( el ){

		el.classList.remove( 'Q-circuit-cell-highlighted' )
	})


	//  Now assess where the mouse hover is.
	
	let { x, y } = Q.Circuit.Editor.getInteractionCoordinates( event, 'client' )
	const bounds = foregroundEl.getBoundingClientRect()
	x -= bounds.left
	y -= bounds.top


	//  From that information we can gleen
	//  other relevant coordinate data.

	const
	columnIndex   = Q.Circuit.Editor.pointToGrid( x ),
	rowIndex      = Q.Circuit.Editor.pointToGrid( y ),
	momentIndex   = Q.Circuit.Editor.gridColumnToMomentIndex( columnIndex ),
	registerIndex = Q.Circuit.Editor.gridRowToRegisterIndex( rowIndex ),
	cellEl        = event.target.closest( '.Q-circuit-board-foreground > div' ),
	highlightByQuery = function( query ){

		Array.from( circuitEl.querySelectorAll( query ))
		.forEach( function( el ){

			el.classList.add( 'Q-circuit-cell-highlighted' )
		})
	}



	if( cellEl && !cellEl.classList.contains( 'Q-circuit-operation' )){

		if( cellEl.classList.contains( 'Q-circuit-selectall' )){

			highlightByQuery( '.Q-circuit-operation' )
		}
		else if( cellEl.classList.contains( 'Q-circuit-moment-label' )){

			highlightByQuery( '.Q-circuit-board-foreground > div[style*="grid-column: '+ columnIndex +';"]' )
		}
		else if( cellEl.classList.contains( 'Q-circuit-register-label' ) ||
			cellEl.classList.contains( 'Q-circuit-input' )){

			highlightByQuery( '.Q-circuit-board-foreground > div[style*="grid-row: '+ rowIndex +';"]' )
		}
	}
	else highlightByQuery( 

		'.Q-circuit-header[style*="grid-column: '+ columnIndex +';"], '+
		'.Q-circuit-header[style*="grid-row: '+ rowIndex +';"]'
	)
}
Q.Circuit.Editor.onMouseExit = function( event ){

	const circuitEl = event.target.closest( '.Q-circuit' )
	Array.from( circuitEl.querySelectorAll( '.Q-circuit-board-foreground > div' ))
	.forEach( function( el ){

		el.classList.remove( 'Q-circuit-cell-highlighted' )
	})
}






    /////////////////
   //             //
  //   Dragged   //
 //             //
/////////////////


Q.Circuit.Editor.onDragged = function( event ){

	if( Q.Circuit.Editor.dragEl !== null ){

		event.preventDefault()
		// event.stopPropagation()


		//  This was a very useful resource
		//  for a reality check on DOM coordinates:
		//  https://javascript.info/coordinates

		const { x, y } = Q.Circuit.Editor.getInteractionCoordinates( event )
		Q.Circuit.Editor.dragEl.style.left = ( x + Q.Circuit.Editor.dragEl.offsetX ) +'px'
		Q.Circuit.Editor.dragEl.style.top  = ( y + Q.Circuit.Editor.dragEl.offsetY ) +'px'
	}
}






    /////////////////////
   //                 //
  //   Press ENDED   //
 //                 //
/////////////////////


Q.Circuit.Editor.onPressEnded = function( event ){


	//  If there’s no dragEl then bail immediately.

	if( Q.Circuit.Editor.dragEl === null ) return
	

	//  Looks like we’re moving forward with this plan,
	//  so we’ll take control of the input now.

	event.preventDefault()
	event.stopPropagation()


	//  We can’t get the drop target from the event.
	//  Think about it: What was under the mouse / finger
	//  when this drop event was fired? THE CLIPBOARD !
	//  So instead we need to peek at what elements are
	//  under the mouse / finger, skipping element [0]
	//  because that will be the clipboard.

	const
	{ x, y } = Q.Circuit.Editor.getInteractionCoordinates( event ),
	circuitEl = document.elementsFromPoint( 

		x - window.pageXOffset, 
		y - window.pageYOffset

	).find( function( el ){

		return el.classList.contains( 'Q-circuit' )
	}),
	returnToOrigin = function(){

		Array.from( Q.Circuit.Editor.dragEl.children ).forEach( function( el ){

			Q.Circuit.Editor.dragEl.origin.foregroundEl.appendChild( el )
		
			
			//  THIS IS INTENSE so pay attention.
			//  We CANNOT use the following syntax:
			//    el.style.gridColumn = el.origin.gridColumn
			//    el.style.gridRow    = el.origin.gridRow
			//  Why? Because the browser will CONVERT IT
			//  to the short “grid-area” syntax
			//  and we will then be unable to search by
			//  either grid-column or grid-row!
			//  So instead we must pretend we are just
			//  adding styles to a DIV by hand:

			el.setAttribute( 

				'style', 
				`grid-column: ${el.origin.gridColumn}; grid-row: ${el.origin.gridRow};` 
			)
			el.classList.add( 'Q-circuit-cell-selected' )
		})
		document.body.removeChild( Q.Circuit.Editor.dragEl )
		Q.Circuit.Editor.dragEl = null
	}


	//  If we couldn’t determine a circuitEl
	//  from the drop target,
	//  or if there is a target circuit but it’s locked,
	//  then we need to return these dragged items
	//  to their original circuit.

	if( !circuitEl || circuitEl.classList.contains( 'Q-circuit-locked' )){

		returnToOrigin()
		return
	}


	//  Time to get serious.
	//  Where exactly are we dropping on to this circuit??

	const 
	boardEl = circuitEl.querySelector( '.Q-circuit-board-container' ),
	bounds = boardEl.getBoundingClientRect(),
	xAdjusted = boardEl.scrollLeft + x - window.pageXOffset - bounds.left,
	yAdjusted = boardEl.scrollTop  + y - window.pageYOffset - bounds.top,
	momentIndex = Q.Circuit.Editor.gridColumnToMomentIndex( 

		Q.Circuit.Editor.pointToGrid( xAdjusted )
	),
	registerIndex = Q.Circuit.Editor.gridRowToRegisterIndex(

		Q.Circuit.Editor.pointToGrid( yAdjusted )
	),
	foregroundEl = circuitEl.querySelector( '.Q-circuit-board-foreground' )


	//  If this is a self-drop
	//  we can also just return to origin and bail.

	if( Q.Circuit.Editor.dragEl.origin.circuitEl === circuitEl &&
		Q.Circuit.Editor.dragEl.momentIndex === momentIndex &&
		Q.Circuit.Editor.dragEl.registerIndex === registerIndex ){

		returnToOrigin()
		return
	}


	//  Is this a valid drop target within this circuit?
	//  +++ need to also calculate max momentIndex and max registerIndex.

	if( momentIndex < 1 || registerIndex < 1 ){

		returnToOrigin()
		return
	}
	

	//  Finally! Work is about to be done!
	//  Let’s place these dragged operations
	//  where they need to go on the circuit board.

	Array
	.from( Q.Circuit.Editor.dragEl.children )
	.forEach( function( child ){

		const
		droppedAtColumn   = Q.Circuit.Editor.momentIndexToGridColumn( momentIndex ),
		gridColumnTarget  = droppedAtColumn + +child.style.gridColumnStart - Q.Circuit.Editor.dragEl.columnOffset,
		droppedAtRegister = Q.Circuit.Editor.registerIndexToGridRow( registerIndex ),
		gridRowTarget     = droppedAtRegister + +child.style.gridRowStart - Q.Circuit.Editor.dragEl.rowOffset


		//  ++++
		//  ADD VALIDATION CODE HERE !!!!!!
		//  if( registerIndex > circuit.bandwidth ) etc.
		//  just do removeChild( child ) and throw it away.
		

		child.setAttribute(

			'style', 
			`grid-column: ${gridColumnTarget}; grid-row: ${gridRowTarget};` 
		)
		foregroundEl.appendChild( child )
	})


	//  +++
	//  TRIGGER CIRCUIT EVAL HERE!!!
	console.log( 'OK! - trigger an eval on this circuit.' )


	//  If the origina circuit and destination circuit
	//  are not the same thing
	//  then we need to also eval the original circuit.

	if( Q.Circuit.Editor.dragEl.origin.circuitEl !== circuitEl ){

		//  +++
		//  TRIGGER CIRCUIT EVAL HERE!!!
		console.log( 'ALSO - trigger an eval on the original circuit.' )
	}


	//  We’re finally done here.
	//  Clean up and go home.

	document.body.removeChild( Q.Circuit.Editor.dragEl )
	Q.Circuit.Editor.dragEl = null
}






    ///////////////////
   //               //
  //   Listeners   //
 //               //
///////////////////


window.addEventListener( 'DOMContentLoaded', function( event ){


	//  Add “on press began” and “on hovered” event listeners
	//  to each intractive circuit diagram.

	Array.from( document.querySelectorAll( '.Q-circuit, .Q-circuit-palette' ))
	.forEach( function( el ){

		el.addEventListener( 'mousedown',  Q.Circuit.Editor.onPressBegan )
		el.addEventListener( 'touchstart', Q.Circuit.Editor.onPressBegan )
	})
	Array.from( document.querySelectorAll( '.Q-circuit-board-foreground' ))
	.forEach( function( el ){

		el.addEventListener( 'mousemove',  Q.Circuit.Editor.onHovered )
		el.addEventListener( 'mouseleave',  Q.Circuit.Editor.onMouseExit )
		el.addEventListener( 'touchmove',  Q.Circuit.Editor.onHovered )
	})


	//  Meanwhile, “on dragged” and “on press ended” event listeners
	//  must be added to the whole document body.
	
	document.body.addEventListener( 'mousemove',  Q.Circuit.Editor.onDragged )
	document.body.addEventListener( 'touchmove', Q.Circuit.Editor.onDragged )
	document.body.addEventListener( 'mouseup',  Q.Circuit.Editor.onPressEnded )
	document.body.addEventListener( 'touchend', Q.Circuit.Editor.onPressEnded )
})





