import { Client, Coordinate } from '../types';

interface GoogleRouteResult {
  orderedClients: Client[];
  geometry: [number, number][]; // Decoded Polyline [lat, lng]
  totalDistance: number; // km
  totalDuration: number; // minutes
}

// Utility to decode Google's Polyline string into [lat, lng] array
function decodePolyline(encoded: string): [number, number][] {
  let points: [number, number][] = [];
  let index = 0, len = encoded.length;
  let lat = 0, lng = 0;

  while (index < len) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    points.push([lat / 1e5, lng / 1e5]);
  }
  return points;
}

// Simulates a backend call authentication
const getAuthHeaders = () => {
  // In a real app, retrieve this from localStorage
  // const token = localStorage.getItem('token');
  // return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  
  // For this demo, assuming the server bypasses auth for localhost or we mock it
  // We'll mimic the header structure expecting the backend to be lenient or token injected
  return { 'Authorization': 'Bearer mock-token', 'Content-Type': 'application/json' };
};

export const fetchGoogleOptimizedRoute = async (
  origin: Client, 
  destination: Client, 
  stops: Client[]
): Promise<GoogleRouteResult> => {
  
  try {
    const response = await fetch('http://localhost:3001/api/google/optimize', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        origin: origin.coordinate,
        destination: destination.coordinate,
        waypoints: stops.map(s => s.coordinate)
      })
    });

    if (!response.ok) {
        throw new Error('Falha ao comunicar com o servidor de rotas.');
    }

    const data = await response.json();

    // 1. Parse Route Info
    const routeLegs = data.routes[0].legs;
    const overviewPolyline = data.routes[0].overview_polyline.points;
    const waypointOrder = data.routes[0].waypoint_order; // Array of indices, e.g., [2, 0, 1]

    // 2. Reorder Clients based on Google's optimization
    const reorderedStops = waypointOrder.map((index: number) => stops[index]);

    // 3. Calculate Totals
    let totalDistMeters = 0;
    let totalDurationSeconds = 0;
    routeLegs.forEach((leg: any) => {
      totalDistMeters += leg.distance.value;
      totalDurationSeconds += leg.duration.value;
    });

    // 4. Decode Geometry for Leaflet
    const geometry = decodePolyline(overviewPolyline);

    return {
      orderedClients: [origin, ...reorderedStops, destination],
      geometry: geometry,
      totalDistance: parseFloat((totalDistMeters / 1000).toFixed(2)),
      totalDuration: Math.round(totalDurationSeconds / 60)
    };

  } catch (error) {
    console.error("Google Maps API Error:", error);
    throw error;
  }
};