var w = 0,
    h = 0,
    cur =  [];

window.onload = function(){
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');
    
    var img = document.getElementById("texture");

    canvas.width = w = normalize(img.width);
    canvas.height = h = normalize(img.height);
    context.drawImage(img, 0, 0, w, h);
    
    canvas.addEventListener('mousedown', function(e){
        var x = e.clientX - canvas.getBoundingClientRect().left;
        var y = e.clientY - canvas.getBoundingClientRect().top;
        console.log(x, y);
        var c = check(getPosition(x, w), getPosition(y, h));
        if(c){
            swap(cur, c);
            cur = [];
        }
    })

    function swap(p1, p2){
        console.log(w, h, p1, p2);
        var data1 = getData(p1);
        var data2 = getData(p2);
        context.putImageData(data1, p2[0]*w/3, p2[1]*h/3);
        context.putImageData(data2, p1[0]*w/3, p1[1]*h/3);
    }

    function getData(p){
        var x = p[0] * w / 3;
        var y = p[1] * h / 3;
        return context.getImageData(x, y, w/3, h/3);
    }
    // context.clearRect(0, 0, canvas.width, canvas.height);
}

function normalize(x){
    return x - x % 3;
}

function getPosition(x, y){
    var u = Math.floor(x / y * 3);
    if(u > 2){
        u = 2;
    }
    return u;
}

function check(x, y){
    if(cur.length == 0){
        cur = [x, y];
    }
    else if(cur[0] != x || cur[1] != y){
        return [x, y];
    }
    return 0;
}