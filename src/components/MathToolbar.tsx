import React from 'react';
import { Divide, Superscript, Radical, Variable, Infinity, Compass, HelpCircle } from 'lucide-react';

interface MathToolbarProps {
  onInsert: (snippet: string) => void;
  compact?: boolean;
}

export const MathToolbar: React.FC<MathToolbarProps> = ({ onInsert, compact = false }) => {
  const tools = [
    { label: 'Fraction', snippet: '\\frac{a}{b}', icon: 'a/b', title: 'Fraction: \\frac{a}{b}' },
    { label: 'Power', snippet: 'x^{2}', icon: 'x²', title: 'Power: x^{2}' },
    { label: 'Subscript', snippet: 'x_{1}', icon: 'x₁', title: 'Subscript: x_{1}' },
    { label: 'Sqrt', snippet: '\\sqrt{x}', icon: '√x', title: 'Square Root: \\sqrt{x}' },
    { label: 'N-Root', snippet: '\\sqrt[n]{x}', icon: 'ⁿ√x', title: 'Nth Root: \\sqrt[n]{x}' },
    { label: 'Integral', snippet: '\\int f(x) dx', icon: '∫', title: 'Integral: \\int' },
    { label: 'Def. Integral', snippet: '\\int_{a}^{b} f(x) dx', icon: '∫ₐᵇ', title: 'Definite Integral' },
    { label: 'Sum', snippet: '\\sum_{i=1}^{n}', icon: '∑', title: 'Summation: \\sum' },
    { label: 'Limit', snippet: '\\lim_{x \\to 0}', icon: 'lim', title: 'Limit: \\lim_{x \\to 0}' },
    { label: 'Plus-Minus', snippet: '\\pm', icon: '±', title: 'Plus-Minus: \\pm' },
    { label: 'Multiply', snippet: '\\times', icon: '×', title: 'Multiply: \\times' },
    { label: 'Not Equal', snippet: '\\neq', icon: '≠', title: 'Not Equal: \\neq' },
    { label: 'Less/Equal', snippet: '\\le', icon: '≤', title: 'Less or Equal: \\le' },
    { label: 'Greater/Equal', snippet: '\\ge', icon: '≥', title: 'Greater or Equal: \\ge' },
    { label: 'Pi', snippet: '\\pi', icon: 'π', title: 'Pi: \\pi' },
    { label: 'Theta', snippet: '\\theta', icon: 'θ', title: 'Theta: \\theta' },
    { label: 'Infinity', snippet: '\\infty', icon: '∞', title: 'Infinity: \\infty' },
    { label: 'Matrix 2x2', snippet: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}', icon: '[2x2]', title: '2x2 Matrix' },
  ];

  return (
    <div className="bg-slate-100 border border-slate-200 rounded-t-xl p-2 flex flex-wrap items-center gap-1.5 text-xs select-none">
      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1.5 flex items-center gap-1 border-r border-slate-200 pr-2">
        <span>∑</span> LaTeX Symbols
      </span>
      {tools.map((t) => (
        <button
          key={t.label}
          type="button"
          onClick={() => onInsert(t.snippet)}
          title={t.title}
          className="px-2 py-1 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 font-mono text-slate-700 hover:text-indigo-700 text-xs transition-colors shadow-xs active:scale-95 flex items-center gap-1"
        >
          <span className="font-bold">{t.icon}</span>
          {!compact && <span className="text-[10px] text-slate-500 hidden xl:inline">{t.label}</span>}
        </button>
      ))}
    </div>
  );
};
