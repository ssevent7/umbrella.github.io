var cvs = document.createElement("canvas");
cvs.width = window.innerWidth;
cvs.height = window.innerHeight;
cvs.style.cssText="\
    position:fixed;\
    top:0px;\
    left:0px;\
    z-index:-1;\
    opacity:1.0;\
    ";
document.body.appendChild(cvs);

var ctx = cvs.getContext("2d");

var startTime = new Date().getTime();

//随机数函数
function randomInt(min,max) {
    return Math.floor((max-min+1)*Math.random()+min);
}
function randomFloat(min,max) {
    return (max-min)*Math.random()+min;
}

//构造点类
function Point() {
    this.x = randomFloat(0,cvs.width);
    this.y = randomFloat(0,cvs.height);

    var maxD = 0.08, minD = 0.01;
    this.speed = randomFloat(minD,maxD);
    this.angle = randomFloat(0,2*Math.PI);

    this.r = 1;

    var grey = (this.r*30+200);
    this.color = "rgba("+grey+","+grey+","+grey+",1)";
}

Point.prototype.move = function(dif) {
    var dx = Math.sin(this.angle)*this.speed;
    var dy = Math.cos(this.angle)*this.speed;
    this.x += dx*dif;
    if (this.x<0) {
        this.x=0;
        this.angle=2*Math.PI-this.angle;
    }
    else if (this.x>cvs.width){
        this.x=cvs.width;
        this.angle=2*Math.PI-this.angle;
    }
    this.y += dy*dif;
    if (this.y<0) {
        this.y=0;
        this.angle=Math.PI-this.angle;
    }
    else if (this.y>cvs.height){
        this.y=cvs.height;
        this.angle=Math.PI-this.angle;
    }
}

Point.prototype.draw = function() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
    ctx.closePath();
    ctx.fill();
}

//绘制每一帧
var points = [];
function initPoints(num) {
    for (var i = 0; i<num; ++i) {
        points.push(new Point());
    }
}

var p0 = new Point();
var degree=5.0;
document.onmousemove = function(ev) {
    p0.x = ev.clientX;
    p0.y = ev.clientY;
}
document.onmousedown = function(ev) {
    degree = 10.0;
    p0.x = ev.clientX;
    p0.y = ev.clientY;
}
document.onmouseup = function(ev) {
    degree = 5.0;
    p0.x = ev.clientX;
    p0.y = ev.clientY;
}

function drawLine(p1,p2,d) {
    var dis = (p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y);
    var t = 100/dis;
    t = Math.min(t,0.4);
    if(t<0.01) return false;
    t = Math.min(1,t*d);
    ctx.strokeStyle = "rgba(255,250,250,"+ t +")";
    ctx.beginPath();
    ctx.lineWidth=1;
    ctx.moveTo(p1.x,p1.y);
    ctx.lineTo(p2.x,p2.y);
    ctx.closePath();
    ctx.stroke();
    return true;
}

function drawFrame() {
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    ctx.fillStyle = "rgba(0,43,54,1)";
    ctx.fillRect(0,0,cvs.width,cvs.height);
    var endTime = new Date().getTime();
    var dif = endTime-startTime;
    startTime = endTime;
    for(var i = 0; i<points.length; ++i) {
        for(var j = i+1; j<points.length; ++j) {
            var p1 = points[i], p2 = points[j];
            drawLine(p1,p2,3.0);
        }
    }
    for(var i = 0; i<points.length; ++i) {
        var p = points[i];
        drawLine(p0,p,degree);
        p.draw();
        p.move(dif);
    }
    window.requestAnimationFrame(drawFrame);
}

initPoints(70);
drawFrame();