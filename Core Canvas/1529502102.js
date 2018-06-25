var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),

    linearRadio = document.getElementById("linearRadio"),
    easeInRadio = document.getElementById("easeInRadio"),
    easeOutRadio = document.getElementById("easeOutRadio"),
    easeInOutRadio = document.getElementById("easeInOutRadio"),

    animateButton = document.getElementById("animateButton"),

    runnerCells = [
        {x: 0, y: 0, w: 53, h: 64},
        {x: 53, y: 0, w: 53, h: 64},
        {x: 106, y: 0, w: 53, h: 64},
        {x: 159, y: 0, w: 53, h: 64},
        {x: 212, y: 0, w: 53, h: 64},
        {x: 265, y: 0, w: 53, h: 64},
        {x: 318, y: 0, w: 53, h: 64},
        {x: 371, y: 0, w: 53, h: 64},
        {x: 424, y: 0, w: 53, h: 64},
    ],

    interval,
    lastAdvance = 0.0,
    SPRITE_LEFT = canvas.width - runnerCells[0].w;
    SPRITE_TOP = 10,

    PAGEFLIP_INTERVAL = 100,
    ANIMATION_DURATION = 3900,

    animationTimer = new AnimationTimer(ANIMATION_DURATION, AnimationTimer.makeLinear()),
    LEFT = 1.5,
    RIGHT = canvas.width - runnerCells[0].w,
    BASELINE = canvas.height - 9.5,
    TICK_HEIGHT = 8.5,
    WIDTH = RIGHT - LEFT,

    runInPlace = {
        execute: function(){
            var elapsed = animationTimer.getElapsedTime();
            if(lastAdvance === 0){
                lastAdvance = elapsed;
            }else if(lastAdvance !== 0 && elapsed - lastAdvance > PAGEFLIP_INTERVAL){
                sprite.painter.advance();
                lastAdvance = elapsed;
            }
        }
    },

    moveRightToLeft = {
        lastMove: 0,
        reset: function(){
            this.lastMove = 0;
        },
        execute: function(sprite, context, time){
            var elapsed = animationTimer.getElapsedTime(),
                advanceElapsed = elapsed - this.lastMove;

            if(this.lastMove === 0){
                this.lastMove = elapsed;
            }else{
                sprite.left -= (advanceElapsed / 1000) * sprite.velocityX;
                this.lastMove = elapsed;
            }
        }
    },
    runnerSrc = "image/sprite.jpg";
    sprite = new Sprite('runner', new SpriteSheetPainter(runnerSrc, runnerCells), [moveRightToLeft, runInPlace]);

// functions
function endAnimation(){
    animateButton.value = "Animate";
    animateButton.style.diaplay = 'inline';
    animationTimer.end();
    lastAdvance = 0;
    sprite.painter.cellIndex = 0;
    sprite.left = SPRITE_LEFT;
    animationTimer.reset();
    moveRightToLeft.reset();
}

function startAnimation(){
    animationTimer.start();
    animateButton.style.diaplay = "none";
    window.requestAnimationFrame(animate);
}

function drawAxis(){
    context.lineWidth = 0.5;
    context.strokeStyle = 'cornflowerblue';
    context.beginPath();
    context.moveTo(LEFT, BASELINE);
    context.lineTo(RIGHT, BASELINE);
    context.stroke();

    for(var i=0; i<=WIDTH; i+=WIDTH/20){
        context.beginPath();
        context.moveTo(LEFT + i, BASELINE - TICK_HEIGHT/2);
        context.lineTo(LEFT + i, BASELINE + TICK_HEIGHT/2);
        context.stroke();
    }

    for(i=0; i<WIDTH; i+=WIDTH/4){
        context.beginPath();
        context.moveTo(LEFT + i, BASELINE - TICK_HEIGHT);
        context.lineTo(LEFT + i, BASELINE + TICK_HEIGHT);
        context.stroke();
    }

    context.beginPath();
    context.moveTo(RIGHT, BASELINE - TICK_HEIGHT);
    context.lineTo(RIGHT, BASELINE + TICK_HEIGHT);
    context.stroke();
}

function drawTimeLine(){
    var realElapsed = animationTimer.getRealElapsedTime(),
        realPercent = realElapsed / ANIMATION_DURATION;

    context.lineWidth = 0.5;
    context.strokeStyle = "rgba(0, 0, 255, 0.5)";
    context.beginPath();
    context.moveTo(WIDTH - realPercent*WIDTH, 0);
    context.lineTo(WIDTH - realPercent*WIDTH, canvas.height);
    context.stroke();
}

// event handler
animateButton.onclick = function(e){
    if(animateButton.value === 'Animate'){
        startAnimation();
    }else{
        endAnimation();
    }
};

linearRadio.onclick = function(e){
    animationTimer.timeWrap = AnimationTimer.makeLinear(1);
};

easeInRadio.onclick = function(e){
    animationTimer.timeWrap = AnimationTimer.makeEaseIn(1);
};

easeOutRadio.onclick = function(e){
    animationTimer.timeWrap = AnimationTimer.makeEaseOut(1);
};

easeInOutRadio.onclick = function(e){
    animationTimer.timeWrap = AnimationTimer.makeEaseInOut();
};

// animation
function animate(time){
    if(animationTimer.isRunning()){
        time = +new Date();
        elapsed = animationTimer.getElapsedTime();
        context.clearRect(0, 0, canvas.width, canvas.height);
        sprite.update(context, time);
        sprite.paint(context);

        drawTimeLine();
        drawAxis();

        if(animationTimer.isOver()){
            endAnimation();
        }
        window.requestAnimationFrame(animate);
    }
}

// initialization
sprite.left = SPRITE_LEFT;
sprite.top = SPRITE_TOP;
sprite.velocityX = 100;

drawAxis();
// context.beginPath();
// context.moveTo(0, 0);
// context.lineTo(100, 30);
// context.strokeStyle = "black";
// context.stroke();