import React from 'react';
import { Users, Phone, MapPin, FileText, Briefcase, Search, Filter, Star, UserCheck } from 'lucide-react';

interface ClientData {
  id: string;
  name: string;
  tradeName?: string;
  documentType: 'CNPJ' | 'CPF';
  documentNumber: string;
  address: string;
  district: string;
  phone: string;
  email: string;
  priority: 'High' | 'Medium' | 'Low';
  salesperson: {
    name: string;
    phone: string;
  };
  lastPurchase: string;
}

const MOCK_CLIENTS_DETAILED: ClientData[] = [
  {
    id: '1',
    name: 'PEIXARIA CENTRAL LTDA',
    tradeName: 'Peixaria Central (Icaraí)',
    documentType: 'CNPJ',
    documentNumber: '12.345.678/0001-90',
    address: 'Rua Gavião Peixoto, 102',
    district: 'Icaraí, Niterói - RJ',
    phone: '(21) 99888-7766',
    email: 'compras@peixariacentral.com.br',
    priority: 'High',
    salesperson: {
      name: 'Roberto Vendas',
      phone: '(21) 97777-1111'
    },
    lastPurchase: 'R$ 4.500,00'
  },
  {
    id: '2',
    name: 'JOSE RICARDO SANTOS',
    tradeName: 'Restaurante Siri (Charitas)',
    documentType: 'CPF',
    documentNumber: '123.456.789-00',
    address: 'Av. Quintino Bocaiúva, 500',
    district: 'Charitas, Niterói - RJ',
    phone: '(21) 98822-3344',
    email: 'siri.restaurante@gmail.com',
    priority: 'Medium',
    salesperson: {
      name: 'Fernanda Costa',
      phone: '(21) 96666-2222'
    },
    lastPurchase: 'R$ 2.100,00'
  },
  {
    id: '3',
    name: 'MERCADO DO PORTO S.A.',
    tradeName: 'Mercado do Porto',
    documentType: 'CNPJ',
    documentNumber: '98.765.432/0001-11',
    address: 'Av. Rodrigues Alves, 10',
    district: 'Zona Portuária, Rio de Janeiro',
    phone: '(21) 2233-4455',
    email: 'financeiro@mercadoporto.com.br',
    priority: 'High',
    salesperson: {
      name: 'Roberto Vendas',
      phone: '(21) 97777-1111'
    },
    lastPurchase: 'R$ 8.900,00'
  },
  {
    id: '4',
    name: 'QUIOSQUE BARRA WAY EIRELI',
    tradeName: 'BarraWay Quiosque',
    documentType: 'CNPJ',
    documentNumber: '45.123.789/0001-22',
    address: 'Av. Lúcio Costa, Quiosque 45',
    district: 'Barra da Tijuca, RJ',
    phone: '(21) 99111-2233',
    email: 'gerencia@barraway.com',
    priority: 'Low',
    salesperson: {
      name: 'Fernanda Costa',
      phone: '(21) 96666-2222'
    },
    lastPurchase: 'R$ 950,00'
  }
];

const ClientCard = ({ client }: { client: ClientData }) => {
    const isCNPJ = client.documentType === 'CNPJ';

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all group">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg">{client.tradeName || client.name}</h3>
                    <p className="text-xs text-gray-400 font-mono mt-0.5 uppercase">{client.name}</p>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                    client.priority === 'High' 
                    ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:border-red-800' 
                    : client.priority === 'Medium'
                        ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800'
                        : 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                }`}>
                    {client.priority} Priority
                </div>
            </div>

            <div className="p-5 space-y-4">
                
                {/* Document & Stats */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className={`p-1.5 rounded-md ${isCNPJ ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400'}`}>
                            <FileText size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase font-bold">{client.documentType}</p>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 font-mono">{client.documentNumber}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Última Compra</p>
                        <p className="text-sm font-bold text-green-600 dark:text-green-400">{client.lastPurchase}</p>
                    </div>
                </div>

                {/* Address */}
                <div className="bg-slate-50 dark:bg-slate-700/30 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                    <div className="flex items-start">
                        <MapPin size={16} className="text-hibryda-500 mt-0.5 mr-2 shrink-0" />
                        <div>
                            <p className="text-sm text-gray-700 dark:text-gray-200 leading-snug">{client.address}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{client.district}</p>
                        </div>
                    </div>
                </div>

                {/* Contacts Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100 dark:border-slate-700">
                    {/* Client Contact */}
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold mb-2 flex items-center">
                            <Phone size={10} className="mr-1" /> Contato do Cliente
                        </p>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{client.phone}</span>
                        </div>
                        <span className="text-xs text-hibryda-600 truncate block mt-0.5">{client.email}</span>
                    </div>

                    {/* Salesperson */}
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold mb-2 flex items-center">
                            <Briefcase size={10} className="mr-1" /> Vendedor Responsável
                        </p>
                        <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 text-xs font-bold mr-2">
                                {client.salesperson.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-700 dark:text-gray-200">{client.salesperson.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{client.salesperson.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export const Clients: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 flex items-center">
                    <Users className="mr-3 text-hibryda-600" /> Carteira de Clientes
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Gerencie os dados cadastrais e contatos comerciais.</p>
            </div>

            <div className="flex w-full md:w-auto space-x-2">
                <div className="relative flex-1 md:w-64">
                    <input 
                        type="text" 
                        placeholder="Buscar por nome, CNPJ..." 
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-hibryda-500 outline-none dark:text-gray-200"
                    />
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                </div>
                <button className="p-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700">
                    <Filter size={20} />
                </button>
            </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center">
                <div className="p-3 rounded-lg bg-hibryda-50 dark:bg-hibryda-900/20 text-hibryda-600 mr-4">
                    <Users size={20} />
                </div>
                <div>
                    <p className="text-xs text-gray-400 uppercase font-bold">Total Clientes</p>
                    <p className="text-xl font-bold text-gray-800 dark:text-gray-100">142</p>
                </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center">
                <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 mr-4">
                    <FileText size={20} />
                </div>
                <div>
                    <p className="text-xs text-gray-400 uppercase font-bold">Pessoas Jurídicas</p>
                    <p className="text-xl font-bold text-gray-800 dark:text-gray-100">89</p>
                </div>
            </div>
             <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center">
                <div className="p-3 rounded-lg bg-teal-50 dark:bg-teal-900/20 text-teal-600 mr-4">
                    <UserCheck size={20} />
                </div>
                <div>
                    <p className="text-xs text-gray-400 uppercase font-bold">Pessoas Físicas</p>
                    <p className="text-xl font-bold text-gray-800 dark:text-gray-100">53</p>
                </div>
            </div>
             <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center">
                <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 mr-4">
                    <Star size={20} />
                </div>
                <div>
                    <p className="text-xs text-gray-400 uppercase font-bold">Alta Prioridade</p>
                    <p className="text-xl font-bold text-gray-800 dark:text-gray-100">12</p>
                </div>
            </div>
        </div>

        {/* Client Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {MOCK_CLIENTS_DETAILED.map(client => (
                <ClientCard key={client.id} client={client} />
            ))}
        </div>
    </div>
  );
};