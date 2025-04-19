import { ImageConstructor } from '../interfaces/image.interface';

export class Bird extends Phaser.GameObjects.Image {
  body: Phaser.Physics.Arcade.Body;

  private jumpKey: Phaser.Input.Keyboard.Key;
  private isDead: boolean;
  private isFlapping: boolean;

  public getDead(): boolean {
    return this.isDead;
  }

  public setDead(dead: boolean): void {
    this.isDead = dead;
  }

  constructor(params: ImageConstructor) {
    super(params.scene, params.x, params.y, params.texture, params.frame);

    // image
    this.setScale(3);
    this.setOrigin(0, 0);

    // variables
    this.isDead = false;
    this.isFlapping = false;

    // physics
    this.scene.physics.world.enable(this);
    this.body.setGravityY(1000);
    this.body.setSize(17, 12);

    // 键盘输入
    this.jumpKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    // 添加触摸/点击输入
    this.scene.input.on('pointerdown', this.flap, this);

    this.scene.add.existing(this);
  }

  update(): void {
    // handle angle change
    if (this.angle < 30) {
      this.angle += 2;
    }

    // handle keyboard input
    if (this.jumpKey.isDown && !this.isFlapping) {
      this.flap();
    } else if (this.jumpKey.isUp && this.isFlapping) {
      this.isFlapping = false;
    }

    // check if off the screen
    if (this.y + this.height > this.scene.sys.canvas.height) {
      this.isDead = true;
    }
  }

  // 将扇翅膀逻辑提取到单独的方法，便于触摸和键盘共用
  private flap(): void {
    if (this.isDead) return;
    
    this.isFlapping = true;
    this.body.setVelocityY(-350);
    this.scene.tweens.add({
      targets: this,
      props: { angle: -20 },
      duration: 150,
      ease: 'Power0'
    });
    
    // 如果是触摸调用，需要在下一帧重置isFlapping状态
    if (this.jumpKey.isUp) {
      this.scene.time.delayedCall(200, () => {
        this.isFlapping = false;
      });
    }
  }
}
