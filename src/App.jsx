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

// import { SingleTicker, TickerTape, AdvancedRealTimeChart, Ticker, SymbolInfo   } from "react-ts-tradingview-widgets";

const CoinGeckoMarquee = lazy(() => import('./components/CoinGeckoMarquee'));

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { timerStatus } = useStore();
  const [isAuthUser, setIsAuthUser] = useState(false);
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
      setIsAuthUser(true)
    }).catch((error) => {
      console.log(error.status)
    });
  }

  useEffect(() => {
    getAuth();
  }, []);


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-auto w-full bg-gray-900 p-6 text-gray-100 font-sans drop-shadow-xl/50">
      {/* <h1 className="text-2xl font-bold text-cyan-400 mb-4 hover:text-cyan-300 transition-colors duration-300">
        KBCGAME Trading Dashboard
      </h1> */}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-[400px]">
          <img class="h-40 w-96 object-contain" src={Loader} />
          {/* <div className="loading loading-dots w-20 text-purple-600"></div> */}
        </div>
      ) : (
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-[400px]">
              
              <img class="h-40 w-96 object-contain" src={Loader} />
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
                <div className="flex flex-col w-full p-5 bg-transparent h-2/5">
                  <div className="w-full">
                    <div className="text-center p-2">
                      <GameTimer />
                    </div>
                  </div>
                  <div className="flex flex-row w-full">
                    <div className="bg-success w-full">.</div>
                    <div className="bg-secondary w-full end-1">.</div>
                  </div>
                  
                </div>
                <BBBaselineChart height={300} />
                {/* <AdvancedRealTimeChart theme="dark" height={500} style="2" interval="1" symbol='btcusdt'></AdvancedRealTimeChart> */}
                <div className="w-full p-5 bg-slate-900 h-1/4">
                  <BettingForm />
                </div>
              </div>
              <div className="w-1/3 bg-slate-800 border border-solid border-slate-700 rounded-tr-lg max-sm:hidden sm:max-lg:hidden overflow-x-hidden">
                <DynamicPanel />
              </div>
            </div>
            <div className="bg-slate-900 border border-solid border-slate-700 rounded-b-lg p-6 flex justify-between overflow-auto min-h-[400px]">
              <HistoricalTradesLeaderBoardPanel />
            </div>
            <footer>
              {/* <Ticker locale="kr" symbols={symbols} colorTheme="dark"></Ticker> */}
            </footer>
          </div>}
          {(!isAuthUser)&& <div className="h-full w-full">
            <img class="object-contain mx-auto" src={AuthError} />
          </div>}
        </Suspense>
      )}
    </div>
  );
};

export default App;