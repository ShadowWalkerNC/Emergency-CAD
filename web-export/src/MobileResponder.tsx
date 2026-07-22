import React, { useState, useEffect } from 'react';
import { Navigation, MessageSquare, CheckCircle, Send, Info, Radio, Mic, Languages, Volume2 } from 'lucide-react';

export default function MobileResponder({ unitId }: { unitId: string }) {
  const [unit, setUnit] = useState<any>({ callsign: "MEDIC 51", status: "Available" });
  const [incident, setIncident] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([{ id: '1', unitId: 'SYS', body: 'Unit online and listening.', type: 'STATUS', timestamp: new Date().toLocaleTimeString() }]);
  const [msg, setMsg] = useState("");
  const [transcriptions, setTranscriptions] = useState<{id: string, text: string, translated: string, active: boolean}[]>([]);

  useEffect(() => {
    // Simulated live radio broadcast transcription
    const phrases = [
      { t: 4000, en: "Dispatch to all units, be advised of severe weather warning in effect.", es: "Despacho a todas las unidades, aviso de clima severo en efecto." },
      { t: 9000, en: "Medic 51, confirm receipt of incident INC-832.", es: "Médico 51, confirme recepción del incidente INC-832." },
      { t: 15000, en: "Engine 12 is on scene, establishing command.", es: "Motor 12 en escena, estableciendo comando." },
      { t: 22000, en: "Command to Dispatch, we have a two-vehicle collision. Send additional EMS.", es: "Comando a Despacho, tenemos una colisión de dos vehículos. Envíen EMS adicional." }
    ];

    const timeouts = phrases.map(p => 
      setTimeout(() => {
        const newTx = { id: Math.random().toString(), text: p.en, translated: p.es, active: true };
        setTranscriptions(prev => [...prev.slice(-1), newTx]);
        
        setTimeout(() => {
           setTranscriptions(prev => prev.map(tx => tx.id === newTx.id ? { ...tx, active: false } : tx));
        }, 4000);
      }, p.t)
    );
    
    return () => timeouts.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    // Simulate incoming call after 3 seconds
    const timer = setTimeout(() => {
      setIncident({
        id: "INC-832",
        priority: 2,
        nature: "MEDICAL EMERGENCY",
        address: "123 Main St, Springfield",
        notes: "Elderly male, chest pain, conscious and breathing."
      });
      addLog("DISPATCH", "Assigned MEDIC 51 to incident INC-832", "STATUS");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const updateStatus = (status: string) => {
    setUnit({ ...unit, status });
    addLog(unit.callsign, `Status changed to: ${status}`, "STATUS");
    if (status === "Available") {
      setIncident(null);
      addLog("DISPATCH", "Cleared from incident.", "STATUS");
    }
  };

  const addLog = (uid: string, body: string, type: string) => {
    const newLog = {
      id: Math.random().toString(),
      unitId: uid,
      body,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const sendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;
    addLog(unit.callsign, msg, "CHAT");
    setMsg("");
    setTimeout(() => {
      addLog("DISPATCH", "Copy that.", "CHAT");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-2 flex flex-col font-sans max-w-md mx-auto shadow-2xl relative">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-slate-900 rounded-xl border border-slate-800 shadow-lg">
        <h1 className="text-3xl font-black">{unit.callsign}</h1>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Linked</span>
        </div>
      </div>

      <div className="h-4"></div>

      {/* Incident / Standby */}
      <div className="flex-none">
        {incident ? (
          <div className="bg-red-950/40 border-2 border-red-600 p-6 rounded-2xl shadow-xl shadow-red-900/20">
            <div className="flex justify-between items-start mb-2">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">PRIORITY {incident.priority}</span>
              <span className="text-slate-400 font-mono text-sm">{incident.id}</span>
            </div>
            <h2 className="text-3xl font-extrabold mb-2 uppercase tracking-tight">{incident.nature}</h2>
            <p className="text-xl text-yellow-400 font-bold mb-4">{incident.address}</p>
            <button
              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(incident.address)}`)}
              className="w-full bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all flex items-center justify-center gap-3 py-4 rounded-xl text-xl font-bold shadow-lg"
            >
              <Navigation size={24} /> NAVIGATE
            </button>
          </div>
        ) : (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col items-center justify-center py-16 text-slate-500">
            <CheckCircle size={64} className="mb-4 opacity-50" />
            <p className="text-2xl font-bold text-slate-400">STANDING BY</p>
            <p className="text-sm">Awaiting assignment from Dispatch</p>
          </div>
        )}
      </div>

      <div className="h-4"></div>

      {/* Live Audio Transcription */}
      <div className="flex-none bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg mb-4 relative">
        <div className="bg-slate-800/80 p-2 flex justify-between items-center text-slate-400 text-[10px] font-bold border-b border-slate-700/50 uppercase tracking-wider">
          <div className="flex items-center gap-1.5 text-blue-400">
            <Radio size={12} className="animate-pulse" /> Live Radio Translation
          </div>
          <div className="flex items-center gap-1.5">
             <Languages size={12} /> EN ➜ ES
          </div>
        </div>
        <div className="p-4 min-h-[85px] flex flex-col justify-center bg-gradient-to-b from-slate-900 to-slate-950">
          {transcriptions.length > 0 ? (
            transcriptions.slice(-1).map(tx => (
              <div key={tx.id} className={`transition-all duration-700 ${tx.active ? 'opacity-100 scale-100' : 'opacity-40 scale-95'}`}>
                <div className="flex items-start gap-3">
                  <Volume2 size={18} className={tx.active ? 'text-green-400 animate-pulse mt-0.5 shrink-0' : 'text-slate-600 mt-0.5 shrink-0'} />
                  <div>
                    <p className="text-sm font-bold text-slate-200">"{tx.text}"</p>
                    <p className="text-xs font-medium italic mt-1 text-blue-300">"{tx.translated}"</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center gap-2 text-slate-600 text-sm font-medium h-full animate-pulse">
              <Mic size={14} /> Listening to broadcast...
            </div>
          )}
        </div>
      </div>

      {/* Live Log & Chat */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden min-h-[200px]">
        <div className="bg-slate-800 p-2 flex items-center gap-2 text-slate-400 text-xs font-bold">
          <Info size={14} /> LIVE LOG & CHAT
        </div>
        <div className="flex-1 overflow-y-auto p-3 flex flex-col-reverse gap-2">
          {logs.map((log) => (
            log.type === 'CHAT' ? (
              <div key={log.id} className={`max-w-[85%] p-2.5 rounded-lg text-sm ${log.unitId !== 'DISPATCH' ? 'bg-blue-900/60 ml-auto rounded-tr-sm border border-blue-800' : 'bg-slate-800 rounded-tl-sm border border-slate-700'}`}>
                <div className="text-[10px] text-slate-400 mb-0.5 font-bold">{log.unitId}</div>
                <div>{log.body}</div>
              </div>
            ) : (
              <div key={log.id} className="text-[11px] font-mono flex gap-2 items-start py-1">
                <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                <span className="text-slate-300"><span className="text-slate-400 font-bold">{log.unitId}:</span> {log.body.toUpperCase()}</span>
              </div>
            )
          ))}
        </div>
        <form onSubmit={sendChat} className="p-2 bg-slate-800 flex gap-2 border-t border-slate-700">
          <input
            value={msg}
            onChange={e => setMsg(e.target.value)}
            placeholder="Type message..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-500 transition-colors"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 p-2 w-10 h-10 flex items-center justify-center rounded-full shrink-0 transition-colors">
            <Send size={16} />
          </button>
        </form>
      </div>

      <div className="h-4"></div>

      {/* Status Buttons */}
      <div className="flex-none grid grid-cols-2 gap-3 pb-4">
        <button
          onClick={() => updateStatus("En Route")}
          className={`py-6 rounded-xl text-xl font-black uppercase transition-all ${unit.status === 'En Route' ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)] border-2 border-blue-400' : 'bg-slate-800 text-slate-400 border-2 border-transparent'}`}
        >
          En Route
        </button>
        <button
          onClick={() => updateStatus("On Scene")}
          className={`py-6 rounded-xl text-xl font-black uppercase transition-all ${unit.status === 'On Scene' ? 'bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)] border-2 border-red-400' : 'bg-slate-800 text-slate-400 border-2 border-transparent'}`}
        >
          On Scene
        </button>
        <button
          onClick={() => updateStatus("Available")}
          className="col-span-2 py-5 rounded-xl text-xl font-black uppercase bg-green-600 text-white active:bg-green-700 transition-colors shadow-lg"
        >
          Clear & Available
        </button>
      </div>
    </div>
  );
}
