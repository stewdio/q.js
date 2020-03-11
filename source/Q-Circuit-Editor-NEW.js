
//  Copyright © 2019–2020, Stewart Smith. See LICENSE for details.




Q.Circuit.Editor = {

	dragObject: null,
	gridColumnToMomentIndex: function( gridColumn  ){ return +gridColumn - 2 },
	momentIndexToGridColumn: function( momentIndex ){ return momentIndex + 2 },
	gridRowToRegisterIndex:  function( gridRow ){ return +gridRow - 1 },
	registerIndexToGridRow:  function( registerIndex ){ return registerIndex + 1 }
}



Q.Circuit.Editor.onPressBegan = function( event ){


	//  This is just a safety net
	//  in case something terrible has ocurred.
	// (ex. Did the user click and then their mouse ran
	//  outside the window but browser didn’t catch it?)

	if( Q.Circuit.Editor.dragObject !== null ){

		Q.Circuit.Editor.onPressEnded( event )
		return
	}


	//  Now we can begin getting down to business.

	event.preventDefault()
	event.stopPropagation()

	const 
	targetEl  = event.target,
	circuitEl = targetEl.closest( '.Q-circuit' )


	//  If we can’t find a circuit that’s a really bad sign
	//  considering this event should be fired when a circuit
	//  is clicked on. So... bail!

	if( !circuitEl ) return


	//  If our user is drawing a selection box
	//  we should calculate this first click point.
	// (Will come back to this idea later...?)

	const 
	x = event.offsetX + circuitEl.scrollLeft,
	y = event.offsetY + circuitEl.scrollTop


	//  Shall we toggle the circuit lock?

	let circuitIsLocked = circuitEl.classList.contains( 'Q-circuit-locked' )
	const lockEl = targetEl.closest( '.Q-circuit-button-lock' )
	if( lockEl ){

		console.log( '→ Lock toggle' )
		if( circuitIsLocked ) circuitEl.classList.remove( 'Q-circuit-locked' )
		else circuitEl.classList.add( 'Q-circuit-locked' )
		return
	}


	//  If our circuit is already “locked”
	//  then there’s nothing more to do here.
	
	if( circuitIsLocked ) {

		console.log( 'circuit is LOCKED!' )
		return
	}


	//  +++
	//  Come back and add fuctionality here ;)

	const
	undoEl = targetEl.closest( '.Q-circuit-button-undo' ),
	redoEl = targetEl.closest( '.Q-circuit-button-redo' ),
	addMomentEl   = targetEl.closest( '.Q-circuit-button-add-moment' ),
	addRegisterEl = targetEl.closest( '.Q-circuit-button-add-register' )

	if( undoEl ) console.log( '→ Undo' )
	if( redoEl ) console.log( '→ Redo' )
	if( addMomentEl   ) console.log( '→ Add moment' )
	if( addRegisterEl ) console.log( '→ Add register' )


	//  We’re done dealing with external buttons.
	//  So if we can’t find a circuit CELL
	//  then there’s nothing more to do here.

	const cellEl = targetEl.closest( '.Q-circuit-cell' )
	if( !cellEl ) return


	//  Looks like our circuit is NOT locked
	//  and we have a valid circuit CELL
	//  so let’s find everything else we could need.

	const
	selectallEl     = targetEl.closest( '.Q-circuit-selectall' ),
	registerLabelEl = targetEl.closest( '.Q-circuit-register-label' ),
	momentLabelEl   = targetEl.closest( '.Q-circuit-moment-label' ),
	inputEl         = targetEl.closest( '.Q-circuit-input' ),
	operationEl     = targetEl.closest( '.Q-circuit-operation' ),
	momentIndex     = Q.Circuit.Editor.gridColumnToMomentIndex( cellEl.style.gridColumnStart ),
	registerIndex   = Q.Circuit.Editor.gridRowToRegisterIndex(  cellEl.style.gridRowStart )
	

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
	dragObject = document.createElement( 'div' )

	dragObject.circuitEl     = circuitEl
	dragObject.momentIndex   = momentIndex
	dragObject.registerIndex = registerIndex
	dragObject.classList.add( 'Q-circuit-clipboard' )
	selectedOperations.forEach( function( el ){

		el.classList.remove( 'Q-circuit-cell-selected' )
		dragObject.appendChild( el )
	})
	document.body.appendChild( dragObject )
	console.log( dragObject )
	Q.Circuit.Editor.dragObject = dragObject
}




Q.Circuit.Editor.onMoved = function( event ){

	if( Q.Circuit.Editor.dragObject !== null ){


		// https://javascript.info/coordinates


		// console.log( event.pageX )

		Q.Circuit.Editor.dragObject.style.left = event.pageX +'px'
		Q.Circuit.Editor.dragObject.style.top  = event.pageY +'px'
	}
}




Q.Circuit.Editor.onPressEnded = function( event ){


	//  If there’s no dragObject then bail immediately.
	//  Otherwise let’s get to business.

	if( Q.Circuit.Editor.dragObject === null ) return
	event.preventDefault()
	event.stopPropagation()

	
	//  We can’t get the drop target from the event.
	//  Think about it: What was under the mouse / finger
	//  when this drop event was fired? THE CLIPBOARD !
	//  So instead we need to peek at what elements are
	//  under the mouse / finger, skipping element [0]
	//  because that will be the clipboard.

	const 
	targetEl = document.elementsFromPoint( 

		event.pageX - window.pageXOffset, 
		event.pageY - window.pageYOffset

	)[ 1 ],
	circuitEl = targetEl.closest( '.Q-circuit' ),
	returnToOrigin = function(){

		


		//  +++
		//  Need to return these dropped elements to their origin !
		



		document.body.removeChild( Q.Circuit.Editor.dragObject )
		Q.Circuit.Editor.dragObject = null
	}


	//  If we couldn’t determine a circuitEl
	//  from the drop target
	//  then we need to return these dragged items
	//  to their original circuit.

	if( !circuitEl ){

		returnToOrigin()
		return
	}

	const 
	bounds = circuitEl.getBoundingClientRect(),
	x = circuitEl.scrollLeft + event.pageX - window.pageXOffset - bounds.left,
	y = circuitEl.scrollTop  + event.pageY - window.pageYOffset - bounds.top,
	rem = parseFloat( getComputedStyle( document.documentElement ).fontSize ),
	gridSize = 4,//  CSS: grid-auto-columns = grid-auto-rows = 4rem.
	pointToGrid = function( p ){

		return 1 + Math.floor( p / ( rem * gridSize ))
	},
	momentIndex   = Q.Circuit.Editor.gridColumnToMomentIndex( pointToGrid( x )),
	registerIndex = Q.Circuit.Editor.gridRowToRegisterIndex( pointToGrid( y )),
	foregroundEl  = circuitEl.querySelector( '.Q-circuit-board-foreground' )


	//  Is this a valid drop target within this circuit?
	//  +++ need to also calculate max momentIndex and max registerIndex.

	if( momentIndex < 1 || registerIndex < 1 ){

		returnToOrigin()
		return
	}


	//  If this is a self-drop
	//  we can also just return to origin and bail.

	if( Q.Circuit.Editor.dragObject.circuitEl === circuitEl &&
		Q.Circuit.Editor.dragObject.momentIndex === momentIndex &&
		Q.Circuit.Editor.dragObject.registerIndex === registerIndex ){

		returnToOrigin()
		return
	}
	

	//  Finally! Work is about to be done!

	console.log( 'we need to trigger a new circuit eval and update outputs' )

	Array.from( Q.Circuit.Editor.dragObject.children )
	.forEach( function( child ){



		// +++
		//  we need to offset the momentIndex and registerIndex!



		child.classList.add( 'Q-circuit-cell-selected' )
		foregroundEl.appendChild( child )
	})


	//  We’re finally done here.
	//  Clean up and go home.

	document.body.removeChild( Q.Circuit.Editor.dragObject )
	Q.Circuit.Editor.dragObject = null
}




const mySampleCircuit = document.getElementById( 'my-sample-circuit' )
mySampleCircuit.addEventListener( 'mousedown',  Q.Circuit.Editor.onPressBegan )
mySampleCircuit.addEventListener( 'touchstart', Q.Circuit.Editor.onPressBegan )

document.body.addEventListener( 'mousemove',  Q.Circuit.Editor.onMoved )
document.body.addEventListener( 'touchmove', Q.Circuit.Editor.onMoved )

document.body.addEventListener( 'mouseup',  Q.Circuit.Editor.onPressEnded )
document.body.addEventListener( 'touchend', Q.Circuit.Editor.onPressEnded )



