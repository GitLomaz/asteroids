class TitleUI extends Phaser.GameObjects.Container {
  constructor() {
    super(scene, 0, 0);

    this.title = scene.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 4, 'The Dark Nebula', {
      fontFamily: 'font1',
      fontSize: '64px'
    });
    this.title.setOrigin(0.5);
    this.add(this.title);

    this.highScoreObjects = [];

    const menuItems = [
      { text: 'START GAME', action: () => {
        resetStats();
        scene.scene.stop(scene.scene.key);
        scene.scene.start('gameScene');
      }},
      { text: 'HIGH SCORES', action: () => this.buildHighScores() }
    ];

    this.menuOptions = [];
    menuItems.forEach((item, i) => {
      const y = GAME_HEIGHT / 2 + i * 50;
      const text = scene.add.text(GAME_WIDTH / 2, y, item.text, {
        fontFamily: 'font1',
        fontSize: '32px'
      });
      text.setOrigin(0.5);
      text.setInteractive({ useHandCursor: true });
      
      text.on('pointerover', () => {
        text.setColor('#00ffff');
      });
      
      text.on('pointerout', () => {
        text.setColor('#ffffff');
      });
      
      text.on('pointerdown', item.action);
      
      this.menuOptions.push(text);
      this.add(text);
    });

    // Create permanent controls display in corner
    this.createControlsDisplay();
    scene.add.existing(this);
    this.buildHighScores = this.buildHighScores.bind(this);
  }

  showHighScores() {
    this.menuOptions.forEach(option => option.setVisible(false));
    this.highScores.setVisible(true);
  }

  createControlsDisplay() {
    const controls = [
      'ARROWS - Move ship',
      'SPACE - Fire'
    ];

    // Create a container for controls in top right
    const cornerX = GAME_WIDTH - 20;
    const startY = 20;

    controls.forEach((control, i) => {
      const text = scene.add.text(cornerX, startY + i * 30, control, {
        fontFamily: 'font1',
        fontSize: '16px'
      });
      text.setOrigin(1, 0); // Align to right
      text.setAlpha(0.7); // Slightly transparent
      this.add(text);
    });
  }

  buildHighScores(submission) {
    console.log('building!')
    this.menuOptions.forEach(option => option.setVisible(false));

    const backText = scene.add.text(GAME_WIDTH / 2, 600, 'Main Menu', {
      fontFamily: 'font1',
      fontSize: '32px'
    });
    backText.setOrigin(0.5);
    backText.setInteractive({ useHandCursor: true });
    backText.on('pointerover', () => backText.setColor('#00ffff'));
    backText.on('pointerout', () => backText.setColor('#ffffff'));
    backText.on('pointerdown', () => {
      this.menuOptions.forEach(option => option.setVisible(true));
      this.highScoreObjects.forEach(obj => obj.destroy());
    });
    this.highScoreObjects.push(backText);

    scene.loading = scene.add.text(GAME_WIDTH / 2, 300, "Loading . . .", {
      fontFamily: 'font1',
      fontSize: '32px'
    });
    scene.loading.setOrigin(.5);
    scene.scores = [];

    const handleResponse = (res) => {
      scene.loading.visible = false;
      console.log(res)

      res.scores.forEach((score, i) => {
        const rank = scene.add.text(455, 240 + i * 30, (i + 1), {
          fontFamily: 'font1',
        });
        scene.scores.push(rank);
        scene.add.existing(rank);
        this.highScoreObjects.push(rank);

        const name = scene.add.text(545, 240 + i * 30, score.name, {
          fontFamily: 'font1',
        });
        scene.scores.push(name);
        scene.add.existing(name);
        this.highScoreObjects.push(name);

        const number = scene.add.text(735, 240 + i * 30, score.score, {
          fontFamily: 'font1',
        });
        scene.scores.push(number);
        scene.add.existing(number);
        this.highScoreObjects.push(number);
      });

      if (res.position) {
        const rank = scene.add.text(455, 240 + 300, res.position, {
          fontFamily: 'font1',
        });
        scene.scores.push(rank);
        scene.add.existing(rank);
        this.highScoreObjects.push(rank);

        const name = scene.add.text(545, 240 + 300, res.name, {
          fontFamily: 'font1',
        });
        scene.scores.push(name);
        scene.add.existing(name);
        this.highScoreObjects.push(name);

        const number = scene.add.text(735, 240 + 300, res.score, {
          fontFamily: 'font1',
        });
        scene.scores.push(number);
        scene.add.existing(number);
        this.highScoreObjects.push(number);
      }
    };

    if (submission) {
      fetch("https://us-dev.nightscapes.io/scores/submitScores.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ data: submission }).toString()
      })
        .then((res) => res.json())
        .then(handleResponse)
        .catch((err) => console.error("Error submitting scores:", err));

    } else {
      fetch("https://us-dev.nightscapes.io/scores/submitScores.php?game=asteroids")
        .then((res) => res.json())
        .then(handleResponse)
        .catch((err) => console.error("Error fetching scores:", err));
    }
  }
}