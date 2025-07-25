import { useEffect, useRef, useState } from 'react';
import { useStore } from '../states/store';
import CountUp from 'react-countup';
import HLBackendV1Api from '../utils/http/api';


function DynamicPanel() {
  const { timerStatus, resultsData, currentUpBets, currentDownBets, totalUpBets, totalDownBets,  currentUpWager, currentDownWager, currentRound } = useStore();
  const winningUp = useRef(0);
  const winningDown = useRef(0);
  const totalUpBetsRef = useRef(0);
  const totalDownBetsRef = useRef(0);
  const currentUpBetsCountRef = useRef(0);
  const currentDownBetsCountRef = useRef(0);
  
  useEffect(() => {
    // console.log(`up bets: ${currentUpBets}`)
    // console.log('=====')
    // console.log(`down bets: ${currentDownBets}`)
    
    return () => {
    }
  }, [currentUpBets, currentDownBets, totalUpBets, totalDownBets]);

  useEffect(() => {
    let assumedUpWinnings = 0;
    let assumedDownWinnings = 0;
    
    if(timerStatus == "draw") {
      let upRate = currentUpWager / 100;
      assumedUpWinnings = totalUpBets * upRate
      winningUp.current = totalUpBets * upRate;
      totalUpBetsRef.current = +totalUpBets;

      let downRate = currentDownWager / 100;
      assumedDownWinnings = totalUpBets * downRate
      winningDown.current = totalUpBets * downRate;
      totalDownBetsRef.current = +totalDownBets;

      currentUpBetsCountRef.current = currentUpBets.length;
      currentDownBetsCountRef.current = currentDownBets.length;
    }
  }, [timerStatus]);

  const fetchUserResult = async () => {
    try {
      await HLBackendV1Api
      .post(`${process.env.BACKEND_API_URL}/betting-management/get-user-result`, { _id: currentRound.id })
        .then((response) => {
          console.log(response.data)
        })
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  
  // TODO: draw animation, players count realtime
  return (
    <div className="flex flex-col gap-1 h-full">
      <div className="cont1 bg-slate-900 h-1/4 flex flex-col w-full gap-2 p-2">
        <div className="w-full flex flex-row justify-center items-center gap-2">
        <div className="w-1/2 flex flex-col justify-center items-center">
            <div className="bg-success h-10 w-10 flex items-center justify-center rounded-full border-3 border-slate-700 aspect-square mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <div className="w-full rounded-t-lg border-t-3 border-solid border-success bg-gradient-to-b from-green-500/20 to-transparent flex flex-col text-sm font-semibold p-2">
              <div className="flex flex-row justify-between">
                <span>Bet</span>
                <span className="flex items-center gap-1">
                  ₩&nbsp;<CountUp end={ totalUpBets }/>
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
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <div className="w-full rounded-t-lg border-t-3 border-solid border-secondary bg-gradient-to-b from-pink-500/20 to-transparent flex flex-col text-sm font-semibold p-2">
              <div className="flex flex-row justify-between">
                <span>Bet</span>
                <span className="flex items-center gap-1">
                  ₩&nbsp;<CountUp end={ totalDownBets }/>
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
      <div className="c3 bg-slate-900 h-full flex flex-col gap-1">
        <div className={"flex flex-row betListing-container "+(timerStatus !== "payout" ? "transition-all delay-1000 duration-1000 ease-linear opacity-100 h-[50%] ": "transition-all delay-1000 duration-1000 ease-linear opacity-0 h-[0.1%] ") }>
          <div className={"w-1/2 upBets flex flex-col gap-1.5 p-1 "}>
            { (timerStatus !== "payout") && currentUpBets && currentUpBets.map(upbet => (
              <span key={upbet.id} className={"animate-slide-in-right p-1 rounded-lg bg-gradient-to-r from-emerald-800 from-10% to-80% text-xs font-medium"}>{ upbet.user_name} ₩&nbsp;<CountUp end={ upbet.total_bets }/></span>
            ))}
            { timerStatus == "payout" && <h1 className={"text-2xl capitalize font-extrabold text-green-400 tracking-widest text-center"}>{(resultsData.result == "up") ? "WINNER": "LOSER"}</h1>}
          </div>

          <div className={"w-1/2 upBets flex flex-col gap-1 p-1"}>
            { (timerStatus !== "payout") && currentDownBets && currentDownBets.map(downbet => (
              <span key={downbet.id} className={"animate-slide-in-left p-1 rounded-lg bg-gradient-to-r from-pink-800 from-10% to-80% text-xs font-medium"}>{ downbet.user_name} ₩&nbsp;<CountUp end={ downbet.total_bets }/> </span>
            ))}
            { timerStatus == "payout" && <h1 className={"text-2xl capitalize font-extrabold text-pink-500 tracking-widest text-center"}>{(resultsData.result == "down") ? "WINNER": "LOSER"}</h1>}
          </div>

        </div>
        { timerStatus == "payout" && 
          <div className={`h-[50%] flex items-center justify-center text-2xl font-extrabold capitalize ${
            resultsData && resultsData.result === "up" ? "bg-gradient-to-b from-green-500/20 to-transparent" // If result is 'up' and it's payout
            : resultsData && resultsData.result === "down" ? "bg-gradient-to-b from-pink-500/20 to-transparent"   // Else if result is 'down' and it's payout
            : resultsData && resultsData.result === "draw" && "bg-gradient-to-b from-amber-500/20 to-transparent"  // Else if result is 'draw' and it's payout
            }`}>
            {timerStatus === "payout" && resultsData && (
              <div className="text-shadow-lg/30">
                

                {resultsData.result === "up" &&
                  <div className="text-green-400 tracking-widest text-center flex flex-col gap-3">
                    {/* TODO // Players count */}
                    <span>{ currentUpBetsCountRef.current }</span>
                    <span>UP</span>
                    <span><CountUp delay={2} duration={0.8} end={ winningUp.current } /></span>
                  </div> 
                }

                {resultsData.result === "down" &&
                   <div className="text-pink-500 tracking-widest text-center flex flex-col justify-center align-middle">
                    <span>{ currentDownBetsCountRef.current }</span>
                    <span>DOWN</span>
                    <span><CountUp delay={2} duration={0.8} end={ winningDown.current } /></span> 
                  </div>
                }

                {resultsData.result === "draw" &&
                   <div className="text-amber-500 tracking-widest text-center flex flex-col justify-center align-middle">
                    {/* <span>{ currentDownBetsCountRef.current }</span> */}
                    <span>DRAW</span>
                    {/* <span><CountUp delay={2} duration={0.8} end={ winningDown.current } /></span>  */}
                  </div>
                }
              </div>
            )}
          </div>
        }
      </div>
    </div>
  );
}

export default DynamicPanel;