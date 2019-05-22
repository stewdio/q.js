

![Q.js](https://github.com/stewdio/q.js/raw/master/Assets/q.png "Q.js")

Quantum computing in your browser! I’m just learning how quantum 
computation works—and I’m writing Q.js as I go along. This is starting small, 
but I think it’s got big potential. Right now all the action is in your 
JavaScript console, so open that up!

Drop in `index.html` to start learning how Q works. 
Or if you just want to launch a qubit in to 
superposition straight away then have at it:  
`Q.Gate.HADAMARD.applyTo( Q.Qubit.HORIZONTAL )`  

Or perform the most superfluous coin-flip code ever:  
`Q.Gate.HADAMARD.applyTo( Q.Qubit.HORIZONTAL ).collapse().targetBit`

&nbsp;  

**Update**: I’ve just added a `Q.ComplexNumber` class, but still need to re-tool 
`Q.Matrix` and `Q.Qubit` to take advantage of it. 
Also, you might notice the variable naming across Q.js is verbose. I’m writing this as a learning / teaching tool. The code should not only explain
what it does funcationally, but also explain the math behind it and provide
links to external references for further study.



&nbsp;  


Qubit
------------------------------------------------------------------------------
A [qubit](https://en.wikipedia.org/wiki/Qubit) takes the form 
`Q.Qubit( a, b )` and is represented internally by `Q.Matrix([ a ],[ b ])` 
where the following must be true: `a` × `a` + `b` × `b` = `1`.
If brevity’s your thing, that’s the same as `a`² + `b`² = `1`. Ideally ‘`a`’ 
and ‘`b`’ can be 
[complex numbers](https://en.wikipedia.org/wiki/Complex_number),
(_eg._ the imaginary number _i_ which is equal to √-1),
but **Q.js** does not _yet_ support complex numbers; patience!

_Create a new qubit:_  
`const ourQubit = new Q.Qubit( 0, 1 )`

Our ‘`a`’ argument represents our qubit’s “control bit” while our ‘`b`’ 
argument represents our quibit’s “target bit”—the part we are ultimately 
concerned with. A qubit may be in 
[superposition](https://en.wikipedia.org/wiki/Quantum_superposition), _ie._ 
its target bit is neither `0` or `1` and computationally exists as _both_ `0` 
and `1` at the same time. The probability that the qubit will “collapse” to 
`0` is `a`², while the probability that the qubit will “collapse” to `1` is 
`b`². Therefore the following are true:  
• `Qubit( 1, 0 )` has a 100% chance of collapsing to `0`.  
• `Qubit( 0, 1 )` has a 100% chance of collapsing to `1`.  
• `Qubit( 1÷√2, 1÷√2 )` has a 50% chance of collapsing to `0` and a 50% chance
of collapsing to `1`.  

&nbsp;   

**Bloch sphere**

If we plot all of the possible values for ‘`a`’ and ‘`b`’ on a standard graph
it will create a circle with a radius of `1`, centered at the origin (0, 0) —
a [unit circle](https://en.wikipedia.org/wiki/Unit_circle). This is the visual
result of our rule that `a`² + `b`² = `1`:
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

If we allow for complex numbers like _i_ then our 2D circle becomes a 3D 
[Bloch sphere](https://en.wikipedia.org/wiki/Bloch_sphere).
For the moment, without support for complex numbers, Q.js limits itself to 
[real numbers](https://en.wikipedia.org/wiki/Real_number) only and therefore 
a 2D unit circle.

Our unit circle or unit sphere can be used as a state machine for quantum 
compuation, though **Q.js** currently focusses on matrices for calculation.

&nbsp;  


**Constants**

`Q.Qubit` provides the following built-in 
[Jones vector](https://en.wikipedia.org/wiki/Jones_calculus#Jones_vectors)
constants:  
• `HORIZONTAL` = `new Q.Qubit( 1, 0 )`  
• `VERTICAL` = `new Q.Qubit( 0, 1 )`  
• `DIAGONAL` = `new Q.Qubit( Math.SQRT1_2,  Math.SQRT1_2 )`  
• `ANTI_DIAGONAL` = `new Q.Qubit( Math.SQRT1_2, -Math.SQRT1_2 )`  
Constants for “Right-hand circular polarized” (RHCP) and 
“Left-hand circular polarized” (LHCP) will be supported once **Q.js** 
supports complex numbers.



