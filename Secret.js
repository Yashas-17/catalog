// Function to convert y values from different bases to decimal (base 10)
function convertToDecimal(value, base) {
    return parseInt(value, base);
}

// Lagrange interpolation to find constant term c (the secret)
function lagrangeInterpolation(points) {
    const basis = (j) => {
        const [x_j, y_j] = points[j];
        return (x) => {
            let prod = 1;
            for (let i = 0; i < points.length; i++) {
                if (i !== j) {
                    const [x_i] = points[i];
                    prod *= (x - x_i) / (x_j - x_i);
                }
            }
            return prod;
        };
    };

    const interpolation = (x) => {
        return points.reduce((sum, _, j) => {
            return sum + basis(j)(x) * points[j][1];
        }, 0);
    };

    return interpolation(0); // Evaluating at x = 0 gives the constant term c
}

// Read the JSON input
const jsonData = `
{
    "keys": {
        "n": 4,
        "k": 3
    },
    "1": {
        "base": "10",
        "value": "5"
    },
    "2": {
        "base": "2",
        "value": "101"
    },
    "3": {
        "base": "10",
        "value": "15"
    },
    "4": {
        "base": "16",
        "value": "A" 
    }
}


`;

// Load JSON data
const data = JSON.parse(jsonData);

// Extract the number of roots (n) and the threshold (k)
const n = data.keys.n;
const k = data.keys.k;

// Gather all the points (x, y) after decoding y
const points = [];
for (const key in data) {
    if (key !== "keys") { // Skip the 'keys' section
        const x = parseInt(key); // Use the key as x
        const y = convertToDecimal(data[key].value, parseInt(data[key].base)); // Decode y based on its base
        points.push([x, y]);
    }
}

// Use Lagrange interpolation to find the constant term 'c'
const c = lagrangeInterpolation(points);

// Print the secret constant 'c'
console.log(`The constant term (secret) is: ${c}`);
