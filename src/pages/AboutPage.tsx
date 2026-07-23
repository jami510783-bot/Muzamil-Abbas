import React from 'react';
import { Search, ShieldCheck, Heart, Sparkles, BookOpen, UserCheck, GraduationCap, Code } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* HERO */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold tracking-wide">
            <Search className="w-3.5 h-3.5 text-indigo-600" />
            <span>ABOUT MATHDETECTIVE AI</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            The Philosophy Behind Error Analysis
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            MathDetective AI was created to solve a fundamental challenge in mathematics education: students rarely need an answer generator; they need to know where their reasoning went wrong.
          </p>
        </div>

        {/* SECTION 1: WHAT IT IS & REAL PROBLEM SOLVED */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            What is MathDetective AI?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            MathDetective AI is an interactive mathematics tutor built on Gemini AI models. Unlike traditional calculators or photo-solvers that output final answers, MathDetective AI acts as a solution-error analyst. It breaks down a student's attempted calculation line by line, locates the first incorrect step, explains the misconception, and provides 3 tiers of progressive hints to encourage self-correction.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-red-50 border border-red-100 space-y-2 border-l-4 border-l-red-500">
              <h3 className="text-xs font-bold text-red-700 uppercase tracking-wider">The Real Problem</h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                When a student scores poorly on a test, they often don't know if their error was a simple sign error, a misapplied formula, or an invalid algebraic expansion.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-2 border-l-4 border-l-emerald-500">
              <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">The Solution</h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                By focusing on active error detection, MathDetective AI turns every mistake into an opportunity for deep conceptual learning.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: TARGET AUDIENCE */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            Who MathDetective AI is For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-indigo-600 text-sm block">School Students</span>
              <p className="text-slate-600 leading-relaxed">
                Middle and high school students working through algebra, geometry, quadratic equations, and trigonometry.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-amber-600 text-sm block">College & Exam Prep</span>
              <p className="text-slate-600 leading-relaxed">
                College students preparing for Calculus, Pre-Calculus, SAT, GRE, or university entrance math exams.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-emerald-600 text-sm block">Undergrad & Independent</span>
              <p className="text-slate-600 leading-relaxed">
                Undergraduate mathematics students studying Linear Algebra, Differential Equations, and advanced calculus.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 3: HOW AI IS USED SAFELY */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            How AI is Used Educationally
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            MathDetective AI leverages the Gemini AI model wrapped with strict tutor system instructions. The model is constrained to:
          </p>
          <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside pl-2">
            <li>Never shame or embarrass the student for making mistakes.</li>
            <li>Identify the FIRST logical error without marking valid alternative methods wrong.</li>
            <li>Provide progressive hints (Hint 1: Conceptual, Hint 2: Specific Clue, Hint 3: Direct Nudge).</li>
            <li>Generate similar problems testing the same core concept to prove mastery.</li>
          </ul>
        </div>

        {/* SECTION 4: ABOUT THE CREATOR (PLACEHOLDERS AS REQUESTED) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Code className="w-5 h-5 text-indigo-600" />
            About the Creator
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            [Creator Name / Organization Placeholder] is a passionate developer and educator committed to building intelligent, pedagogy-backed software tools for independent learning.
          </p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <p><span className="font-bold text-slate-900">Role:</span> Lead Educational Engineer & Designer</p>
            <p><span className="font-bold text-slate-900">Mission:</span> Empowering students worldwide through AI-driven error analysis</p>
            <p><span className="font-bold text-slate-900">Contact / Portfolio:</span> [Placeholder Contact Information]</p>
          </div>
        </div>
      </div>
    </div>
  );
};
