// Set size in debug mode https://labs.phaser.io/edit.html?src=src%5Cphysics%5Carcade%5Csmaller%20bounding%20box.js
// Circle body https://phaser.io/examples/v2/arcade-physics/circle-body

var config = {
    type: Phaser.AUTO,
    antialias: false,
    width: 1280,
    height: 720,
    backgroundColor: '#02071E',
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {debug: true}
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
    player: {
        height: 100,
    },
    gameplay:{
        scene_speed: 200,
        loop_delay: 3000,
        hole_size: 3,
        debug: false,
        firework: {
            actual_size: 500,
            size_max: 5,
            size_min: 2,
            border_offset: 5,
        },
        coin : {
            height: 70,
        },
    },
};


var game = new Phaser.Game(config);
// new Phaser.Game(config);

var timedEvent;
var currentScore = 0;
var block_max = Math.floor(config.height / config.player.height);

function preload () {
    // this.load.image('bird', 'assets/circle.png');
    this.load.image('balloon', 'assets/Balloon.png');
    this.load.image('firework', 'assets/firework.png');
    this.load.image('holeGuide', 'assets/hole_guide.png');
    this.load.image('coin', 'assets/coin.png');

    this.load.audio('jump', 'assets/jump.wav');
}

function create () {
    // this.score = 0;
    let style = { font: '50px Arial', fill: '#fff' };
    this.scoreText = this.add.text(30, 30, 'score: ' + currentScore, style);

    this.coins = this.add.group();
    this.fireworks = this.add.group();

    balloon = this.physics.add.image(
        this.cameras.main.centerX / 2,
        this.cameras.main.centerY,
        'balloon'
    );

    balloon.setSize(60, config.player.height, true);
    balloon.body.gravity.y = 500;
    // balloon.body.collideWorldBounds = true;
    // balloon.body.bounce.set(0.5);

    // this.time.events.loop(1500, addFireWork(this), this);

    timedEvent = this.time.addEvent({
        delay: config.gameplay.loop_delay,
        callback: addNextChellenge,
        callbackScope: this,
        loop: true
    });

    // this.time.events.loop(1, addFireWork(this), this);


    this.input.on('pointerdown', function (pointer) {
        // console.log(this.game.loop.frame, 'down B');

        jump(this);

    }, this);

    overlapCollider = this.physics.add.overlap(balloon, this.coins, hitCoin );
}

function update() {
    // Check border
    if (balloon.y < 0 || balloon.y > this.cameras.main.displayHeight) {
        restartGame(this);
        // console.log("--- RESTART ---");
    }

    // Slowly rotate the bird downward, up to a certain point.
    if (balloon.angle > 0) {
        balloon.angle -= 1;
        // console.log(balloon.angle);
    }

    // Display score
    this.scoreText.setText('score: ' + currentScore);
}

function restartGame(game) {
    currentScore = 0;

    // balloon.x = game.cameras.main.centerX / 2;
    // balloon.y = game.cameras.main.centerY;
    game.scene.restart();
}

function hitCoin(balloon, coin) {


    // Update score
    currentScore++;
    console.log("+++ COIN!! +++ " + currentScore);
    // game.scoreText.setText('score: ' + this.score);

    //  Hide the sprite
    // healthGroup.killAndHide(health);
    coin.destroy();

}

// Firework or Coin
function addNextChellenge() {
    addFireWork(this);
}

function addCoin(holdId, game) {
    //Add in empty space before next firework

    spaceWidth = config.gameplay.scene_speed * config.gameplay.loop_delay / 1000;
    spaceHeight = (config.gameplay.hole_size -1) * config.player.height;

    // randX = getRndInteger(-1 * spaceWidth /2, spaceWidth /2); // left and right
    randX = getRndInteger(0, spaceWidth * 0.7); // not to close to next one
    randY = getRndInteger(0, spaceHeight);

    x = game.cameras.main.displayWidth + randX;
    y = holdId * config.player.height + (config.gameplay.coin.height/2) + randY;

    coin = game.physics.add.image( x, y, 'coin');

    coin.body.velocity.x = -1 * config.gameplay.scene_speed;
    coin.checkWorldBounds = true;
    coin.outOfBoundsKill = true;

    game.coins.add(coin);
    console.log("Add coin " + x + " / " + y);

}

function addFireWork(game) {
    // Set hole (0 - 6)
    holeId = getRndInteger(0, block_max - config.gameplay.hole_size);
    // holeId = 0;
    holeFrom = holeId;
    holeTo = holeId + config.gameplay.hole_size;


    //position
    holePlotX = game.cameras.main.displayWidth;
    holePlotY = holeFrom * config.player.height + (holeTo * config.player.height - holeFrom * config.player.height) / 2

    // Debug - plot hole
    if (config.gameplay.debug) {
        // console.log(block_max + " Add Hole "  + holeId + " hold " + holeFrom + "/" + holeTo);
        console.log(
            "Max:" + block_max + " Add Hole "  + holeId +
            " From " + holeFrom * config.player.height +
            "/" + holeTo * config.player.height
        );
        var holeGuide = game.physics.add.image( holePlotX, holePlotY, 'holeGuide');

        holeGuide.setScale(1, config.gameplay.hole_size);

        holeGuide.body.velocity.x = -1 * config.gameplay.scene_speed;
        holeGuide.checkWorldBounds = true;
        holeGuide.outOfBoundsKill = true;
    }

    // graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x0000ff }, fillStyle: { color: 0xff0000 }});
    // rect = new Phaser.Geom.Rectangle(250, 200, 300, 200);
    // holeGuide = graphics.strokeRectShape(rect);
    // holeGuide.body.velocity.x = -1 * config.gameplay.scene_speed;


    // Fill upper area
    if (holeFrom > 0) {
        addFireworkUpper(holeFrom, game);
    }

    // Fill lower area
    if (holeTo < block_max) {
        addFireworkLower(holeTo, game);
    }

    // Add coin
    addCoin(holeId, game);
}

function addFireworkLower(holeTo, game) {
    var fillCount = holeTo;

    while (fillCount < block_max) {
        var fillBlockSize = getRndInteger(config.gameplay.firework.size_min, config.gameplay.firework.size_max);

        // Cal position
        fillSize = fillBlockSize * config.player.height;
        fillScale = fillSize / config.gameplay.firework.actual_size;
        fillPosY = (fillCount * config.player.height) + (fillSize / 2);

        // Plot
        var x = holePlotX; // will be random
        var y = fillPosY;
        var firework = game.physics.add.image( x, y, 'firework');

        // Set size
        firework.setScale(fillScale);

        borderSize = config.gameplay.firework.actual_size * config.gameplay.firework.border_offset / 100;
        firework.body.setCircle(config.gameplay.firework.actual_size / 2 - borderSize);
        firework.body.offset.setTo(borderSize, borderSize);

        firework.body.velocity.x = -1 * config.gameplay.scene_speed;
        firework.checkWorldBounds = true;
        firework.outOfBoundsKill = true;

        fillCount += fillBlockSize;
        console.log("Lower firework at " +fillCount+" size=" + fillBlockSize + "/" + (block_max-holeTo));
    }
}

function addFireworkUpper(holeFrom, game) {
    var fillCount = holeFrom;

    while (fillCount > 0) {
        var fillBlockSize = getRndInteger(config.gameplay.firework.size_min, config.gameplay.firework.size_max);

        // Cal position
        fillSize = fillBlockSize * config.player.height;
        fillScale = fillSize / config.gameplay.firework.actual_size;
        fillPosY = (fillCount * config.player.height) - (fillSize / 2);

        // Plot
        var x = holePlotX; // will be random
        var y = fillPosY;
        var firework = game.physics.add.image( x, y, 'firework');

        // Set size
        firework.setScale(fillScale);

        borderSize = config.gameplay.firework.actual_size * config.gameplay.firework.border_offset / 100;
        firework.body.setCircle(config.gameplay.firework.actual_size / 2 - borderSize);
        firework.body.offset.setTo(borderSize, borderSize);

        firework.body.velocity.x = -1 * config.gameplay.scene_speed;
        firework.checkWorldBounds = true;
        firework.outOfBoundsKill = true;

        fillCount -= fillBlockSize;
        console.log("Upper firework at " +fillCount+" size=" + fillBlockSize + "/" + holeFrom);
    }
}

function jump(game) {

    balloon.body.velocity.y = -300;

    // Jump animation
    game.tweens.add({
        targets: balloon,
        // x: 700,
        angle: 20,
        duration: 100,
        ease: 'Power2',
        // yoyo: true,
        // delay: 100
    });

    // console.log(balloon.angle);
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}
