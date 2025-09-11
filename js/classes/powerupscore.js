class PowerUpScore extends Entity {
  constructor(x, y) {
    super(x, y);
    scene.add.existing(this);
    scene.powerups.add(this);
    this.type = 1
    const radius = 8;
    const lineWidth = 2;

    // Create graphics for red circle outline
    const graphics = scene.add.graphics();
    graphics.lineStyle(lineWidth, 0x0096FF, 1); // Red outline
    graphics.strokeCircle(radius, radius, radius); // Offset by radius to fit texture bounds
    graphics.fillStyle(0x0096FF, 1);  // Set fill color and alpha
    graphics.fillCircle(radius, radius, radius / 2);

    // Generate texture from graphics
    const texKey = 'powerup-' + Phaser.Math.RND.uuid();
    graphics.generateTexture(texKey, radius * 2 + lineWidth, radius * 2 + lineWidth);
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
  }
}