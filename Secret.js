const fs = require('fs');

// Function to convert y values from different bases to decimal (base 10)
function convertToDecimal(value, base) {
    return parseInt(value, base);
}

// Lagrange interpolation to find constant term c (the secret)
function lagrangeInterpolation(points) {
    function basis(j) {
        const [x_j, y_j] = points[j];
        return function product(x) {
            let prod = 1;
            for (let i = 0; i < points.length; i++) {
                if (i !== j) {
                    const [x_i] = points[i];
                    prod *= (x - x_i) / (x_j - x_i);
                }
            }
            return prod;
        };
    }

    function interpolation(x) {
        return points.reduce((sum, _, j) => {
            return sum + basis(j)(x) * points[j][1];
        }, 0);
    }

    return interpolation(0); // Evaluating at x = 0 gives the constant term c
}

// Read the JSON input from the data.json file
fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    // Parse the JSON data
    const jsonData = JSON.parse(data);

    // Extract the number of roots (n) and the threshold (k)
    const n = jsonData.keys.n;
    const k = jsonData.keys.k;

    // Gather all the points (x, y) after decoding y
    const points = [];
    for (const key in jsonData) {
        if (key !== "keys") { // Skip the 'keys' section
            const x = parseInt(key); // Use the key as x
            const y = convertToDecimal(jsonData[key].value, parseInt(jsonData[key].base)); // Decode y based on its base
            points.push([x, y]);
        }
    }

    // Use Lagrange interpolation to find the constant term 'c'
    const c = lagrangeInterpolation(points);

    // Print the secret constant 'c'
    console.log(`The constant term (secret) is: ${c}`);
});
