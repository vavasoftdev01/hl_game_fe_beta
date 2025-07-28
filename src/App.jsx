import { useState, useEffect, Suspense, lazy } from 'react';
import './App.css';
import { useStore } from './states/store';
const BBBaselineChart = lazy(() => import('./components/BBBaselineChart'));
const BettingForm = lazy(() => import('./components/BettingForm'));
const DynamicPanel = lazy(() => import('./components/DynamicPanel'));
const HistoricalTradesLeaderBoardPanel = lazy(() =>
  import('./components/HistoricalTradesLeaderBoardPanel')
);
const GameTimer = lazy(() => import('./components/GameTimer'));
import Loader from './assets/images/loaders/loader.gif';
import AuthError from './assets/images/errors/auth-error.jpg';
import HLBackendV1Api from './utils/http/api';
import { useStore } from './states/store';
import OptionsChart from './components/OptionsChart';
import HLBackendV1 from '../src/utils/socket/HL_backend_v1';
import CountUp from 'react-countup';
import ResultPanel from './components/ResultPanel';
import DrawHistory from './components/DrawHistory';
import UserBetsDetails from './components/UserBetsDetails';

// import { SingleTicker, TickerTape, AdvancedRealTimeChart, Ticker, SymbolInfo   } from "react-ts-tradingview-widgets";

const CoinGeckoMarquee = lazy(() => import('./components/CoinGeckoMarquee'));

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { timerStatus, authUser, setAuthUser, setCurrentUpBets, setCurrentDownBets, setUpTotalBets, setDownTotalBets, setCurrentUpWager, setCurrentDownWager } = useStore();
  const [isAuthUser, setIsAuthUser] = useState(false);
  const [upWager, setUpWager] = useState("100");
  const [downWager, setDownWager] = useState("100");

  const [symbols, setSymbols] = useState([
    {
      "proName": "BINANCE:BTCUSDT",
      "title": "BTCUSDT"
    },
    {
      "proName": "BINANCE:ETHUSDT",
      "title": "ETHUSDT"
    },
    {
      "proName": "BINANCE:BNBUSDT",
      "title": "BNBUSDT"
    },
    {
      "proName": "BINANCE:SOLUSDT",
      "title": "SOLUSDT"
    },
    {
      "proName": "BINANCE:DOGEUSDT",
      "title": "DOGEUSDT"
    }
  ]);


  const getAuth = async() => {
    await HLBackendV1Api.get('/betting-management/checkAuthorization').then((response) => {
      setIsAuthUser(true);
      setAuthUser(response.data)
    }).catch((error) => {
      console.log(error.status);
    });
  }

  useEffect(() => {
    getAuth();
  }, []);

  useEffect(() => {
    if(timerStatus === "draw") {
      setCurrentUpWager(upWager);
      setCurrentDownWager(downWager);
    }
    
    if(timerStatus === "payout") {
      setUpWager("100");
      setDownWager("100");
      setUpTotalBets([]);
      setDownTotalBets([]);
   
    }
  }, [timerStatus]);


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const socket = HLBackendV1.getInstance('/hl_wager').getSocket();

    socket.on('connect', () => {
      socket.on('dynamic_rate', onFetchData);
    });

    return () => {
      socket.off('connect');
      socket.off('dynamic_rate');
    }
  }, []);

  const onFetchData = (data) => {
    setUpWager(data.up);
    setDownWager(data.down);
    setCurrentUpBets(data.upBetLists);
    setCurrentDownBets(data.downBetLists);
    setUpTotalBets(data.totalUpBets);
    setDownTotalBets(data.totalDownBets);
    // console.table(data)
  };

  return (
    <div className="h-auto w-full bg-gray-900 p-0 text-gray-100 font-sans drop-shadow-xl/50">
      {/* <h1 className="text-2xl font-bold text-cyan-400 mb-4 hover:text-cyan-300 transition-colors duration-300">
        KBCGAME Trading Dashboard
      </h1> */}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-[400px]">
          <img className="h-40 w-96 object-contain" src={Loader} />
          {/* <div className="loading loading-dots w-20 text-purple-600"></div> */}
        </div>
      ) : (
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-[400px]">
              
              <img className="h-40 w-96 object-contain" src={Loader} />
              {/* <div className="loading loading-dots w-20 text-purple-600"></div> */}
            </div>
          }
        >
          {(isAuthUser) && <div className="flex flex-col gap-1 max-h-[100%] max-w-[1680px] mx-auto">
            <div className="w-full">
              <div className="tradingview-widget-container text-red-300">
                {/* <SingleTicker
                  colorTheme="dark"
                  width="100%"
                  height={10}
                  symbol="BINANCE:BTCUSDT"
                  locale="en"
                  isTransparent={false}
                /> */}

                {/* <Ticker locale="kr" symbols={symbols} colorTheme="dark"></Ticker> */}

                {/* <SymbolInfo colorTheme="dark" symbol="BINANCE:BTCUSDT" autosize></SymbolInfo> */}

                {/* <TickerTape colorTheme="dark" symbols={symbols}></TickerTape> */}
                <CoinGeckoMarquee coinIds="bitcoin,ethereum" />
              </div>
              
            </div>
            <div className="flex flex-row gap-1">
              <div className="w-2/3 flex flex-col border border-solid border-slate-700 rounded-tl-lg rounded-bl-lg h-full max-sm:w-full sm:w-full">
                <div className="flex flex-col w-full p-2 bg-transparent h-2/5 ">
                  <div className="w-full">
                    <div className="flex flex-row text-center gap-2 bg-slate-900">
                      <div className={"w-full left-pane flex flex-col text-left font-light text-sm max-sm:hidden"}>
                        <span className={"up-inv"}>Your Investment</span>
                        <span className={"up-inv-val font-extrabold text-success"}>₩ 69</span>
                        <span className={"up-poten-ret"}>Potential Return</span>
                        <span className={"up-poten-val font-extrabold text-success"}>₩ 69.9</span>
                      </div>

                      <div className={"flex flex-row w-full center-pane"}>
                        <div className={"flex flex-col up-wager px-3 w-full place-items-center gap-2"}>
                          <span className='rounded-full bg-gradient-to-b from-green-500/20 to-transparent text-success text-xs font-medium w-1/2 p-0'>Up wins</span>
                          <div className="upwager-cont text-4xl text-success font-extrabold">
                            { (upWager !== 0) ? upWager: 100 }%
                          </div>
                        </div>
                        <div className={"w-full"}><GameTimer /></div>
                        {/* <div className={"text-4xl text-secondary font-extrabold px-3 w-full"}>
                          { (downWager !== 0) ? downWager: 100 }%
                        </div> */}
                        <div className={"flex flex-col down-wager px-3 w-full place-items-center gap-2 "}>
                          <span className='rounded-full bg-gradient-to-b from-pink-500/20 to-transparent text-secondary text-xs font-medium w-full p-0 mx-0'>Down wins</span>
                          <div className="downwager-cont text-4xl text-secondary font-extrabold">
                            { (downWager !== 0) ? downWager: 100 }%
                          </div>
                        </div>
                      </div>

                      <div className={"w-full right-pane flex flex-col text-right font-light text-sm max-sm:hidden"}>
                        <span className={"down-inv"}>Your Investment</span>
                        <span className={"down-inv-val font-extrabold text-secondary"}>₩ 69</span>
                        <span className={"down-poten-ret"}>Potential Return</span>
                        <span className={"down-poten-val font-extrabold text-secondary"}>₩ 69.6</span>
                      </div>

                    </div>
                  </div>
                  {/* <div className="flex flex-row w-full">
                    <div className="bg-success w-full">.</div>
                    <div className="bg-secondary w-full end-1">.</div>
                  </div> */}
                  
                </div>

                
                <div className="relative">
                  <div className={"w-full bg-blend-darken absolute z-20 "}><ResultPanel /></div>
                  <div className="h-full status-cont flex flex-col bg-slate-800 pl-5 pt-5">
                    { timerStatus == "betting_open" && 
                      <>
                        <span className={"animate-sequence text-lg font-semibold"}>Round in Progress</span>
                        <span className={"animate-sequence text-md font-semibold"}>Place your trade</span>
                      </>
                    }
                    { timerStatus == "draw" && 
                      <>
                        <span className={"animate-sequence text-lg font-semibold"}>No more orders!</span>
                        <span className={"animate-sequence text-md font-semibold"}>Wait for next round</span>
                      </>
                    }
                    { timerStatus == "payout" && 
                      <>
                        <span className={"animate-sequence text-lg font-semibold"}>Money Distributed</span>
                        <span className={"animate-sequence text-md font-semibold"}>&nbsp;</span>
                      </>
                    }
                  </div>
                  <div className="w-full">
                    <OptionsChart />
                    {/* <BBBaselineChart height={300} /> */}
                  </div>
                </div>

                {/* Historical Data and Game Details Container */}
                <div className="bg-slate-900 w-full p-5 max-sm:px-0 max-sm:p-1">
                    <div className="flex flex-row justify-between items-center w-full bg-slate-800 h-16 text-black border border-solid border-slate-700 rounded-lg drop-shadow-xl/50">
                      <div className="flex-1 text-left">
                        <UserBetsDetails />
                      </div>
                      
                      <div className="flex-1 overflow-x-hidden">
                        <DrawHistory />
                      </div>
                    </div>
                </div>

                {/* <AdvancedRealTimeChart theme="dark" height={500} style="2" interval="1" symbol='btcusdt'></AdvancedRealTimeChart> */}
                <div className="w-full p-5 bg-slate-900 h-1/4 max-sm:p-0">
                  <BettingForm />
                </div>

                {/* Dynamic panel xs,sm layout */}
                <div className="w-full bg-slate-900 h-1/4 max-sm:visible sm:max-lg:visible lg:max-xl:visible xl:max-2xl:hidden 2xl:hidden hidden">
                  <DynamicPanel />
                </div>
              </div>

              {/* Col 2 */}
              <div className="w-1/3 bg-slate-800 border border-solid border-slate-700 rounded-tr-lg max-sm:hidden sm:max-lg:hidden lg:max-xl:hidden xl:max-2xl:visible 2xl:visible overflow-x-hidden">
                <DynamicPanel />
              </div>
            </div>
            <div className="bg-slate-900 border border-solid border-slate-700 rounded-b-lg p-6 flex justify-between overflow-auto min-h-[400px] max-sm:p-0">
              <HistoricalTradesLeaderBoardPanel />
            </div>
            <footer>
              {/* <Ticker locale="kr" symbols={symbols} colorTheme="dark"></Ticker> */}
            </footer>
          </div>}
          {(!isAuthUser)&& <div className="h-full w-full">
            <img className="object-contain mx-auto" src={AuthError} />
          </div>}
        </Suspense>
      )}
    </div>
  );
};

export default App;