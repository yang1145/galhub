// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    const gamesContainer = document.getElementById('gamesContainer');
    
    // 页面加载时获取游戏数据
    fetchGames();
    
    // 从后端API获取游戏数据
    async function fetchGames() {
        try {
            const response = await fetch('/api/games');
            if (response.ok) {
                const games = await response.json();
                renderGames(games);
            } else {
                console.error('Failed to fetch games:', response.status);
                gamesContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; font-size: 1.2rem; color: #777;">加载游戏数据失败</p>';
            }
        } catch (error) {
            console.error('Error fetching games:', error);
            gamesContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; font-size: 1.2rem; color: #777;">加载游戏数据时发生错误</p>';
        }
    }
    
    // 渲染游戏的函数
    function renderGames(gamesList) {
        // 清空容器
        gamesContainer.innerHTML = '';
        
        // 如果没有游戏，显示提示信息
        if (gamesList.length === 0) {
            gamesContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; font-size: 1.2rem; color: #777;">暂无游戏数据</p>';
            return;
        }
        
        // 为每个游戏创建卡片
        gamesList.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.className = 'game-card';
            
            // 根据是否有别名来决定渲染方式
            const aliasHtml = game.alias && game.alias !== game.name 
                ? `<div class="game-alias">${game.alias}</div>` 
                : '';
            
            // 处理封面图片，如果不存在则使用默认图片
            const coverImage = game.cover_link ? game.cover_link : 'img/default.jpg';
            
            gameCard.innerHTML = `
                <img src="${coverImage}" alt="${game.name}" class="game-cover" onerror="this.src='img/default.jpg'">
                <div class="game-info">
                    <div class="game-title-container">
                        <h3 class="game-title">${game.name}</h3>
                        <button class="play-button" data-game-id="${game.id}" data-game-address="${game.game_address || '#'}">
                            启动游戏
                        </button>
                    </div>
                    ${aliasHtml}
                </div>
            `;
            
            gamesContainer.appendChild(gameCard);
        });
        
        // 为所有启动按钮添加事件监听器
        document.querySelectorAll('.play-button').forEach(button => {
            button.addEventListener('click', function() {
                const gameId = this.getAttribute('data-game-id');
                const gameAddress = this.getAttribute('data-game-address');
                
                if (gameAddress && gameAddress !== '#') {
                    window.location.assign(gameAddress);
                } else {
                    alert(`正在启动游戏 ID: ${gameId} - ${this.closest('.game-card').querySelector('.game-title').textContent}`);
                }
                // 这里可以添加实际的游戏启动逻辑
            });
        });
    }
});