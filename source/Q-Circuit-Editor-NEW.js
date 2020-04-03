
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

		if( typeof pageOrClient !== 'string' ) pageOrClient = 'client'//page
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






    //////////////////////////
   //                      //
  //   Create interface   //
 //                      //
//////////////////////////


Q.Circuit.Editor.createInterface = function( circuit, targetEl ){

	/*

	+++++
	This needs more carefully thought out.
	Should check to see if the DOM ID already exists, 
	and not overwrite it if it does.

	Same for the JS reference.
	And is it bad to give two options to access the circuit?
	is it better to tie it to the DOM object??
	(even though multiple DOM objects can exist for one circuit?)

	*/

	const
	name = typeof circuit.name === 'string' ? circuit.name : 'circuit-'+ circuit.index,
	domId = name.replace( /^[^a-z]+|[^\w:.-]+/gi, '' ),
	jsReference = 'qjs_'+ name.replace( /^[^a-z]+|[^\w$]+/gi, '' )//  ++++ Seems like a bad idea.


	//  +++++ Seems like a bad idea:
	// console.log( 'jsReference', jsReference )
	// window[ jsReference ] = circuit


	const circuitEl = document.createElement( 'div' )
	circuitEl.classList.add( 'Q-circuit' )
	circuitEl.setAttribute( 'id', domId )
	circuitEl.setAttribute( 'js', jsReference )
	circuitEl.circuit = circuit


	//  How can we interact with this circuit
	//  through code? (How cool is this?!)

	const referenceEl = document.createElement( 'p' )
	circuitEl.appendChild( referenceEl )
	referenceEl.innerHTML = `
		This circuit is accessible via your 
		<a href="index.html#Open_your_JavaScript_console" target="_blank">JavaScript console</a>
		as <code>$('#${ domId }').circuit</code>`


	//  Toolbar.

	const toolbarEl = document.createElement( 'div' )
	circuitEl.appendChild( toolbarEl )
	toolbarEl.classList.add( 'Q-circuit-toolbar' )

	const modeButton = document.createElement( 'div' )
	toolbarEl.appendChild( modeButton )
	modeButton.classList.add( 'Q-circuit-button', 'Q-circuit-button-select-toggle' )
	modeButton.setAttribute( 'title', 'Selection mode' )
	modeButton.innerText = 'S'

	const undoButton = document.createElement( 'div' )
	toolbarEl.appendChild( undoButton )
	undoButton.classList.add( 'Q-circuit-button', 'Q-circuit-button-undo' )
	undoButton.setAttribute( 'title', 'Undo' )
	undoButton.innerHTML = '&larr;'

	const redoButton = document.createElement( 'div' )
	toolbarEl.appendChild( redoButton )
	redoButton.classList.add( 'Q-circuit-button', 'Q-circuit-button-redo' )
	redoButton.setAttribute( 'title', 'Redo' )
	redoButton.innerHTML = '&rarr;'


	//  Create a circuit board container
	//  so we can house a scrollable circuit board.

	const boardContainerEl = document.createElement( 'div' )
	circuitEl.appendChild( boardContainerEl )
	boardContainerEl.classList.add( 'Q-circuit-board-container' )

	const boardEl = document.createElement( 'div' )
	boardContainerEl.appendChild( boardEl )
	boardEl.classList.add( 'Q-circuit-board' )

	const backgroundEl = document.createElement( 'div' )
	boardEl.appendChild( backgroundEl )
	backgroundEl.classList.add( 'Q-circuit-board-background' )


	//++++++ NEED TO ADD IN ARC CONTROL WIRES !!!!!!!!!! HOW ????


	//  Create background highlight bars 
	//  for each row.

	for( let i = 0; i < circuit.bandwidth; i ++ ){

		const rowEl = document.createElement( 'div' )
		backgroundEl.appendChild( rowEl )
		rowEl.style.position = 'relative'
		rowEl.style.gridRowStart = i + 2
		rowEl.style.gridColumnStart = 1
		rowEl.style.gridColumnEnd = Q.Circuit.Editor.momentIndexToGridColumn( circuit.timewidth ) + 1
		rowEl.setAttribute( 'register-index', i + 1 )

		const wireEl = document.createElement( 'div' )
		rowEl.appendChild( wireEl )
		wireEl.classList.add( 'Q-circuit-register-wire' )
	}


	//  Create background highlight bars 
	//  for each column.

	for( let i = 0; i < circuit.timewidth; i ++ ){

		const columnEl = document.createElement( 'div' )
		backgroundEl.appendChild( columnEl )
		columnEl.style.gridRowStart = 2
		columnEl.style.gridRowEnd = Q.Circuit.Editor.registerIndexToGridRow( circuit.bandwidth ) + 1
		columnEl.style.gridColumnStart = i + 3
		columnEl.setAttribute( 'moment-index', i + 1 )
	}


	//  Create the circuit board foreground
	//  for all interactive elements.

	const foregroundEl = document.createElement( 'div' )
	boardEl.appendChild( foregroundEl )
	foregroundEl.classList.add( 'Q-circuit-board-foreground' )


	//  Add a toggle switch for locking the circuit.

	const lockToggle = document.createElement( 'div' )
	foregroundEl.appendChild( lockToggle )
	lockToggle.classList.add( 'Q-circuit-header', 'Q-circuit-toggle', 'Q-circuit-toggle-lock' )
	lockToggle.setAttribute( 'title', 'Lock / unlock' )
	lockToggle.innerText = '🔒'


	//  Add “Select All” toggle button to upper-left corner.

	const selectallEl = document.createElement( 'div' )
	foregroundEl.appendChild( selectallEl )
	selectallEl.classList.add( 'Q-circuit-header', 'Q-circuit-selectall' )	
	selectallEl.setAttribute( 'title', 'Select all' )
	selectallEl.innerHTML = '&searr;'


	//  Add register index labels to left-hand column.
	
	for( let i = 0; i < circuit.bandwidth; i ++ ){

		const 
		registerIndex = i + 1,
		registerLabelEl = document.createElement( 'div' )
		
		foregroundEl.appendChild( registerLabelEl )
		registerLabelEl.classList.add( 'Q-circuit-header', 'Q-circuit-register-label' )
		registerLabelEl.setAttribute( 'title', 'Register '+ registerIndex )
		registerLabelEl.setAttribute( 'register-index', registerIndex )
		registerLabelEl.style.gridRowStart = Q.Circuit.Editor.registerIndexToGridRow( registerIndex )
		registerLabelEl.innerText = registerIndex
	}


	//  Add “Add register” button.
	
	const addRegisterEl = document.createElement( 'div' )
	foregroundEl.appendChild( addRegisterEl )
	addRegisterEl.classList.add( 'Q-circuit-header', 'Q-circuit-register-add' )
	addRegisterEl.setAttribute( 'title', 'Add register' )
	addRegisterEl.style.gridRowStart = Q.Circuit.Editor.registerIndexToGridRow( circuit.bandwidth + 1 )
	addRegisterEl.innerText = '+'


	//  Add moment index labels to top row.

	for( let i = 0; i < circuit.timewidth; i ++ ){

		const 
		momentIndex = i + 1,
		momentLabelEl = document.createElement( 'div' )

		foregroundEl.appendChild( momentLabelEl )
		momentLabelEl.classList.add( 'Q-circuit-header', 'Q-circuit-moment-label' )
		momentLabelEl.setAttribute( 'title', 'Moment '+ momentIndex )
		momentLabelEl.setAttribute( 'moment-index', momentIndex )
		momentLabelEl.style.gridColumnStart = Q.Circuit.Editor.momentIndexToGridColumn( momentIndex )
		momentLabelEl.innerText = momentIndex
	}


	//  Add “Add moment” button.
	
	const addMomentEl = document.createElement( 'div' )
	foregroundEl.appendChild( addMomentEl )
	addMomentEl.classList.add( 'Q-circuit-header', 'Q-circuit-moment-add' )
	addMomentEl.setAttribute( 'title', 'Add moment' )
	addMomentEl.style.gridColumnStart = Q.Circuit.Editor.momentIndexToGridColumn( circuit.timewidth + 1 )
	addMomentEl.innerText = '+'


	//  Add input values.

	circuit.qubits.forEach( function( qubit, i ){

		const 
		rowIndex = i + 1,
		inputEl = document.createElement( 'div' )
		
		inputEl.classList.add( 'Q-circuit-header', 'Q-circuit-input' )
		inputEl.setAttribute( 'title', `Qubit #${ rowIndex } starting value` )
		inputEl.setAttribute( 'register-index', rowIndex )
		inputEl.style.gridRowStart = Q.Circuit.Editor.registerIndexToGridRow( rowIndex )
		inputEl.innerText = qubit.beta.toText()
		foregroundEl.appendChild( inputEl )
	})


	//  Add operations.

	circuit.operations.forEach( function( operation ){

		operation.registerIndices.forEach( function( registerIndex, i ){

			const operationEl = document.createElement( 'div' )
			foregroundEl.appendChild( operationEl )
			operationEl.classList.add( 'Q-circuit-operation', 'Q-circuit-operation-'+ operation.gate.css )
			operationEl.setAttribute( 'moment-index', operation.momentIndex )
			operationEl.setAttribute( 'register-index', registerIndex )
			operationEl.style.gridColumnStart = Q.Circuit.Editor.momentIndexToGridColumn( operation.momentIndex )
			operationEl.style.gridRowStart = Q.Circuit.Editor.registerIndexToGridRow( registerIndex )

			const tileEl = document.createElement( 'div' )
			operationEl.appendChild( tileEl )
			tileEl.classList.add( 'Q-circuit-operation-tile' )
			tileEl.setAttribute( 'title', operation.gate.name )
			tileEl.innerText = operation.gate.label

			if( operation.registerIndices.length > 1 ){

				if( i === 0 ){

					operationEl.classList.add( 'Q-circuit-operation-control' )
					tileEl.setAttribute( 'title', 'Control' )
					tileEl.innerText = ''
				}
				else operationEl.classList.add( 'Q-circuit-operation-target' )
			}
		})
	})


	//  Put a note in the JavaScript console
	//  that includes how to reference the circuit via code
	//  and an ASCII diagram for reference.

	console.log( 

		`\n\nCreated a DOM interface for $('#${ domId }').circuit\n\n`,
		 circuit.toDiagram(),
		'\n\n\n'
	)


	//  If we’ve been passed a target DOM element
	//  we should add a circuit reference to it
	//  and append our circuit element to it.

	if( targetEl instanceof HTMLElement ){

		targetEl.circuit = circuit
		targetEl.appendChild( circuitEl )
	}
	return circuitEl
}
Q.Circuit.toDom = Q.Circuit.Editor.createInterface
Q.Circuit.prototype.toDom = function( targetEl ){

	return Q.Circuit.Editor.createInterface( this, targetEl )
}






    //////////////
   //          //
  //   Move   //
 //          //
//////////////


Q.Circuit.Editor.onMove = function( event ){

	const
	{ x, y } = Q.Circuit.Editor.getInteractionCoordinates( event ),
	boardContainerEl = document.elementsFromPoint( x, y )
	.find( function( el ){

		return el.classList.contains( 'Q-circuit-board-container' )
	})


	//  Are we in the middle of a circuit clipboard drag?
	//  If so we need to move that thing!

	if( Q.Circuit.Editor.dragEl !== null ){

		event.preventDefault()
		

		//  This was a very useful resource
		//  for a reality check on DOM coordinates:
		//  https://javascript.info/coordinates

		Q.Circuit.Editor.dragEl.style.left = ( x + window.pageXOffset + Q.Circuit.Editor.dragEl.offsetX ) +'px'
		Q.Circuit.Editor.dragEl.style.top  = ( y + window.pageYOffset + Q.Circuit.Editor.dragEl.offsetY ) +'px'
	}


	//  If we haven’t found a circuit board cell
	//  then it’s time to go.

	if( !boardContainerEl ) return


	//  Ok, we’ve found a circuit board.
	//  First, un-highlight everything.

	Array.from( boardContainerEl.querySelectorAll(`

		.Q-circuit-board-background > div, 
		.Q-circuit-board-foreground > div
	
	`)).forEach( function( el ){

		el.classList.remove( 'Q-circuit-cell-highlighted' )
	})


	//  Now assess where the mouse hover is.
	
	const
	circuitEl        = boardContainerEl.closest( '.Q-circuit' ),
	boardEl          = boardContainerEl.querySelector( '.Q-circuit-board' ),
	boardElBounds    = boardEl.getBoundingClientRect(),
	xLocal           = x - boardElBounds.left + boardEl.scrollLeft + 1,
	yLocal           = y - boardElBounds.top  + boardEl.scrollTop + 1,
	columnIndex      = Q.Circuit.Editor.pointToGrid( xLocal ),
	rowIndex         = Q.Circuit.Editor.pointToGrid( yLocal ),
	momentIndex      = Q.Circuit.Editor.gridColumnToMomentIndex( columnIndex ),
	registerIndex    = Q.Circuit.Editor.gridRowToRegisterIndex( rowIndex ),
	cellEl           = boardEl.querySelector( `div[moment-index="${ momentIndex }"][register-index="${ registerIndex }"]` ),
	highlightByQuery = function( query ){

		Array.from( boardEl.querySelectorAll( query ))
		.forEach( function( el ){

			el.classList.add( 'Q-circuit-cell-highlighted' )
		})
	}


	//  If this hover is “out of bounds”
	//  ie. on the same row or column as an “Add register” or “Add moment” button
	//  then let’s not highlight anything.

	if( momentIndex > circuitEl.circuit.timewidth ||
		registerIndex > circuitEl.circuit.bandwidth ) return
	

	//  Ok, we have some highlighting to do!

	if( cellEl && !cellEl.classList.contains( 'Q-circuit-operation' )){

		if( cellEl.classList.contains( 'Q-circuit-selectall' )){

			highlightByQuery( '.Q-circuit-operation' )
		}
		else if( cellEl.classList.contains( 'Q-circuit-moment-label' )){

			highlightByQuery( '.Q-circuit-board div[moment-index="'+ momentIndex +'"]' )
		}
		else if( cellEl.classList.contains( 'Q-circuit-register-label' ) ||
			cellEl.classList.contains( 'Q-circuit-input' )){

			highlightByQuery( '.Q-circuit-board div[register-index="'+ registerIndex +'"]' )
		}
	}
	else highlightByQuery( 

		'.Q-circuit-board div[register-index="'+ registerIndex +'"],'+
		'.Q-circuit-board div[moment-index="'+ momentIndex +'"]'
	)
}






    //////////////
   //          //
  //   Exit   //
 //          //
//////////////


Q.Circuit.Editor.onExit = function( event ){

	const circuitEl = event.target.closest( '.Q-circuit' )
	Array.from( circuitEl.querySelectorAll( '.Q-circuit-board-background > div, .Q-circuit-board-foreground > div' ))
	.forEach( function( el ){

		el.classList.remove( 'Q-circuit-cell-highlighted' )
	})
}






    ///////////////
   //           //
  //   Press   //
 //           //
///////////////


Q.Circuit.Editor.onPress = function( event ){


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


	//  This is a bit of a gamble.
	//  There’s a possibility we’re not going to drag anything,
	//  but we’ll prep these variables here anyway
	//  because both branches of if( circuitEl ) and if( paletteEl )
	//  below will have access to this scope.
	
	dragEl = document.createElement( 'div' )
	dragEl.classList.add( 'Q-circuit-clipboard' )
	const { x, y } = Q.Circuit.Editor.getInteractionCoordinates( event )


	//  Are we dealing with a circuit interface?
	//  ie. NOT a palette interface.

	if( circuitEl ){
	

		//  Shall we toggle the circuit lock?

		let circuitIsLocked = circuitEl.classList.contains( 'Q-circuit-locked' )
		const lockEl = targetEl.closest( '.Q-circuit-toggle-lock' )
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


		const
		undoEl = targetEl.closest( '.Q-circuit-button-undo' ),
		redoEl = targetEl.closest( '.Q-circuit-button-redo' ),
		addMomentEl   = targetEl.closest( '.Q-circuit-moment-add' ),
		addRegisterEl = targetEl.closest( '.Q-circuit-register-add' ),
		cellEl = targetEl.closest(`

			.Q-circuit-board-foreground > div,
			.Q-circuit-palette > div
		`)

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


		//  +++++++++++++
		//  Come back and add fuctionality here 
		//  for undo, redo, add !

		if( undoEl ) console.log( '→ Undo' )
		if( redoEl ) console.log( '→ Redo' )
		if( addMomentEl   ) console.log( '→ Add moment' )
		if( addRegisterEl ) console.log( '→ Add register' )


		//  We’re done dealing with external buttons.
		//  So if we can’t find a circuit CELL
		//  then there’s nothing more to do here.

		if( !cellEl ) return


		//  Once we know what cell we’ve pressed on
		//  we can get the momentIndex and registerIndex
		//  from its pre-defined attributes.
		//  NOTE that we are getting CSS grid column and row
		//  from our own conversion function and NOT from
		//  asking its styles. Why? Because browsers convert
		//  grid commands to a shorthand less easily parsable
		//  and therefore makes our code and reasoning 
		//  more prone to quirks / errors. Trust me!

		const
		momentIndex   = +cellEl.getAttribute( 'moment-index' ),
		registerIndex = +cellEl.getAttribute( 'register-index' ),
		columnIndex   = Q.Circuit.Editor.momentIndexToGridColumn( momentIndex ),
		rowIndex      = Q.Circuit.Editor.registerIndexToGridRow( registerIndex )


		//  Looks like our circuit is NOT locked
		//  and we have a valid circuit CELL
		//  so let’s find everything else we could need.

		const
		selectallEl     = targetEl.closest( '.Q-circuit-selectall' ),
		registerLabelEl = targetEl.closest( '.Q-circuit-register-label' ),
		momentLabelEl   = targetEl.closest( '.Q-circuit-moment-label' ),
		inputEl         = targetEl.closest( '.Q-circuit-input' ),
		operationEl     = targetEl.closest( '.Q-circuit-operation' )
		

		//  +++++++++++++++
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

			toggleSelection( `.Q-circuit-operation[moment-index="${ momentIndex }"]` )
			return
		}
		if( registerLabelEl ){

			toggleSelection( `.Q-circuit-operation[register-index="${ registerIndex }"]` )
			return
		}


		//  Right here we can made a big decision:
		//  If you’re not pressing on an operation
		//  then GO HOME.

		if( !operationEl ) return


		//  Similarly, 
		//  if you’re just here deselecting an operation
		//  then deselect it and GO HOME.
		//  +++++++++++
		//  We need to DELAY this toggle-off until after 
		//  a possible drag has occurred!

		if( operationEl.classList.contains( 'Q-circuit-cell-selected' )){

			operationEl.wasSelected = true
			//operationEl.classList.remove( 'Q-circuit-cell-selected' )
			//return
		}
		else {

			operationEl.wasSelected = false
		}


		//  And now we can proceed knowing that 
		//  we need to select this operation
		//  and possibly drag it
		//  as well as any other selected operations.

		operationEl.classList.add( 'Q-circuit-cell-selected' )
		const selectedOperations = Array.from( circuitEl.querySelectorAll( '.Q-circuit-cell-selected' ))		
		dragEl.circuitEl = circuitEl
		dragEl.originEl  = circuitEl.querySelector( '.Q-circuit-board-foreground' )

	
		//  These are the default values; 
		//  will be used if we’re only dragging one operation around.
		//  But if dragging more than one operation
		//  and we’re dragging the clipboard by an operation
		//  that is NOT in the upper-left corner of the clipboard
		//  then we need to know what the offset is.
		// (Will be calculated below.)
		
		dragEl.columnIndexOffset = 1
		dragEl.rowIndexOffset = 1


		//  Now collect all of the selected operations,
		//  rip them from the circuit board’s foreground layer
		//  and place them on the clipboard.
		
		let
		columnIndexMin = Infinity,
		rowIndexMin = Infinity

		selectedOperations.forEach( function( el ){


			//  WORTH REPEATING:
			//  Once we know what cell we’ve pressed on
			//  we can get the momentIndex and registerIndex
			//  from its pre-defined attributes.
			//  NOTE that we are getting CSS grid column and row
			//  from our own conversion function and NOT from
			//  asking its styles. Why? Because browsers convert
			//  grid commands to a shorthand less easily parsable
			//  and therefore makes our code and reasoning 
			//  more prone to quirks / errors. Trust me!

			const
			momentIndex   = +el.getAttribute( 'moment-index' ),
			registerIndex = +el.getAttribute( 'register-index' ),
			columnIndex   = Q.Circuit.Editor.momentIndexToGridColumn( momentIndex ),
			rowIndex      = Q.Circuit.Editor.registerIndexToGridRow( registerIndex )

			columnIndexMin = Math.min( columnIndexMin, columnIndex )
			rowIndexMin = Math.min( rowIndexMin, rowIndex )
			el.classList.remove( 'Q-circuit-cell-selected' )
			el.origin = { momentIndex, registerIndex, columnIndex, rowIndex }
			dragEl.appendChild( el )
		})
		selectedOperations.forEach( function( el ){

			const 
			columnIndexForClipboard = 1 + el.origin.columnIndex - columnIndexMin,
			rowIndexForClipboard    = 1 + el.origin.rowIndex - rowIndexMin
			
			el.style.gridColumn = columnIndexForClipboard
			el.style.gridRow = rowIndexForClipboard


			//  If this operation element is the one we grabbed
			// (mostly relevant if we’re moving multiple operations at once)
			//  we need to know what the “offset” so everything can be
			//  placed correctly relative to this drag-and-dropped item.

			if( el.origin.columnIndex === columnIndex &&
				el.origin.rowIndex === rowIndex ){

				dragEl.columnIndexOffset = columnIndexForClipboard
				dragEl.rowIndexOffset = rowIndexForClipboard
			}
		})
	

		//  We need an XY offset that describes the difference
		//  between the mouse / finger press position
		//  and the clipboard’s intended upper-left position.
		//  To do that we need to know the press position (obviously!),
		//  the upper-left bounds of the circuit board’s foreground,
		//  and the intended upper-left bound of clipboard.

		const
		boardEl = circuitEl.querySelector( '.Q-circuit-board-foreground' ),
		bounds   = boardEl.getBoundingClientRect(),
		minX     = Q.Circuit.Editor.gridToPoint( columnIndexMin ),
		minY     = Q.Circuit.Editor.gridToPoint( rowIndexMin )		
		
		dragEl.offsetX = bounds.left + minX - x
		dragEl.offsetY = bounds.top  + minY - y
		dragEl.momentIndex = momentIndex
		dragEl.registerIndex = registerIndex
	}
	else if( paletteEl ){

		const 
		operationEl = targetEl.closest( '.Q-circuit-operation' ),
		bounds      = operationEl.getBoundingClientRect(),
		{ x, y }    = Q.Circuit.Editor.getInteractionCoordinates( event )

		dragEl.appendChild( operationEl.cloneNode( true ))
		dragEl.originEl = paletteEl
		dragEl.offsetX  = bounds.left - x
		dragEl.offsetY  = bounds.top  - y
	}
	dragEl.timestamp = Date.now()


	//  Append the clipboard to the document,
	//  establish a global reference to it,
	//  and trigger a draw of it in the correct spot.
	
	document.body.appendChild( dragEl )
	Q.Circuit.Editor.dragEl = dragEl
	Q.Circuit.Editor.onMove( event )
}






    /////////////////
   //             //
  //   Release   //
 //             //
/////////////////


Q.Circuit.Editor.onRelease = function( event ){


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
	boardContainerEl = document.elementsFromPoint( x, y )
	.find( function( el ){

		return el.classList.contains( 'Q-circuit-board-container' )
	}),
	returnToOrigin = function(){


		//  We can only do a “true” return to origin
		//  if we were dragging from a circuit.
		//  If we were dragging from a palette
		//  we can just stop dragging.

		if( Q.Circuit.Editor.dragEl.circuitEl ){
		
			Array.from( Q.Circuit.Editor.dragEl.children ).forEach( function( el ){

				Q.Circuit.Editor.dragEl.originEl.appendChild( el )
				el.style.gridColumn = el.origin.columnIndex
				el.style.gridRow    = el.origin.rowIndex
				// el.classList.add( 'Q-circuit-cell-selected' )
				if( el.wasSelected === true ) el.classList.add( 'Q-circuit-cell-selected' )
			})
		}
		document.body.removeChild( Q.Circuit.Editor.dragEl )
		Q.Circuit.Editor.dragEl = null
	}


	//  If we have not dragged on to a circuit board
	//  then we’re throwing away this operation.

	if( !boardContainerEl ){
	

		//+++++++++
		//  We should do a puff of smoke animation here
		//  like removing shit from Apple’s macOS dock!

		document.body.removeChild( Q.Circuit.Editor.dragEl )
		Q.Circuit.Editor.dragEl = null
		return
	}


	//  If we couldn’t determine a circuitEl
	//  from the drop target,
	//  or if there is a target circuit but it’s locked,
	//  then we need to return these dragged items
	//  to their original circuit.

	const circuitEl = boardContainerEl.closest( '.Q-circuit' )
	if( circuitEl.classList.contains( 'Q-circuit-locked' )){

		returnToOrigin()
		return
	}


	//  Time to get serious.
	//  Where exactly are we dropping on to this circuit??

	const 
	bounds      = boardContainerEl.getBoundingClientRect(),
	xAdjusted   = x - bounds.left + boardContainerEl.scrollLeft,
	yAdjusted   = y - bounds.top  + boardContainerEl.scrollTop,
	momentIndex = Q.Circuit.Editor.gridColumnToMomentIndex( 

		Q.Circuit.Editor.pointToGrid( xAdjusted )
	),
	registerIndex = Q.Circuit.Editor.gridRowToRegisterIndex(

		Q.Circuit.Editor.pointToGrid( yAdjusted )
	),
	foregroundEl = circuitEl.querySelector( '.Q-circuit-board-foreground' )


	//  If this is a self-drop
	//  we can also just return to origin and bail.

	if( Q.Circuit.Editor.dragEl.circuitEl === circuitEl &&
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

		let
		momentIndexTarget   = momentIndex, 
		registerIndexTarget = registerIndex
		
		if( Q.Circuit.Editor.dragEl.circuitEl ){

			momentIndexTarget += child.origin.momentIndex - Q.Circuit.Editor.dragEl.momentIndex
			registerIndexTarget += child.origin.registerIndex - Q.Circuit.Editor.dragEl.registerIndex
		}

		const
		columnIndexTarget   = Q.Circuit.Editor.momentIndexToGridColumn( momentIndexTarget )
		rowIndexTarget      = Q.Circuit.Editor.registerIndexToGridRow( registerIndexTarget )

		//  ++++
		//  ADD VALIDATION CODE HERE !!!!!!
		//  if( registerIndex > circuit.bandwidth ) etc.
		//  just do removeChild( child ) and throw it away.
		
		child.setAttribute( 'moment-index', momentIndexTarget )
		child.setAttribute( 'register-index', registerIndexTarget )
		child.style.gridColumn = columnIndexTarget
		child.style.gridRow = rowIndexTarget
		foregroundEl.appendChild( child )
	})


	//  +++
	//  TRIGGER CIRCUIT EVAL HERE!!!
	console.log( 'OK! - trigger an eval on this circuit.' )


	//  If the origina circuit and destination circuit
	//  are not the same thing
	//  then we need to also eval the original circuit.

	if( Q.Circuit.Editor.dragEl.circuitEl !== circuitEl ){

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


	//  Add “on press” listeners to circuits
	//  and to circuit palettes.

	Array.from( document.querySelectorAll( '.Q-circuit, .Q-circuit-palette' ))
	.forEach( function( el ){

		el.addEventListener( 'mousedown',  Q.Circuit.Editor.onPress )
		el.addEventListener( 'touchstart', Q.Circuit.Editor.onPress )
	})

	
	//  Add an “on pointer exit” listener to circuit boards
	//  to un-highlight everything.
	
	Array.from( document.querySelectorAll( '.Q-circuit-board-container' ))
	.forEach( function( el ){

		el.addEventListener( 'mouseleave',  Q.Circuit.Editor.onExit )
	})


	//  Meanwhile these remaining listeners must be applied
	//  to the entire document body.
	
	document.body.addEventListener( 'mousemove',  Q.Circuit.Editor.onMove )
	document.body.addEventListener( 'touchmove', Q.Circuit.Editor.onMove )
	
	document.body.addEventListener( 'mouseup',  Q.Circuit.Editor.onRelease )
	document.body.addEventListener( 'touchend', Q.Circuit.Editor.onRelease )
})





