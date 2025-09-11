class TextInput extends Phaser.GameObjects.Container {
  constructor(x, y, width = 300, height = 50) {
    super(scene, x, y);
    this.scene = scene;
    this.width = width;
    this.height = height;
    this.textValue = playerName || animals[Math.floor(Math.random() * animals.length)];
    this.maxLength = 9;

    // Background rectangle
    this.bg = scene.add.rectangle(0, 0, width, height, 0x000000, 0.5)
      .setStrokeStyle(2, 0xffffff)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.setActive(true);
      });
    this.add(this.bg);

    // Placeholder / Text
    this.textObj = scene.add.text(0, 0, this.textValue, {
      fontFamily: 'font1',
      fontSize: '28px',
      color: '#ffffff'
    }).setOrigin(0.5);
    this.add(this.textObj);

    // Track focus state
    this.isActive = false;

    // Keyboard listener
    scene.input.keyboard.on('keydown', (event) => {
      if (!this.isActive) return;

      if (event.key === "Backspace") {
        this.textValue = this.textValue.slice(0, -1);
      } else if (event.key === "Enter") {
        this.setActive(false);
        this.submit();
      } else if (event.key.length === 1 && this.textValue.length < this.maxLength) {
        this.textValue += event.key;
      }

      this.updateText();
    });

    scene.add.existing(this);
  }

  updateText() {
    if (this.textValue.length > 0) {
      this.textObj.setText(this.textValue);
    }
    playerName = this.textValue;
  }

  setActive(active) {
    this.isActive = active;
    this.bg.setStrokeStyle(2, active ? 0x00ffff : 0xffffff);
    this.updateText();
  }

  getValue() {
    return this.textValue;
  }

  submit() {
    console.log("Submitted:", this.textValue);
  }
}