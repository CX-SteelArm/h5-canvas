-- this file can generate a simple html5 file
local filename = string.gsub(os.date("%c", os.time()), '[/:]', '%-')
local f = io.open(filename..'.html', 'w')
local gname = filename..'-canvas.js'
local g = io.open(gname, 'w')

f:write(string.format([[
<!DOCTYPE html>
<!-- add comments -->
<html>
<head lang="en">
	<meta charset="UTF-8" />
	<title></title>
	<link rel="stylesheet" type="text/css" href="" />
</head>
<body>
	<canvas id="canvas" width=1024 height=768 style="border: 1px solid gray; margin: 0 auto; display: block;">This browser can not support canvas!</canvas>
	<script type="text/javascript" src="%s"></script>
	
</body>
</html>
]], gname))
f:close()

g:write([[

window.onload = function(){
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext('2d');
	
}
]])
g:close()
