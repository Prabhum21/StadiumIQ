'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTransport } from '@/hooks/useFirestore';
import { getApiUrl } from '@/lib/api';
import { AIAnalysisResponse } from '@/types';
import { Train, Car, Bus, Activity, Navigation } from 'lucide-react';

export default function TransportIntelligence() {
  const { data: transportData } = useTransport();

  const [preference, setPreference] = useState('Fastest');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIAnalysisResponse | null>(null);

  const getIcon = (type: string) => {
    if (type === 'Metro') return <Train size={18} />;
    if (type === 'Bus') return <Bus size={18} />;
    return <Car size={18} />;
  };

  const handleGenerate = async () => {
    if (loading) return;
    setLoading(true);
    setResponse(null);

    const contextData = {
      mode: 'transport',
      preference,
      transport: transportData,
      time: new Date().toISOString(),
    };

    try {
      const res = await fetch(getApiUrl('/api/decision'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context_data: contextData }),
      });
      const data = await res.json();
      setResponse(data.recommendation);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
        <Train className="text-green-400" />
        <h3 className="text-lg font-semibold text-white">Transport Intelligence</h3>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
        {/* Live Status Overview */}
        <div className="grid grid-cols-2 gap-3 mb-2">
          {transportData.map((t, i) => (
            <div
              key={i}
              className="bg-black/30 border border-white/5 p-3 rounded-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-zinc-400">{getIcon(t.type)}</span>
                {t.type}
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${t.status === 'On Time' ? 'bg-green-500/20 text-green-400' : t.status === 'Delayed' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}
              >
                {t.occupancy ? `${t.occupancy}% Full` : t.status}
              </span>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Travel Goal</label>
          <div className="flex items-center bg-black/40 border border-white/10 rounded-lg px-3 py-2">
            <Activity size={16} className="text-green-400 mr-2 shrink-0" />
            <select
              value={preference}
              onChange={(e) => setPreference(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-sm text-white [&>option]:bg-zinc-900"
            >
              <option>Fastest Route Home</option>
              <option>Cheapest Route</option>
              <option>Least Crowded Route</option>
              <option>Accessible Route</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-500 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
        >
          {loading ? (
            'Calculating...'
          ) : (
            <>
              <Navigation size={16} /> Get Travel Advice
            </>
          )}
        </button>

        {response?.mode === 'transport' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <h4 className="font-semibold text-green-400 text-xs mb-1">Recommended Mode</h4>
              <div className="text-2xl font-bold">{response.recommended_mode}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 border border-white/10 p-3 rounded-lg">
                <h4 className="text-xs font-medium text-zinc-400 mb-1">Travel Time</h4>
                <div className="font-medium text-white">{response.travel_time}</div>
              </div>
              <div className="bg-white/5 border border-white/10 p-3 rounded-lg">
                <h4 className="text-xs font-medium text-zinc-400 mb-1">Cost Estimate</h4>
                <div className="font-medium text-white">{response.cost_estimate}</div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg">
              <h4 className="text-xs font-semibold text-blue-400 mb-1">Parking & Access Advice</h4>
              <p className="text-sm text-blue-200">{response.parking_advice}</p>
            </div>

            <div className="bg-white/5 p-3 rounded-lg">
              <h4 className="text-xs font-semibold text-zinc-400 mb-1">AI Reasoning</h4>
              <ul className="text-xs text-zinc-500 list-disc pl-4">
                {(Array.isArray(response.reasoning)
                  ? response.reasoning
                  : typeof response.reasoning === 'string'
                    ? [response.reasoning]
                    : []
                ).map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
