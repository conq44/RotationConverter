import RotationConverter from './rotconv.js';


const rotconv = new RotationConverter();


document.getElementById('quaternionInput').addEventListener('input', () => rotconv.lastUpdate = 'quaternion');
document.getElementById('matrixInput').addEventListener('input', () => rotconv.lastUpdate = 'matrix');
document.getElementById('eulerInput').addEventListener('input', () => rotconv.lastUpdate = 'euler');


document.getElementById('convert').addEventListener('click', function() {
    if(rotconv.lastUpdate == 'quaternion')
        rotconv.updateFromQuaternionInput();
    
    else if(rotconv.lastUpdate == 'quaternion')
        rotconv.updateFromMatrixInput();
    
    else if(rotconv.lastUpdate == 'euler')
        rotconv.updateFromEulerInput();    
        resetAxes();
        
    q1.premultiply(rotconv.quaternion);
    q2.premultiply(rotconv.quaternion);
    q3.premultiply(rotconv.quaternion);

});

document.getElementById('copymatrix').addEventListener('click', function() {
    copyMatrixToClipboard();
});

document.getElementById('reset').addEventListener('click', function() {
    resetquaternion()
});

window.addEventListener( 'resize', adjustWindow, false );
document.addEventListener('DOMContentLoaded', adjustWindow);


document.getElementById('matrixInput').addEventListener('paste', (event) => {
    event.preventDefault();
    console.log("potato");
    const text = (event.clipboardData || window.clipboardData).getData('text');
    console.log(text);
    const numbers = text.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
    console.log(numbers);
    let index = 0;
    // Assuming a 3x3 matrix for simplicity
    for (let i = 0; i < 3; i++) { // Row iterator
        for (let j = 0; j < 3; j++) { // Column iterator
            // Construct the selector for each input in the matrix
            const selector = `#matrixInput tr:nth-child(${i + 1}) td:nth-child(${j + 1}) input`;
            const input = document.querySelector(selector);
            
            // Update the input value with the matrix element, formatting to a fixed number of decimal places if desired
            input.value = numbers[index].toFixed(4);
            index ++;
        }
    };
});


const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x1111111 );

const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );
adjustWindow();

document.getElementById('threejs-canvas').appendChild(renderer.domElement);



const geometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5);
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );

const q= new THREE.Quaternion(0,0,0,1);

const q1 = new THREE.Quaternion(0,0.0,-0.707,0.707);
const q2 = new THREE.Quaternion(0,0,0,1);
const q3 = new THREE.Quaternion(0.707,0,0,0.707);

const rotmat = new THREE.Matrix4();
rotmat.makeRotationFromQuaternion(q);

// make arrows for visualization of rotations

const dirx = new THREE.Vector3( 1, 0, 0 );
const diry = new THREE.Vector3( 0, 1, 0 );
const dirz = new THREE.Vector3( 0, 0, 1 );


const origin = new THREE.Vector3( 0, 0, 0 );
const length = 1;
const hex_x = 0xff0000;
const hex_y= 0x00ff00;
const hex_z = 0x0000ff;

const arrowHelper_x = new THREE.ArrowHelper( dirx, origin, length, hex_x );
const arrowHelper_y = new THREE.ArrowHelper( diry, origin, length, hex_y );
const arrowHelper_z = new THREE.ArrowHelper( dirz, origin, length, hex_z);

// scene.add(cube);
scene.add( arrowHelper_x);
scene.add( arrowHelper_y);
scene.add( arrowHelper_z);

// scene.add(cube);
camera.position.z = 5;
animate();


function copyMatrixToClipboard() {
    let matrixString = '';
    const rows = document.querySelectorAll("#matrixInput tr");

    rows.forEach((row, rowIndex) => {
        let rowValues = [];
        const inputs = row.querySelectorAll("input");

        inputs.forEach(input => {
            rowValues.push(input.value);
        });

        matrixString += rowValues.join(',') + (rowIndex < rows.length - 1 ? '\n' : ''); // Tab-separated values, newline-separated rows
    });

    // Copying to clipboard
    navigator.clipboard.writeText(matrixString)
        .then(() => console.log("Matrix copied to clipboard!"))
        .catch(err => console.error("Error copying matrix to clipboard: ", err));
}



function animate() {
	requestAnimationFrame( animate );
	arrowHelper_x.quaternion.slerp(q1, 0.1);
	arrowHelper_y.quaternion.slerp(q2, 0.1);
	arrowHelper_z.quaternion.slerp(q3, 0.1);
    cube.quaternion.slerp(rotconv.quaternion,0.1);
	renderer.render( scene, camera );
}

function resetquaternion()
{
    q.set(0,0,0,1);
    q1.set(0,0.0,-0.707,0.707);
    q2.set(0,0,0,1);
    q3.set(0.707,0,0,0.707);
    document.getElementById('quaternionInput').value = "";
    let index = 0;
    // Iterate over the matrix to update the table
    for (let i = 0; i < 3; i++) { // Row iterator
        for (let j = 0; j < 3; j++) { // Column iterator
            // Construct the selector for each input in the matrix
            const selector = `#matrixInput tr:nth-child(${j + 1}) td:nth-child(${i + 1}) input`;
            const input = document.querySelector(selector);
            
            // Update the input value with the matrix element, formatting to a fixed number of decimal places if desired
            input.value = " ";
            index ++;
        }
    }
}

function adjustWindow() {
    const container = document.getElementById('container');
    const textContent = document.getElementById('text-content');
    const threeJsCanvas = document.getElementById('threejs-canvas');

    // Determine if the layout is currently row or column
    const isRowLayout = window.innerWidth >= 1200; // Assuming 600px is the breakpoint

    let targetWidth, targetHeight;

    if (isRowLayout) {
        // In row layout, both text content and canvas are side by side
        targetWidth = container.clientWidth / 2;
        targetHeight = container.clientHeight - 15; // Use the full container height
    } else {
        // In column layout, elements are stacked, so use the container's width and adjust height
        targetWidth = container.clientWidth;
        const textContentHeight = textContent.offsetHeight;
        targetHeight = container.clientHeight - textContentHeight - 15;
    }

    // Adjust Three.js renderer size
    renderer.setSize(targetWidth, targetHeight);
    
    // Update camera aspect ratio
    camera.aspect = targetWidth / targetHeight;
    camera.updateProjectionMatrix();
}

function resetAxes()
{
    q1.set(0,0.0,-0.707,0.707);
    q2.set(0,0,0,1);
    q3.set(0.707,0,0,0.707);
}

