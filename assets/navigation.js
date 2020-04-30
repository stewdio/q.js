
//  Copyright © 2019–2020, Stewart Smith. See LICENSE for details.




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
			rootEm  = parseFloat( window.getComputedStyle( document.body ).fontSize ),
			yBuffer = rootEm * 10,// + ( navIsExpanded === true ? navHeight : 0 )
			bounds  = hashTarget.getBoundingClientRect(),
			yTarget = bounds.top - yBuffer + window.scrollY

			window.scrollTo({ left: 0, top: yTarget, behavior: 'smooth' })

		}, 10 )
	}
}




document.addEventListener( 'DOMContentLoaded', function(){

	const 
	nav = document.createElement( 'nav' ),
	home = window.location.protocol === 'file:' ? 'index.html' : '/'
	
	nav.innerHTML = `
		<header>
			<h1>
				<!-- a href="${ home }" -->
					<svg viewBox="0 0 600 600" role="img">
						<title>Q.js</title>
						<path d="M489.175,427.308C448.217,488.051,378.774,528,300,528C174.079,528,72,425.921,72,300c0-26.927,4.668-52.764,13.238-76.745
							C57.635,397.355,388.425,542.099,489.175,427.308z"/>
						<g>
							<path d="M300.002,245.499c-27,0-46.5,21-46.5,49.5c0,28.501,19.5,49.501,46.5,49.501c9.6,0,18.601-2.7,25.8-7.5l-18.899-18.9
								l16.2-16.2l17.7,18c3.6-7.2,5.699-15.6,5.699-24.9C346.502,266.499,327.002,245.499,300.002,245.499z"/>
							<path d="M300,72c-88.322,0-164.914,50.22-202.779,123.663c-58.19,176.018,319.112,345.692,407.429,204.965
								C519.601,370.278,528,336.12,528,300C528,174.079,425.921,72,300,72z M363.303,374.5l-16.2-16.2c-12.9,9.3-28.801,14.7-47.101,14.7
								c-45,0-78.001-33-78.001-78.001c0-45,33-78,78.001-78c45,0,78.001,33,78.001,78c0,18.301-5.4,34.501-14.7,47.101l16.2,16.2
								L363.303,374.5z"/>
						</g>
						<path d="M473.747,490.002h6v18.6c0,6.899-5.1,12-12,12c-6.899,0-11.999-5.101-11.999-12h6c0,3.6,2.579,6.3,5.999,6.3s6-2.7,6-6.3
							V490.002z"/>
						<path d="M510.047,510.821c0-2.399-2.641-3.42-8.64-3.42c-9.479,0-13.56-2.52-13.56-8.579c0-6.12,4.8-9.42,13.8-9.42
							c8.279,0,13.799,3.84,13.799,9.6h-6c0-2.52-3.12-4.2-7.799-4.2c-5.101,0-7.8,1.381-7.8,4.021c0,2.279,2.399,3.18,8.1,3.18
							c9.899,0,14.099,2.7,14.099,8.819c0,6.36-5.039,9.78-14.398,9.78c-8.64,0-14.399-3.84-14.399-9.6h5.999c0,2.52,3.36,4.199,8.4,4.199
							C507.106,515.201,510.047,513.642,510.047,510.821z"/>
					</svg>
				<!-- /a -->
			</h1>
		</header>
		<ul>
			<li><h2><a href="${ home }">What is Q?</a></h2></li>
			<li><h2><a href="playground.html">Playground</a></h2></li>
			<li><h2><a href="tutorials.html">Tutorials</a></h2></li>
			<li><h2><a href="resources.html">Resources</a></h2></li>
			<li><h2><a href="contributing.html">Contributing</a></h2></li>
		</ul>
		<p>API documentation</p>
		<ul>
			<li><h2><a href="Q.html"><code>Q</code></a></h2></li>
			<li><h2><a href="Q-ComplexNumber.html"><code class="q-prefix">ComplexNumber</code></a></h2></li>
			<li><h2><a href="Q-Matrix.html"><code class="q-prefix">Matrix</code></a></h2></li>
			<li><h2><a href="Q-Qubit.html"><code class="q-prefix">Qubit</code></a></h2></li>
			<li><h2><a href="Q-Gate.html"><code class="q-prefix">Gate</code></a></h2></li>
			<li><h2><a href="Q-Circuit.html"><code class="q-prefix">Circuit</code></a></h2></li>
		</ul>
		<div id="veggie-burger">
			<div id="vb-top-dexter"></div>
			<div id="vb-middle"></div>
			<div id="vb-bottom-sinister"></div>
		</div>
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

	
	Array.from( document.querySelectorAll( 'main h2, main h3, main h4, main h5' )).forEach( function( el ){

		if( el.getAttribute( 'id' ) === null ){

			el.setAttribute( 'id', el.innerText.trim().replace( /\s+/g, '_' ))
		}
		
		const 
		container = document.createElement( 'span' ),
		link = document.createElement( 'a' )
		
		container.classList.add( 'section-anchor' )
		container.appendChild( link )
		link.setAttribute( 'href', '#'+ el.getAttribute( 'id' ))
		link.innerText = '#'
		el.insertAdjacentElement( 'afterbegin', container )
	})


	Array.from( document.querySelectorAll( 'dt[id]' )).forEach( function( el ){
		
		const 
		container = document.createElement( 'div' ),
		link = document.createElement( 'a' )
		
		container.classList.add( 'section-anchor' )
		container.appendChild( link )
		link.setAttribute( 'href', '#'+ el.getAttribute( 'id' ))
		link.innerHTML = '&nbsp;'
		el.parentNode.appendChild( container )
	})

	
	onHashChange()
	window.addEventListener( 'hashchange', onHashChange, false )


	//  Let’s redirect folks from the old GitHub page
	//  to our shiny new domain name.

	if( window.location.host === 'stewdio.github.io' &&
		window.location.pathname.startsWith( '/q.js/' )){

		const 
		url = 'https://quantumjavascript.app/' +
			document.location.pathname.substr( 6 ) +
			document.location.hash
	
		window.location = url
	}
})



