



Q.Board = function(){


	this.moments = []
}



Q.Board.prototype.run = function(){

	moments.forEach( function( moment ){

		
	})
}




/*



https://en.wikipedia.org/wiki/List_of_quantum_processors




simple 5 x 2 board:


|0⟩ -- 1 -- 2 -- 3 -- M

|0⟩ -- 1 -- 2 -- 3 -- M

Can drop whatever Q.Gate.constants has on those spots!






google bristlecone (staggered) 6  x 12 lattice

|0⟩ ---- 1 -- 2 -- 3 -- 4 -- M

|0⟩ -- 1 -- 2 -- 3 -- 4 -- M

|0⟩ ---- 1 -- 2 -- 3 -- 4 -- M

|0⟩ -- 1 -- 2 -- 3 -- 4 -- M

|0⟩ -- 1 -- 2 -- 3 -- 4 -- M

|0⟩ ---- 1 -- 2 -- 3 -- 4 -- M

|0⟩ -- 1 -- 2 -- 3 -- 4 -- M

|0⟩ ---- 1 -- 2 -- 3 -- 4 -- M

|0⟩ -- 1 -- 2 -- 3 -- 4 -- M

|0⟩ ---- 1 -- 2 -- 3 -- 4 -- M

|0⟩ -- 1 -- 2 -- 3 -- 4 -- M

|0⟩ ---- 1 -- 2 -- 3 -- 4 -- M



continuous run!
constantly cycling the circuit.

with each change to the board reset the history
	and start cycling immediately
	and keep track of all results

cannot wait to get this running on WebGPU!


*/