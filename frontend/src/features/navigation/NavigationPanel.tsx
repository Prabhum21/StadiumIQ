'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useVenue, useCrowd, useTransport, useFood } from '@/hooks/useFirestore';
import { motion } from 'framer-motion';
import { getApiUrl } from '@/lib/api';
import { AIAnalysisResponse } from '@/types';
import {
  MapPin,
  Navigation2,
  Accessibility,
  Utensils,
  AlertCircle,
  Clock,
  Users,
} from 'lucide-react';

export default function NavigationPanel({ selectedLocation }: { selectedLocation?: string }) {
  const { user } = useAuth();
  const { data: venues } = useVenue();
  const { data: crowdData } = useCrowd();
  const { data: transportData } = useTransport();
  const { data: foodData } = useFood();

  const [currentLocation, setCurrentLocation] = useState(selectedLocation || 'Gate A');
  const [destination, setDestination] = useState('Section North');
  const [needsAccessibility, setNeedsAccessibility] = useState(false);
  const [needsFood, setNeedsFood] = useState(false);

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Update current location when map is clicked
  if (selectedLocation && selectedLocation !== currentLocation && !loading) {
    setCurrentLocation(selectedLocation);
  }

  const handleNavigate = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    setResponse(null);

    // Build Context
    const contextData = {
      user: user,
      request: {
        currentLocation,
        destination,
        needsAccessibility,
        needsFood,
        time: new Date().toISOString(),
      },
      venue: venues.length > 0 ? venues[0] : null,
      crowd: crowdData,
      transport: transportData,
      food: foodData,
    };

    try {
      const res = await fetch(getApiUrl('/api/decision'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context_data: contextData }),
      });

      if (!res.ok) throw new Error('Failed to fetch navigation data.');

      const data = await res.json();
      setResponse(data.recommendation);
    } catch (err) {
      console.error(err);
      setError('AI Engine is currently unavailable. Please check the backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
        <Navigation2 className="text-blue-400" />
        <h3 className="text-lg font-semibold text-white">AI Navigation</h3>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">
            Current Location (Click map)
          </label>
          <div className="flex items-center bg-black/40 border border-white/10 rounded-lg px-3 py-2">
            <MapPin size={16} className="text-zinc-500 mr-2" />
            <select
              value={currentLocation}
              onChange={(e) => setCurrentLocation(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-sm text-white [&>option]:bg-zinc-900"
            >
              <option value="Gate A">Gate A</option>
              <option value="Gate B">Gate B</option>
              <option value="Gate C">Gate C</option>
              <option value="Gate D">Gate D</option>
              <option value="Medical Room A">Medical Room A</option>
              <option value="Food Court A">Food Court A</option>
              <option value="P1">Parking P1</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Destination</label>
          <div className="flex items-center bg-black/40 border border-white/10 rounded-lg px-3 py-2">
            <MapPin size={16} className="text-blue-400 mr-2" />
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-sm text-white [&>option]:bg-zinc-900"
            >
              <option value="Section North">Seat: Section North</option>
              <option value="Food Court B">Food Court B</option>
              <option value="P2">Parking P2</option>
              <option value="Medical Room B">Medical Room B</option>
              <option value="Exit 1">Exit 1</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-3 py-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={needsAccessibility}
              onChange={() => setNeedsAccessibility(!needsAccessibility)}
              className="form-checkbox bg-black/40 border-white/20 rounded text-blue-500 w-4 h-4"
            />
            <span className="flex items-center gap-2 text-sm text-zinc-300">
              <Accessibility size={16} className="text-purple-400" /> Require Accessible Route
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={needsFood}
              onChange={() => setNeedsFood(!needsFood)}
              className="form-checkbox bg-black/40 border-white/20 rounded text-blue-500 w-4 h-4"
            />
            <span className="flex items-center gap-2 text-sm text-zinc-300">
              <Utensils size={16} className="text-orange-400" /> Find Nearest Food
            </span>
          </label>
        </div>

        <button
          onClick={handleNavigate}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
        >
          {loading ? (
            <span className="animate-pulse">Generating Route...</span>
          ) : (
            <>
              Generate Smart Route <Navigation2 size={16} />
            </>
          )}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {response && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h4 className="font-semibold text-blue-400 text-sm mb-2">Recommended Route</h4>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                {response.recommended_route?.map((step, i) => (
                  <span key={i} className="flex items-center gap-2">
                    <span className="bg-white/10 px-2 py-1 rounded text-white">{step}</span>
                    {i < response.recommended_route!.length - 1 && (
                      <span className="text-zinc-500">→</span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 border border-white/10 p-3 rounded-lg flex flex-col gap-1">
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <Clock size={12} /> Est. Time
                </span>
                <span className="font-medium text-white">{response.estimated_time}</span>
              </div>
              <div className="bg-white/5 border border-white/10 p-3 rounded-lg flex flex-col gap-1">
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <Users size={12} /> Crowd Level
                </span>
                <span
                  className={`font-medium ${response.crowd_level === 'High' ? 'text-red-400' : 'text-green-400'}`}
                >
                  {response.crowd_level}
                </span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
              <h4 className="font-semibold text-zinc-300 text-xs mb-1">AI Reasoning</h4>
              <ul className="text-sm text-zinc-400 leading-relaxed list-disc pl-4">
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

            {response.accessibility_notes && response.accessibility_notes.length > 0 && (
              <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-400 text-xs mb-2">Accessibility Notes</h4>
                <ul className="list-disc pl-4 text-sm text-purple-300 space-y-1">
                  {response.accessibility_notes.map((note, i) => (
                    <li key={i}>{note}</li>
                  ))}
                </ul>
              </div>
            )}

            {response.recommended_food_stop && (
              <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-400 text-xs mb-1">
                  Recommended Food Stop
                </h4>
                <p className="text-sm text-orange-300">{response.recommended_food_stop}</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
