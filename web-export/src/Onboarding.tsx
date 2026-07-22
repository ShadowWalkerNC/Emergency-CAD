import React, { useState } from 'react';
import { Server, Database, User, ShieldAlert, CheckCircle2, Download, Smartphone, ArrowRight, Loader2, Play, Copy } from 'lucide-react';

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [isSimulating, setIsSimulating] = useState(false);

  const simulateStep = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setStep(step + 1);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 font-sans text-slate-200">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
        
        {/* Sidebar Steps */}
        <div className="w-full md:w-64 bg-slate-950/50 p-6 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col gap-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="text-blue-500" size={24} />
            <span className="font-bold text-white tracking-tight">OpenCAD Setup</span>
          </div>
          
          <StepIndicator currentStep={step} targetStep={1} icon={<Server size={18} />} label="Environment" />
          <StepIndicator currentStep={step} targetStep={2} icon={<Database size={18} />} label="Database" />
          <StepIndicator currentStep={step} targetStep={3} icon={<User size={18} />} label="Admin Account" />
          <StepIndicator currentStep={step} targetStep={4} icon={<Smartphone size={18} />} label="Mobile App" />
          <StepIndicator currentStep={step} targetStep={5} icon={<CheckCircle2 size={18} />} label="Finish" />
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 flex flex-col min-h-[400px]">
          {step === 1 && (
            <div className="flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome to OpenCAD</h2>
              <p className="text-slate-400 mb-8">Before we can start dispatching, we need to configure your environment. This wizard will guide you through the process.</p>
              
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 mb-8">
                <h3 className="font-semibold text-white mb-2 text-sm">System Check</h3>
                <ul className="space-y-2 text-sm">
                  <CheckItem label="PHP Version 8.1+" passed={true} />
                  <CheckItem label="Aiven/PDO Extension" passed={true} />
                  <CheckItem label="Write Permissions (Config)" passed={true} />
                </ul>
              </div>

              <div className="mt-auto flex justify-end">
                <button onClick={() => setStep(2)} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2">
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-bold text-white mb-2">Database Connection</h2>
              <p className="text-slate-400 mb-6">Enter your Aiven database credentials. The installer will create the necessary tables automatically.</p>
              
              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Host</label>
                    <input type="text" defaultValue={import.meta.env.VITE_AIVEN_HOST || "kafka-2cf7a0ae-emscad.a.aivencloud.com"} className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-sm text-slate-200 outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Port</label>
                    <input type="text" defaultValue={import.meta.env.VITE_AIVEN_PORT || "18702"} className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-sm text-slate-200 outline-none focus:border-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Database Name</label>
                  <input type="text" defaultValue={import.meta.env.VITE_AIVEN_DB || "defaultdb"} className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-sm text-slate-200 outline-none focus:border-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Username</label>
                    <input type="text" defaultValue={import.meta.env.VITE_AIVEN_USER || "avnadmin"} className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-sm text-slate-200 outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Password</label>
                    <input type="password" placeholder="••••••••" defaultValue={import.meta.env.VITE_AIVEN_PASSWORD || ""} className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-sm text-slate-200 outline-none focus:border-blue-500" />
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-8">
                 <div className="flex justify-between items-center mb-3">
                   <h3 className="text-sm font-bold text-white">Environment Setup</h3>
                   <button onClick={() => {
                     navigator.clipboard.writeText(`VITE_AIVEN_HOST=kafka-2cf7a0ae-emscad.a.aivencloud.com\nVITE_AIVEN_PORT=18702\nVITE_AIVEN_DB=defaultdb\nVITE_AIVEN_USER=avnadmin\nVITE_AIVEN_PASSWORD=your_password`);
                   }} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded flex items-center gap-1.5 border border-slate-600 transition-colors">
                     <Copy size={14} /> Copy .env
                   </button>
                 </div>
                 <p className="text-xs text-slate-400 mb-3">Add these values to your Render environment variables or local <code className="bg-slate-800 px-1 rounded text-slate-300">.env</code> file:</p>
                 <pre className="text-xs text-slate-400 font-mono overflow-x-auto bg-slate-950 p-3 rounded border border-slate-800">
{`VITE_AIVEN_HOST=kafka-2cf7a0ae-emscad.a.aivencloud.com
VITE_AIVEN_PORT=18702
VITE_AIVEN_DB=defaultdb
VITE_AIVEN_USER=avnadmin
VITE_AIVEN_PASSWORD=your_password`}
                 </pre>
              </div>

              <div className="mt-auto flex justify-between">
                <button onClick={() => setStep(1)} className="text-slate-400 hover:text-white px-4 py-2 text-sm">Back</button>
                <button onClick={simulateStep} disabled={isSimulating} className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2">
                  {isSimulating ? <><Loader2 size={16} className="animate-spin" /> Connecting...</> : 'Connect Database'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-bold text-white mb-2">Create Administrator</h2>
              <p className="text-slate-400 mb-6">Create the primary administrative account for your system.</p>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Username</label>
                  <input type="text" defaultValue="admin" className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-sm text-slate-200 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Email Address</label>
                  <input type="email" placeholder="admin@example.com" className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-sm text-slate-200 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Password</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-sm text-slate-200 outline-none focus:border-blue-500" />
                </div>
              </div>

              <div className="mt-auto flex justify-between">
                <button onClick={() => setStep(2)} className="text-slate-400 hover:text-white px-4 py-2 text-sm">Back</button>
                <button onClick={simulateStep} disabled={isSimulating} className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2">
                  {isSimulating ? <><Loader2 size={16} className="animate-spin" /> Provisioning...</> : 'Create Account'}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex justify-center mb-6">
                 <div className="bg-emerald-600/20 p-4 rounded-full border border-emerald-500/30">
                   <Smartphone size={40} className="text-emerald-400" />
                 </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 text-center">Mobile Responder App</h2>
              <p className="text-slate-400 mb-8 text-center text-sm max-w-md mx-auto">
                Your server is almost ready! Download the OpenCAD Mobile Responder Android app to give your field units real-time MDT access on their devices.
              </p>
              
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl flex flex-col items-center text-center mb-8">
                <ShieldAlert className="text-blue-500 mb-3" size={32} />
                <h3 className="font-bold text-white mb-1">OpenCAD Responder.apk</h3>
                <p className="text-slate-500 text-xs mb-4">Version 4.0.0-dev • 12 MB • Android 8.0+</p>
                
                <a 
                  href="/OpenCAD-Responder.apk" 
                  download 
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 w-full sm:w-auto justify-center transition-colors shadow-lg shadow-emerald-900/20"
                >
                  <Download size={18} /> Download APK
                </a>
              </div>

              <div className="mt-auto flex justify-between items-center">
                <button onClick={() => setStep(3)} className="text-slate-400 hover:text-white px-4 py-2 text-sm">Back</button>
                <button onClick={() => setStep(5)} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2">
                  Skip for Now <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="flex-1 flex flex-col justify-center items-center text-center animate-in zoom-in-95 duration-500">
              <div className="bg-blue-600 p-6 rounded-full shadow-lg shadow-blue-900/50 mb-6">
                <CheckCircle2 size={48} className="text-white" />
              </div>
              <h2 className="text-3xl font-black text-white mb-4">Installation Complete!</h2>
              <p className="text-slate-400 mb-8 max-w-md">
                Your OpenCAD system is successfully installed and configured. You can now launch the platform.
              </p>
              
              <button onClick={onComplete} className="bg-white hover:bg-slate-100 text-slate-900 px-8 py-3 rounded-xl font-bold flex items-center gap-2 text-lg shadow-xl shadow-white/10 transition-transform hover:scale-105">
                Launch Platform <Play size={20} className="fill-slate-900" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function StepIndicator({ currentStep, targetStep, icon, label }: { currentStep: number, targetStep: number, icon: React.ReactNode, label: string }) {
  const isPast = currentStep > targetStep;
  const isActive = currentStep === targetStep;
  
  return (
    <div className={`flex items-center gap-3 transition-colors ${isActive ? 'text-blue-400' : isPast ? 'text-emerald-500' : 'text-slate-600'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
        isActive ? 'border-blue-500 bg-blue-500/20' : 
        isPast ? 'border-emerald-500 bg-emerald-500/20' : 
        'border-slate-700 bg-slate-800'
      }`}>
        {isPast ? <CheckCircle2 size={16} /> : icon}
      </div>
      <span className={`text-sm font-medium ${isActive ? 'text-white' : ''}`}>{label}</span>
    </div>
  );
}

function CheckItem({ label, passed }: { label: string, passed: boolean }) {
  return (
    <li className="flex items-center gap-2 text-slate-300">
      {passed ? <CheckCircle2 size={14} className="text-emerald-500" /> : <div className="w-3.5 h-3.5 rounded-full border border-red-500" />}
      {label}
    </li>
  );
}
