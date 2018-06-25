var canvas = document.getElementById("canvas"),
// 离屏canvas
    offscreenCanvas = document.createElement("canvas"),
    offscreenContext = offscreenCanvas.getContext("2d"),
    context = canvas.getContext("2d"),
    video = document.getElementById("video"),
    controlButton = document.getElementById("controlButton"),
    flipCheckbox = document.getElementById("flipCheckbox"),
    colorCheckbox = document.getElementById("colorCheckbox"),
    magicCheckbox = document.getElementById("magicCheckbox"),
    imageData,
    poster = new Image();

// functions
function removeColor(){
    var data, width, average;
    imageData = offscreenContext.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    data = imageData.data;

    for(var i=0; i<data.length-4; i+=4){
        average = (data[i] + data[i+1] + data[i+2]) / 3;
        data[i] = average;
        data[i+1] = average;
        data[i+2] = average;
    }

    offscreenContext.putImageData(imageData, 0, 0);
}

function magicColor(){
    var data, width, average;
    imageData = offscreenContext.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    data = imageData.data;

    for(var i=0; i<data.length-4; i+=4){
        data[i] = 255-data[i];
        data[i+1] = 255-data[i+1];
        data[i+2] = 255-data[i+2];
    }

    offscreenContext.putImageData(imageData, 0, 0);
}

function drawFlipped(){
    context.save();
    context.translate(canvas.width/2, canvas.height/2);
    context.rotate(Math.PI);
    context.translate(-canvas.width/2, -canvas.height/2);
    context.drawImage(offscreenCanvas, 0, 0);
    context.restore();
}

function nextVideoFrame(){
    if(video.ended){
        controlButton.value = "Play";
    }else{
        offscreenContext.drawImage(video, 0, 0);
        if(!colorCheckbox.checked){
            removeColor();
        }

        if(magicCheckbox.checked){
            magicColor();
        }

        if(flipCheckbox.checked){
            drawFlipped();
        }else{
            context.drawImage(offscreenCanvas, 0, 0);
        }
        // 注意调用方法
        window.requestAnimationFrame(nextVideoFrame);
    }
}

function startPlaying(){
    // 注意调用方法
    window.requestAnimationFrame(nextVideoFrame);
    video.play();
}

function stopPlaying(){
    video.pause();
}
// event handlers
controlButton.onclick = function(){
    if(controlButton.value == "Play"){
        startPlaying();
        controlButton.value = "Pause";
    }else{
        stopPlaying();
        controlButton.value = "Play";
    }
};

poster.onload = function(){
    context.drawImage(poster, 0, 0, canvas.width, canvas.height);
}

// initialization
poster.src = "image/t1.jpg";

offscreenCanvas.width = canvas.width;
offscreenCanvas.height = canvas.height;