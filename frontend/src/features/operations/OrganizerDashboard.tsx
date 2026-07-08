'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  useCrowd,
  useIncidents,
  useVolunteers,
  useTransport,
  useVenue,
} from '@/hooks/useFirestore';
import { getApiUrl } from '@/lib/api';
import { AIAnalysisResponse } from '@/types';
import OperationalBriefingCard from './OperationalBriefingCard';
import RiskMeter from './RiskMeter';
import IncidentTimeline from './IncidentTimeline';
import PredictiveAISection from './PredictiveAISection';
import { Users, AlertTriangle, BriefcaseMedical, ShieldAlert, Bus, Car } from 'lucide-react';

export default function OrganizerDashboard() {
  const { user } = useAuth();
  const { data: crowdData, loading: crowdLoading } = useCrowd();
  const { data: incidentsData } = useIncidents();
  const { data: volunteersData } = useVolunteers();
  const { data: transportData } = useTransport();
  const { data: venueData } = useVenue();

  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResponse | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const fetchAIAnalysis = useCallback(async () => {
    if (analyzing) return;
    setAnalyzing(true);
    const contextData = {
      mode: 'operations',
      crowd: crowdData,
      transport: transportData,
      volunteers: volunteersData,
      incidents: incidentsData,
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
  }, [crowdData, transportData, volunteersData, incidentsData, venueData]);

  // Initial fetch when data is ready
  useEffect(() => {
    if (!crowdLoading && crowdData.length > 0 && !aiAnalysis && !analyzing) {
      queueMicrotask(() => {
        fetchAIAnalysis();
      });
    }
  }, [crowdLoading, crowdData.length, aiAnalysis, analyzing, fetchAIAnalysis]);

  const kpis = useMemo(() => {
    const totalAttendance = crowdData.reduce((acc, curr) => acc + curr.peopleCount, 0);
    const activeIncidents = incidentsData.filter((i) => i.status !== 'Resolved');
    const availableVolunteers = volunteersData.filter((v) => v.availability === 'Available').length;
    const avgQueueTime =
      crowdData.length > 0
        ? Math.round(crowdData.reduce((acc, curr) => acc + curr.queueTime, 0) / crowdData.length)
        : 0;
    return { totalAttendance, activeIncidents, availableVolunteers, avgQueueTime };
  }, [crowdData, incidentsData, volunteersData]);

  const { totalAttendance, activeIncidents, availableVolunteers, avgQueueTime } = kpis;

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-6">
      {/* Top Section: Briefing & Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OperationalBriefingCard
            analysis={aiAnalysis?.mode === 'operations' ? aiAnalysis : null}
            loading={analyzing}
            onRefresh={fetchAIAnalysis}
          />
        </div>
        <div className="lg:col-span-1 h-full">
          <RiskMeter
            score={aiAnalysis?.mode === 'operations' ? aiAnalysis.risk_score : 0}
            loading={analyzing}
          />
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Attendance', value: totalAttendance, icon: Users, color: 'blue' },
          { label: 'Avg Queue Time', value: `${avgQueueTime}m`, icon: Users, color: 'green' },
          {
            label: 'Active Incidents',
            value: activeIncidents.length,
            icon: AlertTriangle,
            color: 'red',
          },
          {
            label: 'Medical Requests',
            value: activeIncidents.filter((i) => i.type === 'Medical').length,
            icon: BriefcaseMedical,
            color: 'orange',
          },
          {
            label: 'Available Vols',
            value: availableVolunteers,
            icon: ShieldAlert,
            color: 'purple',
          },
          {
            label: 'Parking Filling',
            value: transportData.find((t) => t.type === 'Parking')?.occupancy + '%' || 'N/A',
            icon: Car,
            color: 'zinc',
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={`glass-card p-4 rounded-xl border border-${stat.color}-500/20 bg-white/5`}
          >
            <div className={`text-${stat.color}-400 mb-2`}>
              <stat.icon size={20} />
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-zinc-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Bottom Section: Predictive AI & Timelines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PredictiveAISection
            predictions={aiAnalysis?.mode === 'operations' ? aiAnalysis.predicted_problems : []}
            loading={analyzing}
          />
        </div>
        <div className="lg:col-span-1">
          <IncidentTimeline incidents={incidentsData} />
        </div>
      </div>
    </div>
  );
}
