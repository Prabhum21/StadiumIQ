"use client";

import { useState } from "react";
import { addIncident } from "@/services/firestore/incidents";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle } from "lucide-react";

import { Incident } from "@/types";

export default function EmergencyReportForm() {
  const { user } = useAuth();
  
  const [type, setType] = useState<Incident["type"]>("Medical");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState<Incident["priority"]>("Medium");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) return;
    setSubmitting(true);
    
    try {
      await addIncident({
        type,
        location,
        priority,
        description,
        status: "Open",
        reporterRole: user?.role || "Fan",
        timestamp: Date.now()
      });
      setLocation("");
      setDescription("");
      alert("Emergency reported successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to report emergency.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-card p-6">
      <h3 className="font-semibold mb-4 text-red-400 flex items-center gap-2">
        <AlertCircle size={18} /> File Emergency Report
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Emergency Type</label>
          <select value={type} onChange={e => setType(e.target.value as any)} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white [&>option]:bg-zinc-900">
            <option>Medical</option>
            <option>Lost Child</option>
            <option>Security</option>
            <option>Fire</option>
            <option>Crowd Surge</option>
            <option>Suspicious Object</option>
            <option>Accessibility Assistance</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Location</label>
            <input required value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Gate B" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Severity</label>
            <select value={priority} onChange={e => setPriority(e.target.value as any)} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white [&>option]:bg-zinc-900">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Description & Photo Upload</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Details..." className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white min-h-[60px]"></textarea>
          <div className="mt-1 w-full border border-dashed border-white/20 rounded-lg p-2 text-center text-xs text-zinc-500 cursor-pointer hover:bg-white/5 transition-colors">
            📸 Click to upload photo (mock)
          </div>
        </div>

        <button disabled={submitting} type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white font-medium py-2 rounded-lg transition-colors text-sm disabled:opacity-50">
          {submitting ? "Submitting..." : "Report Emergency"}
        </button>
      </form>
    </div>
  );
}
