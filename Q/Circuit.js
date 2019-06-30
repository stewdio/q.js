



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
	graph = new Array( this.bandwidth * 3 ).fill( '' )

	this.moments.forEach( function( moment, m ){

		moment.forEach( function( node, n ){

			let 
			first  = '',
			second = '',
			third  = ''

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
					third  += '╰───╯'
					if( m < that.moments.length - 1 ) second +='├'
					else second += '│'
				}
			}
			graph[ n * 3 ] += first
			graph[ n * 3 + 1 ] += second
			graph[ n * 3 + 2 ] += third
		})
	})
	return  graph.join( '\n' )
}







var p = new Q.Program()
p.set( 0, 0, Q.Qubit.HORIZONTAL )
p.set( 0, 1, Q.Qubit.VERTICAL )
p.set( 0, 2, Q.Qubit.VERTICAL )

p.set( 1, 2, Q.Gate.HADAMARD )
p.set( 3, 1, Q.Gate.PAULI_X )






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

//  This is the “almost Matrix” version.
//  Q.Matrix is geared to handle Q.ComplexNumber instances,
//  not arbitrary values and/or Q.Gate instances
//  so... would take serious retooling to be able to re-use Q.Matrix here.

Q.Circuit = function(  ){

	this.moment = []
}
Q.Circuit.prototype.addGate = function( gate, location, to ){

	//x
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











/*

rename to Q.Program ??


should also extend Matrix?
and then program flows from rows[0] to rows[ row.length-1 ]

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



/*V


Q.Program.prototype.toDiagram = function(){

	return this.moments.reduce( function( text, moment, t ){

		text += '\n'+ moment.reduce( function( text, value, i ){

			let label = ''
			if( value instanceof Q.Qubit || value.label === 'I' ) label = '    '
			else label = '┌───┐'
			return text + label

		}, '' )
		text += '\n'+ moment.reduce( function( text, value, i ){

			let label = ''
			if( value instanceof Q.Qubit ) label = '|'+ value.ket.toText() +'⟩─'
			else {

				if( value.label === 'I' ){

					label += '──○'
					if( i < moment.length - 1 ) label +='──'
				}
				else {

					label = '┤ '+ value.label
					if( i < moment.length - 1 ) label +=' ├'
					else label += '│'
				}
			}
			return text + label

		}, '' )
		text += '\n'+ moment.reduce( function( text, value, i ){

			let label = ''
			if( value instanceof Q.Qubit || value.label === 'I' ) label = '    '
			else label = '└───┘'
			return text + label

		}, '' )
		return text

	}, '' ).substr( 1 )
}


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