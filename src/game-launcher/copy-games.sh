#!/bin/bash

# 创建games目录
mkdir -p dist/games

# 复制每个游戏的dist目录到game-launcher的dist/games目录
echo "开始复制游戏文件..."

# 获取所有游戏目录
GAMES_DIR="../games"
for game in $(ls $GAMES_DIR); do
    # 检查游戏dist目录是否存在
    if [ -d "$GAMES_DIR/$game/dist" ]; then
        echo "复制 $game 游戏..."
        # 创建目标目录
        mkdir -p "dist/games/$game"
        # 复制dist目录内容
        cp -r "$GAMES_DIR/$game/dist/"* "dist/games/$game/"
    fi
done

echo "所有游戏复制完成！" 