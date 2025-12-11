import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

app.use(cors());
app.use(express.json());

// Middleware Auth
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- ROUTES ---

// Auth
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  // Mock login for demo purposes (Implement real bcrypt compare in prod)
  if (email === 'admin@hibryda.com' && password === 'admin') {
      const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token });
  }
  res.status(401).send('Credentials invalid');
});

// Clients
app.get('/api/clients', authenticateToken, async (req, res) => {
  const clients = await prisma.client.findMany();
  res.json(clients);
});

app.post('/api/clients', authenticateToken, async (req, res) => {
  const client = await prisma.client.create({ data: req.body });
  res.json(client);
});

// Vehicles
app.post('/api/vehicles', authenticateToken, async (req, res) => {
  const vehicle = await prisma.vehicle.create({ data: req.body });
  res.json(vehicle);
});

// Routes Generation (Simple Mock wrapper around the logic)
app.post('/api/routes/generate', authenticateToken, async (req, res) => {
    // In production, this would call a robust python service or OSRM
    // For now, we save the route plan to DB
    const { vehicleId, stops, distance, duration } = req.body;
    
    const route = await prisma.route.create({
        data: {
            vehicleId,
            totalDistance: distance,
            totalDuration: duration,
            status: 'DRAFT',
            stops: {
                create: stops.map((stop: any, index: number) => ({
                    clientId: stop.id,
                    sequence: index,
                    status: 'PENDING'
                }))
            }
        },
        include: { stops: true }
    });
    
    res.json(route);
});

app.get('/api/routes/:id', authenticateToken, async (req, res) => {
    const route = await prisma.route.findUnique({
        where: { id: req.params.id },
        include: { stops: { include: { client: true } }, vehicle: true }
    });
    res.json(route);
});

// --- GOOGLE MAPS PROXY (NEW) ---
app.post('/api/google/optimize', authenticateToken, async (req, res) => {
  const { origin, destination, waypoints } = req.body;

  if (!GOOGLE_MAPS_API_KEY) {
    return res.status(503).json({ error: 'Google Maps API Key not configured on server' });
  }

  try {
    // Construct Waypoints string: "optimize:true|lat,lng|lat,lng..."
    const waypointsStr = `optimize:true|${waypoints.map((wp: any) => `${wp.lat},${wp.lng}`).join('|')}`;
    
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&waypoints=${waypointsStr}&mode=driving&key=${GOOGLE_MAPS_API_KEY}`;

    const googleRes = await fetch(url);
    const data = await googleRes.json();

    if (data.status !== 'OK') {
      console.error('Google Maps API Error:', data);
      return res.status(400).json({ error: data.status, message: data.error_message });
    }

    res.json(data);
  } catch (error) {
    console.error('Server Proxy Error:', error);
    res.status(500).json({ error: 'Internal Server Error connecting to Maps API' });
  }
});

app.listen(PORT, () => {
  console.log(`Hibryda Backend running on port ${PORT}`);
});