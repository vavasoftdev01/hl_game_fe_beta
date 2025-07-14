import { useEffect, useRef, useState } from 'react';
import { useStore } from '../states/store';
import HLBackendV1Api from '../utils/http/api';
import Winner from '../assets/images/results/winner-cont.png';
import RTRays from '../assets/images/results/sun-rays-orange.png';
import CountUp from 'react-countup';

function ResultPanel() {

    const { timerStatus, currentRound } = useStore();
    const [totalEarnings, setTotalEarnings] = useState();
    const [totalBets, setTotalBets] = useState();
    const totalEarningsRef = useRef(0);
    const totalBetsRef = useRef(0);

    useEffect(() => {
        if(timerStatus == "payout") {
            console.log('ResultPanel')
            fetchUserResult();
        }

        totalEarningsRef.current = 0;

    }, [timerStatus])

    const fetchUserResult = async () => {
        try {
            await HLBackendV1Api
            .post(`${process.env.BACKEND_API_URL}/betting-management/get-user-result`, { _id: currentRound.id })
                .then((response) => {
                    console.log(response.data)
                    console.log(response.data['total_bets'])
                    console.log(response.total_bets)
                    setTotalBets(response.data['total_bets']);
                    setTotalEarnings(response.data['total_earnings']);
                    totalEarningsRef.current = (response && response.data['total_pnl']) ? response.data['total_pnl']: 0;
                    totalBetsRef.current = response.data['total_bets']
                })
            } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    return <>
        {/* { timerStatus == "betting_open" || timerStatus == "payout" && <div className=" text-5xl text-center font-extrabold flex flex-col text-amber-400 " src={Winner}>
            <span>WINNER</span>
            <CountUp start={0} end={totalEarningsRef.current} duration={0.8}/>
        </div>} */}
        {/* <div className="text-5xl text-center font-extrabold flex flex-col text-amber-400 bg-red-300 relative">
            <img class="h-80 w-96 object-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-800" src={Winner} />
            <span>WINNER</span>
            <CountUp start={0} end={totalEarningsRef.current} duration={0.8}/>
        </div> */}
        { timerStatus == "betting_open" || timerStatus == "payout" && totalEarningsRef.current > 0 &&
            <div className="absolute pt-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-48 text-amber-400 rounded-lg shadow-lg flex items-center justify-center text-center font-bold text-lg animate-on-load">
                <span class="relative z-10 text-4xl font-extrabold">
                    ₩ <CountUp start={0} end={totalEarningsRef.current} duration={0.8}/>
                </span>
                <img className="w-80 h-80 object-contain absolute rounded-full" src={Winner}/>
                <img className="opacity-40 w-80 h-80 object-contain absolute rounded-full animate-[spin_20s_linear_infinite] " src={RTRays}/>
            </div>
        }
        
    </>
}



export default ResultPanel;