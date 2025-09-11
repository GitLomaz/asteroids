class LevelUI extends Phaser.GameObjects.Container {
  constructor() {
    super(scene, 0, 0);

    let texts = [];

    this.title = scene.add.text(GAME_WIDTH / 2, 100, 'LEVEL ' + scene.level + ' COMPLETE', {
      fontFamily: 'font1',
      fontSize: '42px'
    }).setOrigin(0.5).setAlpha(0);
    this.add(this.title);
    texts.push(this.title);

    const clearBonus = 5000 + (scene.level * 1000);
    this.clearBonus = scene.add.text(GAME_WIDTH / 2, 160, 'Clear Bonus: ' + clearBonus, {
      fontFamily: 'font1',
      fontSize: '32px'
    }).setOrigin(0.5).setAlpha(0);
    this.add(this.clearBonus);
    texts.push(this.clearBonus);

    this.timeBonus = scene.add.text(GAME_WIDTH / 2, 220, 'Time Bonus: ' + scene.timeBonus, {
      fontFamily: 'font1',
      fontSize: '32px'
    }).setOrigin(0.5).setAlpha(0);
    this.add(this.timeBonus);
    texts.push(this.timeBonus);

    this.totalBonus = scene.add.text(GAME_WIDTH / 2, 280, 'Total Bonus: ' + (clearBonus + scene.timeBonus), {
      fontFamily: 'font1',
      fontSize: '32px'
    }).setOrigin(0.5).setAlpha(0);
    this.add(this.totalBonus);
    texts.push(this.totalBonus);

    this.nextLevel = scene.add.text(GAME_WIDTH / 2, 600, "Next Level", {
      fontFamily: 'font1',
      fontSize: '42px'
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => {
        this.nextLevel.setColor('#00ffff');
      })
      .on('pointerout', () => {
        this.nextLevel.setColor('#ffffff');
      })
      .on('pointerdown', () => {
        scene.level++;
        scene.loadLevel();
        this.destroy();
        scene.isLevelComplete = false;
        scene.player.respawn();
      })
      .setAlpha(0);
    this.add(this.nextLevel);
    texts.push(this.nextLevel);

    texts.forEach((text, i) => {
      scene.time.delayedCall(i * 500, () => {
        scene.tweens.add({
          targets: text,
          alpha: { from: 0, to: 1 },
          duration: 400
        });
      });
    });


    scene.add.existing(this);
  }
}