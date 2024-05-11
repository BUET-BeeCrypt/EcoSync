function hungarianAlgorithm(costMatrix) {
    const n = costMatrix.length;
    const rowsCovered = new Array(n).fill(false);
    const colsCovered = new Array(n).fill(false);
    const assignments = new Array(n).fill(-1);

    // Step 1: Reduce the cost matrix
    reduceMatrix(costMatrix);

    let done = false;
    while (!done) {
        // Step 2: Cover all zeros with minimum number of lines
        const lines = coverZeros(costMatrix, rowsCovered, colsCovered);

        // Step 3: Check if assignment is complete
        if (lines.length === n) {
            done = true;
        } else {
            // Step 4: Find minimum uncovered value
            const minUncoveredValue = findMinUncoveredValue(costMatrix, rowsCovered, colsCovered);

            // Step 5: Subtract minimum uncovered value from uncovered elements and add it to the elements covered by two lines
            adjustMatrix(costMatrix, rowsCovered, colsCovered, minUncoveredValue);
        }
    }

    // Step 6: Extract assignments
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (costMatrix[i][j] === 0 && assignments[j] === -1) {
                assignments[j] = i;
                break;
            }
        }
    }

    return assignments;
}

function reduceMatrix(costMatrix) {
    const n = costMatrix.length;

    // Subtract the smallest value in each row from all elements in that row
    for (let i = 0; i < n; i++) {
        const minVal = Math.min(...costMatrix[i]);
        for (let j = 0; j < n; j++) {
            costMatrix[i][j] -= minVal;
        }
    }

    // Subtract the smallest value in each column from all elements in that column
    for (let j = 0; j < n; j++) {
        const col = costMatrix.map(row => row[j]);
        const minVal = Math.min(...col);
        for (let i = 0; i < n; i++) {
            costMatrix[i][j] -= minVal;
        }
    }
}

function coverZeros(costMatrix, rowsCovered, colsCovered) {
    const n = costMatrix.length;
    const lines = [];

    // Cover all zeros with minimum number of lines
    while (lines.length < n) {
        let minZerosRow = -1;
        let minZerosCol = -1;
        let minZerosCount = Infinity;

        // Find row with minimum number of zeros
        for (let i = 0; i < n; i++) {
            if (!rowsCovered[i]) {
                const zerosCount = costMatrix[i].filter((val, j) => !colsCovered[j] && val === 0).length;
                if (zerosCount < minZerosCount) {
                    minZerosRow = i;
                    minZerosCount = zerosCount;
                }
            }
        }

        // Find column with zero in the selected row
        for (let j = 0; j < n; j++) {
            if (!colsCovered[j] && costMatrix[minZerosRow][j] === 0) {
                minZerosCol = j;
                break;
            }
        }

        // If no column has zero, mark the row as covered and continue
        if (minZerosCol === -1) {
            rowsCovered[minZerosRow] = true;
            continue;
        }

        // Cover the selected zero
        lines.push({ type: 'row', index: minZerosRow });
        lines.push({ type: 'col', index: minZerosCol });
        rowsCovered[minZerosRow] = true;
        colsCovered[minZerosCol] = true;
    }

    return lines;
}

function findMinUncoveredValue(costMatrix, rowsCovered, colsCovered) {
    const n = costMatrix.length;
    let minUncoveredValue = Infinity;

    // Find the minimum uncovered value
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (!rowsCovered[i] && !colsCovered[j] && costMatrix[i][j] < minUncoveredValue) {
                minUncoveredValue = costMatrix[i][j];
            }
        }
    }

    return minUncoveredValue;
}

function adjustMatrix(costMatrix, rowsCovered, colsCovered, minUncoveredValue) {
    const n = costMatrix.length;

    // Subtract minimum uncovered value from uncovered elements
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (!rowsCovered[i] && !colsCovered[j]) {
                costMatrix[i][j] -= minUncoveredValue;
            }
        }
    }

    // Add minimum uncovered value to the elements covered by two lines
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (rowsCovered[i] && colsCovered[j]) {
                costMatrix[i][j] += minUncoveredValue;
            }
        }
    }
}

// // Example usage
// const costMatrix = [
//     [10, 9, 5, 7],
//     [8, 8, 4, 5],
//     [6, 7, 9, 8],
//     [7, 5, 6, 6]
// ];

// const assignments = hungarianAlgorithm(costMatrix);
// console.log("Assignments:", assignments);

export default hungarianAlgorithm;