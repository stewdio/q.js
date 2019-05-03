'strict'





/*


actually just make these special Q.Matrix instances



*/

Q.Qubit = function(){

	//0
	//1


	//this.controlBit = this[ 0 ]
}




Object.assign( Q.Qubit, {

	index: 0,
	createConstant: function( key, value ){

		Q.Qubit[ key ] = value
		Object.freeze( Q.Qubit[ key ])
	},
	createConstants: function(){

		if( arguments.length % 2 !== 0 ){

			Q.error( 'Attempted to create constants with invalid (KEY, VALUE) pairs.' )
			return
		}
		for( let i = 0; i < arguments.length; i += 2 ){

			Q.Qubit.createConstant( arguments[ i ], arguments[ i + 1 ])
		}
	}
})




Q.Gate.createConstants(

	'ZERO', new Q.Qubit([ 1, 0 ]),
	'ONE',  new Q.Qubit([ 0, 1 ])
)



