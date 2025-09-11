class Asteroid extends Enemy {
  constructor(x, y, size = 2, ) {
    const SIZES = [
      {radius: 10, health: 20, score: 200},
      {radius: 30, health: 50, score: 160},
      {radius: 50, health: 75, score: 125},
      {radius: 70, health: 100, score: 200},
    ]
    const radius = SIZES[size].radius
    const health = SIZES[size].health
    
    super(x, y);
    scene.add.existing(this);
    this.radius = radius;
    this.health = health;
    this.score = SIZES[size].score
    this.size = size;
    this.pallet = [0xffffff, 0xcccccc, 0x999999]
    this.points = this.generateJaggedPolygon(radius, 10, .3);
    this.graphics = new Phaser.GameObjects.Graphics(scene);
    this.add(this.graphics);
    this.setPosition(x, y);
    this.drawOutline();

    // Create physics body
    const body = scene.matter.add.fromVertices(x, y, this.points, {
      frictionAir: 0,
      restitution: 0.8
    }, true);

    this.body = body;
    this.body.collisionFilter.group = -1;
    body.label = "Enemy";
    body.parts.forEach(part => part.label = "Enemy");
    body.parts.forEach(part => part.gameObject = this);
    body.gameObject = this;

    // Random velocity and rotation
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const speed = Phaser.Math.FloatBetween(0.1, 1) * (size + 1) / 2
    Phaser.Physics.Matter.Matter.Body.setVelocity(this.body, {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed
    });

    Phaser.Physics.Matter.Matter.Body.setAngularVelocity(this.body, Phaser.Math.FloatBetween(-0.03, 0.03));
  }

  generateJaggedPolygon(radius, points, jaggedness) {
    const result = [];
    const angleStep = (Math.PI * 2) / points;
    for (let i = 0; i < points; i++) {
      const angle = i * angleStep;
      const variation = Phaser.Math.FloatBetween(1 - jaggedness, 1 + jaggedness);
      const r = radius * variation;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      result.push({ x, y });
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
    super.update()
    this.setPosition(this.body.position.x, this.body.position.y);
    this.setRotation(this.body.angle);
  }

  takeDamage(damage) {
    this.health -= damage
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    let x = this.x
    let y = this.y
    let size = this.size
    if(super.die(15)) {
      if (size > 0) {
        for (let i = 0; i < Random.between(2, 3); i++) {
          new Asteroid(x, y, size - 1)
        }
      }
    }
  }
}