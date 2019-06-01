

![Q.js](https://github.com/stewdio/q.js/raw/master/Assets/q-website.png "Q.js")

Q is quantum computing in your browser.
(What?!)
Okay, okay, it’s a quantum circuit <em>simulator</em>—because you can’t do actual quantum computing using whatever non-quantum device you’re reading this on.
(So why build this?)
The same reason Google, IBM, and Microsoft build quantum simulators:
to explore quantum circuit design using a cheap and easy medium before applying those designs to the real hardware.
I started Q in April 2019
as a way to learn about quantum computing, 
share that learning with others,
and do some actual quantum circuit programming.
Q’s source code—including this documentation—is available for download from GitHub at
[https://github.com/stewdio/q.js](https://github.com/stewdio/q.js).
The documentation website is live at
[https://stewdio.github.io/q.js](https://stewdio.github.io/q.js).

Drop in `index.html` to start learning how Q works. 
Or if you just want to launch a qubit in to 
superposition straight away then have at it:  
`Q.Gate.HADAMARD.applyTo( Q.Qubit.HORIZONTAL )`  

Or perform the most superfluous coin-flip code ever:  
```
Q.Gate.HADAMARD
  .applyTo( Q.Qubit.HORIZONTAL )
  .collapse()
  .targetBit
  .toString()
```



