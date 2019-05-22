



document.addEventListener( 'DOMContentLoaded', function(){


	const nav = document.createElement( 'nav' )
	nav.innerHTML = `

		<header>			
			<img src="Assets/q.png">
		</header>
		<ul>
			<li><a href="index.html"><span class="topic-number">1</span> Q</a></li>
			<li><a href="ComplexNumber.html"><span class="topic-number">2</span> ComplexNumber</a></li>
			<li><a href="Matrix.html"><span class="topic-number">3</span> Matrix</a></li>
			<li><a href="Qubit.html"><span class="topic-number">4</span> Qubit</a></li>
			<li><a href="Gate.html"><span class="topic-number">5</span> Gate</a></li>
		</ul>
	`
	document.body.appendChild( nav )
	Array.from( nav.getElementsByTagName( 'a' )).forEach( function( link ){

		if( link.pathname === document.location.pathname ) link.classList.add( 'selected' )
	})
})



