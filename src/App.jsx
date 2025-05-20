import { useState, useEffect, Suspense, lazy } from 'react';
import './App.css';

const BBBaselineChart = lazy(() => import('./components/BBBaselineChart'));
const BettingForm = lazy(() => import('./components/BettingForm'));
const DynamicPanel = lazy(() => import('./components/DynamicPanel'));
const HistoricalTradesLeaderBoardPanel = lazy(() =>
  import('./components/HistoricalTradesLeaderBoardPanel')
);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-auto w-full bg-gray-900 p-6 text-gray-100 font-sans drop-shadow-xl/50">
      <h1 className="text-2xl font-bold text-cyan-400 mb-4 hover:text-cyan-300 transition-colors duration-300">
        {/* KBCGAME Trading Dashboard */}
      </h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-[400px]">
          <div className="loading loading-dots w-20 text-purple-600"></div>
        </div>
      ) : (
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-[400px]">
              <div className="loading loading-dots w-20 text-purple-600"></div>
            </div>
          }
        >
          <div className="flex flex-col gap-1 max-h-[100%] max-w-[1680px] mx-auto">
            <div className="flex flex-row gap-1">
              <div className="w-2/3 flex flex-col border border-solid border-slate-700 rounded-tl-lg rounded-bl-lg h-full">
                <BBBaselineChart height={500} />
                <div className="w-full p-5 bg-slate-900 h-1/4">
                  <BettingForm />
                </div>
              </div>
              <div className="w-1/3 bg-slate-800 border border-solid border-slate-700 rounded-tr-lg">
                <DynamicPanel />
              </div>
            </div>
            <div className="bg-slate-900 border border-solid border-slate-700 rounded-b-lg p-6 flex justify-between overflow-auto min-h-[400px]">
              <HistoricalTradesLeaderBoardPanel />
            </div>
          </div>
        </Suspense>
      )}
    </div>
  );
};

export default App;