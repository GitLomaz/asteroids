class Asteroid extends Enemy {
  constructor(x, y, size = 2) {
    // Scaling rules
    const BASE_RADIUS = 10;
    const BASE_HEALTH = 20;
    const BASE_SCORE = 200;

    // Growth curves
    const radius = BASE_RADIUS * (1 + size);          // grows linearly with size
    const health = BASE_HEALTH * Math.pow(size + 1, 1.2); // grows a bit faster than linear
    const score = Math.max(25, Math.floor(BASE_SCORE / (size + 1))); // smaller = higher score, clamp at 25

    super(x, y);
    scene.add.existing(this);

    this.radius = radius;
    this.health = health;
    this.score = score;
    this.size = size;
    this.pallet = [0xffffff, 0xcccccc, 0x999999];

    this.points = this.generateJaggedPolygon(radius, 10, 0.3);
    this.graphics = new Phaser.GameObjects.Graphics(scene);
    this.add(this.graphics);
    this.setPosition(x, y);
    this.drawOutline();

    // Matter.js body
    const body = scene.matter.add.fromVertices(
      x,
      y,
      this.points,
      { frictionAir: 0, restitution: 0.8 },
      true
    );

    this.body = body;
    this.body.collisionFilter.group = -1;
    body.label = "Enemy";
    body.parts.forEach(part => {
      part.label = "Enemy";
      part.gameObject = this;
    });
    body.gameObject = this;

    // Random velocity and spin
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const speed = Phaser.Math.FloatBetween(0.1, 1) * (size + 1) / 2;
    Phaser.Physics.Matter.Matter.Body.setVelocity(this.body, {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed
    });

    Phaser.Physics.Matter.Matter.Body.setAngularVelocity(
      this.body,
      Phaser.Math.FloatBetween(-0.03, 0.03)
    );
  }

  generateJaggedPolygon(radius, points, jaggedness) {
    const result = [];
    const angleStep = (Math.PI * 2) / points;
    for (let i = 0; i < points; i++) {
      const angle = i * angleStep;
      const variation = Phaser.Math.FloatBetween(1 - jaggedness, 1 + jaggedness);
      const r = radius * variation;
      result.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
    }
    return result;
  }

  drawOutline() {
    const g = this.graphics;
    g.clear();
    g.lineStyle(2, 0xffffff, 1);
    g.beginPath();
    g.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      g.lineTo(this.points[i].x, this.points[i].y);
    }
    g.closePath();
    g.strokePath();
  }

  update() {
    super.update();
    this.setPosition(this.body.position.x, this.body.position.y);
    this.setRotation(this.body.angle);
  }

  takeDamage(damage) {
    this.health -= damage;
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    const { x, y, size } = this;
    if (super.die(15)) {
      if (size > 0) {
        for (let i = 0; i < Random.between(2, 3); i++) {
          new Asteroid(x, y, size - 1);
        }
      }
    }
  }
}