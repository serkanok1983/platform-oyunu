import {useEffect, useRef, useState, useMemo} from 'react';

const Canvas = () => {
    const canvasRef = useRef(null);

    // Karakter ve fizik verileri
    const [player, setPlayer] = useState({
        x: 50,
        y: 300,
        width: 50,
        height: 50,
        velocityY: 0, // Yukarı-aşağı hız
        isJumping: false, // Zıplama kontrolü
    });

    const platforms = useMemo(() => [
        { x: 0, y: 350, width: 800, height: 20 }, // Zemin
        { x: 200, y: 250, width: 100, height: 20 }, // 1. Platform
        { x: 400, y: 200, width: 150, height: 20 }, // 2. Platform
    ], []);

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

            // Karakteri çiz
            ctx.fillStyle = 'blue';
            ctx.fillRect(player.x, player.y, player.width, player.height);
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
            draw();
        }, 16); // Yaklaşık 60 FPS

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            clearInterval(gameLoop);
        };
    }, [player, platforms]);

    return <canvas ref={canvasRef} width={800} height={600} style={{ border: '1px solid black' }} />;

};

export default Canvas;