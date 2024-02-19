import * as THREE from 'three';


document.getElementById('convert').addEventListener('click', function() {
    convertAndDisplay();
});

document.getElementById('copymatrix').addEventListener('click', function() {
    copyMatrixToClipboard();
});

document.getElementById('reset').addEventListener('click', function() {
    resetquaternion()
});

window.addEventListener( 'resize', onWindowResize, false );


function getUpperLeft3x3Matrix(matrix4) {
    // Extracts the first 3x3 part of a THREE.Matrix4 object
    const elements = matrix4.elements;
    const UpperLeft = new THREE.Matrix3();
    UpperLeft.set(elements[0], elements[1], elements[2],   // First column
    elements[4], elements[5], elements[6],   // Second column
    elements[8], elements[9], elements[10]   // Third column
    )

    return UpperLeft;
}

function convertAndDisplay() {
    // Example input retrieval and conversion process
    const sourceValue = document.getElementById('convert').value;
    // Assuming convertQuaternionToMatrix returns a 3x3 matrix array
    const matrix = getUpperLeft3x3Matrix(quaternionToRotationMatrix(sourceValue)); // Implement this function based on your conversion logic
    document.getElementById('result').innerText = 'Rotation Matrix: ' + matrix.elements.join(', ');
    let index = 0;
    // Iterate over the matrix to update the table
    for (let i = 0; i < 3; i++) { // Row iterator
        for (let j = 0; j < 3; j++) { // Column iterator
            // Construct the selector for each input in the matrix
            const selector = `#matrixOutput tr:nth-child(${i + 1}) td:nth-child(${j + 1}) input`;
            const input = document.querySelector(selector);
            
            // Update the input value with the matrix element, formatting to a fixed number of decimal places if desired
            input.value = matrix.elements[index].toFixed(4);
            index ++;
        }
    }

}

function copyMatrixToClipboard() {
    let matrixString = '';
    const rows = document.querySelectorAll("#matrixOutput tr");

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

function quaternionToRotationMatrix() {
    const input = document.getElementById('quaternionInput').value;
    const quaternion = input.split(',').map(Number); // Convert input string to array of numbers
    const [x, y, z, w] = quaternion;

    // check if quaternion is valid
    const allZero = quaternion.every(num => num === 0);
    if(allZero)
    {
        document.getElementById('result').innerText = 'all zeros is not valid';
    }

    // ];
	q.x = x;
	q.y = y;
	q.z = z;
	q.w = w;
    
    q.normalize();
    rotmat.makeRotationFromQuaternion(q);
    q1.premultiply(q);
    q1.normalize();
    q2.premultiply(q);
    q3.premultiply(q);
    // Display the result

    return rotmat;
}


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
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

// let axesHelper = new THREE.AxesHelper(2);
// const axis_pos = new THREE.Vector3(-3, -2, 0);
// axesHelper.position.copy(axis_pos);
// scene.add(axesHelper);

camera.position.z = 5;
animate();

function animate() {
	requestAnimationFrame( animate );
 

	arrowHelper_x.quaternion.slerp(q1, 0.1);
	arrowHelper_y.quaternion.slerp(q2, 0.1);
	arrowHelper_z.quaternion.slerp(q3, 0.1);

	renderer.render( scene, camera );
}

function resetquaternion()
{
    q.set(0,0,0,1);
    q1.set(0,0.0,-0.707,0.707);
    q2.set(0,0,0,1);
    q3.set(0.707,0,0,0.707);

}

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

