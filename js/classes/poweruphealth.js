class PowerUpHealth extends Entity {
  constructor(x, y) {
    super(x, y);
    scene.add.existing(this);
    scene.powerups.add(this);
    this.type = 0
    const radius = 8;
    const lineWidth = 2;
    const crossLength = radius;

    // Use `graphics`, not `gfx`, for consistency
    const graphics = scene.add.graphics();
    graphics.lineStyle(lineWidth, 0xff0000, 1);

    // Draw outer circle
    graphics.strokeCircle(radius, radius, radius); // Shifted by radius for texture generation

    // Draw vertical line of the cross
    graphics.beginPath();
    graphics.moveTo(radius, radius - crossLength / 2);
    graphics.lineTo(radius, radius + crossLength / 2);
    graphics.strokePath();

    // Draw horizontal line of the cross
    graphics.beginPath();
    graphics.moveTo(radius - crossLength / 2, radius);
    graphics.lineTo(radius + crossLength / 2, radius);
    graphics.strokePath();

    // Generate texture and clean up
    const texKey = 'powerup-' + Phaser.Math.RND.uuid();
    graphics.generateTexture(texKey, radius * 2 + lineWidth, radius * 2 + lineWidth);
    graphics.destroy();

    // Add image to container
    const image = scene.add.image(0, 0, texKey);
    image.setOrigin(0.5);
    this.add(image);

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