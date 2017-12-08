Enemy.prototype = Object.create(Ship.prototype);

function Enemy(canvas, x, y, type, name, color, health, speedX, speedY, player) {
    Ship.call(this, canvas, x, y, type, name, color, health, speedX, speedY);
    this.life = this.health;
    this.playerPositionX = player.x;
    this.playerPositionY = player.y;
    this.frameWidthArray = [154, 554];
    this.frameHeightArray = [224, 495];
    this.framePositionArray = [0, 0];
    switch(this.name) {
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
    this.selectSprite(this.name, this.color);
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

        // this.ctx.save()
        // this.ctx.fillStyle = "#FF0000"
        // this.ctx.fillRect(this.posXmin,this.posYmin,this.posXmax-this.posXmin,this.posYmax-this.posYmin);
        // this.ctx.restore();

        this.color == "white" ? this.colorHealth = "#FFFFFF" : this.colorHealth = "#000000";

        this.ctx.save();
        this.ctx.strokeStyle=this.colorHealth;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.x, this.y-10, this.width, 10);
        this.ctx.restore();
        this.ctx.save();
        this.ctx.fillStyle=this.colorHealth;
        this.ctx.fillRect(this.x, this.y-10, (this.width/this.life)*this.health, 10);
        this.ctx.restore();

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

Enemy.prototype.shot = function(that) {
    that.enemiesBullets.push(new Bullet(this.canvas, this.x+this.width/2, this.y, 0, this, 0, this.color, -this.speedX*2, -this.speedY*2, false));
}