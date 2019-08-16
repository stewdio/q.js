



#  Minify and pack Q.js from the command line with:
#  . build.sh
#  Requires that Webpack is installed.
#  See: https://webpack.js.org/api/cli/

webpack \
	../../Q/Q.js \
	../../Q/ComplexNumber.js \
	../../Q/Matrix.js \
	../../Q/Qubit.js \
	../../Q/Gate.js \
	../../Q/Circuit.js \
	-o Q-R4-webpack.js



