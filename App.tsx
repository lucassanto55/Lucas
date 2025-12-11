import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Planner } from './pages/Planner';
import { Settings } from './pages/Settings';
import { Vehicles } from './pages/Vehicles';
import { Clients } from './pages/Clients';
import { AppView } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard />;
      case AppView.PLANNER:
        return <Planner />;
      case AppView.CLIENTS:
        return <Clients />;
      case AppView.VEHICLES:
        return <Vehicles />;
      case AppView.SETTINGS:
        return <Settings isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentView={currentView} onChangeView={setCurrentView} isDarkMode={isDarkMode}>
      {renderView()}
    </Layout>
  );
}