'strict'




Q.Qubit = function( a, b ){

	`
	A qubit is represented by Q.Matrix([ a ],[ b ])
	where ‘a’ and ‘b’ are complex numbers and ‖a‖² + ‖b‖² = 1.
	When in superposition, 
	the probability it will collapse to 0 is ‖a‖²,
	the probability it will collapse to 1 is ‖b‖².


		EXAMPLES

	• Qubit( 1÷√2, 1÷√2 ) has 50% chance of collapsing to 0
	  and a 50% chance of collapsing to 1.
	• Qubit( 1, 0 ) has a 100% chance of collapsing to 0.
	• Qubit( 0, 1 ) has a 100% chance of collapsing to 1.


		BLOCH SPHERE

	Unit sphere of radius=1 around the origin -- but for our
	purposes we can use real numbers and a 2D unit circle.
	Can be used as a state machine for quantum compuation.
	https://en.wikipedia.org/wiki/Bloch_sphere

	             
	             [  0 ] Vertical
	             [ +1 ]
	                │
	    [ -1÷√2 ]   │   [ +1÷√2 ] Diagonal
	    [ +1÷√2 ]╲  │  ╱[ +1÷√2 ]
	              ╲ │ ╱
	               ╲│╱
	[ -1 ]──────────╳──────────[ +1 ] Horizontal
	[  0 ]         ╱│╲         [  0 ]
	              ╱ │ ╲
	             ╱  │  ╲
	    [ -1÷√2 ]   │   [ +1÷√2 ] Anti-diagonal
	    [ -1÷√2 ]   │   [ -1÷√2 ]
	                │
	             [  0 ]
	             [ -1 ]
	`

	if( typeof a !== 'number' ) a = 1
	if( typeof b !== 'number' ) b = Math.sqrt( 1 - Math.pow( a, 2 ))


	//  Fuzzy math! Thanks floating point numbers...

	const 
	n = Math.pow( a, 2 ) + Math.pow( b, 2 ),
	t = Number.EPSILON * 2

	if( Math.abs( n - 1 ) > t )
		return Q.error( `Q.Qubit could not accept the initialization values of a=${a} and b=${b} for qbit${this.index} because their squares do not add up to 1.` )	

	Q.Matrix.call( this, [ a ],[ b ])
	this.index = Q.Qubit.index ++
}
Q.Qubit.prototype = Q.Matrix.prototype
//Q.Qubit.constructor = Q.Qubit




Object.assign( Q.Qubit, {

	index: 0,
	createConstant: function( key, value ){

		Q.Qubit[ key ] = value
		Object.freeze( Q.Qubit[ key ])
	},
	createConstants: function(){

		if( arguments.length % 2 !== 0 ){

			return Q.error( 'Q.Qubit attempted to create constants with invalid (KEY, VALUE) pairs.' )
		}
		for( let i = 0; i < arguments.length; i += 2 ){

			Q.Qubit.createConstant( arguments[ i ], arguments[ i + 1 ])
		}
	}
})




Q.Qubit.createConstants(

	'H', new Q.Qubit( 1, 0 ),
	'V', new Q.Qubit( 0, 1 ),
	'D', new Q.Qubit( 1 / Math.SQRT2,  1 / Math.SQRT2 ),
	'A', new Q.Qubit( 1 / Math.SQRT2, -1 / Math.SQRT2 )



/*



We want to actually operate off the unit circle
or BLOCH SPHERE!

https://en.wikipedia.org/wiki/Bloch_sphere
https://en.wikipedia.org/wiki/Jones_calculus#Jones_vectors


Horizontal 
|H⟩
.ket = 'H'
.jones = Q.Matrix(
	[ 1 ],
	[ 0 ])

Vertical
|V⟩
.ket = 'V'
.jones = Q.Matrix(
	[ 0 ],
	[ 1 ])


Diagonal
|D⟩
L+45
.ket = 'D'
.jones = Q.Matrix(
	[ 1 ],
	[ 1 ]).multiplyScalar( 1 / Math.SQRT2 )

Anti-diagonal
|A⟩
L-45
.ket = 'A'
.jones = Q.Matrix(
	[  1 ],
	[ -1 ]).multiplyScalar( 1 / Math.SQRT2 )


Right-hand circular polarized (RHCP)
|R⟩
.ket = 'R'
.jones = Q.Matrix(
	[  1 ],
	[ -i ]).multiplyScalar( 1 / Math.SQRT2 )

Left-hand circular polarized (RHCP)
|L⟩
.ket = 'L'
.jones = Q.Matrix(
	[  1 ],
	[ +i ]).multiplyScalar( 1 / Math.SQRT2 )



Opposing pairs:
| H ⟩ and | V ⟩
| D ⟩ and | A ⟩
| R ⟩ and | L ⟩



*/


)
















