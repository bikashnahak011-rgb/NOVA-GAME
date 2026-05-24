import { useEffect, useRef, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext.jsx';

function Background3D() {
  const canvasRef = useRef(null);
  const { isDark } = useContext(ThemeContext);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Handle resizing
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse
    const handleMouseMove = (e) => {
      // Normalize mouse to -1 to 1 range
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 3D Objects Setup
    const gridDepth = 600;
    const gridSpacing = 40;
    const gridY = 120; // vertical offset of grid floor
    let gridOffsetZ = 0;
    const gridSpeed = 1.0;

    // Floating Cubes Setup
    const shapes = [
      { x: -200, y: -70, z: 300, size: 28, rx: 0.2, ry: 0.5, rz: 0.1, speedX: 0.008, speedY: 0.012 },
      { x: 200, y: -90, z: 450, size: 40, rx: 0.8, ry: 0.2, rz: 0.4, speedX: 0.006, speedY: 0.008 },
      { x: -240, y: 70, z: 220, size: 22, rx: 0.5, ry: 0.8, rz: 0.3, speedX: 0.012, speedY: 0.015 },
      { x: 220, y: 80, z: 360, size: 32, rx: 0.1, ry: 0.3, rz: 0.7, speedX: 0.010, speedY: 0.006 }
    ];

    // Starfield Setup
    const starsCount = 60;
    const stars = [];
    for (let i = 0; i < starsCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 800,
        y: (Math.random() - 0.5) * 600,
        z: Math.random() * 600,
        size: Math.random() * 1.5 + 0.5
      });
    }

    // Cube vertices relative to center
    const cubeVertices = [
      { x: -1, y: -1, z: -1 },
      { x: 1, y: -1, z: -1 },
      { x: 1, y: 1, z: -1 },
      { x: -1, y: 1, z: -1 },
      { x: -1, y: -1, z: 1 },
      { x: 1, y: -1, z: 1 },
      { x: 1, y: 1, z: 1 },
      { x: -1, y: 1, z: 1 }
    ];

    const cubeEdges = [
      [0, 1], [1, 2], [2, 3], [3, 0], // back face
      [4, 5], [5, 6], [6, 7], [7, 4], // front face
      [0, 4], [1, 5], [2, 6], [3, 7]  // connecting edges
    ];

    // Main Draw/Update loop
    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Fill solid background matching the theme colors
      ctx.fillStyle = isDark ? '#090408' : '#f4f6fc';
      ctx.fillRect(0, 0, width, height);

      // Smooth mouse easing
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const fov = 350; // Focal length

      // Determine colors based on Theme
      const gridColor = isDark ? 'rgba(107, 88, 255, 0.12)' : 'rgba(107, 88, 255, 0.06)';
      const accentColor1 = isDark ? 'rgba(255, 71, 87, 0.20)' : 'rgba(255, 71, 87, 0.10)'; // neon red/pink
      const accentColor2 = isDark ? 'rgba(78, 219, 219, 0.20)' : 'rgba(78, 219, 219, 0.10)'; // neon cyan
      const starColor = isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(10, 14, 26, 0.12)';

      const project = (x, y, z) => {
        // Perspective projection with camera rotation/swerve based on mouse
        const camX = mouse.x * 30;
        const camY = mouse.y * 20;
        
        const px = x - camX;
        const py = y - camY;
        const pz = z;

        if (pz <= 0) return null;
        
        const scale = fov / pz;
        return {
          x: width / 2 + px * scale,
          y: height / 2 + py * scale,
          scale: scale
        };
      };

      // 1. Draw Starfield
      ctx.fillStyle = starColor;
      stars.forEach(star => {
        // Move star forward
        star.z -= 0.4;
        if (star.z <= 0) {
          star.z = 600;
          star.x = (Math.random() - 0.5) * 800;
          star.y = (Math.random() - 0.5) * 600;
        }

        const proj = project(star.x, star.y, star.z);
        if (proj) {
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, star.size * proj.scale * 0.15, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 2. Draw 3D Grid (Floor and Ceiling for futuristic gaming space tunnel)
      gridOffsetZ -= gridSpeed;
      if (gridOffsetZ <= -gridSpacing) {
        gridOffsetZ = 0;
      }

      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;

      // Vertical/Depth lines of floor
      const numLinesX = 14;
      const minX = -300;
      const maxX = 300;
      for (let i = 0; i <= numLinesX; i++) {
        const x = minX + (i / numLinesX) * (maxX - minX);
        // Project start and end of floor line
        const pStartFloor = project(x, gridY, 40);
        const pEndFloor = project(x, gridY, gridDepth);
        if (pStartFloor && pEndFloor) {
          ctx.beginPath();
          ctx.moveTo(pStartFloor.x, pStartFloor.y);
          ctx.lineTo(pEndFloor.x, pEndFloor.y);
          ctx.stroke();
        }

        // Project start and end of ceiling line
        const pStartCeil = project(x, -gridY - 30, 40);
        const pEndCeil = project(x, -gridY - 30, gridDepth);
        if (pStartCeil && pEndCeil) {
          ctx.beginPath();
          ctx.moveTo(pStartCeil.x, pStartCeil.y);
          ctx.lineTo(pEndCeil.x, pEndCeil.y);
          ctx.stroke();
        }
      }

      // Horizontal lines of floor and ceiling (moving towards camera)
      const startZ = 40;
      for (let z = startZ; z < gridDepth; z += gridSpacing) {
        const currentZ = z + gridOffsetZ;
        const pLeftFloor = project(minX, gridY, currentZ);
        const pRightFloor = project(maxX, gridY, currentZ);
        if (pLeftFloor && pRightFloor) {
          const opacityFactor = 1 - currentZ / gridDepth;
          ctx.strokeStyle = isDark 
            ? `rgba(107, 88, 255, ${opacityFactor * 0.12})`
            : `rgba(107, 88, 255, ${opacityFactor * 0.06})`;

          ctx.beginPath();
          ctx.moveTo(pLeftFloor.x, pLeftFloor.y);
          ctx.lineTo(pRightFloor.x, pRightFloor.y);
          ctx.stroke();
        }

        const pLeftCeil = project(minX, -gridY - 30, currentZ);
        const pRightCeil = project(maxX, -gridY - 30, currentZ);
        if (pLeftCeil && pRightCeil) {
          const opacityFactor = 1 - currentZ / gridDepth;
          ctx.strokeStyle = isDark 
            ? `rgba(107, 88, 255, ${opacityFactor * 0.12})`
            : `rgba(107, 88, 255, ${opacityFactor * 0.06})`;

          ctx.beginPath();
          ctx.moveTo(pLeftCeil.x, pLeftCeil.y);
          ctx.lineTo(pRightCeil.x, pRightCeil.y);
          ctx.stroke();
        }
      }

      // 3. Draw Floating 3D Cubes
      shapes.forEach((shape, index) => {
        // Rotate local vertices
        shape.rx += shape.speedX;
        shape.ry += shape.speedY;

        const cosX = Math.cos(shape.rx), sinX = Math.sin(shape.rx);
        const cosY = Math.cos(shape.ry), sinY = Math.sin(shape.ry);
        const cosZ = Math.cos(shape.rz), sinZ = Math.sin(shape.rz);

        // Project vertices of the cube
        const rotatedVertices = cubeVertices.map(v => {
          // Local vertex scaled
          let x = v.x * shape.size;
          let y = v.y * shape.size;
          let z = v.z * shape.size;

          // Pitch (X-rotation)
          let y1 = y * cosX - z * sinX;
          let z1 = y * sinX + z * cosX;

          // Yaw (Y-rotation)
          let x2 = x * cosY + z1 * sinY;
          let z2 = -x * sinY + z1 * cosY;

          // Roll (Z-rotation)
          let x3 = x2 * cosZ - y1 * sinZ;
          let y3 = x2 * sinZ + y1 * cosZ;

          // Translate in 3D Space
          return {
            x: x3 + shape.x,
            y: y3 + shape.y,
            z: z2 + shape.z
          };
        });

        // Project vertices to 2D
        const projectedVertices = rotatedVertices.map(v => project(v.x, v.y, v.z));

        // Draw edges
        ctx.strokeStyle = index % 2 === 0 ? accentColor1 : accentColor2;
        ctx.lineWidth = 1.2;
        cubeEdges.forEach(edge => {
          const p1 = projectedVertices[edge[0]];
          const p2 = projectedVertices[edge[1]];

          if (p1 && p2) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      // Radial horizon fade-out overlay to make background smooth
      const grad = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height) / 2
      );
      if (isDark) {
        grad.addColorStop(0, 'rgba(10, 4, 8, 0)');
        grad.addColorStop(0.5, 'rgba(4, 2, 10, 0.1)');
        grad.addColorStop(1, 'rgba(10, 4, 8, 0.8)');
      } else {
        grad.addColorStop(0, 'rgba(248, 249, 255, 0)');
        grad.addColorStop(0.5, 'rgba(238, 241, 249, 0.05)');
        grad.addColorStop(1, 'rgba(248, 249, 255, 0.55)');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -2,
        pointerEvents: 'none',
        display: 'block'
      }}
    />
  );
}

export default Background3D;
