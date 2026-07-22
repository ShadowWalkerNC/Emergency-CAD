import React, { useState, useEffect } from 'react';
import { 
  Monitor, Maximize, PlusCircle, Truck, Building2, Search, Users, 
  FileText, Settings, BookOpen, Phone, Volume2, Sun, Moon, User, 
  LogOut, AlertTriangle, MessageSquare, Radio, Bell, Map as MapIcon,
  RefreshCw, CheckSquare, Activity, ShieldAlert, Zap, List, Calendar, 
  ChevronDown, Filter, Printer, Plus, Trash2, Edit2, Check, Mail
} from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// -- MOCK DATA --
const MOCK_INCIDENTS = [
  { id: '11', scope: '11/TBD', type: 'examp2', location: 'Bloomington City Hall...', sev: 1, units: 0, pts: '-', act: '-', updated: '3/16 12:57 AM' },
  { id: '15', scope: 'My summary', type: 'examp1', location: 'Park Ave S Minneapolis', sev: 0, units: 0, pts: '-', act: 2, updated: '3/19 02:59 PM' },
  { id: '19', scope: 'Fire Alarm', type: 'AlarmAct', location: 'Eagan', sev: 0, units: 1, pts: '-', act: 3, updated: '3/17 09:58 PM' },
  { id: '20', scope: 'Fire alarm', type: 'AlarmAct', location: 'Ave S Bloomington', sev: 0, units: 0, pts: '-', act: 5, updated: '3/17 09:52 PM' },
  { id: '21', scope: 'Welfare check', type: 'WelfareChk', location: 'Ave S Minneapolis', sev: 0, units: 0, pts: '-', act: 1, updated: '3/16 10:03 PM' }
];

const MOCK_PERSONNEL = [
  { name: 'Smith, Jennifer', callsign: 'KD9GHI', type: 'N/A', status: 'N/A', team: '', phone: '', avail: true },
  { name: 'Johnson, Sarah', callsign: 'KC9WIC', type: 'N/A', status: 'N/A', team: '', phone: '', avail: true },
  { name: 'Williams, Lisa', callsign: 'W9S...', type: 'N/A', status: 'N/A', team: '', phone: '', avail: true },
  { name: 'Brown, David', callsign: 'KD9...', type: 'N/A', status: 'N/A', team: '', phone: '', avail: true },
  { name: 'Martinez, Carlos', callsign: 'KA9...', type: 'N/A', status: 'N/A', team: '', phone: '', avail: true },
  { name: 'Taylor, Marcus', callsign: '...', type: 'N/A', status: 'N/A', team: '', phone: '', avail: true },
];

const INCIDENT_TYPES = [
  { id: 13, type: 'EmergNet', group: 'RACES', sev: 'Critical', color: 'red', pattern: '(.*)', sort: 1 },
  { id: 1, type: 'examp1', group: 'grp 1', sev: 'Normal', color: 'gray', pattern: '', sort: 1 },
  { id: 2, type: 'examp2', group: 'grp 2', sev: 'Normal', color: 'gray', pattern: '', sort: 2 },
  { id: 14, type: 'MsgRelay', group: 'RACES', sev: 'Normal', color: 'gray', pattern: '(.*)', sort: 2 },
  { id: 15, type: 'CommFail', group: 'RACES', sev: 'Elevated', color: 'yellow', pattern: '(.*)', sort: 3 },
  { id: 18, type: 'WxSpotter', group: 'RACES', sev: 'Elevated', color: 'blue', pattern: '(.*)', sort: 6 }
];

export default function DispatcherConsole() {
  const [time, setTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('Situation');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#1e293b] text-slate-200 font-sans flex flex-col h-screen overflow-hidden">
      
      {/* TOP NAVBAR */}
      <div className="bg-[#0f172a] border-b border-slate-700 flex flex-col xl:flex-row xl:items-center justify-between px-4 py-2 shrink-0 text-sm gap-4 xl:gap-0">
        <div className="flex flex-col xl:flex-row xl:items-center gap-4 xl:gap-6 w-full xl:w-auto">
          <div className="flex items-center justify-between w-full xl:w-auto">
            <div className="flex items-center gap-2 font-bold text-white">
              <ShieldAlert size={20} className="text-blue-500" />
              <span>Tickets <span className="text-slate-400 font-normal text-xs">v4.0.0-dev</span></span>
            </div>
            
            <div className="flex xl:hidden items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                <span className="font-mono text-slate-300 text-xs">{time.toLocaleTimeString('en-US', { hour12: false })}</span>
              </div>
              <User size={16} className="text-slate-400" />
            </div>
          </div>
          
          <div className="flex items-center gap-1 overflow-x-auto w-full xl:w-auto pb-2 xl:pb-0 scrollbar-hide">
            <NavBtn icon={<Monitor size={14}/>} label="Situation" active={activeTab === 'Situation'} onClick={() => setActiveTab('Situation')} />
            <NavBtn icon={<Maximize size={14}/>} label="Full Screen" onClick={() => document.documentElement.requestFullscreen().catch(() => {})} />
            <NavBtn icon={<PlusCircle size={14}/>} label="New" highlight active={activeTab === 'New'} onClick={() => setActiveTab('New')} />
            <NavBtn icon={<Truck size={14}/>} label="Units" active={activeTab === 'Units'} onClick={() => setActiveTab('Units')} />
            <NavBtn icon={<Building2 size={14}/>} label="Fac's" active={activeTab === 'Facs'} onClick={() => setActiveTab('Facs')} />
            <NavBtn icon={<Search size={14}/>} label="Search" active={activeTab === 'Search'} onClick={() => setActiveTab('Search')} />
            <NavBtn icon={<Users size={14}/>} label="Personnel" active={activeTab === 'Personnel'} onClick={() => setActiveTab('Personnel')} />
            <NavBtn icon={<Calendar size={14}/>} label="Scheduling" active={activeTab === 'Scheduling'} onClick={() => setActiveTab('Scheduling')} />
            <NavBtn icon={<FileText size={14}/>} label="Reports" active={activeTab === 'Reports'} onClick={() => setActiveTab('Reports')} />
            <NavBtn icon={<Settings size={14}/>} label="Config" active={activeTab === 'Config'} onClick={() => setActiveTab('Config')} />
            <NavBtn icon={<BookOpen size={14}/>} label="SOP" active={activeTab === 'SOP'} onClick={() => setActiveTab('SOP')} />
            <NavBtn icon={<Phone size={14}/>} label="Contacts" active={activeTab === 'Contacts'} onClick={() => setActiveTab('Contacts')} />
          </div>
        </div>
        
        <div className="items-center gap-4 hidden xl:flex">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-500"></div>
            <span className="font-mono text-slate-300">{time.toLocaleTimeString('en-US', { hour12: false })}</span>
          </div>
          <button className="p-1.5 hover:bg-slate-800 rounded text-slate-400"><Volume2 size={16}/></button>
          <div className="flex items-center bg-slate-800 rounded p-0.5">
            <button className="p-1 bg-yellow-500 text-slate-900 rounded"><Sun size={14}/></button>
            <button className="p-1 text-slate-400 hover:text-white"><Moon size={14}/></button>
          </div>
          <div className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer pl-2 border-l border-slate-700">
            <User size={16} />
            <span className="whitespace-nowrap">admin (Super)</span>
          </div>
          <button className="p-1.5 hover:bg-red-500/20 text-red-400 rounded"><LogOut size={16}/></button>
        </div>
      </div>

      {/* DYNAMIC CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'Situation' && <DashboardTab />}
        {activeTab === 'New' && <NewIncidentTab />}
        {activeTab === 'Personnel' && <PersonnelTab />}
        {activeTab === 'Config' && <ConfigTab />}
        {activeTab === 'Scheduling' && <SchedulingTab />}
        {activeTab === 'Units' && <UnitsTab />}
        {activeTab === 'Facs' && <FacsTab />}
        {activeTab === 'Search' && <SearchTab />}
        {activeTab === 'Reports' && <ReportsTab />}
        {activeTab === 'SOP' && <SOPTab />}
        {activeTab === 'Contacts' && <ContactsTab />}
      </div>

    </div>
  );
}

// --- TABS ---

function DashboardTab() {
  return (
    <div className="flex-1 p-2 flex flex-col gap-2 bg-[#0f172a] overflow-hidden">
      <div className="h-8 bg-[#1e293b] border border-slate-700 flex items-center px-4 shrink-0 gap-4 text-sm">
        <span className="text-slate-400">Widgets:</span>
        <div className="flex items-center gap-1">
          <button className="p-1 bg-slate-700 hover:bg-slate-600 rounded text-yellow-400"><RefreshCw size={14}/></button>
          <button className="p-1 hover:bg-slate-700 rounded text-slate-400">←</button>
          <button className="p-1 bg-blue-600 hover:bg-blue-500 rounded text-white"><BookOpen size={14}/></button>
        </div>
      </div>
      <div className="flex-1 flex flex-col lg:flex-row gap-2 overflow-y-auto lg:overflow-hidden">
        <div className="flex-[4] flex flex-col gap-2 min-w-0">
          <Widget title="Incidents" icon={<AlertTriangle size={14}/>} flex="flex-[4] min-h-[300px]">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left min-w-[600px]">
                <thead className="text-slate-400 border-b border-slate-700 bg-slate-800/50 sticky top-0">
                  <tr>
                    <th className="p-2 font-bold">ID</th>
                    <th className="p-2 font-bold">SCOPE</th>
                    <th className="p-2 font-bold">TYPE</th>
                    <th className="p-2 font-bold">LOCATION</th>
                    <th className="p-2 font-bold">SEV</th>
                    <th className="p-2 font-bold">UNITS</th>
                    <th className="p-2 font-bold">UPDATED</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {MOCK_INCIDENTS.map((inc, i) => (
                    <tr key={i} className="hover:bg-slate-700/30">
                      <td className="p-2 text-blue-400">{inc.id}</td>
                      <td className="p-2">{inc.scope}</td>
                      <td className="p-2">{inc.type}</td>
                      <td className="p-2 truncate max-w-[200px]">{inc.location}</td>
                      <td className="p-2">
                        <span className={`px-2 py-0.5 rounded font-bold text-black ${inc.sev === 1 ? 'bg-yellow-400' : 'bg-green-500'}`}>
                          {inc.sev}
                        </span>
                      </td>
                      <td className="p-2">{inc.units}</td>
                      <td className="p-2 text-slate-400">{inc.updated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Widget>
        </div>
        <div className="w-full lg:w-24 flex lg:flex-col gap-2 shrink-0">
          <Widget title="Controls" icon={<Settings size={14}/>} flex="flex-[1]">
             <div className="grid grid-cols-2 gap-1 p-1">
               <CtrlBtn icon={<CheckSquare size={16}/>} label="ASSIGNED" />
               <CtrlBtn icon={<MapIcon size={16}/>} label="ROADS" />
             </div>
          </Widget>
        </div>
        <div className="flex-[5] flex flex-col gap-2 min-w-0">
          <Widget title="Map" icon={<MapIcon size={14}/>} flex="flex-1 min-h-[300px]">
             <div className="w-full h-full relative z-0">
                <MapContainer center={[44.9778, -93.2650]} zoom={11} style={{ height: '100%', width: '100%', backgroundColor: '#f1f5f9' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                </MapContainer>
             </div>
          </Widget>
        </div>
      </div>
    </div>
  );
}

function NewIncidentTab() {
  return (
    <div className="flex-1 bg-[#151e2e] p-4 flex flex-col gap-4 overflow-y-auto">
      <div className="flex justify-between items-center bg-[#1e293b] p-3 rounded shadow">
        <h2 className="text-xl text-white font-semibold flex items-center gap-2">
          <PlusCircle size={20} className="text-blue-500" /> New Incident
        </h2>
        <div className="flex gap-2">
          <button className="px-4 py-1.5 border border-slate-600 rounded text-slate-300 hover:bg-slate-700 flex items-center gap-2 text-sm">
            <RefreshCw size={14}/> Reset
          </button>
          <button className="px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded font-medium flex items-center gap-2 text-sm shadow">
            <Check size={16} /> Submit Incident
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 gap-4">
        {/* LEFT COLUMN */}
        <div className="flex-[1] flex flex-col gap-4">
          <FormSection title="Classification" icon={<AlertTriangle size={16}/>} badge="Required">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Incident Type <span className="text-red-500">*</span></label>
                <select className="w-full bg-[#0f172a] border border-slate-700 rounded p-2 text-sm text-slate-200 outline-none focus:border-blue-500">
                  <option>— Select type —</option>
                  <option>WxSpotter</option>
                  <option>EmergNet</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Severity</label>
                <select className="w-full bg-[#0f172a] border border-slate-700 rounded p-2 text-sm text-slate-200 outline-none focus:border-blue-500">
                  <option>Normal</option>
                  <option>Elevated</option>
                  <option>Critical</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs text-slate-400 mb-1">Incident Name / Scope <span className="text-red-500">*</span></label>
              <input type="text" placeholder="Brief summary of the incident" className="w-full bg-[#0f172a] border border-slate-700 rounded p-2 text-sm text-slate-200 outline-none focus:border-blue-500" />
            </div>
            <div className="mb-4">
              <label className="block text-xs text-slate-400 mb-1">Description <span className="text-red-500">*</span></label>
              <textarea rows={4} placeholder="Detailed description of the incident..." className="w-full bg-[#0f172a] border border-blue-500 rounded p-2 text-sm text-slate-200 outline-none"></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Signal</label>
                <select className="w-full bg-[#0f172a] border border-slate-700 rounded p-2 text-sm text-slate-200 outline-none">
                  <option>— None —</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Major Incident</label>
                <div className="flex">
                  <select className="flex-1 bg-[#0f172a] border border-slate-700 rounded-l p-2 text-sm text-slate-200 outline-none">
                    <option>— None —</option>
                  </select>
                  <button className="bg-slate-700 px-3 border border-slate-700 rounded-r hover:bg-slate-600 text-blue-400 font-medium text-sm">+ New</button>
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection title="Location" icon={<MapIcon size={16}/>}>
            <div className="flex gap-2 mb-4">
               <div className="flex-1">
                 <label className="block text-xs text-slate-400 mb-1">Street Address</label>
                 <div className="flex">
                    <input type="text" defaultValue="123 Main St" className="flex-1 bg-[#0f172a] border border-slate-700 rounded-l p-2 text-sm text-slate-200 outline-none" />
                    <button className="bg-slate-700 px-3 border border-slate-700 rounded-r hover:bg-slate-600 text-sm flex items-center gap-1"><Search size={14}/> Lookup</button>
                 </div>
               </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">City</label>
                <input type="text" className="w-full bg-[#0f172a] border border-slate-700 rounded p-2 text-sm text-slate-200" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">State</label>
                <select className="w-full bg-[#0f172a] border border-slate-700 rounded p-2 text-sm text-slate-200"><option>—</option></select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Area / About / Cross St</label>
                <input type="text" placeholder="Near intersection of..." className="w-full bg-[#0f172a] border border-slate-700 rounded p-2 text-sm text-slate-200" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Coordinates</label>
                <div className="flex items-center gap-2 bg-[#0f172a] border border-slate-700 rounded p-1">
                   <span className="text-xs text-slate-500 pl-2">Lat</span>
                   <input type="text" defaultValue="44.9778" className="w-20 bg-transparent text-sm text-white outline-none" />
                   <span className="text-xs text-slate-500">Lng</span>
                   <input type="text" defaultValue="-93.2650" className="w-20 bg-transparent text-sm text-white outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Destination Address</label>
                <input type="text" placeholder="Transport destination (if applicable)" className="w-full bg-[#0f172a] border border-slate-700 rounded p-2 text-sm text-slate-200" />
              </div>
            </div>
          </FormSection>
          
          <FormSection title="Caller / Contact" icon={<User size={16}/>}>
             <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Reported By</label>
                  <input type="text" placeholder="Caller name" className="w-full bg-[#0f172a] border border-slate-700 rounded p-2 text-sm text-slate-200" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Phone Number</label>
                  <input type="text" placeholder="(612) 555-1234" className="w-full bg-[#0f172a] border border-slate-700 rounded p-2 text-sm text-slate-200" />
                </div>
             </div>
          </FormSection>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex-[1] flex flex-col gap-4">
           <div className="bg-[#1e293b] rounded border border-slate-700 flex flex-col h-[350px] overflow-hidden">
             <div className="bg-slate-800 p-2 flex justify-between items-center text-sm font-medium border-b border-slate-700">
               <div className="flex items-center gap-2"><MapIcon size={16}/> Location Map</div>
               <span className="text-xs text-slate-400">Click to set incident location</span>
             </div>
             <div className="flex-1 relative bg-slate-100 z-0">
               <MapContainer center={[44.9778, -93.2650]} zoom={11} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
               </MapContainer>
             </div>
           </div>

           <div className="bg-[#1e293b] rounded border border-slate-700 flex flex-col flex-1">
             <div className="bg-slate-800 p-2 flex justify-between items-center text-sm font-medium border-b border-slate-700">
               <div className="flex items-center gap-2"><Users size={16}/> Assign Responders</div>
               <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">0 selected</span>
             </div>
             <div className="p-2 border-b border-slate-700">
               <input type="text" placeholder="Search units..." className="w-full bg-[#0f172a] border border-slate-700 rounded p-2 text-sm text-slate-200" />
             </div>
             <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
               {['CERT Team A', 'Engine 2', 'Medic 1', 'Medic 2', 'Net Control', 'Patrol 1', 'Patrol 2', 'Rescue 1', 'Tanker 1', 'Test Unit 1'].map(unit => (
                 <div key={unit} className="flex items-center justify-between p-2 hover:bg-slate-800 rounded border border-transparent hover:border-slate-700 cursor-pointer">
                   <div className="flex items-center gap-3">
                     <input type="checkbox" className="w-4 h-4 rounded bg-slate-900 border-slate-600" />
                     <span className="text-sm text-slate-200 font-medium">{unit}</span>
                   </div>
                   <span className="text-[10px] bg-green-900/50 text-green-400 border border-green-800 px-2 py-0.5 rounded uppercase font-bold">Available</span>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function PersonnelTab() {
  return (
    <div className="flex-1 bg-[#151e2e] flex flex-col overflow-hidden">
      <div className="bg-[#1e293b] p-3 border-b border-slate-700 flex justify-between items-center shadow-sm z-10">
        <h2 className="text-xl text-white font-semibold flex items-center gap-2">
          <User size={20} className="text-blue-500" /> Personnel Roster <span className="bg-slate-700 text-xs px-2 py-0.5 rounded text-slate-300">9</span>
        </h2>
        <div className="flex gap-2">
          <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-medium flex items-center gap-2">
            <User size={14} /> New Member
          </button>
          <button className="px-4 py-1.5 border border-slate-600 rounded text-slate-300 hover:bg-slate-700 flex items-center gap-2 text-sm">
            Dashboard
          </button>
          <button className="px-4 py-1.5 border border-slate-600 rounded text-slate-300 hover:bg-slate-700 flex items-center gap-2 text-sm">
            <Printer size={14} /> Print
          </button>
        </div>
      </div>

      <div className="p-3 bg-[#1e293b] border-b border-slate-700 flex items-center gap-4 text-sm z-10">
         <div className="relative flex-1 max-w-md">
           <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
           <input type="text" placeholder="Search by name, callsign, phone, email..." className="w-full bg-[#0f172a] border border-slate-700 rounded-full pl-9 pr-4 py-1.5 text-slate-200 outline-none focus:border-blue-500" />
         </div>
         <div className="flex items-center gap-2 text-slate-400">
           Status: <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs">All</span>
         </div>
         <div className="flex items-center gap-2 text-slate-400">
           Team: <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs">All</span>
           <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-xs border border-slate-700">Digital Modes</span>
           <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-xs border border-slate-700">HF Radio Team</span>
         </div>
         <div className="flex items-center gap-2 text-slate-400">
           Type: <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs">All</span>
         </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-y-auto lg:overflow-hidden">
        <div className="flex-[2] bg-[#1e293b] rounded-lg border border-slate-700 overflow-hidden flex flex-col min-h-[400px]">
          <div className="overflow-x-auto h-full">
            <table className="w-full text-sm text-left min-w-[600px]">
              <thead className="text-slate-400 bg-slate-800/50 sticky top-0 border-b border-slate-700">
                <tr>
                  <th className="p-3 font-bold uppercase text-xs">NAME</th>
                  <th className="p-3 font-bold uppercase text-xs">CALLSIGN</th>
                  <th className="p-3 font-bold uppercase text-xs">TYPE</th>
                  <th className="p-3 font-bold uppercase text-xs">STATUS</th>
                  <th className="p-3 font-bold uppercase text-xs">TEAM</th>
                  <th className="p-3 font-bold uppercase text-xs">PHONE</th>
                  <th className="p-3 font-bold uppercase text-xs">AVAIL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 overflow-y-auto">
                {MOCK_PERSONNEL.map((p, i) => (
                  <tr key={i} className="hover:bg-slate-700/30 cursor-pointer">
                    <td className="p-3 text-white font-medium">{p.name}</td>
                    <td className="p-3 text-slate-300">{p.callsign}</td>
                    <td className="p-3 text-slate-500"><span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-xs">{p.type}</span></td>
                    <td className="p-3 text-slate-500"><span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-xs">{p.status}</span></td>
                    <td className="p-3 text-slate-300">{p.team}</td>
                    <td className="p-3 text-slate-300">{p.phone}</td>
                    <td className="p-3">
                      {p.avail && <div className="w-4 h-4 rounded-full bg-green-500/20 border-2 border-green-500 mx-auto flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                      </div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex-[1] bg-[#1a2333] rounded-lg border border-slate-800 flex items-center justify-center text-slate-500 min-h-[200px]">
           <div className="text-center flex flex-col items-center">
              <User size={48} className="mb-4 opacity-50" />
              <p>Select a member from the table to view details.</p>
           </div>
        </div>
      </div>
    </div>
  );
}

function ConfigTab() {
  return (
    <div className="flex-1 bg-white text-slate-800 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
      {/* SIDEBAR */}
      <div className="w-full md:w-64 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 md:overflow-y-auto shrink-0 hidden md:block">
         <div className="p-4 border-b border-slate-200 flex items-center gap-2 font-bold text-slate-700">
           <Settings size={18} className="text-blue-600" /> Configuration
         </div>
         <MenuSection title="SYSTEM">
           <MenuItem label="System Health" />
           <MenuItem label="Audit Log" />
           <MenuItem label="Import / Export" />
         </MenuSection>
         <MenuSection title="INSTALLATION">
           <MenuItem label="System Settings" />
           <MenuItem label="API Keys" />
           <MenuItem label="Lookup Services" />
           <MenuItem label="Database Info" />
           <MenuItem label="Backup / Maintenance" />
         </MenuSection>
         <MenuSection title="APP PREFERENCES">
           <MenuItem label="Incident Types" active />
           <MenuItem label="Severity Levels" />
           <MenuItem label="Field Help Text" />
           <MenuItem label="Unit Statuses" />
           <MenuItem label="Facility Types" />
           <MenuItem label="Display Settings" />
           <MenuItem label="Sound / Alerts" />
         </MenuSection>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-y-auto">
         <div className="bg-slate-100 p-4 border-b border-slate-200 flex items-center gap-2">
           <Settings size={20} className="text-blue-600" />
           <h2 className="text-xl font-semibold text-slate-800">Incident Types</h2>
         </div>

         <div className="p-6">
            {/* FORM */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm mb-6">
              <div className="bg-slate-50 p-3 border-b border-slate-200 text-sm font-semibold text-slate-700">Edit Type</div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div className="md:col-span-2">
                   <label className="block text-xs font-bold text-slate-500 mb-1">Type Name <span className="text-red-500">*</span></label>
                   <input type="text" defaultValue="WxSpotter" className="w-full border border-slate-300 rounded p-2 text-sm outline-none focus:border-blue-500" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1">Group</label>
                   <input type="text" defaultValue="RACES" className="w-full border border-slate-300 rounded p-2 text-sm outline-none" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1">Severity</label>
                   <select className="w-full border border-slate-300 rounded p-2 text-sm outline-none">
                     <option>Elevated</option>
                   </select>
                 </div>
                 
                 <div className="md:col-span-2">
                   <label className="block text-xs font-bold text-slate-500 mb-1">Description</label>
                   <input type="text" defaultValue="Weather Spotter Report" className="w-full border border-slate-300 rounded p-2 text-sm outline-none" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1">Color</label>
                   <div className="flex gap-2">
                     <div className="w-8 h-8 rounded bg-blue-600 border border-slate-300 shrink-0"></div>
                     <input type="text" defaultValue="8800ff" className="flex-1 border border-slate-300 rounded p-2 text-sm outline-none min-w-0" />
                   </div>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1">Map Radius</label>
                   <input type="text" defaultValue="8000" className="w-full border border-slate-300 rounded p-2 text-sm outline-none" />
                 </div>

                 <div className="md:col-span-4">
                   <label className="block text-xs font-bold text-slate-500 mb-1">Protocol</label>
                   <textarea rows={3} className="w-full border border-slate-300 rounded p-2 text-sm outline-none" defaultValue="1. Record spotter call sign and exact location.&#10;2. Document observation: wind speed, hail size, funnel, rotation.&#10;3. Relay immediately to NWS via SKYWARN net."></textarea>
                 </div>

                 <div className="md:col-span-2">
                   <label className="block text-xs font-bold text-slate-500 mb-1">Regex Match Pattern</label>
                   <input type="text" defaultValue="weather.*spot|spotter|severe.*weather.*report|tornado.*spot|funnel|hail.*report" className="w-full border border-slate-300 rounded p-2 text-sm font-mono text-xs outline-none" />
                 </div>
                 <div className="md:col-span-2">
                   <label className="block text-xs font-bold text-slate-500 mb-1">Test Pattern</label>
                   <input type="text" placeholder="Type sample text to test..." className="w-full border border-slate-300 rounded p-2 text-sm outline-none" />
                 </div>
                 
                 <div className="md:col-span-4 flex flex-col md:flex-row justify-between gap-4 mt-2 pt-4 border-t border-slate-100">
                    <div className="flex gap-2">
                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-1 justify-center flex-1 md:flex-none"><Check size={16}/> Save</button>
                      <button className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded text-sm font-medium flex items-center gap-1 justify-center flex-1 md:flex-none">Cancel</button>
                    </div>
                    <button className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded text-sm font-medium flex items-center gap-1 justify-center"><Trash2 size={16}/> Delete</button>
                 </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
               <div className="flex gap-2 w-full sm:w-auto">
                 <div className="relative flex-1 sm:flex-none">
                   <input type="text" placeholder="Search types..." className="border border-slate-300 rounded px-3 py-1.5 text-sm outline-none w-full sm:w-48" />
                 </div>
                 <select className="border border-slate-300 rounded px-3 py-1.5 text-sm outline-none flex-1 sm:flex-none">
                   <option>All Groups</option>
                 </select>
               </div>
               <button className="bg-green-600 text-white px-3 py-1.5 rounded text-sm font-medium flex items-center gap-1 justify-center"><Plus size={16}/> Add Type</button>
            </div>

            <div className="overflow-x-auto rounded border border-slate-200">
              <table className="w-full text-sm text-left bg-white min-w-[700px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="p-3 font-bold text-xs uppercase">ID</th>
                  <th className="p-3 font-bold text-xs uppercase">TYPE</th>
                  <th className="p-3 font-bold text-xs uppercase">GROUP</th>
                  <th className="p-3 font-bold text-xs uppercase">SEV</th>
                  <th className="p-3 font-bold text-xs uppercase text-center">COLOR</th>
                  <th className="p-3 font-bold text-xs uppercase">PATTERN</th>
                  <th className="p-3 font-bold text-xs uppercase">SORT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {INCIDENT_TYPES.map((t, i) => (
                  <tr key={t.id} className="hover:bg-slate-50 cursor-pointer">
                    <td className="p-3 text-slate-500">{t.id}</td>
                    <td className="p-3 font-medium text-slate-800">{t.type}</td>
                    <td className="p-3 text-slate-600">{t.group}</td>
                    <td className="p-3 text-slate-600">{t.sev}</td>
                    <td className="p-3 flex justify-center"><div className={`w-6 h-6 rounded border border-slate-300 bg-${t.color}-500`}></div></td>
                    <td className="p-3 text-blue-500 font-mono text-xs">{t.pattern || 'None'}</td>
                    <td className="p-3 text-slate-500">{t.sort}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
         </div>
      </div>
    </div>
  );
}

function SchedulingTab() {
  return (
    <div className="flex-1 bg-slate-50 text-slate-800 flex flex-col overflow-hidden">
      <div className="bg-white p-4 border-b border-slate-200 flex justify-between items-center shadow-sm z-10">
        <h2 className="text-xl text-slate-800 font-semibold flex items-center gap-2">
          <Calendar size={20} className="text-blue-600" /> Scheduling
        </h2>
        <div className="flex gap-4">
           <div className="flex items-center gap-2 font-medium text-blue-600 border-b-2 border-blue-600 pb-1">
             <Calendar size={16}/> Shifts
           </div>
           <div className="flex items-center gap-2 font-medium text-slate-500 hover:text-slate-700 pb-1 cursor-pointer">
             <Calendar size={16}/> Events <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">2</span>
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden p-4 lg:p-6 gap-4 lg:gap-6">
         {/* LEFT SIDEBAR - TEMPLATES */}
         <div className="w-full lg:w-80 flex flex-col gap-4 overflow-y-auto shrink-0">
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
               <div className="bg-slate-50 p-3 border-b border-slate-200 font-semibold text-slate-700 flex justify-between items-center">
                 Shift Templates <button className="text-blue-600 border border-blue-200 rounded px-1.5 py-0.5 bg-blue-50 hover:bg-blue-100"><Plus size={14}/></button>
               </div>
               <div className="divide-y divide-slate-100">
                 <div className="p-3 flex justify-between items-center hover:bg-slate-50 cursor-pointer">
                   <div>
                     <div className="font-bold text-sm text-slate-800">New Oncall test</div>
                     <div className="text-xs text-slate-500">1w cycle • 1 roles • 0 slots</div>
                   </div>
                   <span className="bg-green-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">Active</span>
                 </div>
                 <div className="p-3 flex justify-between items-center bg-blue-50/50 border-l-4 border-blue-600 cursor-pointer">
                   <div>
                     <div className="font-bold text-sm text-slate-800">Skywarn 4-Week Rotation</div>
                     <div className="text-xs text-slate-500">4w cycle • 3 roles • 21 slots</div>
                   </div>
                   <span className="bg-green-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">Active</span>
                 </div>
               </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
               <div className="bg-slate-50 p-3 border-b border-slate-200 font-semibold text-slate-700 flex items-center gap-2">
                 <Calendar size={16}/> Week View
               </div>
               <div className="p-4 flex flex-col items-center gap-3">
                 <div className="flex justify-between items-center w-full">
                   <button className="border border-slate-300 rounded px-2 py-1 text-slate-600 hover:bg-slate-50">&lt;</button>
                   <span className="font-bold text-sm">3/23 — 3/29</span>
                   <button className="border border-slate-300 rounded px-2 py-1 text-slate-600 hover:bg-slate-50">&gt;</button>
                 </div>
                 <button className="w-full text-blue-600 font-medium text-sm py-1 rounded hover:bg-blue-50 border border-blue-200">Today</button>
               </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg shadow-sm flex-1 overflow-y-auto">
               <div className="bg-slate-50 p-3 border-b border-slate-200 font-semibold text-slate-700 flex justify-between items-center">
                 Template Settings <button className="text-red-500 border border-red-200 rounded px-1.5 py-0.5 hover:bg-red-50"><Trash2 size={14}/></button>
               </div>
               <div className="p-4 flex flex-col gap-4">
                 <div>
                   <label className="block text-xs font-bold text-slate-600 mb-1">Name</label>
                   <input type="text" defaultValue="Skywarn 4-Week Rotation" className="w-full border border-slate-300 rounded p-2 text-sm outline-none focus:border-blue-500" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-600 mb-1">Description</label>
                   <textarea rows={3} className="w-full border border-slate-300 rounded p-2 text-sm outline-none" defaultValue="Primary Skywarn net control rotation. 24/7 coverage with Manager + 2 Support positions. 4-week cycle."></textarea>
                 </div>
                 <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Rotation Weeks</label>
                      <input type="number" defaultValue="4" className="w-full border border-slate-300 rounded p-2 text-sm outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Timezone</label>
                      <select className="w-full border border-slate-300 rounded p-2 text-sm outline-none"><option>America/Chicago</option></select>
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                   <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-blue-600" />
                   <span className="text-sm font-medium text-slate-700">Active</span>
                 </div>
                 <button className="w-full bg-blue-600 text-white font-medium py-2 rounded shadow-sm hover:bg-blue-700">Save Template</button>
               </div>
            </div>
         </div>

         {/* RIGHT CALENDAR */}
         <div className="flex-1 bg-white border border-slate-200 rounded-lg shadow-sm overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse">
               <thead>
                 <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
                   <th className="p-3 border-r border-slate-200 text-left w-32">SHIFT</th>
                   <th className="p-3 border-r border-slate-200 text-center text-blue-600">MON 3/23</th>
                   <th className="p-3 border-r border-slate-200 text-center">TUE 3/24</th>
                   <th className="p-3 border-r border-slate-200 text-center">WED 3/25</th>
                   <th className="p-3 border-r border-slate-200 text-center">THU 3/26</th>
                   <th className="p-3 border-r border-slate-200 text-center">FRI 3/27</th>
                   <th className="p-3 border-r border-slate-200 text-center">SAT 3/28</th>
                   <th className="p-3 border-r border-slate-200 text-center">SUN 3/29</th>
                 </tr>
               </thead>
               <tbody className="text-xs">
                 {/* Morning */}
                 <tr className="border-b border-slate-200">
                   <td className="p-3 border-r border-slate-200 bg-slate-50 font-medium">Morning<div className="text-slate-400 font-normal">6:00a-2:00p</div></td>
                   {[1,2,3,4,5,6,7].map(i => (
                     <td key={i} className="p-2 border-r border-slate-200 align-top">
                        <div className="flex flex-col gap-1">
                          <ShiftPill role="net" call="W9XYZ" color="red" />
                          <ShiftPill role="net" call="KE9STU" color="blue" />
                          <div className="flex gap-1">
                            <ShiftPill role="empty" label="+ Support" />
                            <ShiftPill role="empty" label="+ Observer" />
                          </div>
                        </div>
                     </td>
                   ))}
                 </tr>
                 {/* Afternoon */}
                 <tr className="border-b border-slate-200">
                   <td className="p-3 border-r border-slate-200 bg-slate-50 font-medium">Afternoon<div className="text-slate-400 font-normal">2:00p-10:00p</div></td>
                   {[1,2,3,4,5,6,7].map(i => (
                     <td key={i} className="p-2 border-r border-slate-200 align-top">
                        <div className="flex flex-col gap-1">
                          <ShiftPill role="net" call="KD9LMN" color="red" />
                          <ShiftPill role="net" call="WB9VWX" color="blue" />
                          <div className="flex gap-1">
                            <ShiftPill role="empty" label="+ Support" />
                            {i === 2 ? <ShiftPill role="net" call="KE9STU" color="green" /> : <ShiftPill role="empty" label="+ Observer" />}
                          </div>
                        </div>
                     </td>
                   ))}
                 </tr>
                 {/* Night */}
                 <tr className="border-b border-slate-200">
                   <td className="p-3 border-r border-slate-200 bg-slate-50 font-medium">Night<div className="text-slate-400 font-normal">10:00p-6:00a</div></td>
                   {[1,2,3,4,5,6,7].map(i => (
                     <td key={i} className="p-2 border-r border-slate-200 align-top">
                        <div className="flex flex-col gap-1">
                          <ShiftPill role="net" call="KC9ABC" color="red" />
                          <ShiftPill role="net" call="N9PQR" color="blue" />
                          <div className="flex gap-1">
                            <ShiftPill role="empty" label="+ Support" />
                            <ShiftPill role="empty" label="+ Observer" />
                          </div>
                        </div>
                     </td>
                   ))}
                 </tr>
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function NavBtn({ icon, label, active, highlight, onClick }: { icon: React.ReactNode, label: string, active?: boolean, highlight?: boolean, onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
      active ? 'bg-slate-700 text-white' : 
      highlight ? 'text-green-400 hover:bg-slate-800' : 
      'text-slate-400 hover:text-white hover:bg-slate-800'
    }`}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function Widget({ title, icon, children, flex }: { title: string, icon: React.ReactNode, children: React.ReactNode, flex?: string }) {
  return (
    <div className={`bg-[#1e293b] border border-slate-700 flex flex-col overflow-hidden ${flex} rounded`}>
      <div className="bg-[#1e293b] border-b border-slate-700 px-3 py-1.5 flex items-center justify-between shrink-0 text-slate-300">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
          {icon}
          {title}
        </div>
        <div className="flex gap-1">
           <button className="p-1 hover:bg-slate-700 rounded text-slate-500"><RefreshCw size={12}/></button>
           <button className="p-1 hover:bg-slate-700 rounded text-slate-500"><Maximize size={12}/></button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-[#0f172a]">
        {children}
      </div>
    </div>
  );
}

function CtrlBtn({ icon, label, className = '' }: { icon: React.ReactNode, label: string, className?: string }) {
  return (
    <button className={`flex flex-col items-center justify-center gap-1 p-2 border border-slate-700 bg-[#1e293b] hover:bg-slate-700 rounded text-slate-400 transition-colors ${className}`}>
      {icon}
      <span className="text-[8px] font-bold tracking-wider">{label}</span>
    </button>
  );
}

function FormSection({ title, icon, children, badge }: { title: string, icon: React.ReactNode, children: React.ReactNode, badge?: string }) {
  return (
    <div className="bg-[#1e293b] border border-slate-700 rounded flex flex-col">
       <div className="bg-slate-800 p-2 border-b border-slate-700 flex items-center justify-between">
         <div className="flex items-center gap-2 text-sm text-white font-medium">
           {icon} {title}
         </div>
         {badge && <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{badge}</span>}
       </div>
       <div className="p-4">
         {children}
       </div>
    </div>
  );
}

function MenuSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase">{title}</div>
      <ul>{children}</ul>
    </div>
  );
}

function MenuItem({ label, active }: { label: string, active?: boolean }) {
  return (
    <li>
      <button className={`w-full text-left px-4 py-2 text-sm border-l-4 ${active ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium' : 'border-transparent text-slate-600 hover:bg-slate-100'}`}>
        {label}
      </button>
    </li>
  );
}

function ShiftPill({ role, call, color, label }: { role: 'net'|'empty', call?: string, color?: string, label?: string }) {
  if (role === 'empty') {
    return (
      <div className="border border-dashed border-slate-300 rounded px-1.5 py-0.5 text-[10px] text-slate-400 font-medium cursor-pointer hover:bg-slate-50 hover:border-slate-400 text-center flex-1">
        {label}
      </div>
    );
  }
  
  const colors: Record<string, string> = {
    red: 'border-red-200 text-red-600 bg-red-50',
    blue: 'border-blue-200 text-blue-600 bg-blue-50',
    green: 'border-green-200 text-green-600 bg-green-50'
  };
  
  return (
    <div className={`border rounded px-1.5 py-0.5 text-[10px] font-bold cursor-pointer hover:brightness-95 flex items-center gap-1 ${colors[color || 'blue']}`}>
      <div className={`w-2 h-2 rounded-full border ${color==='red'?'border-red-400':color==='blue'?'border-blue-400':'border-green-400'}`}></div>
      {call}
    </div>
  );
}

function UnitsTab() {
  const MOCK_UNITS = [
    { id: 'E1', type: 'Engine', status: 'Available', location: 'Station 1', personnel: 4, updated: '10:00 AM' },
    { id: 'M1', type: 'Medic', status: 'Assigned', location: '123 Main St', personnel: 2, updated: '10:15 AM' },
    { id: 'R1', type: 'Rescue', status: 'En Route', location: '456 Elm St', personnel: 3, updated: '10:20 AM' },
    { id: 'CERT A', type: 'CERT', status: 'Available', location: 'HQ', personnel: 8, updated: '09:00 AM' },
    { id: 'Patrol 1', type: 'Police', status: 'Available', location: 'Sector 1', personnel: 1, updated: '10:05 AM' }
  ];

  return (
    <div className="flex-1 bg-[#151e2e] flex flex-col overflow-hidden">
      <div className="bg-[#1e293b] p-3 border-b border-slate-700 flex justify-between items-center shadow-sm z-10">
        <h2 className="text-xl text-white font-semibold flex items-center gap-2">
          <Truck size={20} className="text-blue-500" /> Units <span className="bg-slate-700 text-xs px-2 py-0.5 rounded text-slate-300">5</span>
        </h2>
        <div className="flex gap-2">
          <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-medium flex items-center gap-2">
            <Plus size={14} /> New Unit
          </button>
        </div>
      </div>
      <div className="p-3 bg-[#1e293b] border-b border-slate-700 flex flex-col md:flex-row items-center gap-4 text-sm z-10">
        <div className="relative flex-1 w-full max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search units..." className="w-full bg-[#0f172a] border border-slate-700 rounded-full pl-9 pr-4 py-1.5 text-slate-200 outline-none focus:border-blue-500" />
        </div>
        <div className="flex items-center gap-2 text-slate-400 w-full md:w-auto">
           Status: <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs">All</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="bg-[#1e293b] rounded-lg border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[600px]">
              <thead className="text-slate-400 bg-slate-800/50 sticky top-0 border-b border-slate-700">
                <tr>
                  <th className="p-3 font-bold uppercase text-xs">UNIT ID</th>
                  <th className="p-3 font-bold uppercase text-xs">TYPE</th>
                  <th className="p-3 font-bold uppercase text-xs">STATUS</th>
                  <th className="p-3 font-bold uppercase text-xs">LOCATION</th>
                  <th className="p-3 font-bold uppercase text-xs">PERSONNEL</th>
                  <th className="p-3 font-bold uppercase text-xs">UPDATED</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {MOCK_UNITS.map((u, i) => (
                  <tr key={i} className="hover:bg-slate-700/30 cursor-pointer">
                    <td className="p-3 text-white font-bold">{u.id}</td>
                    <td className="p-3 text-slate-300">{u.type}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        u.status === 'Available' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        u.status === 'Assigned' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">{u.location}</td>
                    <td className="p-3 text-slate-300">{u.personnel}</td>
                    <td className="p-3 text-slate-500">{u.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function FacsTab() {
  const MOCK_FACS = [
    { name: 'Bloomington Civic Plaza', type: 'ICC', status: 'Open', hours: '00:00-23:59', capacity: '100%' },
    { name: 'Community Center', type: 'Shelter', status: 'Closed', hours: '-', capacity: '0%' },
    { name: 'Station 1', type: 'Fire Station', status: 'Open', hours: '24/7', capacity: 'N/A' },
    { name: 'Hospital A', type: 'Medical', status: 'Open', hours: '24/7', capacity: '85%' },
  ];

  return (
    <div className="flex-1 bg-[#151e2e] flex flex-col overflow-hidden">
      <div className="bg-[#1e293b] p-3 border-b border-slate-700 flex justify-between items-center shadow-sm z-10">
        <h2 className="text-xl text-white font-semibold flex items-center gap-2">
          <Building2 size={20} className="text-blue-500" /> Facilities <span className="bg-slate-700 text-xs px-2 py-0.5 rounded text-slate-300">4</span>
        </h2>
        <div className="flex gap-2">
          <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-medium flex items-center gap-2">
            <Plus size={14} /> Add Facility
          </button>
        </div>
      </div>
      <div className="p-3 bg-[#1e293b] border-b border-slate-700 flex flex-col md:flex-row items-center gap-4 text-sm z-10">
        <div className="relative flex-1 w-full max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search facilities..." className="w-full bg-[#0f172a] border border-slate-700 rounded-full pl-9 pr-4 py-1.5 text-slate-200 outline-none focus:border-blue-500" />
        </div>
        <div className="flex items-center gap-2 text-slate-400 w-full md:w-auto">
           Type: <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs">All</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 flex flex-col lg:flex-row gap-4">
        <div className="flex-[2] bg-[#1e293b] rounded-lg border border-slate-700 overflow-hidden min-h-[300px]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[500px]">
              <thead className="text-slate-400 bg-slate-800/50 sticky top-0 border-b border-slate-700">
                <tr>
                  <th className="p-3 font-bold uppercase text-xs">NAME</th>
                  <th className="p-3 font-bold uppercase text-xs">TYPE</th>
                  <th className="p-3 font-bold uppercase text-xs">STATUS</th>
                  <th className="p-3 font-bold uppercase text-xs">HOURS</th>
                  <th className="p-3 font-bold uppercase text-xs">CAPACITY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {MOCK_FACS.map((f, i) => (
                  <tr key={i} className="hover:bg-slate-700/30 cursor-pointer">
                    <td className="p-3 text-white font-bold">{f.name}</td>
                    <td className="p-3 text-slate-300">{f.type}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${f.status === 'Open' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">{f.hours}</td>
                    <td className="p-3 text-slate-400">{f.capacity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex-[1] bg-[#1e293b] rounded-lg border border-slate-700 flex flex-col min-h-[300px]">
          <div className="bg-slate-800 p-2 flex justify-between items-center text-sm font-medium border-b border-slate-700 text-white">
            <div className="flex items-center gap-2"><MapIcon size={16}/> Map View</div>
          </div>
          <div className="flex-1 relative bg-slate-100 z-0">
            <MapContainer center={[44.9778, -93.2650]} zoom={11} style={{ height: '100%', width: '100%' }}>
               <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchTab() {
  return (
    <div className="flex-1 bg-[#151e2e] flex flex-col overflow-y-auto items-center p-8">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        <div className="text-center mb-4 mt-8">
          <h2 className="text-3xl font-bold text-white mb-2 flex justify-center items-center gap-3">
            <Search className="text-blue-500" size={32} /> Global Search
          </h2>
          <p className="text-slate-400">Search across incidents, units, personnel, facilities, and SOPs.</p>
        </div>
        <div className="relative flex w-full shadow-lg">
          <Search size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Enter keywords, IDs, callsigns, or names..." className="w-full bg-[#1e293b] border border-slate-600 rounded-lg pl-12 pr-4 py-4 text-lg text-slate-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded font-medium">Search</button>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          <span className="text-sm text-slate-500">Quick Filters:</span>
          {['All', 'Incidents', 'Units', 'Personnel', 'Facilities'].map(f => (
            <button key={f} className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-3 py-1 rounded-full">{f}</button>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <div className="text-slate-500 text-sm font-medium border-b border-slate-700 pb-2">Recent Searches</div>
          <div className="flex flex-col gap-2">
            {['11/TBD', 'KD9GHI', 'Fire Alarm', 'M1'].map(s => (
              <div key={s} className="flex items-center gap-3 text-slate-300 hover:text-white cursor-pointer p-2 hover:bg-slate-800 rounded">
                 <Search size={14} className="text-slate-500" />
                 <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportsTab() {
  return (
    <div className="flex-1 bg-white text-slate-800 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
      <div className="w-full md:w-64 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 shrink-0 p-4 md:overflow-y-auto hidden md:block">
         <div className="flex items-center gap-2 font-bold text-slate-700 mb-6">
           <FileText size={18} className="text-blue-600" /> Reports
         </div>
         <MenuSection title="STANDARD">
           <MenuItem label="Daily Summary" active />
           <MenuItem label="Incident Log" />
           <MenuItem label="Unit Activity" />
           <MenuItem label="Personnel Hours" />
         </MenuSection>
         <MenuSection title="ANALYTICS">
           <MenuItem label="Response Times" />
           <MenuItem label="Heatmaps" />
           <MenuItem label="Type Breakdown" />
         </MenuSection>
         <MenuSection title="CUSTOM">
           <MenuItem label="Saved Reports" />
           <MenuItem label="Report Builder" />
         </MenuSection>
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto bg-slate-100">
        <div className="bg-white p-4 border-b border-slate-200 flex justify-between items-center shadow-sm">
          <h2 className="text-xl text-slate-800 font-semibold flex items-center gap-2">Daily Summary Report</h2>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 flex items-center gap-2 text-sm font-medium hidden sm:flex">
              <Printer size={14} /> Print
            </button>
            <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium">
              Export PDF
            </button>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-6 shadow-sm max-w-4xl mx-auto">
            <div className="text-center mb-8 border-b border-slate-200 pb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Daily Operations Summary</h1>
              <p className="text-slate-500 text-sm sm:text-base">Date: {new Date().toLocaleDateString()} | Generated By: admin</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
              <div className="bg-slate-50 border border-slate-200 rounded p-4 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-1">24</div>
                <div className="text-xs font-bold text-slate-500 uppercase">Total Incidents</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded p-4 text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-1">12</div>
                <div className="text-xs font-bold text-slate-500 uppercase">Active Units</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded p-4 text-center">
                <div className="text-4xl font-bold text-purple-600 mb-1">5m 20s</div>
                <div className="text-xs font-bold text-slate-500 uppercase">Avg Response Time</div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Recent Incidents</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border border-slate-200 min-w-[500px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <tr>
                    <th className="p-3 font-bold text-xs uppercase">Time</th>
                    <th className="p-3 font-bold text-xs uppercase">Type</th>
                    <th className="p-3 font-bold text-xs uppercase">Location</th>
                    <th className="p-3 font-bold text-xs uppercase">Resolution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3">09:15 AM</td>
                    <td className="p-3 font-medium">WxSpotter</td>
                    <td className="p-3 text-slate-600">Main St & 1st Ave</td>
                    <td className="p-3 text-emerald-600 font-medium">Closed</td>
                  </tr>
                  <tr>
                    <td className="p-3">10:30 AM</td>
                    <td className="p-3 font-medium">WelfareChk</td>
                    <td className="p-3 text-slate-600">456 Elm St</td>
                    <td className="p-3 text-emerald-600 font-medium">Closed</td>
                  </tr>
                  <tr>
                    <td className="p-3">11:45 AM</td>
                    <td className="p-3 font-medium">EmergNet</td>
                    <td className="p-3 text-slate-600">City Hall</td>
                    <td className="p-3 text-blue-600 font-medium">Active</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SOPTab() {
  const SOP_LIST = [
    { id: 'SOP-01', title: 'General Dispatch Protocol', category: 'General', updated: 'Jan 10, 2026' },
    { id: 'SOP-02', title: 'Severe Weather Operations', category: 'Weather', updated: 'Mar 15, 2026' },
    { id: 'SOP-03', title: 'Radio Etiquette and Codes', category: 'Comms', updated: 'Feb 20, 2026' },
    { id: 'SOP-04', title: 'Emergency Evacuation', category: 'Emergency', updated: 'Nov 05, 2025' },
    { id: 'SOP-05', title: 'Medical Call Handling', category: 'Medical', updated: 'Dec 12, 2025' },
  ];

  return (
    <div className="flex-1 bg-white text-slate-800 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
      <div className="w-full md:w-80 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col shrink-0 hidden md:flex">
        <div className="p-4 border-b border-slate-200">
           <h2 className="font-bold text-slate-700 flex items-center gap-2 mb-4">
             <BookOpen size={18} className="text-blue-600" /> SOP Library
           </h2>
           <div className="relative">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input type="text" placeholder="Search SOPs..." className="w-full bg-white border border-slate-300 rounded pl-9 pr-3 py-2 text-sm outline-none focus:border-blue-500" />
           </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {SOP_LIST.map(sop => (
            <div key={sop.id} className="p-3 hover:bg-white rounded cursor-pointer border border-transparent hover:border-slate-200 mb-1">
              <div className="flex justify-between items-start mb-1">
                 <span className="text-xs font-bold text-blue-600">{sop.id}</span>
                 <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 rounded">{sop.category}</span>
              </div>
              <div className="font-medium text-sm text-slate-800">{sop.title}</div>
              <div className="text-xs text-slate-400 mt-1">Updated: {sop.updated}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 bg-slate-100 flex flex-col overflow-y-auto md:overflow-hidden">
         <div className="bg-white p-4 border-b border-slate-200 flex justify-between items-center shadow-sm">
            <div>
              <div className="text-sm font-bold text-blue-600 mb-1">SOP-02</div>
              <h2 className="text-lg sm:text-xl text-slate-800 font-semibold">Severe Weather Operations</h2>
            </div>
            <button className="px-4 py-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 flex items-center gap-2 text-sm font-medium">
              <Printer size={14} /> Print
            </button>
         </div>
         <div className="flex-1 overflow-y-auto p-4 sm:p-8">
            <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm">
               <div className="prose prose-slate max-w-none text-sm">
                 <h3 className="text-lg font-bold border-b pb-2 mb-4">1. Purpose</h3>
                 <p className="mb-6 text-slate-600 leading-relaxed">The purpose of this Standard Operating Procedure (SOP) is to establish guidelines for dispatch operations during severe weather events, ensuring timely response and coordination with weather spotters and emergency services.</p>
                 
                 <h3 className="text-lg font-bold border-b pb-2 mb-4">2. Activation</h3>
                 <p className="mb-6 text-slate-600 leading-relaxed">Severe weather protocol is activated when the National Weather Service (NWS) issues a severe thunderstorm watch, tornado watch, or warning for the coverage area.</p>

                 <h3 className="text-lg font-bold border-b pb-2 mb-4">3. Procedures</h3>
                 <ul className="list-disc pl-5 mb-6 text-slate-600 space-y-2">
                   <li>Acknowledge weather alerts via primary dispatch channels.</li>
                   <li>Initiate the Skywarn net and assign a Net Control Station (NCS).</li>
                   <li>Log all spotter reports using the <code>WxSpotter</code> incident type.</li>
                   <li>Relay critical information (tornado sightings, hail &gt; 1 inch, wind &gt; 58 mph) directly to NWS.</li>
                   <li>Maintain regular status checks with deployed field units.</li>
                 </ul>
                 
                 <div className="bg-yellow-50 border border-yellow-200 p-4 rounded text-yellow-800 mt-8 text-sm">
                   <strong>Important:</strong> Life safety takes precedence over property reporting. Instruct spotters to seek shelter if conditions become hazardous.
                 </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function ContactsTab() {
  const MOCK_CONTACTS = [
    { name: 'Police Department (Non-Emergency)', phone: '(555) 123-4567', email: 'dispatch@police.local', type: 'Agency' },
    { name: 'Fire Department (HQ)', phone: '(555) 987-6543', email: 'hq@fire.local', type: 'Agency' },
    { name: 'National Weather Service', phone: '(555) 555-0000', email: 'skywarn@nws.gov', type: 'External' },
    { name: 'Public Works', phone: '(555) 222-3333', email: 'pw@city.local', type: 'City Services' },
    { name: 'Mayor\'s Office', phone: '(555) 444-5555', email: 'mayor@city.local', type: 'Government' },
  ];

  return (
    <div className="flex-1 bg-[#151e2e] flex flex-col overflow-hidden">
      <div className="bg-[#1e293b] p-3 border-b border-slate-700 flex justify-between items-center shadow-sm z-10">
        <h2 className="text-xl text-white font-semibold flex items-center gap-2">
          <Phone size={20} className="text-blue-500" /> Directory & Contacts
        </h2>
        <div className="flex gap-2">
          <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-medium flex items-center gap-2">
            <Plus size={14} /> Add Contact
          </button>
        </div>
      </div>
      <div className="p-3 bg-[#1e293b] border-b border-slate-700 flex flex-col md:flex-row items-center gap-4 text-sm z-10">
        <div className="relative flex-1 w-full max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search contacts..." className="w-full bg-[#0f172a] border border-slate-700 rounded-full pl-9 pr-4 py-1.5 text-slate-200 outline-none focus:border-blue-500" />
        </div>
        <div className="flex items-center gap-2 text-slate-400 w-full md:w-auto">
           Group: <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs">All</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {MOCK_CONTACTS.map((c, i) => (
            <div key={i} className="bg-[#1e293b] border border-slate-700 rounded-lg p-4 hover:border-slate-500 transition-colors">
               <div className="flex justify-between items-start mb-3">
                 <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 font-bold text-lg border border-slate-700">
                   {c.name.charAt(0)}
                 </div>
                 <span className="text-[10px] uppercase font-bold bg-slate-800 text-slate-400 px-2 py-0.5 rounded">{c.type}</span>
               </div>
               <h3 className="font-bold text-white mb-2 truncate" title={c.name}>{c.name}</h3>
               <div className="flex flex-col gap-1 text-sm text-slate-400">
                 <div className="flex items-center gap-2"><Phone size={14} className="text-slate-500" /> {c.phone}</div>
                 <div className="flex items-center gap-2"><Mail size={14} className="text-slate-500" /> {c.email}</div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
