

#  From your command line
#  inside the folder containing this file
#  type “. build.sh” (without the quotes)
#  to recompile the .js and .css files.


 cat \
	../Q/Q.js \
	../Q/Q-ComplexNumber.js \
	../Q/Q-Matrix.js \
	../Q/Q-Qubit.js \
	../Q/Q-Gate.js \
	../Q/Q-History.js \
	../Q/Q-Circuit.js \
	../Q/Q-Circuit-Editor.js \
	> 'q.js'

 cat \
	../Q/Q.css \
	../Q/Q-Circuit-Editor.css \
	> 'q.css'



