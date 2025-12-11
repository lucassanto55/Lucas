import React from 'react';
import { Moon, Sun, Bell, Shield, Smartphone, Monitor, User, Globe, Lock } from 'lucide-react';

interface SettingsProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const SettingSection = ({ title, children, isDarkMode }: { title: string, children: React.ReactNode, isDarkMode: boolean }) => (
  <div className={`mb-6 rounded-xl border overflow-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
    <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-gray-50 bg-gray-50'}`}>
      <h3 className={`font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{title}</h3>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const ToggleRow = ({ label, description, checked, onChange, icon: Icon, isDarkMode }: any) => (
  <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
    <div className="flex items-start">
      <div className={`p-2 rounded-lg mr-4 ${isDarkMode ? 'bg-slate-700 text-hibryda-400' : 'bg-hibryda-50 text-hibryda-600'}`}>
        <Icon size={20} />
      </div>
      <div>
        <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{label}</h4>
        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{description}</p>
      </div>
    </div>
    <button 
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-hibryda-500 focus:ring-offset-2 ${
        checked ? 'bg-hibryda-500' : (isDarkMode ? 'bg-slate-600' : 'bg-gray-200')
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

export const Settings: React.FC<SettingsProps> = ({ isDarkMode, toggleTheme }) => {
  return (
    <div className={`p-8 max-w-4xl mx-auto animate-in fade-in duration-500 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold tracking-tight">Configurações do Sistema</h2>
        <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gerencie suas preferências de aparência, notificações e conta.</p>
      </div>

      <SettingSection title="Aparência e Interface" isDarkMode={isDarkMode}>
        <ToggleRow 
          label="Modo Escuro" 
          description="Ajustar a interface para ambientes com pouca luz."
          checked={isDarkMode}
          onChange={toggleTheme}
          icon={isDarkMode ? Moon : Sun}
          isDarkMode={isDarkMode}
        />
        <div className={`my-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-gray-100'}`}></div>
        <ToggleRow 
          label="Interface Compacta" 
          description="Reduzir o espaçamento das listas para exibir mais dados."
          checked={false}
          onChange={() => {}}
          icon={Monitor}
          isDarkMode={isDarkMode}
        />
      </SettingSection>

      <SettingSection title="Notificações e Alertas" isDarkMode={isDarkMode}>
        <ToggleRow 
          label="Alertas de Rota" 
          description="Receber notificações quando um veículo sair da rota planejada."
          checked={true}
          onChange={() => {}}
          icon={Bell}
          isDarkMode={isDarkMode}
        />
        <div className={`my-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-gray-100'}`}></div>
        <ToggleRow 
          label="Push Mobile" 
          description="Enviar atualizações para o aplicativo dos motoristas."
          checked={true}
          onChange={() => {}}
          icon={Smartphone}
          isDarkMode={isDarkMode}
        />
      </SettingSection>

       <SettingSection title="Segurança e Conta" isDarkMode={isDarkMode}>
        <ToggleRow 
          label="Autenticação em Dois Fatores" 
          description="Adicionar uma camada extra de segurança ao fazer login."
          checked={false}
          onChange={() => {}}
          icon={Shield}
          isDarkMode={isDarkMode}
        />
        <div className={`my-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-gray-100'}`}></div>
         <div className="flex items-center justify-between py-2">
            <div className="flex items-center text-sm text-gray-500">
                <Lock size={16} className="mr-2" />
                <span>Última alteração de senha: há 30 dias</span>
            </div>
            <button className={`text-xs font-bold px-3 py-2 rounded-lg transition-colors ${
                isDarkMode 
                ? 'bg-slate-700 text-white hover:bg-slate-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}>
                ALTERAR SENHA
            </button>
         </div>
      </SettingSection>
    </div>
  );
};
