class Enemy extends Entity {
  constructor(x, y) {
    super(x, y)
    scene.enemies.add(this);
  }

  update() {
    super.update()
  }

  die(puOdds = 0) {
    if (this.dieing) {return}
    scene.emitDebris(this.x, this.y, {
      tint: [0xffffff, 0xdddddd, ...this.pallet],
      quantity: 30,
    });
    if (scene.level === 1 && scene.kills === 0) {
      this.spawnPowerUp(4);
    }
    if (puOdds > 0 && Random.oneIn(puOdds)) {
      this.spawnPowerUp();
    }
    this.dieing = true
    stats.score += this.score
    scene.ui.updateScore()
    if (this.body) {
      scene.matter.world.remove(this.body);
      this.body = undefined;
    }
    this.destroy()
    scene.kills++;
    return true;
  }

  spawnPowerUp(pu = -1) {
    if (pu === -1) {
      pu = Random.between(1, 4);
      if (scene.weaponCount >= 2 && pu === 3) {
        pu = 4
      }
    }
    if (pu === 1) {
      new PowerUpHealth(this.x, this.y)
    } else if (pu === 2) {
      new PowerUpScore(this.x, this.y)
    } else if (pu === 3) {
      new PowerUpWeapon(this.x, this.y)
      scene.weaponCount++;
    } else if (pu === 4) {
      new PowerUpNova(this.x, this.y)
    }
  }
}
