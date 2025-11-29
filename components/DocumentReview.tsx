
import React, { useState } from 'react';
import { reviewBusinessDocument } from '../services/geminiService';

interface DocumentReviewProps {
  model: string;
  apiKey: string;
}

const DocumentReview: React.FC<DocumentReviewProps> = ({ model, apiKey }) => {
  const [text, setText] = useState('');
  const [docType, setDocType] = useState('Email');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const review = await reviewBusinessDocument(text, docType, model, apiKey);
      setResult(review || 'Could not generate review.');
    } catch (e) {
      console.error(e);
      setResult('Error processing document.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-120px)]">
      {/* Input Section */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Draft Your Document</h2>
            <select 
                value={docType} 
                onChange={e => setDocType(e.target.value)}
                className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1 text-sm outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
            >
                <option value="Email">Email</option>
                <option value="Report">Report</option>
                <option value="Presentation Script">Presentation Script</option>
                <option value="Proposal">Proposal</option>
            </select>
        </div>
        <textarea
          className="flex-1 w-full p-4 border border-slate-200 dark:border-slate-600 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm font-mono text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          placeholder="Paste your draft here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={handleReview}
          disabled={loading || !text}
          className="bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
        >
          {loading ? 'Reviewing...' : 'Review with AI'}
        </button>
      </div>

      {/* Output Section */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 overflow-y-auto shadow-inner transition-colors">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">AI Suggestions</h2>
        {result ? (
            <div className="prose prose-indigo dark:prose-invert prose-sm max-w-none">
                {/* Simple Markdown Rendering */}
                {result.split('\n').map((line, i) => {
                    if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mb-2 text-indigo-900 dark:text-indigo-300">{line.replace('# ', '')}</h1>;
                    if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-4 mb-2 text-indigo-800 dark:text-indigo-400">{line.replace('## ', '')}</h2>;
                    if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold mt-3 mb-1 text-slate-800 dark:text-slate-200">{line.replace('### ', '')}</h3>;
                    if (line.startsWith('* ') || line.startsWith('- ')) return <li key={i} className="ml-4 list-disc text-slate-700 dark:text-slate-300">{line.replace(/^[\*-] /, '')}</li>;
                    return <p key={i} className="mb-2 text-slate-600 dark:text-slate-400 leading-relaxed">{line}</p>;
                })}
            </div>
        ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-2 opacity-50">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <p>Output will appear here</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default DocumentReview;
