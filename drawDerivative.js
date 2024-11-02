function drawDerivative(gl,f,minX=-1,maxX=1,minY=-1,maxY=1)
{

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader,`
        attribute vec4 position;
        attribute vec4 boundaries;
        float min_x;
        float max_x;
        float min_y;
        float max_y;
        float x;
        float y;


        void main() {

            min_x = boundaries[0];
            max_x = boundaries[1];
            min_y = boundaries[2];
            max_y = boundaries[3];

            x = 2.0 * ((position[0] + position[2])/2.0 - min_x)/(max_x - min_x) - 1.0;
            y = 2.0 * ((position[3] - position[1])/(position[2] - position[0]) - min_y)/(max_y - min_y) - 1.0;

            gl_Position = vec4(x, y, 0.0, 1.0);
            gl_PointSize = 1.0;   
        }
    `);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,`
        precision mediump float;
        void main() {
            gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
        }
    `);
    gl.compileShader(fragmentShader);


    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const points = [];
    for(let x=minX; x<maxX; x+=0.0001)
    {
        points.push(x,f(x));
    }
    const pointBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
    const boundariesLocation = gl.getAttribLocation(program,"boundaries");
    gl.vertexAttrib4f(boundariesLocation,minX,maxX,minY,maxY);
    const positionLocation = gl.getAttribLocation(program,"position");
    gl.vertexAttribPointer(positionLocation, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);

   
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
    gl.drawArrays(gl.POINTS, 0, points.length/4);

    gl.deleteBuffer(pointBuffer);
    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
}
