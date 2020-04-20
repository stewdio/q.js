
//  Copyright © 2019–2020, Stewart Smith. See LICENSE for details.




Q.Gate = function( params ){

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
		label: 'I',
		css:   'identity',
		AmazonBraketName: 'i',
		matrix: Q.Matrix.IDENTITY_2X2
	}),
	
	'NOOP', new Q.Gate({//  Used as a marker by the circuit editor interface.

		name:  'Identity',
		label: '!',
		css:   'identity',
		AmazonBraketName: 'i',
		matrix: Q.Matrix.IDENTITY_2X2
	}),
	
	'MEASURE', new Q.Gate({

		name:  'Measure',
		label: 'M', 
		AmazonBraketName: 'm',
		matrix: Q.Matrix.IDENTITY_2X2,//  This is silly. It’s just preventing an error. Come back and fix!!
		operation: function( qubit ){

			return qubit.collapse()
		}}),




	//  Hadamard
	//   ┌───┐
	//  ─┤ H ├─
	//   └───┘

	'HADAMARD', new Q.Gate({

		name:  'Hadamard',
		label: 'H',
		
		css:   'hadamard',
		AmazonBraketName: 'h',
		matrix: new Q.Matrix(
			[ Math.SQRT1_2,  Math.SQRT1_2 ],
			[ Math.SQRT1_2, -Math.SQRT1_2 ]),
		operation: function( qubit ){

			return new Q.Qubit( this.matrix.multiply( qubit ))
		}}),
	

	//  Pauli X
	//   ┌───┐
	//  ─┤ X ├─
	//   └───┘

	'PAULI_X', new Q.Gate({//  Rπ

		name:  'Pauli X',
		label: 'X',
		css:   'pauli-x',
		matrix: new Q.Matrix(
			[ 0, 1 ],
			[ 1, 0 ]),
		operation: function( qubit ){

			return new Q.Qubit( this.matrix.multiply( qubit ))
		}}),
	

	//  Pauli Y
	//   ┌───┐
	//  ─┤ Y ├─
	//   └───┘

	'PAULI_Y', new Q.Gate({

		name:  'Pauli Y',
		label: 'Y',
		css:   'pauli-y',
		matrix: new Q.Matrix(
			[ 0, new Q.ComplexNumber( 0, -1 )],
			[ new Q.ComplexNumber( 0, 1 ), 0 ]),
		operation: function( qubit ){

			return new Q.Qubit( this.matrix.multiply( qubit ))
		}}),
	

	//  Pauli Z
	//   ┌───┐
	//  ─┤ Z ├─
	//   └───┘

	'PAULI_Z', new Q.Gate({

		name:  'Pauli Z',
		label: 'Z',
		css:   'pauli-z',
		matrix: new Q.Matrix(
			[ 1,  0 ],
			[ 0, -1 ]),
		operation: function( qubit ){

			return new Q.Qubit( this.matrix.multiply( qubit ))
		}}),
	

	//  Phase
	//   ┌───┐
	//  ─┤ S ├─
	//   └───┘

	'PHASE', new Q.Gate({

		name:  'Phase',
		label: 'S',
		css:   'phase',
		matrix: new Q.Matrix(
			[ 1, 0 ],
			[ 0, new Q.ComplexNumber( 0, 1 )]),
		operation: function( qubit ){

			return new Q.Qubit( this.matrix.multiply( qubit ))
		}}),
	

	//  π / 8
	//   ┌───┐
	//  ─┤ T ├─
	//   └───┘
	
	'PI_8', new Q.Gate({

		name:  'π ÷ 8',
		label: 'T',
		css:   'pi8',
		matrix: new Q.Matrix(
			[ 1, 0 ],
			[ 0, Q.ComplexNumber.E.power( new Q.ComplexNumber( 0, Math.PI / 4 )) ]),
		operation: function( qubit ){

			return new Q.Qubit( this.matrix.multiply( qubit ))
		}}),



	//  Swap
	//   ┌──────┐
	//  ─┤ SWAP ├─
	//   └──────┘
	
	'SWAP', new Q.Gate({

		name:  'Swap',
		label: '*',
		css:   'swap',
		matrix: new Q.Matrix(
			[ 1, 0, 0, 0 ],
			[ 0, 0, 1, 0 ],
			[ 0, 1, 0, 0 ],
			[ 0, 0, 0, 1 ]),
		operation: function( qubit ){

			return new Q.Qubit( this.matrix.multiply( qubit ))
		}})




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
