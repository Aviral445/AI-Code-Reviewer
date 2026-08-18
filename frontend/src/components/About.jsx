import React, { useState } from "react";
import { Info, ChevronDown, ChevronUp, ShieldCheck, Zap, Bot } from "lucide-react";

export default function About() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full mt-8 border-t border-slate-800/80 pt-6">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 transition"
      >
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Info className="w-4 h-4 text-indigo-400" />
          <span>How AI Code Reviewer Works</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <span>{open ? "Collapse" : "Learn More"}</span>
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {open && (
        <div className="mt-3 p-5 bg-slate-900/40 border border-slate-800/60 rounded-xl text-xs leading-relaxed text-slate-300 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/50">
            <div className="flex items-center gap-2 mb-2 font-semibold text-indigo-300">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Groq LPU Acceleration</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Powered by Groq's low-latency inference engine (<code className="text-slate-200">llama-3.3-70b-versatile</code>) to deliver comprehensive code evaluations in milliseconds.
            </p>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/50">
            <div className="flex items-center gap-2 mb-2 font-semibold text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Dual Static Linters</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Runs <code className="text-slate-200">pylint</code> and <code className="text-slate-200">bandit</code> static analysis on Python code for vulnerability and syntax detection.
            </p>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/50">
            <div className="flex items-center gap-2 mb-2 font-semibold text-purple-300">
              <Bot className="w-4 h-4 text-purple-400" />
              <span>Structured Feedback</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Generates formatted executive summaries, security vulnerability lists, performance optimizations, and ready-to-use refactored code.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
