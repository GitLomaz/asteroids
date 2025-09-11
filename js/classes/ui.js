class UI extends Phaser.GameObjects.Container {
  constructor() {
    super(scene, 0, 0);

    this.shield = scene.add.text(GAME_WIDTH / 2, 20, 'Shield: 100%', {
      fontFamily: 'font1',
      fontSize: '22px'
    });
    this.shield.setOrigin(0.5, 0.5);
    this.add(this.shield); // Add to container

    this.score = scene.add.text(GAME_WIDTH / 6, 20, '00000000', {
      fontFamily: 'font1',
      fontSize: '22px'
    });
    this.score.setOrigin(0, 0.5);
    this.add(this.score); // Add to container

    this.lives = [];
    for (let i = 0; i < 5; i++) {
      let life = new Life(4.5 * GAME_WIDTH / 6 + i * 28, 20);
      life.setScale(0.75);
      this.lives.push(life);
      this.add(life); // Add to container
    }

    scene.add.existing(this); // Add UI container to the scene
  }

  updateShield() {
    const value = Math.max(0, Math.min(200, stats.shield || 0));
    const padded = String(value).padStart(3, '0');
    this.shield.setText(`Shield: ${padded}%`);
    if (value > 100) {
      this.shield.setColor('#00ff00');
    } else if (value < 40) {
      this.shield.setColor('#ff0000');
    } else {
      this.shield.setColor('#ffffff');
    }
  }

  updateScore() {
    const padded = String(stats.score || 0).padStart(8, '0');
    this.score.setText(padded);
  }

  updateLives() {
    const lives = Math.max(0, Math.min(this.lives.length, stats.lives || 0));
    for (let i = 0; i < this.lives.length; i++) {
      this.lives[i].setVisible(i < lives);
    }
  }
}