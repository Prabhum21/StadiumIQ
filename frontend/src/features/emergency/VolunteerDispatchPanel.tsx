'use client';

import { useState, useEffect } from 'react';
import { Incident, Volunteer, AIAnalysisResponse } from '@/types';
import { getApiUrl } from '@/lib/api';
import { motion } from 'framer-motion';
import { Send, Map, Clock, ShieldAlert } from 'lucide-react';
import { useCrowd, useTransport, useVenue } from '@/hooks/useFirestore';

export default function VolunteerDispatchPanel({
  incident,
  volunteers,
}: {
  incident: Incident;
  volunteers: Volunteer[];
}) {
  const { data: crowdData } = useCrowd();
  const { data: transportData } = useTransport();
  const { data: venueData } = useVenue();

  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResponse | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (!incident) return;
    const fetchDispatchPlan = async () => {
      if (analyzing) return;
      setAnalyzing(true);
      const contextData = {
        mode: 'emergency',
        incident,
        volunteers: volunteers.filter((v) => v.availability === 'Available'),
        crowd: crowdData,
        transport: transportData,
        venue: venueData,
        time: new Date().toISOString(),
      };

      try {
        const res = await fetch(getApiUrl('/api/decision'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ context_data: contextData }),
        });
        const data = await res.json();
        setAiAnalysis(data.recommendation);
      } catch (e) {
        console.error(e);
      } finally {
        setAnalyzing(false);
      }
    };
    fetchDispatchPlan();
  }, [incident.id]);

  if (analyzing) {
    return (
      <div className="glass-card p-6 h-[250px] flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-zinc-400 text-sm animate-pulse">
          Calculating optimal dispatch using AI...
        </p>
      </div>
    );
  }

  if (!aiAnalysis || aiAnalysis.mode !== 'emergency') return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Send className="text-blue-400" size={20} /> AI Dispatch Strategy
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${aiAnalysis.priority === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}
        >
          {aiAnalysis.priority} Priority
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
          <span className="text-xs text-zinc-400 flex items-center gap-1 mb-1">
            <Clock size={12} /> Est. Response
          </span>
          <span className="font-medium">{aiAnalysis.estimated_response}</span>
        </div>
        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
          <span className="text-xs text-zinc-400 flex items-center gap-1 mb-1">
            <ShieldAlert size={12} /> Evacuation
          </span>
          <span
            className={`font-medium ${aiAnalysis.evacuation_required ? 'text-red-400' : 'text-green-400'}`}
          >
            {aiAnalysis.evacuation_required ? 'REQUIRED' : 'Not Required'}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-xs font-semibold text-zinc-400 mb-2 uppercase">Assigned Volunteers</h4>
        <div className="flex flex-wrap gap-2">
          {aiAnalysis.assigned_volunteers?.map((vol: string, i: number) => (
            <span
              key={i}
              className="bg-blue-600/20 border border-blue-500/30 text-blue-400 px-3 py-1.5 rounded-lg text-sm font-medium"
            >
              {vol}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-xs font-semibold text-zinc-400 mb-2 uppercase">Action Plan</h4>
        <ul className="space-y-2">
          {aiAnalysis.recommended_actions?.map((action: string, i: number) => (
            <li
              key={i}
              className="flex items-start gap-3 bg-white/5 p-3 rounded-lg text-sm text-zinc-300"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
              {action}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
          Execute Dispatch
        </button>
        <button className="px-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
          <Map size={18} />
        </button>
      </div>
    </motion.div>
  );
}
