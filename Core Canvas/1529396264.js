// Sprite
var Sprite = function(name, painter, behaviors){
    if(name !== undefined){
        this.name = name;
    }
    if(painter !== undefined){
        this.painter = painter;
    }
    this.top = 0;
    this.left = 0;
    this.width = 0;
    this.height = 0;
    this.velocityX = 0;
    this.velocityY = 0;
    this.visible = true;
    this.animating = false;
    this.behaviors = behaviors || [];

    return this;
};

Sprite.prototype = {
    paint: function(context){
        if(this.painter && this.visible){
            this.painter.paint(this, context)
        }
    },
    update: function(context, time){
        for(var i=0; i<this.behaviors.length; i++){
            this.behaviors[i].execute(this, context, time);
        }
    }
};

// SpriteSheet
var SpriteSheetPainter = function(imageUrl, cells){
    this.image = new Image();
    this.image.src = imageUrl;
    this.cells = cells || [];
    this.cellIndex = 0;
    return this;
}

SpriteSheetPainter.prototype = {
    advance: function(){
        if(this.cellIndex == this.cells.length-1){
            this.cellIndex = 0;
        }else{
            this.cellIndex ++;
        }
    },

    paint: function(sprite, context){
        var cell = this.cells[this.cellIndex];
        if(this.image.complete){
            context.drawImage(this.image, cell.x, cell.y, cell.w, cell.h, sprite.left, sprite.top, sprite.width, sprite.height);
        }
    }
};

var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
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
    runnerSrc = "image/sprite.jpg",
    runInPlace = {
        lastAdvance: 0,
        PAGEFLIP_INTERVAL: 100,
        execute: function(sprite, context, time){
            if(time - this.lastAdvance > this.PAGEFLIP_INTERVAL){
                sprite.painter.advance();
                this.lastAdvance = time;
            }
        }
    },
    moveLeftToRight = {
        lastMove: 0,
        execute: function(sprite, context, time){
            if(this.lastMove !== 0){
                sprite.left -= sprite.velocityX * ((time - this.lastMove) / 1000);
                if(sprite.left < -53){
                    sprite.left = canvas.width;
                }
            }
            this.lastMove = time;
        }
    },
    sprite = new Sprite('runner', new SpriteSheetPainter(runnerSrc, runnerCells), [runInPlace, moveLeftToRight]),
    interval,
    lastAdvance = 0,
    paused = false,
    INTERVAL = 100;

// functions
// function startAnimation(){
//     animateButton.value = "Pause";
//     paused = false;
//     lastAdvance = +new Date();
//     window.requestAnimationFrame(animate);
// }

// function pauseAnimation(){
//     animateButton.value = "Animate";
//     paused = true;
// }

function drawBackground(){
    var STEP_Y = 12,
        i = context.canvas.height;
    while(i > STEP_Y*4){
        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(context.canvas.width, i);
        context.stroke();
        i -= STEP_Y;
    }
}
// event handlers
// animateButton.onclick = function(){
//     if(animateButton.value === "Animate"){
//         startAnimation();
//     }else{
//         pauseAnimation();
//     }
// }

// animation
function animate(time){
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    time = +new Date();
    sprite.update(context, time)
    sprite.paint(context);
    // if(time - lastAdvance > INTERVAL){
    //     sprite.painter.advance();
    //     lastAdvance = time;
    // }
    window.requestAnimationFrame(animate);
}

// initialization
sprite.left = 200;
sprite.top = 100;
sprite.width = 53;
sprite.height = 64;
sprite.velocityX = 50;
context.strokeStyle = "lightgray";
context.lineWidth = 0.5;
drawBackground();

sprite.painter.image.onload = function(){
    window.requestAnimationFrame(animate);
}