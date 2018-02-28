var omiga = 0.04;
var rot = 0;

window.onload = function(){
	var canvas = document.getElementById("canvas");
	var cxt = canvas.getContext('2d');
	// draw a simple triangle
	cxt.beginPath();
	cxt.moveTo(100, 100);
	cxt.lineTo(100, 300);
	cxt.lineTo(300, 200);
	cxt.closePath();
	cxt.strokeStyle = '#c33';
	cxt.stroke();
	// draw a fill & stroke triangle
	cxt.beginPath();
	cxt.lineTo(400, 100);
	cxt.lineTo(400, 300);
	cxt.lineTo(500, 200);
	cxt.closePath();
	cxt.strokeStyle = '#000'
	cxt.fillStyle = "#3c3";
	cxt.lineWidth = 10;
	cxt.fill();
	cxt.stroke();
	// use functions about rect draw some rectangles
	cxt.beginPath();
	cxt.rect(100, 400, 180, 102);
	cxt.stroke();
	
	cxt.strokeStyle = "#55c";
	cxt.strokeRect(400, 400, 180, 102);
	
	cxt.fillStyle = "#a45";
	cxt.fillRect(400, 600, 180, 102);
	cxt.strokeRect(400, 600, 180, 102);
	
	cxt.lineCap = "round" // can be butt(default), square and round.
	cxt.beginPath();
	cxt.moveTo(700, 700);
	cxt.lineTo(900, 700);
	cxt.stroke();
	
	cxt.lineJoin = "round"; // can be mitter(default), bevel and round. 
	Astr(cxt, 760, 500, 140, 60, 6, 60);
	
	cxt.lineWidth = 1;
	cxt.sillStyle = '#c39';
	
	setInterval(function(){
		cxt.clearRect(598, 98, 204, 204);
		Astr(cxt, 700, 200, 100, 50, 5, rot);
		rot += omiga;
	}, 33);
	
}

function Astr(cxt, x, y, R, r, n, rot){
	var dg = Math.PI*2/n;
	var cos = Math.cos;
	var sin = Math.sin;
	cxt.beginPath();
	for(var i=0; i<n; i++){
		cxt.lineTo(R*cos(rot+dg*i)+x, R*sin(rot+dg*i)+y);
		cxt.lineTo(r*cos(rot+dg/2+dg*i)+x, r*sin(rot+dg/2+dg*i)+y);
	}
	cxt.closePath();
	cxt.fill();
	cxt.stroke();
}