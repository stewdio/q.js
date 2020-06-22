
//  Copyright © 2019–2020, Stewart Smith. See LICENSE for details.




'use strict'




const SurfaceText = function( options ){

	if( options === undefined ) options = {}
	
	if( typeof options.width  !== 'number' ) options.width  = 1024//  Pixels to render.
	if( typeof options.height !== 'number' ) options.height = 1024//
	if( typeof options.flipHorizontal !== 'boolean' ) options.flipHorizontal = false
	if( typeof options.flipVertical   !== 'boolean' ) options.flipVertical   = false
	
	if( options.fontFamily   === undefined ) options.fontFamily    = '"Helvetica Neue", Helvetica, Arial, sans-serif'
	if( options.fontSize     === undefined ) options.fontSize      = '128px'
	if( typeof options.fontSize === 'number' ) options.fontSize    = options.fontSize + 'px'
	
	
	if( options.lineHeight   === undefined ) options.lineHeight    = ( parseFloat( options.fontSize ) * 1.2 ) +'px'
	if( typeof options.lineHeight === 'number' ) options.lineHeight = options.lineHeight + 'px'
	
	
	if( options.textAlign    === undefined ) options.textAlign     = 'center'
	if( options.fillStyle    === undefined ) options.fillStyle     = 'white'
	if( options.textBaseline === undefined ) options.textBaseline  = 'middle'//alphabetic'
	if( options.textAlign    === undefined ) options.verticalAlign = 'middle'
	if( options.font         === undefined ) options.font          =  options.fontSize +' '+ options.fontFamily
	if( options.measure      === undefined ) options.measure       =  options.width
	
	if( options.text === undefined ) options.text = ''




	const canvas  = document.createElement( 'canvas' )
	canvas.width  = options.width
	canvas.height = options.height
	
	const 
	context    = canvas.getContext( '2d' ),
	translateX = options.flipHorizontal ?  options.width  : 0,
	translateY = options.flipVertical   ?  options.height : 0,
	scaleX     = options.flipHorizontal ? -1  : 1,
	scaleY     = options.flipVertical   ? -1  : 1
		  
	Object.assign( context, options )//  Too promiscuous? 
	context.translate( translateX, translateY )
	context.scale( scaleX, scaleY )

	const texture = new THREE.CanvasTexture( canvas )
	texture.needsUpdate = true
	



	function wordWrap( text ){

		const
		glue  = ' ',
		words = text.split( glue ),
		lines = []
		
		if( words.length <= 1 ) return words
		
		let 
		lineLast   = words[ 0 ],
		lineLength = 0
		
		for( let i = 1; i < words.length; i ++ ){

			const word = words[ i ]	
			lineLength = context.measureText( lineLast + glue + word ).width
			if( lineLength < options.measure ){

				lineLast += ( glue + word )
			}
			else {

				lines.push( lineLast )
				lineLast = word
			}
			if( i === words.length - 1 ) lines.push( lineLast )
		}
		return lines
	}



	
	texture.print = function( text, x, y ){

		if( !text ) text = options.text
		else options.text = text
		
		const 
		lines = wordWrap( text ),
		lineHeight = Number.parseFloat( options.lineHeight )
		
		if( x === undefined ) x = options.x
		if( y === undefined ) y = options.y
		if( typeof x !== 'number' ){

			if( options.textAlign === 'left' ) x = 0
			else if( options.textAlign === 'right' ) x = options.width
			else x = options.width / 2
		}
		if( typeof y !== 'number' ){

			if( options.verticalAlign === 'top' ) y = 0
			else if( options.verticalAlign === 'bottom' ) y = options.height
			else y = ( options.height / 2 ) - ( lineHeight * ( lines.length - 1 ) / 2 )
		}
		context.clearRect( 0, 0, options.width, options.height )
		if( options.backgroundColor !== undefined ){
		
			context.fillStyle = options.backgroundColor
			context.fillRect( 0, 0, options.width, options.height )
			context.fillStyle = options.fillStyle
		}		
		for( let i = 0; i < lines.length; i ++ ){

			context.fillText( lines[ i ], x, y + i * lineHeight )
		}
		texture.needsUpdate = true
	}
	
	
	
	
	texture.print( options.text, options.x, options.y )
	return texture
}



