
//  Copyright © 2019–2020, Stewart Smith. See LICENSE for details.




let hashTarget
function onHashChange( freshLoad ){

	let title = document.title


	//  If a hashTarget exists from a previous call
	//  then it already has a 'hash-target' class on it
	//  which we should remove.

	if( hashTarget ) hashTarget.classList.remove( 'hash-target' )


	//  If this is a transition TO a hashTarget
	//  as opposed to a transition to the bare page
	//  then we need to update our hashTarget variable
	//  and create an extended “title” for our stats.

	if( location.hash ){

		hashTarget = document.getElementById( location.hash.substr( 1 ))
		tilte = title +' ⟩ '+ hashTarget.innerText.replace( /\n|\r|#/g, '' )
	}
	else hashTarget = null


	//  If we have a hash target 
	//  OR if this is not a frersh page load
	//  then we should note what the hash is.

	if(( hashTarget || freshLoad !== true ) && 
		window.ga !== undefined && 
		typeof window.ga === 'function' ){

		ga( 'send', {

			hitType: 'pageview',
			page:  location.pathname + location.search + location.hash,
			title: title
		})
	}


	//  Finally, if there’s a hash target
	//  then we should smoothly scroll to it.

	if( hashTarget ){

		hashTarget.classList.add( 'hash-target' )

		const 
		rootEm  = parseFloat( window.getComputedStyle( document.body ).fontSize ),
		compact = document.body.offsetWidth < 600,
		yBuffer = compact ? rootEm * 5 : 0,
		bounds  = hashTarget.getBoundingClientRect(),
		yTarget = bounds.top - yBuffer + window.scrollY

		window.scrollTo({ left: 0, top: yTarget, behavior: 'smooth' })
	}
	return false
}




document.addEventListener( 'DOMContentLoaded', function(){

	const 
	nav = document.createElement( 'nav' ),
	home = window.location.protocol === 'file:' ? 'index.html' : '/'
	
	nav.innerHTML = `
		<h1>
			<a href="${ home }"><img src="assets/Q-mark.png" title="Quantum JavaScript (Q.js)" alt="Q.js brand mark"></a>
		</h1>
		<ul>
			<li><h2><a href="${ home }">Introducing Q.js</a></h2></li>
			<li><h2><a href="resources.html">Quantum concepts</a></h2></li>
			<li><h2><a href="playground.html">Circuit playground</a></h2></li>
			<li><h2><a href="tutorials.html">Circuit tutorials</a></h2></li>
			<li><h2><a href="contributing.html">Join our project</a></h2></li>
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

	
	onHashChange( true )
	window.addEventListener( 'hashchange', onHashChange, false )


	//  Let’s redirect folks from the old GitHub page
	//  to our shiny new domain name.

	// if( window.location.host === 'stewdio.github.io' &&
	// 	window.location.pathname.startsWith( '/q.js/' )){

	// 	const 
	// 	url = 'https://quantumjavascript.app/' +
	// 		document.location.pathname.substr( 6 ) +
	// 		document.location.hash
	
	// 	window.location = url
	// }
})



