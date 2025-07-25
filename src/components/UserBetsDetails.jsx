
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

                {/* <div className="flex-1 flex flex-col items-center max-sm:hidden sm:max-lg:hidden ">
                    <span className="text-sm font-extrabold sm:text-base md:text-lg lg:text-xl leading-none max-sm:text-[0.6rem] text-shadow-lg">
                        440,722.67
                    </span>
                    <span className="text-[0.5rem] sm:text-xs font-medium mt-1 text-center max-sm:text-[0.4rem]">
                        All Time Wins Paid
                    </span>
                </div> */}
            </div>
        </>
        
    
}

export default UserBetsDetails;