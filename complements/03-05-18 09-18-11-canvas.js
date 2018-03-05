const RADIUS = 120;

window.onload = function(){
	var canvas = document.getElementById("canvas");
	var cxt = canvas.getContext('2d');
	var room = document.getElementById("room");
	var doll = document.getElementById("doll");
	var showdoll = false;
	
	cxt.fillStyle = "#222";
	cxt.fillRect(0, 0, canvas.width, canvas.height);
	
	canvas.addEventListener('mousemove', function(e){
		// I think "var x = e.offsetX" is better
		var x = e.clientX - canvas.getBoundingClientRect().left;
		var y = e.offsetY - canvas.getBoundingClientRect().top;
		cxt.clearRect(0, 0, canvas.width, canvas.height);
		cxt.fillStyle = "#222";
		cxt.fillRect(0, 0, canvas.width, canvas.height);
		setMask(x, y, RADIUS);
		drawRoom();
		drawLight(x, y, RADIUS);
	}, false);
	
	// the doll will appear after 10 seconds.
	setTimeout(function(){
		showdoll = true;
	}, 10000);
	
	function drawLight(x, y, r){
		cxt.save();
		var rgd = cxt.createRadialGradient(x, y, 0.8*r, x, y, r)
		rgd.addColorStop(0, "rgba(244,233,233,0)");
		rgd.addColorStop(1, "rgba(244,233,233,255)");
		cxt.fillStyle = rgd;
		cxt.beginPath();
		cxt.arc(x, y, r, 0, 2*Math.PI);
		cxt.fill();
		cxt.restore();
	}

	function drawRoom(){
			cxt.save();
			cxt.fillStyle = cxt.createPattern(room, "no-repeat");
			cxt.scale(2, 2);
			cxt.fillRect(0, 0, canvas.width, canvas.height);
			cxt.restore();
			
		if(showdoll){
			// image can also be resized by "scale()"
			// cxt.drawImage(img, x, y, w, h) will stretch the image to (w, h) in size
			cxt.drawImage(doll, 400, 320);
		}
		cxt.restore();
	}

	function setMask(x, y, r){
		cxt.save();
		cxt.beginPath();
		cxt.arc(x, y, r, 0, 2*Math.PI);
		cxt.clip();
	}
}
