

![Q.js](./Assets/q-mark.svg)  

Q is quantum computing in your browser.
(What?!)
Okay, okay, it’s a quantum circuit <em>simulator</em>—because you can’t do actual quantum computing using whatever non-quantum device you’re reading this on.
(So why build this?)
The same reason Google, IBM, and Microsoft build quantum simulators:
to explore quantum circuit design using a cheap and easy medium before applying those designs to the real hardware.
Learn more at [https://stewdio.github.io/q.js](https://stewdio.github.io/q.js).


It’s easy
------------------------------------------------------------------------------
Ready to perform the most superfluous coin-flip code ever? Load up the Q 
website at
[https://stewdio.github.io/q.js](https://stewdio.github.io/q.js)
and paste this in to your JavaScript console:
```javascript
Q`H`.try$()
``` 
Each time you run the above code there’s a 50% chance of receiving a 
"0"—let’s call that heads—and a 50% chance of receiving a "1"—and we’ll call 
that tails. Go ahead and try it out. 

