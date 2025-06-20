import { useEffect, useRef, useState } from 'react';
import { useStore } from '../states/store';

function DynamicPanel() {
  const { timerStatus, resultsData } = useStore();
  
  useEffect(() => {
    return () => {
    }
  }, [])
  
  // TODO: draw animation, players count realtime
  return (
    <div className="flex flex-col gap-1 h-full">
      <div className="cont1 bg-slate-900 h-1/4 flex flex-col w-full gap-2 p-2">
        <div className="w-full flex flex-row justify-center items-center gap-2">
        <div className="w-1/2 flex flex-col justify-center items-center">
            <div className="bg-success h-10 w-10 flex items-center justify-center rounded-full border-3 border-slate-700 aspect-square mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
                />
              </svg>
            </div>
            <div className="w-full rounded-t-lg border-t-3 border-solid border-success bg-gradient-to-b from-green-500/20 to-transparent flex flex-col text-sm font-semibold p-2">
              <div className="flex flex-row justify-between">
                <span>Bet</span>
                <span className="flex items-center gap-1">
                  $0
                  <div aria-label="status" className="status status-success animate-pulse"></div>
                </span>
              </div>
              <div className="flex flex-row justify-between">
                <span>Players</span>
                <span>Bet</span>
              </div>
            </div>
          </div>
          <div className="w-1/2 flex flex-col justify-center items-center">
            <div className="bg-secondary h-10 w-10 flex items-center justify-center rounded-full border-3 border-slate-700 aspect-square mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181"
                />
              </svg>
            </div>
            <div className="w-full rounded-t-lg border-t-3 border-solid border-secondary bg-gradient-to-b from-pink-500/20 to-transparent flex flex-col text-sm font-semibold p-2">
              <div className="flex flex-row justify-between">
                <span>Players</span>
                <span className="flex items-center gap-1">
                  0
                  <div aria-label="status" className="status status-secondary animate-pulse"></div>
                </span>
              </div>
              <div className="flex flex-row justify-between">
                <span>Players</span>
                <span>Bet</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="c3 bg-slate-900 h-full flex items-center justify-center">
        {/* Add content here if needed */}
        {(timerStatus =="payout") && <span className={"animate-bounce transition delay-150 duration-300 ease-in-out text-4xl capitalize font-extrabold"}>
          { (resultsData) && (resultsData.result == 'high') ? <span className=' text-green-400 tracking-widest'></span>: <span className=' text-pink-500 tracking-widest'>DOWN</span> }
          </span>}
      </div>
    </div>
  );
}

export default DynamicPanel;