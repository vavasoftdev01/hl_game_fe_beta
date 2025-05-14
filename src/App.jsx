import { useState, useEffect, Suspense, lazy } from 'react';
import './App.css';
import BBBaselineChart from './components/BBBaselineChart';

// Lazy-load the BaselineChart component
const BaselineChart = lazy(() => import('./components/BaselineChart'));

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-gray-100 font-sans">
      <h1 className="text-2xl font-bold text-cyan-400 mb-4 hover:text-cyan-300 transition-colors duration-300">
        {/* Integrated Line Chart */}
      </h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
        </div>
      ) : (
        <Suspense fallback={
          <div className="flex justify-center items-center h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
          </div>
        }>
          {/* <BaselineChart height={800} className="chart-container" /> */}
          <div className="w-full">
            <BBBaselineChart height={500}/>
          </div>
          
        </Suspense>
      )}
    </div>
  );
};

export default App;