Player.prototype = Object.create(Ship.prototype);

function Player(canvas, x, y, type, name, color, health, speedX, speedY) {
    Ship.call(this, canvas, x, y, type, name, color, health, speedX, speedY);
    this.scale = 0.5;
    this.frameIndexArray = [185, 181, 172, 188, 181, 172, 188];
    this.framePositionArray = [0, 186, 367, 539, 727, 908, 1080];
    this.frameIndex = 0;
    this.frameHeight = 180;
    this.frameWidth = this.frameIndexArray[this.frameIndex];
    this.width = this.frameWidth * this.scale;
    this.height = this.frameHeight * this.scale;
    this.bulletIndex = 0;
    // this.shootAudio = new Audio("./sounds/laser1.mp3");
    // this.shootAudio.volume = 0.4;
}

Player.prototype.draw = function(that) {
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
        var index = that.players.indexOf(this);
        that.players.splice(index, 1);
        if(that.players.length <= 0) {
            alert("GAME OVER");
        }
        //console.log("REMOVE ENEMY");
    }
    this.selectSprite(this.name, this.color);
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

        // draw supershot p1
        if(this.name == "player1") {
            this.ctx.save();
            this.ctx.fillStyle="#0000FF";
            this.ctx.strokeRect(10,100,10,600);
            this.ctx.restore();
            this.ctx.save();
            this.ctx.fillStyle="#0000FF";
            this.ctx.fillRect(10, 700, 10, -6 * this.superShot);
            this.ctx.restore();
        }
        // draw supershot p2
        if(this.name == "player2") {
            this.ctx.save();
            this.ctx.fillStyle="#FF0000";
            this.ctx.strokeRect(this.canvas.width - 20,100,10,600);
            this.ctx.restore();
            this.ctx.save();
            this.ctx.fillStyle="#FF0000";
            this.ctx.fillRect(this.canvas.width - 20, 700, 10, -6 * this.superShot);
            this.ctx.restore();
        }

    }.bind(this);
}

Player.prototype.move = function(that) {
    if (this.keys && this.keys[P1_CHANGE_COLOR]) { 
        this.changeColor(); 
    }
    if (this.keys && this.keys[P1_SHOOT]) { 
        this.shoot(that);
        this.shootAudio = new Audio("./sounds/laser1.mp3");
        this.shootAudio.volume = 0.4;
        this.shootAudio.play();
    }
    if (this.keys && this.keys[P2_CHANGE_COLOR]) { 
        this.changeColor(); 
    }
    if (this.keys && this.keys[P2_SHOOT]) { 
        this.shoot(that);
        this.shootAudio = new Audio("./sounds/laser1.mp3");
        this.shootAudio.volume = 0.4;
        this.shootAudio.play(); 
    }
}

Player.prototype.changeColor = function() {
    this.color == "white" ? this.color = "black" : this.color = "white";
    this.selectSprite(this.name, this.color);
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
        if(this.superShot >= 100) {
            this.bulletIndex = 2;
            that.playersBullets.push(new Bullet(this.canvas, this.x+this.width/2, this.y+this.height/2, this, "PlasLaser", this.bulletIndex, this.color, this.speedX, this.speedY));
            this.resetSuperShot();
        }
        else {
            this.bulletIndex = 0;
            that.playersBullets.push(new Bullet(this.canvas, this.x+this.width/2, this.y+this.height/2, this, "PlasLaser", this.bulletIndex, this.color, this.speedX, this.speedY));
            //console.log(this.x);
        }
    }
}