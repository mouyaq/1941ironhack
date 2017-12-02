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
    if(this.removable) {
        var index = that.players.indexOf(this);
        that.players.splice(index, 1);
        if(that.players.length <= 0) {
            alert("GAME OVER");
        }
        //console.log("REMOVE ENEMY");
    }
    this.selectSprite(this.type, this.color);
    this.sprite.onload = function() {
        if (that.keys && that.keys[P1_UP]) { 
            this.moveUp();
            this.resetMove(); 
        }
        if (that.keys && that.keys[P1_DOWN]) { 
            this.moveDown();
            this.resetMove();
         }
        if (that.keys && that.keys[P1_LEFT]) { this.moveLeft(); }
        if (that.keys && that.keys[P1_RIGHT]) { this.moveRight(); }
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

Player.prototype.move = function(that) {
    if (that.keys && that.keys[P1_CHANGE_COLOR]) { this.changeColor() }
    if (that.keys && that.keys[P1_SHOOT]) { this.shoot(that) }
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
        //this.draw();
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
        else {
            this.frameIndex -= 1;
        }
        //this.draw();
        this.x += this.speedX;
    }
}

Player.prototype.resetMove = function() {
    this.frameIndex = 0;
    // this.player2.frameIndex = 0;
}

Player.prototype.shoot = function(that) {
    if(that.playersBullets.length < that.maxPlayerBullets) {
        that.playersBullets.push(new Bullet(this.canvas, this.x, this.y, "PlasLaser", 0, this.color, this.speedX, this.speedY));
    }
}

Player.prototype.checkCollision = function(ships) {
    ships.forEach(function(ship){
        var shipColisionXmin = ship.x - (1/2 * ship.width);
        var shipColisionXmax = ship.x + (1/2 * ship.width);
        var shipColisionYmin = ship.y - (1/2 * ship.height);
        var shipColisionYmax = ship.y + (1/2 * ship.height);
        /*
        enemy.x + 1/4 * enemy.width
        enemy.x + 3/4 * enemy.width
        enemy.y + 1/4 * enemy.height
        enemy.y + 3/4 * enemy.height
        */
        if ( this.y < shipColisionYmax && 
             this.y > shipColisionYmin && 
             this.x < shipColisionXmax &&
             this.x > shipColisionXmin &&
             this.color != ship.color) {
                ship.setDestroyed();
                this.setDestroyed();
        }
        if ( this.y < shipColisionYmax && 
            this.y > shipColisionYmin && 
            this.x < shipColisionXmax &&
            this.x > shipColisionXmin &&
            this.color == ship.color) {
            //    ship.increasePower();
               this.setDestroyed();
       }
    }.bind(this))
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
    if(this.destroyed) {
        //window.requestAnimationFrame(this.blowUp.bind(this));
        this.blowUp();
        setTimeout(this.setRemovable.bind(this), 250);
        //console.log("TIMER: " + this.timer);
        //setTimeout(this.setDestroyed(), 2000);
        //clearInterval(this.timer);
        //this.blowUp();
        //console.log("REMOVE ENEMY");
    }
    if(this.removable) {
        var index = that.enemies.indexOf(this);
        that.enemies.splice(index, 1);
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

Enemy.prototype.checkCollision = function(ships) {
    ships.forEach(function(ship){
        var shipColisionXmin = ship.x - (1/2 * ship.width);
        var shipColisionXmax = ship.x + (1/2 * ship.width);
        var shipColisionYmin = ship.y - (1/2 * ship.height);
        var shipColisionYmax = ship.y + (1/2 * ship.height);
        /*
        enemy.x + 1/4 * enemy.width
        enemy.x + 3/4 * enemy.width
        enemy.y + 1/4 * enemy.height
        enemy.y + 3/4 * enemy.height
        */
        if ( this.y < shipColisionYmax && 
             this.y > shipColisionYmin && 
             this.x < shipColisionXmax &&
             this.x > shipColisionXmin &&
             this.color != ship.color) {
                ship.setDestroyed();
                this.setDestroyed();
        }
        if ( this.y < shipColisionYmax && 
            this.y > shipColisionYmin && 
            this.x < shipColisionXmax &&
            this.x > shipColisionXmin &&
            this.color == ship.color) {
               ship.setDestroyed();
               this.setDestroyed();
       }
    }.bind(this))
}