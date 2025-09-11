let gameScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function gameScene() {
    Phaser.Scene.call(this, {
      key: "gameScene",
    });
  },

  preload: function () {
  },

  create: function () {
    scene = this;
    this.player = new Player(GAME_WIDTH / 2, GAME_HEIGHT / 2);
    this.ui = new UI()
    this.ui.updateLives()
    this.enemies = this.add.group();
    this.bullets = this.add.group();
    this.powerups = this.add.group();
    this.level = 1;
    this.isLevelComplete = false;
    this.isGameOver = false;
    this.ufo - false;
    this.weaponCount = 0; // count of weapon powerups spawned
    this.kills = 0; // count of enemies killed

    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0xffffff, 1);  // white color, full alpha
    graphics.fillRect(0, 0, 4, 4);    // 4x4 pixel square
    graphics.generateTexture('squareParticle', 4, 4);
    graphics.destroy();  // clean up graphics
    this.debrisParticles = this.add.particles('squareParticle');

    this.matter.world.on('collisionstart', (event) => {
      event.pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;
        const collision = pair.collision;
        const labels = [bodyA.label, bodyB.label];
        if (labels.includes('Bullet') && labels.includes('Enemy')) {
          let bulletBody = labels[0] === 'Bullet' ? bodyA : bodyB;
          let enemyBody = labels[0] === 'Enemy' ? bodyA : bodyB;
          
          const bulletSprite = bulletBody.gameObject
          const enemySprite = enemyBody.gameObject

          bulletBody = bulletSprite.body
          enemyBody = enemySprite.body

          if (!enemyBody) {return}

          if (bulletSprite && enemySprite && !bulletSprite.spent) {
            bulletSprite.spent = true
            const contactPoint = collision.supports[0];
            const MatterBody = Phaser.Physics.Matter.Matter.Body;
            MatterBody.setVelocity(enemyBody, {
              x: enemyBody.velocity.x + bulletBody.velocity.x * (.015 / enemyBody.mass),
              y: enemyBody.velocity.y + bulletBody.velocity.y * (.015 / enemyBody.mass)
            });

            this.emitDebris(
              contactPoint.x,
              contactPoint.y,
              {
                velocity: {
                  x: bulletBody.velocity.x,
                  y: bulletBody.velocity.y
                },
                quantity: 8,
                angleBias: 60,
                scale: { start: .8, end: 0 },
                lifespan: { min: 400, max: 800 },
                tint: [0xFFFFFF, 0xDDDDDD, ...enemySprite.pallet]
              }
            );
            
            enemySprite.takeDamage(bulletSprite.damage)
            
            bulletSprite.visible = false
            this.time.delayedCall(50, () => {
              bulletSprite.destroy();
              this.matter.world.remove(bulletBody);
            });
          }
        }

        if (labels.includes('Player') && labels.includes('Enemy')) {    
          let playerBody = labels[0] === 'Player' ? bodyA : bodyB;
          let enemyBody = labels[0] === 'Enemy' ? bodyA : bodyB;
          
          const playerSprite = playerBody.gameObject
          const enemySprite = enemyBody.gameObject

          playerBody = playerSprite.body
          enemyBody = enemySprite.body

          const rawDamage = Math.floor(collision.depth * 4);
          let damageMod = 1;
          if (["ufo", "snake"].includes(enemySprite.type)) {
            damageMod = 4.5;
          }
          const clampedDamage = Phaser.Math.Clamp(rawDamage, 8, 45);
          playerSprite.takeDamage(clampedDamage * damageMod);
          enemySprite.takeDamage(Math.floor(clampedDamage * 2))

          const contactPoint = collision.supports[0];
          this.emitDebris(
            contactPoint.x,
            contactPoint.y,
            {
              velocity: {
                x: playerBody.velocity.x,
                y: playerBody.velocity.y
              },
              quantity: 15,
              scale: { start: 0.8, end: 0 },
              lifespan: { min: 800, max: 1200 },
              angleBias: 90,
              tint: [0xffff00, ...enemySprite.pallet]
            }
          );
        }

        if (labels.includes('Player') && labels.includes('Powerup')) {
          let playerBody = labels[0] === 'Player' ? bodyA : bodyB;
          let powerupBody = labels[0] === 'Powerup' ? bodyA : bodyB;
          
          const playerSprite = playerBody.gameObject
          const powerupSprite = powerupBody.gameObject

          if (powerupSprite) {
            const type = powerupSprite.type
            powerupSprite.destroy()
            stats.score += 2000
            switch (type) {
              case 0:
                stats.score += 500
                playerSprite.restore(50)
                break;
              case 1:
                stats.score += 2000
                break;
              case 2:
                stats.score += 500
                playerSprite.increaseGunLevel()
                break;
              case 3:
                stats.score += 500
                playerSprite.nova()
                break;
            }
            scene.ui.updateScore()
          }         
        }
      });
    });

    this.loadLevel()
  },

  update: function (time) {
    if (this.isLevelComplete) {
      return;
    }

    this.player.update(time)

    for (const bullet of this.bullets.getChildren()) {
      bullet.update();
    }
    for (const enemy of this.enemies.getChildren()) {
      enemy.update();
    }
    for (const PU of this.powerups.getChildren()) {
      PU.update();
    }

    if (this.enemies.getChildren().length === 10 && !this.ufo) {
      this.ufo = true;
      new UFO();
    }

    if (
      this.enemies.getChildren().length === 0 && 
      this.powerups.getChildren().length === 0 && 
      !this.isLevelComplete
    ) {
      this.player.levelUp();
      this.showLevelComplete();
    }
  },

  showLevelComplete() {
    this.isLevelComplete = true;
    new LevelUI();
  },

loadLevel() {
  scene.timeBonus = 10000;
  let currentLevel;
  if (this.level <= LEVELS.levels.length) {
    currentLevel = LEVELS.levels[this.level - 1];
  } else {
    currentLevel = generateLevel(this.level);
  }
  currentLevel.enemies.forEach(enemy => {
    for (let i = 0; i < enemy.count; i++) {
      const loc = generateEdgeLocation();
      if (enemy.type === 'asteroid') {
        new Asteroid(loc.x, loc.y, enemy.size);
      } else if (enemy.type === 'monster') {
        new Monster(loc.x, loc.y);
      } else if (enemy.type === 'snake') {
        new Snake(loc.x, loc.y);
      } else if (enemy.type === 'mine') {
        new Mine(loc.x, loc.y);
      }
    }
  });
},


  emitDebris(x, y, options = {}) {
    const defaults = {
      velocity: null,
      speed: {min: 5, max: 18},
      angleBias: 180,
      lifespan: { min: 600, max: 900 },
      quantity: 12,
      tint: [0xffffff, 0xdddddd, 0x888888],
      scale: { start: 0.6, end: 0 },
      alpha: { start: 1, end: 0 },
      blendMode: 'ADD'
    };

    options = { ...defaults, ...options };
    
    let speedBias;
    let angleDeg;
    
    if (options.velocity) {
      angleDeg = Phaser.Math.RadToDeg(Math.atan2(options.velocity.y, options.velocity.x));
      speedBias = Math.sqrt(options.velocity.x * options.velocity.x + options.velocity.y * options.velocity.y);
    } else {
      angleDeg = 0;
      speedBias = Phaser.Math.Between(5, 15);
    }

    const emitter = this.debrisParticles.createEmitter({
      x, y,
      speed: {
        min: speedBias * options.speed.min,
        max: speedBias * options.speed.max
      },
      angle: {
        min: angleDeg - options.angleBias,
        max: angleDeg + options.angleBias
      },
      lifespan: options.lifespan,
      quantity: options.quantity,
      scale: options.scale,
      alpha: options.alpha,
      blendMode: options.blendMode,
      tint: options.tint
    });
  
    emitter.explode(options.quantity, x, y);
  },
});
