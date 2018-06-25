var canvas, cxt;

window.onload = function(){
    canvas = document.getElementsByTagName("canvas")[0];
    cxt = canvas.getContext("2d");
    var newimg = new Image();
    newimg.src = "./image/t1.jpg";
    newimg.onload = function(e){
        console.log(1);
        cxt.drawImage(this, 0, 0);
    };
    setTimeout(function(){
        cxt.fillRect(0, 0, canvas.width, canvas.height);
        cxt.drawImage(newimg, 0, 0, canvas.width, canvas.height);
    }, 4000);
    setTimeout(function(){
        cxt.fillRect(0, 0, canvas.width, canvas.height);
        cxt.drawImage(newimg, 100, 100, 300, 300, 0, 0, 600, 600);
    }, 8000);
};


