



/*


//  THE SIMPLIST FORM OF CIRCUIT!
//  Just take a lineup of gates
//  and applies them sequentially and accumulatively
//  to a horizontal qubit.

Q.Circuit = function(  ){

	this.gates = []
}
Q.Circuit.prototype.run = function( x ){

	return this.gates.reduce( function( state, gate ){

		return gate.applyTo( state )

	}, Q.Qubit.HORIZONTAL )
}

var c = new Q.Circuit()
c.gates.push( Q.Gate.HADAMARD )
c.gates.push( Q.Gate.MEASURE )

var result = c.run()
console.log( 'result', result.ket.toText() )


*/




Q.Program = function( bandwidth, timewidth ){

	if( typeof bandwidth !== 'number' ) bandwidth = 3
	this.bandwidth = bandwidth//  How many qubits do we use?
	if( typeof timewidth !== 'number' ) timewidth = 6
	this.timewidth = timewidth
	this.moments = new Array( timewidth )
		.fill( new Array( bandwidth ).fill( Q.Qubit.HORIZONTAL, 0, bandwidth ), 0, 1 )


		//   OMFG  this  killed me:
		//  Using Array.fill here seemed to NOT create clones of this object
		//  but REFERENCES  to it
		//  and so replace ONE thing in this array replaced ALL of them!!!

		//.fill( new Array( bandwidth ).fill( Q.Gate.IDENTITY, 0, bandwidth ), 1, timewidth )

	for( let m = 1; m < this.moments.length; m ++ ){

		this.moments[ m ] = new Array( bandwidth ).fill( Q.Gate.IDENTITY, 0, bandwidth )
	}
}
Q.Program.prototype.set = function( momentIndex, qubitIndex, value ){

	// console.log( 'momentIndex', momentIndex )
	// console.log( 'qubitIndex', qubitIndex )
	// console.log( 'value', value )
	// console.log( 'is  about to replace this!', this.moments[ momentIndex ][ qubitIndex ] )
	this.moments[ momentIndex ][ qubitIndex ] = value
}
Q.Program.prototype.run = function(){

	const state = this.moments[ 0 ].slice( 0 )
	for( let m = 1; m < this.timewidth; m ++ ){

		for( let b = 0; b < this.bandwidth; b ++ ){

			state[ b ] = this.moments[ m ][ b ].applyTo( state[ b ])
		}
	}
	for( let s = 0; s < state.length; s ++ ){

		state[ s ] = state[ s ].collapse().ket.toText()
	}
	return '|'+ state.join( '' ) +'⟩'
}







//   F! these are transposed of what they need to be.

Q.Program.prototype.toText = function(){

	const 
	that = this,
	graph = new Array( this.bandwidth ).fill( '' )

	this.moments.forEach( function( moment, m ){

		moment.forEach( function( node, n ){

			let label = ''
			if( node instanceof Q.Qubit ) label = '|'+ node.ket.toText() +'⟩'
			else {

				label = '-'+ node.label
				if( m < that.moments.length - 1 ) label +='-'
			}
			graph[ n ] += label 

		})
	})
	return  graph.join( '\n' )
}
Q.Program.prototype.toDiagram = function(){

	const 
	that = this,
	graph = new Array( this.bandwidth * 3 + 1 ).fill( '' )

	this.moments.forEach( function( moment, m ){

		if( m === 0 ){

			graph[ 0 ] = '\n '
		}
		graph[ 0 ] += '   T'+ m
		moment.forEach( function( node, n ){

			let 
			first  = '',
			second = '',
			third  = ''

			if( m === 0 ){

				first  = '    ' ,
				second = 'Q'+ n  +'  ',
				third  = '    '
			}
			if( node instanceof Q.Qubit ){

				first  += '    '
				second += '|'+ node.ket.toText() +'⟩─'
				third  += '    '
			}
			else {

				if( node.label === 'I' ){

					first  += '   '
					second += '──○'
					third  += '   '
					if( m < that.moments.length - 1 ){

						first  += '  '
						second += '──'
						third  += '  '
					}
				}
				else {

					first  += '┌───┐'
					second += '┤ '+ node.label +' '
					third  += '└───┘'
					if( m < that.moments.length - 1 ) second +='├'
					else second += '│'
				}
			}			
			graph[ n * 3 + 1 ] += first
			graph[ n * 3 + 2 ] += second
			graph[ n * 3 + 3 ] += third
		})
	})
	return  graph.join( '\n' )
}







var p = new Q.Program()

p.set( 0, 0, Q.Qubit.HORIZONTAL )
p.set( 0, 1, Q.Qubit.VERTICAL )
p.set( 0, 2, Q.Qubit.VERTICAL )

p.set( 1, 0, Q.Gate.HADAMARD )
p.set( 2, 0, Q.Gate.PAULI_X )
p.set( 3, 0, Q.Gate.PAULI_Y )
p.set( 4, 0, Q.Gate.PAULI_Z )
// p.set( 5, 0, Q.Gate.MEASURE )

p.set( 1, 1, Q.Gate.HADAMARD )
p.set( 2, 1, Q.Gate.PHASE )
p.set( 3, 1, Q.Gate.PI_8 )
// p.set( 5, 1, Q.Gate.MEASURE )

p.set( 1, 2, Q.Gate.HADAMARD )
// p.set( 5, 2, Q.Gate.MEASURE )






/*




    T0   T1   T2   T3   T4   T5

Q0  |0⟩───●────●────●────●────●

        ┌───┐┌───┐     ┌───┐╭───╮
Q1  |0⟩─┤ H ├┤   ├──●──┤ M ├┤ B │
        └───┘│ C │     └───┘╰───╯
        ┌───┐│   │┌───┐╭───╮
Q2  |0⟩─┤ X ├┤   ├┤ M ├┤ B ├──●
        └───┘└───┘└───┘╰───╯












    T0   T1   T2   T3   T4   T5

Q0  |0⟩───●────●────●────●────●

        ┌───┐┌───┐     ┌───┐╭───╮
Q1  |0⟩─┤ H ├┤   ├──●──┤ M ├┤ B │
        └───┘│ C │     └───┘╰───╯
        ┌───┐│   │┌───┐╭───╮
Q2  |0⟩─┤ X ├┤   ├┤ M ├┤ B ├──●
        └───┘└───┘└───┘╰───╯

Q3  |0⟩───●────●────●────●────●


Q4  |0⟩───●────●────●────●────●









─────  Wire

┤  Input (from left)

├  Output (to right)

│  Vertical bar (termination)

┌───┐  Gate top

└───┘  Gate bottom


╭───╮  Vizualization top (rounded)

╰───╯  Visualization bottom (rounded)


○  Indentity gate (empty slot)
●




*/











/*



maybe name each qubit [row] with an animal / color combo?
	that way we can label each bit that comes out!

*** but if matrix,
how best to combine cells for gates that take TWO inputs, have TWO outputs? 
	or more?


populate with identity gates to start.

measure at the end of each row


.domElement


how many time sto run circuit?

*** should measure meter be full rainbow??


.run( numberOfCycles )


TWO measureers:
	1. measure each qubit at the end of the row
	2. measure all qubits together for each cycle of the circuit



*/









/*

.fromString( x )

.toString()

https://en.wikipedia.org/wiki/Box-drawing_character


  ┌───┐
──┤ X ├──────────────
  └───┘
  ┌───┐
──┤ H ├──────────────
  └───┘
		 ┌───┐
─────────┤ H ├───────
		 └───┘



Let’s go hopping around the unit circle.

╭   ╮                             ╭   ╮
│ 1 │  ┌───┐┌───┐┌───┐┌───┐┌───┐  │-1 │
│   │ ─┤ X ├┤ H ├┤ X ├┤ H ├┤ X ├─ │   │
│ 0 │  └───┘└───┘└───┘└───┘└───┘  │ 0 │
╰   ╯                             ╰   ╯



⊗

╭╮
╰╯

*/




/*


CONSTANTS

SHOR!


*/





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