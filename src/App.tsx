import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header /> 
      
      <main className="flex-grow py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default App;