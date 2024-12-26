import React, {useEffect, useRef} from 'react';

const Canvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Arka planı doldur
        ctx.fillStyle = 'lightgray';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Basit bir kare çiz
        ctx.fillStyle = 'blue';
        ctx.fillRect(50, 50, 50, 50);
    }, []);

    return <canvas ref={canvasRef} width={800} height={400} style={{border: '1px solid black'}}/>;
};

export default Canvas;