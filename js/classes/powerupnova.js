class PowerUpNova extends Entity {
  constructor(x, y) {
    super(x, y);
    scene.add.existing(this);
    scene.powerups.add(this);
    this.type = 3;

    const radius = 8;
    const lineWidth = 2;

    const graphics = scene.add.graphics();
    graphics.lineStyle(lineWidth, 0x9900ff, 1); // Purple outline
    graphics.strokeCircle(radius, radius, radius); // Outer circle only, no fill

    // Draw multiple small white dots inside the circle
    const dotCount = 12;
    const dotRadius = 1.5;
    for (let i = 0; i < dotCount; i++) {
      const angle = Phaser.Math.DegToRad((360 / dotCount) * i);
      const dotX = radius + Math.cos(angle) * (radius - 10); // subtract margin
      const dotY = radius + Math.sin(angle) * (radius - 10);
      graphics.fillStyle(0x9900ff, 1); // White
      graphics.fillCircle(dotX, dotY, dotRadius);
    }

    // Generate texture from graphics
    const texKey = 'powerup-' + Phaser.Math.RND.uuid();
    graphics.generateTexture(texKey, radius * 2 + lineWidth * 2, radius * 2 + lineWidth * 2);
    graphics.destroy();

    // Add image to container
    const image = scene.add.image(0, 0, texKey);
    image.setOrigin(0.5);
    this.add(image);

    // Add physics body (circular sensor)
    scene.matter.add.gameObject(this, {
      shape: { type: 'circle', radius },
      isSensor: true,
      label: 'Powerup',
      frictionAir: 0,
      restitution: 0.8
    });

    Phaser.Physics.Matter.Matter.Body.setVelocity(this.body, {
      x: Phaser.Math.FloatBetween(-0.1, 0.1),
      y: Phaser.Math.FloatBetween(-0.1, 0.1)
    });

    this.setPosition(x, y);

    scene.time.delayedCall(30000, () => {
      if (this && this.body) {
        scene.tweens.add({
          targets: this,
          alpha: 0,
          duration: 1000,
          onComplete: () => {
            this.destroy();
          }
        });
      }
    });
  }
}