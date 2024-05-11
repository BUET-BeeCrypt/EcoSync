const hungarianAlgorithm = require('./hungarian.js');

const modules = {};


// ========================= 3/2 appx scheme

// Function to find the minimum spanning tree (MST) of a graph using Prim's algorithm
function primMST(graph) {
    const parent = new Array(graph.length).fill(-1);
    const key = new Array(graph.length).fill(Infinity);
    const mstSet = new Array(graph.length).fill(false);

    key[0] = 0; // Start from the first vertex

    for (let count = 0; count < graph.length - 1; count++) {
        const u = minKey(key, mstSet);
        mstSet[u] = true;
        for (let v = 0; v < graph.length; v++) {
            if (graph[u][v] && !mstSet[v] && graph[u][v] < key[v]) {
                parent[v] = u;
                key[v] = graph[u][v];
            }
        }
    }

    return parent;
}

// Helper function to find the vertex with the minimum key value
function minKey(key, mstSet) {
    let min = Infinity;
    let minIndex = -1;
    for (let v = 0; v < key.length; v++) {
        if (!mstSet[v] && key[v] < min) {
            min = key[v];
            minIndex = v;
        }
    }
    return minIndex;
}

// Function to find a perfect matching of the vertices


// Function to find an Eulerian circuit from the matching and the MST
function eulerianCircuit(matching, mst) {
    const circuit = [];
    const visited = new Array(mst.length).fill(false);

    matching.forEach(edge => {
        circuit.push(edge[0]);
        circuit.push(edge[1]);
    });

    for (let i = 0; i < mst.length; i++) {
        if (!visited[i] && mst[i] !== -1) {
            circuit.push(i);
            visited[i] = true;
            let j = mst[i];
            while (!visited[j]) {
                circuit.push(j);
                visited[j] = true;
                j = mst[j];
            }
        }
    }

    return circuit;
}

// Function to construct a Hamiltonian cycle from the Eulerian circuit
function constructCycle(circuit) {
    const visited = new Array(circuit.length).fill(false);
    const cycle = [];

    circuit.forEach(vertex => {
        if (!visited[vertex]) {
            cycle.push(vertex);
            visited[vertex] = true;
        }
    });

    return cycle;
}

// Function to calculate the total distance of a cycle
function calculateCycleDistance(cycle, graph) {
    let distance = 0;
    for (let i = 0; i < cycle.length - 1; i++) {
        distance += graph[cycle[i]][cycle[i + 1]];
    }
    distance += graph[cycle[cycle.length - 1]][cycle[0]]; // Close the cycle
    return distance;
}

// Main function to solve TSP using 3/2 approximation algorithm
modules.tsp3Over2 = (graph) => {
    // Step 1: Find the MST using Prim's algorithm
    const mst = primMST(graph);

    // Step 2: Find a sub graph of the odd degree vertices in the MST
    const odd_vertices = [];
    for (let i = 1; i < graph.length; i++) {
        if (graph[i].length % 2 !== 1) {
            odd_vertices.push(i);
        }
    }

    const costMatrix = [];
    for (let i = 0; i < odd_vertices.length; i++) {
        const row = [];
        for (let j = 0; j < odd_vertices.length; j++) {
            row.push(graph[odd_vertices[i]][odd_vertices[j]]);
        }
        costMatrix.push(row);
    }

    // Step 3: Find a perfect matching of the vertices in the sub graph
    const matching = hungarianAlgorithm(costMatrix);

    // Step 3: Find an Eulerian circuit from the matching and the MST
    const circuit = eulerianCircuit(matching, mst);

    // Step 4: Construct a Hamiltonian cycle from the Eulerian circuit
    const cycle = constructCycle(circuit);

    return { cycle, distance: calculateCycleDistance(cycle, graph) };
}

module.exports = modules;