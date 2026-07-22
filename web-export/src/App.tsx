import React, { useState } from 'react';
import MobileResponder from './MobileResponder';
import DispatcherConsole from './DispatcherConsole';
import { ShieldAlert, Monitor, Smartphone } from 'lucide-react';

export default function App() {
  const [role, setRole] = useState<'SELECT' | 'DISPATCH' | 'FIELD'>('SELECT');

  if (role === 'DISPATCH') {
    return <DispatcherConsole />;
  }

  if (role === 'FIELD') {
    return <MobileResponder unitId="M51" />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 font-sans text-slate-200">
      <div className="mb-12 text-center">
        <div className="bg-blue-600 w-20 h-20 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-blue-900/50">
          <ShieldAlert size={40} className="text-white" />
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">OpenCAD Platform</h1>
        <p className="text-slate-400">Select your operational environment</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <button 
          onClick={() => setRole('DISPATCH')}
          className="bg-slate-900 border-2 border-slate-800 hover:border-blue-500 rounded-2xl p-8 flex flex-col items-center text-center transition-all hover:scale-105 group"
        >
          <div className="bg-slate-800 p-4 rounded-full mb-6 group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors">
            <Monitor size={48} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Dispatcher Console</h2>
          <p className="text-slate-400 text-sm">
            Training simulator. Listen to radio feeds, practice transcribing calls, and track units on the map.
          </p>
        </button>

        <button 
          onClick={() => setRole('FIELD')}
          className="bg-slate-900 border-2 border-slate-800 hover:border-emerald-500 rounded-2xl p-8 flex flex-col items-center text-center transition-all hover:scale-105 group"
        >
          <div className="bg-slate-800 p-4 rounded-full mb-6 group-hover:bg-emerald-600/20 group-hover:text-emerald-400 transition-colors">
            <Smartphone size={48} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Mobile Responder (MDT)</h2>
          <p className="text-slate-400 text-sm">
            Field view. Receive incidents, update status, and navigate to scenes from a mobile-friendly terminal.
          </p>
        </button>
      </div>
    </div>
  );
}
