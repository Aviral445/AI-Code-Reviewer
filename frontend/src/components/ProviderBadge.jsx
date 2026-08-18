import React, { useEffect, useState } from "react";
import { api } from "../api";
import { Zap, Cpu, Server, AlertCircle } from "lucide-react";

export default function ProviderBadge() {
  const [status, setStatus] = useState({ loading: true });

  useEffect(() => {
    let cancelled = false;
    async function fetchStatus() {
      try {
        const { data } = await api.get("/health");
        if (!cancelled) setStatus({ loading: false, ...data });
      } catch (e) {
        if (!cancelled) setStatus({ loading: false, status: "error", error: String(e) });
      }
    }
    fetchStatus();
    const intervalId = setInterval(fetchStatus, 15000);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  if (status.loading) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-400 border border-slate-700/50">
        <span className="w-2 h-2 rounded-full bg-slate-500 animate-pulse"></span>
        Connecting...
      </div>
    );
  }

  if (status.status === "ok") {
    const providerName = (status.provider || "groq").toUpperCase();
    const modelName = status.model || "llama-3.3-70b";

    let icon = <Zap className="w-3.5 h-3.5 text-amber-400" />;
    let badgeColor = "bg-amber-500/10 text-amber-300 border-amber-500/30";

    if (status.provider === "openai") {
      icon = <Cpu className="w-3.5 h-3.5 text-emerald-400" />;
      badgeColor = "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
    } else if (status.provider === "ollama") {
      icon = <Server className="w-3.5 h-3.5 text-indigo-400" />;
      badgeColor = "bg-indigo-500/10 text-indigo-300 border-indigo-500/30";
    }

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium border ${badgeColor} shadow-sm`}
        title={`Backend AI Provider: ${providerName} (${modelName})`}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        {icon}
        <span>
          <strong className="font-semibold">{providerName}</strong>: {modelName}
        </span>
      </div>
    );
  }

  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-300 border border-rose-500/30"
      title={status.error || "Could not reach backend"}
    >
      <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
      <span>Backend Offline</span>
    </div>
  );
}
