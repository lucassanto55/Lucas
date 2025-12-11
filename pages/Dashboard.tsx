import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Truck, MapPin, Package, Clock, TrendingUp } from 'lucide-react';

const data = [
  { name: 'Seg', entregas: 40, tempo: 240 },
  { name: 'Ter', entregas: 30, tempo: 139 },
  { name: 'Qua', entregas: 55, tempo: 320 },
  { name: 'Qui', entregas: 48, tempo: 290 },
  { name: 'Sex', entregas: 60, tempo: 380 },
  { name: 'Sab', entregas: 35, tempo: 210 },
];

const StatCard = ({ title, value, icon: Icon, colorClass, iconColor }: { title: string, value: string, icon: any, colorClass: string, iconColor: string }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-start justify-between hover:shadow-md transition-all">
    <div>
      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1 uppercase tracking-wide">{title}</p>
      <h3 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">{value}</h3>
    </div>
    <div className={`p-3 rounded-lg ${colorClass} dark:bg-slate-700`}>
      <Icon className={iconColor} size={24} />
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Entregas Hoje" value="24" icon={Package} colorClass="bg-hibryda-50" iconColor="text-hibryda-600" />
        <StatCard title="Em Rota" value="3/5" icon={Truck} colorClass="bg-orange-50" iconColor="text-orange-500" />
        <StatCard title="KM Rodados" value="142" icon={MapPin} colorClass="bg-blue-50" iconColor="text-blue-500" />
        <StatCard title="Pontualidade" value="98%" icon={Clock} colorClass="bg-green-50" iconColor="text-green-500" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Volume Semanal</h3>
             <TrendingUp size={18} className="text-gray-400" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} strokeOpacity={0.2} />
                <XAxis dataKey="name" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#fff' }}
                />
                <Bar dataKey="entregas" fill="#54c6d9" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Tempo de Rota (min)</h3>
            <Clock size={18} className="text-gray-400" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} strokeOpacity={0.2} />
                <XAxis dataKey="name" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <Tooltip 
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="tempo" stroke="#ea580c" strokeWidth={3} dot={{r: 4, fill: '#ea580c', strokeWidth: 2, stroke: '#fff'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Status das Rotas Ativas</h3>
          <button className="text-sm text-hibryda-600 font-semibold hover:text-hibryda-800">Ver Todas</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-400 uppercase bg-gray-50 dark:bg-slate-700 font-medium">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Destino Principal</th>
                <th className="px-6 py-4">Veículo</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Previsão</th>
              </tr>
            </thead>
            <tbody>
              {[101, 102, 103, 104, 105].map((id) => (
                <tr key={id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-hibryda-900 dark:text-hibryda-400">#{id}</td>
                  <td className="px-6 py-4 font-medium dark:text-gray-300">Peixaria Central (Box 4)</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">Fiat Fiorino <span className="text-gray-400 dark:text-gray-500 text-xs">(ABC-1234)</span></td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      id % 2 === 0 
                        ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' 
                        : 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'
                    }`}>
                      {id % 2 === 0 ? 'CONCLUÍDO' : 'EM TRÂNSITO'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-mono">10:30</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
