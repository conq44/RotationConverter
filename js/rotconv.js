
class RotationConverter {
    constructor() {
        this.quaternion = new THREE.Quaternion(); // Default identity quaternion
        this.rtmat = new THREE.Matrix4();
        this.matrix = new THREE.Matrix3(); // Initialize with corresponding matrix
        this.Euler = new THREE.Euler();
        this.eulerOrder = 'XYZ';
        this.lastUpdate = 'quaternion';
    }

    updateFromQuaternionInput() {
        // Parse input and update quaternion
        // Update matrix based on new quaternion
        this.quaternion = this.parseQuaternionInput();
        console.log(this.quaternion);
        this.quaternion.normalize();
        this.rtmat.makeRotationFromQuaternion(this.quaternion);
        this.matrix.setFromMatrix4(this.rtmat);
        this.Euler.setFromRotationMatrix(this.rtmat, this.eulerOrder);
        this.updateMatrixDisplay();
        this.updateEulerDisplay();
    }

    updateFromMatrixInput() {
        // Parse input and update matrix
        // Update quaternion based on new matrix
        this.matrix = this.parseMatrixInput();
        console.log(this.rtmat);
        this.rtmat.setFromMatrix3(this.matrix);
        console.log(this.rtmat.elements);
        this.quaternion.setFromRotationMatrix(this.rtmat);
        this.Euler.setFromRotationMatrix(this.rtmat, this.eulerOrder);
        this.updateQuaternionDisplay();
        this.updateEulerDisplay();
    }

    updateFromEulerInput() {
        // Parse input and update matrix
        // Update quaternion based on new matrix
        this.Euler = this.parseEulerInput();
        this.rtmat.makeRotationFromEuler(this.Euler);
        this.quaternion.setFromRotationMatrix(this.rtmat);
        this.quaternion.setFromRotationMatrix(this.rtmat);
        this.updateQuaternionDisplay();
        this.updateMatrixDisplay();
    }

    updateQuaternionDisplay() {
        // Update UI elements for quaternion display
        document.getElementById('quaternionInput').value = `${this.quaternion.x.toFixed(4)}, ${this.quaternion.y.toFixed(4)}, ${this.quaternion.z.toFixed(4)}, ${this.quaternion.w.toFixed(4)}`;

    }


    updateEulerDisplay() {
        // Update UI elements for quaternion display
        document.getElementById('eulerInput').value = `${this.Euler.x.toFixed(4)}, ${this.Euler.y.toFixed(4)}, ${this.Euler.z.toFixed(4)}`;

    }

    updateMatrixDisplay() {
        // Update UI elements for matrix display
        let index = 0;
        // Iterate over the matrix to update the table
        for (let i = 0; i < 3; i++) { // Row iterator
            for (let j = 0; j < 3; j++) { // Column iterator
                // Construct the selector for each input in the matrix
                const selector = `#matrixInput tr:nth-child(${j + 1}) td:nth-child(${i + 1}) input`;
                const input = document.querySelector(selector);
                
                // Update the input value with the matrix element, formatting to a fixed number of decimal places if desired
                input.value = this.matrix.elements[index].toFixed(4);
                index ++;
            }
        }
    }

    parseQuaternionInput() {
        // Convert input string to quaternion object
        // Return quaternion object
        const input = document.getElementById('quaternionInput').value;
        const quaternion = input.split(',').map(Number); // Convert input string to array of numbers
        const [x, y, z, w] = quaternion;
        const threeQuat = new THREE.Quaternion(x, y, z, w);
        console.log(threeQuat);
        return threeQuat;

    }

    parseEulerInput() {
        // Convert input string to quaternion object
        // Return quaternion object
        const input = document.getElementById('eulerInput').value;
        // this.eulerOrder = document.getElementById('eulerOrder');
        const euler = input.split(',').map(Number); // Convert input string to array of numbers
        const [rx, ry, rz] = euler;
        const threeeuler = new THREE.Euler(rx, ry, rz, this.eulerOrder);
        console.log(threeeuler);
        return threeeuler;

    }

    parseMatrixInput() {
        // Convert input string/array to matrix object or array
        // Return matrix
        let index = 0;
        const threeMat = new THREE.Matrix3();
        // Iterate over the matrix to update the table
        for (let i = 0; i < 3; i++) { // Row iterator
            for (let j = 0; j < 3; j++) { // Column iterator
                // Construct the selector for each input in the matrix
                const selector = `#matrixInput tr:nth-child(${j + 1}) td:nth-child(${i + 1}) input`;
                const input = document.querySelector(selector);
                
                // Update the input value with the matrix element, formatting to a fixed number of decimal places if desired
                threeMat.elements[index] = Number(input.value);
                index ++;
            }
        }
        console.log(threeMat.elements);
        return threeMat;

    }

}

export default RotationConverter;