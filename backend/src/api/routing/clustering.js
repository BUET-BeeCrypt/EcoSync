// Function to initialize random centroids
function initializeCentroids(data, k) {
    const centroids = [];
    for (let i = 0; i < k; i++) {
        const index = i;
        centroids.push(data[index]);
    }
    return centroids;
}

// Helper function to check if centroids are equal
function centroidsEqual(centroids1, centroids2) {
    if (!centroids1 || !centroids2 || centroids1.length !== centroids2.length) {
        return false;
    }
    for (let i = 0; i < centroids1.length; i++) {
        if (centroids1[i].lat !== centroids2[i].lat || centroids1[i].lon !== centroids2[i].lon) {
            return false;
        }
    }
    console.log("Equal:");
    return true;
}

// Function to update centroids to the mean of their assigned data points
function updateCentroids(clusters) {
    const newCentroids = [];
    for (const key in clusters) {
        const cluster = clusters[key];
        let meanLat = 0;
        let meanLon = 0;
        console.log("cluster:", cluster);
        for( let i=0;i<cluster.length;i++){
            meanLat += cluster[i].lat;
            meanLon += cluster[i].lon;
        }
        meanLat = meanLat / cluster.length;
        meanLon = meanLon / cluster.length;
        newCentroids.push({ lat: meanLat, lon: meanLon });
    }
    return newCentroids;
}

// Function to calculate distance between two points using the 2D array of distances
function calculateDistanceById(distances, id1, id2) {
    return distances[id1][id2];
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
}

// Function to assign each data point to the nearest centroid
function assignToClusters(data, centroids, distances) {
    const clusters = {};
    centroids.forEach((centroid, i) => {
        clusters[i] = [];
    });
    data.forEach(point => {
        let minDistance = Infinity;
        let closestCentroidIndex = null;
        centroids.forEach((centroid, i) => {
            const distance = calculateDistance(centroid.lat,centroid.lon, point.lat,point.lon);
            if (distance < minDistance) {
                minDistance = distance;
                closestCentroidIndex = i;
            }
        });
        clusters[closestCentroidIndex].push(point);
    });
    return clusters;
}

// Function to perform k-means clustering and return clusters
function kMeansWithClusters(data, k, distances, maxIterations = 100) {
    let centroids = initializeCentroids(data, k);
    let iterations = 0;
    let prevCentroids = [];
    let clusters = {};
    
    while (iterations < maxIterations && !centroidsEqual(prevCentroids, centroids)) {
        clusters = assignToClusters(data, centroids, distances);
        prevCentroids = [];
        for(let centroid of centroids) prevCentroids.push({...centroid});
        
        centroids = updateCentroids(clusters);
        console.log("prev:", prevCentroids);
        console.log("new :", centroids);
        console.log("\n\n\n")
        iterations++;
    }
    
    return { centroids, clusters, iterations };
}

// // trial usage
// const coordinates = [
//         {"lon": 90.389139, "lat": 23.726201, id: 0},
//         {"lon": 90.356360,  "lat": 23.799340, id: 1},
//         {"lon": 90.427382, "lat": 23.739731, id: 2 },
//         {"lon": 90.417932,"lat": 23.737631, id: 3},
//         {"lon": 90.396587,"lat": 23.722175, id: 4},
//         { "lon": 90.389139, "lat": 23.726201, id: 5}
// ];

// const distances = [
//     [0.000, 9.870, 5.260, 3.936, 1.126, 0.000],
//     [9.865, 0.000, 12.201, 11.347, 10.754, 9.865],
//     [5.280, 12.195, 0.000, 1.438, 4.853, 5.280],
//     [3.959, 11.353, 1.438, 0.000, 3.532, 3.959],
//     [1.126, 10.759, 4.826, 3.502, 0.000, 1.126],
//     [0.000, 9.870, 5.260, 3.936, 1.126, 0.000]
// ];

// const k = 3; // Number of clusters
// const { centroids, clusters, iterations } = kMeansWithClusters(coordinates, k, distances);
// console.log("Final centroids:", centroids);
// console.log("Clusters:", clusters);
// console.log("Number of iterations:", iterations);


exports.kMeansWithClusters = kMeansWithClusters;