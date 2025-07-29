
import { useEffect, useState } from 'react';
import { useStore } from '../states/store';
import HLBackendV1Api from '../utils/http/api';
import CountUp from 'react-countup';


function UserBetsDetails() {

    const { timerStatus } = useStore();
    const [ userBetsDetails, setUserBetsDetails ] = useState();
    

    const getUserBetsDetail = async() => {
        try {
            await HLBackendV1Api.get(`${process.env.BACKEND_API_URL}/betting-management/user-bets-details`)
            .then((response) => { 
                setUserBetsDetails(response.data)
            });
        } catch (error) {
            console.log(error)
        }
    }

    const redirectToBinance = () => {
        const targetUrl = 'https://www.binance.com/en/trade/BTC_USDT?type=spot';
        console.log(`Opening ${targetUrl} in a new tab...`);
        window.open(targetUrl, '_blank'); // '_blank' opens in a new tab
    };


    useEffect(() => {
        getUserBetsDetail();

        return () => {

        }
    }, [timerStatus]);
    

    return <>
            <div className="flex flex-row justify-around items-center text-slate-300 p-2 font-sans text-xs max-sm:text-[0.3rem] sm:max-lg:text-[0.5rem]">
                <div className="flex-1 flex flex-col items-center">
                    <span className="text-sm font-extrabold sm:text-base md:text-lg lg:text-xl leading-none max-sm:text-[0.6rem] text-shadow-lg">
                        <CountUp end={ (userBetsDetails) ? userBetsDetails.winRatio: 0 } suffix='%'/>
                    </span>
                    <span className="text-[0.5rem] sm:text-xs font-medium mt-1 text-center max-sm:text-[0.4rem]">
                        24h Win Ratio
                    </span>
                </div>

                <div className="flex-1 flex flex-col items-center">
                    <span className="text-sm font-extrabold sm:text-base md:text-lg lg:text-xl leading-none max-sm:text-[0.6rem] text-shadow-lg">
                        <CountUp end={ (userBetsDetails) ? userBetsDetails.dailyUserCount: 0 } />
                    </span>
                    <span className="text-[0.5rem] sm:text-xs font-medium mt-1 text-center max-sm:text-[0.4rem]">
                        24h Live Players
                    </span>
                </div>

                <div className="flex-1 flex flex-col items-center">
                    <span className="text-sm font-extrabold sm:text-base md:text-lg lg:text-xl leading-none max-sm:text-[0.6rem] text-shadow-lg">
                        <CountUp prefix={"₩"} end={ (userBetsDetails) ? userBetsDetails.dailyWinsPaid: 0 } />
                    </span>
                    <span className="text-[0.5rem] sm:text-xs font-medium mt-1 text-center max-sm:text-[0.4rem]">
                        24h Wins Paid
                    </span>
                </div>

                <div className="flex-1 flex flex-col items-center max-sm:hidden sm:max-lg:hidden tooltip" data-tip="Verify Fairness">
                    <button className='btn btn-outline btn-primary btn-md rounded-xl' alt="verify fairness" onClick={ redirectToBinance }>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v.756a49.106 49.106 0 0 1 9.152 1 .75.75 0 0 1-.152 1.485h-1.918l2.474 10.124a.75.75 0 0 1-.375.84A6.723 6.723 0 0 1 18.75 18a6.723 6.723 0 0 1-3.181-.795.75.75 0 0 1-.375-.84l2.474-10.124H12.75v13.28c1.293.076 2.534.343 3.697.776a.75.75 0 0 1-.262 1.453h-8.37a.75.75 0 0 1-.262-1.453c1.162-.433 2.404-.7 3.697-.775V6.24H6.332l2.474 10.124a.75.75 0 0 1-.375.84A6.723 6.723 0 0 1 5.25 18a6.723 6.723 0 0 1-3.181-.795.75.75 0 0 1-.375-.84L4.168 6.241H2.25a.75.75 0 0 1-.152-1.485 49.105 49.105 0 0 1 9.152-1V3a.75.75 0 0 1 .75-.75Zm4.878 13.543 1.872-7.662 1.872 7.662h-3.744Zm-9.756 0L5.25 8.131l-1.872 7.662h3.744Z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </>
        
    
}

export default UserBetsDetails;