
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
	
	cxt.strokeStyle = "#2c2";
	cxt.strokeRect(400, 400, 180, 102);
	
	cxt.fillStyle = "#ccc";
	cxt.fillRect(400, 600, 180, 102);
	cxt.strokeRect(400, 600, 180, 102);
}
