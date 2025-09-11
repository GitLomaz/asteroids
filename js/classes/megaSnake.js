class MegaSnake extends Enemy {
  constructor(x, y) {
    super(x, y);
    scene.add.existing(this);
    this.bodyParts = [];
    this.spawnCooldown = 20;
    this.health = 500;
    this.healthMax = 2000;
    this.score = 400;
    this.scale = 1.2;
    
    this.pallet = [0xFF8C00, 0xFFA500, 0xFF7F00];

    // Create graphics for Pac-Man
    const graphics = scene.add.graphics();
    graphics.lineStyle(2, 0xFF8C00);
    graphics.fillStyle(0xFF8C00, .1);
    graphics.beginPath();
    graphics.arc(0, 0, 10 * this.scale, 0.3, 5.9, false);
    graphics.lineTo(0, 0);
    graphics.closePath();
    graphics.fillPath();
    graphics.strokePath();

    const rt = scene.add.renderTexture(0, 0, 28* this.scale, 28* this.scale);
    rt.setOrigin(0.5);
    rt.setPosition(0, 0);

    rt.draw(graphics, 14* this.scale, 14* this.scale);
    graphics.destroy();

    this.add(rt);
    this.sprite = rt;

    this.body = scene.matter.add.circle(
      x,
      y,
      10 * this.scale, // radius
      {
        frictionAir: 0,
        restitution: 0.8
      }
    );
    this.body.label = "Enemy";
    this.body.gameObject = this;
    this.body.collisionFilter.group = -1;

  }

  update() {
    this.setPosition(this.body.position.x, this.body.position.y);
    this.setRotation(this.body.angle);
    this.spawnCooldown--;
    this.health = this.health + .1;
    if (this.health > this.healthMax) {
      this.health = this.healthMax;
    }
    // every 100ms, spawn a body part
    if (this.spawnCooldown === 0) {
      this.spawnCooldown = 20; // reset cooldown
      this.spawnBodyPart();
      const maxParts = Math.floor(this.health / 100) + 5;

      // Remove all parts beyond the limit
      while (this.bodyParts.length > maxParts) {
        const oldestPart = this.bodyParts.shift();
        const partContainer = oldestPart.sprite;

        // Animate shrink
        scene.tweens.add({
          targets: partContainer,
          scaleX: 0,
          scaleY: 0,
          duration: 200,
          onComplete: () => {
            scene.matter.world.remove(oldestPart);
            partContainer.destroy();
          }
        });
      }
    }

    const player = scene.player;
    if (player) {
      // Compute shortest dx considering world wrap
      let dx = player.x - this.x;
      let dy = player.y - this.y;

      // Wrap-around correction for x
      if (dx > GAME_WIDTH / 2) dx -= GAME_WIDTH;
      if (dx < -GAME_WIDTH / 2) dx += GAME_WIDTH;

      // Wrap-around correction for y
      if (dy > GAME_HEIGHT / 2) dy -= GAME_HEIGHT;
      if (dy < -GAME_HEIGHT / 2) dy += GAME_HEIGHT;

      let angle = Math.atan2(dy, dx);

      // Add some wiggle
      angle += this.wiggle(2) * 0.5;
      this.rotation = angle;

      // Distance (shortest considering wrap)
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Speed: increases as enemy gets closer than 400
      let speed = 0.5;
      if (dist < 400) {
        speed = 0.5 + (400 - dist) / 400 * 1.0; // 0.5 → 1.5
      }

      // Apply velocity
      Phaser.Physics.Matter.Matter.Body.setVelocity(this.body, {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed
      });
    }

    /*

    const angle = Phaser.Math.Angle.Between(
      this.x, this.y,
      scene.player.x, scene.player.y
    );




    const speed = 20; // adjust to taste
    const velX = Math.cos(this.rotation) * speed;
    const velY = Math.sin(this.rotation) * speed;
    this.body.velocity.x = velX;
    this.body.velocity.y = velY;


    this.x = this.body.position.x;
    this.y = this.body.position.y;
    */
    super.update();
  }

  takeDamage(damage) {
    this.health -= damage;
    if (this.health <= 0) {
      this.die(10);
    }
  }

  die() {
    super.die(10);
    this.spawnPowerUp();
    this.spawnPowerUp();
    // Remove all body parts
    this.bodyParts.forEach(part => {
      scene.matter.world.remove(part);
      const partContainer = part.sprite;
      scene.tweens.add({
        targets: partContainer,
        scaleX: 0,
        scaleY: 0,
        duration: 200,
        onComplete: () => {
          partContainer.destroy();
        }
      });
    });
    this.bodyParts = []; // Clear the array after removing all parts
  }

  wiggle(speed = 5) {
    return Math.sin(Date.now() / 1000 * speed);
  }

  spawnBodyPart() {
    const part = scene.matter.add.circle(
      this.x,
      this.y,
      4 * this.scale,
      {
        isStatic: true,       // Cannot be pushed or moved by collisions
        frictionAir: 0,
        restitution: 0.8
      }
    );

    part.collisionFilter.group = -1;
    part.pallet =  [0xFF8C00, 0xFFA500, 0xFF7F00];
    part.label = "Enemy";
    part.gameObject = this;

    // Store reference
    this.bodyParts.push(part);

    // Create visual circle
    const gfx = scene.add.graphics();
    gfx.lineStyle(2, 0xFF8C00);
    gfx.fillStyle(0xFF8C00, .1);
    gfx.strokeCircle(0, 0, 4 * this.scale);
    gfx.fillCircle(0, 0, 4 * this.scale );

    // Add graphic to container so it follows automatically
    const partContainer = scene.add.container(this.x, this.y, [gfx]);
    partContainer.setScale(0);
    scene.tweens.add({
      targets: partContainer,
      scaleX: 1,
      scaleY: 1,
      duration: 200,
    });
    part.sprite = partContainer
    scene.add.existing(partContainer);
    return part;
  }
}