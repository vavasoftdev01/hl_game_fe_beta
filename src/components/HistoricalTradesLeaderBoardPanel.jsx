import { React, useState, useEffect } from 'react';
import OpenPositionTable from './OpenPositionTable';
import HistoricalPositionTable from './HistoricalPositionTable';

function HistoricalTradesLeaderBoardPanel() {
  const [activeTab, setActiveTab] = useState('positions');

  return (
    <div className="w-full flex flex-col bg-slate-800 border border-solid border-slate-700 rounded-lg p-5 fill-white drop-shadow-xl/50 overflow-x-scroll">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab('positions')}
          className={`px-4 py-2 text-slate-400 font-medium focus:outline-none ${
            activeTab === 'positions'
              ? 'border-b-2 border-primary text-white'
              : 'hover:text-gray-300'
          }`}
        >
          Positions
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 text-slate-400 font-medium focus:outline-none ${
            activeTab === 'history'
              ? 'border-b-2 border-primary text-white'
              : 'hover:text-gray-300'
          }`}
        >
          History
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-2 text-slate-400 font-medium focus:outline-none ${
            activeTab === 'leaderboard'
              ? 'border-b-2 border-primary text-white'
              : 'hover:text-gray-300'
          }`}
        >
          LeaderBoard
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-2 bg-transparent">
        {activeTab === 'positions' && (
          <div className="text-white w-full">
            <OpenPositionTable />
          </div>
        )}
        {activeTab === 'history' && (
          <div className="text-white w-full">
            <HistoricalPositionTable /> 
          </div>
        )}
        {activeTab === 'leaderboard' && (
          <div className="text-white">LeaderBoard content</div>
        )}
      </div>
    </div>
  );
}

export default HistoricalTradesLeaderBoardPanel;