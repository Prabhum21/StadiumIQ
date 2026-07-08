"use client";

import { motion } from "framer-motion";

export default function RiskMeter({ score, loading }: { score: number, loading: boolean }) {
  const getRiskColor = () => {
    if (score < 30) return "text-green-400";
    if (score < 60) return "text-yellow-400";
    if (score < 80) return "text-orange-400";
    return "text-red-400";
  };

  const getRiskBg = () => {
    if (score < 30) return "bg-green-500";
    if (score < 60) return "bg-yellow-500";
    if (score < 80) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 h-full flex flex-col items-center justify-center relative overflow-hidden"
    >
      <h3 className="absolute top-6 left-6 font-semibold">AI Risk Score</h3>
      
      {loading ? (
        <div className="w-12 h-12 border-4 border-zinc-600 border-t-zinc-400 rounded-full animate-spin"></div>
      ) : (
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Outer ring */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="8" 
              strokeDasharray="282.7" 
              strokeDashoffset={282.7 - (282.7 * score) / 100} 
              className={`transition-all duration-1000 ease-out ${getRiskColor()}`} 
              strokeLinecap="round"
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-5xl font-black ${getRiskColor()}`}>{score}</span>
            <span className="text-xs text-zinc-400 mt-1 uppercase tracking-wider">Out of 100</span>
          </div>
        </div>
      )}

      <div className="absolute bottom-6 w-full px-8">
        <div className="flex justify-between text-xs font-medium text-zinc-500">
          <span>0</span>
          <span>Optimal</span>
          <span>100</span>
        </div>
        <div className="w-full h-1.5 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full mt-2 opacity-50"></div>
      </div>
    </motion.div>
  );
}
