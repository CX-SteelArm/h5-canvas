const PI = Math.PI;

window.onload = function(){
	var canvas = document.getElementById("canvas");
	var cxt = canvas.getContext('2d');
	
	cxt.lineWidth = 5;
	cxt.strokeStyle = "#c33";
	cxt.fillStyle = "#cc4";
	
	cxt.beginPath();
	cxt.arc(200, 200, 100, 3/2*PI, PI);
	cxt.stroke();
	
	cxt.beginPath();
	cxt.moveTo(350, 100);
	cxt.arcTo(560, 100, 500, 300, 100);
	cxt.stroke();
	
	cxt.save();
	cxt.lineWidth = 3;
	cxt.strokeStyle = "#444";
	cxt.beginPath();
	cxt.moveTo(350, 100);
	cxt.lineTo(560, 100);
	cxt.lineTo(500, 300);
	cxt.stroke();
	cxt.restore();
	
	cxt.beginPath();
	cxt.moveTo(200, 400);
	cxt.quadraticCurveTo(400, 500 ,500, 360);
	cxt.stroke();
	
	cxt.beginPath();
	cxt.moveTo(200, 600);
	cxt.bezierCurveTo(300, 500, 440, 750, 600, 600);
	cxt.stroke();
}
