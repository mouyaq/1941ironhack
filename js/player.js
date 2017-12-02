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
        if (this.keys && this.keys[P1_UP]) { 
            this.moveUp();
            this.resetMove(); 
        }
        if (this.keys && this.keys[P1_DOWN]) { 
            this.moveDown();
            this.resetMove();
         }
        if (this.keys && this.keys[P1_LEFT]) { this.moveLeft(); }
        if (this.keys && this.keys[P1_RIGHT]) { this.moveRight(); }
        
        if (this.keys && this.keys[P2_UP]) { 
            this.moveUp();
            this.resetMove(); 
        }
        if (this.keys && this.keys[P2_DOWN]) { 
            this.moveDown();
            this.resetMove();
         }
        if (this.keys && this.keys[P2_LEFT]) { this.moveLeft(); }
        if (this.keys && this.keys[P2_RIGHT]) { this.moveRight(); }

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
    if (this.keys && this.keys[P1_CHANGE_COLOR]) { this.changeColor() }
    if (this.keys && this.keys[P1_SHOOT]) { this.shoot(that) }
    if (this.keys && this.keys[P2_CHANGE_COLOR]) { this.changeColor() }
    if (this.keys && this.keys[P2_SHOOT]) { this.shoot(that) }
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