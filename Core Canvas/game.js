var Game = function(gameName, canvasId){
    var canvas = document.getElementById(canvasId),
        self = this;

    // General
    this.context = canvas.getContext("2d");
    this.sprites = [];

    // Time
    this.startTime = 0;
    this.lastTime = 0;
    this.gameTime = 0;
    this.fps = 0;
    this.STARTING_FPS = 60;

    this.paused = false;
    this.startedPauseAt = 0;
    this.PAUSE_TIMEOUT = 100;

    // Image load progress
    this.imageLoadingProgressCallback;
    this.images = [];
    this.imageUrls = [];
    this.imageLoaded = 0;
    this.imageFailedToLoad = 0;
    this.imagesIndex = 0;

    // Audio and Sound
    this.soundOn = true;
    this.soundChannels = [];
    this.audio = new Audio();
    this.NUM_AUDIO_CHANNELS = 10;

    for(var i=0; i<NUM_AUDIO_CHANNELS; i++){
        var audio = new Audio();
        this.soundChannels.push(audio);
    }

    // KeyListeners
    this.keyListeners = [];

    // High score
    this.HIGH_SCORE_SUFFIX = '_highscores';
};

// Game methods
Game.prototype = {
    // Game loop
    start: function(){
        var self = this;
        this.startTime = getTimeNow();

        // start the animation
        window.requestAnimationFrame(){
            function(time){
                self.animate.call(self, time);
            }
        };
    },

    // the game's animation
    animate: function(time){
        var self = this;

        if(this.paused){
            // In PAUSE_TIMEOUT ms, call this method again
            setTimeout(function(){
                self.animate.call(self, time);
            }, this.PAUSE_TIMEOUT)
        }else{
            this.tick(time);/* update time*/
            this.clearScreen();

            this.startAnimate();
            this.paintUnderSprites();/*backgrounds*/

            this.updateSprites(time);
            this.paintSprites(time);

            this.paintOverSprites();
            this.endAnimate();

            window.requestAnimationFrame(function(time){
                self.animate.call(self, time);
            });
        }
    },

    // update FPS, gametime and lastTime
    tick: function(time){
        this.updateFrameRate(time);
        this.gameTime = time - this.startTime;
        this.lastTime = time;
    },

    // toggle pause and start; startedPauseAt keeps the paused time,
    // when toggle start, startTime and endTime will change
    togglePaused: function(){
        var now = getTimeNow();

        this.paused = !this.paused;
        if(this.paused){
            this.startedPauseAt = now;
        }else{
            this.startTime += now - this.startedPauseAt;
            this.lastTime = now;
        }
    },

    pixelsPerFrame: function(time, velocity){
        // velocity: pixels/second, fps: frames/second
        return velocity / this.fps;
    },

    updateFrameRate: function(time){
        if(lastTime === 0){
            this.fps = this.STARTING_FPS;
        }else{
            this.fps = 1000 / (time - this.lastTime)
        }
    },

    clearScreen: function(){
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    },

    updateSprites: function(time){
        for(var i=0; i<this.sprites.length; i++){
            var sprite = sprites[i];
            sprite.update(this.context, time);
        }
    },

    paintSprites: function(time){
        for(var i=0; i<this.sprites.length; i++){
            var sprite = sprites[i];
            if(sprite.visible){
                sprite.paint(this.context);
            }
        }
    },

    startAnimate: function(time){},

    paintUnderSprites: function(){},

    paintOverSprites: function(){},

    endAnimate: function(time){},

    // Image methods
    getImage: function(imageUrl){
        return this.images[imageUrl];
    },

    imageLoadedCallback: function(e){
        this.imageLoaded ++;
    },

    imageLoadErrorCallback: function(e){
        this.imageFailedToLoad ++;
    },

    loadImage: function(imageUrl){
        var image = new Image(),
            self = this;
        image.url = imageUrl;
        image.addEventListener('load', function(e){
            self.imageLoadedCallback(e);
        })
        image.addEventListener('error', function(e){
            self.imageLoadErrorCallback(e);
        })
        self.images[imageUrl] = image;
    },

    loadImages: function(e){
        if(this.imagesIndex < this.imageUrls.length){
            this.loadImage(this.imageUrls[this.imagesIndex]);
            this.imagesIndex ++;
        }

        return (this.imageLoaded + this.imageFailedToLoad) / this.imageUrls.length * 100;
    },

    queueImage: function(imageUrl){
        this.imageUrls.push(imageUrl);
    },

    // Audio methods
    canPlayOggVorbis: function(){
        return "" != this.audio.canPlayType('audio/ogg; codecs="vorbis"');
    },

    canPlayMp4: function(){
        return "" != this.audio.canPlayType("audio/mp4");
    },

    getAvailableSoundChannel: function(){
        var audio;

        for(var i=0; i<this.NUM_AUDIO_CHANNELS; i++){
            audio = this.soundChannels[i];
            if(audio.played && audio.played.length > 0){
                if(audio.ended){
                    return audio;
                }
            }else{
                if(!audio.ended){
                    return audio;
                }
            }
        }
        return undefined;
    },

    playSound: function(id){
        var track = this.getAvailableSoundChannel(),
            element = document.getElementById(id);

        if(track && element){
            track.src = element.src === "" ? element.currentSrc : element.src;
            track.load();
            track.play();
        }
    },

    // Key events
    addKeyListener: function(keyAndListener){
        this.keyListeners.push(keyAndListener);
    },

    findKeyListener: function(key){
        var listener = undefined;
        this.keyListeners.forEach(function(keyAndListener){
            if(key === keyAndListener.key){
                listener = keyAndListener.listener;
            }
        })
        return listener;
    },

    keyPressed: function(e){
        var listener, key;

        switch(e.keyCode){
            case 32: key = "space"; break;
            case 83: key = 's'; break;
            case 80: key = 'p'; break;
            case 37: key = 'left arrow'; break;
            case 38: key = 'up arrow'; break;
            case 39: key = 'right arrow' break;
            case 40: key = 'down arrow' break;
        }

        listener = this.findKeyListener(key);
        if(listener){
            listener();
        }
    },

    // High scores
    getHighScore: function(){
        var key = this.gameName + this.HIGH_SCORE_SUFFIX,
            highScoreString = localStorage[key];

        if(highScoreString === undefined){
            localStorage[key] = JSON.stringify([]);
        }

        return JSON.parse(localStorage[key]);
    },

    setHighScore: function(score){
        var key = this.gameName + this.HIGH_SCORE_SUFFIX,
            highScoreString = localStorage[key],
            highScores = JSON.parse(highScoreString);

        highScores.unshift(score);
        localStorage[key] = JSON.stringify(highScores);
    },

    clearHighScore: function(){
        localStorage[this.gameName + this.HIGH_SCORE_SUFFIX] = JSON.stringify([]);
    },
};

function getTimeNow(){
    return +new Date();
}
