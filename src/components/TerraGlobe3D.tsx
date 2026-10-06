import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface TerraGlobe3DProps {
  isDark?: boolean;
}

export const TerraGlobe3D: React.FC<TerraGlobe3DProps> = ({ isDark = true }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    // Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    // Color definitions
    const primaryColor = isDark ? 0x10b981 : 0x059669; // Emerald / Mint
    const secondaryColor = isDark ? 0x34d399 : 0x10b981;
    const coreColor = isDark ? 0x064e3b : 0xd1fae5;
    const ringColor = isDark ? 0x1e3a2b : 0xa7f3d0;

    // Group for all rotating 3D objects
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Inner solid subtle sphere
    const innerGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({
      color: coreColor,
      transparent: true,
      opacity: isDark ? 0.35 : 0.45,
      wireframe: false,
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    globeGroup.add(innerSphere);

    // 2. Outer Geodesic Icosahedron Wireframe
    const icosaGeo = new THREE.IcosahedronGeometry(1.4, 2);
    const icosaMat = new THREE.MeshBasicMaterial({
      color: primaryColor,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.55 : 0.7,
    });
    const icosaMesh = new THREE.Mesh(icosaGeo, icosaMat);
    globeGroup.add(icosaMesh);

    // 3. Orbital Biosphere Rings
    const ringGeo1 = new THREE.RingGeometry(1.65, 1.68, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: ringColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: isDark ? 0.4 : 0.5,
    });
    const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
    ringMesh1.rotation.x = Math.PI / 2.4;
    globeGroup.add(ringMesh1);

    const ringGeo2 = new THREE.RingGeometry(1.85, 1.87, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: secondaryColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: isDark ? 0.3 : 0.4,
    });
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.x = -Math.PI / 3;
    globeGroup.add(ringMesh2);

    // 4. Floating Botanical Dust / Particles
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.45 + Math.random() * 0.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: primaryColor,
      size: 0.04,
      transparent: true,
      opacity: isDark ? 0.8 : 0.9,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    globeGroup.add(particles);

    // Mouse Tracking / Interactive Parallax
    let targetRotationX = 0.2;
    let targetRotationY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
      targetRotationY = x * 0.8;
      targetRotationX = 0.2 - y * 0.6;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Continuous gentle planetary spin
      globeGroup.rotation.y += 0.005;

      // Smooth lerp to mouse position
      globeGroup.rotation.x += (targetRotationX - globeGroup.rotation.x) * 0.05;
      globeGroup.rotation.y += (targetRotationY - globeGroup.rotation.y) * 0.02;

      // Pulse ring rotations
      ringMesh1.rotation.z = elapsedTime * 0.1;
      ringMesh2.rotation.z = -elapsedTime * 0.15;
      particles.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || 360;
      const newHeight = container.clientHeight || 360;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup WebGL resources on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }

      innerGeo.dispose();
      innerMat.dispose();
      icosaGeo.dispose();
      icosaMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [isDark]);

  return (
    <div
      ref={mountRef}
      className="relative w-full h-[320px] sm:h-[400px] md:h-[460px] flex items-center justify-center pointer-events-none select-none"
    >
      {/* Background ambient radial glow beneath the 3D globe */}
      <div className="absolute w-56 h-56 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
    </div>
  );
};
