const {Q, Circuit, Qubit, Matrix, ComplexNumber, mathf, misc, logger} = require('quantum-js-util');
const {Editor} = require('quantum-js-vis');
const Window = require('window');
if(window == undefined) var window = new Window();
console.log("Howdy!");

//Augment the circuit class to have the ability to create Editors based on them.
Circuit.toDom = function( circuit, targetEl ){

	return new Editor( circuit, targetEl ).domElement
}
Circuit.prototype.toDom = function( targetEl ){

	return new Editor( this, targetEl ).domElement
}

//Function that injects a new Editor into a PythonNotebook (if called inside the Notebook)
braketNotebookEditor = function(){
	//  Create the HTML bits we need,
	//  contain them all together,
	//  and output them to Jupyter.
	if( arguments.length === 0 || arguments.length > 3 ) return;
	const element = arguments[0];
	const args = (Array.from(arguments)).slice(1);
	let circuit
	if(args.length === 0) {
		circuit = new Q( 4, 8 )
	}
	else if(args.length === 1) {
		circuit = new Q( args[0] )
	}
	else { 
		circuit = new Q( args[0], args[1] )
	}
	container = document.createElement( 'div' )
	container.appendChild( Editor.createPalette() )
	container.appendChild( circuit.toDom() )
	element.html( container )
	//  Weâ€™re going to take this SLOOOOOOOOWLY
	//  because there are many potential things to debug.

	const thisCell = Jupyter.notebook.get_selected_cell()
	// console.log( 'thisCell', thisCell )
	
	const thisCellIndex = Jupyter.notebook.get_cells().indexOf( thisCell )
	// console.log( 'thisCellIndex', thisCellIndex )

	const nextCell = Jupyter.notebook.insert_cell_below( 'code', thisCellIndex - 1 )
	const nextNextCell = Jupyter.notebook.insert_cell_below( 'markdown', Jupyter.notebook.get_cells().indexOf( thisCell ) - 1 )
	// console.log( 'nextCell', nextCell )

	nextCell.set_text( circuit.toAmazonBraket() )
	nextNextCell.set_text( circuit.report$() )
	window.addEventListener( 'Q gui altered circuit', function( event ){

		// updatePlaygroundFromDom( event.detail.circuit )
		if( event.detail.circuit === circuit ){
			
			console.log( 'Updating circuit from GUI', circuit )
			circuit.evaluate$()
			nextCell.set_text( circuit.toAmazonBraket() )

		}
	})

	window.addEventListener( 'Circuit.evaluate completed', function( event ) {
		if( event.detail.circuit === circuit ) {
			nextNextCell.set_text( circuit.report$() ) 
		}
	})


	// nextCell.render()

	// console.log( 'thisCell', thisCell )
	// console.log( 'nextCell', nextCell )
	// console.log( 'thisCellIndex', thisCellIndex )

	// code = Jupyter.notebook.insert_cell_{0}('code');
	// code.set_text(atob("{1}"))

	// var t_cell = Jupyter.notebook.get_selected_cell()
	// t_cell.set_text('<!--\\n' + t_cell.get_text() + '\\n--> \\n{}')
	// var t_index = Jupyter.notebook.get_cells().indexOf(t_cell)
	// Jupyter.notebook.to_markdown(t_index)
	// Jupyter.notebook.get_cell(t_index).render()
}
module.exports = {Q, Circuit, Qubit, Gate, Matrix, ComplexNumber, mathf, misc, logger, Editor};