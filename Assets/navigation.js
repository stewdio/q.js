



let hashTarget
function onHashChange(){

	if( hashTarget ) hashTarget.classList.remove( 'hash-target' )
	hashTarget = document.getElementById( location.hash.substr( 1 ))
	if( hashTarget ) hashTarget.classList.add( 'hash-target' )
}
window.addEventListener( 'hashchange', onHashChange, false )




document.addEventListener( 'DOMContentLoaded', function(){


	const nav = document.createElement( 'nav' )
	nav.innerHTML = `

		<header>			
			<h1>
				<svg viewBox="0 0 600 600" role="img">
					<title>Q.js</title>
					<path d="M426.234,368.412l-26.026-15.935c0.874-5.983,1.344-12.491,1.344-19.639l-0.555-65.677
						c0-64.459-36.182-79.662-96.993-79.662H195.76c-60.811,0-96.994,15.202-96.994,79.662v65.677c0,64.459,36.183,79.662,96.994,79.662
						h108.798c29.44,0,53.085-3.586,69.67-14.576L398.26,412.5L426.234,368.412z M292.448,355.946h-85.742
						c-31.926,0-38.615-12.163-38.615-44.088v-23.716c0-27.365,6.689-44.088,42.264-44.088h79.054c35.575,0,42.264,16.723,42.264,44.088
						l-0.566,22.025l-63.285-38.748l-27.973,45l64.058,38.853C300.502,355.722,296.706,355.946,292.448,355.946z M450,600H0V0h450
						l150,300L450,600z"/>
				</svg>
			</h1>
		</header>
		<ul>
			<li><h2><a href="index.html">Q</a></h2></li>
			<li><h2><a href="ComplexNumber.html">ComplexNumber</a></h2></li>
			<li><a href="Matrix.html">Matrix</a></li>
			<li><a href="Qubit.html">Qubit</a></li>
			<li><a href="Gate.html">Gate</a></li>
			<li><a href="Circuit.html">Circuit</a></li>
		</ul>
	`
	document.body.appendChild( nav )
	Array.from( nav.getElementsByTagName( 'a' )).forEach( function( link ){

		if( link.pathname === document.location.pathname ||
			link.pathname === document.location.pathname +'index.html' ){
			
			link.classList.add( 'selected' )
		}
	})

	
	onHashChange()
})



