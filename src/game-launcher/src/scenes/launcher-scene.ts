export interface GameInfo {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  path: string;
}

export class LauncherScene extends Phaser.Scene {
  private games: GameInfo[] = [];
  private currentFrame: HTMLIFrameElement | null = null;

  constructor() {
    super({ key: 'LauncherScene' });
  }

  preload(): void {
    // 不需要预加载图片，使用CSS样式代替
  }

  create(): void {
    // 初始化游戏列表
    this.initGames();
    
    // 创建游戏卡片
    this.createGameCards();

    // 设置返回按钮事件
    const backButton = document.getElementById('backButton');
    if (backButton) {
      backButton.addEventListener('click', () => this.returnToGameList());
    }
  }

  private initGames(): void {
    // 从根目录的package.json中获取所有游戏
    this.games = [
      {
        id: 'flappy-bird',
        title: '像素鸟',
        description: '控制小鸟穿过管道，尽可能飞得更远。',
        imageUrl: 'flappy-bird',
        path: 'games/flappy-bird/index.html'
      },
      {
        id: 'snake',
        title: '贪吃蛇',
        description: '控制蛇吃食物，不要撞到墙壁或自己的身体。',
        imageUrl: 'snake',
        path: 'games/snake/index.html'
      },
      {
        id: 'breakout',
        title: '打砖块',
        description: '用挡板反弹球打碎所有砖块。',
        imageUrl: 'breakout',
        path: 'games/breakout/index.html'
      },
      {
        id: 'space-invaders',
        title: '太空侵略者',
        description: '射击下落的外星人，保卫地球。',
        imageUrl: 'space-invaders',
        path: 'games/space-invaders/index.html'
      },
      {
        id: 'asteroid',
        title: '小行星',
        description: '在太空中躲避和射击小行星。',
        imageUrl: 'default-cover',
        path: 'games/asteroid/index.html'
      },
      {
        id: 'blocks',
        title: '方块消除',
        description: '消除相同颜色的方块获得高分。',
        imageUrl: 'default-cover',
        path: 'games/blocks/index.html'
      },
      {
        id: 'candy-crush',
        title: '糖果粉碎',
        description: '匹配三个或更多相同的糖果。',
        imageUrl: 'default-cover',
        path: 'games/candy-crush/index.html'
      },
      {
        id: 'coin-runner',
        title: '硬币奔跑者',
        description: '收集硬币并躲避障碍物。',
        imageUrl: 'default-cover',
        path: 'games/coin-runner/index.html'
      },
      {
        id: 'tank',
        title: '坦克大战',
        description: '控制坦克消灭敌人。',
        imageUrl: 'default-cover',
        path: 'games/tank/index.html'
      }
    ];
  }

  private createGameCards(): void {
    const gameContainer = document.getElementById('gameContainer');
    if (!gameContainer) return;

    // 确保容器为空
    gameContainer.innerHTML = '';

    // 为每个游戏创建卡片
    this.games.forEach(game => {
      const card = document.createElement('div');
      card.className = 'game-card';
      card.dataset.id = game.id;
      card.dataset.path = game.path;

      // 添加图片区域（用div替代img避免加载错误）
      const imgDiv = document.createElement('div');
      imgDiv.className = 'game-card-image';
      imgDiv.textContent = game.title;
      card.appendChild(imgDiv);

      // 添加游戏信息
      const info = document.createElement('div');
      info.className = 'game-info';
      
      const title = document.createElement('h3');
      title.textContent = game.title;
      info.appendChild(title);
      
      const desc = document.createElement('p');
      desc.textContent = game.description;
      info.appendChild(desc);
      
      card.appendChild(info);

      // 添加点击事件
      card.addEventListener('click', () => this.loadGame(game));
      
      // 添加到容器
      gameContainer.appendChild(card);
    });
  }

  private loadGame(game: GameInfo): void {
    // 隐藏游戏列表
    const gameContainer = document.getElementById('gameContainer');
    const title = document.querySelector('.title') as HTMLElement;
    const backButton = document.getElementById('backButton');
    
    if (gameContainer) gameContainer.style.display = 'none';
    if (title) title.style.display = 'none';
    if (backButton) backButton.style.display = 'block';

    // 创建iframe加载游戏
    this.currentFrame = document.createElement('iframe');
    this.currentFrame.style.width = '100%';
    this.currentFrame.style.height = '100vh';
    this.currentFrame.style.border = 'none';
    this.currentFrame.src = game.path;
    
    const gameElement = document.getElementById('game');
    if (gameElement) {
      gameElement.appendChild(this.currentFrame);
    }
  }

  private returnToGameList(): void {
    // 移除iframe
    if (this.currentFrame && this.currentFrame.parentNode) {
      this.currentFrame.parentNode.removeChild(this.currentFrame);
      this.currentFrame = null;
    }

    // 显示游戏列表
    const gameContainer = document.getElementById('gameContainer');
    const title = document.querySelector('.title') as HTMLElement;
    const backButton = document.getElementById('backButton');
    
    if (gameContainer) gameContainer.style.display = 'grid';
    if (title) title.style.display = 'block';
    if (backButton) backButton.style.display = 'none';
  }
} 