var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    shapes  = [],

    polygonPoints = [
        [new Point(250, 150), new Point(250, 250), new Point(350, 250)],
        [new Point(100, 100), new Point(100, 150), new Point(150, 150), new Point(150, 100)],
        [new Point(400, 100), new Point(380, 150), new Point(500, 150), new Point(520, 100)],
    ],

    polygonStrokeStyle = ['blue', 'yellow', 'red'],
    polygonFillStyle = ['rgba(255, 255, 0, 0.7)', 'rgba(100, 140, 230, 0.6)', 'rgba(255, 255, 255, 0.8)'],

    circle1 = undefined,
    circle2 = undefined,

    mousedown = {x: 0, y: 0},
    lastdrag = {x: 0, y: 0},
    shapeBeingDragged = undefined,

    lastTime = undefined,
    velocity = {x: 350, y: 190},
    lastVelocity = {x: 350, y: 190},
    STICK_DELAY = 500,
    stuck = false,
    showInstructions = true;

// functions
function windowToCanvas(x, y){
    var bbox = canvas.getBoundingClientRect();
    return {
        x: x - bbox.left * (canvas.width / bbox.width),
        y: y - bbox.top * (canvas.height / bbox.height),
    };
}

function drawShapes(){
    shapes.forEach(function(shape){
        shape.stroke(context);
        shape.fill(context);
    });
}

function stick(mtv){
    var dx, dy, velocityMagnitude, point;

    if(mtv.axis === undefined){
        point = new Point();
        velocityMagnitude = Math.sqrt(Math.pow(velocity.x, 2) + Math.pow(velocity.y, 2));
        point.x = velocity.x / velocityMagnitude;
        point.y = velocity.y / velocityMagnitude;
        mtv.axis = point;
    }

    dx = -mtv.axis.x * mtv.overlap;
    dy = -mtv.axis.y * mtv.overlap;

    // 要计算所有的axis，不只是circle的axis
    if(dx * velocity.x > 0){
        dx = -dx;
    }
    if(dy * velocity.y > 0){
        dy = -dy;
    }

    setTimeout(function(){
        shapeBeingDragged.move(dx, dy);
    }, STICK_DELAY);

    lastVelocity.x = velocity.x;
    lastVelocity.y = velocity.y;
    velocity.x = velocity.y = 0;

    stuck = true;
}

function collisionDetected(mtv){
    return mtv.axis !== undefined || mtv.overlap !== 0;
}

function detactCollisions(){
    var textY = 30,
        numShapes = shapes.length,
        shape,
        mtv;

    if(shapeBeingDragged){
        for(var i=0; i<numShapes; i++){
            shape = shapes[i];
            if(shape !== shapeBeingDragged){
                mtv = shapeBeingDragged.collideWith(shape);
                if(collisionDetected(mtv)){
                    if(!stuck){
                        stick(mtv);
                    }
                }
            }
        }
    }
}

// event handler
canvas.onmousedown = function(e){
    var location = windowToCanvas(e.clientX, e.clientY);

    if(showInstructions){
        showInstructions = false;
    }
    velocity.x = lastVelocity.x;
    velocity.y = lastVelocity.y;

    shapeBeingDragged = undefined;
    stuck = false;
    shapes.forEach(function(shape){
        if(shape.isPointInPath(context, location.x, location.y)){
            shapeBeingDragged = shape;
        }
    });
};

// animation
function animate(time){
    var elapsedTime;
    time = +new Date();
    if(lastTime === 0){
        if(time !== undefined){
            lastTime = time;
        }
        window.requestAnimationFrame(animate);
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    if(shapeBeingDragged !== undefined){
        elapsedTime = parseFloat(time - lastTime) / 1000;
        shapeBeingDragged.move(velocity.x * elapsedTime, velocity.y * elapsedTime);
    }

    detactCollisions();
    drawShapes();
    lastTime = time;

    if(showInstructions){
        context.fillStyle = "cornflowerblue";
        context.font = "24px Arial";
        context.fillText("Click on a shape to animate it", 20, 40);
    }
    window.requestAnimationFrame(animate);
}

// initialization
function initialPolygons(){
    var polygon, points;

    for(var i=0; i<polygonPoints.length; i++){
        polygon = new Polygon();
        points = polygonPoints[i];

        polygon.fillStyle = polygonFillStyle[i];
        polygon.strokeStyle = polygonStrokeStyle[i];

        points.forEach(function(shape){
            polygon.addPoint(shape.x, shape.y);
        });

        shapes.push(polygon);
    }

    circle1 = new Circle(150, 75, 20);
    circle2 = new Circle(350, 25, 30);
    shapes.push(circle1);
    shapes.push(circle2);
}

initialPolygons();

context.shadowColor = 'rgba(100, 140, 255, 0.5)';
context.shadowBlur = 4;
context.shadowOffsetX = 2;
context.shadowOffsetY = 2;
context.font = "38px Arial";

window.requestAnimationFrame(animate);
