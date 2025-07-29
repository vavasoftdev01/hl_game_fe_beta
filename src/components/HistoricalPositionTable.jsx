import { useEffect, useState } from "react";
import HLBackendV1Api from '../utils/http/api';
import { useStore } from './../states/store';
import moment from 'moment';
import DataTableNoData from "./DataTableNoData";

function HistoricalPositionTable() {

    const [historicalBets, setHistoricalBets] = useState([]);
    const { timerStatus } = useStore();

    const getHistoricalBetsData = async() => {
        try {
            await HLBackendV1Api.get(`${process.env.BACKEND_API_URL}/betting-management/user-transaction-history?status=all&skip=0&take=20`)
            .then((response) => { 
                setHistoricalBets(response.data)
            });
        } catch (error) {
            console.log(error)
        }
    }

  useEffect(() => {
    getHistoricalBetsData();
    return () => {}
  },[timerStatus])
    
    return <>
        { (historicalBets && historicalBets.length > 0) && 
        <div className="w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden h-full">  
            <div className="overflow-x-scroll">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                        <tr>
                        {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            ID #
                        </th> */}
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Result
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Time
                        </th>
                        
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Entry Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Exit Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Yield
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            PNL
                        </th>
                        {/* Removed Edit Column Header */}
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {historicalBets.map((bet) => (
                        <tr key={bet.id} className={"hover:animate-pulse hover:cursor-pointer transition duration-150 ease-in-out text-gray-300 tracking-wide font-medium text-xs "+(bet.status == "win" ? "bg-gradient-to-r from-emerald-600 from-1% to-10%": bet.status == "loss" ? "bg-gradient-to-r from-pink-600 from-1% to-10%": "bg-gradient-to-r from-amber-900 from-1% to-10%") }>
                            {/* <td className="px-6 py-4 whitespace-nowrap">
                                { bet.id }
                            </td> */}
                            <td className={"px-5 py-2 whitespace-nowrap text-sm capitalize "+(bet.status == "win" ? "text-green-300": bet.status == "loss" ? "text-pink-300": "text-amber-300")}>
                                { bet.status }
                            </td>
                                <td className={"px-5 py-2 whitespace-nowrap capitalize "+(bet.user_bets == "up" ? "text-green-300": "text-pink-300")}>
                                { bet.user_bets }
                            </td>
                            <td className="px-5 py-2 whitespace-nowrap">
                                { moment(bet.createdAt).format('MMMM Do YYYY, h:mm:ss a') }
                            </td>
                            
                            <td className="px-5 py-2 whitespace-nowrap">
                                { bet.ud_game.draw_open_price }
                            </td>
                            <td className="px-5 py-2 whitespace-nowrap">
                                { bet.ud_game.draw_close_price }
                            </td>
                            <td className="px-5 py-2 whitespace-nowrap text-sm">
                                ₩&nbsp;{ (+bet.amount).toLocaleString() }
                            </td>
                            <td className={"px-5 py-2 whitespace-nowrap text-sm "+(bet.status == "win" ? "text-green-300": "text-pink-300")}>
                                { bet.rate }&nbsp;%
                            </td>
                            <td className={"px-6 py-4 whitespace-nowrap text-sm "+(bet.status == "win" ? "text-green-300": bet.status == "loss" ? "text-pink-300": "text-amber-300")}>
                                ₩&nbsp;{ (bet.status == "win") ? Math.round(+bet.pnl).toLocaleString(): (bet.status == "loss") ? '-'+(+bet.amount).toLocaleString(): 0 }
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>  
        </div>
        }
        { (!historicalBets || !historicalBets.length) &&  
            <DataTableNoData />
        }       
    </>
}

export default HistoricalPositionTable;