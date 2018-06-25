import os
import time
import math

t = time.time()

f = open("canvas_for_test {:2.0f} .html".format(t), "w", encoding="utf-8")
f.write('''
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>Canvas For Test</title>    
    <style>canvas{{display: block; margin: auto; margin-top: 20px; border: 1px solid #22c}}</style>
</head>
<body>
    <canvas width="800" height="600">Your browser can not support canvas.</canvas>
    <script type="text/javascript" src="{:2.0f}.js"></script>
</body>
</html>
    '''.format(t))
g = open("{:2.0f}.js".format(t), "w")

f.close()
g.close()

# os.system("pause")