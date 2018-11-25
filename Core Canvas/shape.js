// shape
var Shape = function(){
    this.x = undefined,
    this.y = undefined,
    this.strokeStyle = "rgba(255, 253, 208, 0.9)",
    this.fillStyle = "rgba(147, 197, 114, 0.8)";
};

Shape.prototype = {
    // 与其他形状碰撞
    collideWith: function(shape){
        var axes = this.getAxes().concat(shape.getAxes());
        return !this.separationOnAxes(axes, shape);
    },
    // 在轴上的投影有重合
    // separationOnAxes: function(axes, shape){
    //     for(var i=0; i < axes.length; i++){
    //         var axis = axes[i],
    //             projection1 = shape.project(axis),
    //             projection2 = this.project(axis);
    //         if(! projection1.overlaps(projection2)){
    //             return true;
    //         }
    //     }
    //     return false;
    // },
    // 在轴上投影的最小分离向量
    minimumTranslationVector: function(axes, shape){
        var minimumOverlap = 10000,
            overlap,
            axisWithSmallsetOverlap;

        for(var i=0; i<axes.length; i++){
            axis = axes[i];
            projection1 = shape.project(axis);
            projection2 = this.project(axis);
            overlap = projection1.overlaps(projection2);

            if(overlap === 0){
                return {
                    axis: undefined,
                    overlap: 0,
                };
            }else{
                if(overlap < minimumOverlap){
                    minimumOverlap = overlap;
                    axisWithSmallsetOverlap = axis;
                }
            }
        }
        return new MinimumTranslationVector(axisWithSmallsetOverlap, minimumOverlap);
    },
    // 投射
    project: function(axis){
        throw 'project(axis) not implemented';
    },
    // 获取轴
    getAxes: function(){
        throw 'getAxes(axis) not implemented';
    },
    // 移动
    move: function(dx, dy){
        throw 'move(dx, dy) not implemented';
    },
    // draw methods
    // 创建形状路径
    createPath: function(context){
        throw 'createPath(context) not implemented';
    },

    fill: function(context){
        context.save();
        context.fillStyle = this.fillStyle;
        this.createPath(context);
        context.fill();
        context.restore();
    },

    stroke: function(context){
        context.save();
        context.strokeStyle = this.strokeStyle;
        this.createPath(context);
        context.stroke();
        context.restore();
    },

    isPointInPath: function(context, x, y){
        this.createPath(context);
        return context.isPointInPath(x, y);
    },
};

// Point
var Point = function(x, y){
    this.x = x;
    this.y = y;
};

// MinimumTranslationVector
var MinimumTranslationVector = function(axis, overlap){
    this.axis = axis;
    this.overlap = overlap;
};

// Polygon
var Polygon = function(){
    this.points = [];
    this.strokeStyle = 'blue';
    this.fillStyle = 'white';
};

Polygon.prototype = Object.create(new Shape());

Polygon.prototype.collideWith = function(shape){
    if(shape.radius !== undefined){
        return polygonCollidesWithCircle(this, shape);
    }else{
        return polygonCollidesWithPolygon(this, shape);
    }
}

Polygon.prototype.getAxes = function(){
    var v1 = new Vector(),
        v2 = new Vector(),
        axes = [];

    for(var i=0; i<this.points.length-1; i++){
        v1.x = this.points[i].x;
        v1.y = this.points[i].y;

        v2.x = this.points[i+1].x;
        v2.y = this.points[i+1].y;

        axes.push(v1.edge(v2).normal());
    }
    v1.x = this.points[i].x;
    v1.y = this.points[i].y;

    v2.x = this.points[0].x;
    v2.y = this.points[0].y;
    axes.push(v1.edge(v2).normal());

    return axes;
};

Polygon.prototype.project = function(axis){
    var scalars = [],
        v = new Vector();

    this.points.forEach(function(point){
        v.x = point.x;
        v.y = point.y;
        scalars.push(v.dotProduct(axis));
    });

    return new Projection(Math.min.apply(Math, scalars), Math.max.apply(Math, scalars));
};

Polygon.prototype.addPoint = function(x, y){
    this.points.push(new Point(x, y));
};

Polygon.prototype.createPath = function(context){
    if(this.points.length === 0){
        return ;
    }
    context.beginPath();
    context.moveTo(this.points[0].x, this.points[0].y);
    for(var i=0; i<this.points.length; i++){
        context.lineTo(this.points[i].x, this.points[i].y);
    }
    context.closePath();
};

Polygon.prototype.move = function(dx, dy){
    for(var i=0, point; i<this.points.length; i++){
        point = this.points[i];
        point.x += dx;
        point.y += dy;
    }
}

// circle
var Circle = function(x, y, radius){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.strokeStyle = 'rgba(255, 253, 208, 0.9)';
    this.fillStyle = 'rgbs(147, 197, 114, 0.8)';
};

Circle.prototype = Object.create(new Shape());

Circle.prototype.collideWith = function(shape){
    if(shape.radius !== undefined){
        return circleCollidesWithCircle(this, shape);
    }else{
        return polygonCollidesWithCircle(shape, this);
    }
}

Circle.prototype.getAxes = function(){};

Circle.prototype.project = function(axis){
    var scalars = [],
        point = new Vector(this.x, this.y),
        dotProduct = point.dotProduct(axis);

    scalars.push(dotProduct);
    scalars.push(dotProduct + this.radius);
    scalars.push(dotProduct - this.radius);
    return new Projection(Math.min.apply(Math, scalars), Math.max.apply(Math, scalars));
};

Circle.prototype.move = function(dx, dy){
    this.x += dx;
    this.y += dy;
};

Circle.prototype.createPath = function(context){
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
}

// Collision between two shapes
function polygonCollidesWithPolygon(p1, p2){
    var mtv1 = p1.minimumTranslationVector(p1.getAxes(), p2),
        mtv2 = p2.minimumTranslationVector(p2.getAxes(), p1);

    return mtv1.overlap < mtv2.overlap ? mtv1 : mtv2;
}

function circleCollidesWithCircle(c1, c2){
    var distance = Math.sqrt(Math.pow(c1.x - c2.x, 2) + Math.pow(c1.y - c2.y, 2)),
        overlap = Math.abs(c1.radius + c2.radius) - distance;
    return overlap < 0 ? new MinimumTranslationVector(undefined, 0) : new MinimumTranslationVector(undefined, overlap);
}

function polygonCollidesWithCircle(polygon, circle){
    var min = 10000,
        v1,
        v2,
        axes = polygon.getAxes(),
        closestPoint = getPolygonPointClosestToCircle(polygon, circle);
        
        v1 = new Vector(circle.x, circle.y);
        v2 = new Vector(closestPoint.x, closestPoint.y);

        axes.push(v1.subtract(v2).normalize());
        return polygon.minimumTranslationVector(axes, circle);
}

function getPolygonPointClosestToCircle(polygon, circle){
    var min = 10000,
        length,
        testPoint,
        closestPoint;
    for(var i=0; i<polygon.points.length; i++){
        testPoint = polygon.points[i];
        length = Math.sqrt(Math.pow(testPoint.x - circle.x, 2) + Math.pow(testPoint.y - circle.y, 2));
        if(length < min){
            min = length;
            closestPoint = testPoint;
        }
    }
    return closestPoint;
}


