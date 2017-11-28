function Game(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    // background
    this.bg = new Bg(canvas);
    // interval for each enemy
    var enemyInterval = 10;
    var enemiesList = ["enemy1", "enemy2"];
    var colorList = ["white", "black"];
    this.player1 = new Player(canvas, this.canvas.width / 4, this.canvas.height - 100, "player1", colorList[Math.floor(Math.random() * colorList.length)], 100, 10, 10);
    // this.player2 = new Player(canvas, 615, 700, "player1", "white", 100, 10, 10);
    this.bullets = [];
    this.enemies = [];
    setInterval(function(){
        this.enemies.push(new Enemy(canvas, Math.floor(Math.random()*700), Math.floor(Math.random()*-500)-200, enemiesList[Math.floor(Math.random() * enemiesList.length)], colorList[Math.floor(Math.random() * colorList.length)], 100, 2, 2, this.player1));
        console.log(this.enemies.length);
    }.bind(this), (Math.floor(Math.random() * enemyInterval) + 1) * 1000 );
    setInterval(function(){
        this.enemies.forEach(function(enemy){
            enemy.shoot(this);
        }.bind(this));
    }.bind(this), 1000);
    this.keysList = [];
    document.onkeydown = this.onKeyDown.bind(this);
    document.onkeyup = this.onKeyUp.bind(this);
}

Game.prototype.draw = function() {
    this.bg.draw();

    this.enemies.forEach(function(enemy) {
        if(enemy.outOfScreen()) {
            var index = this.enemies.indexOf(enemy);
            if(index > -1) {
                this.enemies.splice(index, 1);
            }
        }
        else {
            var that = this;
            enemy.draw(that);
        }
    })
    this.bullets.forEach(function(bullet) {
        bullet.draw();
    })
    this.player1.draw();
    // this.player2.draw();

    // clear enemies and bullets
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
                var that = this;
                this.player1.shoot(that);
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