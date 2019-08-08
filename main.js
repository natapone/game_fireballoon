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
        hole_size: 2.5
    },
};


var game = new Phaser.Game(config);
// new Phaser.Game(config);

var timedEvent;
var block_max = Math.floor(config.height / config.player.height);

function preload () {
    // this.load.image('bird', 'assets/circle.png');
    this.load.image('balloon', 'assets/Balloon.png');
    this.load.image('firework', 'assets/firework.png');
    this.load.image('holeGuide', 'assets/hole_guide.png');

    this.load.audio('jump', 'assets/jump.wav');
}

function create () {
    balloon = this.physics.add.image(
        this.cameras.main.centerX / 2,
        this.cameras.main.centerY,
        'balloon'
    );

    balloon.setSize(60, config.player.height, true);
    balloon.body.gravity.y = 500;
    balloon.body.collideWorldBounds = true;
    balloon.body.bounce.set(0.5);

    // this.time.events.loop(1500, addFireWork(this), this);

    timedEvent = this.time.addEvent({
        delay: config.gameplay.loop_delay,
        callback: addFireWork,
        callbackScope: this,
        loop: true
    });

    // this.time.events.loop(1, addFireWork(this), this);


    this.input.on('pointerdown', function (pointer) {
        console.log(this.game.loop.frame, 'down B');
        // jump(balloon);
        jump(this);
        // tween(balloon).to({angle: -10}, 100).start();
        // this.add.image(pointer.x, pointer.y, 'balls', Phaser.Math.Between(0, 5));

    }, this);

}

function update() {
    // console.log(game.input.isDown);
    // console.log(game.input.pointer.isDown);
    // console.log(timedEvent.getProgress().toString());

    // Slowly rotate the bird downward, up to a certain point.
    if (balloon.angle > 0) {
        balloon.angle -= 1;
        // console.log(balloon.angle);
    }


}

function addFireWork() {
    // Set hole (0 - 6)
    // hole_id = Math.floor(Math.random() * block_max) + 1;
    holeId = getRndInteger(0, block_max - config.gameplay.hole_size);
    // holeId = 4
    holeFrom = holeId;
    holeTo = holeId + config.gameplay.hole_size;

    //position
    holePlotX = this.cameras.main.displayWidth;
    holePlotY = holeFrom * config.player.height + (holeTo * config.player.height - holeFrom * config.player.height) / 2

    // Debug - plot hole
    // console.log(block_max + " Add Hole "  + holeId + " hold " + holeFrom + "/" + holeTo);
    console.log(
        block_max + " Add Hole "  + holeId +
        " From " + holeFrom * config.player.height +
        "/" + holeTo * config.player.height
    );
    var holeGuide = this.physics.add.image( holePlotX, holePlotY, 'holeGuide');

    holeGuide.setScale(1, config.gameplay.hole_size);

    holeGuide.body.velocity.x = -1 * config.gameplay.scene_speed;
    holeGuide.checkWorldBounds = true;
    holeGuide.outOfBoundsKill = true;


    // graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x0000ff }, fillStyle: { color: 0xff0000 }});
    // rect = new Phaser.Geom.Rectangle(250, 200, 300, 200);
    // holeGuide = graphics.strokeRectShape(rect);
    // holeGuide.body.velocity.x = -1 * config.gameplay.scene_speed;


    // var firework = game.add.sprite(x, y, 'firework');
    // game.add(firework);


    // var firework = this.physics.add.image( x, y, 'firework');
    //
    // // Set size
    // firework.setScale(0.5);
    //
    // firework.body.setCircle(220);
    // firework.body.offset.setTo(30, 30); //offset boundary
    //
    // firework.body.velocity.x = -1 * config.gameplay.scene_speed;
    // firework.checkWorldBounds = true;
    // firework.outOfBoundsKill = true;

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
