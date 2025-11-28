import React, { useState } from 'react';
import { CEFRLevel } from '../types';
import { assessUserLevel } from '../services/geminiService';

interface LevelCheckProps {
  onComplete: (level: CEFRLevel, name: string, industry: string) => void;
}

const LevelCheck: React.FC<LevelCheckProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [intro, setIntro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !industry || !intro) return;
    
    setLoading(true);
    const level = await assessUserLevel(intro);
    setLoading(false);
    onComplete(level, name, industry);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg border border-slate-100 mt-10">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome to BizFluency</h2>
      <p className="text-slate-600 mb-8">Let's set up your profile and assess your starting level.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
          <input 
            type="text" 
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Kenji Tanaka"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
          <select 
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            required
          >
            <option value="">Select an industry...</option>
            <option value="IT / Tech">IT / Tech</option>
            <option value="Finance">Finance</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Retail">Retail</option>
            <option value="General">General Business</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Short Introduction (English)
          </label>
          <p className="text-xs text-slate-500 mb-2">
            Introduce yourself, your job role, and your goals for learning business English. 
            (Write at least 3-4 sentences for better accuracy).
          </p>
          <textarea 
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-32"
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            placeholder="Hi, my name is... I work as a project manager..."
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Start Learning'}
        </button>
      </form>
    </div>
  );
};

export default LevelCheck;
