import React, { useEffect, useState, useRef } from "react";
import HLBackendV1Api from '../utils/http/api';
import { useStore } from './../states/store';
import moment from 'moment';
import DataTableNoData from "./DataTableNoData";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

function HistoricalPositionTable() {

    const [historicalBets, setHistoricalBets] = useState([]); // ref
    const { timerStatus } = useStore();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1); // ref
    const limit = 10

    // fields
     const [isOpen, setIsOpen] = useState(false);
     const [selectedOptions, setSelectedOptions] = useState([]);

    // Ref to the dropdown container to detect clicks outside
    const dropdownRef = useRef(null);

    // Function to toggle the dropdown's visibility
    const toggleDropdown = () => {
        setIsOpen(prev => !prev);
        setIsOpen2(false)
    };
    //

    // status
    const options = ['all', 'win', 'loss', 'draw'];
    const [selected, setSelected] = useState(options[0]);
    const [isOpen2, setIsOpen2] = useState(false);

    const toggleDropdown2 = () => {
        setIsOpen(false)
        setIsOpen2(!isOpen2)
    };

    const handleSelect = (option) => {
        setSelected(option);
        setIsOpen2(false);
    };

    //



    const getHistoricalBetsData = async() => {
        try {
            await HLBackendV1Api.get(`${process.env.BACKEND_API_URL}/betting-management/user-transaction-history?status=${selected}&skip=0&take=10`)
            .then((response) => { 
                setHistoricalBets(response.data.results);
                setTotalPages(response.data.totalPageCount)
            });
        } catch (error) {
            console.log(error)
        }
    }

    const handleChange = async(event, value) => {

        let offset = (value - 2)  * limit + 10;
        setPage(value)

        await HLBackendV1Api.get(`${process.env.BACKEND_API_URL}/betting-management/user-transaction-history?status=${selected}&skip=${offset}&take=10`)
        .then(function (response) {
            console.log(response)
            setHistoricalBets(response.data.results);
            setTotalPages(response.data.totalPageCount)

            // if(offset === 0 && props.timerStatus !== 'betting_open') {
            //     results.current = currentDayIndex;
            // } else {
            //     results.current = response.data.results;
            // }
        })
        .catch(function (error) {
            console.log(error);
        })

        
    };

  // NEW: Function to handle checkbox changes
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setSelectedOptions(prevSelectedOptions => {
      if (checked) {
        // Add the value if the checkbox is checked
        return [...prevSelectedOptions, value];
      } else {
        // Remove the value if the checkbox is unchecked
        return prevSelectedOptions.filter(option => option !== value);
      }
    });
  };

  useEffect(() => {
    getHistoricalBetsData();

    const handleClickOutside = (event) => {
      // If the click is outside the dropdown container, close it
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mouseDown', handleClickOutside);
    return () => {
        document.removeEventListener('mouseDown', handleClickOutside);
    }
  },[selected])
    
    return <>
        { (historicalBets && historicalBets.length > 0) && 
        <div className="w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden h-full">  
            <div className="overflow-x-scroll">
                
                <div className="w-full controls-container p-2 flex flex-row gap-2">
                     {/* test TODO: separate component */}
                    <div className="relative inline-block text-left" ref={dropdownRef}>
                        {/* Dropdown Button */}
                        <button
                            id="dropdownButton"
                            type="button"
                            onClick={toggleDropdown} // Use onClick to toggle state
                            className="btn inline-flex justify-center items-center gap-x-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition duration-200"
                            aria-expanded={isOpen} // Reflect current state in aria-expanded
                            aria-haspopup="true"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                <path fillRule="evenodd" d="M6.455 1.45A.5.5 0 0 1 6.952 1h2.096a.5.5 0 0 1 .497.45l.186 1.858a4.996 4.996 0 0 1 1.466.848l1.703-.769a.5.5 0 0 1 .639.206l1.047 1.814a.5.5 0 0 1-.14.656l-1.517 1.09a5.026 5.026 0 0 1 0 1.694l1.516 1.09a.5.5 0 0 1 .141.656l-1.047 1.814a.5.5 0 0 1-.639.206l-1.703-.768c-.433.36-.928.649-1.466.847l-.186 1.858a.5.5 0 0 1-.497.45H6.952a.5.5 0 0 1-.497-.45l-.186-1.858a4.993 4.993 0 0 1-1.466-.848l-1.703.769a.5.5 0 0 1-.639-.206l-1.047-1.814a.5.5 0 0 1 .14-.656l1.517-1.09a5.033 5.033 0 0 1 0-1.694l-1.516-1.09a.5.5 0 0 1-.141-.656L2.46 3.593a.5.5 0 0 1 .639-.206l1.703.769c.433-.36.928-.65 1.466-.848l.186-1.858Zm-.177 7.567-.022-.037a2 2 0 0 1 3.466-1.997l.022.037a2 2 0 0 1-3.466 1.997Z" clipRule="evenodd" />
                            </svg>

                            {/* Dropdown Arrow Icon */}
                            {/* <svg className="-mr-1 h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                            </svg> */}
                        </button>

                        {/* Dropdown Panel */}
                        <div
                            id="dropdownPanel"
                            // Dynamically apply classes based on 'isOpen' state
                            className={`absolute  rounded-md bg-slate-900 shadow-lg ring-1 ring-slate-600 focus:outline-none w-50 mt-2
                                        dropdown-transition ${isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none z-20'}`}
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="dropdownButton"
                            tabIndex="-1">
                                <div className="py-1" role="none">
                                    {/* Checkbox Option 1 */}
                                    <label className="flex items-center px-4 py-2 text-sm text-slate-300 font-bold hover:bg-indigo-900 cursor-pointer" role="menuitem" tabIndex="-1">
                                        <input type="checkbox" name="option1" value="entry_price" className="h-4 w-4 text-slate-900 border-gray-300 rounded focus:ring-blue-900 mr-2 checkbox checkbox-info checkbox-sm" onChange={handleCheckboxChange}/>
                                        Show Entry Price
                                    </label>
                                    {/* Checkbox Option 2 */}
                                    <label className="flex items-center px-4 py-2 text-sm text-slate-300 font-bold hover:bg-indigo-900 cursor-pointer" role="menuitem" tabIndex="-1">
                                        <input type="checkbox" name="option2" value="exit_price" className="h-4 w-4 text-slate-900 border-gray-300 rounded focus:ring-blue-900 mr-2 checkbox checkbox-info checkbox-sm" onChange={handleCheckboxChange} />
                                        Show Exit Price
                                    </label>
                                    {/* Checkbox Option 3 */}
                                    <label className="flex items-center px-4 py-2 text-sm text-slate-300 font-bold hover:bg-indigo-900 cursor-pointer" role="menuitem" tabIndex="-1">
                                        <input type="checkbox" name="option3" value="id" className="h-4 w-4 text-slate-900 border-gray-300 rounded focus:ring-blue-900 mr-2 checkbox checkbox-info checkbox-sm" onChange={handleCheckboxChange} />
                                        Show ID
                                    </label>
                                    {/* Checkbox Option 4 */}
                                    <label className="flex items-center px-4 py-2 text-sm text-slate-300 font-bold hover:bg-indigo-900 cursor-pointer" role="menuitem" tabIndex="-1">
                                        <input type="checkbox" name="option4" value="created_at" className="h-4 w-4 text-slate-900 border-gray-300 rounded focus:ring-blue-900 mr-2 checkbox checkbox-info checkbox-sm" onChange={handleCheckboxChange} />
                                        Show Time
                                    </label>
                                </div>
                        </div>
                    </div>
                    {/* end test */}
                    <div className="relative inline-block text-left w-1/4 max-sm:w-full">

                        {/* Dropdown Button */}
                        <button
                            type="button"
                            className="w-full px-4 py-2 bg-primary border border-gray-300 rounded-md shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-transparent"
                            onClick={toggleDropdown2}
                        >
                            <span className="capitalize font-bold">{selected}</span>
                            {/* <span className="float-right">&#9662;</span> */}
                        </button>

                        {/* Dropdown Menu */}
                        {isOpen2 && (
                            <div className="origin-top-right absolute mt-2 w-full rounded-md shadow-lg bg-slate-900 ring-1 ring-black ring-opacity-5 z-10">
                                <div className="py-1 max-h-60 overflow-y-auto" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                    {options.map((option) => (
                                    <label
                                        key={option}
                                        className="flex items-center px-4 py-2 text-sm text-slate-300 font-bold hover:bg-indigo-900 cursor-pointer"
                                    >
                                        <input
                                        type="radio"
                                        className="form-radio text-indigo-600 mr-2 radio radio-accent"
                                        name="dropdown-radio"
                                        value={option}
                                        checked={selected === option}
                                        onChange={() => handleSelect(option)}
                                        />
                                        <span className="capitalize">{option}</span>
                                    </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative inline-block text-left w-1/4 max-sm:w-full">
                        <button className="btn btn-primary" onClick={getHistoricalBetsData}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                <path fillRule="evenodd" d="M13.836 2.477a.75.75 0 0 1 .75.75v3.182a.75.75 0 0 1-.75.75h-3.182a.75.75 0 0 1 0-1.5h1.37l-.84-.841a4.5 4.5 0 0 0-7.08.932.75.75 0 0 1-1.3-.75 6 6 0 0 1 9.44-1.242l.842.84V3.227a.75.75 0 0 1 .75-.75Zm-.911 7.5A.75.75 0 0 1 13.199 11a6 6 0 0 1-9.44 1.241l-.84-.84v1.371a.75.75 0 0 1-1.5 0V9.591a.75.75 0 0 1 .75-.75H5.35a.75.75 0 0 1 0 1.5H3.98l.841.841a4.5 4.5 0 0 0 7.08-.932.75.75 0 0 1 1.025-.273Z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>

                </div>
               
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                        <tr>
                        <th scope="col" className={"px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider "+(selectedOptions.includes('id') ? "visible": "hidden")}>
                            #
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Result
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Type
                        </th>
                        <th scope="col" className={"px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider "+(selectedOptions.includes('created_at') ? "visible": "hidden")}>
                            Time
                        </th>
                        
                        <th scope="col" className={"px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider "+(selectedOptions.includes('entry_price') ? "visible": "hidden")}>
                            Entry Price
                        </th>
                        <th scope="col" className={"px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider "+(selectedOptions.includes('exit_price') ? "visible": "hidden")}>
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
                        <tr key={bet.id} className={" hover:cursor-pointer transition duration-150 ease-in-out text-gray-300 tracking-wide font-medium text-xs "+(bet.status == "win" ? "bg-gradient-to-r from-emerald-600 from-1% to-10%": bet.status == "loss" ? "bg-gradient-to-r from-pink-600 from-1% to-10%": "bg-gradient-to-r from-amber-900 from-1% to-10%") }>
                            <td className={"px-6 py-4 whitespace-nowrap "+(selectedOptions.includes('id') ? "visible": "hidden")}>
                                { bet.id }
                            </td>
                            <td className={"px-5 py-2 whitespace-nowrap text-sm capitalize "+(bet.status == "win" ? "text-green-300": bet.status == "loss" ? "text-pink-300": "text-amber-300")}>
                                { bet.status }
                            </td>
                                <td className={"px-5 py-2 whitespace-nowrap capitalize "+(bet.user_bets == "up" ? "text-green-300": "text-pink-300")}>
                                { bet.user_bets }
                            </td>
                            <td className={"px-5 py-2 whitespace-nowrap "+(selectedOptions.includes('created_at') ? "visible": "hidden")}>
                                { moment(bet.createdAt).format('MMMM Do YYYY, h:mm:ss a') }
                            </td>
                            
                            <td className={"px-5 py-2 whitespace-nowrap "+(selectedOptions.includes('entry_price') ? "visible": "hidden")}>
                                { bet.ud_game.draw_open_price }
                            </td>
                            <td className={"px-5 py-2 whitespace-nowrap "+(selectedOptions.includes('exit_price') ? "visible": "hidden")}>
                                { bet.ud_game.draw_close_price }
                            </td>
                            <td className="px-5 py-2 whitespace-nowrap text-sm">
                                ₩&nbsp;{ (+bet.amount).toLocaleString() }
                            </td>
                            <td className={"px-5 py-2 whitespace-nowrap text-sm "+(bet.status == "win" ? "text-green-300": bet.status == "loss" ? "text-pink-300": "text-amber-300")}>
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
            <div className="bg-gradient-to-t from-indigo-500/30 to-transparent">
                <div className="w-full text-white mx-auto flex justify-center py-2">
                    <Pagination count={totalPages} page={page} onChange={handleChange} color="primary" size="small"/>
                </div>
            </div> 
        </div>
        }
        { (!historicalBets || !historicalBets.length) &&  
            <DataTableNoData />
        }       
    </>
}

export default HistoricalPositionTable;