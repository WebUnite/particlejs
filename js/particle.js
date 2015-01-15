window.onload = init; // initial DOM call.

//main variables.
var width = null;
var height = null;
var inactive = null;
var population = null;
var pArray = [];
var particleDiv = null;

//initializes main variables needed, starts particle generation and update interval.
function init(){
    width = document.body.scrollWidth;
    height = document.body.scrollHeight;
    population = (width * height)/1600;
    inactive = 0;
    particleDiv = document.getElementById("particles");
    genParticles(population);
    var updateInterval = setInterval(update, 50);
}

//The main object which contains its specific information.
function particle(spd,x,y){
    this.speed = spd;
    this.X = x;
    this.Y = y;
    this.obj = null;
}

//standardized specifications for all particles.
particle.prototype.diam = "5px";
particle.prototype.color = "rgba(44, 62, 80,0.5)";

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
    this.obj.style.borderRadius = "50%";
    this.obj.style.background = this.color;
    particleDiv.appendChild(this.obj);
}

//moves a individual particle.
particle.prototype.move = function(){
    //randomly selects left or right and the amount of movement.
    var random = Math.random() >= 0.5;
    var xMov = Math.floor(Math.random()*2);
    var yMov = (Math.floor(Math.random()*4))+this.speed;
    //if particles run off the page this is indicated by returning a true value, 
    //otherwise they continue moving.
    if (this.Y >0 && this.X > 0 && this.X < width) {
        if (random) {
            this.X += xMov;
            this.Y -= yMov;
        } else{
            this.X -= xMov;
            this.Y -= yMov;
        };
        this.obj.style.top = this.Y+"px";
        this.obj.style.left = this.X+"px";
        return false;
    }else{
        return true;
    };
}

//organizes the mass generation of particles and sets the number of inactive particles to 0.
function genParticles(n){
    for (var i = 0; i < n; i++) {
        var x = Math.floor(Math.random()*width);
        var y = Math.floor(Math.random()*height);
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
    for (var i = 0; i < pArray.length; i++) {
        var result = pArray[i].move();
        if (result) {
            pArray[i].obj.parentNode.removeChild(pArray[i].obj);
            pArray.splice(i,1);
            inactive++;

        };
    };
    if (inactive > 0) {
        genParticles(inactive);
    };
}

// DCD, 2014.