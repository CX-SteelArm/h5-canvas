const PI = Math.PI;

window.onload = function(){
	var canvas = document.getElementById("canvas");
	var cxt = canvas.getContext('2d');
	
	cxt.fillStyle = "black";
	cxt.fillRect(0, 0, canvas.width, canvas.height);
	
	for (var i=0; i<200; i++){
		var x = canvas.width * Math.random();
		var y = canvas.height * Math.random();
		var r = 10 + 5*Math.random();
		var rot = PI * Math.random();
		fillStar(cxt, x, y, r, rot);
	}
}

function fillStar(cxt, x, y, r, rot){
	cxt.save();
	cxt.transform(r, 0, 0, r, x, y);
	cxt.rotate(rot);
	cxt.fillStyle = "yellow";
	star(cxt);
	cxt.restore();
}

function star(cxt){
	cxt.beginPath();
	for(var i=0; i<5; i++){
		cxt.lineTo(Math.cos(0.4*PI*i), Math.sin(0.4*PI*i));
		cxt.lineTo(Math.cos(0.4*PI*i+0.2*PI)*0.5, Math.sin(0.4*PI*i+0.2*PI)*0.5);
	}
	cxt.closePath();
	cxt.fill();
}