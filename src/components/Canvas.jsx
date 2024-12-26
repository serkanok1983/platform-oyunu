import {useEffect, useRef, useState, useMemo} from 'react';

const Canvas = () => {
    const canvasRef = useRef(null);

    // Karakter, fizik ve engel verileri
    const [player, setPlayer] = useState({
        x: 50,
        y: 300,
        width: 50,
        height: 50,
        velocityY: 0, // Yukarı-aşağı hız
        isJumping: false, // Zıplama kontrolü
    });

    const [obstacles, setObstacles] = useState([
        { x: 400, y: 330, width: 20, height: 20 }, // İlk engel
    ]);

    const platforms = useMemo(() => [
        { x: 0, y: 350, width: 800, height: 20 }, // Zemin
        { x: 200, y: 250, width: 100, height: 20 }, // 1. Platform
        { x: 400, y: 200, width: 150, height: 20 }, // 2. Platform
    ], []);

    const [score, setScore] = useState(0); // Skor

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const gravity = 0.5; // Yerçekimi kuvveti

        const draw = () => {
            // Ekranı temizle
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Arka planı çiz
            ctx.fillStyle = 'lightgray';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Platformları çiz
            ctx.fillStyle = 'green';
            platforms.forEach((platform) => {
                ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            });

            // Engelleri çiz
            ctx.fillStyle = 'red';
            obstacles.forEach((obstacle) => {
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            });

            // Karakteri çiz
            ctx.fillStyle = 'blue';
            ctx.fillRect(player.x, player.y, player.width, player.height);

            // Skoru yazdır
            ctx.fillStyle = 'black';
            ctx.font = '20px Arial';
            ctx.fillText(`Skor: ${score}`, 10, 30);
        };

        const updatePlayer = () => {
            setPlayer((prev) => {
                let newX = prev.x;
                let newY = prev.y + prev.velocityY;
                let newVelocityY = prev.velocityY + gravity; // Yerçekimi etkisi

                // Platformlarda durma
                const isOnPlatform = platforms.some((platform) =>
                    newX + prev.width > platform.x &&
                    newX < platform.x + platform.width &&
                    newY + prev.height >= platform.y &&
                    prev.y + prev.height <= platform.y + 10 // Ufak bir tolerans
                );

                if (isOnPlatform) {
                    newY = platforms.find((platform) =>
                        newX + prev.width > platform.x &&
                        newX < platform.x + platform.width &&
                        newY + prev.height >= platform.y
                    ).y - prev.height; // Karakterin platform üzerinde kalmasını sağla
                    newVelocityY = 0;
                }
                
                // Zeminde durma
                if (newY + prev.height > canvas.height) {
                    newY = canvas.height - prev.height;
                    newVelocityY = 0;
                }

                return {
                    ...prev,
                    x: Math.max(0, Math.min(newX, canvas.width - prev.width)), // Sınırlar
                    y: newY,
                    velocityY: newVelocityY,
                    isJumping: prev.isJumping && newVelocityY !== 0, // Zıplamayı bitir
                };
            });
        };

        const updateObstacles = () => {
            setObstacles((prev) =>
                prev.map((obstacle) => ({
                    ...obstacle,
                    x: obstacle.x - 5, // Engeller sola doğru hareket eder
                })).filter((obstacle) => obstacle.x + obstacle.width > 0) // Ekran dışına çıkan engelleri kaldır
            );

            // Yeni engeller oluştur
            if (Math.random() < 0.02) {
                setObstacles((prev) => [
                    ...prev,
                    { x: canvas.width, y: 330, width: 20, height: 20 },
                ]);
            }
        };

        const checkCollisions = () => {
            const isColliding = obstacles.some((obstacle) =>
                player.x < obstacle.x + obstacle.width &&
                player.x + player.width > obstacle.x &&
                player.y < obstacle.y + obstacle.height &&
                player.y + player.height > obstacle.y
            );

            if (isColliding) {
                alert(`Oyun bitti! Skor: ${score}`);
                setScore(0); // Skoru sıfırla
                setPlayer({
                    x: 50,
                    y: 300,
                    width: 50,
                    height: 50,
                    velocityY: 0,
                    isJumping: false,
                });
                setObstacles([{ x: 400, y: 330, width: 20, height: 20 },
                ]); // Engelleri sıfırla
            }
        };

        const incrementScore = () => {
            setScore((prev) => prev + 1);
        };

        const handleKeyDown = (event) => {
            const { key } = event;

            setPlayer((prev) => {
                let newX = prev.x;

                if (key === 'ArrowRight') newX += 10;
                if (key === 'ArrowLeft') newX -= 10;

                // Zıplama
                if (key === 'ArrowUp' && !prev.isJumping) {
                    return { ...prev, velocityY: -10, isJumping: true };
                }

                return { ...prev, x: newX };
            });
        };

        window.addEventListener('keydown', handleKeyDown);

        const gameLoop = setInterval(() => {
            updatePlayer();
            updateObstacles();
            checkCollisions();
            incrementScore();
            draw();
        }, 16); // Yaklaşık 60 FPS

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            clearInterval(gameLoop);
        };
    }, [player, obstacles, platforms, score]);

    return <canvas ref={canvasRef} width={800} height={600} style={{ border: '1px solid black' }} />;

};

export default Canvas;