'use client';

import { motion } from 'framer-motion';
import { AlertCircle, Clock } from 'lucide-react';

export default function PredictiveAISection({
  predictions,
  loading,
}: {
  predictions: string[];
  loading: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 h-full"
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-purple-500/20 rounded-lg">
          <Clock className="text-purple-400" size={20} />
        </div>
        <h3 className="text-lg font-semibold">Predictive AI (Next 30 Mins)</h3>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : predictions && predictions.length > 0 ? (
        <div className="space-y-4">
          {predictions.map((pred, i) => (
            <div
              key={i}
              className="flex gap-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl"
            >
              <AlertCircle className="text-purple-400 shrink-0 mt-0.5" size={18} />
              <p className="text-sm font-medium text-purple-100">{pred}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center text-zinc-500 border border-dashed border-white/10 rounded-xl">
          No imminent operational risks predicted.
        </div>
      )}
    </motion.div>
  );
}
