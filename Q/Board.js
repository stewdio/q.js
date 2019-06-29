



Q.Node = function( x, y, z ){

	this.x = x
	this.y = y
	this.z = z
	this.gate = Q.Gate.IDENTITY
	this.inputs  = []
	this.outputs = []
}
Q.Board = function( rowSetup, resolveNext ){

	this.rows = rowSetup()
	this.resolveNext = resolveNext()

	this.domElement = document.createElement( 'div' )
	this.domElement.classList.add( 'q-board' )
}
Q.Board.prototype.addGate = function( position, gate ){
	
	let { x, y, z } = position
	if( x === undefined ) x = 0
	if( y === undefined ) y = 0
	if( z === undefined ) z = 0
	this.rows[ y ][ x ][ z ].gate = gate
}
Q.Board.prototype.run = function(){

	const output = []


	// return this.gates.reduce( function( state, gate ){

	// 	return gate.applyTo( state )

	// }, Q.Qubit.HORIZONTAL )


	//if( outputs.length === 0 ){}
	const nextAddress = this.resolveNext()

}




Q.Board.prototype.toText = function(){

	return this.rows.reduce( function( text, row ){ 

		return text +'\n'+ row.reduce( function( text, col ){

			const node = col[ 0 ]//  Just pretending everything is 2D for now...
			return text +'-'+ node.gate.label +'-'

		}, '' )

	}, '' )
}
Q.Board.prototype.toDiagram = function(){

	return this.rows.reduce( function( rowText, row ){ 

		rowText += row.reduce( function( nodeText, col ){

			const node = col[ 0 ]//  Just pretending everything is 2D for now...
			return ( nodeText + (( node.gate === Q.Gate.IDENTITY )
				
				? '     '
				: '┌───┐' )
			)

		}, '\n    ' ) +' '
		rowText += row.reduce( function( nodeText, col ){

			const node = col[ 0 ]
			return ( nodeText + (( node.gate === Q.Gate.IDENTITY )
				
				? '──○──'
				: '┤ '+ node.gate.label +' ├' )
			)

		}, '\n|0⟩─' ) +'─'
		rowText += row.reduce( function( nodeText, col ){

			const node = col[ 0 ]
			return ( nodeText + (( node.gate === Q.Gate.IDENTITY )
				
				? '     '
				: '└───┘' )
			)

		}, '\n    ' ) +' '
		return rowText//.substr( 1 )

	}, '' )
}





/*


|0⟩ ───○────○────○────○────○────○───

     ┌───┐┌───┐          ┌───┐╭───╮
|0⟩ ─┤ H ├┤   ├──○────○──┤ M ├┤ B ├─
     └───┘│ C │          └───┘╰───╯
     ┌───┐│   │          ┌───┐╭───╮
|0⟩ ─┤ X ├┤   ├──○────○──┤ M ├┤ B ├─
     └───┘└───┘          └───┘╰───╯

|0⟩ ───○────○────○────○────○────○───


|0⟩ ───○────○────○────○────○────○───




*/



var simple5x5 = new Q.Board( function(){

	const rows = []	
	for( let y = 0; y < 5; y ++ ){

		const cols = []
		for( let x = 0; x < 5; x ++ ){

			const stack = []
			for( let z = 0; z < 5; z ++ ){
			
				stack.push( new Q.Node( x, y, 0 ))
			}
			cols.push( stack )
		}
		rows.push( cols )
	}
	return rows

}, function( x, y, z ){

	return { x: x + 1, y, z }
})
simple5x5.addGate({ x: 0, y: 0 }, Q.Gate.PAULI_X )
simple5x5.addGate({ x: 0, y: 1 }, Q.Gate.PAULI_X )
simple5x5.addGate({ x: 0, y: 2 }, Q.Gate.PAULI_X )
simple5x5.addGate({ x: 2, y: 3 }, Q.Gate.HADAMARD )
simple5x5.addGate({ x: 4, y: 2 }, Q.Gate.PHASE )







/*



https://en.wikipedia.org/wiki/List_of_quantum_processors




simple 5 x 2 board:


|0⟩ -- 1 -- 2 -- 3 -- M

|0⟩ -- 1 -- 2 -- 3 -- M

Can drop whatever Q.Gate.constants has on those spots!






google bristlecone (staggered) 6  x 12 lattice

|0⟩ ---- 1 -- 2 -- 3 -- 4 -- M

|0⟩ -- 1 -- 2 -- 3 -- 4 -- M

|0⟩ ---- 1 -- 2 -- 3 -- 4 -- M

|0⟩ -- 1 -- 2 -- 3 -- 4 -- M

|0⟩ -- 1 -- 2 -- 3 -- 4 -- M

|0⟩ ---- 1 -- 2 -- 3 -- 4 -- M

|0⟩ -- 1 -- 2 -- 3 -- 4 -- M

|0⟩ ---- 1 -- 2 -- 3 -- 4 -- M

|0⟩ -- 1 -- 2 -- 3 -- 4 -- M

|0⟩ ---- 1 -- 2 -- 3 -- 4 -- M

|0⟩ -- 1 -- 2 -- 3 -- 4 -- M

|0⟩ ---- 1 -- 2 -- 3 -- 4 -- M



continuous run!
constantly cycling the circuit.

with each change to the board reset the history
	and start cycling immediately
	and keep track of all results

cannot wait to get this running on WebGPU!


*/