class UFO extends Enemy {
  constructor() {
    const corners = [
      { x: -50, y: -50 },
      { x: scene.game.config.width + 50, y: -50 },
      { x: -50, y: scene.game.config.height + 50 },
      { x: scene.game.config.width + 50, y: scene.game.config.height + 50 }
    ];
    
    const startCorner = Phaser.Math.RND.pick(corners);
    const endCorner = corners.find(corner => 
      Math.abs(corner.x - startCorner.x) > scene.game.config.width / 2 &&
      Math.abs(corner.y - startCorner.y) > scene.game.config.height / 2
    );
    
    super(startCorner.x, startCorner.y);
    scene.add.existing(this);

    this.health = 80;
    this.score = 3000;
    this.pallet = [0x00ffff, 0x66ffff, 0x003366];
    this.type = "ufo"

    const dx = endCorner.x - startCorner.x;
    const dy = endCorner.y - startCorner.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const speed = 1.3;
    
    this.prevState = {
      position: { x: startCorner.x, y: startCorner.y },
      angle: 0,
      velocity: {
        x: (dx / distance) * speed,
        y: (dy / distance) * speed
      },
      angularVelocity: 0
    };

    this.generateUFOPoints();

    this.graphics = scene.make.graphics({ x: 0, y: 0, add: false });
    this.graphics.lineStyle(2, 0x00ffff, 1);
    this.graphics.fillStyle(0x003366, 0.7);

    this.generateBody(this.points);
    this.setPosition(startCorner.x, startCorner.y);
  }

  generateUFOPoints() {
    const mainPoints = [[-8, -12], [-6, -14], [-3, -15], [0, -16], [3, -15], [6, -14], [8, -12], [10, -10], [12, -8], [14, -6], [20, -4], [24, -2], [26, 0], [27, 2], [24, 4], [20, 6], [14, 8], [12, 9], [10, 10], [8, 11], [4, 12], [0, 12], [-4, 12], [-8, 11], [-10, 10], [-12, 9], [-14, 8], [-10, 10], [-12, 9], [-14, 8], [-20, 6], [-24, 4], [-26, 2], [-27, 0], [-24, -2], [-20, -4], [-14, -6], [-12, -8], [-10, -10]];

    const windowPoints = [];
    const windowRadius = 3;
    const windowCenters = [
      [-12, 0],
      [0, 0],
      [12, 0]
    ];

    windowCenters.forEach(([cx, cy]) => {
      for (let angle = 0; angle <= Math.PI * 2; angle += Math.PI / 8) {
        windowPoints.push([
          cx + Math.cos(angle) * windowRadius,
          cy + Math.sin(angle) * windowRadius
        ]);
      }
    });

    this.points = [...mainPoints, ...windowPoints];
  }

  takeDamage(damage) {
    this.health -= damage
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    super.die(10);
    this.spawnPowerUp();
    this.spawnPowerUp();
  }

  generateBody(points) {
    const hullPoints = points.slice(0, 39);
    this.verticies = hullPoints.map(([x, y]) => ({ x, y }));

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
    Phaser.Physics.Matter.Matter.Body.setAngle(body, 0);
    Phaser.Physics.Matter.Matter.Body.setVelocity(body, this.prevState.velocity);
    Phaser.Physics.Matter.Matter.Body.setAngularVelocity(body, 0);
    body.label = "Enemy";
    body.parts.forEach(part => {
      part.label = "Enemy";
      part.gameObject = this;
    });
    body.gameObject = this;

    this.graphics.clear();

    const offsetX = 32;
    const offsetY = 32;

    const phaserHullPoints = hullPoints.map(p => new Phaser.Math.Vector2(p[0], p[1]));
    this.graphics.lineStyle(2, 0x00ffff, 1);
    this.graphics.fillStyle(0x003366, 0.7);
    
    const windowRadius = 3;
    const windowCenters = [[-12, 0], [0, 0], [12, 0]];
    this.graphics.beginPath();
    this.graphics.moveTo(phaserHullPoints[0].x + offsetX, phaserHullPoints[0].y + offsetY);
    for (let i = 1; i < phaserHullPoints.length; i++) {
      this.graphics.lineTo(phaserHullPoints[i].x + offsetX, phaserHullPoints[i].y + offsetY);
    }
    this.graphics.closePath();
    this.graphics.fillPath();
    this.graphics.strokePath();

    this.graphics.lineStyle(2, 0x00ffff, 1);
    this.graphics.fillStyle(0x66ffff, 0.5);
    
    windowCenters.forEach(([cx, cy]) => {
      const x = cx + offsetX;
      const y = cy + offsetY;
      
      this.graphics.beginPath();
      this.graphics.fillCircle(x, y, windowRadius);
      this.graphics.strokeCircle(x, y, windowRadius);
    });

    const texSize = 64;
    const newTexKey = 'ufo-' + Phaser.Math.RND.uuid();
    this.graphics.generateTexture(newTexKey, texSize, texSize);

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
    if (this.body) {
      this.setPosition(this.body.position.x, this.body.position.y);
      Phaser.Physics.Matter.Matter.Body.setVelocity(this.body, this.prevState.velocity);
      if (this.body.position.x < -50 || this.body.position.x > scene.game.config.width + 50) {
        this.destroy();
      }
    }
  }
}
