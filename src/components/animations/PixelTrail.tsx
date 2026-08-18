import { useRef, useEffect } from 'react';

interface PixelTrailProps {
  pixelSize?: number;
  fadeDuration?: number;
  delay?: number;
  pixelColor?: string;
  interpolate?: number;
}

export function PixelTrail({
  pixelSize = 20,
  fadeDuration = 500,
  delay = 0,
  pixelColor = '#ffffff',
  interpolate = 1.2,
}: PixelTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let pixels: { x: number; y: number; opacity: number; life: number }[] = [];
    let mouse = { x: -100, y: -100 };
    let lastMouse = { x: -100, y: -100 };
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    const handleMouseMove = (e: MouseEvent) => {
      lastMouse.x = mouse.x;
      lastMouse.y = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      // Interpolate points between last mouse and current mouse for smoother trail
      if (lastMouse.x !== -100) {
        const dx = mouse.x - lastMouse.x;
        const dy = mouse.y - lastMouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Number of intermediate points based on interpolate parameter
        const steps = Math.max(1, Math.floor(distance / (pixelSize * interpolate)));
        
        for (let i = 0; i < steps; i++) {
          const interpX = lastMouse.x + (dx * i) / steps;
          const interpY = lastMouse.y + (dy * i) / steps;
          
          // Snap to pixel grid
          const gridX = Math.floor(interpX / pixelSize) * pixelSize;
          const gridY = Math.floor(interpY / pixelSize) * pixelSize;
          
          pixels.push({ x: gridX, y: gridY, opacity: 1, life: fadeDuration });
        }
      }
      
      const gridX = Math.floor(mouse.x / pixelSize) * pixelSize;
      const gridY = Math.floor(mouse.y / pixelSize) * pixelSize;
      pixels.push({ x: gridX, y: gridY, opacity: 1, life: fadeDuration });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    let lastTime = performance.now();
    
    const render = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw
      for (let i = pixels.length - 1; i >= 0; i--) {
        const p = pixels[i];
        p.life -= dt;
        
        if (p.life <= 0) {
          pixels.splice(i, 1);
          continue;
        }
        
        p.opacity = Math.max(0, p.life / fadeDuration);
        
        ctx.fillStyle = pixelColor;
        ctx.globalAlpha = p.opacity;
        ctx.fillRect(p.x, p.y, pixelSize, pixelSize);
      }
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    animationFrameId = requestAnimationFrame(render);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [pixelSize, fadeDuration, delay, pixelColor, interpolate]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}
