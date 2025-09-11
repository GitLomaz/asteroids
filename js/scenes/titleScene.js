let titleScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function titleScene() {
    Phaser.Scene.call(this, {
      key: "titleScene",
    });
  },

  init(data) {
    if (data.submitScore) {
      this.submitScore = data.submitScore
    }
  },

  preload() {

  },

  create() {
    scene = this;
    this.enemies = this.add.group();
    this.level = 1;
    for (let i = 0; i < 4; i++) {
      const loc = generateEdgeLocation()
      new Asteroid(loc.x, loc.y)
    }
    const loc = generateEdgeLocation()
    new Monster(loc.x, loc.y)
    this.ui = new TitleUI();
    // new TextInput(this, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 100, 300, 50, "Enter your name...")
    if (this.submitScore) {
      this.ui.buildHighScores(this.submitScore);
    }
  },

  update(time) {
    for (const enemy of this.enemies.getChildren()) {
      enemy.update();
    }
  },
});
