import React from 'react';
import { UserProfile, View } from '../types';

interface DashboardProps {
  user: UserProfile;
  onChangeView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onChangeView }) => {
  return (
    <div className="p-2 md:p-6 max-w-6xl mx-auto space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase">Current Level</h3>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{user.level}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase">Day Streak</h3>
          <p className="text-3xl font-bold text-amber-500">{user.streak} Days</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase">Lessons Done</h3>
          <p className="text-3xl font-bold text-emerald-500">{user.lessonsCompleted}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase">Badges</h3>
          <div className="flex gap-2 mt-2">
            {user.badges.map((b, i) => (
              <span key={i} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs rounded-full">{b}</span>
            ))}
            {user.badges.length === 0 && <span className="text-gray-400 text-sm">No badges yet</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Practice Modes */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Start Practicing</h2>
          
          <button 
            onClick={() => onChangeView(View.ROLEPLAY)}
            className="w-full group flex items-center justify-between p-4 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">Text Roleplay</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Practice negotiations, emails, and chats.</p>
              </div>
            </div>
            <span className="text-indigo-600 dark:text-indigo-400 font-medium group-hover:translate-x-1 transition-transform">Start &rarr;</span>
          </button>

          <button 
            onClick={() => onChangeView(View.LIVE_CONVERSATION)}
            className="w-full group flex items-center justify-between p-4 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-all"
          >
             <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                </svg>
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">Live Audio Call</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Real-time voice conversation with AI.</p>
              </div>
            </div>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium group-hover:translate-x-1 transition-transform">Call &rarr;</span>
          </button>

          <button 
             onClick={() => onChangeView(View.DOC_REVIEW)}
            className="w-full group flex items-center justify-between p-4 bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-all"
          >
             <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">Document Review</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Perfect your emails and reports.</p>
              </div>
            </div>
            <span className="text-purple-600 dark:text-purple-400 font-medium group-hover:translate-x-1 transition-transform">Review &rarr;</span>
          </button>

          <button 
            onClick={() => onChangeView(View.MULTIMODAL)}
            className="w-full group flex items-center justify-between p-4 bg-white dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-all"
          >
             <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">Image Practice</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Describe charts and presentations.</p>
              </div>
            </div>
            <span className="text-orange-600 dark:text-orange-400 font-medium group-hover:translate-x-1 transition-transform">Practice &rarr;</span>
          </button>
        </div>

        {/* AI Coach Message */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white flex flex-col justify-between shadow-lg">
          <div>
            <h3 className="text-lg font-semibold mb-2 opacity-90">AI Coach Insight</h3>
            <p className="text-lg leading-relaxed">
              "Great work this week, {user.name}. I've noticed you're mastering 'Meeting' vocabulary, but we should work on more diplomatic phrasing for negotiations. Let's try a roleplay scenario next!"
            </p>
          </div>
          <button 
             onClick={() => onChangeView(View.ROLEPLAY)}
             className="mt-6 self-start bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition-colors shadow-lg"
          >
            Start Recommended Lesson
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;