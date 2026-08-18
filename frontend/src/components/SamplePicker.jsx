import React from "react";
import { SAMPLE_SNIPPETS } from "../samples";
import { Sparkles, XCircle } from "lucide-react";

export default function SamplePicker({ onSelect, onSelectLanguage }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mr-1">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        <span>Templates:</span>
      </div>
      
      <select
        onChange={(e) => {
          const id = e.target.value;
          const snippet = SAMPLE_SNIPPETS.find((s) => s.id === id);
          if (snippet) {
            onSelect(snippet.code);
            if (onSelectLanguage && snippet.language) {
              onSelectLanguage(snippet.language);
            }
          }
        }}
        className="bg-slate-900 border border-slate-700/70 hover:border-slate-600 text-slate-200 text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
        defaultValue=""
      >
        <option value="" disabled>
          Load an example bug/security snippet...
        </option>
        {SAMPLE_SNIPPETS.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>

      <button
        onClick={() => onSelect("")}
        className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition"
        title="Clear editor"
      >
        <XCircle className="w-3.5 h-3.5" />
        <span>Clear</span>
      </button>
    </div>
  );
}
