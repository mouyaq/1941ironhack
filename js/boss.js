Boss.prototype = Object.create(Enemy.prototype);

function Boss(canvas, x, y, type, name, color, health, speedX, speedY, player) {
    Enemy.call(this, canvas, x, y, type, name, color, health, speedX, speedY, player);
    this.playerPositionX = player.x;
    this.playerPositionY = player.y;
    this.frameWidthArray = [928];
    this.frameHeightArray = [583];
    this.framePositionArray = [0];
    switch(this.name) {
        case "boss1":
            this.frameIndex = 0;
            this.scale = 0.6;
            break;
    }
    this.frameHeight = this.frameHeightArray[this.frameIndex];
    this.frameWidth = this.frameWidthArray[this.frameIndex];
    this.width = this.frameWidth * this.scale;
    this.height = this.frameHeight * this.scale;
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
    this.selectSprite(this.name, this.color);
    this.sprite.onload = function() {

        // this.ctx.save()
        // this.ctx.clearRect(this.x,this.y,this.width,this.height);
        // this.ctx.fillRect(this.x,this.y,this.width,this.height);
        // this.ctx.restore();

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

Boss.prototype.shot = function(that) {
    that.enemiesBullets.push(new Bullet(this.canvas, this.x, this.y, 0, this, "PlasLaser", 2, this.color, -this.speedX*2, -this.speedY*2, 2, false));
    that.enemiesBullets.push(new Bullet(this.canvas, this.x+this.width/2, this.y, 0, this, "PlasLaser", 2, this.color, -this.speedX*2, -this.speedY*2, 2, false));
    that.enemiesBullets.push(new Bullet(this.canvas, this.x+this.width, this.y, 0, this, "PlasLaser", 2, this.color, -this.speedX*2, -this.speedY*2, 2, false));
    
}