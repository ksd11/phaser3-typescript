import { LauncherScene } from './scenes/launcher-scene';

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Phaser3 游戏启动器',
  url: 'https://github.com/digitsensitive/phaser3-typescript',
  version: '1.0.0',
  backgroundColor: 0x282c34,
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'gameContainer',
    width: 800,
    height: 600
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 }
    }
  },
  scene: [LauncherScene]
};
