



Q.Gate = function( params ){

	`
	
		SEE ALSO
	
	https://en.wikipedia.org/wiki/Quantum_logic_gate
	`

	Object.assign( this, params )
	this.index = Q.Gate.index ++
	if( typeof this.name  !== 'string' ) this.name  = 'Unknown'
	if( typeof this.label !== 'string' ) this.label = '?'
	if( typeof this.bandwidth !== 'number' ) this.bandwidth = 1
	if( typeof this.operation !== 'function' ) this.operation = function(){

		return Array.from( arguments )//  Equal to an indentity operator.
	}
	const scope = this
	this.applyTo = function(){

		//  TO DO:
		//  make sure arguments are all instances of Q.Qubit!
		//  Q.error if not.

		let result = scope.operation( ...arguments )
		if( result instanceof Array !== true ) result = [ result ]
		return result
	}
}




Object.assign( Q.Gate, {

	index: 0,
	help: function(){ return Q.help( this )},
	constants: {},
	createConstant:  Q.createConstant,
	createConstants: Q.createConstants,
	findByLabel: function( label ){

		return Object.values( Q.Gate.constants ).find( function( element ){

			return element.label.toUpperCase() === label.toUpperCase()
		})
	},
	findByName: function( label ){

		return Object.values( Q.Gate.constants ).find( function( element ){

			return element.name.toUpperCase() === name.toUpperCase()
		})
	}
})




Q.Gate.createConstants(

	'IDENTITY', new Q.Gate({//  No operation required!

		name:  'Identity',
		label: 'I' }),
	
	'MEASURE', new Q.Gate({

		name:  'Measure',
		label: 'M', 
		operation: function( qubit ){

			return qubit.collapse()
		}}),




	'HADAMARD', new Q.Gate({

		name:  'Hadamard',
		label: 'H',
		operation: function( qubit ){

			return new Q.Qubit( Q.Matrix.HADAMARD.multiply( qubit ))
		}}),
	
	'PAULI_X', new Q.Gate({//  Rπ

		name:  'Pauli X',
		label: 'X',
		operation: function( qubit ){

			return new Q.Qubit( Q.Matrix.PAULI_X.multiply( qubit ))
		}}),
	
	'PAULI_Y', new Q.Gate({

		name:  'Pauli Y',
		label: 'Y', 
		operation: function( qubit ){

			return new Q.Qubit( Q.Matrix.PAULI_Y.multiply( qubit ))
		}}),
	
	'PAULI_Z', new Q.Gate({

		name:  'Pauli Z',
		label: 'Z', 
		operation: function( qubit ){

			return new Q.Qubit( Q.Matrix.PAULI_Z.multiply( qubit ))
		}}),
	
	'PHASE', new Q.Gate({

		name:  'Phase',
		label: 'S',
		operation: function( qubit ){

			return new Q.Qubit( Q.Matrix.PHASE.multiply( qubit ))
		}}),
	
	'PI_8', new Q.Gate({

		name:  'π ÷ 8',
		label: 'T',
		operation: function( qubit ){

			return new Q.Qubit( Q.Matrix.PI_8.multiply( qubit ))
		}}),





	//  https://qiskit.org/documentation/terra/summary_of_quantum_operations.html#multi-qubit-gates


	'CONTROLLED_NOT', new Q.Gate({

		//  https://cs.stackexchange.com/questions/10616/controlled-not-gate-a-type-of-measurement

/*

what i’m seeing here:

const result = Q.Matrix.CONTROLLED_NOT.multiply( targetQubit.multiplyTensor( controlQubit ))
|0> * |0> = 1000
|0> * |1> = 0001
|1> * |0> = 0100
|1> * |1> = 0010


const result = Q.Matrix.CONTROLLED_NOT.multiply( controlQubit.multiplyTensor( targetQubit ))
|0> * |0> = 1000
|0> * |1> = 0100
|1> * |0> = 0001
|1> * |1> = 0010






*/
		name:  'Controlled Not (C-Not)',
		label: 'C', 
		bandwidth: 2,
		operation: function( controlQubit, targetQubit ){

// console.log('controlQubit', controlQubit )
// console.log('targetQubit', targetQubit )


			const tensor = controlQubit.multiplyTensor( targetQubit )
			//const tensor = targetQubit.multiplyTensor( controlQubit )
			
			// console.log( 'controlQubit', controlQubit.toTsv() )
			// console.log( 'targetQubit', targetQubit.toTsv() )
			// console.log( 'tensor', tensor.toTsv() )

			const result = Q.Matrix.CONTROLLED_NOT.multiply( tensor )


//  actually this seems to describe it well:
//  http://www.ijoart.org/docs/Design-and-realization-of-a-quantum-Controlled-NOT-gate-using-optical-implementation.pdf

//  so replace all this w that!

// console.log( 'result!', result.toTsv() )

			return [

				new Q.Qubit( result.rows[ 0 ][ 0 ], result.rows[ 1 ][ 0 ]),
				new Q.Qubit( result.rows[ 2 ][ 0 ], result.rows[ 3 ][ 0 ])
			]
		}}),






/*

//2!

	'SWAP', new Q.Gate({

		name: 'Swap',

	}),

	'CONTROLLED_Z', new Q.Gate(
		[ 1, 0, 0,  0 ],
		[ 0, 1, 0,  0 ],
		[ 0, 0, 1,  0 ],
		[ 0, 0, 0, -1 ]),

	'CONTROLLED_PHASE', new Q.Gate(
		[ 1, 0, 0, 0 ],
		[ 0, 1, 0, 0 ],
		[ 0, 0, 1, 0 ],
		[ 0, 0, 0, new Q.ComplexNumber( 0, 1 )]),


/*

//3!

	'TOFFOLI', new Q.Gate(//  “Controlled-controlled Not” (Simulates NAND and DUPE gates.)
		[ 1, 0, 0, 0, 0, 0, 0, 0 ],
		[ 0, 1, 0, 0, 0, 0, 0, 0 ],
		[ 0, 0, 1, 0, 0, 0, 0, 0 ],
		[ 0, 0, 0, 1, 0, 0, 0, 0 ],
		[ 0, 0, 0, 0, 1, 0, 0, 0 ],
		[ 0, 0, 0, 0, 0, 1, 0, 0 ],
		[ 0, 0, 0, 0, 0, 0, 0, 1 ],
		[ 0, 0, 0, 0, 0, 0, 1, 0 ]),

	'CONTROLLED_SWAP', new Q.Gate(//  Fredkin
		[ 1, 0, 0, 0, 0, 0, 0, 0 ],
		[ 0, 1, 0, 0, 0, 0, 0, 0 ],
		[ 0, 0, 1, 0, 0, 0, 0, 0 ],
		[ 0, 0, 0, 1, 0, 0, 0, 0 ],
		[ 0, 0, 0, 0, 1, 0, 0, 0 ],
		[ 0, 0, 0, 0, 0, 0, 1, 0 ],
		[ 0, 0, 0, 0, 0, 1, 0, 0 ],
		[ 0, 0, 0, 0, 0, 0, 0, 1 ])
	*/



	/*
	'BLOCH_SPHERE',
	new Q.Gate( 

		function( qubit ){

			//  Make a new Bloch Sphere visualizer!
		},
		'B', 'Bloch Sphere visualizer'
	)*/
)




Object.assign( Q.Gate.prototype, {

	clone: function(){

		return new Q.Gate( this.applyTo, this.label, this.name )
	},
	toText: function(){

		return `-${this.label}-`
	},
	toDiagram: function(){


		//  Hadamard
		//   ┌───┐
		//  ─┤ H ├─
		//   └───┘

	},
	toHtml: function(){

		return `<div class="gate">${this.label}</div>`
	}
})
