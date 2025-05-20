import { React, useState } from 'react';

function BettingForm() {
  return (
    <div className="flex flex-col gap-2 bg-slate-800 border border-solid border-slate-400 rounded-lg p-5 fill-white drop-shadow-xl/25">
      <div className="gap-2 rounded-md flex flex-row w-full text-sm">
        <div className="input-cont w-full flex flex-col text-slate-400 font-medium">
          <span className="p-1">Up or Down?</span>
          <input type="text" placeholder="Enter amount" className="w-full input input-md bg-transparent border border-solid border-slate-400" />
        </div>
        <div className="flex flex-col text-slate-400 font-medium">
          <span className="p-1 text-shadow-lg">How it works?</span>
          <div className="btn-multi w-full flex flex-row gap-1">
            <button className="btn btn-primary">$5</button>
            <button className="btn btn-primary">$10</button>
            <button className="btn btn-primary">$15</button>
            <button className="btn btn-primary">$25</button>
            <button className="btn btn-primary">$50</button>
          </div>
        </div>
      </div>

      <div className="flex flex-row w-full gap-1">
        <button className="group btn btn-secondary w-1/2 hover:text-white flex flex-row items-center justify-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            fill="none"
            viewBox="0 0 38 38"
            className="detrade-icon size-10 rounded-full p-1.5 text-white pointer-events-none bg-down group-hover:rotate-[-720deg] group-hover:duration-500"
          >
            <path fill="currentColor" fill-opacity="0.75" d="m33.429 14.206-6.464 6.464-5.373-5.375-5.999 5.998L19 24.7H9.5v-9.5l3.407 3.407 8.685-8.685 5.373 5.373 4.702-4.7a15.2 15.2 0 1 0 1.762 3.61zm2.922-2.96.019.02-.008.007A18.9 18.9 0 0 1 38 19c0 10.494-8.506 19-19 19S0 29.494 0 19 8.506 0 19 0c7.733 0 14.383 4.617 17.35 11.246" />
          </svg>
          <span className="text-white">Down</span>
        </button>

        <button className="group btn btn-success w-1/2 hover:text-white flex flex-row items-center justify-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            fill="none"
            viewBox="0 0 38 38"
            className="detrade-icon size-10 rounded-full p-1.5 text-white pointer-events-none bg-up rotate-180 group-hover:rotate-[-525deg] group-hover:duration-500"
          >
            <path fill="currentColor" fill-opacity="0.75" d="m33.429 14.206-6.464 6.464-5.373-5.375-5.999 5.998L19 24.7H9.5v-9.5l3.407 3.407 8.685-8.685 5.373 5.373 4.702-4.7a15.2 15.2 0 1 0 1.762 3.61zm2.922-2.96.019.02-.008.007A18.9 18.9 0 0 1 38 19c0 10.494-8.506 19-19 19S0 29.494 0 19 8.506 0 19 0c7.733 0 14.383 4.617 17.35 11.246" />
          </svg>
          <span className="text-white">Up</span>
        </button>
      </div>
    </div>
  );
}

export default BettingForm;