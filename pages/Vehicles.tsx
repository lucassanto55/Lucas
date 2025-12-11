import React from 'react';
import { Truck, Fuel, Wrench, Gauge, Calendar, AlertTriangle, CheckCircle, MoreVertical } from 'lucide-react';

interface VehicleData {
  id: string;
  model: string;
  plate: string;
  year: number;
  driver: string;
  status: 'Available' | 'In Route' | 'Maintenance';
  fuelLevel: number; // 0-100
  mileage: number; // km
  lastServiceDate: string;
  nextServiceKm: number;
  image: string;
}

const MOCK_VEHICLES: VehicleData[] = [
  {
    id: 'v1',
    model: 'Fiat Fiorino Endurance 1.4',
    plate: 'HIB-9988',
    year: 2023,
    driver: 'Carlos Silva',
    status: 'Available',
    fuelLevel: 85,
    mileage: 42500,
    lastServiceDate: '15/01/2024',
    nextServiceKm: 50000,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=300&h=200' // Generic car placeholder
  },
  {
    id: 'v2',
    model: 'Fiat Fiorino Working 1.4',
    plate: 'RIO-7722',
    year: 2022,
    driver: 'João Santos',
    status: 'In Route',
    fuelLevel: 45,
    mileage: 68100,
    lastServiceDate: '10/11/2023',
    nextServiceKm: 70000,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=300&h=200'
  },
  {
    id: 'v3',
    model: 'Fiat Fiorino EVO Flex',
    plate: 'ABC-1234',
    year: 2021,
    driver: 'Marcos Oliveira',
    status: 'Maintenance',
    fuelLevel: 15,
    mileage: 89900,
    lastServiceDate: '05/06/2023',
    nextServiceKm: 90000,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=300&h=200'
  }
];

const VehicleCard = ({ vehicle }: { vehicle: VehicleData }) => {
  // Helpers para cores e status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'In Route': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'Maintenance': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Available': return 'Disponível';
      case 'In Route': return 'Em Rota';
      case 'Maintenance': return 'Manutenção';
      default: return status;
    }
  };

  const getFuelColor = (level: number) => {
    if (level > 50) return 'bg-green-500';
    if (level > 20) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const kmToNextService = vehicle.nextServiceKm - vehicle.mileage;
  const isServiceNear = kmToNextService < 1000;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header do Card */}
      <div className="p-4 flex justify-between items-start border-b border-gray-100 dark:border-slate-700">
        <div className="flex items-center">
            <div className="p-2 bg-hibryda-50 dark:bg-slate-700 rounded-lg mr-3">
                <Truck className="text-hibryda-600 dark:text-hibryda-400" size={24} />
            </div>
            <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100">{vehicle.model}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{vehicle.plate} • {vehicle.year}</p>
            </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(vehicle.status)}`}>
            {getStatusLabel(vehicle.status)}
        </span>
      </div>

      <div className="p-5 space-y-6">
        
        {/* Motorista */}
        <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 dark:text-gray-400">Motorista Responsável</span>
            <span className="font-semibold text-gray-700 dark:text-gray-200">{vehicle.driver}</span>
        </div>

        {/* Nível de Combustível */}
        <div>
            <div className="flex justify-between items-center mb-1">
                <div className="flex items-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    <Fuel size={14} className="mr-1" /> Nível de Tanque
                </div>
                <span className={`text-xs font-bold ${vehicle.fuelLevel < 20 ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
                    {vehicle.fuelLevel}%
                </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5">
                <div 
                    className={`h-2.5 rounded-full transition-all duration-500 ${getFuelColor(vehicle.fuelLevel)}`} 
                    style={{ width: `${vehicle.fuelLevel}%` }}
                ></div>
            </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 pt-2">
            {/* Quilometragem */}
            <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-100 dark:border-slate-600">
                <div className="flex items-center text-gray-400 mb-1">
                    <Gauge size={14} className="mr-1" />
                    <span className="text-[10px] uppercase font-bold">Odômetro</span>
                </div>
                <span className="text-lg font-bold text-slate-700 dark:text-slate-200">
                    {vehicle.mileage.toLocaleString('pt-BR')} <span className="text-xs font-normal">km</span>
                </span>
            </div>

            {/* Revisão */}
            <div className={`p-3 rounded-lg border ${isServiceNear ? 'bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800' : 'bg-slate-50 border-slate-100 dark:bg-slate-700/50 dark:border-slate-600'}`}>
                <div className="flex items-center text-gray-400 mb-1">
                    <Wrench size={14} className="mr-1" />
                    <span className="text-[10px] uppercase font-bold">Próx. Revisão</span>
                </div>
                <div className="flex items-center">
                    <span className={`text-lg font-bold ${isServiceNear ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-200'}`}>
                        {kmToNextService} <span className="text-xs font-normal">km</span>
                    </span>
                    {isServiceNear && <AlertTriangle size={16} className="text-amber-500 ml-2" />}
                </div>
            </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center text-xs text-gray-400 pt-2 border-t border-gray-100 dark:border-slate-700">
            <Calendar size={12} className="mr-1" />
            Última manutenção: {vehicle.lastServiceDate}
        </div>

      </div>
    </div>
  );
};

export const Vehicles: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* Header da Página */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 flex items-center">
                <Truck className="mr-3 text-hibryda-600" /> Gestão de Frota
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Monitoramento de combustível, manutenção e disponibilidade.</p>
        </div>
        
        <div className="flex space-x-3">
            <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col items-center">
                <span className="text-[10px] text-gray-400 uppercase font-bold">Total Veículos</span>
                <span className="font-bold text-lg text-gray-800 dark:text-gray-100">03</span>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg border border-green-100 dark:border-green-800 shadow-sm flex flex-col items-center">
                <span className="text-[10px] text-green-600 dark:text-green-400 uppercase font-bold">Disponíveis</span>
                <span className="font-bold text-lg text-green-700 dark:text-green-300">01</span>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-lg border border-amber-100 dark:border-amber-800 shadow-sm flex flex-col items-center">
                <span className="text-[10px] text-amber-600 dark:text-amber-400 uppercase font-bold">Em Rota</span>
                <span className="font-bold text-lg text-amber-700 dark:text-amber-300">01</span>
            </div>
        </div>
      </div>

      {/* Grid de Veículos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_VEHICLES.map(vehicle => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
        
        {/* Card de Adicionar (Exemplo) */}
        <div className="border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center p-8 text-gray-400 hover:text-hibryda-500 hover:border-hibryda-400 transition-colors cursor-pointer min-h-[300px]">
            <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center mb-4">
                <Truck size={32} />
            </div>
            <span className="font-bold text-sm">Adicionar Novo Veículo</span>
            <span className="text-xs text-center mt-2 opacity-70">Cadastre novas Fiorinos ou caminhões na frota.</span>
        </div>
      </div>

    </div>
  );
};
