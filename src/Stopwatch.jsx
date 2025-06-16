import React, {useState, useEffect,useRef} from "react"
function Stopwatch(){
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [laps, setLaps] = useState(1);
    const [lapTimes, setLapTimes] = useState([]);
    const [buttonText, setButtonText] = useState("Start");
    const intervalIdRef  =useRef(null);
    const startTimeRef = useRef(0);
    const lapTimeRef = useRef(0);
    let overallTime = useRef(0);

    useEffect(()=>{
        if(isRunning){
            intervalIdRef.current = setInterval(()=>{
                setElapsedTime(Date.now()-startTimeRef.current);
            },10)
        }

        return() => {
            clearInterval(intervalIdRef.current);
        }
    }, [isRunning]);

    function start(){
        setIsRunning(true);
        startTimeRef.current = Date.now()-elapsedTime;
        setButtonText("Resume");
    }

    function stop(){
        setIsRunning(false);
    }

    function reset(){
        setElapsedTime(0);
        setIsRunning(false);
        setButtonText("Start");
        setLapTimes([]);
        setLaps(1);
        lapTimeRef.current = 0;
        overallTime.current = 0;
    }
    function lap(){
        if(!isRunning) return;

        const lapTime = elapsedTime - lapTimeRef.current;
        setLapTimes(prev => [...prev, 
            {
                lapNumber: laps,
                lapTime: formatTime(lapTime),
                overallTime: formatTime(elapsedTime)
            }
        ]);
        setLaps(laps+1);
        lapTimeRef.current = elapsedTime;
        overallTime.current = elapsedTime;
        
    }

    function formatTime(time){
        let hours = Math.floor(time/(1000*60*60));
        let minutes = Math.floor(time/(1000*60)%60);
        let seconds = Math.floor(time/(1000)%60);
        let milliseconds = Math.floor(time %1000/10);

        hours = String(hours).padStart(2,"0");
        minutes = String(minutes).padStart(2,"0");
        seconds = String(seconds).padStart(2,"0");
        milliseconds = String(milliseconds).padStart(2,"0");

        return `${hours}:${minutes}:${seconds}.${milliseconds}`;
    }

    return(<><div className="stopwatch">
        <div className="display">{formatTime(elapsedTime)}</div>
        <div className="controls">
            <button onClick= {start} className="start-button">{buttonText}</button>
            <button onClick= {stop}className="stop-button">Stop</button>
            <button onClick= {reset}className="reset-button">Reset</button>
            <button onClick = {lap} className = "lap-button">Lap</button>
        </div>


    </div>
    <div className="lapsContainer">
    <div className = "laps">
            <h2>Lap #</h2>
            <h2> Lap Time</h2>
            <h2>Overall Time</h2>        
    </div>
    {lapTimes.map((lap, idx) => (
                <div className="lap" key={idx}>
                    <h2>{lap.lapNumber}</h2>
                    <h2>{lap.lapTime}</h2>
                    <h2 id="time">{lap.overallTime}</h2><br></br><br></br>
                </div>
            ))}
    </div>
    </>)
}

export default Stopwatch