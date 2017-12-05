function Bullet(canvas, x, y, yAdjust, owner, type, index, color, speedX, speedY, scale, god) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.x = x;
    this.y = y;
    this.owner = owner;
    this.type = type;
    this.color = color;
    this.speedX = speedX;
    this.speedY = speedY;
    this.sprite = new Image();
    this.selectSprite(this.type, this.color);
    this.damage = [1, 2];
    this.frameWidthArray = [85, 85, 85];
    this.frameHeightArray = [85, 195, 250];
    this.framePositionX = [907, 365, 15];
    this.framePositionY = [85, 30, 3];
    // shot power changes index 0 = min   
    this.frameIndex = index ;
    this.frameWidth = this.frameWidthArray[this.frameIndex];
    this.frameHeight = this.frameHeightArray[this.frameIndex];
    this.width = this.frameWidth * scale;
    this.height = this.frameHeight * scale;
    this.removable = false;
    this.x -= this.width / 2;
    this.y += yAdjust * this.height / 2;
    this.god = god;
}

Bullet.prototype.draw = function(bullets) {
    if(this.removable) {
        var index = bullets.indexOf(this);
        bullets.splice(index, 1);
    }
    else {
        this.selectSprite(this.type, this.color);
        this.sprite.onload = function() {

            // this.ctx.save()
            // this.ctx.clearRect(this.x,this.y,this.width,this.height);
            // this.ctx.fillRect(this.x,this.y,this.width,this.height);
            // this.ctx.restore();

            this.ctx.save();
            this.ctx.drawImage(
              this.sprite,
              this.framePositionX[this.frameIndex],
              this.framePositionY[this.frameIndex],
              this.frameWidth,
              this.frameHeight,
              this.x,
              this.y,
              this.width,
              this.height
            );
            this.ctx.restore();
        }.bind(this);
        this.y -= this.speedY;
        //this.move();
    }   
}

Bullet.prototype.selectSprite = function(type, color) {
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

Bullet.prototype.isOutOfScreen = function() {
    if(this.x + this.width < 0 || this.x > this.canvas.width || this.y > this.canvas.height || this.y + this.height < 0) {
        this.setRemovable();
    }
}

Bullet.prototype.checkCollision = function(ships) {
    this.posXmin = this.x + 1/4 * this.width;
    this.posYmin = this.y + 1/4 * this.height;
    this.posXmax = this.x + 3/4 * this.width;
    this.posYmax = this.y + 3/4 * this.height;
    ships.forEach(function(ship){
        if( 
            ((this.posXmin < ship.posXmax && this.posXmax > ship.posXmax && this.posYmin < ship.posYmax && this.posYmax > ship.posYmax) ||
            (this.posXmin < ship.posXmax && this.posXmax > ship.posXmax && this.posYmin < ship.posYmin && this.posYmax > ship.posYmin) ||
            (this.posXmin < ship.posXmin && this.posXmax > ship.posXmin && this.posYmin < ship.posYmax && this.posYmax > ship.posYmax) ||
            (this.posXmin < ship.posXmin && this.posXmax > ship.posXmin && this.posYmin < ship.posYmin && this.posYmax > ship.posYmin)) 
            && (this.color != ship.color)
        ) {
            //console.log("BULLET COLLISION !=");
            //console.log("BULLET COLOR = " + this.color + " SHIP COLOR = " + ship.color);
            if(ship.type == "enemy") {
                this.owner.addScore();
            }
            ship.setDestroyed();
            if(!this.god) {
                this.setRemovable();
            }
            
        }
        if( 
            ((this.posXmin < ship.posXmax && this.posXmax > ship.posXmax && this.posYmin < ship.posYmax && this.posYmax > ship.posYmax) ||
            (this.posXmin < ship.posXmax && this.posXmax > ship.posXmax && this.posYmin < ship.posYmin && this.posYmax > ship.posYmin) ||
            (this.posXmin < ship.posXmin && this.posXmax > ship.posXmin && this.posYmin < ship.posYmax && this.posYmax > ship.posYmax) ||
            (this.posXmin < ship.posXmin && this.posXmax > ship.posXmin && this.posYmin < ship.posYmin && this.posYmax > ship.posYmin)) 
            && (this.color == ship.color)
        ) {
            //console.log("BULLET COLLISION ==");
            //console.log("BULLET COLOR = " + this.color + " SHIP COLOR = " + ship.color);            
            ship.increaseSuperShot();
            if(!this.god) {
                this.setRemovable();
            }
        }
    }.bind(this))
}

Bullet.prototype.setRemovable = function() {
    this.removable = true;
}