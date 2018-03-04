const WIN_WIDTH = 1024;
const WIN_HEIGHT = 600;


window.onload = function(){
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext('2d');
	canvas.width = WIN_WIDTH;
	canvas.height = WIN_HEIGHT;
	
	var dpmenu = new Dropdown(50, 100, 400, 40, "sans-serif");
	
	var web_save_font = [
		"Palatino Linotype, Book Antiqua, Palatino, serif",
		"Times New Roman, Times, serif",
		"Comic Sans MS, cursive, sans-serif",
		"Arial, Helvetica, sans-serif",
		"Arial Black, Gadget, sans-serif",
		"Lucida Sans Unicode, Lucida Grande, sans-serif",
		"Courier New, Courier, monospace",
		"Lucida Console, Monaco, monospace",
	];
	
	for(var i=0; i<web_save_font.length; i++){
		var newpick = new Pick(dpmenu.x, dpmenu.y+dpmenu.h*(i+1), dpmenu.w, dpmenu.h, web_save_font[i], dpmenu);
		dpmenu.children.push(newpick);
	}
	
	setInterval(function(){
		context.clearRect(0, 0, WIN_WIDTH, WIN_HEIGHT);
		dpmenu.draw(context);
		renderText(context, dpmenu.s, "Ii oo00 zz22 好あ", 700, 100);
	}, 50);
	
	canvas.addEventListener("mousemove", mouseEvent(dpmenu), false);
	canvas.addEventListener("click", mouseEvent(dpmenu), false);
}

function renderText(cxt, f, s, x, y){
	cxt.save();
	cxt.font = "40px " + f;
	var width = parseInt(cxt.measureText(s).width);
	cxt.textAlign = "center";
	cxt.fillStyle = "black";
	cxt.fillText(s, x, y);
	cxt.fillText("text width: "+width+"px", x, y+60);
	cxt.restore();
}

function Dropdown(x, y, w, h, s){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.s = s;
	this.ishover = false;
	this.display = false;
	this.children = [];
}

Dropdown.prototype = {
	constructor: Dropdown,
	toggle: function(){
		if (this.display){
			for (var i=0; i<this.children.length; i++){
				this.children[i].display = true;
			}
		}
		else{
			for (var i=0; i<this.children.length; i++){
				this.children[i].display = false;
			}
		}
	},
	draw: function(cxt){
		cxt.save();
		cxt.beginPath();
		cxt.fillStyle = "#aaa";
		cxt.fillRect(this.x, this.y, this.w, this.h);
		
		cxt.beginPath();
		cxt.fillStyle = "#222";
		cxt.textAlign = "center";
		cxt.textBaseline = "middle";
		cxt.font = "italic 20px Arial"
		cxt.fillText(this.s, this.x+this.w/2, this.y+this.h/2, this.w);
		cxt.restore();
		
		for (var i=0; i<this.children.length; i++){
			this.children[i].draw(cxt);
		}
	},
	hover: function(x1, y1){
		if (isInrect(x1, y1, this.x, this.y, this.w, this.h)){
			this.ishover = true;
		}
		else{
			this.ishover = false;
		}
		
		for (var i=0; i<this.children.length; i++){
			this.children[i].hover(x1, y1);
		}
		
		if (this.ishover || (this.children[0] && this.children[0].display && isInrect(x1, y1, this.x, this.y, this.w, this.h*(this.children.length+1)))){
			this.display = true;
			this.toggle();
		}
		else{
			this.display = false;
			this.toggle();
		}
	},
	click: function(x1, y1){
		for (var i=0; i<this.children.length; i++){
			this.children[i].click(x1, y1);
		}
	},
};

function Pick(x, y, w, h, s, fa){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.s = s;
	this.father = fa;
	this.ishover = false;
	this.display = false;
}

Pick.prototype = {
	constructor: Pick,
	draw: function(cxt){
		if (this.display){
			cxt.save();
			cxt.beginPath();
			cxt.fillStyle = "#ccc";
			cxt.fillRect(this.x, this.y, this.w, this.h);
			
			cxt.beginPath();
			cxt.fillStyle = "#222";
			cxt.textAlign = "center";
			cxt.textBaseline = "middle";
			cxt.font = "italic 20px Arial"
			cxt.fillText(this.s, this.x+this.w/2, this.y+this.h/2, this.w);
			cxt.restore();
		}
	},
	click: function(x1, y1){
		if(this.display && this.ishover){
			this.father.s = this.s;
			this.father.display = false;
			this.father.toggle();
		}
	},
	hover: function(x1, y1){
		if (isInrect(x1, y1, this.x, this.y, this.w, this.h)){
			this.ishover = true;
		}
		else{
			this.ishover = false;
		}
	},
};

function isInrect(x1, y1, x, y, w, h){
	if (x1>x && x1<x+w && y1>y && y1<y+h){
		return true;
	}
	return false;
}

function mouseEvent(d){
	return function(e){
		var x = e.offsetX;
		var y = e.offsetY;
		if(e.type == "mousemove"){
			d.hover(x, y);
		}
		if(e.type == "click"){
			d.click(x, y);
		}
	}
}
