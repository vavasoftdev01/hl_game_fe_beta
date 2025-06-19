import { useState } from 'react';
import { useStore } from './../states/store';
import Swal from 'sweetalert2';
import Crypto from '../crypto';
import HLBackendV1Api from '../utils/http/api';

function BettingForm() {
  const { count, betType, userPlaceBet } = useStore();
  const [bettingAmount, setBettingAmount] = useState('');

  const computeBettingAmount = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setBettingAmount(value);
    }
  };

  const computeBettingAmountButton = (e) => {
    const value = +e.target.value;
    setBettingAmount((prevBettingAmount) => {
      const newAmount = prevBettingAmount === '' ? value : Number(prevBettingAmount) + value;
      return newAmount.toString();
    });
    console.log(e.target.value);
  };

  const multiplyBettingAmount = (multiplier) => {
    setBettingAmount((prevBettingAmount) => {
      const currentAmount = prevBettingAmount === '' ? 0 : Number(prevBettingAmount);
      const newAmount = currentAmount * multiplier;
      return newAmount.toString();
    });
  };

  const encryptBettingParameters = async(data) => {
    let payload = await Crypto.encrypt(data);
    return payload;
  };

  const submitBet = async (type) => {
    userPlaceBet(type); // TODO on success only..
    const amountToSend = bettingAmount === '' ? '0' : bettingAmount;

    let parameters = {
      user_id: 'coldOne-555',
      hl_game_id: 23,
      user_bets: type.toLowerCase() === 'up' ? 'high' : 'low',
      amount: amountToSend,
      rate: '1.75',
      market_id: 'hl_game',
      market_name: 'tobediscussed',
      bets_id: type.toLowerCase() === 'up' ? 'high' : 'low',
      bets_name: 'tobediscussed',
    };

    if(+process.env.ALLOWED_ENCRYPTION_DECRYPTION === 1) {
      const token = await encryptBettingParameters(parameters);
      parameters = {'rt_token': token}
    }

    await HLBackendV1Api
      .post(`${process.env.BACKEND_API_URL}/betting-management/createUserBet`, parameters)
      .then((response) => {
        const isError = response.data.statusCode < 200 || response.data.statusCode > 299;
        Swal.fire({
          title: isError ? (response.data?.message || 'An error occurred') : 'Bet has been placed!',
          text: isError ? 'Please try again later!' : 'Goodluck!',
          icon: isError ? 'error' : 'success',
          background: '#1d293d',
          didRender: () => {
            Swal.getTitle().style.color = '#b6c2cf';
            Swal.getHtmlContainer().style.color = '#b6c2cf';
          },
        });

        (!isError) && setBettingAmount('');  

      })
      .catch((error) => {
        Swal.fire({
          title: 'Something went wrong!',
          text: "There's an error on placing bet",
          icon: 'error',
          background: '#1d293d',
          didRender: () => {
            Swal.getTitle().style.color = '#b6c2cf';
            Swal.getHtmlContainer().style.color = '#b6c2cf';
          },
        });
        console.log(error);
      });
  };

  return (
    <div className="flex flex-col gap-2 bg-slate-800 border border-solid border-slate-700 rounded-lg p-5 fill-white drop-shadow-xl/50 font-xs overflow-x-scroll">
      <div className="gap-2 rounded-md flex flex-row max-w-full text-sm max-sm:flex-col sm:max-lg:flex-col">
        <div className="input-cont w-1/2 flex flex-col text-slate-400 font-medium max-sm:w-full">
          <span className="p-1">High or Low?</span>
          <div className="flex flex-row gap-1 w-full max-sm:flex-col-reverse">
            <button
              className="group btn btn-primary max-sm:btn-lg sm:max-lg:btn-lg"
              onClick={() => setBettingAmount('')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-4 transition-transform group-hover:rotate-[360deg] duration-1000"
              >
                <path
                  fillRule="evenodd"
                  d="M8 3.5c-.771 0-1.537.022-2.297.066a1.124 1.124 0 0 0-1.058 1.028l-.018.214a.75.75 0 0 1-1.495-.12l.018-.221a2.624 2.624 0 0 1 2.467-2.399 41.628 41.628 0 0 1 4.766 0 2.624 2.624 0 0 1 2.467 2.399c.056.662.097 1.329.122 2l.748-.748a.75.75 0 1 1 1.06 1.06l-2 2.001a.75.75 0 0 1-1.061 0l-2-1.999a.75.75 0 0 1 1.061-1.06l.689.688a39.89 39.89 0 0 0-.114-1.815 1.124 1.124 0 0 0-1.058-1.028A40.138 40.138 0 0 0 8 3.5ZM3.22 7.22a.75.75 0 0 1 1.061 0l2 2a.75.75 0 1 1-1.06 1.06l-.69-.69c.025.61.062 1.214.114 1.816.048.56.496.996 1.058 1.028a40.112 40.112 0 0 0 4.594 0 1.124 1.124 0 0 0 1.058-1.028 39.2 39.2 0 0 0 .018-.219.75.75 0 1 1 1.495.12l-.018.226a2.624 2.624 0 0 1-2.467 2.399 41.648 41.648 0 0 1-4.766 0 2.624 2.624 0 0 1-2.467-2.399 41.395 41.395 0 0 1-.122-2l-.748.748A.75.75 0 1 1 1.22 9.22l2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              Clear
            </button>
            <div className="relative w-full">
              <input
                type="number"
                placeholder="Enter amount"
                className="w-full input input-md bg-transparent border border-solid border-slate-700 pr-24" /* Increased padding */
                value={bettingAmount}
                onChange={computeBettingAmount}
                min="0"
                step="1"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-1 gap-1 pt-1 pb-2">
                <button
                  className="btn btn-xs btn-primary hover:underline hover:shadow-md shadow-violet-500/50 h-full rounded-l-md"
                  onClick={() => multiplyBettingAmount(2)}
                >
                  x2
                </button>
                <button
                  className="btn btn-xs btn-primary hover:underline hover:shadow-md shadow-violet-500/50 h-full rounded-r-md" /* Fixed rounding */
                  onClick={() => multiplyBettingAmount(3)}
                >
                  x3
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col text-slate-400 font-medium">
          <span className="p-1 text-shadow-lg">How it works?</span>
          <div className="btn-multi w-full flex flex-row gap-1 overflow-x-auto">
            <button
              className="btn bg-gradient-to-b from-red-500 to-orange-500 hover:underline hover:shadow-md hover:animate-pulse shadow-orange-500/50 btn-uniform max-sm:btn-lg sm:max-lg:btn-lg"
              value="10000"
              onClick={computeBettingAmountButton}
            >
              1만
            </button>
            <button
              className="btn bg-gradient-to-b from-red-500 to-orange-500 hover:underline hover:shadow-md hover:animate-pulse shadow-orange-500/50 btn-uniform max-sm:btn-lg sm:max-lg:btn-lg"
              value="30000"
              onClick={computeBettingAmountButton}
            >
              3만
            </button>
            <button
              className="btn bg-gradient-to-b from-red-500 to-orange-500 hover:underline hover:shadow-md hover:animate-pulse shadow-orange-500/50 btn-uniform max-sm:btn-lg sm:max-lg:btn-lg"
              value="50000"
              onClick={computeBettingAmountButton}
            >
              5만
            </button>
            <button
              className="btn bg-gradient-to-b from-red-500 to-orange-500 hover:underline hover:shadow-md hover:animate-pulse shadow-orange-500/50 btn-uniform max-sm:btn-lg sm:max-lg:btn-lg"
              value="100000"
              onClick={computeBettingAmountButton}
            >
              10만
            </button>
            <button
              className="btn bg-gradient-to-b from-red-500 to-orange-500 hover:underline hover:shadow-md hover:animate-pulse shadow-orange-500/50 btn-uniform max-sm:btn-lg sm:max-lg:btn-lg"
              value="300000"
              onClick={computeBettingAmountButton}
            >
              30만
            </button>
            <button
              className="btn bg-gradient-to-b from-red-500 to-orange-500 hover:underline hover:shadow-md hover:animate-pulse shadow-orange-500/50 btn-uniform max-sm:btn-lg sm:max-lg:btn-lg"
              value="500000"
              onClick={computeBettingAmountButton}
            >
              50만
            </button>
            <button
              className="btn bg-gradient-to-b from-red-500 to-orange-500 hover:underline hover:shadow-md hover:animate-pulse shadow-orange-500/50 btn-uniform max-sm:btn-lg sm:max-lg:btn-lg"
              value="1000000"
              onClick={computeBettingAmountButton}
            >
              100만
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-row w-full gap-1">
        <button
          className="group btn btn-success w-1/2 hover:text-white flex flex-row items-center justify-center gap-2 hover:underline"
          onClick={() => submitBet('UP')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            fill="none"
            viewBox="0 0 38 38"
            className="detrade-icon size-10 rounded-full p-1.5 text-white pointer-events-none bg-up rotate-180 group-hover:rotate-[-525deg] group-hover:duration-1000"
          >
            <path
              fill="currentColor"
              fillOpacity="0.75"
              d="m33.429 14.206-6.464 6.464-5.373-5.375-5.999 5.998L19 24.7H9.5v-9.5l3.407 3.407 8.685-8.685 5.373 5.373 4.702-4.7a15.2 15.2 0 1 0 1.762 3.61zm2.922-2.96.019.02-.008.007A18.9 18.9 0 0 1 38 19c0 10.494-8.506 19-19 19S0 29.494 0 19 8.506 0 19 0c7.733 0 14.383 4.617 17.35 11.246"
            />
          </svg>
          <span className="text-white">UP</span>
        </button>

        <button
          className="group btn btn-secondary w-1/2 hover:text-white flex flex-row items-center justify-center gap-2 hover:underline"
          onClick={() => submitBet('DOWN')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            fill="none"
            viewBox="0 0 38 38"
            className="detrade-icon size-10 rounded-full p-1.5 text-white pointer-events-none bg-down group-hover:rotate-[-720deg] group-hover:duration-1000"
          >
            <path
              fill="currentColor"
              fillOpacity="0.75"
              d="m33.429 14.206-6.464 6.464-5.373-5.375-5.999 5.998L19 24.7H9.5v-9.5l3.407 3.407 8.685-8.685 5.373 5.373 4.702-4.7a15.2 15.2 0 1 0 1.762 3.61zm2.922-2.96.019.02-.008.007A18.9 18.9 0 0 1 38 19c0 10.494-8.506 19-19 19S0 29.494 0 19 8.506 0 19 0c7.733 0 14.383 4.617 17.35 11.246"
            />
          </svg>
          <span className="text-white">DOWN</span>
        </button>
      </div>
    </div>
  );
}

export default BettingForm;