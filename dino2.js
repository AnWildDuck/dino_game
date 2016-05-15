'use strict'

var ctx;
var ground = 500;
var gameSpeed = 1;

var windowY = 540;
var windowX = 720;

var cactusManager
var dino


function init() {
    var canvas = document.getElementById('tutorial');
    ctx = canvas.getContext('2d');
    
    ctx.imageSmoothingEnabled = false;
    
    dino = new Dino();
    cactusManager = new CactusManger();
    
    loopStep();
}

function loopStep () {
    window.requestAnimationFrame(loopStep);
    ctx.clearRect(0, 0, windowX, windowY);
    
    cactusManager.makeCactus();
    cactusManager.manage();
    cactusManager.show();

    if (cactusManager.touching(dino)) {
        // SHUT. DOWN. EVERYTHING!
        ctx.font = "30px Arial";
        ctx.fillText("touching", 10, 50)
    }

    dino.physics();
    dino.show();
}


function touching(rect1, rect2) {
    if (rect1.left < rect2.right && rect1.right > rect2.left) {
        if (rect1.top < rect2.bottom && rect1.bottom > rect2.top) {
            return true;
        } 
    }
}




function getImage(path) {
    var image = new Image();
    image.src = path;
    return image;
}

var images = {
    dino1: getImage('dino1.png'),
    dino2: getImage('dino2.png'),
    dinoDeath: getImage('dinoDed.png'),
    dinoStill: getImage('dinoStill.png'),
    cactus: getImage('cactus.png'),
}

var keys = {
    space: 32,
}

var scale = 5;

class Cactus {
    constructor() {
        this.scale = scale / 1.5;
        this.x = windowX;
        this.width = 23 * this.scale;
        this.height = 46 * this.scale;
        this.y = windowY - this.height;
    
    }
    show() {
        drawImage(images.cactus, this.x, this.y, this.scale);
    }
    
    onScreen() {
        if (this.x + this.width > 0) {
            return true;
        } 
    }
    touchingCacti(dino) {
        return touching(getBox(this), getBox(dino));
    }
}

function getBox(thing) {
    return {
            left: thing.x,
            top: thing.y,
            right: thing.x + thing.width,
            bottom:thing.y + thing.height
        };
}

function random(min, max) {
    return min + Math.round(Math.random() * max - min);
}

class CactusManger {
    constructor() {
        this.cacti = [];
        this.spawnTick = 0;
    }
    
    makeCactus() {
        if ((random(0, 60) === 0 && this.spawnTick > 60) || this.spawnTick > 90) {
            this.cacti.push(new Cactus());
            this.spawnTick = 0;
        } else {
            this.spawnTick += 1;
        }
    }
    manage() {
        var cacti2 = [];
        for (var cactus of this.cacti) {
            
            cactus.x -= 5 * gameSpeed;


            
            if (cactus.onScreen()) {
                cacti2.push(cactus);
            }
        
        }
        this.cacti = cacti2
    }
    show() {
        for (var cactus of this.cacti) {
            cactus.show()
        }
    }
    touching(dino) {
        for (var cactus of this.cacti) {
            if (cactus.touchingCacti(dino)) {
                return true;
            }
        }
        return false;
    }
}







function drawImage(image, x, y, scale) {
    ctx.save()
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.drawImage(image, 0, 0);
    ctx.restore();
}







class Dino {
    constructor() {
        this.x = 20;
        this.y = 10;
        this.velocityY = 0;
        this.age = 0;
        this.scale = scale;
        this.height = 20 * this.scale;
        this.width = 20 * this.scale;
        //this.greeting = "Howdy"
        
        document.addEventListener('keydown', (event)=>{
            if (event.keyCode == keys.space && this.onGround()) {
                this.velocityY = -15;
            }
        }
        );
    }
    
    show() {
        if (this.onGround()) {
            var image = Math.floor(this.age / 10) % 2 === 0 ? images.dino1 : images.dino2;
        } else {
            var image = images.dinoStill;
        }
        drawImage(image, this.x, this.y, scale)
    }
    
    onGround() {
        return this.y + this.height >= ground;
    }
    
    physics() {
        //sconsole.log(this.velocityY)
        this.age++;
        this.y += this.velocityY;
        
        if (!this.onGround()) {
            if (this.velocityY < 20) {
                this.velocityY += 2;
            }
            if (key.isPressed('space')) {
                this.velocityY -= 1.5
            }
        } else if (this.velocityY >= 0) {
            this.y = ground - this.height;
            this.velocityY = 0;
        } else {
            this.velocityY = 0
            this.y = ground - this.height;
        }
    }
}



window.onload = init;
