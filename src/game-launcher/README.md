# Phaser3 游戏启动器

这是一个用于浏览和运行 Phaser3 TypeScript 游戏集合的启动器。

## 功能

- 展示所有可用的游戏
- 点击游戏卡片在内嵌框架中启动游戏
- 响应式设计，适配不同屏幕尺寸

## 部署指南

### 先决条件

- Node.js (建议 v14+)
- Yarn 或 npm
- Bash shell (在Windows上可使用Git Bash)

### 1. 构建所有游戏

首先，需要构建所有要包含的游戏。有两种方式：

**方式1: 使用单一命令构建所有游戏（仅Unix/Linux/Mac）**

```bash
# 在主仓库根目录执行
yarn build-all-games
```

**方式2: 使用专用脚本构建每个游戏（适用于所有平台）**

```bash
# 在主仓库根目录执行，构建所有常用游戏
yarn build-games-individual

# 或者单独构建特定游戏
yarn asteroid-build    # 构建小行星游戏
yarn blocks-build      # 构建方块游戏
yarn breakout-build    # 构建打砖块游戏
# ... 其他游戏
```

### 2. 自定义游戏封面和样式

现在的实现使用CSS样式代替实际图片，避免了图片加载错误。如果要使用真实图片：

1. 创建 `src/game-launcher/src/assets/game-covers/` 目录
2. 添加游戏图片，例如 `flappy-bird.png`, `snake.png` 等
3. 修改 `src/game-launcher/src/scenes/launcher-scene.ts` 文件：
   - 在 `createGameCards()` 方法中将 `div.game-card-image` 替换为 `img` 元素
   - 设置 `img.src = assets/game-covers/${game.imageUrl}.png`

### 3. 构建和部署游戏启动器

#### 开发模式

在开发环境运行游戏启动器：

```bash
# 在主仓库根目录执行
yarn game-launcher

# 或者在游戏启动器目录执行
cd src/game-launcher
yarn
yarn serve-dev
```

#### 生产模式

构建生产版本并复制游戏文件：

```bash
# 在主仓库根目录执行
yarn build-launcher

# 或者在游戏启动器目录执行
cd src/game-launcher
yarn
yarn build-with-games  # 构建并复制游戏文件
```

构建完成后，`dist` 目录中包含可部署的文件，包括所有游戏文件。

### 4. 一键构建和部署

要一次性构建所有游戏和启动器：

```bash
# 在主仓库根目录执行
yarn deploy-all
```

### 5. 部署到服务器

将构建好的文件上传到服务器：

1. 复制 `src/game-launcher/dist` 目录到服务器
2. 确保服务器配置使根路径指向游戏启动器的 `index.html`

### 游戏文件管理

#### 自动复制游戏文件

本项目包含一个自动化复制脚本，会在构建过程中将所有游戏复制到启动器的 `dist/games` 目录中：

1. `copy-games.sh` 脚本会自动复制每个游戏的dist目录到启动器的dist/games目录
2. Webpack配置中的自定义插件会在构建后自动执行该脚本
3. 路径已配置为从启动器dist目录直接访问游戏文件

如果需要手动复制游戏文件：

```bash
cd src/game-launcher
./copy-games.sh
```

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name yourgameserver.com;
    
    root /path/to/phaser3-typescript/src/game-launcher/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Apache 配置示例

在根目录创建 `.htaccess` 文件：

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## 故障排除

### 图片加载问题

如果遇到图片加载问题，当前实现已使用CSS样式化的div元素替代真实图片。如果要恢复使用真实图片，请参考上面的"自定义游戏封面和样式"部分。

### 路径问题

如果游戏无法正确加载，可能是路径配置问题：

1. 检查游戏文件是否已正确复制到dist/games目录
2. 确保所有游戏已正确构建
3. 在浏览器开发者工具中检查网络请求错误

### 复制脚本权限问题

如果copy-games.sh脚本无法执行：

```bash
chmod +x src/game-launcher/copy-games.sh
```

## 添加新游戏

1. 构建新游戏
2. 在 `src/game-launcher/src/scenes/launcher-scene.ts` 文件的 `initGames()` 方法中添加新游戏信息
3. 重新构建游戏启动器 (`yarn build-launcher`)

## 自定义

- 修改 `src/game-launcher/src/assets/styles/css/style.css` 更改样式
- 修改 `src/game-launcher/src/config.ts` 更改Phaser配置
- 修改 `src/game-launcher/src/scenes/launcher-scene.ts` 更改游戏列表和功能 