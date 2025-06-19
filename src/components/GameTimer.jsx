import { useEffect, useRef, useState } from 'react';
import { useStore } from '../states/store';
import HLBackendV1 from '../utils/socket/HL_backend_v1';

function GameTimer() {
    const { timerStatus, setTimerStatus } = useStore();
    const [formattedTime, setFormattedTime] = useState(null);
    const [timer, setTimer] = useState(null);
    const [progressBarWidth, setProgressBarWidth] = useState(null);
    const [bettingOpenFontColor, setBettingOpenFontColor] = useState(null)
    const [bettingOpenAnimation, setBettingOpenAnimation] = useState(null)

    useEffect(() => {
        const socket = HLBackendV1.getInstance('/hl_timer').getSocket();

        socket.on('connect', () => {
            socket.on('emitter', onFetchData);
        });

        return () => {
            socket.off('connect');
            socket.off('emitter');
        }

    }, []);

    const onFetchData = (response) => {
        setTimerStatus(response.timer_status);
        setFormattedTime(response.formatted_time);
        setTimer(response.timer)

        setProgressBarWidth(100);
        setBettingOpenFontColor('text-success')
        setBettingOpenAnimation('animate-none')
        if(response.timer_status == "betting_open") {
            let progress_bar_width = 100 - ((response.time_limit - response.timer) / response.time_limit) * 100;
            setProgressBarWidth(progress_bar_width);

            let orange_text = response.time_limit / 2;
            let red_text = orange_text / 2;

            if(response.timer < orange_text && response.timer >= red_text) {
                setBettingOpenFontColor('text-warning')
            }

            if(response.timer < red_text) {
                setBettingOpenFontColor('text-secondary')
                setBettingOpenAnimation('animate-ping')
            }
        }
    }

    return <>
        <div className={"radial-progress " + bettingOpenFontColor} style={{ "--value": progressBarWidth, "--size": "6rem", "--thickness": "0.8rem" }} aria-valuenow={70} role="progressbar">
            {(timerStatus == "betting_open") && <div className="flex flex-col">
                {/* <span className="countdown font-semibold text-2xl">
                    <span style={{"--value":timer, "--size": "12rem" }} aria-live="polite" aria-label={timer}></span>
                </span> */}
                <span className={"font-bold text-3xl "+bettingOpenAnimation}>
                    {timer}
                </span>
                <span className={"text-sm font-light"}>Sec</span>
            </div>}

            {(timerStatus !== "betting_open") && <span className="loading loading-bars loading-xl"></span>}
            
        </div>
    </>
}

export default GameTimer;