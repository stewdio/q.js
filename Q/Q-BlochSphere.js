
//  Copyright © 2019–2020, Stewart Smith. See LICENSE for details.




Q.BlochSphere = function( onValueChange ){

	Object.assign( this, {

		isRotating: false,
		radius:     1,
		radiusSafe: 1.01,
		lineWidth:  0.01,
		state:      Q.Qubit.HORIZONTAL.toBlochSphere(),
		group:      new THREE.Group(),
		onValueChange
	})


	//  Create the surface of the Bloch sphere.

	const surface = new THREE.Mesh( 

		new THREE.SphereGeometry( this.radius, 64, 64 ),
		new THREE.MeshPhongMaterial({

			side: THREE.FrontSide,
			map: Q.BlochSphere.makeSurface(),
			transparent: true,
			opacity: 0.97
		})
	)
	this.group.add( surface )




	//  Create the X, Y, and Z axis lines.

	const 
	xAxis = new THREE.Mesh(

		new THREE.BoxGeometry( this.lineWidth, this.lineWidth, this.radius * 2.5 ),
		new THREE.MeshBasicMaterial({ color: Q.BlochSphere.xAxisColor })
	),
	yAxis = new THREE.Mesh(

		new THREE.BoxGeometry( this.radius * 2.5, this.lineWidth, this.lineWidth ),
		new THREE.MeshBasicMaterial({ color: Q.BlochSphere.yAxisColor })
	),
	zAxis = new THREE.Mesh(

		new THREE.BoxGeometry( this.lineWidth, this.radius * 2.5, this.lineWidth ),
		new THREE.MeshBasicMaterial({ color: Q.BlochSphere.zAxisColor })
	)

	this.group.add( xAxis, yAxis, zAxis )


	//  Create X, Y, and Z arrow heads,
	//  indicating positive directions for all three.

	const 
	arrowLength     = 0.101,//  I know, weird, right?
	arrowHeadLength = 0.1,
	arrowHeadWidth  = 0.1

	this.group.add( new THREE.ArrowHelper( 

		new THREE.Vector3( 0, 0, 1.00 ), 
		new THREE.Vector3( 0, 0, 1.25 ),
		arrowLength, 
		Q.BlochSphere.xAxisColor,//  Red
		arrowHeadLength, 
		arrowHeadWidth
	))
	this.group.add( new THREE.ArrowHelper( 

		new THREE.Vector3( 1.00, 0, 0 ), 
		new THREE.Vector3( 1.25, 0, 0 ), 
		arrowLength, 
		Q.BlochSphere.yAxisColor,//  Green
		arrowHeadLength, 
		arrowHeadWidth
	))
	this.group.add( new THREE.ArrowHelper( 

		new THREE.Vector3( 0, 1.00, 0 ), 
		new THREE.Vector3( 0, 1.25, 0 ), 
		arrowLength, 
		Q.BlochSphere.zAxisColor,//  Blue
		arrowHeadLength, 
		arrowHeadWidth
	))


	//  Create the X, Y, and Z axis labels.

	const
	axesLabelStyle = {

		width:  128,
		height: 128,
		fillStyle: '#505962',
		font: 'bold italic 64px Georgia, "Times New Roman", serif'
	},
	xAxisLabel = new THREE.Sprite( 

		new THREE.SpriteMaterial({ 

			map: Object.assign( SurfaceText( axesLabelStyle ))
		})
	),
	yAxisLabel = new THREE.Sprite( 

		new THREE.SpriteMaterial({ 

			map: Object.assign( SurfaceText( axesLabelStyle ))
		})
	),
	zAxisLabel = new THREE.Sprite( 

		new THREE.SpriteMaterial({ 

			map: Object.assign( SurfaceText( axesLabelStyle ))
		})
	)

	xAxisLabel.material.map.print( 'x' )
	xAxisLabel.position.set( 0, 0, 1.45 )
	xAxisLabel.scale.set( 0.25, 0.25, 0.25 )
	xAxis.add( xAxisLabel )

	yAxisLabel.material.map.print( 'y' )
	yAxisLabel.position.set( 1.45, 0, 0 )
	yAxisLabel.scale.set( 0.25, 0.25, 0.25 )
	yAxis.add( yAxisLabel )

	zAxisLabel.material.map.print( 'z' )
	zAxisLabel.position.set( 0, 1.45, 0 )
	zAxisLabel.scale.set( 0.25, 0.25, 0.25 )
	zAxis.add( zAxisLabel )




	//  Create the line from the sphere’s origin 
	//  out to where the Bloch vector intersects
	//  with the sphere’s surface.

	this.blochVector = new THREE.Mesh(

		new THREE.BoxGeometry( 0.04, 0.04, this.radius ),
		new THREE.MeshBasicMaterial({ color: Q.BlochSphere.vectorColor })
	)
	this.blochVector.geometry.translate( 0, 0, 0.5 )
	this.group.add( this.blochVector )


	//  Create the cone that indicates the Bloch vector
	//  and points to where that vectors
	//  intersects with the surface of the sphere.

	this.blochPointer = new THREE.Mesh(

		new THREE.CylinderBufferGeometry( 0, 0.5, 1, 32, 1 ),
		new THREE.MeshPhongMaterial({ color: Q.BlochSphere.vectorColor })
	)
	this.blochPointer.geometry.translate( 0, -0.5, 0 )
	this.blochPointer.geometry.rotateX( Math.PI / 2 )
	this.blochPointer.geometry.scale( 0.2, 0.2, 0.2 )
	this.blochPointer.lookAt( new THREE.Vector3() )
	this.group.add( this.blochPointer )




	//  Create the Theta ring that will belt the sphere.

	const
	arcR = this.radiusSafe * Math.sin( Math.PI / 2 ),
	arcH = this.radiusSafe * Math.cos( Math.PI / 2 ),
	thetaGeometry = Q.BlochSphere.createLatitudeArc( arcR, 128, Math.PI / 2, Math.PI * 2 ),
	thetaLine = new MeshLine(),
	thetaPhiMaterial = new MeshLineMaterial({

		color: 0x505962,
		lineWidth: this.lineWidth * 3,
		sizeAttenuation: true
	})

	thetaGeometry.rotateX( Math.PI / 2 )
	thetaGeometry.rotateY( Math.PI / 2 )
	thetaGeometry.translate( 0, arcH, 0 )
	thetaLine.setGeometry( thetaGeometry )

	this.thetaMesh = new THREE.Mesh( 

		thetaLine.geometry,
		thetaPhiMaterial
	)
	this.group.add( this.thetaMesh )


	//  Create the Phi arc that will draw from the north pole
	//  down to wherever the Theta arc rests.

	this.phiGeometry = Q.BlochSphere.createLongitudeArc( this.radiusSafe, 64, 0, Math.PI * 2 ),
	this.phiLine = new MeshLine()
	this.phiLine.setGeometry( this.phiGeometry )
	this.phiMesh = new THREE.Mesh( 

		this.phiLine.geometry,
		thetaPhiMaterial
	)
	this.group.add( this.phiMesh )




	//  Time to put plans to action.

	Q.BlochSphere.prototype.setTargetState.call( this )
}






    ////////////////
   //            //
  //   Static   //
 //            //
////////////////


Object.assign( Q.BlochSphere, {

	xAxisColor:  0xCF1717,//  Red.
	yAxisColor:  0x59A112,//  Green.
	zAxisColor:  0x0F66BD,//  Blue.
	vectorColor: 0xF2B90D,//  Yellow.


	//  It’s important that we build the texture
	//  right here and now, rather than load an image.
	//  Why? Because if we load a pre-existing image
	//  we run into CORS problems using file:/// !

	makeSurface: function(){

		const
		width  = 2048,
		height = width / 2

		const canvas  = document.createElement( 'canvas' )
		canvas.width  = width
		canvas.height = height
		
		const context = canvas.getContext( '2d' )
		context.fillStyle = 'hsl( 210, 20%, 100% )'
		context.fillRect( 0, 0, width, height )
		context.fillStyle = 'hsl( 210, 20%, 90% )'

		const yStep = height / 16
		for( let y = 0; y <= height; y += yStep ){

			context.fillRect( 0, y, width, 1 )
		}

		const xStep = width / 16
		for( let x = 0; x <= width; x += xStep ){

			context.fillRect( x, 0, 1, height )
		}

		const texture = new THREE.CanvasTexture( canvas )
		texture.needsUpdate = true
		return texture
	},




	createLongitudeArc: function( radius, segments, thetaStart, thetaLength ){

		const geometry = new THREE.CircleGeometry( radius, segments, thetaStart, thetaLength )
		geometry.vertices.shift()
		
		//  This is not NORMALLY necessary 
		//  because we expect this to only be 
		//  between PI/2 and PI*2 
		// (so the length is only Math.PI instead of PI*2).

		if( thetaLength >= Math.PI * 2 ){

			geometry.vertices.push( geometry.vertices[ 0 ].clone() )
		}
		return geometry
	},
	createLatitudeArc: function( radius, segments, phiStart, phiLength ){

		const geometry = new THREE.CircleGeometry( radius, segments, phiStart, phiLength )
		geometry.vertices.shift()
		if( phiLength >= 2 * Math.PI ){

			geometry.vertices.push( geometry.vertices[ 0 ].clone() )
		}
		return geometry
	},
	createQuadSphere: function( options ){

		let {

			radius,
			phiStart,
			phiLength,
			thetaStart,
			thetaLength,
			latitudeLinesTotal,
			longitudeLinesTotal,
			latitudeLineSegments,
			longitudeLineSegments,
			latitudeLinesAttributes,
			longitudeLinesAttributes

		} = options

		if( typeof radius !== 'number' ) radius = 1
		if( typeof phiStart !== 'number' ) phiStart = Math.PI / 2
		if( typeof phiLength !== 'number' ) phiLength = Math.PI * 2
		if( typeof thetaStart !== 'number' ) thetaStart = 0
		if( typeof thetaLength !== 'number' ) thetaLength = Math.PI
		if( typeof latitudeLinesTotal !== 'number' ) latitudeLinesTotal = 16
		if( typeof longitudeLinesTotal !== 'number' ) longitudeLinesTotal = 16
		if( typeof latitudeLineSegments !== 'number' ) latitudeLineSegments = 64
		if( typeof longitudeLineSegments !== 'number' ) longitudeLineSegments = 64
		if( typeof latitudeLinesAttributes === 'undefined' ) latitudeLinesAttributes = { color: 0xCCCCCC }
		if( typeof longitudeLinesAttributes === 'undefined' ) longitudeLinesAttributes = { color: 0xCCCCCC }

		const
		sphere = new THREE.Group(),
		latitudeLinesMaterial  = new THREE.LineBasicMaterial( latitudeLinesAttributes ),
		longitudeLinesMaterial = new THREE.LineBasicMaterial( longitudeLinesAttributes )


		//  Lines of longitude.
		//  https://en.wikipedia.org/wiki/Longitude

		for( 
			
			let 
			phiDelta = phiLength / longitudeLinesTotal, 
			phi = phiStart, 
			arc = Q.BlochSphere.createLongitudeArc( radius, longitudeLineSegments, thetaStart + Math.PI / 2, thetaLength ); 
			phi < phiStart + phiLength + phiDelta; 
			phi += phiDelta ){
		
			const geometry = arc.clone()
			geometry.rotateY( phi )
			sphere.add( new THREE.Line( geometry, longitudeLinesMaterial ))
		}


		//  Lines of latitude.
		//  https://en.wikipedia.org/wiki/Latitude

		for (

			let 
			thetaDelta = thetaLength / latitudeLinesTotal,
			theta = thetaStart; 
			theta < thetaStart + thetaLength;
			theta += thetaDelta ){
			
			if( theta === 0 ) continue
			
			const
			arcR = radius * Math.sin( theta ),
			arcH = radius * Math.cos( theta ),
			geometry = Q.BlochSphere.createLatitudeArc( arcR, latitudeLineSegments, phiStart, phiLength )
		
			geometry.rotateX( Math.PI / 2 )
			geometry.rotateY( Math.PI / 2 )
			geometry.translate( 0, arcH, 0 )
			sphere.add( new THREE.Line( geometry, latitudeLinesMaterial ))
		}


		return sphere
	}
})






    ///////////////
   //           //
  //   Proto   //
 //           //
///////////////


Object.assign( Q.BlochSphere.prototype, {

	update: function(){

		if( this.isRotating ) this.group.rotation.y += Math.PI / 4096
	},
	setTargetState: function( target ){
		
		if( target === undefined ) target = Q.Qubit.HORIZONTAL.toBlochSphere()

		//  Are we ready for a change?

		// if( qubitCurrent !== qubitTarget ||
		// 	gateCurrent  !== gateTarget ){


			//  Deselect all buttons -- except the one in use!

			// Array
			// .from( document.getElementById( 'bloch-sphere-qubit-selector' ).children )
			// .forEach( function( child ){

			// 	if( child.getAttribute( 'data-qubit' ) === qubitTarget.name ){

			// 		child.classList.add( 'selected' )
			// 	}
			// 	else child.classList.remove( 'selected' )
			// })


			//  x

			// if( qubitCurrent === undefined ) qubitCurrent = qubitTarget

			// const 
			// currentState = qubitCurrent,
			// currentBloch = currentState.toBlochSphere(),
			// targetState  = qubitTarget,
			// targetBloch  = targetState.toBlochSphere()


			//  Update our alpha-beta readout.

			// document.getElementById( 'bloch-alpha' ).innerText = targetState.alpha.toText( 4 )
			// document.getElementById( 'bloch-beta'  ).innerText = targetState.beta.toText( 4 )


			//  Tween our indicator to the target state.

			window.tween = new TWEEN.Tween( this.state )
				.to( target, 1000 )
				.easing( TWEEN.Easing.Quadratic.InOut )
				.onUpdate( this.updateBlochVector.bind( this ) )
				.start()


			//  Make it ready to go for next time.

			// qubitCurrent = qubitTarget	
		// }
	},
	updateBlochVector: function( state ){


		//  Move the big-ass surface pointer.

		this.blochPointer.position.set(
			
			Math.sin( state.theta ) * Math.sin( state.phi ),
			Math.cos( state.theta ),
			Math.sin( state.theta ) * Math.cos( state.phi )
		)
		this.blochPointer.lookAt( new THREE.Vector3() )
		this.blochVector.lookAt( this.blochPointer.getWorldPosition( new THREE.Vector3() ))


		//  Slide the Theta ring from the north pole
		//  down as far south as it needs to go
		//  and scale its radius so it belts the sphere.

		const thetaScaleSafe = Math.max( state.theta, 0.01 )
		this.thetaMesh.scale.set(

			Math.sin( thetaScaleSafe ),
			1,
			Math.sin( thetaScaleSafe )
		)
		this.thetaMesh.position.y = Math.cos( state.theta )


		//  Redraw the Phi arc to extend from the north pole
		//  down to only as far as the Theta ring sits.
		//  Then rotate the whole Phi arc about the poles.

		for( 

			let 
			i = 0, 
			limit = this.phiGeometry.vertices.length; 

			i < limit;
			i ++ ){

			const gain = i / ( limit -  1 )
			this.phiGeometry.vertices[ i ].set(

				Math.sin( state.theta * gain ) * this.radiusSafe,
				Math.cos( state.theta * gain ) * this.radiusSafe,
				0
			)
		}
		this.phiLine.setGeometry( this.phiGeometry )
		this.phiMesh.rotation.y = state.phi - Math.PI / 2


		if( typeof this.onValueChange === 'function' ) this.onValueChange.call( this )
	}
})







