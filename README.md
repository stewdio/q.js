

![Quantum JavaScript (Q.js)](./assets/Q-mark.svg "Quantum JavaScript (Q.js)")  

Quantum JavaScript (Q.js)
========================================================================

**Quantum, made easy.**  
Q is a quantum circuit simulator, drag-and-drop circuit editor, and 
powerful JavaScript library that runs right here in your web browser. 
There’s nothing to install and nothing to configure, so jump right in 
and experiment! Fire up the [Q editor](https://quantumjavascript.app), 
then tap and drag the pieces around to get a feel for how it works. 
It’s easy to use on both desktop and mobile devices. Made a mistake? 
Just tap the Undo button.

![Q editor demo](./assets/demos/Q-demo-bellstate.gif)  
  
  
Free and open-source
------------------------------------------------------------------------
Q is free to use, our code is open-source, and our API is heavily 
documented. Still a quantum novice? Each page of API documentation 
includes simple explanations of basic quantum concepts to get you up to 
speed quickly. This makes Q ideal for the classroom as well as 
autodidacts at home. Q just might be the most accessible quantum 
circuit suite in the world. Join our project on GitHub at
[https://github.com/stewdio/q.js](https://github.com/stewdio/q.js)
and drop a link to Q’s website
[https://quantumjavascript.app](https://quantumjavascript.app)
on social media with the hashtag 
[#Qjs](https://twitter.com/search?q=%23Qjs).
Let’s make quantum computing accessible!
  
  


Quantum JavaScript
========================================================================
What does coding a quantum circuit look like? Let’s recreate the above
[Bell state](https://en.wikipedia.org/wiki/Bell_state) using **three 
separate circuit authoring styles** to demonstrate Q’s flexibility. For 
each of the three examples we’ll create a circuit that uses 2 qubit 
registers for 2 moments of time. We’ll place a 
[Hadamard](https://quantumjavascript.app/Q-Gate.html#.HADAMARD)
gate at moment 1 on register 1. Then we’ll place a 
[Controlled-Not](https://quantumjavascript.app/Q-Gate.html#.PAULI_X) 
gate at moment 2, with its control component on register 1 and its 
target component on register 2.  
  

**1. Text as input**  
Q’s 
[text-as-input](https://quantumjavascript.app/Q-Circuit.html#.fromText) 
feature directly converts your text into a functioning quantum circuit. 
Just type your operations out as if creating a text-only circuit diagram
(using “I” for 
[identity gates](https://quantumjavascript.app/Q-Gate.html#.IDENTITY)
in the spots where no operations occur) and enclose your text block in 
[backticks](https://en.wikipedia.org/wiki/Grave_accent) (instead of 
quotation marks). Note that parentheses are not required to invoke the 
function call when using backticks.

```javascript
Q`
    H  X#0
    I  X#1
`
```  


**2. Python-inspired**  
Folks coming to Q from Python-based quantum suites may find this syntax 
more familiar. Here the [`Q`](https://quantumjavascript.app/Q.html) 
function expects the number of qubit registers to use, followed by the 
number of moments to use. Afterward, each single-letter quantum gate 
label is also a function name. For these functions the first argument 
is a moment index and the second is a qubit register index or array of 
qubit register indices.

```javascript
Q( 2, 2 )
    .h( 1, 1 )
    .x( 2, [ 1, 2 ])
```  


**3. Verbose for clarity**  
Under the hood, Q is making more verbose declarations. You can also 
make direct declarations like so. (And 
[what are those dollar signs about?](https://quantumjavascript.app/contributing.html#Destructive_vs_non-destructive_methods))
```javascript
new Q.Circuit( 2, 2 )
    .set$( Q.Gate.HADAMARD, 1, 1 )
    .set$( Q.Gate.PAULI_X, 2, [ 1, 2 ])
```  


**More variations**  
There are many ways to build a quantum circuit with Q. What feels right 
for you? To learn more about 
[Q’s text syntax](https://quantumjavascript.app/Q-Circuit.html#.fromText)
and other convenience tricks, see 
[“Writing quantum circuits.”](https://quantumjavascript.app/Q-Circuit.html#Writing_quantum_circuits)  
  
  
  
  
Clear, legible output
========================================================================
Whether you use Q’s drag-and-drop circuit editor interface,
[text syntax](https://quantumjavascript.app/Q-Circuit.html#.fromText),
Python-inspired syntax, or prefer to type out every 
[set$](https://quantumjavascript.app/Q-Circuit.html#.set$) command 
yourself, Q makes inspecting and evaluating your circuits easy.
  
Let’s add two commands which could directly follow any of the three 
examples above. Hey—deciding what to name a circuit can sometimes be 
difficult, so we’ll let Q choose a random name for us. Then we’ll 
generate an outcome probabilities report. Just add the following two 
lines to any of the above examples:

```javascript
.setName$( Q.getRandomName$ )
.evaluate$()
```

And that combination will yield 
something like the following:

```
Beginning evaluation for “Red kangaroo”

         m1    m2   
        ┌───┐╭─────╮
r1  |0⟩─┤ H ├┤ X#0 │
        └───┘╰──┬──╯
             ╭──┴──╮
r2  |0⟩───○──┤ X#1 │
             ╰─────╯

██████████░░░░░░░░░░  50%   1 of 2
████████████████████ 100%   2 of 2


Evaluation completed for “Red kangaroo”
with these results:

1  |00⟩  ██████████░░░░░░░░░░  50% chance
2  |01⟩  ░░░░░░░░░░░░░░░░░░░░   0% chance
3  |10⟩  ░░░░░░░░░░░░░░░░░░░░   0% chance
4  |11⟩  ██████████░░░░░░░░░░  50% chance

```




Import and export
========================================================================
Q plays well with everyone. Export your circuits as 
[plain text](https://quantumjavascript.app/Q-Circuit.html#.toText), 
[ASCII diagrams](https://quantumjavascript.app/Q-Circuit.html#.toDiagram), 
[interactive graphic-user-interfaces](https://quantumjavascript.app/Q-Circuit.html#.toDom),
[LaTeX code](https://quantumjavascript.app/Q-Circuit.html#.toLatex),
and more!
Visit the [Q playground](https://quantumjavascript.app/playground.html)
to experiment with converting circuits between various formats.
As always, new features are in the works.
[Join our project on GitHub](https://github.com/stewdio/q.js)
and help us build bridges to everywhere.  
  
  
  
  
Give Q a try right now at 
[https://quantumjavascript.app](https://quantumjavascript.app).



