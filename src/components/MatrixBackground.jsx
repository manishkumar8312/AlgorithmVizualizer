import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

/**
 * MatrixBackground – Renders a highly professional particle background using tsParticles.
 * Configured with auto-fullscreen, high visibility, and mouse tracking on the window object
 * so it works perfectly behind interactive UI elements.
 */
const MatrixBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        // Let tsParticles handle fullscreen placement and z-index automatically
        fullScreen: {
          enable: true,
          zIndex: -1,
        },
        fpsLimit: 60,
        interactivity: {
          // Detect mouse movements and clicks on the global window
          // This allows pointer-events: none on the canvas to not block clicks, 
          // while still maintaining hover and click interactions.
          detectsOn: 'window',
          events: {
            onClick: {
              enable: true,
              mode: 'push',
            },
            onHover: {
              enable: true,
              mode: 'grab',
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 150,
              links: {
                opacity: 0.4,
                color: '#6366f1', // Glowing indigo links to mouse
              },
            },
            push: {
              quantity: 4,
            },
          },
        },
        particles: {
          color: {
            value: ['#06b6d4', '#3b82f6', '#8b5cf6'], // Cyan, Blue, Purple
          },
          links: {
            color: '#6366f1', // Premium indigo links
            distance: 120,
            enable: true,
            opacity: 0.18, // Visible but elegant connection lines
            width: 0.8,
          },
          move: {
            direction: 'none',
            enable: true,
            outModes: {
              default: 'out',
            },
            random: false,
            speed: 0.7, // Slow, elegant movement
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 70, // Density of nodes
          },
          opacity: {
            value: { min: 0.25, max: 0.5 }, // Increased opacity for proper visibility
          },
          shape: {
            type: 'circle',
          },
          size: {
            value: { min: 1.5, max: 3.0 }, // Crisp, visible node points
          },
        },
        detectRetina: true,
        style: {
          pointerEvents: 'none', // Critical: Let clicks pass through to UI underneath
        },
      }}
    />
  );
};

export default MatrixBackground;
