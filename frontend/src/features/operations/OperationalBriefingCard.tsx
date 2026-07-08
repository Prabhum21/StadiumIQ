'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, Activity, Info } from 'lucide-react';

interface AnalysisData {
  executive_summary?: string;
  recommended_actions?: string[];
  priority?: string;
  overall_status?: string;
}

interface OperationalBriefingCardProps {
  analysis?: AnalysisData | null;
  loading: boolean;
  onRefresh: () => void;
}

const OperationalBriefingCard: React.FC<OperationalBriefingCardProps> = ({
  analysis,
  loading,
  onRefresh,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 relative overflow-hidden h-full flex flex-col"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

      <div className="flex justify-between items-center mb-6 relative z-10">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Activity className="text-blue-400" />
          AI Operational Briefing
        </h3>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
        >
          <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-400 text-sm animate-pulse">Analyzing live operations data...</p>
        </div>
      ) : analysis ? (
        <div className="flex-1 space-y-6 relative z-10">
          <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl">
            <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
              Executive Summary
            </h4>
            <p className="text-lg font-medium leading-relaxed">{analysis.executive_summary}</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              Recommended Actions
            </h4>
            <ul className="space-y-2">
              {analysis.recommended_actions?.map((action: string, i: number) => (
                <li key={i} className="flex items-start gap-3 bg-white/5 p-3 rounded-lg">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0"></div>
                  <span className="text-sm">{action}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-xl">
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                System Priority
              </h4>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${analysis.priority === 'Critical' ? 'bg-red-500/20 text-red-400' : analysis.priority === 'High' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}
              >
                {analysis.priority}
              </span>
            </div>
            <div className="bg-white/5 p-4 rounded-xl">
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Overall Status
              </h4>
              <span className="text-lg font-bold">{analysis.overall_status}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-zinc-500">
          <p>No analysis generated.</p>
        </div>
      )}
    </motion.div>
  );
};

export default React.memo(OperationalBriefingCard);
