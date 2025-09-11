class Entity extends Phaser.GameObjects.Container {
  constructor(x, y) {
    super(scene, x, y);
  }

  update() {
    this.wrapScreen()
  }

  wrapScreen() { 
    let x = this.body.position.x;
    let y = this.body.position.y;
  
    if (x < 0) {
      x = GAME_WIDTH;
    } else if (x > GAME_WIDTH) {
      x = 0;
    }
  
    if (y < 0) {
      y = GAME_HEIGHT;
    } else if (y > GAME_HEIGHT) {
      y = 0;
    }
  
    Phaser.Physics.Matter.Matter.Body.setPosition(this.body, { x, y });
    this.setPosition(x, y);
  }
}