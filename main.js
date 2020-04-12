const height = 25;
const width = 100;
const tickSpeed = 200;

class Snek{
    constructor(startingX, startingY, direction){
        this.x = [];
        this.y = [];

        this.x[0] = startingX;
        this.y[0] = startingY;
        this.direction = direction;
    }

    points(){
        var points = [];
        for(var i = 0; i<this.x.length; i++){
            points.push({x:this.x[i], y:this.y[i]});
        }
        return points
    }
    
    score(){
        return this.x.length-1;
    }
    
    move(){
        for(var i = this.x.length-1;i>=1;i--){
            this.x[i] = this.x[i-1];
            this.y[i] = this.y[i-1];
        }
        switch(this.direction){
            case 0:
                this.y[0]-=1;
                break;
            case 1:
                this.x[0]+=1;
                break;
            case 2:
                this.y[0]+=1;
                break;
            case 3:
                this.x[0]-=1;
                break;
        }
    }
    
    grow(){
        this.x.push(this.x[this.x.length-1]);
        this.y.push(this.y[this.y.length-1]);
    }
    
    isConsuming(thing){
        return this.x[0]==thing.x && this.y[0]==thing.y;
    }
    
    isDying(){
        if(this.x[0]>=width)                   return true;
        if(this.x[0]<0)                        return true;
        if(this.y[0]>=height)                  return true;
        if(this.y[0]<0)                        return true;
        
        if (this.x.length<3) return false;
        for(let i=1;i<this.x.length;i++){
            if(this.isConsuming({x:this.x[i], y:this.y[i]})) return true;
        }
        
        return false;
    }
}

function isTheSamePoint(p1, p2){
    return p1.x==p2.x && p1.y==p2.y;
}

function drawGame(snekPoints, apple){
    var finalString = "";
    for(y=0;y<height;y++){
        for(x=0;x<width;x++){

            var hasSnek = false;
            var hasApple = isTheSamePoint({x:x, y:y}, apple);
            for(let p of snekPoints){
                if(p.x==x && p.y==y) {
                    hasSnek = true;
                    break;
                }
            }

            if      (hasApple) finalString += "A";
            else if (hasSnek)  finalString += "#";
            else               finalString += ".";
        }
        finalString += "<br/>";
    }
    return finalString;
};
function createApple(snek){ //todo: try/catch when game finishes
    var x = Math.random()*width | 0;
    var y = Math.random()*height | 0;
    for(var i = 0; i<snek.x.length; i++){
        if(x===snek.x[i] && y===snek.y[i]){
            return createApple(snek);
        }
    }
    return {x:x, y:y};
}

snek = new Snek(width/2 | 0, height/2 | 0, 0);
var apple = createApple(snek);

function gameLoop(snek, a){
    document.getElementById("score").innerHTML = "Apples eaten: " + snek.score().toString();
    snek.move();
    if(snek.isConsuming(a)){
        snek.grow();
        apple = createApple(snek);
    }
    if(snek.isDying()){
        clearInterval(refreshIntevalId);
        document.getElementById("score").innerHTML = "You are now dead. Score: " + snek.score().toString();
    }
    document.getElementById("snek").innerHTML = drawGame(snek.points(), apple);
};

document.addEventListener("keyup", (e)=>{
    if     (e.code==="ArrowUp")    snek.direction = 0;
    else if(e.code==="ArrowRight") snek.direction = 1;
    else if(e.code==="ArrowDown")  snek.direction = 2;
    else if(e.code==="ArrowLeft")  snek.direction = 3;
});

var refreshIntevalId = setInterval(function(){gameLoop(snek, apple);}, tickSpeed);