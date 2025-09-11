class PlayerBullet extends Entity {
  constructor(x, y, rotation, damage) {
    super(x, y);
    this.spent = false
    this.damage = damage;

    // Create a small white rectangle graphic for the bullet
    const bulletRect = new Phaser.GameObjects.Rectangle(scene, 0, 0, 4, 4, 0xffffff);
    this.add(bulletRect);
    scene.add.existing(this); // add the container (not the rectangle)
    bulletRect.setOrigin(0.5);
    this.bulletRect = bulletRect;

    // Create a Matter body (circle or rectangle) for the bullet, attached to container
    this.body = scene.matter.add.circle(x, y, 2, {
      isSensor: true,       // No physical push, only collision detection
      isBullet: true,       // Improved collision detection at high speed
      frictionAir: 0,
      ignoreGravity: true
    });

    // Link the Matter body to this container
    scene.matter.alignBody(this.body, this);

    // Set initial velocity based on rotation
    const speed = 10;
    const angle = rotation - Math.PI / 2;
    const velocity = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed
    };
    Phaser.Physics.Matter.Matter.Body.setVelocity(this.body, velocity);
    this.body.label = 'Bullet'
    this.body.gameObject = this

    // Auto-destroy bullet after 2 seconds
    scene.time.addEvent({
      delay: 2000,
      callback: () => this.destroy(),
    });
  }

  destroy() {
    if (this.body) {
      scene.matter.world.remove(this.body);
      this.body = null;
    }
    super.destroy();
  }

  update() {
    super.update()
    this.setPosition(this.body.position.x, this.body.position.y);
    this.setRotation(this.body.angle); 
  }
}