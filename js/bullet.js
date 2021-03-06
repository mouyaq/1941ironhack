function Bullet(game, canvas, x, y, yAdjust, owner, index, color, movement, speedX, speedY, god) {
    this.game = game;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.frameType = ["PlasLaser", "PlasLaser", "PlasLaser", "Energy", "superShotDown"];
    this.x = x;
    this.y = y;
    this.bulletTime = 0;
    this.yAdjust = yAdjust;
    this.owner = owner;
    this.frameIndex = index ;
    this.type = this.frameType[this.frameIndex];
    this.color = color;
    this.movement = movement;
    this.speedX = speedX;
    this.speedY = speedY;
    this.sprite = new Image();
    this.selectSprite(this.type, this.color);
    this.damage = [1, 2];
    /*
    0: PlasLaser small (circle)
    1: PlasLaser small (circle) scaled for supershot
    2: PlasLaser medium
    3: PlasLaser large
    4: Energy
    5: superShotDown
    6: 
    7:
    */
    this.frameWidthArray = [85, 85, 85, 85, 206, 400];
    this.frameHeightArray = [85, 85, 195, 250, 962, 900];
    this.frameScale = [2, 4, 2, 2, 0.1, 1];
    this.frameScaleMinCollisionX = [3/8, 3/8, 3/8, 3/8, 1/4, 1/4];
    this.frameScaleMaxCollisionX = [5/8, 5/8, 5/8, 5/8, 3/4, 3/4];
    this.frameScaleMinCollisionY = [3/8, 3/8, 3/8, 3/8, 1/4, 1/4];
    this.frameScaleMaxCollisionY = [5/8, 5/8, 5/8, 5/8, 3/4, 3/4];    
    this.framePositionX = [907, 907, 365, 15, 0, 144];
    this.framePositionY = [85, 85, 30, 3, 0, 630]; 
    this.frameWidth = this.frameWidthArray[this.frameIndex];
    this.frameHeight = this.frameHeightArray[this.frameIndex];
    this.width = this.frameWidth * this.frameScale[this.frameIndex];
    this.height = this.frameHeight * this.frameScale[this.frameIndex];
    this.removable = false;
    this.x -= this.width / 2;
    this.y += this.yAdjust * this.height / 2;
    this.god = god;
}

Bullet.prototype.draw = function(bullets) {
    this.posXmin = this.x + this.frameScaleMinCollisionX[this.frameIndex] * this.width;
    this.posYmin = this.y + this.frameScaleMinCollisionX[this.frameIndex] * this.height;
    this.posXmax = this.x + this.frameScaleMaxCollisionY[this.frameIndex] * this.width;
    this.posYmax = this.y + this.frameScaleMaxCollisionY[this.frameIndex] * this.height;

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
            // this.ctx.save()
            // this.ctx.fillStyle = "#FF0000"
            // this.ctx.fillRect(this.posXmin,this.posYmin,this.posXmax-this.posXmin,this.posYmax-this.posYmin);
            // this.ctx.restore();

            if(this.frameType[this.frameIndex] != "superShotDown") {
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
            }
            if(this.frameType[this.frameIndex] == "superShotDown") {
                this.ctx.save();
                this.ctx.drawImage(
                  this.sprite,
                  this.framePositionX[this.frameIndex],
                  this.framePositionY[this.frameIndex],
                  this.frameWidth,
                  this.frameHeight,
                  this.owner.x,
                  this.owner.y,
                  this.width,
                  this.frameHeightArray[this.frameIndex] - this.framePositionY[this.frameIndex]
                );
                this.ctx.restore();
                this.framePositionY[this.frameIndex] += this.speedY;
                
            }
        }.bind(this);

        this.move(this.movement);
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
    this.posXmin = this.x + this.frameScaleMinCollisionX[this.frameIndex] * this.width;
    this.posYmin = this.y + this.frameScaleMinCollisionX[this.frameIndex] * this.height;
    this.posXmax = this.x + this.frameScaleMaxCollisionY[this.frameIndex] * this.width;
    this.posYmax = this.y + this.frameScaleMaxCollisionY[this.frameIndex] * this.height;
    ships.forEach(function(ship){
        if( 
            // this.posXmin, this.posYmin
            ((this.posXmin > ship.posXmin && this.posXmin < ship.posXmax && this.posYmin > ship.posYmin && this.posYmin < ship.posYmax) ||
            // this.posXmax, this.posYmin
            (this.posXmax > ship.posXmin && this.posXmax < ship.posXmax && this.posYmin > ship.posYmin && this.posYmin < ship.posYmax) ||
            // this.posXmin, this.posYmax
            (this.posXmin > ship.posXmin && this.posXmin < ship.posXmax && this.posYmax > ship.posYmin && this.posYmax < ship.posYmax) ||
            // this.posXmax, this.posYmax
            (this.posXmax > ship.posXmin && this.posXmax < ship.posXmax && this.posYmax > ship.posYmin && this.posYmax < ship.posYmax)) &&
            (this.color != ship.color)
        ) {
            ship.receiveDamage();
            if(!ship.isAlive()) {
                ship.setDestroyed(this.owner);
                // this.owner.addScore();
            }
            if(!this.god) {
                this.setRemovable();
            }
            
        }
        if( 
            // this.posXmin, this.posYmin
            ((this.posXmin > ship.posXmin && this.posXmin < ship.posXmax && this.posYmin > ship.posYmin && this.posYmin < ship.posYmax) ||
            // this.posXmax, this.posYmin
            (this.posXmax > ship.posXmin && this.posXmax < ship.posXmax && this.posYmin > ship.posYmin && this.posYmin < ship.posYmax) ||
            // this.posXmin, this.posYmax
            (this.posXmin > ship.posXmin && this.posXmin < ship.posXmax && this.posYmax > ship.posYmin && this.posYmax < ship.posYmax) ||
            // this.posXmax, this.posYmax
            (this.posXmax > ship.posXmin && this.posXmax < ship.posXmax && this.posYmax > ship.posYmin && this.posYmax < ship.posYmax)) &&
            (this.color == ship.color)
        ) {
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

Bullet.prototype.move = function(movement) {
    switch(movement) {
        case "straight":
            this.y -= this.speedY;
            break;
        case "angleLeft":
            this.y -= this.speedY;
            this.x += this.speedX/2;
            break;
        case "angleRight":
            this.y -= this.speedY;
            this.x -= this.speedX/4;
            break;
        case "sin":
            this.y -= this.speedY;
            this.x += Math.sin(this.bulletTime * (Math.PI/90));
            this.bulletTime += 1;
            break;
        case "concentric":
            this.y += this.speedY;
            this.x += this.speedX;
            break;
        default:
            this.y -= this.speedY;
            break;
    }   
}