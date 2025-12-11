import React, { ReactNode } from 'react';
import { AppView } from '../types';
import { LayoutDashboard, Map, Users, Truck, Settings, LogOut } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  isDarkMode?: boolean;
}

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick,
  isDarkMode
}: { 
  icon: any, 
  label: string, 
  active: boolean, 
  onClick: () => void,
  isDarkMode?: boolean
}) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 mb-2 rounded-r-lg transition-all border-l-4 ${
      active 
        ? 'bg-gradient-to-r from-hibryda-500 to-hibryda-600 text-white shadow-lg border-hibryda-accent' 
        : `border-transparent hover:text-hibryda-600 ${isDarkMode ? 'text-gray-400 hover:bg-slate-800' : 'text-gray-500 hover:bg-hibryda-50'}`
    }`}
  >
    <Icon size={20} className={`mr-3 ${active ? 'text-white' : ''}`} />
    <span className="font-medium">{label}</span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView, isDarkMode }) => {
  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      {/* Sidebar */}
      <aside className={`w-64 flex flex-col shadow-xl z-20 border-r transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
        <div className={`p-8 flex flex-col items-center justify-center border-b transition-colors duration-300 ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-gray-100 bg-white'}`}>
           {/* Logo Text Only - Clean & Modern */}
           <div className="text-center">
             <h1 className="text-hibryda-500 text-3xl font-extrabold tracking-widest font-sans">HIBRYDA</h1>
             <span className="text-hibryda-accent text-sm tracking-[0.4em] font-bold uppercase mt-1 block">ROTAS</span>
           </div>
        </div>

        <nav className="flex-1 pr-4 py-6 overflow-y-auto pl-0">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={currentView === AppView.DASHBOARD} 
            onClick={() => onChangeView(AppView.DASHBOARD)} 
            isDarkMode={isDarkMode}
          />
          <SidebarItem 
            icon={Map} 
            label="Planejador" 
            active={currentView === AppView.PLANNER} 
            onClick={() => onChangeView(AppView.PLANNER)} 
            isDarkMode={isDarkMode}
          />
          <SidebarItem 
            icon={Users} 
            label="Clientes" 
            active={currentView === AppView.CLIENTS} 
            onClick={() => onChangeView(AppView.CLIENTS)} 
            isDarkMode={isDarkMode}
          />
          <SidebarItem 
            icon={Truck} 
            label="Veículos" 
            active={currentView === AppView.VEHICLES} 
            onClick={() => onChangeView(AppView.VEHICLES)} 
            isDarkMode={isDarkMode}
          />
          <SidebarItem 
            icon={Settings} 
            label="Configurações" 
            active={currentView === AppView.SETTINGS} 
            onClick={() => onChangeView(AppView.SETTINGS)} 
            isDarkMode={isDarkMode}
          />
        </nav>

        <div className={`p-4 border-t transition-colors duration-300 ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-gray-100 bg-white'}`}>
          <button className={`flex items-center transition-colors w-full px-4 py-2 group ${isDarkMode ? 'text-gray-400 hover:text-hibryda-accent' : 'text-gray-500 hover:text-hibryda-accent'}`}>
            <LogOut size={18} className="mr-3 group-hover:text-hibryda-accent" />
            <span>Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col h-full overflow-hidden relative transition-colors duration-300 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <header className={`shadow-sm h-16 flex items-center justify-between px-8 z-10 border-b transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
          <h2 className={`text-xl font-bold flex items-center ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            {currentView === AppView.DASHBOARD && "Visão Geral"}
            {currentView === AppView.PLANNER && "Otimização de Entregas"}
            {currentView === AppView.CLIENTS && "Gestão da Carteira"}
            {currentView === AppView.VEHICLES && "Frota Disponível"}
            {currentView === AppView.SETTINGS && "Configurações do Sistema"}
          </h2>
          <div className="flex items-center space-x-4">
             <div className="flex flex-col items-end hidden md:flex">
                <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Admin Logística</span>
                <span className="text-xs text-hibryda-600">Hibryda Pescados</span>
             </div>
             <div className={`w-10 h-10 rounded-full flex items-center justify-center text-hibryda-600 font-bold border shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-hibryda-50 border-hibryda-100'}`}>
               AD
             </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto relative">
          {children}
        </div>
      </main>
    </div>
  );
};
