import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Floating point cloud
    const count = 600;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({ size: 0.12, color: 0x666666, transparent: true, opacity: 0.4 });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // Large wireframe icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(10, 1);
    const icoMat = new THREE.MeshBasicMaterial({ color: 0x333333, wireframe: true, transparent: true, opacity: 0.12 });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    ico.position.set(18, 8, -15);
    scene.add(ico);

    // Small secondary wireframe
    const ico2 = new THREE.Mesh(
      new THREE.IcosahedronGeometry(5, 1),
      new THREE.MeshBasicMaterial({ color: 0x444444, wireframe: true, transparent: true, opacity: 0.1 })
    );
    ico2.position.set(-20, -10, -5);
    scene.add(ico2);

    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    let rafId: number;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      points.rotation.y += 0.00015;
      points.rotation.x += 0.00008;
      ico.rotation.y += 0.0008;
      ico.rotation.x += 0.0004;
      ico2.rotation.y -= 0.0006;
      camera.position.x += (mouse.x * 3 - camera.position.x) * 0.025;
      camera.position.y += (mouse.y * 3 - camera.position.y) * 0.025;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      geo.dispose(); mat.dispose(); icoGeo.dispose(); icoMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    />
  );
}
