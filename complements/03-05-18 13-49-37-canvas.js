
window.onload = function(){
	var canvas = document.getElementById("canvas");
	var cxt = canvas.getContext('2d');
	
	canvas.addEventListener('click', function(e){
		cxt.clearRect(0, 0, canvas.width, canvas.height);
		cxt.font = "20px Arial";
		var x0 = e.clientX - canvas.getBoundingClientRect().left;
		var x1 = e.offsetX;
		cxt.fillText(x0+' '+x1, 200, 200);
	}, false);
}

// Finally, I think e.offsetX is more accurate.

