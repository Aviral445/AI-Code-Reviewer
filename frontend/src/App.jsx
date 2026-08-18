import React, { useState } from "react";
import { api } from "./api";
import SamplePicker from "./components/SamplePicker";
import ProviderBadge from "./components/ProviderBadge";
import About from "./components/About";
import { 
  Code2, 
  Play, 
  Copy, 
  Check, 
  Trash2, 
  Terminal, 
  Sparkles, 
  AlertTriangle, 
  Github, 
  FileCode2,
  Layers,
  Wand2,
  CheckCircle2,
  FileCheck
} from "lucide-react";

const SUPPORTED_LANGUAGES = [
  { value: "auto", label: "Auto Detect" },
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "sql", label: "SQL" },
];

export default function App() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("auto");
  const [review, setReview] = useState("");
  const [fixedCode, setFixedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);
  const [copiedFix, setCopiedFix] = useState(false);
  const [appliedFix, setAppliedFix] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("report"); // 'report' | 'fixed'

  const handleReview = async () => {
    if (!code.trim()) {
      setErrorMsg("Please provide some code before requesting a review.");
      return;
    }

    setLoading(true);
    setReview("");
    setFixedCode("");
    setErrorMsg("");
    setAppliedFix(false);

    try {
      const { data } = await api.post("/review", { 
        code,
        language 
      });

      if (data?.error) {
        setErrorMsg(data.error);
      } else {
        setReview(data.review || "No review content returned.");
        setFixedCode(data.fixed_code || "");
      }
    } catch (err) {
      if (err?.response) {
        const { status, data } = err.response;
        setErrorMsg(`Server Error (${status}): ${data?.error || "Review failed on the backend."}`);
      } else {
        setErrorMsg("Failed to connect to backend (http://localhost:8000). Please ensure uvicorn is running.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleReview();
    }
  };

  const handleCopy = async (text, setter) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2000);
    } catch (e) {
      console.error("Clipboard copy failed", e);
    }
  };

  const handleApplyFix = () => {
    if (!fixedCode) return;
    setCode(fixedCode);
    setAppliedFix(true);
    setTimeout(() => setAppliedFix(false), 2500);
  };

  const lineCount = code ? code.split("\n").length : 0;
  const charCount = code.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur sticky top-0 z-20 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Code2 className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white">AI Code Reviewer & Auto-Fixer</h1>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded font-semibold">
                v2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Static linter checks & Groq-powered AI code analysis and automated fixes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ProviderBadge />
          <a
            href="https://github.com/Aviral445/AI-Code-Reviewer"
            target="_blank"
            rel="noreferrer"
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition"
            title="View on GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/70 border border-slate-800/80 p-3.5 rounded-2xl shadow-sm">
          <SamplePicker 
            onSelect={(snippet) => {
              setCode(snippet);
              setErrorMsg("");
              setAppliedFix(false);
            }}
            onSelectLanguage={(lang) => setLanguage(lang)}
          />

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-lg">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value} className="bg-slate-900 text-slate-200">
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleReview}
              disabled={loading}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-lg transition ${
                loading
                  ? "bg-indigo-600/50 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-500 active:scale-95 shadow-indigo-600/25"
              }`}
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Reviewing with Groq...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Review & Fix Code</span>
                  <span className="text-[10px] opacity-60 ml-1 hidden md:inline font-mono">⌘↵</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
            <div className="flex-1">{errorMsg}</div>
          </div>
        )}

        {/* Dual Pane Grid: Editor & Review Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Column: Code Editor */}
          <div className="flex flex-col bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2 font-mono">
                <FileCode2 className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-slate-300 font-medium">Input Source Code</span>
                {appliedFix && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Fixed code applied!
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span>{lineCount} lines</span>
                <span>•</span>
                <span>{charCount} chars</span>
                {code && (
                  <button
                    onClick={() => {
                      setCode("");
                      setAppliedFix(false);
                    }}
                    className="hover:text-rose-400 ml-2 transition"
                    title="Clear editor"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="relative">
              <textarea
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (errorMsg) setErrorMsg("");
                  setAppliedFix(false);
                }}
                onKeyDown={handleKeyDown}
                placeholder={`// Paste your Python, JavaScript, TypeScript, or other code here...\n// Press Ctrl+Enter (or Cmd+Enter) to run analysis and generate fixes`}
                className="w-full h-[480px] p-4 bg-slate-950 font-mono text-xs text-slate-200 resize-none focus:outline-none placeholder:text-slate-600 leading-relaxed"
                spellCheck="false"
              />
            </div>
          </div>

          {/* Right Column: Review & Fix Results */}
          <div className="flex flex-col bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl min-h-[525px]">
            <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab("report")}
                  className={`px-3 py-1 rounded-lg font-medium transition flex items-center gap-1.5 ${
                    activeTab === "report"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200 bg-slate-800/50"
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Full Report</span>
                </button>

                {fixedCode && (
                  <button
                    onClick={() => setActiveTab("fixed")}
                    className={`px-3 py-1 rounded-lg font-medium transition flex items-center gap-1.5 ${
                      activeTab === "fixed"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-200 bg-slate-800/50"
                    }`}
                  >
                    <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Fixed Code</span>
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                {fixedCode && (
                  <button
                    onClick={handleApplyFix}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition text-[11px] font-medium"
                    title="Apply fixed code to the editor on the left"
                  >
                    <FileCheck className="w-3 h-3" />
                    <span>Apply Fix</span>
                  </button>
                )}

                {activeTab === "report" && review && (
                  <button
                    onClick={() => handleCopy(review, setCopiedReport)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition text-[11px]"
                  >
                    {copiedReport ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-300">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Report</span>
                      </>
                    )}
                  </button>
                )}

                {activeTab === "fixed" && fixedCode && (
                  <button
                    onClick={() => handleCopy(fixedCode, setCopiedFix)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition text-[11px]"
                  >
                    {copiedFix ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-300">Copied Code!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="p-4 flex-1 overflow-y-auto max-h-[480px]">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center gap-3 py-20 text-slate-500">
                  <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin"></div>
                  <p className="text-xs font-mono animate-pulse text-indigo-300">
                    Running static analysis, detecting flaws & generating fix...
                  </p>
                </div>
              ) : review ? (
                activeTab === "report" ? (
                  <div className="text-xs leading-relaxed space-y-3 font-sans">
                    <pre className="whitespace-pre-wrap font-mono text-[11.5px] p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 text-slate-200 overflow-x-auto leading-normal">
                      {review}
                    </pre>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300">
                      <div className="flex items-center gap-2">
                        <Wand2 className="w-4 h-4 text-emerald-400" />
                        <span>Refactored & verified replacement code:</span>
                      </div>
                      <button
                        onClick={handleApplyFix}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition"
                      >
                        Apply to Editor ➔
                      </button>
                    </div>
                    <pre className="whitespace-pre-wrap font-mono text-[11.5px] p-4 bg-slate-950 rounded-xl border border-slate-800/80 text-emerald-300 overflow-x-auto leading-normal">
                      {fixedCode}
                    </pre>
                  </div>
                )
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-24 px-4 text-slate-600">
                  <Sparkles className="w-8 h-8 mb-3 text-slate-700" />
                  <p className="text-xs font-medium text-slate-400">Ready for review & automated fix</p>
                  <p className="text-[11px] text-slate-600 mt-1 max-w-xs">
                    Paste your code or select a template, then click <strong>Review & Fix Code</strong>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Informational Accordion Footer */}
        <About />
      </main>
    </div>
  );
}
