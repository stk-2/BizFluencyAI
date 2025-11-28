import React, { useState, useRef } from 'react';
import { describeBusinessImage } from '../services/geminiService';

const MultimodalPractice: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // remove data:image/xxx;base64, prefix for API
        const base64Data = base64.split(',')[1];
        setImage(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const finalPrompt = prompt || "Describe this chart/image in professional business English. Explain the key trends or information presented.";
      const res = await describeBusinessImage(image, finalPrompt);
      setResponse(res || 'No analysis returned.');
    } catch (e) {
      console.error(e);
      setResponse('Error analyzing image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Visual Description Practice</h2>
        <p className="text-slate-500">Upload a chart, graph, or slide and practice explaining it in English.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-8 bg-slate-50">
          {image ? (
            <div className="relative">
               <img src={`data:image/jpeg;base64,${image}`} alt="Preview" className="max-h-64 rounded-lg shadow-md" />
               <button onClick={() => setImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
            </div>
          ) : (
            <div className="text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-slate-400 mb-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <p className="text-indigo-600 font-medium hover:underline">Click to upload image</p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
        </div>

        <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Specific Question (Optional)</label>
            <input 
                type="text" 
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="e.g. How do I explain the Q3 sales drop?"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
        </div>

        <button 
            onClick={handleAnalyze}
            disabled={!image || loading}
            className="w-full mt-6 bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 disabled:opacity-50 transition-colors"
        >
            {loading ? 'Analyzing...' : 'Generate Explanation Model'}
        </button>
      </div>

      {response && (
        <div className="bg-orange-50 border border-orange-100 p-6 rounded-xl">
            <h3 className="font-bold text-orange-900 mb-2">Model Description:</h3>
            <p className="whitespace-pre-wrap text-slate-800 leading-relaxed">{response}</p>
        </div>
      )}
    </div>
  );
};

export default MultimodalPractice;
