import { React, useState } from 'react';

function BettingForm() {
  return (
    <div className="flex flex-col gap-2 bg-slate-900 border border-solid border-slate-400 rounded-lg p-5">

        <div className=" gap-2 rounded-md flex flex-row w-full text-sm">
            <div className="input-cont w-full flex flex-col text-slate-400 font-medium">
                <span className="p-1">Up or Down?</span>
                <input type="text" placeholder="Enter amount" className="w-full input input-md" />
            </div>
            <div className="flex flex-col text-slate-400 font-medium">
                <span className="p-1">How it works?</span>
                <div className="btn-multi w-full flex flex-row gap-1">
                    <button className="btn btn-outline btn-primary">$5</button>
                    <button className="btn btn-outline btn-primary">$10</button>
                    <button className="btn btn-outline btn-primary">$15</button>
                    <button className="btn btn-outline btn-primary">$25</button>
                    <button className="btn btn-outline btn-primary">$50</button>
                </div>
            </div>
        </div>

        <div className="flex flex-row w-full gap-1">
            <button className="group btn btn-outline btn-secondary w-1/2 hover:text-white">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.0}
                    stroke="currentColor"
                    className="size-6 group-hover:rotate-[360deg] group-hover:duration-500"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181"
                    />
                </svg>
                Down
            </button>

            <button className="group btn btn-outline btn-success w-1/2 hover:text-white">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.0}
                    stroke="currentColor"
                    className="size-6 group-hover:rotate-[360deg] group-hover:duration-500"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
                    />
                </svg>
                Up
            </button>
        </div>
    </div>
  );
}

export default BettingForm;