var vertexShaderText = 
[
'precision mediump float;',
'attribute vec2 vertPosition;',
'void main()',
'{',
'	gl_Position = vec4(vertPosition, 0.0, 1.0);',
'}'
].join('\n');

var fragmentShaderText = 
[
'precision mediump float;',
'void main()',
'{',
'	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);',
'}'
].join('\n');

var init = function()
{
	console.log('This is working');

	var canvas = document.getElementById('webgl-canvas');
	var gl = canvas.getContext('webgl');
	if (!gl)
	{
		console.log('experimental webgl...');
		gl = canvas.getContext('experimental-webgl');
	}
	if (!gl)
	{
		alert('WebGL is not supported!');
	}

	gl.clearColor(0.75,0.85,0.8,1.0);
	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);


	/*
	Create shaders
	*/
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
	{
		console.error('Error compiling vertex shader', gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
	{
		console.error('Error compiling vertex shader', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS))
	{
		console.error('Error linking program', gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS))
	{
		console.error('Error validating program', gl.getProgramInfoLog(program));
		return;
	}

	/*
	Create buffer
	*/
	var triangleVertices = 
	[
		0.0, 0.5,
		-0.5, -0.5,
		0.5, -0.5,
		0.0, 0.5,
	];

	var triangleVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	gl.vertexAttribPointer(
		positionAttribLocation, // attr location
		2, // number of elements per attr
		gl.FLOAT, // type of elements
		gl.FALSE,
		2 * Float32Array.BYTES_PER_ELEMENT, // size of an individual vertes
		0 * Float32Array.BYTES_PER_ELEMENT, // offset from the beginning of a single vertex to this attribute
	);

	gl.enableVertexAttribArray(positionAttribLocation);

	/*
	Main render loop
	*/
	gl.useProgram(program);

	// полый треугольник
	gl.drawArrays(gl.LINES, 0, 2);
	gl.drawArrays(gl.LINES, 1, 2);
	gl.drawArrays(gl.LINES, 2, 2);

	// заполненный треугольник
	/*gl.drawArrays(gl.TRIANGLES, 0, 3);*/

	/*gl.drawArrays(gl.LINES, 0, 6)
	gl.drawArrays(gl.LINES, 6, 6);
	gl.drawArrays(gl.LINES, 12, 6);
	gl.drawArrays(gl.LINES, 18, 4);
	gl.drawArrays(gl.LINES, 22, 10);*/
}