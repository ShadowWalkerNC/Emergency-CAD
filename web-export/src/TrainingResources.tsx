import React from 'react';
import { BookOpen, Video, FileText, CheckSquare, ArrowLeft, Download, PlayCircle } from 'lucide-react';

export default function TrainingResources({ onBack }: { onBack: () => void }) {
  const modules = [
    {
      title: "Module 1: APCO Public-Safety Telecommunicator Standards",
      description: "Learn the foundational standards for public safety telecommunicators based on APCO guidelines.",
      resources: [
        { type: 'doc', name: 'APCO Core Competencies', size: '2.5 MB PDF' },
        { type: 'video', name: 'Effective Communication Techniques', duration: '18 mins' },
        { type: 'quiz', name: 'Homework: APCO Standards Check', status: 'Pending' }
      ]
    },
    {
      title: "Module 2: FEMA/NIMS Incident Command System (ICS)",
      description: "Understand standard ICS structures for dispatch simulations to teach real-world incident command protocols.",
      resources: [
        { type: 'doc', name: 'ICS-100 Overview', size: '3.1 MB PDF' },
        { type: 'video', name: 'NIMS Principles in Dispatch', duration: '22 mins' },
        { type: 'assignment', name: 'Homework: Map ICS Roles to Units', status: 'Due Tomorrow' }
      ]
    },
    {
      title: "Module 3: Dispatch Scenario Engine",
      description: "Run JSON-based mock scenarios featuring 911 calls, unit radio traffic, and timed events directly in the Dispatcher Console.",
      resources: [
        { type: 'sim', name: 'Scenario 1: Active Fire Alarm (JSON)', duration: '15 mins' },
        { type: 'sim', name: 'Scenario 2: Multi-Vehicle Collision (JSON)', duration: '25 mins' },
        { type: 'audio', name: 'Review Scenario 1 Radio Traffic', duration: '10 mins' },
        { type: 'assignment', name: 'Homework: Scenario Action Logs', status: 'In Progress' }
      ]
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video size={16} className="text-blue-400" />;
      case 'doc': return <FileText size={16} className="text-emerald-400" />;
      case 'audio': return <PlayCircle size={16} className="text-purple-400" />;
      case 'sim': return <MonitorPlay size={16} className="text-orange-400" />;
      case 'assignment': return <BookOpen size={16} className="text-red-400" />;
      case 'quiz': return <CheckSquare size={16} className="text-yellow-400" />;
      default: return <FileText size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 font-sans text-slate-200">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack}
          className="mb-6 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border border-slate-700 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8">
          <h1 className="text-3xl font-black text-white mb-2">Training Resources & Homework</h1>
          <p className="text-slate-400">
            Complete these modules to prepare for live deployment. Review the materials and finish all knowledge checks and homework assignments.
          </p>
        </div>

        <div className="space-y-6">
          {modules.map((mod, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-1">{mod.title}</h2>
              <p className="text-slate-400 text-sm mb-4">{mod.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mod.resources.map((res, ridx) => (
                  <div key={ridx} className="bg-slate-800 rounded-lg p-3 flex items-center justify-between border border-slate-700 hover:border-slate-500 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-900 p-2 rounded-lg">
                        {getIcon(res.type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-slate-200">{res.name}</h4>
                        <p className="text-xs text-slate-500">
                          {res.duration || res.size || res.status}
                        </p>
                      </div>
                    </div>
                    {res.type === 'doc' ? (
                      <Download size={14} className="text-slate-500" />
                    ) : res.type === 'video' || res.type === 'audio' || res.type === 'sim' ? (
                      <PlayCircle size={14} className="text-slate-500" />
                    ) : (
                      <ArrowLeft size={14} className="text-slate-500 transform rotate-180" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Ensure MonitorPlay is defined if we use it inside
import { MonitorPlay } from 'lucide-react';
