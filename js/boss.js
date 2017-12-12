Boss.prototype = Object.create(Enemy.prototype);

function Boss(game, canvas, x, y, type, name, color, health, speedX, speedY, player) {
    Enemy.call(this, game, canvas, x, y, type, name, color, health, speedX, speedY, player);
    this.life = this.health;
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
    this.isSettled = false;
    setInterval(function(){
        this.changeColor();
    }.bind(this), Math.floor((Math.random()*5)+1)*1000);
    this.superShotSpeed = 5;
}

Boss.prototype.draw = function() {
    if(this.destroyed || this.removable) {
        if(this.destroyed) {
            this.blowUp();
            setTimeout(this.setRemovable.bind(this), 250);
        }
        if(this.removable) {
            this.destroyed = false;
            this.removable = false;
            var index = this.game.bosses.indexOf(this);
            this.game.bosses.splice(index, 1);
            if(this.game.bosses.length <= 0) {
                this.game.nextLevel();
            }
        }
    }
    else {
        this.selectSprite(this.name, this.color);
        this.sprite.onload = function() {
    
            this.color == "white" ? this.colorHealth = "#FFFFFF" : this.colorHealth = "#000000";
    
            this.ctx.save();
            this.ctx.strokeStyle = this.colorHealth;
            this.ctx.lineWidth = 5;
            this.ctx.strokeRect(this.x, this.y - 20, this.width, 20);
            this.ctx.restore();
            this.ctx.save();
            this.ctx.fillStyle = this.colorHealth;
            this.ctx.fillRect(this.x, this.y - 20, (this.width/this.life)*this.health, 20);
            this.ctx.restore();
    
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
        this.move("angle");
    }
}

Boss.prototype.shot = function() {
//     this.bulletIndex = 4;
//     // that.enemiesBullets.push(new Bullet(this.canvas, this.x, this.y, 0, this, this.bulletIndex, this.color, "straight", -this.speedX*2, -Math.abs(this.speedY * 4), false));
//     // that.enemiesBullets.push(new Bullet(this.canvas, this.x+this.width/2, this.y, 0, this, this.bulletIndex, this.color, "straight", -this.speedX*2, -Math.abs(this.speedY * 4), false));
//     // that.enemiesBullets.push(new Bullet(this.canvas, this.x+this.width, this.y, 0, this, this.bulletIndex, this.color, "straight", -this.speedX*2, -Math.abs(this.speedY * 4), false));

//     that.enemiesBullets.push(new Bullet(this.canvas, this.x, this.y, 0, this, this.bulletIndex, this.color, "straight", -this.speedX*2, -Math.abs(this.speedY * 4), false));
//     that.enemiesBullets.push(new Bullet(this.canvas, this.x+30, this.y, 0, this, this.bulletIndex, this.color, "straight", -this.speedX*2, -Math.abs(this.speedY * 4), false));
//     that.enemiesBullets.push(new Bullet(this.canvas, this.x-30, this.y, 0, this, this.bulletIndex, this.color, "straight", -this.speedX*2, -Math.abs(this.speedY * 4), false));
    this.bulletIndex = 1;
    for(var i = 0; i < 32; i++){
        this.game.bossBullets.push(new Bullet(this.game, this.canvas, this.x+this.width/2, this.y+this.height/2, -1, this, this.bulletIndex, this.color, "concentric", this.superShotSpeed*Math.cos(i*Math.PI/16), this.superShotSpeed*Math.sin(i*Math.PI/16), true));            
    }
}


Boss.prototype.move = function(movement) {
    switch(movement) {
        case "straight":
            this.y += this.speedY;
            break;
        case "angle":
            if(this.isSettled) {
                if(this.x <= 0 || this.x + this.width >= this.canvas.width) {
                    this.speedX *= -1;       
                } 
                if(this.y <= 0 || this.y + this.height >= this.canvas.height) {
                    this.speedY *= -1;
                }
            }
            else {
                if(this.y < this.canvas.height/2){
                    this.y += this.speedY;
                }
                else {
                    this.y -= this.speedY;
                }
                if(this.x < this.canvas.width/2) {
                    this.x += this.speedX;
                }
                else {
                    this.x -= this.speedX;
                }
                this.isSettled = this.isOnScreen();
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

Boss.prototype.detectBorder = function() {
    return this.x < 0 || this.x + this.width >= this.canvas.width || this.y < 0 || this.y + this.height>= this.canvas.height;
}

Boss.prototype.isOnScreen = function() {
    return this.x > 0 && this.x + this.width < this.canvas.width && this.y - this.height > 0 && this.y + this.height < this.canvas.height; 
}

Boss.prototype.changeColor = function() {
    this.color == "white" ? this.color = "black" : this.color = "white";
    this.selectSprite(this.name, this.color);
}