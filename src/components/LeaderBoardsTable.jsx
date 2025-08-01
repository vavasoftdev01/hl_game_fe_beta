import { useEffect, useRef, useState } from "react";
import HLBackendV1Api from '../utils/http/api';
import { useStore } from './../states/store';
import moment from 'moment';
import DataTableNoData from "./DataTableNoData";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import RadioDropdown from "./RadioDropdown";

function LeaderBoardsTable() {
  const [leaderBoardsData, setLeaderBoardsData] = useState([]);
  const [totalPages, setTotalPages] = useState(0); 
  const [page, setPage] = useState(1); // ref
  const limit = 10


  const [firstSelection, setFirstSelection] = useState("total_roi"); // Default to "total_roi"
  const [secondSelection, setSecondSelection] = useState("daily"); // Default to "daily"

  const firstOptions = [
    { id: 1, label: 'ROI', value: "total_roi" },
    { id: 2, label: 'PNL', value: "total_pnl" },
  ];

  const secondOptions = [
    { id: 4, label: 'Daily', value: "daily" },
    { id: 5, label: 'Weekly', value: "weekly" },
    { id: 6, label: 'Monthly', value: "monthly" },
  ];

  const getLeaderboardsData = async() => {
    
    try {
      await HLBackendV1Api.get(`${process.env.BACKEND_API_URL}/betting-management/leader-board?skip=0&take=${limit}&status=all&byTime=${secondSelection}&orderBy=${firstSelection}`)
      .then((response) => { 
        setLeaderBoardsData(response.data.results);
        setTotalPages(response.data.totalPageCount)
      });
    } catch (error) {
      console.log(error)
    }
  }

  const handleChange = async(event, value) => {

        let offset = (value - 2)  * limit + 10;
        setPage(value)

        await HLBackendV1Api.get(`${process.env.BACKEND_API_URL}/betting-management/leader-board?skip=${offset}&take=${limit}&status=all&byTime=${secondSelection}&orderBy=${firstSelection}`)
        .then(function (response) {
            setLeaderBoardsData(response.data.results);
            setTotalPages(response.data.totalPageCount)
        })
        .catch(function (error) {
            console.log(error);
        })

        
    };

  useEffect(() => {
    getLeaderboardsData();
  
    return () => {
      
    }
  }, [firstSelection, secondSelection])
    
  return<>
    <div className="w-full flex flex-col overflow-x-scroll overflow-y-auto h-80">
      <div className="control-filter-container flex flex-row gap-1">
          <div className=" max-sm:w-1/2 p-1">
            <div className="flex gap-1">
              <RadioDropdown
                label="First Dropdown"
                options={firstOptions}
                selectedValue={firstSelection}
                onSelect={setFirstSelection}
              />
              <RadioDropdown
                label="Second Dropdown"
                options={secondOptions}
                selectedValue={secondSelection}
                onSelect={setSecondSelection}
              />
            </div>
        </div>
      </div>
      <div className="table-cont pt-1">
         <table className="min-w-full divide-y divide-gray-700 table">
          <thead className="bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Player
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Bets
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Wins
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Win Rate
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Total Bets
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                PNL
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Total Profit
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {leaderBoardsData.map((data, index) => {
              // Conditionally apply a class based on the row index
              const isHighlighted = index < 3;
              
              let rowClass = "hover:cursor-pointer transition duration-150 ease-in-out tracking-wide font-medium text-xs";

              // Conditionally apply a specific class based on the row index
              if (index === 0) {
                rowClass += " bg-gradient-to-r from-emerald-800 from-1% to-50% text-slate-200 font-bold";
              } else if (index === 1) {
                rowClass += " bg-gradient-to-r from-emerald-800 from-1% to-35% text-slate-200 font-bold";
              } else if (index === 2) {
                rowClass += " bg-gradient-to-r from-emerald-800 from-1% to-15% text-slate-200 font-bold";
              } else {
                rowClass += " bg-gray-800 text-gray-300";
              }

              return (
                <tr key={index} className={rowClass}>
                  <td className={"px-6 py-4 whitespace-nowrap"}>
                    { (index === 0) ? '🏆🏆🏆': (index === 1) ? '🏆🏆': (index === 2) ? '🏆': ''  }&nbsp;{data.user_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {data.total_bets_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {data.wins_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {data.win_rate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ₩ {(data.total_bets_amount).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {data.total_roi}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ₩ {(data.total_pnl).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="bg-gradient-to-t from-indigo-500/30 to-transparent">
                        <div className="w-full text-white mx-auto flex justify-center py-2">
                            <Pagination count={totalPages} page={page} onChange={handleChange} color="primary" size="small"/>
                        </div>
                    </div> 
      </div>
    </div> 
  
  </>
    
}


export default LeaderBoardsTable;
