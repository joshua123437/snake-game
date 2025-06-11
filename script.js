document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');

    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    let score = 0;

    // Snake initial state
    let snake = [{ x: 10, y: 10 }];
    let velocity = { x: 0, y: 0 };

    // Food initial state
    let food = { x: 15, y: 15 };

    let gameOver = false;

    // Main game loop
    function gameLoop() {
        if (gameOver) {
            ctx.fillStyle = 'white';
            ctx.font = '50px "Courier New"';
            ctx.fillText('Game Over', canvas.width / 6.5, canvas.height / 2);
            return;
        }

        update();
        draw();
        setTimeout(gameLoop, 1000 / 10); // Game speed: 10 frames per second
    }

    // Update game state
    function update() {
        // Move the snake
        const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };
        snake.unshift(head);

        // Check for collision with food
        if (head.x === food.x && head.y === food.y) {
            score++;
            scoreElement.textContent = score;
            generateFood();
        } else {
            snake.pop();
        }

        // Check for game over conditions
        checkGameOver();
    }

    // Draw everything on the canvas
    function draw() {
        // Clear canvas (draw background)
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw snake
        ctx.fillStyle = 'lime';
        snake.forEach(part => {
            ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 1, gridSize - 1);
        });

        // Draw food
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    }

    // Generate new food at a random position
    function generateFood() {
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);

        // Ensure food doesn't spawn on the snake
        snake.forEach(part => {
            if (part.x === food.x && part.y === food.y) {
                generateFood();
            }
        });
    }

    // Check for game over conditions
    function checkGameOver() {
        const head = snake[0];

        // Wall collision
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameOver = true;
        }

        // Self collision
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver = true;
                break;
            }
        }
    }

    // Keyboard controls
    document.addEventListener('keydown', e => {
        switch (e.key) {
            case 'ArrowUp':
                if (velocity.y === 0) velocity = { x: 0, y: -1 };
                break;
            case 'ArrowDown':
                if (velocity.y === 0) velocity = { x: 0, y: 1 };
                break;
            case 'ArrowLeft':
                if (velocity.x === 0) velocity = { x: -1, y: 0 };
                break;
            case 'ArrowRight':
                if (velocity.x === 0) velocity = { x: 1, y: 0 };
                break;
        }
    });

    // Start the game
    generateFood();
    gameLoop();
});
