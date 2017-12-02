function Game(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.bg = new Bg(canvas);
    // interval for each enemy in seconds.
    this.enemyInterval = 1;
    // Maximum number of enemies
    this.maxEnemies = 10;
    this.maxPlayerBullets = 25;
    this.maxEnemyBullets = 50
    this.enemiesList = ["enemy1", "enemy2"];
    this.colorList = ["white", "black"];
    this.players = [];
    this.player1 = new Player(canvas, this.canvas.width / 4, this.canvas.height, "player1", this.colorList[Math.floor(Math.random() * this.colorList.length)], 100, 10, 5);
    this.players.push(this.player1);
    //this.player2 = new Player(canvas, this.canvas.width * 3/4, this.canvas.height - 100, "player1", this.colorList[Math.floor(Math.random() * this.colorList.length)], 100, 10, 5);
    //this.players.push(this.player2);
    this.playersBullets = [];
    this.enemies = [];
    this.enemiesBullets = [];
    setInterval(function(){
        if(this.enemies.length < this.maxEnemies) { 
            this.enemies.push(new Enemy(this.canvas, Math.floor(Math.random()*700), Math.floor(Math.random()*-500)-200, this.enemiesList[Math.floor(Math.random() * this.enemiesList.length)], this.colorList[Math.floor(Math.random() * this.colorList.length)], 100, 1, 1, this.player1));
            console.log("NUMERO DE ENEMIGOS: " + this.enemies.length);
        }
    }.bind(this), (Math.floor(Math.random() * this.enemyInterval) + 1) * 1000 );
    setInterval(function(){
        this.enemies.forEach(function(enemy){
            if(enemy.y > 0 && this.enemiesBullets.length < this.maxEnemyBullets) { 
                enemy.shoot(this);
                console.log("ENEMIES BULLETS: " + this.enemiesBullets.length);
                console.log("PLAYER BULLETS: " + this.playersBullets.length);
            }
        }.bind(this));
    }.bind(this), 1000);
    this.keysList = [];
    // document.onkeydown = this.onKeyDown.bind(this);
    // document.onkeyup = this.onKeyUp.bind(this);
    window.addEventListener('keydown', function (e) {
        this.keys = (this.keys || []);
        this.keys[e.keyCode] = true;
        this.player1.move(this);
    }.bind(this))
    window.addEventListener('keyup', function (e) {
        this.keys[e.keyCode] = false; 
        this.player1.resetMove();
    }.bind(this))
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
        enemy.checkCollision(this.players);
        enemy.draw(this);
    }.bind(this))
    // Draw player1
    this.players.forEach(function(player) {
        player.checkCollision(this.players);
        player.draw(this);
    }.bind(this))
    
    // Draw player2
    //this.player2.draw();

    window.requestAnimationFrame(this.draw.bind(this));
}