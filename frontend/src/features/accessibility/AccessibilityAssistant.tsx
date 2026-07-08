'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useVenue, useCrowd } from '@/hooks/useFirestore';
import { getApiUrl } from '@/lib/api';
import { AIAnalysisResponse } from '@/types';
import {
  Accessibility,
  MapPin,
  Navigation2,
  AlertTriangle,
  Eye,
  Ear,
  Baby,
  ShieldPlus,
} from 'lucide-react';

/**
 * AccessibilityAssistant provides tailored AI recommendations for fans with specific accessibility needs.
 * @param selectedLocation Optional initial location
 */
export default function AccessibilityAssistant({
  selectedLocation,
}: {
  selectedLocation?: string;
}) {
  const { data: venues } = useVenue();
  const { data: crowdData } = useCrowd();

  const [currentLocation, setCurrentLocation] = useState(selectedLocation || 'Gate A');
  const [destination, setDestination] = useState('Section North');

  // Accessibility Profile
  const [needsWheelchair, setNeedsWheelchair] = useState(false);
  const [needsVisual, setNeedsVisual] = useState(false);
  const [needsHearing, setNeedsHearing] = useState(false);
  const [needsStroller, setNeedsStroller] = useState(false);

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIAnalysisResponse | null>(null);

  if (selectedLocation && selectedLocation !== currentLocation && !loading) {
    setCurrentLocation(selectedLocation);
  }

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const activeVenue = useMemo(() => {
    return venues && venues.length > 0 ? venues[0] : null;
  }, [venues]);

  const handleGenerate = useCallback(async () => {
    if (loading) return; // Prevent duplicate requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setResponse(null);

    const contextData = {
      mode: 'accessibility',
      profile: {
        wheelchair: needsWheelchair,
        visualImpairment: needsVisual,
        hearingImpairment: needsHearing,
        stroller: needsStroller,
      },
      request: { currentLocation, destination },
      venue: activeVenue,
      crowd: crowdData,
      time: new Date().toISOString(),
    };

    try {
      const res = await fetch(getApiUrl('/api/decision'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context_data: contextData }),
        signal: abortControllerRef.current.signal,
      });
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setResponse(data.recommendation);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Fetch aborted gracefully
      } else {
        console.error('Error generating accessible route:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [
    loading,
    needsWheelchair,
    needsVisual,
    needsHearing,
    needsStroller,
    currentLocation,
    destination,
    activeVenue,
    crowdData,
  ]);

  return (
    <div className="flex flex-col h-full bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
        <ShieldPlus className="text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Accessibility Intelligence</h3>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">From</label>
            <div className="flex items-center bg-black/40 border border-white/10 rounded-lg px-3 py-2">
              <MapPin size={16} className="text-zinc-500 mr-2 shrink-0" />
              <input
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-sm text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">To</label>
            <div className="flex items-center bg-black/40 border border-white/10 rounded-lg px-3 py-2">
              <MapPin size={16} className="text-purple-400 mr-2 shrink-0" />
              <input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-sm text-white"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-2 mt-2">
            Accessibility Profile
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label
              className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors border ${needsWheelchair ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-zinc-400'}`}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={needsWheelchair}
                onChange={() => setNeedsWheelchair(!needsWheelchair)}
              />
              <Accessibility size={16} /> <span className="text-xs font-medium">Wheelchair</span>
            </label>
            <label
              className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors border ${needsVisual ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-zinc-400'}`}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={needsVisual}
                onChange={() => setNeedsVisual(!needsVisual)}
              />
              <Eye size={16} /> <span className="text-xs font-medium">Visual</span>
            </label>
            <label
              className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors border ${needsHearing ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-zinc-400'}`}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={needsHearing}
                onChange={() => setNeedsHearing(!needsHearing)}
              />
              <Ear size={16} /> <span className="text-xs font-medium">Hearing</span>
            </label>
            <label
              className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors border ${needsStroller ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-zinc-400'}`}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={needsStroller}
                onChange={() => setNeedsStroller(!needsStroller)}
              />
              <Baby size={16} /> <span className="text-xs font-medium">Stroller</span>
            </label>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
        >
          {loading ? (
            'Analyzing Routes...'
          ) : (
            <>
              <Navigation2 size={16} /> Generate Accessible Route
            </>
          )}
        </button>

        {response?.mode === 'accessibility' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <h4 className="font-semibold text-purple-400 text-xs mb-2">
                Safe Route ({response.estimated_time})
              </h4>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                {response.recommended_route?.map((step: string, i: number) => (
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
              <div className="bg-white/5 border border-white/10 p-3 rounded-lg">
                <h4 className="text-xs font-medium text-zinc-400 mb-1">Facilities Available</h4>
                <ul className="text-sm text-green-400 list-disc pl-4">
                  {response.accessible_facilities?.map((f: string, i: number) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/5 border border-white/10 p-3 rounded-lg">
                <h4 className="text-xs font-medium text-zinc-400 mb-1">Rest Areas</h4>
                <ul className="text-sm text-blue-400 list-disc pl-4">
                  {response.rest_areas?.map((r: string, i: number) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>

            {response.warnings && response.warnings.length > 0 && (
              <div className="bg-orange-500/10 border border-orange-500/20 p-3 rounded-lg">
                <h4 className="text-xs font-semibold text-orange-400 flex items-center gap-1 mb-1">
                  <AlertTriangle size={14} /> Warnings
                </h4>
                <ul className="text-sm text-orange-300 list-disc pl-4">
                  {response.warnings.map((w: string, i: number) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

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
