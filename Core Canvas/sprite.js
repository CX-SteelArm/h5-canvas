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
    this.width = 32;
    this.height = 32;
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

// stroke and fill painter
var ballPainter = {
    paint: function(sprite, context){
        context.save();
        // do something
        context.restore();
    }
}

// image painter
var imagePainter = function(imageUrl){
    this.image = new Image();
    this.image.src = imageUrl;
};

imagePainter.prototype = {
    paint: function(sprite, context){
        if(this.image.complete){
            context.drawImage(this.image, sprite.left, sprite.top, sprite.width, sprite.height);
        }
    }
};

// sprite sheet painter
var SpriteSheetPainter = function(imageUrl, cells){
    this.cells = cells || [];
    this.cellIndex = 0;
    this.image = new Image();
    this.image.src = imageUrl;
}

SpriteSheetPainter.prototype = {
    advance: function(){
        if(this.cellIndex === this.cells.length - 1){
            this.cellIndex = 0;
        }else{
            this.cellIndex ++;
        }
    },
    paint: function(sprite, context){
        if(this.image.complete){
            var cell = this.cells[this.cellIndex];
            context.drawImage(this.image, cell.x, cell.y, cell.w, cell.h, sprite.left, sprite.top, sprite.width, sprite.height);
        }
    }
};