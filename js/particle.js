window.onload = init; // initial DOM call.

//main variables.
var width = null;
var height = null;
var inactive = null;
var population = null;
var firstGen = null;
var pArray = [];
var particleDiv = null;

var Ship = null;
var right = null;
var left = null;
var up = null;
var down = null;

var Projectile = [];

//mouse variables
var xline = null;
var yline = null;

//initializes main variables needed, starts particle generation and update interval.
function init(){
    // document.body.style.position = 'absolute';  interferes with crosshair js
    document.body.style.backgroundColor = 'black';
    width = document.body.scrollWidth;
    height = document.body.scrollHeight;
    population = (width * height)/30000;
    firstGen = true;
    particleDiv = document.getElementById("particles");
    xline = document.getElementById("xline");
    yline = document.getElementById("yline");
    genParticles(population);
    window.onmousemove = getCoord;
    Ship = new ship();
    Ship.gen(400,400);
    document.onkeydown = function(e){
        if (e.keyCode == 87) {
            up = true;
        }
        if(e.keyCode == 65){
            left = true;
        }
        if (e.keyCode == 68 && right == false) {
            right = true;
        }
        if(e.keyCode == 83){
            down = true;
        };
    };
    document.onkeyup = function(e){
        if (e.keyCode == 87) {
            up = false;
        }
        if(e.keyCode == 65){
            left = false;
        } 
        if (e.keyCode == 68) {
            right = false;
        } 
        if(e.keyCode == 83){
            down = false;
        };
    };
    document.onclick = function(e){
        var p = new projectile();
        p.gen(Ship.X,Ship.Y,e.clientX,e.clientY);
        Projectile.push(p);
    }
    var updateInterval = setInterval(update, 50);
}

function ship(){
    this.obj = null;
    this.velocity = 0;
    this.X = NaN;
    this.Y = NaN;
}

ship.prototype.gen = function(x,y){
    this.obj = document.createElement("div");
    this.obj.style.zIndex = "-2";
    this.obj.style.position = 'absolute';
    this.X = x;
    this.Y = y;
    this.obj.style.top = y+"px";
    this.obj.style.left = x+"px";
    this.obj.style.backgroundImage = 'url("img/ship.png")';
    this.obj.style.backgroundSize = 'contain';
    this.obj.style.width= '50px';
    this.obj.style.height = '50px';
    document.body.appendChild(this.obj);
}

ship.prototype.move = function(){
    var x = this.X;
    var y = this.Y;
    if(up == true){
        y -= 8;
    } 
    if(down == true){
        y += 8;
    }
    if(left == true){
        x -= 8;
    }
    if (right == true){
        x += 8;
    };
    this.obj.style.top = y+"px";
    this.obj.style.left = x+"px";
    this.X = x;
    this.Y = y;
}

//projectile object

function projectile(d){
    this.obj = null;
    this.L = null;//left declination/inclination
    this.T = null;//top declination/inclination
    this.X = null;
    this.Y = null;
}

projectile.prototype.gen = function(inX,inY,X,Y){
    this.L = (X - (inX + 25))/5;// minus half the width of the ship.
    this.T = (Y - (inY + 25))/5;
    this.X = (inX + 25);
    this.Y = (inY + 25);
    this.obj = document.createElement("div");
    this.obj.style.zIndex = '2';
    this.obj.style.position = 'absolute';
    this.obj.style.top = (inY + 25)+"px";
    this.obj.style.left = (inX + 25)+"px";
    this.obj.style.width = "10px";
    this.obj.style.height = "5px";
    this.obj.style.background = "RGBA(238, 56, 48, 1)";
    particleDiv.appendChild(this.obj);
}

projectile.prototype.move = function(){
    this.Y += this.T;
    this.X += this.L;
    if (this.Y >0 && this.Y < height && this.X > 0 && this.X < width){
        this.obj.style.top = (this.Y)+"px";
        this.obj.style.left = (this.X)+"px";
        return false;
    }else {
        return true;
    }
}

//The main object which contains its specific information.
function particle(spd,x,y){
    this.speed = spd;
    this.X = x;
    this.Y = y;
    this.obj = null;
    this.nomove = null;
}

//standardized specifications for all particles.
particle.prototype.diam = "20px";
particle.prototype.color = "RGBA(216, 53, 56, 1)";

//generation of particles happens here.
// type of element and style can be specified.
particle.prototype.gen = function(){
    this.obj = document.createElement("div");
    this.obj.style.zIndex = "-2";
    this.obj.style.position = "absolute";
    this.obj.style.top = this.Y+"px";
    this.obj.style.left = this.X+"px";
    this.obj.style.width = this.diam;
    this.obj.style.height = this.diam;
    this.obj.style.borderRadius = "40%";
    this.obj.style.background = this.color;
    particleDiv.appendChild(this.obj);
    // this.obj.onclick = function(){
    //     this.style.background = "RGBA(216, 53, 56, 1)";
    //     this.parentNode.nomove = true;
    // }
}

//moves a individual particle.
particle.prototype.move = function(){
    //randomly selects left or right and the amount of movement.
    var randomX = Math.random() >= 0.5;
    var xMov = Math.floor(Math.random()*2);
    var yMov = (Math.floor(Math.random()*4))+this.speed;
    //if particles run off the page this is indicated by returning a true value, 
    //otherwise they continue moving.
    if (this.nomove == true) {
        return false;
    } else{
        if (this.Y >0 && this.Y < height && this.X > 0 && this.X < width) {
            if (randomX) {
                this.X += xMov;
                this.Y += yMov;
            } else{
                this.X -= xMov;
                this.Y += yMov;
            };
            this.obj.style.top = this.Y+"px";
            this.obj.style.left = this.X+"px";
            return false;
        }else{
            return true;
        };
    };
}

//organizes the mass generation of particles and sets the number of inactive particles to 0.
function genParticles(n){
    for (var i = 0; i < n; i++) {
        var x = Math.floor(Math.random()*width);
        if(firstGen == true){
            var y = Math.floor(Math.random()*height);
        }else{
            var y = 1;
        };
        var spd = Math.floor(Math.random()*5);
        var p = new particle(spd,x,y);
        p.gen();
        pArray.push(p);
    };
    inactive = 0;
}

//organizes the movement of all particles and removes them if they have exited the active area.
//once the cycle is finished the inactive particles are re-generated.
function update(){
    firstGen = false;
    for (var i = 0; i < pArray.length; i++) {
        var result = pArray[i].move();
        if (result) {
            pArray[i].obj.parentNode.removeChild(pArray[i].obj);
            pArray.splice(i,1);
            inactive++;

        };
    };
    if(Projectile != null){
        for (var i = 0; i < Projectile.length; i++) {
            var result = Projectile[i].move();
            if (result) {
                Projectile[i].obj.parentNode.removeChild(Projectile[i].obj);
                Projectile.splice(i,1);
            }
        };
    }
    Ship.move();
    if (inactive > 0) {
        genParticles(inactive);
    };
}

//crosshair js

//gets mouse coordinates
function getCoord(event){
    var e = event || window.event;
    var x = e.clientX;
    var y = e.clientY;
    updateCoord(x,y);
}

//updates the coordinates and positions visual lines
function updateCoord(x,y){
    xline.style.top = y+"px";
    yline.style.left = x+"px";
}

// DCD, 2015.