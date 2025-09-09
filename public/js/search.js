// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    const gamesContainer = document.getElementById('gamesContainer');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    // 页面加载时获取所有游戏数据
    let allGames = [];
    
    // 获取游戏数据
    async function fetchGames() {
        try {
            const response = await fetch('/api/games');
            if (response.ok) {
                allGames = await response.json();
            } else {
                console.error('Failed to fetch games:', response.status);
            }
        } catch (error) {
            console.error('Error fetching games:', error);
        }
    }
    
    // 执行搜索
    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        
        if (query === '') {
            gamesContainer.innerHTML = '<div class="search-results-title">请输入关键词进行搜索</div>';
            return;
        }
        
        const filteredGames = allGames.filter(game => 
            game.name.toLowerCase().includes(query) || 
            (game.alias && game.alias.toLowerCase().includes(query))
        );
        
        renderGames(filteredGames, query);
    }
    
    // 渲染游戏的函数
    function renderGames(gamesList, query = '') {
        // 清空容器
        gamesContainer.innerHTML = '';
        
        // 如果没有游戏，显示提示信息
        if (gamesList.length === 0) {
            gamesContainer.innerHTML = `<div class="search-results-title">未找到与"${query}"相关的游戏</div>`;
            return;
        }
        
        // 显示搜索结果数量
        gamesContainer.innerHTML = `<div class="search-results-title">找到 ${gamesList.length} 个相关游戏</div>`;
        
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
    
    // 事件监听器
    searchButton.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            performSearch();
        }
    });
    
    // 初始化页面
    fetchGames().then(() => {
        // 可以在这里添加初始化后的操作
    });
});