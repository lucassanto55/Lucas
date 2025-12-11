import React, { useState, useEffect, useMemo, memo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Client, Coordinate, Vehicle, RoutePlan } from '../types';
import { optimizeRoute, calculateTotalDistance } from '../utils/tsp';
import { fetchGoogleOptimizedRoute } from '../services/googleMaps';
import { analyzeRouteWithAI } from '../services/geminiService';
import { Play, Save, FileText, Sparkles, Map as MapIcon, RotateCcw, AlertCircle, Truck, Zap, Crosshair, Navigation, Target, Layers, User, Weight } from 'lucide-react';

// --- CONFIGURAÇÃO DE ÍCONES (Fora do componente para performance) ---
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconShadow = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';
const depotIconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png';

const DepotIcon = L.icon({
    iconUrl: depotIconUrl,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const DefaultIcon = L.icon({
    iconUrl: iconUrl,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- DADOS MOCKADOS ---
const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'Peixaria Central (Icaraí)', address: 'Rua Gavião Peixoto, Icaraí', coordinate: { lat: -22.9064, lng: -43.1095 }, priority: 'High', windowStart: '08:00', windowEnd: '10:00', volume: 50 },
  { id: '2', name: 'Restaurante Siri (Charitas)', address: 'Av. Quintino Bocaiúva', coordinate: { lat: -22.9320, lng: -43.1030 }, priority: 'Medium', windowStart: '10:00', windowEnd: '12:00', volume: 30 },
  { id: '3', name: 'Mercado do Porto (Centro Rio)', address: 'Zona Portuária, RJ', coordinate: { lat: -22.8950, lng: -43.1850 }, priority: 'High', windowStart: '11:00', windowEnd: '13:00', volume: 20 },
  { id: '4', name: 'Quiosque BarraWay (Barra)', address: 'Av. Lúcio Costa', coordinate: { lat: -23.0100, lng: -43.3200 }, priority: 'Low', windowStart: '13:00', windowEnd: '16:00', volume: 80 },
  { id: '5', name: 'Supermercado Alcântara', address: 'São Gonçalo', coordinate: { lat: -22.8250, lng: -43.0020 }, priority: 'Medium', windowStart: '09:00', windowEnd: '11:00', volume: 45 },
];

const MOCK_VEHICLES: Vehicle[] = [
    { id: 'v1', plate: 'HIB-9988', driver: 'Carlos Silva', capacity: 500, status: 'Available' },
    { id: 'v2', plate: 'HIB-7722', driver: 'João Santos', capacity: 300, status: 'In Route' }
];

// --- COMPONENTES OTIMIZADOS DO MAPA (Memoizados) ---

// 1. Controles do Mapa
const MapControls = memo(({ points }: { points: Coordinate[] }) => {
  const map = useMap();

  const handleFitBounds = () => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 1 });
    }
  };

  return (
    <div className="leaflet-top leaflet-right mt-[80px] mr-[10px] z-[400]">
      <button 
        onClick={handleFitBounds}
        title="Centralizar Rota"
        className="bg-white p-2 rounded-md shadow-md border border-gray-300 hover:bg-gray-100 text-gray-700 transition-colors"
      >
        <Target size={20} />
      </button>
    </div>
  );
});

// 2. Legenda (Static)
const MapLegend = memo(() => (
    <div className="leaflet-bottom leaflet-left m-4 z-[400] w-48">
        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200 text-xs">
            <h4 className="font-bold text-gray-700 mb-2 flex items-center">
                <Layers size={12} className="mr-1" /> Legenda
            </h4>
            <div className="space-y-2">
                <div className="flex items-center">
                    <img src={depotIconUrl} className="w-4 h-6 mr-2 object-contain" alt="Depot" />
                    <span className="text-gray-600">CD / Origem</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-6 mr-2 flex items-center justify-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full border border-white shadow-sm"></div>
                    </div>
                    <span className="text-gray-600">Cliente</span>
                </div>
                <div className="flex items-center">
                    <div className="w-6 h-1 bg-[#54c6d9] mr-2 rounded-full"></div>
                    <span className="text-gray-600">Rota Otimizada</span>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100 grid grid-cols-2 gap-1 text-[10px]">
                     <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded border border-red-200 text-center">Alta Prior.</span>
                     <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded border border-blue-200 text-center">Normal</span>
                </div>
            </div>
        </div>
    </div>
));

// 3. Marcadores de Clientes (Só re-renderiza se a lista mudar)
const MemoizedMarkers = memo(({ clients }: { clients: Client[] }) => {
  return (
    <>
      {clients.map((client) => (
          <Marker key={client.id} position={[client.coordinate.lat, client.coordinate.lng]}>
            <Popup>
                <strong>{client.name}</strong><br/>
                {client.address}
            </Popup>
          </Marker>
      ))}
    </>
  );
});

// 4. Marcadores de Paradas da Rota (Sequência)
const MemoizedRouteStops = memo(({ route }: { route: Client[] }) => {
    // Slicing to ignore start/end depot for sequence numbers
    return (
        <>
            {route.slice(1, -1).map((client, index) => (
                <Marker key={`stop-${index}`} position={[client.coordinate.lat, client.coordinate.lng]}>
                    <Popup>
                        <strong className="text-hibryda-600">Parada #{index + 1}</strong><br/>
                        {client.name}<br/>
                        <span className="text-xs text-gray-500">{client.address}</span>
                    </Popup>
                </Marker>
            ))}
        </>
    );
});

// 5. Polilinha da Rota
const MemoizedRoutePolyline = memo(({ geometry }: { geometry: [number, number][] }) => {
    return (
        <Polyline 
            positions={geometry} 
            color="#54c6d9" 
            weight={5}
            opacity={0.8}
        />
    );
});

const RecenterMap = ({ center }: { center: Coordinate }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([center.lat, center.lng], map.getZoom());
    }, [center, map]);
    return null;
}

const FitBoundsOnLoad = ({ points }: { points: [number, number][] }) => {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [points, map]);
  return null;
};

// --- MAIN COMPONENT ---

export const Planner: React.FC = () => {
  const [depotLocation, setDepotLocation] = useState<Coordinate>({ lat: -22.8856, lng: -43.1213 });
  const [depotName, setDepotName] = useState("Mercado São Pedro (CD)");
  
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [generatedRoute, setGeneratedRoute] = useState<Client[] | null>(null);
  const [routeGeometry, setRouteGeometry] = useState<[number, number][]>([]);
  const [routeStats, setRouteStats] = useState<{dist: number, time: number} | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [useGoogle, setUseGoogle] = useState(true);

  // Memoize vehicle lookup for display
  const currentVehicleObj = useMemo(() => {
      return MOCK_VEHICLES.find(v => v.id === selectedVehicle);
  }, [selectedVehicle]);

  const toggleClient = (id: string) => {
    setSelectedClients(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const getCurrentLocation = () => {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
              (position) => {
                  setDepotLocation({
                      lat: position.coords.latitude,
                      lng: position.coords.longitude
                  });
                  setDepotName("Minha Localização Atual");
              },
              (error) => {
                  alert("Erro ao obter localização: " + error.message);
              }
          );
      } else {
          alert("Geolocalização não suportada neste navegador.");
      }
  };

  const handleGenerateRoute = async () => {
    if (selectedClients.length === 0 || !selectedVehicle) return;
    setLoading(true);
    setAiAnalysis('');
    
    const startDepot: Client = { 
      id: 'depot-start', name: depotName, address: 'Origem Personalizada', coordinate: depotLocation, priority: 'High', windowStart: '00:00', windowEnd: '23:59', volume: 0 
    };
    const endDepot: Client = { 
      id: 'depot-end', name: depotName, address: 'Retorno à Origem', coordinate: depotLocation, priority: 'High', windowStart: '00:00', windowEnd: '23:59', volume: 0 
    };

    const clientsToRoute = MOCK_CLIENTS.filter(c => selectedClients.includes(c.id));

    try {
        if (useGoogle) {
            try {
                const result = await fetchGoogleOptimizedRoute(startDepot, endDepot, clientsToRoute);
                setGeneratedRoute(result.orderedClients);
                setRouteGeometry(result.geometry);
                setRouteStats({ dist: result.totalDistance, time: result.totalDuration });
                analyzeAI(result.orderedClients, selectedVehicle, result.totalDistance);
            } catch (err) {
                console.warn("Google API falhou, fallback para heurística local.", err);
                alert("Não foi possível conectar à API Google Maps. Usando algoritmo local.");
                runLocalHeuristic(startDepot, endDepot, clientsToRoute);
            }
        } else {
            runLocalHeuristic(startDepot, endDepot, clientsToRoute);
        }
    } catch (error) {
        console.error("Erro geral na rota", error);
    } finally {
        setLoading(false);
    }
  };

  const runLocalHeuristic = (start: Client, end: Client, points: Client[]) => {
      setTimeout(async () => {
          const optimized = optimizeRoute(points, depotLocation);
          const fullRoute = [start, ...optimized, end];
          
          setGeneratedRoute(fullRoute);
          const geometry = fullRoute.map(c => [c.coordinate.lat, c.coordinate.lng] as [number, number]);
          setRouteGeometry(geometry);

          const dist = calculateTotalDistance(fullRoute);
          setRouteStats({
              dist: parseFloat(dist.toFixed(2)),
              time: Math.round(dist * 2.5) 
          });

          analyzeAI(fullRoute, selectedVehicle, dist);
          setLoading(false);
      }, 800);
  };

  const analyzeAI = async (route: Client[], vehicleId: string, dist: number) => {
      const mockPlan: RoutePlan = {
          id: 'temp', vehicleId: vehicleId, date: new Date().toISOString(), stops: [], totalDistance: dist, totalDuration: 0, status: 'Draft'
      };
      // @ts-ignore
      mockPlan.stops = route.map((c, i) => ({ client: c }));
      const insight = await analyzeRouteWithAI(mockPlan);
      setAiAnalysis(insight);
  };

  const exportPDF = () => {
    alert("Iniciando download do manifesto de rota em PDF...");
  };

  // Optimization: Memoize points calculation to avoid re-calculation on every render
  const allMapPoints = useMemo(() => {
      return [
        depotLocation, 
        ...MOCK_CLIENTS.filter(c => selectedClients.includes(c.id) || (generatedRoute && generatedRoute.find(g => g.id === c.id))).map(c => c.coordinate)
      ];
  }, [depotLocation, selectedClients, generatedRoute]);

  return (
    <div className="flex flex-col h-full lg:flex-row">
      {/* Control Panel */}
      <div className="w-full lg:w-96 bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden shadow-xl z-10">
        <div className="p-6 border-b border-gray-100 bg-white">
          <h2 className="text-xl font-bold text-hibryda-900 flex items-center">
            <MapIcon className="mr-2 text-hibryda-600" /> Montar Rota
          </h2>
          <p className="text-xs text-gray-500 mt-1">Otimização com Google Maps Directions API.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
            {/* Depot Configuration */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <label className="text-sm font-bold text-gray-700 flex items-center mb-3">
                    <Navigation size={16} className="mr-2 text-hibryda-600" />
                    Origem / Depósito
                </label>
                <div className="space-y-3">
                    <input 
                        type="text" 
                        value={depotName}
                        onChange={(e) => setDepotName(e.target.value)}
                        placeholder="Nome do Local (Ex: CD Matriz)"
                        className="w-full p-2 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-hibryda-500 outline-none"
                    />
                    <div className="flex space-x-2">
                        <input 
                            type="number" 
                            value={depotLocation.lat}
                            onChange={(e) => setDepotLocation({...depotLocation, lat: parseFloat(e.target.value)})}
                            placeholder="Lat"
                            className="w-1/2 p-2 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-hibryda-500 outline-none"
                        />
                         <input 
                            type="number" 
                            value={depotLocation.lng}
                            onChange={(e) => setDepotLocation({...depotLocation, lng: parseFloat(e.target.value)})}
                            placeholder="Lng"
                            className="w-1/2 p-2 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-hibryda-500 outline-none"
                        />
                    </div>
                    <button 
                        onClick={getCurrentLocation}
                        className="w-full py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded hover:bg-slate-200 flex items-center justify-center transition-colors"
                    >
                        <Crosshair size={14} className="mr-2" /> Usar Minha Localização
                    </button>
                </div>
            </div>

            {/* Engine Selector */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                 <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-gray-700 flex items-center">
                        <Zap size={16} className={`mr-2 ${useGoogle ? 'text-green-500 fill-current' : 'text-gray-400'}`} />
                        Motor Google AI
                    </label>
                    <div 
                        className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${useGoogle ? 'bg-hibryda-500' : 'bg-gray-300'}`}
                        onClick={() => setUseGoogle(!useGoogle)}
                    >
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${useGoogle ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </div>
                 </div>
                 <p className="text-[10px] text-gray-400 mt-2">
                    {useGoogle ? 'Usando dados reais de tráfego e vias (Requer API Key).' : 'Usando cálculo geométrico simples (Offline).'}
                 </p>
            </div>

            {/* Vehicle Selector */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                    <Truck size={16} className="mr-2 text-hibryda-600" />
                    Selecione o Veículo
                </label>
                <select 
                    className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3 text-sm focus:ring-2 focus:ring-hibryda-500 focus:border-hibryda-500 outline-none transition-all"
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                >
                    <option value="">-- Disponíveis --</option>
                    {MOCK_VEHICLES.map(v => (
                        <option key={v.id} value={v.id}>{v.plate} - {v.driver} ({v.capacity}kg)</option>
                    ))}
                </select>
            </div>

            {/* Client List */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center justify-between">
                    <div className="flex items-center">
                        <AlertCircle size={16} className="mr-2 text-hibryda-600" />
                        Entregas Pendentes
                    </div>
                    <span className="text-xs bg-hibryda-100 text-hibryda-700 px-2 py-0.5 rounded-full">
                        {selectedClients.length} selecionados
                    </span>
                </label>
                <div className="space-y-2">
                    {MOCK_CLIENTS.map(client => (
                        <div 
                            key={client.id} 
                            onClick={() => toggleClient(client.id)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all relative overflow-hidden ${
                                selectedClients.includes(client.id) 
                                ? 'border-hibryda-500 bg-white shadow-md ring-1 ring-hibryda-500' 
                                : 'border-gray-200 bg-white hover:border-hibryda-300'
                            }`}
                        >
                            {selectedClients.includes(client.id) && (
                                <div className="absolute top-0 left-0 w-1 h-full bg-hibryda-500"></div>
                            )}
                            <div className="flex justify-between items-center pl-2">
                                <span className="font-semibold text-sm text-gray-800">{client.name}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                    client.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                                }`}>{client.priority}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 truncate pl-2">{client.address}</p>
                            <div className="mt-2 flex justify-between text-xs text-gray-400 pl-2">
                                <span>{client.windowStart} - {client.windowEnd}</span>
                                <span>{client.volume}kg</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-white">
            <button 
                onClick={handleGenerateRoute}
                disabled={loading || selectedClients.length === 0}
                className={`w-full flex items-center justify-center py-4 rounded-lg text-white font-bold shadow-lg transform transition-all active:scale-95 ${
                    loading || selectedClients.length === 0 
                    ? 'bg-gray-300 cursor-not-allowed shadow-none' 
                    : 'bg-gradient-to-r from-hibryda-accentBold to-hibryda-accent hover:shadow-xl'
                }`}
            >
                {loading ? <RotateCcw className="animate-spin mr-2" /> : <Play className="mr-2 fill-current" size={20} />}
                {loading ? 'CALCULANDO ROTA...' : 'GERAR ROTA AGORA'}
            </button>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-slate-100 h-[500px] lg:h-full z-0">
        <MapContainer 
            center={[depotLocation.lat, depotLocation.lng]} 
            zoom={12} 
            style={{ height: '100%', width: '100%' }}
            preferCanvas={true} // Performance optimization for routes
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                updateWhenZooming={false} // Improves smoothness during zoom
                updateWhenIdle={true}
                keepBuffer={2} // Pre-load nearby tiles
            />
            
            <MapControls points={allMapPoints} />
            <MapLegend />

            <RecenterMap center={depotLocation} />

            <Marker position={[depotLocation.lat, depotLocation.lng]} icon={DepotIcon}>
                <Popup>
                    <strong>{depotName}</strong><br/>
                    Ponto de Partida e Chegada
                </Popup>
            </Marker>
            
            {/* Memoized Markers Layer */}
            <MemoizedMarkers clients={MOCK_CLIENTS} />

            {/* Route Layers */}
            {generatedRoute && routeGeometry.length > 0 && (
                <>
                    <MemoizedRoutePolyline geometry={routeGeometry} />
                    <MemoizedRouteStops route={generatedRoute} />
                    <FitBoundsOnLoad points={routeGeometry} />
                </>
            )}
        </MapContainer>

        {/* Vehicle Details Overlay */}
        {currentVehicleObj && (
            <div className="absolute bottom-8 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-100 z-[400] w-64 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center mb-3 border-b border-gray-100 pb-2">
                    <div className="p-2 bg-hibryda-50 rounded-lg mr-3">
                        <Truck className="text-hibryda-600" size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Veículo Selecionado</p>
                        <p className="text-sm font-bold text-gray-800">{currentVehicleObj.plate}</p>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 flex items-center"><User size={12} className="mr-1"/> Motorista:</span>
                        <span className="font-medium text-gray-700">{currentVehicleObj.driver}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 flex items-center"><Weight size={12} className="mr-1"/> Capacidade:</span>
                        <span className="font-medium text-gray-700">{currentVehicleObj.capacity}kg</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">Status:</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${currentVehicleObj.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {currentVehicleObj.status === 'Available' ? 'Disponível' : 'Em Rota'}
                        </span>
                    </div>
                </div>
            </div>
        )}

        {/* Stats Overlay */}
        {routeStats && (
            <div className="absolute top-4 right-14 bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-xl z-[400] w-80 border border-white/20">
                <div className="flex justify-between items-center mb-3">
                   <h3 className="font-bold text-gray-800">Resumo da Viagem</h3>
                   <span className="bg-hibryda-100 text-hibryda-700 text-xs px-2 py-1 rounded-full font-bold">
                       {useGoogle ? 'GOOGLE MAPS' : 'LOCAL TSP'}
                   </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wide">Distância</span>
                        <span className="block text-xl font-extrabold text-slate-700">{routeStats.dist} <span className="text-xs font-normal">km</span></span>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
                        <span className="block text-[10px] text-orange-400 uppercase font-bold tracking-wide">Tempo</span>
                        <span className="block text-xl font-extrabold text-orange-600">
                           {Math.floor(routeStats.time / 60)}<span className="text-sm">h</span> {routeStats.time % 60}<span className="text-sm">m</span>
                        </span>
                    </div>
                </div>
                
                {aiAnalysis && (
                    <div className="bg-indigo-50 p-4 rounded-xl mb-4 border border-indigo-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                            <Sparkles size={40} />
                        </div>
                        <div className="flex items-center mb-2">
                            <Sparkles size={14} className="text-indigo-600 mr-2" />
                            <span className="text-xs font-bold text-indigo-700 uppercase">Análise de IA</span>
                        </div>
                        <p className="text-xs text-indigo-900 leading-relaxed font-medium">{aiAnalysis}</p>
                    </div>
                )}

                <div className="flex space-x-2">
                    <button onClick={exportPDF} className="flex-1 flex items-center justify-center bg-slate-800 text-white py-2.5 rounded-lg text-xs font-bold hover:bg-slate-900 transition-colors">
                        <FileText size={14} className="mr-2" /> PDF
                    </button>
                    <button className="flex-1 flex items-center justify-center bg-hibryda-600 text-white py-2.5 rounded-lg text-xs font-bold hover:bg-hibryda-700 transition-colors shadow-md shadow-hibryda-200">
                        <Save size={14} className="mr-2" /> SALVAR
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}