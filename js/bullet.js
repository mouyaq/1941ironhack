function Bullet(canvas, x, y, type, index, color, speedX, speedY) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.x = x;
    this.y = y;
    this.type = type;
    this.color = color;
    this.speedX = speedX;
    this.speedY = speedY;
    this.sprite = new Image();
    this.selectSprite(this.type, this.color);
    this.scale = 1;
    this.damage = [1, 2];
    this.frameWidthArray = [85, 85, 85];
    this.frameHeightArray = [85, 195, 250];
    this.framePositionX = [907, 365, 15];
    this.framePositionY = [85, 30, 3];
    // shoot power changes index 0 = min   
    this.frameIndex = index ;
    this.frameWidth = this.frameWidthArray[this.frameIndex];
    this.frameHeight = this.frameHeightArray[this.frameIndex];
    this.width = this.frameWidth * this.scale;
    this.height = this.frameHeight * this.scale;
    this.removable = false;
}

Bullet.prototype.draw = function(bullets) {
    if(this.removable) {
        var index = bullets.indexOf(this);
        bullets.splice(index, 1);
        //console.log("REMOVE BULLET");
    }
    else {
        this.selectSprite(this.type, this.color);
        this.sprite.onload = function() {
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

Bullet.prototype.checkCollision = function(enemies) {
    enemies.forEach(function(enemy){
        var enemyColisionXmin = enemy.x;
        var enemyColisionXmax = enemy.x + enemy.width;
        var enemyColisionYmin = enemy.y;
        var enemyColisionYmax = enemy.y + enemy.height;
        /*
        enemy.x + 1/4 * enemy.width
        enemy.x + 3/4 * enemy.width
        enemy.y + 1/4 * enemy.height
        enemy.y + 3/4 * enemy.height
        */
        if ( this.y < enemyColisionYmax && 
             this.y > enemyColisionYmin && 
             this.x < enemyColisionXmax &&
             this.x > enemyColisionXmin) {
                console.log("HIT");
                enemy.setRemovable();
        }
    }.bind(this))
}

Bullet.prototype.setRemovable = function() {
    this.removable = true;
}