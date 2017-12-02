function Ship(canvas, x, y, type, color, health, speedX, speedY) {
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
    this.movement = this.movementArray[Math.floor(Math.random() * this.movementArray.length)];
    this.type = type;
    this.color = color;
    this.sprite = new Image();
    this.selectSprite(this.type, this.color);
    this.destroyed = false;
    this.removable = false;
}


Ship.prototype.selectSprite = function(type, color) {
    var imgSrc = "./images/sprites/" + type;
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

// Ship.prototype.shoot = function(that) {
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
}

Ship.prototype.setDestroyed = function() {
    this.destroyed = true;
}

Ship.prototype.blowUp = function() {
    this.type = "blowup";
    this.selectSprite(this.type, this.color);
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