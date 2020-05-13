



#  Minify and pack Q.js from the command line with:
#  . build.sh




#  Requires that Webpack is installed.
#  See: https://webpack.js.org/api/cli/

if hash webpack 2>/dev/null; then
	
	webpack \
		../Q/Q.js \
		../Q/Q-ComplexNumber.js \
		../Q/Q-Matrix.js \
		../Q/Q-Qubit.js \
		../Q/Q-Gate.js \
		../Q/Q-History.js \
		../Q/Q-Circuit.js \
		../Q/Q-Circuit-Editor.js \
		--mode=production \
		--progress=true \
		--output=q.min.js

fi

