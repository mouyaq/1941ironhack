function Ship(game, canvas, x, y, type, name, color, health, speedX, speedY) {
    this.game = game;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.x = x;
    this.y = y;
    this.health = health;
    this.speedX = speedX;
    this.speedY = speedY;
    this.rad = 0;
    //this.movementArray = ["straight", "angle", "circle", "sin", "persecution"];
    this.movementArray = ["straight", "angle", "circle"];
    this.shootTypeArray = ["single", "double", "triple", "tripeAngled", "sin"];
    this.movement = this.movementArray[Math.floor(Math.random() * this.movementArray.length)];
    this.shotType = this.shootTypeArray[Math.floor(Math.random() * this.shootTypeArray.length)];
    this.type = type;
    this.name = name;
    this.color = color;
    this.sprite = new Image();
    this.selectSprite(this.name, this.color);
    this.destroyed = false;
    this.removable = false;
    this.superShot = 0;
    this.score = 0;
    this.explosionAudio = new Audio("./sounds/explosion.mp3");
    this.explosionAudio.volume = 0.2;
}


Ship.prototype.selectSprite = function(name, color) {
    
    var imgSrc = "./images/sprites/" + name;
    switch(color) {
        case "white":
            imgSrc += "_white.png";
            break;
        case "black":
            imgSrc += "_black.png";
            break;
    }
    this.sprite.src = imgSrc;
}

// Ship.prototype.shot = function(that) {
//     that.bullets.push(new Bullet(this.canvas, this.x, this.y, "PlasLaser", 1, this.color, this.speedX, this.speedY));
// }

Ship.prototype.getRandomSize = function(min, max) {
    var randomSize = 1;
    var random = Math.random();
    if(random < min) {
        randomSize = min;
    }
    if(random > max) {
        randomSize = max;
    }
    else {
        randomSize = random;
    }
    return randomSize;
}

Ship.prototype.move = function(movement) {
    switch(movement) {
        case "straight":
            this.y += this.speedY;
            break;
        case "angle":
            while(this.y + this.height < 0){
                this.y += this.speedY;
            }
            if(this.detectBorder()) {
                this.speedX *= -1;        
            } 
            this.x += this.speedX;
            this.y += this.speedY;
            break;
        case "circle":
            while(this.y + this.height < 0){
                this.y += this.speedY;
            }
            // each modification
            this.rad += Math.PI/1024;
            this.x += Math.sin(this.rad);
            this.y += Math.cos(this.rad);
            break;
    }
}



Ship.prototype.detectBorder = function() {
    return this.x < 0 || this.x + this.width >= this.canvas.width || this.y < 0;
}

Ship.prototype.isOutOfScreen = function() {
    if (this.x + this.width < 0 || this.x > this.canvas.width || this.y > this.canvas.height) {
        this.setRemovable();
    }
}

Ship.prototype.setRemovable = function() {
    this.removable = true;
    this.destroyed = false;
}

Ship.prototype.setDestroyed = function(that) {
    if(that.type = "player") {
        that.addScore();
        this.bulletIndex = 1;
        this.game.enemiesBullets.push(new Bullet(this.game, this.canvas, this.x+this.width/2, this.y+this.height/2, -1, this, this.bulletIndex, this.color, "straight", 0, 0, false));
    }
    this.destroyed = true;
}

Ship.prototype.blowUp = function() {
    this.explosionAudio.play();
    this.name = "blowup";
    this.selectSprite(this.name, this.color);
    this.ctx.save();
    // sprite explosion is 4x3 and 360x480px
        this.ctx.drawImage(
            this.sprite,
            120,
            120,
            120,
            120,
            this.x,
            this.y,
            this.width,
            this.height
        );
    this.ctx.restore();
}

Ship.prototype.increaseSuperShot = function() {
    if(this.superShot < 100 && this.type == "player") {
        this.superShotAudio = new Audio("./sounds/ole.mp3");
        this.superShotAudio.volume = 0.2;
        this.superShotAudio.play();
        this.superShot += this.game.shotIncrement;
    }
}

// Ship.prototype.setShotIncrement = function(shotIncrement) {
//     this.shotIncrement = shotIncrement;
// }

Ship.prototype.resetSuperShot = function() {
    this.superShot = 0;
}

Ship.prototype.checkCollision = function(ships) {
    this.posXmin = this.x + 1/8 * this.width;
    this.posYmin = this.y + 1/8 * this.height;
    this.posXmax = this.x + 7/8 * this.width;
    this.posYmax = this.y + 7/8 * this.height;

    ships.forEach(function(ship){
        if( 
            ((this.posXmin < ship.posXmax && this.posXmax > ship.posXmax && this.posYmin < ship.posYmax && this.posYmax > ship.posYmax) ||
            (this.posXmin < ship.posXmax && this.posXmax > ship.posXmax && this.posYmin < ship.posYmin && this.posYmax > ship.posYmin) ||
            (this.posXmin < ship.posXmin && this.posXmax > ship.posXmin && this.posYmin < ship.posYmax && this.posYmax > ship.posYmax) ||
            (this.posXmin < ship.posXmin && this.posXmax > ship.posXmin && this.posYmin < ship.posYmin && this.posYmax > ship.posYmin))
            && ((this.color != ship.color) || (this.color == ship.color && this.type != ship.type))
        ) {
            ship.receiveDamage();
            this.receiveDamage();
            if(!ship.isAlive()) {
                ship.setDestroyed(this);
            }
            if(!this.isAlive()) {
                this.setDestroyed(ship);
            }
        }
    }.bind(this))
}

Ship.prototype.addScore = function(){
    this.score += 1;
    if(this.name == "player1") {
        document.getElementById("score-points-p1").innerHTML=this.score;
    }
    if(this.name == "player2") {
        document.getElementById("score-points-p2").innerHTML=this.score;
    }
}

Ship.prototype.receiveDamage = function() {
    if(this.health > 0) {
        this.health -= 1;
    }
}

Ship.prototype.isAlive = function() {
    return this.health > 0;
}