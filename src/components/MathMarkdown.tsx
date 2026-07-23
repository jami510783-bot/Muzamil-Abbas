import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface MathMarkdownProps {
  content: string;
  className?: string;
}

export const MathMarkdown: React.FC<MathMarkdownProps> = ({ content, className = '' }) => {
  return (
    <div className={`prose prose-slate max-w-none text-slate-800 leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {content || ''}
      </ReactMarkdown>
    </div>
  );
};
