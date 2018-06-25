var start = [],
    drag = false,
    end = [];

window.onload = function(){
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');
    
    var img = document.getElementById("texture");

    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    canvas.addEventListener('mousedown', function(e){
        var x = e.clientX - canvas.getBoundingClientRect().left;
        var y = e.clientY - canvas.getBoundingClientRect().top;
        console.log(x, y);
        start = [x, y];
    })

    canvas.addEventListener('mouseup', function(e){
        var x = e.clientX - canvas.getBoundingClientRect().left;
        var y = e.clientY - canvas.getBoundingClientRect().top;
        console.log(x, y);
        end = [x, y];
        if(check()){
            var newData = context.getImageData(start[0], start[1], end[0]-start[0], end[1]-start[1]);
            var w = newData.width,
                h = newData.height;
            context.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = w;
            canvas.height = h;
            context.putImageData(newData, 0, 0);

            start = [];
            end = [];
        }
    })

}

function check(){
    if(Math.abs(start[0] - end[0]) * Math.abs(start[1] - end[1]) < 10){
        return false;
    }else{
        return true;
    }
}