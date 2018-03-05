
window.onload = function(){
	var canvas = document.getElementById("canvas");
	var a = document.getElementsByTagName("a");
	var context = canvas.getContext('2d');
	
	for (var i=0; i<a.length; i++){
		a[i].onclick = function(){
			context.clearRect(0, 0, canvas.width, canvas.height);
			reDraw(context, this.text);
		}
	}
	
	reDraw(context);
}

function reDraw(cxt, s){
	cxt.save();
	cxt.globalCompositeOperation = s || "source-over";
	
	cxt.beginPath();
	cxt.fillStyle = "#08c";
	cxt.fillRect(200, 100, 400, 400);
	
	cxt.beginPath();
	cxt.fillStyle = "#c40";
	cxt.arc(500, 400, 200, 0, Math.PI*2);
	cxt.fill();
	cxt.restore();
}