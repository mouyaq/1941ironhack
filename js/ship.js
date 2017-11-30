function Ship(canvas, x, y, type, color, health, speedX, speedY) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.x = x;
    this.y = y;
    this.x < this.canvas.width - this.x ? this.radius = this.x/8 : this.radius = (this.canvas.width - this.x)/8;
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
            if(this.y > this.canvas.height) {
                //this.ctx.clearRect(this.x, this.y, this.width, this.height);
            }
            else {
                this.y += this.speedY;
            }
            
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

Player.prototype = Object.create(Ship.prototype);

function Player(canvas, x, y, type, color, health, speedX, speedY) {
    Ship.call(this, canvas, x, y, type, color, health, speedX, speedY);
    this.scale = 0.5;
    this.frameIndexArray = [185, 181, 172, 188, 181, 172, 188];
    this.framePositionArray = [0, 186, 367, 539, 727, 908, 1080];
    this.frameIndex = 0;
    this.frameHeight = 180;
    this.frameWidth = this.frameIndexArray[this.frameIndex];
    this.width = this.frameWidth * this.scale;
    this.height = this.frameHeight * this.scale;
}

Player.prototype.draw = function(that) {
    this.selectSprite(this.type, this.color);
    this.sprite.onload = function() {
         // Draw circle
        /*
        this.ctx.beginPath();
        var grd = this.ctx.createRadialGradient((this.x+this.width/2), (this.y+this.height/2), this.width, (this.x+this.width/2), (this.y+this.height/2), this.width/4);
        if(this.color == "white") {
            grd.addColorStop(0, "#000");
            grd.addColorStop(1, "#fff");
        }
        else {
            grd.addColorStop(0, "#fff");
            grd.addColorStop(1, "#000");
        }
        
        this.ctx.fillStyle = grd;
        this.ctx.fill();
        this.ctx.moveTo((this.x+this.width/2), (this.y+this.height/2));
        this.ctx.arc((this.x+this.width/2), (this.y+this.height/2) , this.width*2/3 ,0 , 2*Math.PI);
        this.ctx.fill();
        this.ctx.closePath();
        */
        //this.ctx.drawImage(this.sprite, this.x, this.y);
        this.ctx.save();
        this.ctx.drawImage(
          this.sprite,
          this.framePositionArray[this.frameIndex],
          0,
          this.frameWidth,
          this.frameHeight,
          this.x,
          this.y,
          this.width,
          this.height
        );
        this.ctx.restore();
    }.bind(this);
}

Player.prototype.changeColor = function() {
    this.color == "white" ? this.color = "black" : this.color = "white";
    this.selectSprite(this.type, this.color);
}

Player.prototype.moveUp = function() {
    if(this.y <= 0) {
        this.y = 0;
    }
    else {
        this.y -= this.speedY;
    }
}

Player.prototype.moveDown = function() {
    if(this.y + this.height >= this.canvas.height) {
        this.y = this.canvas.height - this.height;
    }
    else {
        this.y += this.speedY;
    }
}

Player.prototype.moveLeft = function() {
    if(this.x <= 0) {
        this.x = 0;
    }
    else {
        if(this.frameIndex > 3 && this.frameIndex < 6) {
            this.frameIndex += 1;
        }
        if(this.frameIndex <= 3) {
            this.frameIndex = 4;
        }
        this.draw();
        this.x -= this.speedX;
    }
}

Player.prototype.moveRight = function() {
    if(this.x + this.width >= this.canvas.width) {
        this.x = this.canvas.width - this.width;
    }
    else {
        if(this.frameIndex < 3) {
            this.frameIndex += 1;
        }
        this.draw();
        this.x += this.speedX;
    }
}

Player.prototype.shoot = function(that) {
    if(that.playersBullets.length < that.maxPlayerBullets) {
        that.playersBullets.push(new Bullet(this.canvas, this.x, this.y, "PlasLaser", 0, this.color, this.speedX, this.speedY));
    }
}

Enemy.prototype = Object.create(Ship.prototype);

function Enemy(canvas, x, y, type, color, health, speedX, speedY, player) {
    Ship.call(this, canvas, x, y, type, color, health, speedX, speedY);
    this.playerPositionX = player.x;
    this.playerPositionY = player.y;
    this.frameWidthArray = [154, 554];
    this.frameHeightArray = [224, 495];
    this.framePositionArray = [0, 0];
    switch(this.type) {
        case "enemy1":
            this.frameIndex = 0;
            // this.scale = this.getRandomSize(0.6, 0.8);
            this.scale = 0.6;
            // console.log("ENEMY1 SCALE: " + this.scale);
            // console.log(this.movement);
            break;
        case "enemy2":
            this.frameIndex = 1;
            //this.scale = this.getRandomSize(0.1, 0.3);
            this.scale = 0.2;
            // console.log("ENEMY2 SCALE: " + this.scale);
            // console.log(this.movement);
            break;
    }
    this.frameHeight = this.frameHeightArray[this.frameIndex];
    this.frameWidth = this.frameWidthArray[this.frameIndex];
    this.width = this.frameWidth * this.scale;
    this.height = this.frameHeight * this.scale;
}

Enemy.prototype.changeColor = function() {
    this.color == "white" ? this.color = "black" : this.color = "white";
    this.selectSprite(this.type, this.color);
}

Enemy.prototype.draw = function(that) {
    if(this.removable) {
        var index = that.enemies.indexOf(this);
        that.enemies.splice(index, 1);
        //console.log("REMOVE ENEMY");
    }
    this.selectSprite(this.type, this.color);
    this.sprite.onload = function() {
        this.ctx.save();
        this.ctx.drawImage(
          this.sprite,
          this.framePositionArray[this.frameIndex],
          0,
          this.frameWidth,
          this.frameHeight,
          this.x,
          this.y,
          this.width,
          this.height
        );
        this.ctx.restore();
    }.bind(this);
    this.move(this.movement);
}

Enemy.prototype.getPlayerPosition = function(player) {
    this.playerPositionX = player.x;
    this.playerPositionY = player.y;
}

Enemy.prototype.shoot = function(that) {
    that.enemiesBullets.push(new Bullet(this.canvas, this.x, this.y, "PlasLaser", 0, this.color, -this.speedX*2, -this.speedY*2));
}