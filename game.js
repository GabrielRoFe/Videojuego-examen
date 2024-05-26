document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Cargar imágenes
    const shipImage = new Image();
    shipImage.src = 'nave.png'; // Ruta a la imagen de la nave espacial
    const asteroidImage = new Image();
    asteroidImage.src = 'asteroide.png'; // Ruta a la imagen del asteroide
    const backgroundImage = new Image();
    backgroundImage.src = 'espacio3.jpg'; // Ruta a la imagen de fondo

    let ship = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: 20
    };

    let asteroids = [];
    let score = 0;
    let highScore = localStorage.getItem('highScore') || 0; // Obtener la puntuación más alta de almacenamiento local
    let gameRunning = false; // Cambiado a false inicialmente
    let startTime = Date.now();
    let globalSpeed = 1;
    let asteroidInterval = 3000;
    let maxAsteroids = 5;

    function createAsteroid() {
        if (!gameRunning) return;
        let numAsteroids = Math.floor(Math.random() * (maxAsteroids - 1)) + 2;
        for (let i = 0; i < numAsteroids; i++) {
            let size = Math.random() * 40 + 10;
            let asteroid = {
                x: canvas.width,
                y: Math.random() * canvas.height,
                size: size,
                speed: (Math.random() * 0.5 + 1) * globalSpeed
            };
            asteroids.push(asteroid);
        }
    }

    function updateAsteroids() {
        let currentTime = Date.now();
        let elapsedTime = (currentTime - startTime) / 1000;
        globalSpeed = 1 + elapsedTime * 0.1;

        for (let i = 0; i < asteroids.length; i++) {
            asteroids[i].x -= asteroids[i].speed * globalSpeed;
            if (asteroids[i].x + asteroids[i].size < 0) {
                asteroids.splice(i, 1);
                i--;
                score++;
            }
        }
    }

    function drawBackground() {
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }

    function drawAsteroids() {
        asteroids.forEach(asteroid => {
            context.drawImage(asteroidImage, asteroid.x - asteroid.size, asteroid.y - asteroid.size, asteroid.size * 2, asteroid.size * 2);
        });
    }

    function drawShip() {
        context.drawImage(shipImage, ship.x - ship.size, ship.y - ship.size, ship.size * 2, ship.size * 2);
    }

    function drawScore() {
        context.fillStyle = 'white';
        context.font = '20px Arial';
        context.fillText(`Score: ${score}`, canvas.width - 150, 30);
        context.fillText(`High Score: ${highScore}`, canvas.width - 150, 60); // Dibujar la puntuación más alta
    }

    function drawTimer() {
        let currentTime = Date.now();
        let elapsedTime = (currentTime - startTime) / 1000;
        let minutes = Math.floor(elapsedTime / 60);
        let seconds = Math.floor(elapsedTime % 60);
        context.fillStyle = 'white';
        context.font = '20px Arial';
        context.fillText(`Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`, 20, 30);
    }

    function checkCollision() {
        for (let asteroid of asteroids) {
            let dx = asteroid.x - ship.x;
            let dy = asteroid.y - ship.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < asteroid.size + ship.size) {
                gameRunning = false;
                if (score > highScore) {
                    highScore = score; // Actualizar el puntaje más alto si es necesario
                    localStorage.setItem('highScore', highScore); // Guardar el puntaje más alto en almacenamiento local
                }
                return;
            }
        }
    
        if (ship.x - ship.size < 0 || ship.x + ship.size > canvas.width ||
            ship.y - ship.size < 0 || ship.y + ship.size > canvas.height) {
            gameRunning = false;
            if (score > highScore) {
                highScore = score; // Actualizar el puntaje más alto si es necesario
                localStorage.setItem('highScore', highScore); // Guardar el puntaje más alto en almacenamiento local
            }
        }
    }

    function resetGame() {
        ship.x = canvas.width / 2;
        ship.y = canvas.height / 2;
        asteroids = [];
        score = 0;
        gameRunning = true;
        startTime = Date.now();
        globalSpeed = 1;
        asteroidInterval = 3000;
    }

    function gameLoop() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        drawBackground();

        if (!gameRunning) {
            context.fillStyle = 'gold';
            context.font = '50px Arial';
            context.fillText('Estampida Asteroide ', 50, 100);
            context.font = '40px Arial';
            context.fillText('Instrucciones:', 50, 200);
            context.font = '20px Arial';
            context.fillText('Mueve la nave con el ratón.', 50, 250);
            context.fillText('Esquiva los asteroides y no toques los bordes de la pantalla.', 50, 280);
            context.fillText('Haz clic para empezar.', 50, 310);
            context.font = '30px Arial';
            context.fillText('Gabriel Rodríguez.', 650, 700);
        } else {
            drawShip();
            drawAsteroids();
            updateAsteroids();
            checkCollision();
            drawScore();
            drawTimer();
        }

        requestAnimationFrame(gameLoop);
    }

    document.addEventListener('mousemove', (event) => {
        if (gameRunning) {
            ship.x = event.clientX;
            ship.y = event.clientY;
        }
    });

    document.addEventListener('click', () => {
        if (!gameRunning) {
            resetGame();
        }
    });

    setInterval(() => {
        createAsteroid();
        if (asteroidInterval > 500) {
            asteroidInterval -= 100;
        }
    }, asteroidInterval);

    gameLoop();
});
