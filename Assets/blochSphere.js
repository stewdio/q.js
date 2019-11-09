
//  Copyright © 2019, Stewart Smith. See LICENSE for details.




function createLongitudeArc( radius, segments, thetaStart, thetaLength ){

	const geometry = new THREE.CircleGeometry( radius, segments, thetaStart, thetaLength )
	geometry.vertices.shift()
	
	//  This is not NORMALLY necessary because we expect this to only be between 
	//  PI/2  and PI*2 (so the length is ) only Math.PI instead of PI*2.

	if( thetaLength >= 2 * Math.PI ){

		geometry.vertices.push( geometry.vertices[ 0 ].clone() )
	}
	return geometry
}
function createLatitudeArc( radius, segments, phiStart, phiLength ){

	const geometry = new THREE.CircleGeometry( radius, segments, phiStart, phiLength )
	geometry.vertices.shift()
	if( phiLength >= 2 * Math.PI ){

		geometry.vertices.push( geometry.vertices[ 0 ].clone() )
	}
	return geometry
}
function createQuadSphere( options ){

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
	if( typeof latitudeLinesTotal !== 'number' ) latitudeLinesTotal = 12
	if( typeof longitudeLinesTotal !== 'number' ) longitudeLinesTotal = 12
	if( typeof latitudeLineSegments !== 'number' ) latitudeLineSegments = 64
	if( typeof longitudeLineSegments !== 'number' ) longitudeLineSegments = 64
	if( typeof latitudeLinesAttributes === 'undefined' ) latitudeLinesAttributes = { color: 0xDDDDDD }
	if( typeof longitudeLinesAttributes === 'undefined' ) longitudeLinesAttributes = { color: 0xDDDDDD }

	const
	sphere = new THREE.Group(),
	latitudeLinesMaterial = new THREE.LineBasicMaterial( latitudeLinesAttributes ),
	longitudeLinesMaterial = new THREE.LineBasicMaterial( longitudeLinesAttributes )


	//  Lines of longitude.
	//  https://en.wikipedia.org/wiki/Longitude

	for( 
		
		let 
		phiDelta = phiLength / longitudeLinesTotal, 
		phi = phiStart, 
		arc = createLongitudeArc( radius, longitudeLineSegments, thetaStart + Math.PI / 2, thetaLength ); 
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
		geometry = createLatitudeArc( arcR, latitudeLineSegments, phiStart, phiLength )
	
		geometry.rotateX( Math.PI / 2 )
		geometry.rotateY( Math.PI / 2 )
		geometry.translate( 0, arcH, 0 )
		sphere.add( new THREE.Line( geometry, latitudeLinesMaterial ))
	}


	return sphere
}



