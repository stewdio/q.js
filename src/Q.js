'strict'




const Q = (function(){

	`
	Stewart Smith
	http://stewartsmith.io
	30 April 2019
	`




	const REVISION = 0


	//  We want output!

	const domElement = document.createElement( 'div' )
	domElement.style.fontFamily = '"Courier New", Courier, monospace'
	domElement.innerHTML = 'Q.js<br>Open your JavaScript console!'
	document.addEventListener( 'DOMContentLoaded', function(){
	
		document.body.append( domElement )
	})


	let verbosity = 0.5
	const error = function(){

		//return console.error.apply( console, arguments )
		//return null//  Is it better to return null or undefined to signal an error?

		console.error.apply( console, arguments )
		return '(error)'
	}








	
	function countPrefixTabs( text ){
	
		`
		Counting tabs “manually” is actually more performant than regex.
		`

		let count = index = 0
		while( text.charAt( index ++ ) === '\t' ) count ++
		return count
	}
	function extractDocumentation( f ){

		`
		I wanted a way to document code
		that was cleaner, more legible, and more elegant
		than the bullshit we put up with today.
		Also wanted it to print nicely in the console.
		`

		f = f.toString()
		
		const 
		begin = f.indexOf( '`' ) + 1,
		end   = f.indexOf( '`', begin ),
		lines = f.substring( begin, end ).split( '\n' )


		//-------------------  TO DO!
		//  we should check that there is ONLY whitespace between the function opening and the tick mark!
		//  otherwise it’s not documentation.
		
		let
		tabs  = Number.MAX_SAFE_INTEGER
		
		lines.forEach( function( line ){

			if( line ){
				
				const lineTabs = countPrefixTabs( line )
				if( tabs > lineTabs ) tabs = lineTabs
			}
		})
		lines.forEach( function( line, i ){

			lines[ i ] = line.substring( tabs )
		})
		return lines.join( '\n' )
	}







	const QC = {

		REVISION,
		verbosity,
		error,		
		domElement,
		extractDocumentation,

		ONE_SQRT: 1 / Math.sqrt( 2 )
	}
	return QC


}())



Q.Circuit = function(){}
Q.Moment = function(){}
Q.Operation = function(){}//  
Q.GateOperation = function(){}









/*

https://en.wikipedia.org/wiki/Box-drawing_character

────────X─────

*/




