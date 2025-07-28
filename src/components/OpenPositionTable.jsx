import { useEffect, useState } from "react";
import HLBackendV1Api from '../utils/http/api';
import moment from 'moment'; 

function OpenPositionTable() {

    const [userBets, setUserBets] = useState([]);

    const getPendingUserBets = async() => {
        try {
            await HLBackendV1Api.get(`${process.env.BACKEND_API_URL}/betting-management/user-transaction-history?status=pending&skip=0&take=20`)
            .then((response) => { 
                setUserBets(response.data)
                
            });
        } catch (error) {
            console.log(error)
        }
    }

  useEffect(() => {

    let intId = setInterval(() => {
      getPendingUserBets();
    },2000)
    

    return () => {
        clearInterval(intId)
    }
  },[])
    

    return <>
        { (userBets && userBets.length > 0) && 
        <div className="w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden h-full">  
            <div className="overflow-x-scroll">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                        <tr>
                        {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            ID #
                        </th> */}
                        
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider max-sm:hidden">
                            Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Created At
                        </th>
                        {/* Removed Edit Column Header */}
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {userBets.map((bet) => (
                        <tr key={bet.id} className="hover:bg-gray-700 transition duration-150 ease-in-out text-gray-300 tracking-wide font-medium">
                            {/* <td className="px-6 py-4 whitespace-nowrap">
                                { bet.id }
                            </td> */}
                            
                            <td className={"px-6 py-4 whitespace-nowrap uppercase animate-pulse "+(bet.user_bets == "up" ? "text-green-500": "text-pink-500")}>
                                { bet.user_bets }
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                ₩&nbsp;{ bet.amount }
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm capitalize max-sm:hidden">
                                { bet.status }
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                { moment(bet.createdAt).format('MMMM Do YYYY, h:mm:ss a') }
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>  
        </div>
        }
        { (!userBets || !userBets.length) &&  
            <h1 className=" font-bold text-center p-5 text-3xl bg-transparent text-slate-500">No data available</h1>
        }       
    </>
}

export default OpenPositionTable;