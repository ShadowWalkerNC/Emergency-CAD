import React, { useState } from 'react';
import MobileResponder from './MobileResponder';
import DispatcherConsole from './DispatcherConsole';
import { ShieldAlert, Monitor, Smartphone, Server, Database, MonitorPlay, Wifi, Container } from 'lucide-react';

export default function App() {
  const [role, setRole] = useState<'SELECT' | 'DISPATCH' | 'FIELD'>('SELECT');

  if (role === 'DISPATCH') {
    return <DispatcherConsole />;
  }

  if (role === 'FIELD') {
    return <MobileResponder unitId="M51" />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center p-6 font-sans text-slate-200 overflow-y-auto">
      <div className="mt-12 mb-12 text-center max-w-3xl">
        <div className="bg-blue-600 w-20 h-20 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-blue-900/50">
          <ShieldAlert size={40} className="text-white" />
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">OpenCAD Platform</h1>
        <p className="text-slate-400">Select your operational environment</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-16">
        <button 
          onClick={() => setRole('DISPATCH')}
          className="bg-slate-900 border-2 border-slate-800 hover:border-blue-500 rounded-2xl p-8 flex flex-col items-center text-center transition-all hover:scale-105 group"
        >
          <div className="bg-slate-800 p-4 rounded-full mb-6 group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors">
            <Monitor size={48} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Dispatcher Console</h2>
          <p className="text-slate-400 text-sm">
            Full incident lifecycle management with unit assignment, action logging, and interactive mapping.
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

      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white mb-4">Runs Anywhere</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Minimal requirements. Runs on hardware as modest as a Raspberry Pi or a $5/month VPS. 
            The features you need at a price you can afford (Free Forever).
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="bg-slate-800 p-4 rounded-xl text-blue-400">
              <Server size={32} />
            </div>
            <h3 className="font-bold text-white uppercase text-xs tracking-wider">Server</h3>
            <p className="text-slate-400 text-sm font-medium">Apache + PHP 7.4+</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="bg-slate-800 p-4 rounded-xl text-emerald-400">
              <Database size={32} />
            </div>
            <h3 className="font-bold text-white uppercase text-xs tracking-wider">Database</h3>
            <p className="text-slate-400 text-sm font-medium">MySQL / MariaDB</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="bg-slate-800 p-4 rounded-xl text-purple-400">
              <MonitorPlay size={32} />
            </div>
            <h3 className="font-bold text-white uppercase text-xs tracking-wider">Client</h3>
            <p className="text-slate-400 text-sm font-medium">Any Modern Browser</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="bg-slate-800 p-4 rounded-xl text-orange-400">
              <Wifi size={32} />
            </div>
            <h3 className="font-bold text-white uppercase text-xs tracking-wider">Network</h3>
            <p className="text-slate-400 text-sm font-medium">LAN or Internet</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="bg-slate-800 p-4 rounded-xl text-sky-400">
              <Container size={32} />
            </div>
            <h3 className="font-bold text-white uppercase text-xs tracking-wider">Docker</h3>
            <p className="text-slate-400 text-sm font-medium">Image Available</p>
          </div>
        </div>
      </div>

    </div>
  );
}
