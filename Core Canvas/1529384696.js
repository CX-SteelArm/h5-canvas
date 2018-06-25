// stopwatch
Stopwatch = function(){ };
Stopwatch.prototype = {
    startTime: 0,
    running: false,
    elapsed: undefined,
    start: function(){
        this.startTime = +new Date();
        this.elapsedTime = undefined;
        this.running = true;
    },
    stop: function(){
        this.elapsed = +new Date() - this.startTime;
        this.running = false;
    },
    isRunning: function(){
        return this.running;
    },
    getElapsedTime: function(){
        if(this.running){
            return +new Date() - this.startTime;
        }else{
            return this.elapsed;
        }
    },
    reset: function(){
        this.elapsed = 0;
    }
}

var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    // magicCheckbox = document.getElementById("magicCheckbox"),
    stopwatch = new Stopwatch(),
    secondsInput = document.getElementById("secondsInput"),
    startStopButton = document.getElementById("startStopButton"),
    timerSetting = null;

// functions
function animate(){
    if(stopwatch.isRunning() && stopwatch.getElapsedTime() > timerSetting * 1000){
        stopwatch.stop();
        startStopButton.value = "Start";
        startStopButton.disabled = false;
        secondsInput.value = 0;
    }else if(stopwatch.isRunning()){
        redraw();
        requestAnimationFrame(animate);
    }
}

function redraw(){
    context.save();
    context.fillStyle = "#fff";
    context.fillRect(100, 100, 300, 200)
    context.strokeStyle = "#35c";
    context.lineWidth = 1;
    context.font = "50px Arial";
    context.strokeText(stopwatch.getElapsedTime(), 100, 200);
    context.restore();
}

// event handlers
startStopButton.onclick = function(){
    var value = startStopButton.value;
    if(value === "Start"){
        stopwatch.start();
        timerSetting = parseFloat(secondsInput.value);
        startStopButton.value = "Stop";
        window.requestAnimationFrame(animate);
        startStopButton.disabled = true;
    }
    stopwatch.reset();
}

// initialization
