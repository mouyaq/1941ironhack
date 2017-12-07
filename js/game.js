function Game(canvas, playerNumber, dificult) {
    this.canvas = canvas;
    this.playerNumber = playerNumber.toLowerCase();
    this.dificult = dificult.toLowerCase();
    this.ctx = this.canvas.getContext('2d');
    this.bg = new Bg(canvas);
    this.playersBullets = [];
    this.enemies = [];
    this.enemiesBullets = [];
    this.setDificult("tutorial");
    setTimeout(function(){
        this.setDificult(this.dificult);
    }.bind(this), 22000);
    this.enemiesList = ["enemy1", "enemy2"];
    this.colorList = ["white", "black"];
    this.players = [];
    this.player1 = new Player(this.canvas, this.canvas.width * 1/4, this.canvas.height - 100, "player", "player1", this.colorList[Math.floor(Math.random() * this.colorList.length)], 5, 10, 5, this.shotIncrement);
    this.players.push(this.player1);
    if(this.playerNumber == "2 players") {
        this.player2 = new Player(this.canvas, this.canvas.width * 3/4, this.canvas.height - 100, "player", "player2", this.colorList[Math.floor(Math.random() * this.colorList.length)], 5, 10, 5, this.shotIncrement);
        this.players.push(this.player2);
    }
    else {
        //console.log(this.playerNumber);
    }
    this.keysList = [];

    window.addEventListener('keydown', function (e) {
        if(e.keyCode == P1_UP || e.keyCode == P1_DOWN || e.keyCode == P1_LEFT || e.keyCode == P1_RIGHT || e.keyCode == P1_CHANGE_COLOR || e.keyCode == P1_SHOT || e.keyCode == P1_SUPERSHOT) {
            this.player1.keys = (this.player1.keys || []);
            this.player1.keys[e.keyCode] = true;
            this.player1.move(this);
        }
        if(e.keyCode == P2_UP || e.keyCode == P2_DOWN || e.keyCode == P2_LEFT || e.keyCode == P2_RIGHT || e.keyCode == P2_CHANGE_COLOR || e.keyCode == P2_SHOT || e.keyCode == P2_SUPERSHOT) {
            this.player2.keys = (this.player2.keys || []);
            this.player2.keys[e.keyCode] = true;
            this.player2.move(this);
        }
    }.bind(this))
    window.addEventListener('keyup', function (e) {
        if(e.keyCode == P1_UP || e.keyCode == P1_DOWN || e.keyCode == P1_LEFT || e.keyCode == P1_RIGHT || e.keyCode == P1_CHANGE_COLOR || e.keyCode == P1_SHOT || e.keyCode == P1_SUPERSHOT) {
            this.player1.keys[e.keyCode] = false; 
            this.player1.resetMove();
        }
        if(e.keyCode == P2_UP || e.keyCode == P2_DOWN || e.keyCode == P2_LEFT || e.keyCode == P2_RIGHT || e.keyCode == P2_CHANGE_COLOR || e.keyCode == P2_SHOT || e.keyCode == P2_SUPERSHOT) {
            this.player2.keys[e.keyCode] = false;
            this.player2.resetMove();
        }
    }.bind(this))

}

Game.prototype.draw = function(mode) {
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
        //player.checkCollision(this.enemies);
        player.checkCollision(this.players);
        player.draw(this);
    }.bind(this))

    window.requestAnimationFrame(this.draw.bind(this));
}

Game.prototype.setDificult = function(dificult) {
    switch(dificult) {
        case "tutorial":
            // interval for each enemy in seconds.
            this.enemyInterval = 5;
            // Maximum number of enemies
            this.maxEnemies = 5;
            this.maxPlayerBullets = 25;
            this.maxEnemyBullets = 1
            this.enemySpeedX = 0.5;
            this.enemySpeedY = 0.5;
            this.shotIncrement = 25;
            console.log("SET DIFICULT TO TUTORIAL");
            this.createEnemies();
            break;
        case "easy":
            // interval for each enemy in seconds.
            // this.enemyInterval = this.myRandom(3,5);
            this.enemyInterval = 5;
            // Maximum number of enemies
            this.maxEnemies = 5;
            this.maxPlayerBullets = 25;
            this.maxEnemyBullets = 15
            this.enemySpeedX = 2;
            this.enemySpeedY = 2;
            this.shotIncrement = 25;
            console.log("SET DIFICULT TO EASY");
            this.deleteEnemiesInterval();
            this.createEnemies();
            break;
        case "normal":
           // interval for each enemy in seconds.
           // this.enemyInterval = this.myRandom(2,4);
           this.enemyInterval = 3;
           // Maximum number of enemies
           this.maxEnemies = 10;
           this.maxPlayerBullets = 25;
           this.maxEnemyBullets = 30
           this.enemySpeedX = 4;
           this.enemySpeedY = 4;
           this.shotIncrement = 10;
           console.log("SET DIFICULT TO MEDIUM");
           this.deleteEnemiesInterval();
           this.createEnemies();
           break;
        case "hard":
           // interval for each enemy in seconds.
        //    this.enemyInterval = this.myRandom(1,3);
            this.enemyInterval = 2;
           // Maximum number of enemies
           this.maxEnemies = 15;
           this.maxPlayerBullets = 25;
           this.maxEnemyBullets = 50
           this.enemySpeedX = 8;
           this.enemySpeedY = 8;
           this.shotIncrement = 5;
           console.log("SET DIFICULT TO HARD");
           this.deleteEnemiesInterval();
           this.createEnemies();
           break;
        case "inferno":
           // interval for each enemy in seconds.
           //this.enemyInterval = this.myRandom(0.5,1);
           this.enemyInterval = 1;
           // Maximum number of enemies
           this.maxEnemies = 30;
           this.maxPlayerBullets = 15;
           this.maxEnemyBullets = 100
           this.enemySpeedX = 16;
           this.enemySpeedY = 16;
           this.shotIncrement = 1;
           console.log("SET DIFICULT TO INFERNO");
           this.deleteEnemiesInterval();
           this.createEnemies();
           break;
        default:
    }
}

Game.prototype.createEnemies = function() {
    this.enemyPushInterval = setInterval(function(){
        if(this.enemies.length < this.maxEnemies) { 
            this.enemies.push(new Enemy(this.canvas, Math.floor(Math.random()*700), Math.floor(Math.random()*-500)-200, "enemy", this.enemiesList[Math.floor(Math.random() * this.enemiesList.length)], this.colorList[Math.floor(Math.random() * this.colorList.length)], 1, this.enemySpeedX, this.enemySpeedY, this.player1));
            //console.log("NUMERO DE ENEMIGOS: " + this.enemies.length);
        }
        if( parseInt(document.getElementById("score-p1").innerHTML) > 10) {
            this.enemies = [];
            this.enemies.push(new Boss(this.canvas, Math.floor(Math.random()*700), Math.floor(Math.random()*-500)-200, "boss", "boss1", this.colorList[Math.floor(Math.random() * this.colorList.length)], 10, this.enemySpeedX, this.enemySpeedY, this.player1));
            clearInterval(this.enemyPushInterval);
            console.log("NUMERO DE ENEMIGOS: " + this.enemies.length);
        }
    }.bind(this), (Math.floor(Math.random() * this.enemyInterval) + 0.3) * 1000 );

    this.enemyShootInterval = setInterval(function(){
        this.enemies.forEach(function(enemy){
            //if(enemy.y > 0 && this.enemiesBullets.length < this.maxEnemyBullets) { 
            if(enemy.y > 0) { 
                enemy.shot(this);
                // console.log("ENEMIES BULLETS: " + this.enemiesBullets.length);
                // console.log("PLAYER BULLETS: " + this.playersBullets.length);
            }
        }.bind(this));
    }.bind(this), this.enemyInterval * 1000);
}

Game.prototype.deleteEnemiesInterval = function() {
    clearInterval(this.enemyPushInterval);
    clearInterval(this.enemyShootInterval);
}

Game.prototype.myRandom = function(min, max) {
    var num = Math.floor(Math.random() * max + 1);
    if(num < min) {
      num = min;
    }
    return num;
}

Game.prototype.gameOver = function() {
    /*
    this.sprite = new Image();
    this.sprite.src = "./images/bg/game-over.png";
    this.width = this.sprite.width;
    this.height = this.sprite.height;
    this.sprite.onload = function() {
        this.ctx.clearRect(0,0,this.width, this.height);
        this.ctx.drawImage(this.sprite, this.x, this.y);
    }.bind(this);
    */
    this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
    alert("GAME OVER");
    setTimeout(function() {
        window.location.replace("./index.html");
    }, 5000);
}