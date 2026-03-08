"use client";

import { useEffect, useRef, useState } from "react";

interface GrainOverlayProps {
  grainSize?: number; // Size of grain blocks (1 = finest, 2-4 = visible grain)
}

export default function GrainOverlay({ grainSize = 2 }: GrainOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use {alpha: false} for performance optimization
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = 0;
    const frameInterval = 1000 / 12; // 12 FPS (~83ms between frames)

    const setCanvasSize = () => {
      // Full resolution canvas (not scaled)
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawNoise = () => {
      const width = canvas.width;
      const height = canvas.height;
      const imageData = ctx.createImageData(width, height);
      const buffer = new Uint32Array(imageData.data.buffer);

      // Pixel clustering: grainSize x grainSize blocks share the same noise
      for (let y = 0; y < height; y += grainSize) {
        for (let x = 0; x < width; x += grainSize) {
          // Generate one noise value for the block
          const noise = (Math.random() * 255) | 0;
          const color = 0xff000000 | (noise << 16) | (noise << 8) | noise;

          // Apply to all pixels in the block
          for (let dy = 0; dy < grainSize && y + dy < height; dy++) {
            for (let dx = 0; dx < grainSize && x + dx < width; dx++) {
              const index = (y + dy) * width + (x + dx);
              buffer[index] = color;
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
    };

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      // Time-based throttling (more accurate than frame counting)
      if (currentTime - lastTime < frameInterval) return;
      lastTime = currentTime;

      drawNoise();
    };

    // Initial setup
    setCanvasSize();
    animationFrameId = requestAnimationFrame(animate);

    // Delayed fade-in effect
    const fadeTimeout = setTimeout(() => setVisible(true), 400);

    // Redraw on resize
    const handleResize = () => {
      setCanvasSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(fadeTimeout);
    };
  }, [grainSize]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-9999 h-full w-full transition-opacity duration-sm ease-gwk"
      style={{
        opacity: visible ? 0.04 : 0,
        transitionTimingFunction: "cubic-bezier(0.445, 0.05, 0.55, 0.95)",
      }}
    />
  );
}
