import { useState, useEffect } from 'react'; 
import { useStore } from '../states/store';
import HLBackendV1Api from '../utils/http/api';


export default function DrawHistory() {

    const { timerStatus } = useStore();
    const [ drawResults, setDrawResults ] = useState([])

    const getchDrawResults = async() => {
        try {
            await HLBackendV1Api.get(`${process.env.BACKEND_API_URL}/hl-game-management/history-listings-by-result?page=0&limit=8`)
            .then((response) => { 
                setDrawResults(response.data);
            });
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getchDrawResults();

        return () => {

        }
    }, [timerStatus]);



    return <>
        <div className={"flex flex-row justify-end text-center gap-1 w-full p-2 max-sm:justify-start max-sm:w-dvw"}>
            { drawResults.map(result => (
                <div key={result.id} className={""}>
                    { result.result === 'up' && (
                        <div className="tooltip animate-on-load bg-gradient-to-t from-emerald-900 from-10% to-80% h-10 w-10 flex items-center justify-center rounded-xl border-2 border-slate-600 aspect-square text-green-500 drop-shadow-md max-sm:h-8 max-sm:w-8">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                    )}
                    { result.result === 'down' && (
                        <div className="animate-on-load bg-gradient-to-t from-pink-900 from-10% to-80% h-10 w-10 flex items-center justify-center rounded-xl border-2 border-slate-600 aspect-square text-pink-500 drop-shadow-md max-sm:h-8 max-sm:w-8">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                    )}
                    { result.result === 'draw' && (
                        <div className="animate-on-load bg-gradient-to-t from-amber-900 from-10% to-80% h-10 w-10 flex items-center justify-center rounded-xl border-2 border-slate-600 aspect-square text-yellow-500 drop-shadow-md max-sm:h-8 max-sm:w-8">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                    )}
                </div>
            ))}
        </div>
    </>
}