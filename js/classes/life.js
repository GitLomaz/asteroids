class Life extends Phaser.GameObjects.Graphics {
  constructor(x, y) {
    super(scene);
    this.x = x;
    this.y = y;
    this.lineStyle(3, 0xffffff);
    this.beginPath();
    this.moveTo(0, -14);
    this.lineTo(10, 10);
    this.lineTo(0, 7);
    this.lineTo(-10, 10);
    this.closePath();
    this.strokePath();
    scene.add.existing(this);
  }
}