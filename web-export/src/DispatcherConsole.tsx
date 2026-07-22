import React, { useState, useEffect } from 'react';
import { 
  Radio, Map as MapIcon, Phone, AlertTriangle, CheckCircle, 
  ShieldAlert, Mic, Play, Pause, RotateCcw, Target,
  Users, MessageSquare, CloudLightning, Activity, Menu, Bell
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Mock scenarios and initial data
const SCENARIOS = [
  {
    id: 'scen_1',
    name: 'Major Collision (I-95)',
    duration: 60,
    events: [
      { t: 2, type: 'RADIO', text: "Engine 12, respond to a reported motor vehicle collision, I-95 Northbound MM 42." },
      { t: 15, type: 'RADIO', text: "Medic 51, be advised, caller reports multiple patients." },
      { t: 30, type: 'UPDATE_UNIT', unit: 'ENGINE 12', status: 'En Route' },
      { t: 45, type: 'UPDATE_UNIT', unit: 'MEDIC 51', status: 'En Route' }
    ]
  }
];

export default function DispatcherConsole() {
  const [activeTab, setActiveTab] = useState('dispatch');

  // Global State
  const [incidents, setIncidents] = useState([
    { id: 'INC-832', nature: 'Motor Vehicle Collision', location: 'I-95 Northbound MM 42', priority: 'High', status: 'Dispatched', units: ['MEDIC 51'], lat: 35.7796, lng: -78.6382 }
  ]);
  const [units, setUnits] = useState([
    { id: 'MEDIC 51', type: 'EMS', status: 'En Route', lat: 35.7820, lng: -78.6400, capabilities: 'ALS, Bariatric' },
    { id: 'ENGINE 12', type: 'FIRE', status: 'Available', lat: 35.7750, lng: -78.6450, capabilities: 'Pumper, Extrication' },
    { id: 'PATROL 1', type: 'PD', status: 'On Scene', lat: 35.7800, lng: -78.6380, capabilities: 'K9, Radar' },
    { id: 'RESCUE 9', type: 'FIRE', status: 'Available', lat: 35.7720, lng: -78.6300, capabilities: 'Heavy Rescue' },
  ]);
  const [patients, setPatients] = useState([
    { id: 'PAT-101', incidentId: 'INC-832', name: 'John Doe', age: 45, gender: 'M', condition: 'Critical', transportDest: 'WakeMed Trauma', unit: 'MEDIC 51' },
    { id: 'PAT-102', incidentId: 'INC-832', name: 'Jane Smith', age: 32, gender: 'F', condition: 'Stable', transportDest: 'Rex Hospital', unit: 'Pending' }
  ]);
  const [messages, setMessages] = useState([
    { id: 1, from: 'System', text: 'Daily system backup completed successfully.', time: '08:00 AM' },
    { id: 2, from: 'Field Supervisor', text: 'All units be advised, major road work on I-440 starts tonight.', time: '09:15 AM' }
  ]);
  const [weatherAlerts] = useState([
    { id: 'WX-1', title: 'Severe Thunderstorm Warning', area: 'Wake County', expires: '18:45 PM', severity: 'Severe' }
  ]);

  // Dispatch Forms & Playback
  const [newCall, setNewCall] = useState({ nature: '', location: '', priority: 'Normal' });
  const [transcriptions, setTranscriptions] = useState<{id: string, text: string, active: boolean}[]>([]);
  const [activeScenario, setActiveScenario] = useState(SCENARIOS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);

  const locationRef = React.useRef<HTMLInputElement>(null);
  const natureRef = React.useRef<HTMLInputElement>(null);
  const priorityRef = React.useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) return;
      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case 'l': e.preventDefault(); locationRef.current?.focus(); break;
          case 'n': e.preventDefault(); natureRef.current?.focus(); break;
          case 'p': e.preventDefault(); priorityRef.current?.focus(); break;
          case 's': e.preventDefault(); setIsPlaying(p => !p); break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPlaybackTime(prev => {
        const nextTime = prev + 1;
        const currentEvents = activeScenario.events.filter(e => e.t === nextTime);
        currentEvents.forEach(evt => {
          if (evt.type === 'RADIO') {
             const newTx = { id: Math.random().toString(), text: evt.text!, active: true };
             setTranscriptions(curr => [...curr.slice(-3), newTx]);
             setTimeout(() => {
               setTranscriptions(curr => curr.map(tx => tx.id === newTx.id ? { ...tx, active: false } : tx));
             }, 8000);
          } else if (evt.type === 'UPDATE_UNIT' && evt.unit && evt.status) {
             setUnits(curr => curr.map(u => u.id === evt.unit ? { ...u, status: evt.status as string } : u));
          }
        });
        if (nextTime >= activeScenario.duration) setIsPlaying(false);
        return nextTime;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, activeScenario]);

  const handleCreateCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCall.nature || !newCall.location) return;
    const newId = `INC-${Math.floor(Math.random() * 900) + 100}`;
    const simLat = 35.7796 + (Math.random() * 0.04 - 0.02);
    const simLng = -78.6382 + (Math.random() * 0.04 - 0.02);

    setIncidents([{ 
      id: newId, nature: newCall.nature, location: newCall.location, 
      priority: newCall.priority, status: 'Pending', units: [],
      lat: simLat, lng: simLng
    }, ...incidents]);
    setNewCall({ nature: '', location: '', priority: 'Normal' });
  };

  const cycleUnitStatus = (unitId: string) => {
    const statuses = ['Available', 'Dispatched', 'En Route', 'On Scene', 'Transporting', 'Cleared'];
    setUnits(units.map(u => {
      if (u.id === unitId) {
        const nextIdx = (statuses.indexOf(u.status) + 1) % statuses.length;
        return { ...u, status: statuses[nextIdx] };
      }
      return u;
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Dispatched': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'En Route': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'On Scene': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex h-screen overflow-hidden">
      
      {/* SIDEBAR NAVIGATION */}
      <div className="w-20 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-6 shrink-0 z-20">
        <div className="bg-blue-600 p-2 rounded-lg mb-8">
          <ShieldAlert size={28} className="text-white" />
        </div>
        
        <div className="flex flex-col gap-4 w-full px-3">
          <NavItem icon={<Activity />} id="dispatch" activeTab={activeTab} setActiveTab={setActiveTab} label="Dispatch" />
          <NavItem icon={<Users />} id="patients" activeTab={activeTab} setActiveTab={setActiveTab} label="Patients" />
          <NavItem icon={<MessageSquare />} id="messages" activeTab={activeTab} setActiveTab={setActiveTab} label="Comms" />
          <NavItem icon={<CloudLightning />} id="weather" activeTab={activeTab} setActiveTab={setActiveTab} label="Weather" />
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP BAR / TICKER */}
        <div className="h-12 bg-slate-900 border-b border-slate-800 flex items-center px-4 justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">OpenCAD SYSTEM</div>
            <div className="flex items-center gap-2 text-red-400 bg-red-400/10 px-3 py-1 rounded-full border border-red-400/20 text-xs font-bold">
              <AlertTriangle size={12} />
              {weatherAlerts[0]?.title} - {weatherAlerts[0]?.area}
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-2 text-green-400">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Connected
            </div>
            <div className="text-slate-400 font-mono">{new Date().toLocaleTimeString()}</div>
          </div>
        </div>

        {/* TAB CONTENT */}
        <div className="flex-1 p-4 overflow-hidden relative">
          
          {/* DISPATCH TAB */}
          {activeTab === 'dispatch' && (
            <div className="h-full flex flex-col gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-slate-950 rounded-lg px-3 py-1.5 border border-slate-800">
                    <Target size={16} className="text-blue-400" />
                    <select className="bg-transparent text-sm font-bold text-white outline-none">
                      {SCENARIOS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setIsPlaying(!isPlaying)} className={`p-2 rounded-lg transition-colors ${isPlaying ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'}`}>
                      {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                    <div className="font-mono font-bold text-xl ml-2 w-16 text-center text-blue-400">
                      {Math.floor(playbackTime / 60).toString().padStart(2, '0')}:{(playbackTime % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
                {/* LEFT: Entry */}
                <div className="col-span-3 flex flex-col gap-4 min-h-0">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col shrink-0 h-[220px]">
                    <div className="flex items-center gap-2 text-blue-400 font-bold mb-3 uppercase tracking-wider text-xs border-b border-slate-800 pb-2">
                      <Mic size={16} className={isPlaying ? "animate-pulse" : ""} /> Live Radio Feed
                    </div>
                    <div className="flex-1 overflow-y-auto flex flex-col gap-2">
                      {transcriptions.length === 0 && <div className="h-full flex items-center justify-center text-slate-600 text-sm italic">Standby...</div>}
                      {transcriptions.map(tx => (
                        <div key={tx.id} className={`p-2 rounded bg-slate-800 text-sm border-l-2 ${tx.active ? 'border-blue-500 text-white' : 'border-slate-700 text-slate-400'}`}>
                          {tx.text}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1 flex flex-col overflow-y-auto">
                    <div className="flex items-center gap-2 text-slate-300 font-bold mb-4 uppercase tracking-wider text-xs border-b border-slate-800 pb-2">
                      <Phone size={16} /> New Call Entry
                    </div>
                    <form onSubmit={handleCreateCall} className="flex flex-col gap-4 flex-1">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">LOCATION <span className="bg-slate-800 px-1 rounded">Alt+L</span></label>
                        <input ref={locationRef} type="text" value={newCall.location} onChange={e => setNewCall({...newCall, location: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white" required />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">NATURE / TYPE <span className="bg-slate-800 px-1 rounded">Alt+N</span></label>
                        <input ref={natureRef} type="text" value={newCall.nature} onChange={e => setNewCall({...newCall, nature: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white" required />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">PRIORITY <span className="bg-slate-800 px-1 rounded">Alt+P</span></label>
                        <select ref={priorityRef} value={newCall.priority} onChange={e => setNewCall({...newCall, priority: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white">
                          <option>Low</option><option>Normal</option><option>High</option><option>Critical</option>
                        </select>
                      </div>
                      <div className="mt-auto pt-4">
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded transition-colors flex items-center justify-center gap-2">
                          <CheckCircle size={18} /> CREATE INCIDENT
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* CENTER: Map & Incidents */}
                <div className="col-span-6 flex flex-col gap-4 min-h-0">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shrink-0 h-[45%] relative">
                     <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700/50 flex items-center gap-2 z-[400]">
                       <MapIcon size={14} className="text-slate-400" />
                       <span className="text-xs font-bold text-slate-300">LIVE MAPPING (OSM)</span>
                     </div>
                     <div className="w-full h-full bg-[#0a0f1a] relative z-0">
                        <MapContainer center={[35.7796, -78.6382]} zoom={13} style={{ height: '100%', width: '100%', backgroundColor: '#0a0f1a' }}>
                          <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                          />
                          {incidents.map(inc => (
                             <Marker key={inc.id} position={[inc.lat, inc.lng]}>
                               <Popup className="text-slate-900 font-bold">{inc.id}: {inc.nature}</Popup>
                             </Marker>
                          ))}
                          {units.map(u => (
                             <Marker key={u.id} position={[u.lat, u.lng]}>
                               <Popup className="text-slate-900 font-bold">{u.id} ({u.status})</Popup>
                             </Marker>
                          ))}
                        </MapContainer>
                     </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1 flex flex-col min-h-0">
                    <div className="flex items-center gap-2 text-slate-300 font-bold mb-4 uppercase tracking-wider text-xs border-b border-slate-800 pb-2">
                      <AlertTriangle size={16} /> Active Incidents ({incidents.length})
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3">
                        {incidents.map(inc => (
                          <div key={inc.id} className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${inc.priority === 'Critical' ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                                {inc.priority} - {inc.id}
                              </span>
                              <span className="text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">{inc.status}</span>
                            </div>
                            <h3 className="font-bold text-white mb-1">{inc.nature}</h3>
                            <p className="text-slate-400 text-sm">{inc.location}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT: Units */}
                <div className="col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col min-h-0">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2 text-slate-300 font-bold uppercase tracking-wider text-xs">
                      <Radio size={16} /> Units Board
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto flex flex-col gap-2">
                      {units.map(unit => (
                        <div key={unit.id} className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                             <span className="font-bold text-white text-sm">{unit.id}</span>
                             <span className="text-[10px] text-slate-500">{unit.type}</span>
                          </div>
                          <div className="text-[10px] text-slate-400">{unit.capabilities}</div>
                          <button onClick={() => cycleUnitStatus(unit.id)} className={`w-full text-xs font-bold py-1.5 mt-1 rounded border transition-colors ${getStatusColor(unit.status)}`}>
                            {unit.status.toUpperCase()}
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PATIENTS TAB */}
          {activeTab === 'patients' && (
            <div className="h-full flex flex-col gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Users className="text-blue-500"/> Patient Tracking System</h2>
                <p className="text-slate-400 text-sm">Monitor triage status and transport destinations across all active incidents.</p>
              </div>
              
              <div className="bg-slate-900 border border-slate-800 rounded-xl flex-1 overflow-hidden flex flex-col">
                 <div className="grid grid-cols-6 gap-4 p-4 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase">
                    <div>Patient ID</div>
                    <div>Incident</div>
                    <div>Demographics</div>
                    <div>Condition</div>
                    <div>Transport Unit</div>
                    <div>Destination</div>
                 </div>
                 <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                    {patients.map(p => (
                      <div key={p.id} className="grid grid-cols-6 gap-4 p-4 bg-slate-950 rounded-lg border border-slate-800 items-center">
                         <div className="font-mono text-blue-400 font-bold">{p.id}</div>
                         <div className="text-slate-300">{p.incidentId}</div>
                         <div>
                            <div className="text-white font-bold">{p.name}</div>
                            <div className="text-xs text-slate-400">{p.age} y/o {p.gender}</div>
                         </div>
                         <div>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${p.condition === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                              {p.condition}
                            </span>
                         </div>
                         <div className="text-slate-300 font-bold">{p.unit}</div>
                         <div className="text-slate-300">{p.transportDest}</div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          )}

          {/* COMMUNICATIONS & WEATHER TAB */}
          {activeTab === 'messages' && (
            <div className="h-full flex gap-4">
              <div className="w-2/3 bg-slate-900 border border-slate-800 rounded-xl flex flex-col">
                <div className="p-4 border-b border-slate-800 flex items-center gap-2">
                  <MessageSquare className="text-blue-500" />
                  <h2 className="font-bold text-white">Inter-Agency Communications</h2>
                </div>
                <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
                   {messages.map(m => (
                     <div key={m.id} className="bg-slate-950 border border-slate-800 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                           <span className="font-bold text-blue-400">{m.from}</span>
                           <span className="text-xs text-slate-500">{m.time}</span>
                        </div>
                        <p className="text-slate-300">{m.text}</p>
                     </div>
                   ))}
                </div>
                <div className="p-4 border-t border-slate-800 bg-slate-950/50">
                   <div className="flex gap-2">
                     <input type="text" placeholder="Type a message to all units..." className="flex-1 bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                     <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-bold transition-colors">Send</button>
                   </div>
                </div>
              </div>
              
              <div className="w-1/3 flex flex-col gap-4">
                 <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1">
                   <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-3">
                     <CloudLightning className="text-yellow-500" />
                     <h2 className="font-bold text-white">NWS Weather Alerts</h2>
                   </div>
                   <div className="flex flex-col gap-3">
                     {weatherAlerts.map(wx => (
                       <div key={wx.id} className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
                         <div className="font-bold text-red-400 mb-1">{wx.title}</div>
                         <div className="text-sm text-slate-300">{wx.area}</div>
                         <div className="text-xs text-slate-500 mt-2">Expires: {wx.expires}</div>
                       </div>
                     ))}
                   </div>
                 </div>
              </div>
            </div>
          )}
          
          {/* WEATHER TAB ALIAS */}
          {activeTab === 'weather' && (
             <div className="h-full flex flex-col items-center justify-center bg-slate-900 border border-slate-800 rounded-xl">
                <CloudLightning size={48} className="text-yellow-500 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Weather & Alerts</h2>
                <p className="text-slate-400">See the Communications tab for aggregated weather and messaging.</p>
                <button onClick={() => setActiveTab('messages')} className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold">Go to Comms</button>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, id, activeTab, setActiveTab, label }: { icon: React.ReactNode, id: string, activeTab: string, setActiveTab: (id: string) => void, label: string }) {
  const isActive = activeTab === id;
  return (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex flex-col items-center justify-center gap-1 w-full p-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-blue-600/20 text-blue-400' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}
    >
      {icon}
      <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">{label}</span>
    </button>
  );
}
