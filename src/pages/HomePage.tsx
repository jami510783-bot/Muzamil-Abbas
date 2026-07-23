import React from 'react';
import { Search, Sparkles, Target, MessageSquareText, ShieldAlert, ArrowRight, Lightbulb, BookOpen, CheckCircle2, AlertTriangle, Cpu, Layers } from 'lucide-react';
import { SAMPLE_CASES } from '../data/sampleCases';
import { SampleCase } from '../types';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
  onSelectSampleCase: (sample: SampleCase) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab, onSelectSampleCase }) => {
  const featuredSample = SAMPLE_CASES[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs text-indigo-700 font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI-POWERED MATHEMATICS SOLUTION-ERROR ANALYST</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-none">
            Don't just find the answer.{' '}
            <span className="block mt-2 text-indigo-600">
              Find your mistake.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            An AI mathematics tutor that analyzes your complete solution attempt, detects the exact step where your reasoning went wrong, and guides you to correct it with progressive hints.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('investigate')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              id="hero-investigate-btn"
            >
              <span>🔎</span> INVESTIGATE MY SOLUTION
            </button>
            <button
              onClick={() => setActiveTab('practice')}
              className="w-full sm:w-auto px-7 py-4 rounded-xl font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all flex items-center justify-center gap-2"
              id="hero-practice-btn"
            >
              <Target className="w-4 h-4 text-indigo-600" />
              TRY A PRACTICE CASE
            </button>
          </div>

          {/* Key Specs Bar */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-left border-t border-slate-100 max-w-4xl mx-auto">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-black">Step-by-Step</p>
              <p className="text-xs font-bold text-slate-800 mt-1">Pinpoints the first error</p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-[10px] uppercase tracking-[0.15em] text-indigo-600 font-black">Hint Mode</p>
              <p className="text-xs font-bold text-slate-800 mt-1">Progressive, non-spoilers</p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-[10px] uppercase tracking-[0.15em] text-emerald-600 font-black">Similar Problem</p>
              <p className="text-xs font-bold text-slate-800 mt-1">Tests concept mastery</p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-[10px] uppercase tracking-[0.15em] text-amber-600 font-black">Teach Me Mode</p>
              <p className="text-xs font-bold text-slate-800 mt-1">Socratic tutor questions</p>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM STATEMENT & REAL-WORLD CONTEXT */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">The Problem We Solve</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Why Traditional Math Solvers Fail Students
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-sm">
              When a student gets a math problem wrong, traditional AI and calculators simply print out the correct solution. But that leaves a critical gap:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-red-200 shadow-sm border-l-8 border-l-red-500 space-y-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xl">
                🚨
              </div>
              <h3 className="text-lg font-bold text-slate-900">Standard Answer Solvers</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                They ignore your attempted solution entirely. You get the correct final answer, but you still don't know if your mistake was a simple sign flip, an invalid algebraic expansion, or a fundamental conceptual misunderstanding.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-indigo-200 shadow-sm border-l-8 border-l-indigo-600 space-y-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xl">
                🔎
              </div>
              <h3 className="text-lg font-bold text-slate-900">MathDetective AI Approach</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We inspect YOUR steps. We analyze your intended method, identify the very first incorrect logical step, explain why it's mathematically invalid, and nudge you with hints to fix it yourself.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (4-STEP WORKFLOW) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Step-by-Step Pedagogy</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">How MathDetective AI Works</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                1
              </div>
              <h4 className="font-bold text-sm text-slate-900">Submit Your Attempt</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Enter your original problem and your line-by-line solution attempt.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-red-500 text-white font-bold text-xs flex items-center justify-center">
                2
              </div>
              <h4 className="font-bold text-sm text-slate-900">Detect First Mistake</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                The AI parses every logical step and highlights the exact step where reasoning failed.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
                3
              </div>
              <h4 className="font-bold text-sm text-slate-900">Progressive Hints</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Use Hint Mode for 3 levels of non-spoiler hints to correct your error independently.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                4
              </div>
              <h4 className="font-bold text-sm text-slate-900">Master Concept</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Generate a similar problem to confirm you've truly mastered the concept.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EXAMPLE INVESTIGATION DEMO CARD */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Interactive Example Case</span>
            <h2 className="text-2xl font-bold text-slate-900">See MathDetective AI in Action</h2>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xl border-l-8 border-l-red-500">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-slate-100 text-slate-600">
                  {featuredSample.topic}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">{featuredSample.title}</h3>
              </div>
              <button
                onClick={() => {
                  onSelectSampleCase(featuredSample);
                  setActiveTab('investigate');
                }}
                className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-100 flex items-center gap-1.5 transition-colors"
              >
                <span>🔎</span> Investigate Case
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Problem</span>
                <p className="font-serif italic text-slate-800 text-sm">
                  {featuredSample.problem}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Student Attempt</span>
                <pre className="font-mono text-xs text-slate-700 whitespace-pre-wrap">
                  {featuredSample.solution}
                </pre>
              </div>
            </div>

            {/* Simulated Detective Finding */}
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-1">
              <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase">
                <span>🚨 MISTAKE DETECTED IN STEP 1</span>
              </div>
              <p className="text-xs text-slate-700">
                When distributing <code className="font-bold text-red-600">-2</code> across <code className="font-bold text-red-600">(2x - 5)</code>, <code className="font-bold text-red-600">-2 × (-5)</code> equals <code className="font-bold text-emerald-600">+10</code>, not <code className="font-bold text-red-600">-10</code>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES LIST */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Complete AI Suite</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Designed for Genuine Learning</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-[#F8FAFC] rounded-3xl border border-slate-200 space-y-3 hover:border-indigo-300 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
                🔎
              </div>
              <h3 className="font-bold text-lg text-slate-900">1. Investigate My Mistake</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Break your complete attempt into logical steps. Locate the very first incorrect line, highlight the mistake, and explain the mathematical reason.
              </p>
            </div>

            <div className="p-6 bg-[#F8FAFC] rounded-3xl border border-slate-200 space-y-3 hover:border-amber-300 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg">
                💡
              </div>
              <h3 className="font-bold text-lg text-slate-900">2. Interactive Hint Mode</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Get 3 tiers of progressive hints (small conceptual nudge, specific clue, strong guide) without spoiling the answer unless requested.
              </p>
            </div>

            <div className="p-6 bg-[#F8FAFC] rounded-3xl border border-slate-200 space-y-3 hover:border-emerald-300 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
                🎯
              </div>
              <h3 className="font-bold text-lg text-slate-900">3. Similar Case Generator</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                After fixing an error, generate a new challenge testing the exact same underlying concept to verify true concept mastery.
              </p>
            </div>

            <div className="p-6 bg-[#F8FAFC] rounded-3xl border border-slate-200 space-y-3 hover:border-cyan-300 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold text-lg">
                💬
              </div>
              <h3 className="font-bold text-lg text-slate-900">4. Teach Me Socratic Tutor</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Converse with a patient AI mathematics tutor that guides you step-by-step with reflective questions instead of giving standard lectures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 text-center bg-[#F8FAFC]">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-slate-900">Ready to Debug Your Math Reasoning?</h2>
          <p className="text-sm text-slate-600">
            Select an education level, paste your math problem and attempt, and let MathDetective AI lead the investigation.
          </p>
          <button
            onClick={() => setActiveTab('investigate')}
            className="px-8 py-4 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 inline-flex items-center gap-2 transition-all"
          >
            <span>🔎</span> START SOLUTION INVESTIGATION
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </section>
    </div>
  );
};
