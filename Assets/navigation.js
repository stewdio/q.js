



document.addEventListener( 'DOMContentLoaded', function(){


	const nav = document.createElement( 'nav' )
	nav.innerHTML = `

		<header>			
			<img src="Assets/q.png">
		</header>
		<ul>
			<li><a href="index.html">Q</a></li>
			<li><a href="ComplexNumber.html">ComplexNumber</a></li>
			<li><a href="Matrix.html">Matrix</a></li>
			<li><a href="Qubit.html">Qubit</a></li>
			<li><a href="Gate.html">Gate</a></li>
		</ul>
	`
	document.body.appendChild( nav )
	Array.from( nav.getElementsByTagName( 'a' )).forEach( function( link ){

		if( link.pathname === document.location.pathname ) link.classList.add( 'selected' )
	})
})



