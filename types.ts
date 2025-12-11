export interface Coordinate {
  lat: number;
  lng: number;
}

export interface Client {
  id: string;
  name: string;
  address: string;
  coordinate: Coordinate;
  priority: 'High' | 'Medium' | 'Low';
  windowStart: string; // HH:mm
  windowEnd: string; // HH:mm
  volume: number; // kg
}

export interface Vehicle {
  id: string;
  plate: string;
  driver: string;
  capacity: number; // kg
  status: 'Available' | 'In Route' | 'Maintenance';
}

export interface RouteStop {
  id: string;
  clientId: string;
  sequence: number;
  estimatedArrival?: string;
  status: 'Pending' | 'Completed' | 'Skipped';
  client: Client;
}

export interface RoutePlan {
  id: string;
  vehicleId: string;
  date: string;
  stops: RouteStop[];
  totalDistance: number; // km
  totalDuration: number; // minutes
  status: 'Draft' | 'Active' | 'Completed';
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  PLANNER = 'PLANNER',
  CLIENTS = 'CLIENTS',
  VEHICLES = 'VEHICLES',
  SETTINGS = 'SETTINGS'
}