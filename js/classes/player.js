class Player extends Entity {
  constructor(x = 400, y = 500) {
    super(x, y);
    scene.add.existing(this);
    this.lastFired = 0
    this.weaponCooldown = 500
    this.inputFrozen = false
    this.invincible = false
    this.gunLevel = 0
    this.currentGun = WEAPON_TYPE[this.gunLevel]

    const shipGraphics = scene.add.graphics();
    shipGraphics.lineStyle(3, 0xffff00);

    // Store line points
    this.lineSegments = [
      [ {x: 0, y: -14}, {x: 10, y: 10} ],
      [ {x: 10, y: 10}, {x: 0, y: 7} ],
      [ {x: 0, y: 7}, {x: -10, y: 10} ],
      [ {x: -10, y: 10}, {x: 0, y: -14} ],
    ];

    shipGraphics.beginPath();
    for (let [start, end] of this.lineSegments) {
      shipGraphics.moveTo(start.x, start.y);
      shipGraphics.lineTo(end.x, end.y);
    }
    shipGraphics.strokePath();

    const thrustGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
    thrustGraphics.fillStyle(0xffff00, 1);  // white color, full alpha
    thrustGraphics.fillRect(0, 0, 4, 4);    // 4x4 pixel square
    thrustGraphics.generateTexture('squareParticle', 4, 4);
    thrustGraphics.destroy();  // clean up graphics
    this.thrustParticles = scene.add.particles('squareParticle');

    this.emitter = this.thrustParticles.createEmitter({
      x: x,
      y: y,
      speed: {
        min: 1 * 0.3 * 40,
        max: 1 * 1.2 * 40
      },
      lifespan: { min: 600, max: 900 },
      quantity: 2,
      scale: { start: 0.6, end: 0 },
      alpha: { start: 1, end: 0 },
      blendMode: 'ADD',
      tint: [0xffff00]
    });

    // Smaller render texture size
    const size = 28;
    const rt = scene.add.renderTexture(0, 0, size, size);
    rt.setOrigin(0.5);
    rt.setPosition(0, 0);

    // Draw with offset to center the shape
    rt.draw(shipGraphics, size / 2, size / 2);
    shipGraphics.destroy();

    this.add(rt);
    this.shipSprite = rt;

    // New polygon points for physics body (match graphics)
    const points = [
      { x: 0, y: -14 },
      { x: 10, y: 10 },
      { x: 0, y: 7 },
      { x: -10, y: 10 }
    ];

    // Matter.js body from polygon
    const { Bodies } = Phaser.Physics.Matter.Matter;
    const body = Bodies.fromVertices(x, y, [points], {
      frictionAir: 0.01,
      restitution: 0.8
    }, true);

    this.body = body;
    body.label = "Player";
    body.parts.forEach(part => part.label = "Player");
    body.parts.forEach(part => part.gameObject = this);
    body.gameObject = this;
    scene.matter.world.add(body);

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.wasd = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
    this.keys = scene.input.keyboard.addKeys({
      space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });
  }

  update(time) {
    super.update()
    const accel = 0.000075;
    const rotationSpeed = 0.04;
    const body = this.body;
    const MatterBody = this.scene.matter.body;

    if (this.inputFrozen) {return}

    scene.timeBonus -= Math.floor(time / 10000)
    if (scene.timeBonus < 0) { scene.timeBonus = 0 }

    // Rotate
    if (this.wasd.left.isDown || this.cursors.left.isDown) {
      MatterBody.setAngularVelocity(body, -rotationSpeed);
    } else if (this.wasd.right.isDown || this.cursors.right.isDown) {
      MatterBody.setAngularVelocity(body, rotationSpeed);
    } else {
      MatterBody.setAngularVelocity(body, 0);
    }

    // Thrust
    if (this.wasd.up.isDown || this.cursors.up.isDown) {
      const angle = body.angle - Math.PI / 2;
      const force = {
        x: Math.cos(angle) * accel,
        y: Math.sin(angle) * accel
      };
      MatterBody.applyForce(body, body.position, force);

      const offsetDistance = 8;  // Distance behind the ship
      const backX = body.position.x - Math.cos(angle) * offsetDistance;
      const backY = body.position.y - Math.sin(angle) * offsetDistance;
      this.emitter.setPosition(backX, backY);
      this.emitter.setQuantity(2);
      this.emitter.setAngle({
        min: Phaser.Math.RadToDeg(angle + Math.PI) - 100,
        max: Phaser.Math.RadToDeg(angle + Math.PI) + 100
      });
      this.emitter.on = true;

    } else if (this.wasd.down.isDown || this.cursors.down.isDown) {
      const angle = body.angle - Math.PI / 2;
      const force = {
        x: -(Math.cos(angle) * accel / 4),
        y: -(Math.sin(angle) * accel / 4)
      };
      MatterBody.applyForce(body, body.position, force);
      this.emitter.on = false
    } else {
      this.emitter.on = false
    }


    const maxSpeed = 6;
    let velocity = this.body.velocity;
    const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
    if (speed > maxSpeed) {
      const scale = maxSpeed / speed;
      Phaser.Physics.Matter.Matter.Body.setVelocity(this.body, {
        x: velocity.x * scale,
        y: velocity.y * scale,
      });
    }

    this.setPosition(body.position.x, body.position.y);
    this.setRotation(body.angle);
    if (this.keys.space.isDown && time > this.lastFired + this.currentGun.cooldown) {
      this.fire();
      this.lastFired = time;
    }
  }
  
  fire(gunOverride) {
    if (!gunOverride) {
      gunOverride = this.currentGun.guns
    }
    gunOverride.forEach(gun => {
      const cos = Math.cos(this.rotation);
      const sin = Math.sin(this.rotation);

      const rotatedOffsetX = gun.offset.x * cos - gun.offset.y * sin;
      const rotatedOffsetY = gun.offset.x * sin + gun.offset.y * cos;

      const bulletX = this.body.position.x + rotatedOffsetX;
      const bulletY = this.body.position.y + rotatedOffsetY;

      const bullet = new PlayerBullet(
        bulletX,
        bulletY,
        this.rotation + gun.angle,
        gun.damage
      );
      
      scene.bullets.add(bullet);
    });
  }

  takeDamage(damage) {
    if (this.invincible) { return false }
    if (stats.lives === 0) { return false }

    stats.shield -= Math.ceil(damage)
    if (stats.shield <= 0) {
      stats.shield = 0
      this.breakApart()
    }
    scene.ui.updateShield()
  }

  restore(shields) {
    stats.shield += Math.ceil(shields)
    if (stats.shield >= 200) {
      stats.shield = 200
    }
    scene.ui.updateShield()
  }

  levelUp() {
    if (stats.shield < 100) {
      stats.shield += 50
      if (stats.shield >= 100) {
        stats.shield = 100
      }
    }
    scene.ui.updateShield()
  }

  breakApart() {
    const originX = this.x;
    const originY = this.y;

    for (let [start, end] of this.lineSegments) {
      const line = scene.add.graphics();
      line.lineStyle(3, 0xffff00);
      line.beginPath();
      line.moveTo(0, 0);
      line.lineTo(end.x - start.x, end.y - start.y);
      line.strokePath();
      line.setPosition(originX + start.x, originY + start.y);

      // Animate it flying away
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const distance = Phaser.Math.Between(60, 120);
      const targetX = line.x + Math.cos(angle) * distance;
      const targetY = line.y + Math.sin(angle) * distance;

      scene.tweens.add({
        targets: line,
        x: targetX,
        y: targetY,
        alpha: 0,
        angle: Phaser.Math.Between(-180, 180),
        duration: 3000,
        ease: 'Cubic.easeOut',
        onComplete: () => line.destroy()
      });
    }

    // this.shipSprite.hide();
    stats.lives--;
    scene.ui.updateLives()
    if (stats.lives > 0) {
      this.respawn()
    } else {
      scene.isGameOver = true;
      this.inputFrozen = true;
      new GameOverUI();
      this.visible = false;
      this.emitter.on = false;
      this.body.collisionFilter.group = -1;
      this.body.collisionFilter.mask = 0;  // Collides with nothing
    }
  }

  respawn(levelUp = false) {
    this.inputFrozen = true;
    this.invincible = true;

    // Reset Matter body position and velocity
    Phaser.Physics.Matter.Matter.Body.setPosition(this.body, {
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT / 2
    });
    Phaser.Physics.Matter.Matter.Body.setVelocity(this.body, { x: 0, y: 0 });
    Phaser.Physics.Matter.Matter.Body.setAngle(this.body, 0);
    Phaser.Physics.Matter.Matter.Body.setAngularVelocity(this.body, 0);
    Object.values(this.keys).forEach(key => key.reset());

    // Reset display object transform
    this.setPosition(GAME_WIDTH / 2, GAME_HEIGHT / 2);
    this.setRotation(0);

    // Reset shield and update UI
    if (!levelUp) {
      stats.shield = 100;
      scene.ui.updateShield();
    }

    // Optional: add a short freeze / invincibility window
    scene.time.delayedCall(500, () => {
      this.inputFrozen = false;
    });

    const flashDuration = 2500;
    const flashInterval = 200;

    let elapsed = 0;
    const flashTimer = scene.time.addEvent({
      delay: flashInterval,
      callback: () => {
        this.setAlpha(this.alpha === 1 ? 0.3 : 1);
        elapsed += flashInterval;
        if (elapsed >= flashDuration) {
          this.setAlpha(1); // restore
          flashTimer.remove(false);
        }
      },
      callbackScope: this,
      loop: true
    });
    scene.time.delayedCall(flashDuration, () => {
      this.invincible = false;
    });
  }

  increaseGunLevel() {
    if (WEAPON_TYPE[this.gunLevel + 1]) {
      this.gunLevel++
      this.currentGun = WEAPON_TYPE[this.gunLevel]
    }
  }

nova() {
  let elapsed = 0;
  let gun = Array.from({ length: 12 }, (_, i) => ({
    offset: { x: 0, y: 0 },
    angle: Phaser.Math.DegToRad(i * 30),
    damage: 15
  }))
  const novaTimer = scene.time.addEvent({
    delay: 150,
    callback: () => {
      this.fire(gun)
      elapsed += 150;
      if (elapsed >= 600) {
        novaTimer.remove(false);
      }
    },
    callbackScope: this,
    loop: true
  });
}
}
