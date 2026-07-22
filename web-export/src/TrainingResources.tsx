import React, { useState } from 'react';
import { BookOpen, Video, FileText, CheckSquare, ArrowLeft, Download, PlayCircle, BarChart3, Activity } from 'lucide-react';
import { MonitorPlay } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TrainingResources({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'modules' | 'dashboard'>('modules');

  const performanceData = [
    { name: 'Week 1', responseTime: 120, accuracy: 85 },
    { name: 'Week 2', responseTime: 110, accuracy: 88 },
    { name: 'Week 3', responseTime: 95, accuracy: 92 },
    { name: 'Week 4', responseTime: 85, accuracy: 96 },
  ];

  const scenarioScores = [
    { name: 'Active Fire', score: 90 },
    { name: 'Multi-Vehicle', score: 85 },
    { name: 'Medical Eval', score: 95 },
    { name: 'Hazmat', score: 82 },
  ];

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
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-3xl font-black text-white">Training Academy</h1>
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button 
                onClick={() => setActiveTab('modules')}
                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'modules' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <BookOpen size={16} /> Coursework
              </button>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <BarChart3 size={16} /> Performance
              </button>
            </div>
          </div>
          <p className="text-slate-400">
            {activeTab === 'modules' ? 'Complete these modules to prepare for live deployment. Review the materials and finish all knowledge checks and homework assignments.' : 'Review your training performance, response times, and scenario accuracy.'}
          </p>
        </div>

        {activeTab === 'modules' ? (
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
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Activity size={20} className="text-blue-400" /> Response Time Trend (Seconds)</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                        itemStyle={{ color: '#e2e8f0' }}
                      />
                      <Line type="monotone" dataKey="responseTime" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6' }} name="Avg Seconds" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-slate-400 text-sm mt-4 text-center">Consistent improvement in call processing speed.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><CheckSquare size={20} className="text-emerald-400" /> Dispatch Accuracy Trend (%)</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis domain={[0, 100]} stroke="#94a3b8" />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                        itemStyle={{ color: '#e2e8f0' }}
                      />
                      <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981' }} name="Accuracy %" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-slate-400 text-sm mt-4 text-center">Protocol adherence and correct unit assignments.</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><BarChart3 size={20} className="text-orange-400" /> Recent Scenario Scores</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scenarioScores} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} />
                    <RechartsTooltip 
                      cursor={{ fill: '#1e293b' }}
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                    />
                    <Bar dataKey="score" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Ensure MonitorPlay is defined if we use it inside
import { MonitorPlay } from 'lucide-react';
