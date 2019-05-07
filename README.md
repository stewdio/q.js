

Q.js
==============================================================================

Q.js is quantum computing in your browser. I’m just learning how quantum 
computation works—and I’m writing Q.js as I go along. This is starting small, 
but I think it’s got big potential. Right now all the action is in your 
JavaScript console, so open that up!

The examples you see in the console are coming from `index.html`. Open that up
to see how it all works. Or if you just want to launch a qubit in to 
superposition straight away then have at it:  
`Q.Gate.HADAMARD.applyTo( Q.Qubit.HORIZONTAL )`  

Or perform the most superfluous coin-flip code ever:  
`Q.Gate.HADAMARD.applyTo( Q.Qubit.HORIZONTAL ).collapse().toTSV()`


&nbsp;  


Qubit
------------------------------------------------------------------------------
A qubit is represented by `Q.Matrix([ a ],[ b ])` where ‘a’ and ‘b’ are 
(ideally) complex numbers such that a² + b² = 1. 

`a` represents the “control bit” while `b` represents  the “target bit.” A 
qubit may be in superposition, _ie._ its target bit is neither `0` or `1` and computationally exists as _both_ `0` and `1` at the same time. The probability
that the qubit will “collapse” to 0 is `a`², while the probability that the 
qubit will “collapse” to 1 is `b`².

• Qubit( 1, 0 ) has a 100% chance of collapsing to `0`.  
• Qubit( 0, 1 ) has a 100% chance of collapsing to `1`.  
• Qubit( 1÷√2, 1÷√2 ) has a 50% chance of collapsing to `0` and a 50% chance 
of collapsing to `1`.  

&nbsp;   

**Bloch sphere**

If we plot all of the possible values for `a` and `b` on a standard graph it
will create a circle with a radius of 1, centered at the origin (0, 0) -- a 
unit circle. This is the visual result of our rule that `a`² + `b`² = `1`:
```
             
               ( 0, 1 )  Vertical
                   │
   ( -1÷√2, 1÷√2 ) │ ( 1÷√2, 1÷√2 )  Diagonal
                ╲  │  ╱
                 ╲ │ ╱
                  ╲│╱
  ( -1, 0 )────────╳────────( 1, 0 )  Horizontal
                  ╱│╲
                 ╱ │ ╲
                ╱  │  ╲
  ( -1÷√2, -1÷√2 ) │ ( 1÷√2, -1÷√2 )  Anti-diagonal
                   │
                   │
               ( 0, -1 )
```

If we allow complex numbers like ‘`i`’ (√-1) then our 2D circle becomes a 3D sphere like so:   https://en.wikipedia.org/wiki/Bloch_sphere
For our current (simple) purposes we can use real numbers and a 2D unit circle.

Our unit circle or unit sphere can be used as a state machine for quantum 
compuation.



