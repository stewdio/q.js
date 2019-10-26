



let hashTarget
function onHashChange(){

	if( hashTarget    ) hashTarget.classList.remove( 'hash-target' )
	if( location.hash ) hashTarget = document.getElementById( location.hash.substr( 1 ))
	if( hashTarget    ){

		hashTarget.classList.add( 'hash-target' )
		setTimeout( function(){

			const 
			//nav = document.getElementsByTagName( 'nav' )[ 0 ],
			//navIsExpanded = nav.classList.contains( 'expand' ),
			//navHeight = nav.offsetHeight,
			rootEm = parseFloat( window.getComputedStyle( document.body ).fontSize ),
			dropAmount = rootEm * 10// + ( navIsExpanded === true ? navHeight : 0 )

			window.scrollTo( 

				hashTarget.offsetLeft,
				hashTarget.offsetTop - dropAmount
			)

		}, 10 )
	}
}
window.addEventListener( 'hashchange', onHashChange, false )




document.addEventListener( 'DOMContentLoaded', function(){

	const nav = document.createElement( 'nav' )
	nav.innerHTML = `
		<header>
			<h1>
				<a href="index.html">
					<svg viewBox="0 0 1200 600" role="img">
						<title>Q.js</title>
						<path d="M426.234,368.412l-26.026-15.935c0.874-5.983,1.344-12.491,1.344-19.639l-0.555-65.677
							c0-64.459-36.182-79.662-96.993-79.662H195.76c-60.811,0-96.994,15.202-96.994,79.662v65.677c0,64.459,36.183,79.662,96.994,79.662
							h108.798c29.44,0,53.085-3.586,69.67-14.576L398.26,412.5L426.234,368.412z M292.448,355.946h-85.742
							c-31.926,0-38.615-12.163-38.615-44.088v-23.716c0-27.365,6.689-44.088,42.264-44.088h79.054c35.575,0,42.264,16.723,42.264,44.088
							l-0.566,22.025l-63.285-38.748l-27.973,45l64.058,38.853C300.502,355.722,296.706,355.946,292.448,355.946z M450,600H0V0h450
							l150,300L450,600z"/>
						<path d="M697.8,329.1H725.4v17.1c0,34.2,8.4,41.4,46.2,41.4h51.301c33.9,0,48-5.7,48-33.601V191.998h29.4V348.3
							c0,50.1-21.6,63.3-75,63.3h-55.801c-51.601,0-71.701-17.7-71.701-58.5V329.1z"/>
						<path d="M948.397,340.799h27.601V356.1c0,21.3,11.399,31.5,48,31.5h91.201c42.601,0,55.2-9,55.2-40.2c0-27.301-10.8-34.2-47.4-34.2
							h-55.801c-89.7,0-119.101-5.4-119.101-63.001c0-49.5,29.4-60.601,90.001-60.601h63.3c72.901,0,91.201,18.6,91.201,57.3v7.5H1165
							c-0.601-34.5-4.2-40.8-81.302-40.8h-31.2c-56.7,0-76.801,3-76.801,38.701c0,25.8,8.101,34.5,54.001,34.5h87.001
							c57.301,0,81.301,16.5,81.301,53.401V354.3c0,53.4-43.801,57.3-87.301,57.3h-81.602c-42.9,0-80.7-7.5-80.7-54.9V340.799z"/>
					</svg>
				</a>
			</h1>
			<div id="veggie-burger">
				<div id="vb-top-dexter"></div>
				<div id="vb-middle"></div>
				<div id="vb-bottom-sinister"></div>
			</div>
		</header>
		<ul>
			<li><h2><a href="Q.html">Q</a></h2></li>
			<li><h2><a href="ComplexNumber.html">ComplexNumber</a></h2></li>
			<li><h2><a href="Matrix.html">Matrix</a></h2></li>
			<li><h2><a href="Qubit.html">Qubit</a></h2></li>
			<li><h2><a href="Gate.html">Gate</a></h2></li>
			<li><h2><a href="Circuit.html">Circuit</a></h2></li>
		</ul>
	`
	document.body.appendChild( nav )
	// document.body.prepend( nav )
	Array.from( nav.getElementsByTagName( 'a' )).forEach( function( link ){

		if( link.pathname === document.location.pathname ||
			link.pathname === document.location.pathname +'index.html' ){
			
			link.classList.add( 'selected' )
		}
	})
	if( nav.querySelectorAll( 'h1 a.selected' ).length ){

		nav.classList.add( 'home' )
	}


	const 
	vb = document.getElementById( 'veggie-burger' ),
	vbOpen  = function(){

		nav.classList.add( 'expand' )
		vb.isOpen = true
	},
	vbClose = function(){

		nav.classList.remove( 'expand' )
		vb.isOpen = false
	},
	vbToggle = function( event ){

		event.preventDefault()
		event.stopPropagation()
		if( vb.isOpen ) vbClose()
		else vbOpen()
	}
	
	vb.isOpen = false
	//vb.addEventListener( 'mousedown', vbToggle )
	// vb.addEventListener( 'touchstart', vbToggle )
	vb.addEventListener( 'click', vbToggle )
	document.querySelector( 'main' ).addEventListener( 'click', vbClose )

	
	Array.from( document.querySelectorAll( 'main h2, main h3, main h4' )).forEach( function( el ){

		if( el.getAttribute( 'id' ) === null ){

			el.setAttribute( 'id', el.innerText.trim().replace( /\s+/g, '_' ))
		}
		
		const 
		container = document.createElement( 'span' ),
		link = document.createElement( 'a' )
		
		container.classList.add( 'section-anchor' )
		container.appendChild( link )
		link.setAttribute( 'href', '#'+ el.getAttribute( 'id' ))
		link.innerText = '§'
		el.insertAdjacentElement( 'afterbegin', container )
	})


	Array.from( document.querySelectorAll( 'dt[id]' )).forEach( function( el ){
		
		const 
		container = document.createElement( 'span' ),
		link = document.createElement( 'a' )
		
		container.classList.add( 'section-anchor' )
		container.appendChild( link )
		link.setAttribute( 'href', '#'+ el.getAttribute( 'id' ))
		link.innerText = '§'
		el.insertAdjacentElement( 'afterbegin', container )
	})


	onHashChange()
})



