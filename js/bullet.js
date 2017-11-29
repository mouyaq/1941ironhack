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
}

Bullet.prototype.draw = function(that) {
    if(this.isRemovable()) {
        var index = that.bullets.indexOf(this);
        that.bullets.splice(index, 1);
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

Bullet.prototype.isRemovable = function() {
    return (this.x + this.width < 0 || this.x > this.canvas.width || this.y > this.canvas.height || this.y + this.height < 0);
}