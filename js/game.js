function Game(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.bg = new Bg(canvas);
    // interval for each enemy in seconds.
    this.enemyInterval = 5;
    this.enemiesList = ["enemy1", "enemy2"];
    this.colorList = ["white", "black"];
    this.players = [];
    this.player1 = new Player(canvas, this.canvas.width / 4, this.canvas.height - 100, "player1", this.colorList[Math.floor(Math.random() * this.colorList.length)], 100, 10, 5);
    this.players.push(this.player1);
    // this.player2 = new Player(canvas, 615, 700, "player1", "white", 100, 10, 10);
    this.playersBullets = [];
    this.enemies = [];
    this.enemiesBullets = [];
    setInterval(function(){
        if(this.enemies.length < 5) { 
            this.enemies.push(new Enemy(this.canvas, Math.floor(Math.random()*700), Math.floor(Math.random()*-500)-200, this.enemiesList[Math.floor(Math.random() * this.enemiesList.length)], this.colorList[Math.floor(Math.random() * this.colorList.length)], 100, 0.5, 0.5, this.player1));
            console.log("NUMERO DE ENEMIGOS: " + this.enemies.length);
        }
    }.bind(this), (Math.floor(Math.random() * this.enemyInterval) + 1) * 1000 );
    setInterval(function(){
        this.enemies.forEach(function(enemy){
            if(enemy.y > 0) { 
                enemy.shoot(this);
                // console.log("ENEMIES BULLETS: " + this.enemiesBullets.length);
                // console.log("PLAYER BULLETS: " + this.playersBullets.length);
            }
        }.bind(this));
    }.bind(this), 1000);
    this.keysList = [];
    document.onkeydown = this.onKeyDown.bind(this);
    document.onkeyup = this.onKeyUp.bind(this);
}

Game.prototype.draw = function() {
    // check collisions
    //this.checkCollisions(this.players, this.enemiesList, this.bullets);
    // Draw background
    this.bg.draw();
    // Draw players bullets
    this.playersBullets.forEach(function(bullet) {
        bullet.isOutOfScreen();
        bullet.checkCollision(this.enemies);
        bullet.draw(this.playersBullets);
    }.bind(this))
    // Draw enemies bullets
    this.enemiesBullets.forEach(function(bullet) {
        bullet.isOutOfScreen();
        bullet.checkCollision(this.players);
        bullet.draw(this.enemiesBullets);
    }.bind(this))
    // Draw enemies
    this.enemies.forEach(function(enemy) {
        enemy.isOutOfScreen();
        enemy.draw(this);
    }.bind(this))
    // Draw player1
    this.players.forEach(function(player) {
        player.draw(this);
    }.bind(this))
    
    // Draw player2
    // this.player2.draw();

    window.requestAnimationFrame(this.draw.bind(this));
}

Game.prototype.onKeyDown = function(event) {
    this.keysList.push(event.keyCode);
    for(i=0; i < this.keysList.length; i++) {
        switch(this.keysList[i]) {
            case P1_UP:
                this.player1.moveUp();
                break;
            case P1_DOWN:
                this.player1.moveDown();
                break;
            case P1_LEFT:
                this.player1.moveLeft();
                break;
            case P1_RIGHT:
                this.player1.moveRight();
                break;
            case P1_CHANGE_COLOR:
                this.player1.changeColor();
                break;
            case P1_SHOOT:
                this.player1.shoot(this);
                break;
            // case P2_UP:
            //     this.player2.moveUp();
            //     break;
            // case P2_DOWN:
            //     this.player2.moveDown();
            //     break;
            // case P2_LEFT:
            //     this.player2.moveLeft();
            //     break;
            // case P2_RIGHT:
            //     this.player2.moveRight();
            //     break;
            // case P2_CHANGE_COLOR:
            //     this.player2.changeColor();
            //     break;
        }
    }
}

Game.prototype.onKeyUp = function(event) {
    this.keysList = [];
    this.player1.frameIndex = 0;
    // this.player2.frameIndex = 0;
}

Game.prototype.checkCollision = function(players, enemies, bullets) {
    // Possible collisions:
    // Player with enemy
    players.forEarch(function(player){

    })
    // Player with enemy bullet
    // Enemy with player bullet
    // Between players != color

}