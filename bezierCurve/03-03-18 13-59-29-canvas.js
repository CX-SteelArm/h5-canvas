const PI = Math.PI;
const WIN_WIDTH = document.documentElement.clientWidth;
const WIN_HEIGHT = document.documentElement.clientHeight;
var points = [];
var activePoint;

// 创建点的类
function Point(x, y, r){
	this.x = x;
	this.y = y;
	this.r = r;
	this.focus = false;
}

Point.prototype = {
	constructor: Point,
	click: function(x1, y1){
		if (this.r > Math.sqrt(Math.pow(this.x-x1, 2) + Math.pow(this.y-y1, 2))){
			this.focus = true;
			activePoint = this;
		}
		else{
			this.focus = false;
		}
	},
	draw: function(cxt){
		cxt.save();
		cxt.beginPath();
		cxt.arc(this.x, this.y, this.r, 0, 2*PI);
		if(this.focus){
			cxt.fillStyle = "#c22";
		}
		else{
			cxt.fillStyle = "#ccc";
		};
		cxt.fill();
		
		cxt.beginPath();
		cxt.arc(this.x, this.y, this.r*1.2, 0, 2*PI);
		cxt.lineWidth = 1;
		cxt.strokeStyle = "#222";
		cxt.stroke();
		cxt.restore();
	},
};

window.onload = function(){
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext('2d');
	canvas.width = WIN_WIDTH;
	canvas.height = WIN_HEIGHT;
	
	// 依次插入四个点（起点，2个控制点，终点）
	var p = [WIN_WIDTH*0.2, WIN_HEIGHT*0.4, WIN_WIDTH*0.4, WIN_HEIGHT*0.1, WIN_WIDTH*0.50, WIN_HEIGHT*0.6, WIN_WIDTH*0.7, WIN_HEIGHT*0.4];
	for (var i=0; i<4; i++){
		addPoint(p[2*i], p[2*i+1]);
	}
	
	drawPoints(context);
	drawBezierCurve(context);
	
	canvas.addEventListener('mousedown', mclick(context), false);
	canvas.addEventListener('mousemove', mclick(context), false);
	canvas.addEventListener('mouseup', mclick(context), false);
	canvas.addEventListener('mouseout', mclick(context), false);
}

const radius = Math.max(WIN_WIDTH, WIN_HEIGHT) / 80;

function addPoint(x, y){
	points.push(new Point(x, y, radius));
}

// 添加鼠标事件
function mclick(cxt){
	return function(e){
		switch(e.type){
			case "mousedown":
				var x = e.offsetX;
				var y = e.offsetY;
				for(var i=0; i<points.length; i++){
					points[i].click(x, y);
				}
				drawPoints(cxt);
				drawBezierCurve(cxt);
				break;
			
			case "mouseup":
				if (activePoint){
					activePoint = null;
				}
				break;
				
			case "mouseout":
				if (activePoint){
					activePoint = null;
				}
				break;
				
			case "mousemove":
				if (activePoint){
					activePoint.x = e.offsetX;
					activePoint.y = e.offsetY;
					drawPoints(cxt);
					drawBezierCurve(cxt);
				}
				break;
		}
	}
}

function drawPoints(cxt){
	cxt.clearRect(0, 0, WIN_WIDTH, WIN_HEIGHT);
	for(var i=0; i<points.length; i++){
		points[i].draw(cxt);
	}
}

function drawBezierCurve(cxt){
	cxt.save();
	cxt.beginPath();
	cxt.strokeStyle = '#333';
	cxt.lineCap = "round";
	cxt.moveTo(points[0].x, points[0].y);
	cxt.lineWidth = radius * 0.6;
	cxt.bezierCurveTo(points[1].x, points[1].y, points[2].x, points[2].y, points[3].x, points[3].y);
	cxt.stroke();
	
	cxt.beginPath();
	cxt.strokeStyle = "#33c";
	cxt.lineWidth = radius * 0.4;
	cxt.lineCap = "round";
	cxt.moveTo(points[0].x, points[0].y);
	cxt.lineTo(points[1].x, points[1].y);
	cxt.stroke();
	
	cxt.beginPath();
	cxt.moveTo(points[3].x, points[3].y);
	cxt.lineTo(points[2].x, points[2].y);
	cxt.stroke();
	
	cxt.restore();
}