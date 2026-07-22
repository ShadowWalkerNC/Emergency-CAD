import React, { useState } from 'react';
import MobileResponder from './MobileResponder';
import DispatcherConsole from './DispatcherConsole';
import Onboarding from './Onboarding';
import TrainingResources from './TrainingResources';
import { ShieldAlert, Monitor, Smartphone, Server, Database, MonitorPlay, Wifi, Container, Rocket, Download } from 'lucide-react';

export default function App() {
  const [role, setRole] = useState<'SELECT' | 'DISPATCH' | 'FIELD' | 'ONBOARDING' | 'RESOURCES'>('SELECT');

  if (role === 'ONBOARDING') {
    return <Onboarding onComplete={() => setRole('SELECT')} />;
  }

  if (role === 'DISPATCH') {
    return <DispatcherConsole />;
  }

  if (role === 'FIELD') {
    return <MobileResponder unitId="M51" />;
  }

  if (role === 'RESOURCES') {
    return <TrainingResources onBack={() => setRole('SELECT')} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center p-6 font-sans text-slate-200 overflow-y-auto">
      <div className="w-full flex justify-end mb-4">
        <button 
          onClick={() => setRole('ONBOARDING')}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border border-slate-700 transition-colors"
        >
          <Server size={16} /> Server Setup Wizard
        </button>
      </div>

      <div className="mt-6 mb-12 text-center max-w-3xl">
        <div className="bg-blue-600 w-20 h-20 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-blue-900/50">
          <ShieldAlert size={40} className="text-white" />
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">OpenCAD Training Academy</h1>
        <p className="text-slate-400 mb-6">Select your training simulation environment</p>
        
        <div className="flex justify-center gap-4">
          <a 
            href="/OpenCAD-Responder.apk"
            download
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-lg shadow-emerald-900/20"
          >
            <Download size={16} /> Download Field Trainee APK
          </a>
        </div>
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
          <h2 className="text-3xl font-black text-white mb-4">Training Resources & Homework</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Access simulation guides, standard operating procedures, and homework assignments to prepare for live deployment.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <button onClick={() => setRole('RESOURCES')} className="flex flex-col items-center gap-3 bg-slate-950 p-6 rounded-xl border border-slate-800 hover:border-blue-500 transition-colors group">
            <div className="bg-slate-800 p-4 rounded-xl text-blue-400 group-hover:bg-blue-600/20">
              <MonitorPlay size={32} />
            </div>
            <h3 className="font-bold text-white uppercase text-xs tracking-wider">Simulation Scenarios</h3>
            <p className="text-slate-400 text-sm font-medium">Practice with pre-built incidents and radio traffic.</p>
          </button>
          
          <button onClick={() => setRole('RESOURCES')} className="flex flex-col items-center gap-3 bg-slate-950 p-6 rounded-xl border border-slate-800 hover:border-emerald-500 transition-colors group">
            <div className="bg-slate-800 p-4 rounded-xl text-emerald-400 group-hover:bg-emerald-600/20">
              <Database size={32} />
            </div>
            <h3 className="font-bold text-white uppercase text-xs tracking-wider">Join Multiplayer Training</h3>
            <p className="text-slate-400 text-sm font-medium">Connect with instructors and other trainees in real-time.</p>
          </button>
          
          <button onClick={() => setRole('RESOURCES')} className="flex flex-col items-center gap-3 bg-slate-950 p-6 rounded-xl border border-slate-800 hover:border-purple-500 transition-colors group">
            <div className="bg-slate-800 p-4 rounded-xl text-purple-400 group-hover:bg-purple-600/20">
              <Container size={32} />
            </div>
            <h3 className="font-bold text-white uppercase text-xs tracking-wider">Homework Assignments</h3>
            <p className="text-slate-400 text-sm font-medium">Review dispatch logs and complete knowledge checks.</p>
          </button>
        </div>
      </div>

    </div>
  );
}
