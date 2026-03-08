"use client";

import { useEffect, useRef } from "react";

interface GrainOverlayScaledProps {
  grainSize?: number; // Canvas scaling factor (higher = larger grain, better performance)
  frameInterval?: number; // Update every N frames (higher = slower animation)
}

export default function GrainOverlayScaled({ 
  grainSize = 8, 
  frameInterval = 3 
}: GrainOverlayScaledProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let frameCount = 0;

    const setCanvasSize = () => {
      // Scaled-down canvas for better performance
      canvas.width = Math.floor(window.innerWidth / grainSize);
      canvas.height = Math.floor(window.innerHeight / grainSize);
    };

    const drawNoise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const buffer = new Uint32Array(imageData.data.buffer);

      for (let i = 0; i < buffer.length; i++) {
        // Generate random grayscale noise
        const noise = Math.random() * 255;
        // RGBA: same value for R, G, B, full alpha
        buffer[i] = (255 << 24) | (noise << 16) | (noise << 8) | noise;
      }

      ctx.putImageData(imageData, 0, 0);
    };

    const animate = () => {
      frameCount++;
      if (frameCount % frameInterval === 0) {
        drawNoise();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    // Initial setup
    setCanvasSize();
    animate();

    // Redraw on resize
    const handleResize = () => {
      setCanvasSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [grainSize, frameInterval]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-9999 h-full w-full opacity-[0.04] transition-opacity duration-sm ease-gwk"
      style={{
        transitionTimingFunction: "cubic-bezier(0.445, 0.05, 0.55, 0.95)",
      }}
    />
  );
}
