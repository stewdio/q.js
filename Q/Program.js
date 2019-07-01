



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




Object.assign( Q.Program, {

	fromText: function( text ){

		const 
		linesRaw = text.split( '\n' ),
		lines = linesRaw.reduce( function( cleaned, line ){

			const trimmed = line.trim()
			if( trimmed.length ){

				cleaned.push( trimmed.replace( /--/g, '-' ).split( '-' ))
			}
			return cleaned

		}, [] ),
		bandwidth = lines.length

		
		//  should check for equal moments length for all qubits!
		//  #%^#$^&$%&*%^*(%&*)^&(*%^&*$^&*%^*()&*&_&(^*&%^$#%@$$^%&^*(&%$#&%$%@#%^#)))
		const timewidth = lines[ 0 ].length


		const p = new Q.Program( bandwidth, timewidth )
		lines.forEach( function( line, l ){

			line.forEach( function( moment, m ){

				let node
				if( moment.substr( 0, 1 ) === '|' ) node = new Q.Qubit( undefined, node )
				else node = new Q.Gate.findByLabel( moment )
				p.set( m, l, node )
			})
		})
		return p
	}


})




Object.assign( Q.Program.prototype, {

	set: function( momentIndex, qubitIndex, value ){

		this.moments[ momentIndex ][ qubitIndex ] = value
	},
	run: function(){


		//  Our “state” is the same size as our program’s bandwidth
		//  as it’s just a copy of each qubit’s current value.
		
		const state = this.moments[ 0 ].slice( 0 )
		

		//  Now go through, one moment at a time,
		//  applying each moment’s operation to our state.

		for( let m = 1; m < this.timewidth; m ++ ){

			for( let b = 0; b < this.bandwidth; b ++ ){

				state[ b ] = this.moments[ m ][ b ].applyTo( state[ b ])
			}
		}

		
		//  We’re done with the program 
		//  so automatically measure each qubit
		//  and return the combined collapsed state.

		for( let s = 0; s < state.length; s ++ ){

			state[ s ] = state[ s ].collapse().ket.toText()
		}
		return '|'+ state.join( '' ) +'⟩'
	},
	toText: function(){

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
	},
	toDiagram: function(){

		const 
		that = this,
		graph = new Array( this.bandwidth * 3 + 1 ).fill( '' )

		this.moments.forEach( function( moment, m ){

			if( m === 0 ){

				graph[ 0 ] = '\n '
			}
			graph[ 0 ] += '   t'+ m
			moment.forEach( function( node, n ){

				let 
				first  = '',
				second = '',
				third  = ''

				if( m === 0 ){

					first  = '    ' ,
					second = 'q'+ n  +'  ',
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
	},
	toDom: function(){

		const programElement = document.createElement( 'div' )
		programElement.classList.add( 'program' )



	}

})










var p = new Q.Program()

p.set( 0, 0, Q.Qubit.HORIZONTAL )
p.set( 0, 1, Q.Qubit.VERTICAL )
p.set( 0, 2, Q.Qubit.VERTICAL )

p.set( 1, 0, Q.Gate.HADAMARD )
p.set( 2, 0, Q.Gate.PAULI_X )
p.set( 3, 0, Q.Gate.PAULI_Y )
p.set( 4, 0, Q.Gate.PAULI_Z )

p.set( 1, 1, Q.Gate.HADAMARD )
p.set( 2, 1, Q.Gate.PHASE )
p.set( 3, 1, Q.Gate.PI_8 )

p.set( 1, 2, Q.Gate.HADAMARD )






/*


Next step: 


    t0   t1   t2   t3   t4   t5

q0  |0⟩───●────●────●────●────●

        ┌───┐┌───┐     ┌───┐╭───╮
q1  |0⟩─┤ H ├┤   ├──●──┤ M ├┤ B │
        └───┘│ C │     └───┘╰───╯
        ┌───┐│   │┌───┐╭───╮
q2  |0⟩─┤ X ├┤   ├┤ M ├┤ B ├──●
        └───┘└───┘└───┘╰───╯




.fromText()
.fromDiagram()


https://en.wikipedia.org/wiki/Box-drawing_character


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


continuous run!
constantly cycling the circuit.

with each change to the board reset the history
	and start cycling immediately
	and keep track of all results

cannot wait to get this running on WebGPU!




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




Let’s go hopping around the unit circle.

╭   ╮                             ╭   ╮
│ 1 │  ┌───┐┌───┐┌───┐┌───┐┌───┐  │-1 │
│   │ ─┤ X ├┤ H ├┤ X ├┤ H ├┤ X ├─ │   │
│ 0 │  └───┘└───┘└───┘└───┘└───┘  │ 0 │
╰   ╯                             ╰   ╯




*/




/*


CONSTANTS

SHOR!


*/





/*



https://en.wikipedia.org/wiki/List_of_quantum_processors



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





*/