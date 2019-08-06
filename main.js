// Set size in debug mode https://labs.phaser.io/edit.html?src=src%5Cphysics%5Carcade%5Csmaller%20bounding%20box.js
// Circle body https://phaser.io/examples/v2/arcade-physics/circle-body

var config = {
    type: Phaser.AUTO,
    antialias: false,
    width: 1280,
    height: 720,
    backgroundColor: '#3498db',
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {debug: true}
    },
    scene: {
        preload: preload,
        create: create
    }
};

new Phaser.Game(config);

function preload () {
    // this.load.image('bird', 'assets/circle.png');
    this.load.image('balloon', 'assets/Balloon.png');
    this.load.image('pipe', 'assets/pipe.png');

    this.load.audio('jump', 'assets/jump.wav');
}

function create () {
    var balloon = this.physics.add.image(
        this.cameras.main.centerX / 2,
        this.cameras.main.centerY,
        'balloon'
    );

    balloon.setSize(60, 100, true);
    balloon.body.gravity.y = 100;
    balloon.body.collideWorldBounds = true;
    balloon.body.bounce.set(1);
    balloon.body.velocity.set(150);

    // this.input.onTap.add(onTap, this);
    // this.input.onDown.add(this.jump, this);


    // Circle body
    // bird.body.setCircle(35,true);
    // bird.body.collideWorldBounds = true;
    // bird.body.bounce.set(1);
    // bird.body.gravity.y = 100;
    // bird.body.velocity.set(150);


}

function jump(pointer, doubleTap) {
    balloon.body.velocity.y = -350;
}
