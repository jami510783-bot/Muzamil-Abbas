import React, { useState, useRef } from 'react';
import { Target, Sparkles, RefreshCw, CheckCircle2, AlertTriangle, Layers, GraduationCap, Lightbulb, ArrowRight } from 'lucide-react';
import { Topic, DifficultyLevel, EducationLevel, CheckSolutionResult } from '../types';
import { MathMarkdown } from '../components/MathMarkdown';
import { MathToolbar } from '../components/MathToolbar';

export const PracticePage: React.FC = () => {
  const [topic, setTopic] = useState<Topic>('Algebra');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Intermediate');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('School');

  const attemptRef = useRef<HTMLTextAreaElement>(null);

  const insertAtCursor = (snippet: string) => {
    const textarea = attemptRef.current;
    if (!textarea) {
      setStudentAttempt((prev) => prev + snippet);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = studentAttempt.substring(0, start) + snippet + studentAttempt.substring(end);
    setStudentAttempt(newValue);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + snippet.length, start + snippet.length);
    }, 0);
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentProblem, setCurrentProblem] = useState<{
    title: string;
    problem: string;
    hint: string;
    solution: string;
  } | null>(null);

  const [studentAttempt, setStudentAttempt] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<CheckSolutionResult | null>(null);
  const [showHint, setShowHint] = useState(false);

  const handleGenerateProblem = async () => {
    setIsGenerating(true);
    setCheckResult(null);
    setStudentAttempt('');
    setShowHint(false);

    try {
      const res = await fetch('/api/generate-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          difficulty,
          educationLevel,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate practice problem');
      setCurrentProblem(data);
    } catch (err: any) {
      alert(err.message || 'Error generating problem.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCheckSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentAttempt.trim() || !currentProblem) return;

    setIsChecking(true);
    setCheckResult(null);

    try {
      const res = await fetch('/api/check-solution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem: currentProblem.problem,
          studentSolution: studentAttempt,
          expectedConcept: topic,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error checking solution.');
      setCheckResult(data);
    } catch (err: any) {
      alert(err.message || 'Failed to check solution.');
    } finally {
      setIsChecking(false);
    }
  };

  const topicsList: Topic[] = [
    'Algebra',
    'Equations',
    'Functions',
    'Geometry',
    'Trigonometry',
    'Calculus',
    'Differential Equations',
    'Linear Algebra',
    'Probability',
    'Statistics',
    'Complex Numbers',
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold tracking-wide">
            <Target className="w-3.5 h-3.5 text-emerald-600" />
            <span>TARGETED CONCEPT PRACTICE STUDIO</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Practice Case Center
          </h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Pick a topic and difficulty level. MathDetective AI will generate custom math challenges and verify your reasoning step-by-step.
          </p>
        </div>

        {/* TOPIC & DIFFICULTY CONTROLS */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm" id="practice-controls">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                Select Topic
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value as Topic)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                id="practice-topic-select"
              >
                {topicsList.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
                Education Level
              </label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="School">School</option>
                <option value="College">College</option>
                <option value="Undergraduate">Undergraduate</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-emerald-600" />
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              onClick={handleGenerateProblem}
              disabled={isGenerating}
              className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-100 disabled:opacity-50 transition-all flex items-center gap-2"
              id="generate-practice-problem-btn"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  Generating Case...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  Generate AI Practice Problem
                </>
              )}
            </button>
          </div>
        </div>

        {/* ACTIVE PRACTICE PROBLEM CARD */}
        {currentProblem ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-md animate-fadeIn" id="practice-problem-card">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                  {topic} • {difficulty}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{currentProblem.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="px-3.5 py-2 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                {showHint ? 'Hide Hint' : 'Need a Hint?'}
              </button>
            </div>

            {/* Problem Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-mono text-slate-900">
              <MathMarkdown content={currentProblem.problem} />
            </div>

            {/* Hint Box */}
            {showHint && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1 animate-fadeIn">
                <span className="font-bold text-amber-700 uppercase text-[10px]">Detective Hint</span>
                <MathMarkdown content={currentProblem.hint} />
              </div>
            )}

            {/* Solution Input Form */}
            <form onSubmit={handleCheckSolution} className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                  Enter Your Step-by-Step Solution:
                </label>
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  LaTeX Toolbar Enabled
                </span>
              </div>

              <div className="rounded-2xl border border-slate-300 overflow-hidden bg-white shadow-xs focus-within:ring-2 focus-within:ring-emerald-500">
                <MathToolbar onInsert={insertAtCursor} compact />
                <textarea
                  ref={attemptRef}
                  value={studentAttempt}
                  onChange={(e) => setStudentAttempt(e.target.value)}
                  placeholder={`Step 1: ...\nStep 2: ...\nFinal Answer: ...`}
                  rows={5}
                  className="w-full bg-slate-50 border-t border-slate-200 p-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none font-mono leading-relaxed"
                  id="practice-solution-input"
                />
              </div>

              {studentAttempt.trim() && (
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Live Math Preview:</span>
                  <div className="text-xs text-slate-900 font-medium">
                    <MathMarkdown content={studentAttempt} />
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isChecking || !studentAttempt.trim()}
                  className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center gap-2 shadow-sm"
                  id="check-practice-btn"
                >
                  {isChecking ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      Checking Solution...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      Check My Solution
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* CHECK RESULT BANNER */}
            {checkResult && (
              <div className={`p-5 rounded-2xl border text-xs space-y-3 ${
                checkResult.conceptMastered
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`} id="practice-check-result">
                <div className="flex items-center gap-2 font-bold text-sm">
                  {checkResult.conceptMastered ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>CONCEPT MASTERED!</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <span>KEEP PRACTICING</span>
                    </>
                  )}
                </div>

                <MathMarkdown content={checkResult.feedback} />
                <p className="text-[11px] opacity-90 italic border-t border-slate-200/80 pt-2">
                  {checkResult.encouragement}
                </p>
              </div>
            )}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Problem Active</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Select your topic and difficulty above, then click "Generate AI Practice Problem" to begin!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
