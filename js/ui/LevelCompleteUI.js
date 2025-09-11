class LevelCompleteUI extends Phaser.GameObjects.Container {
    constructor(scene, onNextLevel) {
        super(scene, 0, 0);
        scene.add.existing(this);

        // Create semi-transparent black overlay
        this.overlay = scene.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.7);
        this.overlay.setOrigin(0, 0);
        this.add(this.overlay);
        
        // Level complete text
        this.levelText = scene.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 3, 
            `Level ${scene.level} Complete!`, {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        this.add(this.levelText);
        
        // Score text
        this.scoreText = scene.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 
            `Score: ${stats.score}`, {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        this.add(this.scoreText);
        
        // Create next level button
        const buttonWidth = 200;
        const buttonHeight = 50;
        this.button = scene.add.rectangle(
            GAME_WIDTH / 2,
            GAME_HEIGHT * 2/3,
            buttonWidth,
            buttonHeight,
            0x4444ff
        ).setInteractive();
        this.add(this.button);
        
        this.buttonText = scene.add.text(
            GAME_WIDTH / 2, 
            GAME_HEIGHT * 2/3, 
            'Next Level', {
                fontSize: '20px',
                fill: '#ffffff'
            }
        ).setOrigin(0.5);
        this.add(this.buttonText);
        
        // Button hover effect
        this.button.on('pointerover', () => {
            this.button.setFillStyle(0x6666ff);
        });
        
        this.button.on('pointerout', () => {
            this.button.setFillStyle(0x4444ff);
        });
        
        // Button click handler
        this.button.on('pointerdown', () => {
            onNextLevel();
            this.destroy();
        });
    }
}
