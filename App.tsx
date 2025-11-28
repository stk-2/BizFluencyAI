import React, { useState } from 'react';
import { UserProfile, View, CEFRLevel } from './types';
import Dashboard from './components/Dashboard';
import Roleplay from './components/Roleplay';
import LevelCheck from './components/LevelCheck';
import LiveConversation from './components/LiveConversation';
import DocumentReview from './components/DocumentReview';
import MultimodalPractice from './components/MultimodalPractice';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.LEVEL_CHECK);
  const [user, setUser] = useState<UserProfile | null>(null);

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

  const renderView = () => {
    if (!user && view !== View.LEVEL_CHECK) return <div>Loading...</div>;

    switch (view) {
      case View.LEVEL_CHECK:
        return <LevelCheck onComplete={handleLevelComplete} />;
      case View.DASHBOARD:
        return <Dashboard user={user!} onChangeView={setView} />;
      case View.ROLEPLAY:
        return <Roleplay user={user!} />;
      case View.LIVE_CONVERSATION:
        return <LiveConversation user={user!} />;
      case View.DOC_REVIEW:
        return <DocumentReview />;
      case View.MULTIMODAL:
        return <MultimodalPractice />;
      default:
        return <Dashboard user={user!} onChangeView={setView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navbar */}
      {view !== View.LEVEL_CHECK && (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center cursor-pointer" onClick={() => setView(View.DASHBOARD)}>
                <span className="bg-indigo-600 text-white p-2 rounded-lg mr-2 font-bold text-xl">BF</span>
                <span className="font-bold text-xl tracking-tight text-slate-800">BizFluency</span>
              </div>
              <div className="flex items-center gap-4">
                {user && (
                    <div className="hidden md:flex items-center gap-2 text-sm">
                        <span className="text-slate-500">Welcome,</span>
                        <span className="font-semibold">{user.name}</span>
                        <span className="bg-slate-100 px-2 py-1 rounded text-xs text-slate-600 border">{user.level}</span>
                    </div>
                )}
                {view !== View.DASHBOARD && (
                    <button 
                        onClick={() => setView(View.DASHBOARD)}
                        className="text-sm font-medium text-slate-600 hover:text-indigo-600"
                    >
                        Back to Dashboard
                    </button>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="py-6">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
