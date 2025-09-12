class Mine extends Enemy {
  constructor(x, y) {
    super(x, y);
    scene.add.existing(this);

    this.frame = 0;
    this.counter = 0;
    this.pallet = [0xFF0000, 0xcc0000, 0x990000];
    this.health = 20 * (1 + scene.level / 10);
    this.score = 200

    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const speed = Phaser.Math.FloatBetween(0.1, 1);

    this.prevState = {
      position: { x, y },
      angle,
      velocity: {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed
      },
      angularVelocity: Phaser.Math.FloatBetween(-0.003, 0.003)
    };

    this.generateStarShape();

    this.graphics = scene.make.graphics({ x: 0, y: 0, add: false });
    this.graphics.lineStyle(2, 0xFF0000, 1);
    this.graphics.fillStyle(0x003366, 0.7);

    this.generateBody();

    this.core = scene.add.circle(0, 0, 2, 0xff0000)
      .setOrigin(0.5)
      .setAlpha(1);

    this.add(this.core); // attach to mine so it moves/rotates with it

    scene.tweens.add({
      targets: this.core,
      alpha: { from: 1, to: 0 },
      duration: 400,
      yoyo: true,
      repeat: -1
    });


    // Create dashed circle graphic
    this.dashedCircle = scene.add.graphics({ x: 0, y: 0 });
    this.dashedCircle.alpha = .5
    this.dashedCircle.lineStyle(1, 0xff0000, 1);

    const radius = 60;
    const dashLength = Phaser.Math.DegToRad(10); // arc length of dash
    const gapLength = Phaser.Math.DegToRad(6);   // arc length of gap

    for (let angle = 0; angle < Phaser.Math.PI2; angle += dashLength + gapLength) {
      this.dashedCircle.beginPath();
      this.dashedCircle.arc(0, 0, radius, angle, angle + dashLength, false);
      this.dashedCircle.strokePath();
    }

    // Attach to mine so it rotates/moves with it
    this.add(this.dashedCircle);

    // Optional: make dashed circle spin
    scene.tweens.add({
      targets: this.dashedCircle,
      duration: 3000,
      alpha: 0.2,
      repeat: -1,
      yoyo: true,
    });


    this.setPosition(x, y);

  }

  generateStarShape() {
    const outerRadius = 10; // distance to the tips
    const innerRadius = 5; // distance to the valleys
    const numPoints = 8;    // number of star points

    const mainPoints = [];
    const step = Math.PI / numPoints; // half-angle steps

    for (let i = 0; i < numPoints * 2; i++) {
      const radius = (i % 2 === 0) ? outerRadius : innerRadius;
      const angle = i * step;
      mainPoints.push([
        Math.floor(Math.cos(angle) * radius),
        Math.floor(Math.sin(angle) * radius)
      ]);
    }

    this.points = mainPoints;
  }

  generateBody() {
    this.verticies = this.points.map(([x, y]) => ({ x, y }));

    if (this.body) {
      this.prevState = {
        position: { ...this.body.position },
        angle: this.body.angle,
        velocity: { ...this.body.velocity },
        angularVelocity: this.body.angularVelocity
      };
      scene.matter.world.remove(this.body);
      this.body = null;
    }

    const body = scene.matter.add.fromVertices(
      this.prevState.position.x,
      this.prevState.position.y,
      this.verticies,
      {
        frictionAir: 0,
        restitution: 0.8
      },
      true,
      false
    );

    this.body = body;
    this.body.collisionFilter.group = -1;
    Phaser.Physics.Matter.Matter.Body.setAngle(body, this.prevState.angle);
    Phaser.Physics.Matter.Matter.Body.setVelocity(body, this.prevState.velocity);
    Phaser.Physics.Matter.Matter.Body.setAngularVelocity(body, this.prevState.angularVelocity);
    body.label = "Enemy";
    body.parts.forEach(part => {
      part.label = "Enemy";
      part.gameObject = this;
    });
    body.gameObject = this;

    // Draw shape
    this.graphics.clear();
    const phaserPoints = this.points.map(p => new Phaser.Math.Vector2(p[0], p[1]));
    const polygon = new Phaser.Geom.Polygon(phaserPoints);
    const bounds = Phaser.Geom.Polygon.GetAABB(polygon);

    this.textureSize = Math.ceil(Math.max(bounds.width, bounds.height)) + 64;
    const offsetX = -bounds.x + 32;
    const offsetY = -bounds.y + 32;

    this.graphics.lineStyle(2, 0xff0000, 1);
    this.graphics.fillStyle(0xff0000, 0.1);
    this.graphics.beginPath();
    this.graphics.moveTo(phaserPoints[0].x + offsetX, phaserPoints[0].y + offsetY);
    for (let i = 1; i < phaserPoints.length; i++) {
      this.graphics.lineTo(phaserPoints[i].x + offsetX, phaserPoints[i].y + offsetY);
    }
    this.graphics.closePath();
    this.graphics.fillPath();
    this.graphics.strokePath();

    // Generate a new unique texture key and texture from graphics
    const newTexKey = 'monster-' + Phaser.Math.RND.uuid();
    this.graphics.generateTexture(newTexKey, this.textureSize, this.textureSize);

    if (!this.image) {
      this.image = scene.add.image(0, 0, newTexKey);
      this.image.setOrigin(0.5);
      this.add(this.image);
    } else {
      this.image.setTexture(newTexKey);
    }

    if (this.texKey && this.texKey !== newTexKey) {
      scene.textures.remove(this.texKey);
    }
    this.texKey = newTexKey;
  }

    update() {
    super.update();
  
    this.setPosition(this.body.position.x, this.body.position.y);
    this.setRotation(this.body.angle);

    const player = scene.player;
    if (player) {
      // get distance to player
      const dx = player.body.position.x - this.body.position.x;
      const dy = player.body.position.y - this.body.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 60) {
        this.explode();
      }
    }

    // this.counter++;
    // if (this.counter >= 12) {
    //   this.counter = 0;
    //   this.frame = (this.frame + 1) % this.frameArray.length;
    //   this.generateBody(this.frameArray[this.frame]);
    // }
  }

  takeDamage(damage) {
    this.health -= damage
    if (this.health <= 0) {
      this.die(20);
    }
  }

  explode() {
    scene.emitDebris(this.body.position.x, this.body.position.y, {
      velocity: this.body.velocity,
      speed: { min: 5, max: 18 },
      angleBias: 180,
      lifespan: { min: 600, max: 900 },
      quantity: 42,
      tint: [0xffffff, 0xdddddd, 0x888888],
      scale: { start: 0.6, end: 0 },
      alpha: { start: 1, end: 0 },
      blendMode: 'ADD'
    });

    const circle = scene.add.circle(
      this.body.position.x,
      this.body.position.y,
      4,            // starting radius
      0xff0000,     // color
      0.4           // alpha
    ).setBlendMode(Phaser.BlendModes.ADD);

    // Tween it to grow & fade
    scene.tweens.add({
      targets: circle,
      radius: 100,  // how big it gets
      alpha: 0,    // fade out
      duration: 400,
      ease: 'Cubic.Out',
      onComplete: () => {
        circle.destroy();
      }
    });

    // Push enemies away
    const blastRadius = 150;  // how far the push reaches
    const blastForce = Random.between(5, 25);  // multiplier for push strength

    [scene.player, ...scene.enemies.getChildren()].forEach(obj => {
      if (obj === this) return; // skip self

      const dx = obj.body.position.x - this.body.position.x;
      const dy = obj.body.position.y - this.body.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < blastRadius && dist > 0) {
        const pushStrength = (1 - dist / blastRadius) * blastForce;
        const vx = (dx / dist) * pushStrength;
        const vy = (dy / dist) * pushStrength;


        
        obj.takeDamage(obj === scene.player ? pushStrength * 5 : pushStrength * 13);
        
        if (obj.body) {
          Phaser.Physics.Matter.Matter.Body.setVelocity(obj.body, {
            x: obj.body.velocity.x + vx,
            y: obj.body.velocity.y + vy
          });
        }
      }
    });
    this.die(20);
  }
}
