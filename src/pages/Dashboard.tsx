import React from 'react';

export default function Dashboard() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h3 className="text-lg font-semibold text-slate-300">Pending Tasks</h3>
          <p className="text-4xl font-bold text-blue-400 mt-2">0</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h3 className="text-lg font-semibold text-slate-300">Documents Analyzed</h3>
          <p className="text-4xl font-bold text-purple-400 mt-2">0</p>
        </div>
      </div>
    </div>
  );
}
