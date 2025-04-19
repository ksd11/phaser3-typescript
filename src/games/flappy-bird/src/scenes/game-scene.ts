import { Bird } from '../objects/bird';
import { Pipe } from '../objects/pipe';

export class GameScene extends Phaser.Scene {
  private bird: Bird;
  private pipes: Phaser.GameObjects.Group;
  private background: Phaser.GameObjects.TileSprite;
  private scoreText: Phaser.GameObjects.BitmapText;
  private timer: Phaser.Time.TimerEvent;
  private isPaused: boolean = false;
  private pauseButton: Phaser.GameObjects.Image;

  constructor() {
    super({
      key: 'GameScene'
    });
  }

  init(): void {
    this.registry.set('score', -1);
    this.isPaused = false;
  }

  create(): void {
    this.background = this.add
      .tileSprite(0, 0, 390, 600, 'background')
      .setOrigin(0, 0);

    this.scoreText = this.add
      .bitmapText(
        this.sys.canvas.width / 2 - 14,
        30,
        'font',
        this.registry.values.score
      )
      .setDepth(2);

    this.pipes = this.add.group({});

    this.bird = new Bird({
      scene: this,
      x: 50,
      y: 100,
      texture: 'bird'
    });

    this.addNewRowOfPipes();

    this.timer = this.time.addEvent({
      delay: 1500,
      callback: this.addNewRowOfPipes,
      callbackScope: this,
      loop: true
    });

    this.addPauseButton();

    window.addEventListener('resize', this.checkOrientation.bind(this));
    this.checkOrientation();

    this.createTouchArea();
  }

  update(): void {
    if (this.isPaused) return;

    if (!this.bird.getDead()) {
      this.background.tilePositionX += 4;
      this.bird.update();
      this.physics.overlap(
        this.bird,
        this.pipes,
        function () {
          this.bird.setDead(true);
        },
        null,
        this
      );
    } else {
      Phaser.Actions.Call(
        this.pipes.getChildren(),
        function (pipe: Pipe) {
          pipe.body.setVelocityX(0);
        },
        this
      );

      if (this.bird.y > this.sys.canvas.height) {
        this.scene.start('MainMenuScene');
      }
    }
  }

  private addNewRowOfPipes(): void {
    this.registry.values.score += 1;
    this.scoreText.setText(this.registry.values.score);

    let hole = Math.floor(Math.random() * 5) + 1;

    for (let i = 0; i < 10; i++) {
      if (i !== hole && i !== hole + 1 && i !== hole + 2) {
        if (i === hole - 1) {
          this.addPipe(400, i * 60, 0);
        } else if (i === hole + 3) {
          this.addPipe(400, i * 60, 1);
        } else {
          this.addPipe(400, i * 60, 2);
        }
      }
    }
  }

  private addPipe(x: number, y: number, frame: number): void {
    this.pipes.add(
      new Pipe({
        scene: this,
        x: x,
        y: y,
        frame: frame,
        texture: 'pipe'
      })
    );
  }

  private addPauseButton(): void {
    this.pauseButton = this.add.image(360, 30, 'pipe', 0)
      .setScale(0.6)
      .setAlpha(0.7)
      .setInteractive()
      .on('pointerdown', () => {
        this.togglePause();
      });
    
    this.pauseButton.setDepth(3);
  }

  private togglePause(): void {
    this.isPaused = !this.isPaused;
    
    if (this.isPaused) {
      this.physics.pause();
      this.timer.paused = true;
      
      const pauseText = this.add.bitmapText(
        0,
        this.sys.canvas.height / 2,
        'font',
        'PAUSED - TAP TO RESUME',
        20
      ).setDepth(3);
      
      pauseText.x = this.sys.canvas.width / 2 - pauseText.width / 2;
      pauseText.setName('pauseText');
    } else {
      this.physics.resume();
      this.timer.paused = false;
      
      const pauseText = this.children.getByName('pauseText');
      if (pauseText) pauseText.destroy();
    }
  }

  private checkOrientation(): void {
    if (window.innerWidth < 500 && window.innerWidth > window.innerHeight) {
      if (!this.children.getByName('orientationText')) {
        const orientText = this.add.bitmapText(
          0,
          this.sys.canvas.height / 2 - 50,
          'font',
          'PORTRAIT MODE\nRECOMMENDED',
          20
        ).setDepth(3)
          .setName('orientationText');
        
        orientText.x = this.sys.canvas.width / 2 - orientText.width / 2;
        
        this.time.delayedCall(3000, () => {
          if (orientText && orientText.active) {
            orientText.destroy();
          }
        });
      }
    }
  }

  private createTouchArea(): void {
    const touchArea = this.add.rectangle(
      0, 
      0, 
      this.sys.canvas.width, 
      this.sys.canvas.height,
      0xffffff, 
      0
    ).setOrigin(0, 0);
    
    touchArea.setInteractive();
    touchArea.on('pointerdown', () => {
      if (this.isPaused) {
        this.togglePause();
        return;
      }
    });
  }
}
