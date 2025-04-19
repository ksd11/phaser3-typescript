export class MainMenuScene extends Phaser.Scene {
  private startKey: Phaser.Input.Keyboard.Key;
  private titleBitmapText: Phaser.GameObjects.BitmapText;
  private playBitmapText: Phaser.GameObjects.BitmapText;

  constructor() {
    super({
      key: 'MainMenuScene'
    });
  }

  init(): void {
    this.startKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.S
    );
    this.startKey.isDown = false;
  }

  create(): void {
    this.titleBitmapText = this.add.bitmapText(
      0,
      200,
      'font',
      'FLAPPY BIRD',
      30
    );

    this.titleBitmapText.x = this.getCenterXPositionOfBitmapText(
      this.titleBitmapText.width
    );

    this.playBitmapText = this.add.bitmapText(
      0, 
      300, 
      'font', 
      'S: PLAY / TAP TO START', 
      20
    );

    this.playBitmapText.x = this.getCenterXPositionOfBitmapText(
      this.playBitmapText.width
    );

    this.input.on('pointerdown', () => {
      this.startGame();
    });
    
    this.detectMobileDevice();
  }

  update(): void {
    if (this.startKey.isDown) {
      this.startGame();
    }
  }

  private startGame(): void {
    this.scene.start('GameScene');
  }

  private getCenterXPositionOfBitmapText(width: number): number {
    return this.sys.canvas.width / 2 - width / 2;
  }
  
  private detectMobileDevice(): void {
    const isPortrait = window.innerHeight > window.innerWidth;
    
    if (window.innerWidth < 500) {
      const touchTip = this.add.bitmapText(
        0,
        400,
        'font',
        'TAP SCREEN TO JUMP',
        16
      );
      
      touchTip.x = this.getCenterXPositionOfBitmapText(touchTip.width);
    }
  }
}
