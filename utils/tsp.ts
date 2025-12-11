import { Client, Coordinate } from '../types';

// Haversine formula for distance between two points in km
export const calculateDistance = (coord1: Coordinate, coord2: Coordinate): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(coord2.lat - coord1.lat);
  const dLon = deg2rad(coord2.lng - coord1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(coord1.lat)) * Math.cos(deg2rad(coord2.lat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

// Nearest Neighbor Heuristic
const nearestNeighbor = (points: Client[], startPoint: Coordinate): Client[] => {
  let unvisited = [...points];
  let currentPos = startPoint;
  const path: Client[] = [];

  while (unvisited.length > 0) {
    let nearestIndex = -1;
    let minDist = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const dist = calculateDistance(currentPos, unvisited[i].coordinate);
      if (dist < minDist) {
        minDist = dist;
        nearestIndex = i;
      }
    }

    if (nearestIndex !== -1) {
      const nextPoint = unvisited[nearestIndex];
      path.push(nextPoint);
      currentPos = nextPoint.coordinate;
      unvisited.splice(nearestIndex, 1);
    }
  }

  return path;
};

// 2-Opt Optimization
const twoOpt = (route: Client[], iterations: number = 50): Client[] => {
  let newRoute = [...route];
  let bestDistance = calculateTotalDistance(newRoute);

  for (let k = 0; k < iterations; k++) {
    for (let i = 1; i < newRoute.length - 1; i++) {
      for (let j = i + 1; j < newRoute.length; j++) {
        const tempRoute = [
          ...newRoute.slice(0, i),
          ...newRoute.slice(i, j + 1).reverse(),
          ...newRoute.slice(j + 1)
        ];
        
        const newDist = calculateTotalDistance(tempRoute);
        if (newDist < bestDistance) {
          newRoute = tempRoute;
          bestDistance = newDist;
        }
      }
    }
  }
  return newRoute;
};

export const calculateTotalDistance = (route: Client[]): number => {
  let dist = 0;
  for (let i = 0; i < route.length - 1; i++) {
    dist += calculateDistance(route[i].coordinate, route[i + 1].coordinate);
  }
  return dist;
};

export const optimizeRoute = (clients: Client[], depot: Coordinate): Client[] => {
  // 1. Initial solution via Nearest Neighbor
  const initialRoute = nearestNeighbor(clients, depot);
  // 2. Refine with 2-Opt
  const optimizedRoute = twoOpt(initialRoute);
  return optimizedRoute;
};