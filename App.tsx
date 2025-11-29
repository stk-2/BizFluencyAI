
import React, { useState, useEffect } from 'react';
import { UserProfile, View, CEFRLevel, AppSettings } from './types';
import Dashboard from './components/Dashboard';
import Roleplay from './components/Roleplay';
import LevelCheck from './components/LevelCheck';
import LiveConversation from './components/LiveConversation';
import DocumentReview from './components/DocumentReview';
import MultimodalPractice from './components/MultimodalPractice';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.LEVEL_CHECK);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Model Settings
  const [settings, setSettings] = useState<AppSettings>({
    textModel: 'gemini-2.5-flash',
    visionModel: 'gemini-2.5-flash-image',
    apiKey: ''
  });

  const handleLevelComplete = (level: CEFRLevel, name: string, industry: string) => {
    setUser({
      name,
      level,
      industry,
      streak: 1,
      lessonsCompleted: 0,
      badges: []
    });
    setView(View.DASHBOARD);
  };

  // Toggle Dark Mode class on the root element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const renderView = () => {
    if (!user && view !== View.LEVEL_CHECK) return <div className="dark:text-white">Loading...</div>;

    switch (view) {
      case View.LEVEL_CHECK:
        return <LevelCheck onComplete={handleLevelComplete} model={settings.textModel} apiKey={settings.apiKey} />;
      case View.DASHBOARD:
        return <Dashboard user={user!} onChangeView={setView} />;
      case View.ROLEPLAY:
        return <Roleplay user={user!} model={settings.textModel} apiKey={settings.apiKey} />;
      case View.LIVE_CONVERSATION:
        return <LiveConversation user={user!} apiKey={settings.apiKey} />;
      case View.DOC_REVIEW:
        return <DocumentReview model={settings.textModel} apiKey={settings.apiKey} />;
      case View.MULTIMODAL:
        return <MultimodalPractice model={settings.visionModel} apiKey={settings.apiKey} />;
      default:
        return <Dashboard user={user!} onChangeView={setView} />;
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Navbar */}
      <nav className={`border-b sticky top-0 z-50 transition-colors duration-300 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setView(user ? View.DASHBOARD : View.LEVEL_CHECK)}>
              <span className="bg-indigo-600 text-white p-2 rounded-lg mr-2 font-bold text-xl shadow-lg">BF</span>
              <span className={`font-bold text-xl tracking-tight ${darkMode ? 'text-white' : 'text-slate-800'}`}>BizFluency</span>
            </div>
            
            <div className="flex items-center gap-4">
              {user && (
                  <div className="hidden md:flex items-center gap-2 text-sm">
                      <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Welcome,</span>
                      <span className="font-semibold">{user.name}</span>
                      <span className={`px-2 py-1 rounded text-xs border ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                        {user.level}
                      </span>
                  </div>
              )}

              {/* Theme Toggle */}
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-slate-800 text-yellow-400' : 'hover:bg-slate-100 text-slate-600'}`}
                title="Toggle Dark Mode"
              >
                {darkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                  </svg>
                )}
              </button>

              {/* Settings Toggle */}
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-600'}`}
                title="Settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md p-6 rounded-2xl shadow-2xl ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'}`}>
             <div className="flex justify-between items-center mb-6">
               <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>App Settings</h3>
               <button onClick={() => setShowSettings(false)} className="text-slate-500 hover:text-slate-700">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
             </div>
             
             <div className="space-y-6">
               <div>
                  <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Text Model</label>
                  <select 
                    value={settings.textModel}
                    onChange={(e) => setSettings({...settings, textModel: e.target.value})}
                    className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'} outline-none focus:ring-2 focus:ring-indigo-500`}
                  >
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash (Fast & Efficient)</option>
                    <option value="gemini-3-pro-preview">Gemini 3.0 Pro (Complex Reasoning)</option>
                  </select>
               </div>

                <div>
                  <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Vision Model</label>
                  <select 
                    value={settings.visionModel}
                    onChange={(e) => setSettings({...settings, visionModel: e.target.value})}
                    className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'} outline-none focus:ring-2 focus:ring-indigo-500`}
                  >
                    <option value="gemini-2.5-flash-image">Gemini 2.5 Flash Image</option>
                    <option value="gemini-3-pro-image-preview">Gemini 3.0 Pro Image</option>
                  </select>
               </div>

               <div>
                 <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>API Key (Optional)</label>
                 <input
                   type="password"
                   value={settings.apiKey}
                   onChange={(e) => setSettings({...settings, apiKey: e.target.value})}
                   placeholder="Use default (env) or enter custom key"
                   className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'} outline-none focus:ring-2 focus:ring-indigo-500`}
                 />
                 <p className="text-xs mt-2 text-slate-500">Leave empty to use the system default key. Required if using high-rate limits or specific models not in the free tier.</p>
               </div>
             </div>

             <button 
               onClick={() => setShowSettings(false)}
               className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
             >
               Save Settings
             </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="py-6 px-4">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
