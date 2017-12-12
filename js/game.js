function Game(canvas, playerNumber, dificult) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.playerNumber = playerNumber.toLowerCase();
    this.gameOver = false;
    this.dificultArray = ["tutorial", "easy", "normal", "hard", "inferno"];
    this.dificult = this.dificultArray.indexOf(dificult.toLowerCase());
    this.actualDificult = 0;
    this.nextDificult = this.dificult;
    this.actualBg = 0;
    // First 22 seconds always are tutorial mode
    this.setDificult(this.actualDificult);
    // After 22 seconds set real dificult
    setTimeout(function(){
        this.setDificult(this.dificult);
    }.bind(this), 22000);
    this.gameBgArray = ["tutorial-min", "cartoonCity", "evilSky", "sunnySky", "beePanels", "realSky"];
    this.bg = new Bg(this, this.canvas);
    this.playersBullets = [];
    this.enemies = [];
    this.enemiesBullets = [];
    this.enemiesList = ["enemy1", "enemy2", "enemy3", "enemy4", "enemy5", "enemy6"];
    this.bossList = ["boss1"];
    this.boss = null;
    this.bosses = [];
    this.bossIndex = 0;
    this.bossBullets = [];
    this.colorList = ["white", "black"];
    this.players = [];
    this.player1 = new Player(this, this.canvas, this.canvas.width * 1/4, this.canvas.height - 150, "player", "player1", this.colorList[Math.floor(Math.random() * this.colorList.length)], 5, 10, 5, this.shotIncrement);
    this.players.push(this.player1);
    if(this.playerNumber == "2 players") {
        this.player2 = new Player(this, this.canvas, this.canvas.width * 3/4, this.canvas.height - 150, "player", "player2", this.colorList[Math.floor(Math.random() * this.colorList.length)], 5, 10, 5, this.shotIncrement);
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

Game.prototype.draw = function() {
        // Draw background
        this.bg.draw(this.actualBg);
        // Draw players bullets
        this.playersBullets.forEach(function(bullet) {
            bullet.isOutOfScreen();
            bullet.checkCollision(this.enemies);
            bullet.checkCollision(this.bosses);
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
            enemy.draw();
        }.bind(this))
        // Draw player1
        this.players.forEach(function(player) {
            //player.checkCollision(this.enemies);
            player.checkCollision(this.players);
            player.draw();
        }.bind(this))
        // Draw Boss
        this.bosses.forEach(function(boss) {
            boss.isOutOfScreen();
            boss.checkCollision(this.players);
            boss.draw();
        }.bind(this))
        // Draw boss bullets
        this.bossBullets.forEach(function(bullet) {
            bullet.isOutOfScreen();
            bullet.checkCollision(this.players);
            bullet.draw(this.bossBullets);
        }.bind(this))

        this.animationId = requestAnimationFrame(this.draw.bind(this));
}

Game.prototype.setDificult = function(dificult) {
    switch(this.dificultArray[dificult]) {
        case "tutorial":
            $("#dificult-screen").text("TUTORIAL");
            this.audioTutorial = new Audio("./sounds/ik0.mp3");
            this.audioTutorial.volume = 0.1;
            this.audioTutorial.play();
            this.actualDificult = 0;
            this.actualBg = 0;
            this.enemyInterval = 5;
            this.maxEnemies = 2;
            this.maxPlayerBullets = 50;
            this.maxEnemyBullets = 10;
            this.enemySpeedX = 1;
            this.enemySpeedY = 1;
            this.shotIncrement = 25;
            // this.bossPoints = 50;
            // this.bossLife = 100;
            this.deleteEnemiesInterval();
            this.createEnemies();
            this.createShotEnemies();
            break;
        case "easy":
            $("#dificult-screen").text("EASY");
            this.audioGame = new Audio("./sounds/ik1_loop.mp3");
            this.audioGame.volume = 0.1;
            this.audioGame.loop = "loop";
            this.audioGame.play();
            this.audioTutorial.pause();
            this.audioTutorial.currentTime = 0;
            this.actualDificult = 1;    
            this.actualBg = 1;        
            this.enemyInterval = 5;
            this.maxEnemies = 5;
            this.maxPlayerBullets = 50;
            this.maxEnemyBullets = 20;
            this.enemySpeedX = 2;
            this.enemySpeedY = 2;
            this.shotIncrement = 10;
            this.bossPoints = 50;
            this.bossLife = 100;
            this.numMaxBosses = 1;
            this.deleteEnemiesInterval();
            this.createEnemies();
            this.createShotEnemies();
            this.createBoss();    
            this.createShotBoss();    
            break;
        case "normal":
            $("#dificult-screen").text("NORMAL");
            this.audioGame = new Audio("./sounds/ik1_loop.mp3");
            this.audioGame.volume = 0.1;
            this.audioGame.loop = "loop";
            this.audioGame.play();
            this.audioTutorial.pause();
            this.audioTutorial.currentTime = 0;
            this.actualDificult = 2;
            this.actualBg = 2;
            this.enemyInterval = 3;
            this.maxEnemies = 10;
            this.maxPlayerBullets = 50;
            this.maxEnemyBullets = 30;
            this.enemySpeedX = 4;
            this.enemySpeedY = 4;
            this.shotIncrement = 5;
            this.bossPoints = 100;
            this.bossLife = 200;
            this.numMaxBosses = 1;
            this.deleteEnemiesInterval();
            this.createEnemies();
            this.createShotEnemies();    
            this.createBoss();
            this.createShotBoss();     
            break;
        case "hard":
            $("#dificult-screen").text("HARD");
            this.audioGame = new Audio("./sounds/ik1_loop.mp3");
            this.audioGame.volume = 0.1;
            this.audioGame.loop = "loop";
            this.audioGame.play();
            this.audioTutorial.pause();
            this.audioTutorial.currentTime = 0;
            this.actualDificult = 3;
            this.actualBg = 3;
            this.enemyInterval = 2;
            this.maxEnemies = 15;
            this.maxPlayerBullets = 50;
            this.maxEnemyBullets = 50;
            this.enemySpeedX = 8;
            this.enemySpeedY = 8;
            this.shotIncrement = 1;
            this.bossPoints = 200;
            this.bossLife = 300;
            this.numMaxBosses = 1;
            this.deleteEnemiesInterval();
            this.createEnemies();
            this.createShotEnemies();
            this.createBoss();    
            this.createShotBoss();       
            break;
        case "inferno":
            $("#dificult-screen").text("INFERNO");
            this.audioGame = new Audio("./sounds/ik1_loop.mp3");
            this.audioGame.volume = 0.1;
            this.audioGame.loop = "loop";
            this.audioGame.play();
            this.audioTutorial.pause();
            this.audioTutorial.currentTime = 0;
            this.actualDificult = 4;
            this.actualBg = 4;
            this.enemyInterval = 1;
            this.maxEnemies = 30;
            this.maxPlayerBullets = 50;
            this.maxEnemyBullets = 100;
            this.enemySpeedX = 16;
            this.enemySpeedY = 16;
            this.shotIncrement = 0.5;
            this.bossPoints = 400;  
            this.bossLife = 400;
            this.numMaxBosses = 2;          
            this.deleteEnemiesInterval();
            this.createEnemies();
            this.createShotEnemies();
            this.createBoss();   
            this.createShotBoss();          
            break;
        default:
    }
}

Game.prototype.createEnemies = function() {
    this.enemyPushInterval = setInterval(function(){
        if(this.enemies.length < this.maxEnemies) { 
            var enemyName = this.enemiesList[Math.floor(Math.random() * this.enemiesList.length)];
            var enemyColor = this.colorList[Math.floor(Math.random() * this.colorList.length)];
            var enemyLife = 0;
            switch(enemyName) {
                case "enemy1":
                    enemyLife = 1;
                    break;
                case "enemy2":
                    enemyLife = 2;
                    break;
                case "enemy3":
                    enemyLife = 3;
                    break;
                case "enemy4":
                    enemyLife = 4;
                    break;
                case "enemy5":
                    enemyLife = 5;
                    break;
                case "enemy6":
                    enemyLife = 6;
                    break;
            }
            this.enemies.push(new Enemy(this, this.canvas, Math.floor(Math.random()*this.canvas.width), Math.floor(Math.random()*-500)-200, "enemy", enemyName, enemyColor, enemyLife, this.enemySpeedX, this.enemySpeedY, this.player1));
            //console.log("NUMERO DE ENEMIGOS: " + this.enemies.length);
        }
    //}.bind(this), (Math.floor(Math.random() * this.enemyInterval) + 0.3) * 1000 );
    }.bind(this), this.enemyInterval * 1000);
}

Game.prototype.createBoss = function() {
    this.bossPushInterval = setInterval(function(){
        if( parseInt(document.getElementById("score-points-p1").innerHTML) > this.bossPoints && this.actualDificult != 0 && this.bosses <= this.numMaxBosses) {
            //this.enemies = [];
                //console.log("BOSS GENERATED dificult = " + this.dificult);
                this.bosses.push(new Boss(this, this.canvas, Math.floor(Math.random()*700), Math.floor(Math.random()*-500)-200, "boss", this.bossList[this.bossIndex], this.colorList[Math.floor(Math.random() * this.colorList.length)], this.bossLife, this.enemySpeedX, this.enemySpeedY, this.player1));
                clearInterval(this.enemyPushInterval);
                clearInterval(this.enemyShootInterval);
            //console.log("NUMERO DE ENEMIGOS: " + this.enemies.length);
        }
    }.bind(this), this.enemyInterval * 1000);
}

Game.prototype.createShotEnemies = function() {
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

Game.prototype.createShotBoss = function() {
    this.bossShotInterval = setInterval(function(){
        console.log("NEXT DIFICULT: " + this.nextDificult);
        this.bosses.forEach(function(boss) {
            if(boss.y > 0) {
                boss.shot();
            }
        }.bind(this));
    }.bind(this), this.enemyInterval * 1000);
}

Game.prototype.deleteEnemiesInterval = function() {
    // this.enemies = [];
    clearInterval(this.enemyPushInterval);
    clearInterval(this.enemyShootInterval);
    clearInterval(this.bossPushInterval );
    clearInterval(this.bossShotInterval);
}

Game.prototype.myRandom = function(min, max) {
    var num = Math.floor(Math.random() * max + 1);
    if(num < min) {
      num = min;
    }
    return num;
}

Game.prototype.setGameOver = function() { 
    this.cleanGame();
    $("#game").hide();
    $("#gameover").css("visibility", "visible");
    $("#gameover").get(0).play();
    $("#gameover").show();

    setTimeout(function() {
        window.location.replace("./index.html");
    }, 10000);
}

Game.prototype.nextLevel = function() {
    if(this.nextDificult < 4) {
        this.nextDificult += 1;
        this.actualBg += 1;
        this.cleanGame();
        // First 22 seconds always are tutorial mode
        this.setDificult(0);
        // After 22 seconds set real dificult
        setTimeout(function(){
            this.setDificult(this.nextDificult);
        }.bind(this), 22000);
    }
    else {
        this.setWinner();
    }
}

Game.prototype.setWinner = function() {
    this.cleanGame();
    this.deleteEnemiesInterval();
    $("#game").hide();
    $("#ending").css("visibility", "visible");
    $("#ending").get(0).play();
    $("#ending").show();
}

Game.prototype.cleanGame = function() {
    this.gameOver = false;
    this.audioTutorial.pause();
    this.audioTutorial.currentTime = 0;
    if(this.audioGame) {
        this.audioGame.pause();
        this.audioGame.currentTime = 0;
    }
    cancelAnimationFrame(this.animationId);
    this.enemies = [];
    this.enemiesBullets = [];
    this.playersBullets = [];
    this.bosses = [];
    this.bossBullets = [];
}