// stopwatch
var Stopwatch = function(){};
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
};

// animationTimer
var AnimationTimer = function(duration, timeWrap){
    this.duration = duration;
    if(timeWrap !== undefined){
        this.timeWrap = timeWrap;
    }
    this.stopwatch = new Stopwatch();
};

AnimationTimer.prototype = {
    start: function(){
        this.stopwatch.start();
    },
    end: function(){
        this.stopwatch.stop();
    },
    isRunning: function(){
        return this.stopwatch.isRunning();
    },
    getRealElapsedTime: function(){
        return this.stopwatch.getElapsedTime();
    },
    getElapsedTime: function(){
        var elapsedTime = this.getRealElapsedTime(),
            percentComplete = elapsedTime / this.duration;
        if(!this.stopwatch.running){
            return undefined;
        }
        if(this.timeWrap == undefined){
            return elapsedTime;
        }else{
            return elapsedTime * (this.timeWrap(percentComplete) / percentComplete);
        }
        
    },
    isOver: function(){
        return this.stopwatch.getElapsedTime() > this.duration;
    },
    reset: function(){
        this.stopwatch.reset();
    }
};

AnimationTimer.makeEaseIn = function(strength){
    return function(percentComplete){
        return Math.pow(percentComplete, strength*2);
    };
};

AnimationTimer.makeEaseOut = function(strength){
    return function(percentComplete){
        return 1 - Math.pow(1 - percentComplete, strength*2);
    };
};

AnimationTimer.makeEaseInOut = function(strength){
    return function(percentComplete){
        return percentComplete - Math.sin(percentComplete*2*Math.PI) / (2*Math.PI);
    };
};

var DEFAULT_ELASTIC_PASSES = 3;

AnimationTimer.makeElastic = function(passes){
    passes = passes || DEFAULT_ELASTIC_PASSES;
    return function(percentComplete){
        return ((1-Math.cos(percentComplete*passes*Math.PI)) * (1-percentComplete)) + percentComplete;
    };
};

AnimationTimer.makeBounce = function(bounces){
    var fn = AnimationTimer.makeElastic(bounces);
    return function(percentComplete){
        percentComplete = fn(percentComplete);
        return percentComplete <= 1 ? percentComplete : 2-percentComplete;
    };
};

AnimationTimer.makeLinear = function(){
    return function(percentComplete){
        return percentComplete;
    };
};