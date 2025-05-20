import { useState, useEffect, Suspense, lazy } from 'react';
import './App.css';
import BBBaselineChart from './components/BBBaselineChart';
import BettingForm from './components/BettingForm';
import DynamicPanel from './components/DynamicPanel';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-dvh w-full bg-gray-900 p-6 text-gray-100 font-sans">
      <h1 className="text-2xl font-bold text-cyan-400 mb-4 hover:text-cyan-300 transition-colors duration-300">
        {/* KBCGAME Trading Dashboard */}
      </h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
        </div>
      ) : (
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
            </div>
          }
        >
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-1">
              <div className="w-2/3 flex flex-col bg-slate-800 border border-solid border-slate-700 rounded-tl-lg rounded-bl-lg">
                <BBBaselineChart height={500} />
                <div className="w-full p-5 bg-slate-900">
                  <BettingForm />
                </div>
              </div>
              <div className="w-1/3 bg-slate-800 border border-solid border-slate-700 rounded-tr-lg">
                <DynamicPanel />
              </div>
            </div>
            <div className="bg-slate-800 border border-solid border-slate-700 rounded-b-lg p-6 flex justify-between">
            </div>
          </div>
        </Suspense>
      )}
    </div>
  );
};

export default App;