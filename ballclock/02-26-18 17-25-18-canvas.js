const WIN_WIDTH = 1024;
const WIN_HEIGHT = 768;
const RADIUS = 7;
const GAP = 3;
const START_TIME = parseInt(new Date().getTime() / 100000000)*100000000

var balls = [];
var colors = ["#aa3344", "#aa4466", "#00ccff", "#1e4fc1", "3f4dad", "eeff33", "aa3333"];
var dt = 50;

window.onload = function(){
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext('2d');
	canvas.width = WIN_WIDTH;
	canvas.height = WIN_HEIGHT;
	setInterval(function(){
		update();
		render(context, dt);
	}, dt);
}

function update(){
	for(var i=0; i<balls.length; i++){
		var b = balls[i];
		b.vy += b.g;
		b.x += b.vx;
		b.y += b.vy;
		if(b.y+b.r >= WIN_HEIGHT){
			b.y = WIN_HEIGHT-b.r;
			b.vy = -b.vy*0.4;
		}
	}
	
	var n = 0;
	for(var i=0; i<balls.length; i++){
		var b = balls[i];
		if(b.x > 0-RADIUS && b.x < WIN_WIDTH+RADIUS){
			balls[n++] = balls[i];
		}
	}
	while(balls.length > n){
		balls.pop();
	}
	/*
	while(balls.length > 300){
		balls.shift();
	}
	*/
}

function render(cxt, dt){
	var x = 80, y = 80;
	var curtime = new Date().getTime();
	var t = parseInt((curtime-START_TIME)/1000);
	var l_t = parseInt((curtime-dt-START_TIME)/1000);
	var hour = parseInt(t/3600);
	var min  = parseInt((t-hour*3600)/60);
	var sec  = parseInt(t%60);
	var l_hour = parseInt(l_t/3600);
	var l_min  = parseInt((l_t-l_hour*3600)/60);
	var l_sec  = parseInt(l_t%60);
	
	cxt.clearRect(0, 0, WIN_WIDTH, WIN_HEIGHT);
	
	drawNumber(x, y, parseInt(hour/10), cxt);
	drawNumber(x+130, y, hour%10, cxt);
	drawNumber(x+260, y, 10, cxt);
	drawNumber(x+320, y, parseInt(min/10), cxt);
	drawNumber(x+450, y, min%10, cxt);
	drawNumber(x+580, y, 10, cxt);
	drawNumber(x+640, y, parseInt(sec/10), cxt);
	drawNumber(x+770, y, sec%10, cxt);
	
	if(parseInt(hour/10) !== parseInt(l_hour/10)){
		createBall(x, y, parseInt(hour/10));
	}
	if(parseInt(hour%10) !== parseInt(l_hour%10)){
		createBall(x+130, y, parseInt(hour%10));
	}
	if(parseInt(sec/10) !== parseInt(l_sec/10)){
		createBall(x+640, y, parseInt(sec/10));
	}
	if(parseInt(sec%10) !== parseInt(l_sec%10)){
		createBall(x+770, y, parseInt(sec%10));
	}
	
	for(var i=0; i<balls.length; i++){
		var b = balls[i];
		cxt.fillStyle = b.color;
		cxt.beginPath();
		cxt.arc(b.x, b.y, b.r, 0, 2*Math.PI);
		cxt.fill();
	}
}

function createBall(x, y, n, cxt){
	for(var i=0; i<digit[n].length; i++){
		for(var j=0; j<digit[n][0].length; j++){
			if(digit[n][i][j] === 1){
				balls.push({
					x: x+j*(2*RADIUS+GAP),
					y: y+i*(2*RADIUS+GAP),
					r: RADIUS,
					vx: Math.random() > 0.5 ? 4 : -4,
					vy: -4,
					g: Math.random(),
					color: colors[Math.floor(colors.length*Math.random())],
				})
			}
		}
	}
}

function drawNumber(x, y, n, cxt){
	cxt.fillStyle = "rgb(50,50,160)";
	for(var i=0; i<digit[n].length; i++){
		for(var j=0; j<digit[n][0].length; j++){
			if(digit[n][i][j] === 1){
				drawCircle(x+j*(2*RADIUS+GAP), y+i*(2*RADIUS+GAP), cxt)
			}
		}
	}
}

function drawCircle(x, y, cxt){
	cxt.beginPath();
	cxt.arc(x, y, RADIUS, 0, 2*Math.PI);
	cxt.fill();
}