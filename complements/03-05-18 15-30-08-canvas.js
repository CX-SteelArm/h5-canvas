
window.onload = function(){
	var canvas = document.getElementById("canvas");
	var cxt = canvas.getContext('2d');
	
	cxt.beginPath();
	cxt.rect(0, 0, canvas.width*0.8, canvas.height*0.9);
	
	cxt.moveTo(100, 100);
	cxt.lineTo(100, 300);
	cxt.lineTo(300, 300);
	cxt.lineTo(300, 100);
	cxt.lineTo(100, 100);
	
	cxt.moveTo(500, 100);
	cxt.lineTo(400, 300);
	cxt.lineTo(650, 300);
	cxt.lineTo(500, 100);
	
	cxt.arc(400, 500, 150, 0, 2*Math.PI, true);
	
	cxt.fillStyle = "#28c";
	cxt.shadowColor = "#333";
	cxt.shadowOffsetX = 10;
	cxt.shadowOffsetY = 10;
	cxt.shadowBlur = 3;
	cxt.fill();
}
