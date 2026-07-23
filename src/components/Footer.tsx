import React from 'react';
import { Search, ShieldCheck, Heart, Sparkles, HelpCircle, GraduationCap } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <>
      <footer className="bg-white text-slate-600 border-t border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-base">
                🔎
              </div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">MathDetective <span className="text-indigo-600">AI</span></span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              The AI mathematics tutor built to identify where your reasoning went wrong, guide you with progressive hints, and help you master mathematical concepts.
            </p>
            <div className="flex items-center gap-2 text-xs text-indigo-700 font-semibold bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              Pedagogy-First Mistake Analysis
            </div>
          </div>

          {/* Quick Features */}
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Core AI Modes</h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <button onClick={() => setActiveTab('investigate')} className="hover:text-indigo-600 transition-colors flex items-center gap-1.5 text-slate-600">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Investigate My Mistake
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('investigate')} className="hover:text-indigo-600 transition-colors flex items-center gap-1.5 text-slate-600">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                  Interactive Hint System
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('practice')} className="hover:text-indigo-600 transition-colors flex items-center gap-1.5 text-slate-600">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                  Similar Case Generator
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('teachme')} className="hover:text-indigo-600 transition-colors flex items-center gap-1.5 text-slate-600">
                  <Search className="w-3.5 h-3.5 text-cyan-600" />
                  Teach Me Socratic Tutor
                </button>
              </li>
            </ul>
          </div>

          {/* Target Audiences */}
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Supported Levels</h3>
            <ul className="space-y-2 text-xs text-slate-500 font-medium">
              <li>• Middle & High School Mathematics</li>
              <li>• College Pre-Calculus & Calculus</li>
              <li>• Undergraduate Linear Algebra & Diff Eq</li>
              <li>• STEM Exam Preparation</li>
              <li>• Self-Directed Independent Learners</li>
            </ul>
          </div>

          {/* Pedagogical Principle */}
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Educational Philosophy</h3>
            <blockquote className="text-xs italic text-slate-700 border-l-2 border-indigo-600 pl-3 py-1 space-y-1">
              "Making mistakes is a natural step in learning math. The key is understanding why it happened so you never repeat it."
            </blockquote>
            <p className="text-[11px] text-slate-500 mt-3">
              MathDetective AI emphasizes active problem solving over direct answers.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 MathDetective AI. Empowering students through intelligent mistake analysis.</p>
          <div className="flex items-center gap-4 font-medium">
            <button onClick={() => setActiveTab('about')} className="hover:text-indigo-600 transition-colors">
              About the App
            </button>
            <button onClick={() => setActiveTab('investigate')} className="hover:text-indigo-600 transition-colors">
              Start Investigation
            </button>
          </div>
        </div>
      </footer>

      {/* Bottom Status Bar */}
      <div className="h-8 bg-slate-900 flex items-center justify-between px-6 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
        <div className="flex items-center gap-4">
          <span>Session: Active</span>
          <span className="text-emerald-400">● AI Online</span>
        </div>
        <div>
          © 2026 MathDetective AI Labs — Learning from Every Step
        </div>
      </div>
    </>
  );
};
