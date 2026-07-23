import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Lightbulb, 
  BookOpen, 
  ArrowRight, 
  RefreshCw, 
  HelpCircle, 
  Target, 
  ShieldCheck, 
  FileText,
  ChevronDown,
  Layers,
  GraduationCap
} from 'lucide-react';
import { 
  Topic, 
  EducationLevel, 
  DifficultyLevel, 
  InvestigationResult, 
  SampleCase,
  SimilarProblemResponse,
  CheckSolutionResult
} from '../types';
import { SAMPLE_CASES } from '../data/sampleCases';
import { MathMarkdown } from '../components/MathMarkdown';
import { MathToolbar } from '../components/MathToolbar';

interface InvestigatePageProps {
  initialSample?: SampleCase | null;
}

export const InvestigatePage: React.FC<InvestigatePageProps> = ({ initialSample }) => {
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [topic, setTopic] = useState<Topic>('Auto Detect Topic');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('School');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Intermediate');

  const problemRef = useRef<HTMLTextAreaElement>(null);
  const solutionRef = useRef<HTMLTextAreaElement>(null);

  const insertAtCursor = (
    ref: React.RefObject<HTMLTextAreaElement>,
    currentVal: string,
    setter: (val: string) => void,
    snippet: string
  ) => {
    const textarea = ref.current;
    if (!textarea) {
      setter(currentVal + snippet);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = currentVal.substring(0, start) + snippet + currentVal.substring(end);
    setter(newValue);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + snippet.length, start + snippet.length);
    }, 0);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InvestigationResult | null>(null);

  // Hint Mode State
  const [revealedHintLevel, setRevealedHintLevel] = useState<number>(0); // 0=none, 1=level1, 2=level2, 3=level3
  const [showFullSolution, setShowFullSolution] = useState(false);

  // Fix My Mistake Verification State
  const [isFixModeOpen, setIsFixModeOpen] = useState(false);
  const [revisedSolution, setRevisedSolution] = useState('');
  const [isCheckingFix, setIsCheckingFix] = useState(false);
  const [fixCheckResult, setFixCheckResult] = useState<CheckSolutionResult | null>(null);

  // Similar Case Generator State
  const [isGeneratingSimilar, setIsGeneratingSimilar] = useState(false);
  const [similarProblem, setSimilarProblem] = useState<SimilarProblemResponse | null>(null);
  const [similarStudentAttempt, setSimilarStudentAttempt] = useState('');
  const [isCheckingSimilar, setIsCheckingSimilar] = useState(false);
  const [similarCheckResult, setSimilarCheckResult] = useState<CheckSolutionResult | null>(null);

  // Pre-populate initial sample if passed from home
  useEffect(() => {
    if (initialSample) {
      loadSample(initialSample);
    }
  }, [initialSample]);

  const loadSample = (sample: SampleCase) => {
    setProblem(sample.problem);
    setSolution(sample.solution);
    setTopic(sample.topic);
    setEducationLevel(sample.educationLevel);
    setDifficulty(sample.difficulty);
    setResult(null);
    setRevealedHintLevel(0);
    setShowFullSolution(false);
    setSimilarProblem(null);
    setFixCheckResult(null);
    setIsFixModeOpen(false);
    setError(null);
  };

  const handleInvestigate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!problem.trim()) {
      setError('Please enter a mathematics problem.');
      return;
    }
    if (!solution.trim()) {
      setError('Please enter your attempted solution.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setRevealedHintLevel(0);
    setShowFullSolution(false);
    setSimilarProblem(null);
    setFixCheckResult(null);
    setIsFixModeOpen(false);

    try {
      const res = await fetch('/api/investigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem,
          solution,
          topic,
          educationLevel,
          difficulty,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze solution.');
      }

      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while communicating with MathDetective AI.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSimilar = async () => {
    if (!problem || !result) return;
    setIsGeneratingSimilar(true);
    setSimilarCheckResult(null);
    setSimilarStudentAttempt('');

    try {
      const res = await fetch('/api/similar-problem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalProblem: problem,
          conceptTitle: result.conceptToReview?.title,
          topic: result.detectedTopic || topic,
          educationLevel,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not generate similar problem');
      setSimilarProblem(data);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to generate similar problem.');
    } finally {
      setIsGeneratingSimilar(false);
    }
  };

  const handleCheckFixAttempt = async () => {
    if (!revisedSolution.trim()) return;
    setIsCheckingFix(true);
    try {
      const res = await fetch('/api/check-solution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem,
          studentSolution: revisedSolution,
          expectedConcept: result?.conceptToReview?.title || 'General accuracy',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFixCheckResult(data);
    } catch (err: any) {
      alert(err.message || 'Error checking fix.');
    } finally {
      setIsCheckingFix(false);
    }
  };

  const handleCheckSimilarSolution = async () => {
    if (!similarStudentAttempt.trim() || !similarProblem) return;
    setIsCheckingSimilar(true);
    try {
      const res = await fetch('/api/check-solution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem: similarProblem.newProblem,
          studentSolution: similarStudentAttempt,
          expectedConcept: similarProblem.originalConcept,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSimilarCheckResult(data);
    } catch (err: any) {
      alert(err.message || 'Error checking solution.');
    } finally {
      setIsCheckingSimilar(false);
    }
  };

  const topicOptions: Topic[] = [
    'Auto Detect Topic',
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
    'Other',
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* HEADER TITLE */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold tracking-wide">
            <span>🔎</span>
            <span>AI SOLUTION INVESTIGATION DESK</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Investigate My Solution
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Paste your problem and line-by-line solution attempt. MathDetective AI will inspect your steps and pinpoint where your reasoning went wrong.
          </p>
        </div>

        {/* SAMPLE CASES QUICK LOAD BAR */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-600" />
              Quick Sample Cases
            </span>
            <span className="text-[11px] font-semibold text-slate-400">Click any sample to auto-fill</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_CASES.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => loadSample(sample)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-xs font-medium text-slate-700 hover:text-indigo-700 transition-all text-left"
              >
                <span className="font-bold text-slate-900">{sample.topic}:</span> {sample.title.split(':')[1] || sample.title}
              </button>
            ))}
          </div>
        </div>

        {/* INPUT FORM */}
        <form onSubmit={handleInvestigate} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm" id="investigation-form">
          {/* Metadata Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-2 border-b border-slate-100">
            {/* Topic Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                Mathematics Topic
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value as Topic)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                id="topic-selector"
              >
                {topicOptions.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Education Level Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
                Education Level
              </label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                id="education-level-selector"
              >
                <option value="School">School Level</option>
                <option value="College">College Level</option>
                <option value="Undergraduate">Undergraduate Level</option>
              </select>
            </div>

            {/* Difficulty Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-emerald-600" />
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                id="difficulty-selector"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Problem & Solution Input Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Problem Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  1. Mathematics Problem
                </label>
                <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                  LaTeX Toolbar Enabled
                </span>
              </div>
              <div className="rounded-2xl border border-slate-300 overflow-hidden bg-white shadow-xs focus-within:ring-2 focus-within:ring-indigo-500">
                <MathToolbar onInsert={(snippet) => insertAtCursor(problemRef, problem, setProblem, snippet)} compact />
                <textarea
                  ref={problemRef}
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="e.g. Solve for x: 3(x - 4) - 2(2x - 5) = 11 or \frac{d}{dx}(x^2)"
                  rows={5}
                  className="w-full bg-slate-50 border-t border-slate-200 p-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none font-mono leading-relaxed"
                  id="problem-input"
                />
              </div>
              {problem.trim() && (
                <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-1">
                  <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider block">Live Math Preview:</span>
                  <div className="text-xs text-slate-900 font-medium">
                    <MathMarkdown content={problem} />
                  </div>
                </div>
              )}
            </div>

            {/* Solution Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  2. Your Attempted Solution
                </label>
                <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                  LaTeX Toolbar Enabled
                </span>
              </div>
              <div className="rounded-2xl border border-slate-300 overflow-hidden bg-white shadow-xs focus-within:ring-2 focus-within:ring-indigo-500">
                <MathToolbar onInsert={(snippet) => insertAtCursor(solutionRef, solution, setSolution, snippet)} compact />
                <textarea
                  ref={solutionRef}
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  placeholder={`Step 1: 3x - 12 - 4x - 10 = 11\nStep 2: -x - 22 = 11\nStep 3: -x = 33\nStep 4: x = -33`}
                  rows={5}
                  className="w-full bg-slate-50 border-t border-slate-200 p-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none font-mono leading-relaxed"
                  id="solution-input"
                />
              </div>
              {solution.trim() && (
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 space-y-1">
                  <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">Live Math Preview:</span>
                  <div className="text-xs text-slate-900 font-medium">
                    <MathMarkdown content={solution} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              id="submit-investigate-btn"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  Investigating Steps...
                </>
              ) : (
                <>
                  <span>🔎</span>
                  INVESTIGATE MY SOLUTION
                </>
              )}
            </button>
          </div>
        </form>

        {/* LOADING ANIMATION STATE */}
        {isLoading && (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
              <Search className="w-8 h-8 text-indigo-600 absolute inset-0 m-auto" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">MathDetective is Analyzing Your Attempt</h3>
              <p className="text-xs text-slate-500 mt-1">
                Parsing solution lines • Verifying algebraic rules • Identifying first logical mistake
              </p>
            </div>
          </div>
        )}

        {/* RESULTS CASE REPORT */}
        {result && (
          <div className="space-y-6" id="investigation-results">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-md">
              {/* STATUS HEADER BANNER */}
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                result.isSolutionCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}>
                <div className="flex items-center gap-3">
                  {result.isSolutionCorrect ? (
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xl">
                      ✓
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 font-bold text-xl">
                      🚨
                    </div>
                  )}
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      {result.isSolutionCorrect ? 'Solution is Completely Correct!' : 'Mistake Detected in Solution'}
                    </h2>
                    <p className="text-xs text-slate-600">
                      Topic Identified: <span className="font-bold text-indigo-600">{result.detectedTopic}</span>
                    </p>
                  </div>
                </div>

                {!result.isSolutionCorrect && result.mistakeDetails && (
                  <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-100 text-red-700 border border-red-200">
                    Error in Step {result.mistakeDetails.stepNumber}
                  </span>
                )}
              </div>

              {/* 🔎 CASE SUMMARY */}
              <div className="space-y-3 border-b border-slate-100 pb-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Search className="w-4 h-4 text-indigo-600" />
                  CASE SUMMARY
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Problem Statement</span>
                    <MathMarkdown content={result.caseSummary.problemStatement} />
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Student Approach Summary</span>
                    <MathMarkdown content={result.caseSummary.studentApproachSummary} />
                  </div>
                </div>
              </div>

              {/* STEP BREAKDOWN INVENTORY */}
              {result.stepsBreakdown && result.stepsBreakdown.length > 0 && (
                <div className="space-y-3 border-b border-slate-100 pb-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    Solution Line Inventory
                  </h3>
                  <div className="space-y-2">
                    {result.stepsBreakdown.map((step) => (
                      <div
                        key={step.stepNumber}
                        className={`p-3.5 rounded-xl border text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                          step.isCorrect
                            ? 'bg-slate-50 border-slate-200 text-slate-700'
                            : 'bg-red-50 border-red-200 text-red-900 ring-1 ring-red-400/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                            step.isCorrect ? 'bg-slate-200 text-slate-800' : 'bg-red-600 text-white'
                          }`}>
                            Step {step.stepNumber}
                          </span>
                          <div>
                            <p className="font-mono text-slate-900 text-xs font-semibold">{step.content}</p>
                            {step.explanation && (
                              <p className="text-[11px] text-slate-500 mt-1">{step.explanation}</p>
                            )}
                          </div>
                        </div>
                        <span className={`text-[11px] font-bold shrink-0 ${
                          step.isCorrect ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {step.isCorrect ? '✓ Valid Step' : '✕ First Incorrect Step'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 🚨 MISTAKE DETAILS (IF ANY) */}
              {!result.isSolutionCorrect && result.mistakeDetails && (
                <div className="p-6 rounded-2xl bg-red-50 border border-red-200 space-y-3 border-l-8 border-l-red-500">
                  <h3 className="text-xs font-black text-red-600 uppercase tracking-[0.2em] flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    FIRST MISTAKE DETECTED
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-white p-4 rounded-xl border border-red-200 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-red-500">Step {result.mistakeDetails.stepNumber} Line</span>
                      <p className="font-mono text-slate-900 text-xs font-bold">{result.mistakeDetails.incorrectStepContent}</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-red-200 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-red-500">What Went Wrong</span>
                      <MathMarkdown content={result.mistakeDetails.whatWentWrong} />
                    </div>
                  </div>
                </div>
              )}

              {/* 🧠 CONCEPT TO REVIEW */}
              {result.conceptToReview && (
                <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2 border-l-8 border-l-indigo-600">
                  <h3 className="text-xs font-black text-indigo-700 uppercase tracking-[0.2em] flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    CONCEPT TO REVIEW: {result.conceptToReview.title}
                  </h3>
                  <MathMarkdown content={result.conceptToReview.explanation} className="text-xs text-indigo-900" />
                </div>
              )}

              {/* FEATURE 2: HINT MODE */}
              {!result.isSolutionCorrect && result.hints && (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-xs font-black text-amber-600 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      DETECTIVE HINT MODE
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-500">Progressive hints without spoiling solution</span>
                  </div>

                  {/* Hint Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setRevealedHintLevel((prev) => Math.max(prev, 1))}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        revealedHintLevel >= 1
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-white text-slate-700 hover:text-amber-700 border border-slate-200 hover:border-amber-300'
                      }`}
                      id="hint-btn-1"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      Give Me a Hint
                    </button>

                    <button
                      type="button"
                      onClick={() => setRevealedHintLevel((prev) => Math.max(prev, 2))}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        revealedHintLevel >= 2
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-white text-slate-700 hover:text-amber-700 border border-slate-200 hover:border-amber-300'
                      }`}
                      id="hint-btn-2"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Stronger Hint
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsFixModeOpen(!isFixModeOpen);
                        setRevisedSolution('');
                        setFixCheckResult(null);
                      }}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1.5 transition-all"
                      id="fix-mistake-toggle-btn"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      I Fixed My Mistake
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowFullSolution(!showFullSolution)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 hover:text-slate-900 border border-slate-200 flex items-center gap-1.5 transition-all"
                      id="show-full-solution-btn"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      {showFullSolution ? 'Hide Solution' : 'Show Full Solution'}
                    </button>
                  </div>

                  {/* Revealed Hints */}
                  {revealedHintLevel >= 1 && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1 text-xs animate-fadeIn text-amber-900">
                      <span className="font-bold text-amber-700 uppercase text-[10px]">Hint 1 (Conceptual)</span>
                      <MathMarkdown content={result.hints.level1} />
                    </div>
                  )}

                  {revealedHintLevel >= 2 && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1 text-xs animate-fadeIn text-amber-900">
                      <span className="font-bold text-amber-700 uppercase text-[10px]">Hint 2 (Specific Clue)</span>
                      <MathMarkdown content={result.hints.level2} />
                    </div>
                  )}

                  {revealedHintLevel >= 3 && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1 text-xs animate-fadeIn text-amber-900">
                      <span className="font-bold text-amber-700 uppercase text-[10px]">Hint 3 (Direct Guidance)</span>
                      <MathMarkdown content={result.hints.level3} />
                    </div>
                  )}

                  {/* Show Full Solution Box */}
                  {showFullSolution && (
                    <div className="p-5 rounded-xl bg-white border border-indigo-200 space-y-2 animate-fadeIn">
                      <span className="font-bold text-indigo-700 uppercase tracking-wider text-xs block">
                        Full Reference Solution
                      </span>
                      <MathMarkdown content={result.fullStepByStepSolution} className="text-xs" />
                    </div>
                  )}
                </div>
              )}

              {/* FIX MY MISTAKE VERIFICATION DRAWER */}
              {isFixModeOpen && (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-4 animate-fadeIn">
                  <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Test Your Revised Solution
                  </h4>
                  <p className="text-xs text-slate-600">
                    Enter your corrected calculation step(s) below. MathDetective AI will verify if you successfully fixed the mistake!
                  </p>
                  <textarea
                    value={revisedSolution}
                    onChange={(e) => setRevisedSolution(e.target.value)}
                    placeholder="Enter your corrected solution steps..."
                    rows={4}
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    id="revised-solution-input"
                  />
                  <button
                    onClick={handleCheckFixAttempt}
                    disabled={isCheckingFix}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center gap-2 shadow-sm"
                    id="check-revised-solution-btn"
                  >
                    {isCheckingFix ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Verifying Fix...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verify My Correction
                      </>
                    )}
                  </button>

                  {/* Fix Check Feedback */}
                  {fixCheckResult && (
                    <div className={`p-4 rounded-xl border text-xs space-y-2 ${
                      fixCheckResult.isCorrect
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                        : 'bg-red-100 border-red-300 text-red-900'
                    }`}>
                      <div className="font-bold flex items-center gap-2">
                        {fixCheckResult.isCorrect ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Correct! Mistake Fixed!</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            <span>Keep Refining Your Solution</span>
                          </>
                        )}
                      </div>
                      <MathMarkdown content={fixCheckResult.feedback} />
                      <p className="text-[11px] opacity-90 italic">{fixCheckResult.encouragement}</p>
                    </div>
                  )}
                </div>
              )}

              {/* ➡️ TRY AGAIN / NEXT STEP */}
              {result.tryAgainNextStep && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block">➡️ TRY AGAIN: NEXT STEP</span>
                  <MathMarkdown content={result.tryAgainNextStep} className="text-xs" />
                </div>
              )}

              {/* FEATURE 3: CREATE SIMILAR PROBLEM */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Target className="w-4 h-4 text-emerald-600" />
                      Master Concept with a Similar Case
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Generate a brand new problem testing the exact same mathematical concept to prove mastery.
                    </p>
                  </div>

                  <button
                    onClick={handleGenerateSimilar}
                    disabled={isGeneratingSimilar}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-100 disabled:opacity-50 transition-all flex items-center gap-2 shrink-0"
                    id="generate-similar-btn"
                  >
                    {isGeneratingSimilar ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                        Generating Case...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                        Create Similar Problem
                      </>
                    )}
                  </button>
                </div>

                {/* SIMILAR PROBLEM DISPLAY */}
                {similarProblem && (
                  <div className="p-6 rounded-3xl bg-slate-50 border border-emerald-200 space-y-6 animate-fadeIn border-l-8 border-l-emerald-500" id="similar-problem-card">
                    <div className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                        <Target className="w-4 h-4" />
                        CONCEPT PRACTICE: {similarProblem.originalConcept}
                      </span>
                      <div className="p-4 rounded-xl bg-white border border-slate-200 text-sm font-mono text-slate-800">
                        <MathMarkdown content={similarProblem.newProblem} />
                      </div>
                    </div>

                    {/* Solve Similar Problem Input */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-700 block">
                        Enter Your Solution for the Similar Problem:
                      </label>
                      <textarea
                        value={similarStudentAttempt}
                        onChange={(e) => setSimilarStudentAttempt(e.target.value)}
                        placeholder="Write your step-by-step solution here..."
                        rows={4}
                        className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                        id="similar-attempt-input"
                      />
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <p className="text-[11px] text-slate-500 italic">
                          💡 Hint: {similarProblem.hintForNewProblem}
                        </p>
                        <button
                          onClick={handleCheckSimilarSolution}
                          disabled={isCheckingSimilar || !similarStudentAttempt.trim()}
                          className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center gap-1.5 shadow-sm"
                          id="check-similar-btn"
                        >
                          {isCheckingSimilar ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              Checking...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Check My Solution
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Similar Check Result */}
                    {similarCheckResult && (
                      <div className={`p-4 rounded-xl border text-xs space-y-2 ${
                        similarCheckResult.conceptMastered
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                          : 'bg-amber-100 border-amber-300 text-amber-900'
                      }`}>
                        <div className="font-bold flex items-center gap-2 text-sm">
                          {similarCheckResult.conceptMastered ? (
                            <>
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                              <span>CONCEPT MASTERED!</span>
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-5 h-5 text-amber-600" />
                              <span>Keep Practicing</span>
                            </>
                          )}
                        </div>
                        <MathMarkdown content={similarCheckResult.feedback} />
                        <p className="text-[11px] opacity-90 italic">{similarCheckResult.encouragement}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
