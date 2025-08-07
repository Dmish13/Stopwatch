import React, {useState, useEffect,useRef} from "react"
function Stopwatch(){
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [laps, setLaps] = useState(1);
    const [lapTimes, setLapTimes] = useState([]);
    const [buttonText, setButtonText] = useState("Start");
    const [startButtonColor, setStartButtonColor] = useState("green");
    const [stopButtonColor, setStopButtonColor] = useState("gray");
    const [resetButtonColor, setResetButtonColor] = useState("gray");
    const [lapButtonColor, setLapButtonColor] = useState("gray");
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
        setStartButtonColor("gray"); // Set to gray when running
        setStopButtonColor("red");
        setResetButtonColor("blue");
        setLapButtonColor("black");
        
    }

    function stop(){
        if(isRunning){
            setIsRunning(false);
            setButtonText("Resume");
            setStartButtonColor("green");
            setStopButtonColor("gray");
            setLapButtonColor("gray");
        }
         // Reset to green when stopped
    }

    function reset(){
        setElapsedTime(0);
        setButtonText("Start");
        setResetButtonColor("gray");
        setIsRunning(false);
        setStartButtonColor("green");
        setStopButtonColor("gray");
        setLapButtonColor("gray");
        setLapTimes([]);
        setLaps(1);
        lapTimeRef.current = 0;
        overallTime.current = 0;
        
    }
    function lap(){
        if(!isRunning) return;

    
        const lapTime = elapsedTime - lapTimeRef.current;
        setLapTimes(prev => [ 
            {
                lapNumber: laps,
                lapTime: formatTime(lapTime),
                overallTime: formatTime(elapsedTime)
            },
            ...prev
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
            <button onClick= {start} className="start-button" style = {{backgroundColor : startButtonColor}}>{buttonText}</button>
            <button onClick= {stop}className="stop-button" style = {{backgroundColor : stopButtonColor}}>Stop</button>
            <button onClick= {reset}className="reset-button" style = {{backgroundColor : resetButtonColor}}>Reset</button>
            <button onClick = {lap} className = "lap-button" style = {{backgroundColor : lapButtonColor}}>Lap</button>
        </div>


    </div>
    {lapTimes.length>0 && (
    <div className="lapsContainer">
    <div className = "laps">
        <div className = "lap-header">
            <span>Lap #</span>
            <span> Lap Time</span>
            <span>Overall Time</span><br></br><br></br>
        </div>
            {lapTimes.map((lap, idx) => (
                <div className="lap" key={idx}>
                    <span>{lap.lapNumber}</span>
                    <span>{lap.lapTime}</span>
                    <span id="time">{lap.overallTime}</span><br></br><br></br>
                </div>
            ))}        
    </div>
    
    </div>
    )}
    </>)
}

export default Stopwatch