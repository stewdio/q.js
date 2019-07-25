



#  Minify and pack Q.js from the command line with:
#  . build.sh
#  This requires that you have Minify installed.
#  See: https://www.npmjs.com/package/minify

minify \
	../../Q/Q.js \
	../../Q/ComplexNumber.js \
	../../Q/Matrix.js \
	../../Q/Qubit.js \
	../../Q/Gate.js \
	../../Q/Program.js \
	> Q.min.js


#  Q: Uglify’s real popular, why not use that?
#  A: Because Uglify doesn’t handle backticks! 



