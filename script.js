function quaternionToRotationMatrix() {
    const input = document.getElementById('quaternionInput').value;
    const quaternion = input.split(',').map(Number); // Convert input string to array of numbers
    const [w, x, y, z] = quaternion;

    const xx = x * x;
    const yy = y * y;
    const zz = z * z;
    const xy = x * y;
    const xz = x * z;
    const yz = y * z;
    const wx = w * x;
    const wy = w * y;
    const wz = w * z;
    // Perform the conversion (using the function described in previous messages)
    const rotationMatrix = [
        1 - 2 * (yy + zz),     2 * (xy - wz),       2 * (xz + wy),
        2 * (xy + wz),         1 - 2 * (xx + zz),   2 * (yz - wx),
        2 * (xz - wy),         2 * (yz + wx),       1 - 2 * (xx + yy)
    ];

    // Display the result
    document.getElementById('result').innerText = 'Rotation Matrix: ' + rotationMatrix.join(', ');
}