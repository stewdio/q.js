



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










/*


|0⟩ ───○─────○─────○─────○─────○─────○───

     ┌───┐ ┌───┐             ┌───┐ ╭───╮
|0⟩ ─┤ H ├─┤   ├───○─────○───┤ M ├─┤ B ├─
     └───┘ │ C │             └───┘ ╰───╯
     ┌───┐ │   │             ┌───┐ ╭───╮
|0⟩ ─┤ X ├─┤   ├───○─────○───┤ M ├─┤ B ├─
     └───┘ └───┘             └───┘ ╰───╯

|0⟩ ───○─────○─────○─────○─────○─────○───


|0⟩ ───○─────○─────○─────○─────○─────○───




─────  Wire

┤  Slot left

├  Slot right


┌───┐  Gate top

└───┘  Gate bottom


╭───╮  Vizualization top (rounded)

╰───╯  Visualization bottom (rounded)


○  Indentity gate (empty slot)



*/









/*
//  This is the “almost Matrix” version.
//  Q.Matrix is geared to handle Q.ComplexNumber instances,
//  not arbitrary values and/or Q.Gate instances
//  so... would take serious retooling to be able to re-use Q.Matrix here.

Q.Circuit = function(  ){

	this.rows = []
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