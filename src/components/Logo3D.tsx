import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * Crisp 3D BADPROMT logo (logo.glb) — the hero centerpiece.
 * Keeps the glb's copper-metal material and uses the live ASCII background
 * canvas as an environment map, so the chrome reflects the background.
 * The logo gently turns toward the mouse.
 */
const BASE = { x: 10, y: -83, z: 1 };
const D2R = Math.PI / 180;

export function Logo3D() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 100);
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const d1 = new THREE.DirectionalLight(0xffffff, 1.1);
    d1.position.set(2, 3, 4);
    scene.add(d1);

    // environment = the live ascii background → chrome reflects it
    let envTex: THREE.CanvasTexture | null = null;
    const bgCanvas = document.getElementById('ascii-bg-canvas') as HTMLCanvasElement | null;
    if (bgCanvas) {
      envTex = new THREE.CanvasTexture(bgCanvas);
      envTex.mapping = THREE.EquirectangularReflectionMapping;
      envTex.colorSpace = THREE.SRGBColorSpace;
      scene.environment = envTex;
    }

    const pivot = new THREE.Group();
    scene.add(pivot);
    let fitDist = 4;
    let ready = false;
    let disposed = false;

    const size = () => {
      const r = canvas.getBoundingClientRect();
      const w = Math.max(1, r.width), h = Math.max(1, r.height);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    size();
    window.addEventListener('resize', size);

    new GLTFLoader().load(`${import.meta.env.BASE_URL}logo.glb`, (gltf) => {
      if (disposed) return;
      const model = gltf.scene;
      model.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => {
          const sm = m as THREE.MeshStandardMaterial;
          sm.envMapIntensity = 1.4;
          sm.needsUpdate = true;
        });
      });
      const box = new THREE.Box3().setFromObject(model);
      model.position.sub(box.getCenter(new THREE.Vector3()));
      const unit = new THREE.Group();
      unit.add(model);
      unit.rotation.set(BASE.x * D2R, BASE.y * D2R, BASE.z * D2R);
      unit.updateMatrixWorld(true);
      const wbox = new THREE.Box3().setFromObject(unit);
      fitDist = wbox.getBoundingSphere(new THREE.Sphere()).radius /
        Math.sin(THREE.MathUtils.degToRad(camera.fov / 2));
      pivot.add(unit);
      ready = true;
    });

    const target = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      target.y = nx * 0.5;
      target.x = ny * 0.3;
    };
    window.addEventListener('mousemove', onMove);

    let raf = 0;
    const frame = () => {
      if (ready) {
        pivot.rotation.x += (target.x - pivot.rotation.x) * 0.08;
        pivot.rotation.y += (target.y - pivot.rotation.y) * 0.08;
        camera.position.set(0, 0, fitDist * 1.15);
        camera.lookAt(0, 0, 0);
      }
      if (envTex) envTex.needsUpdate = true;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', size);
      window.removeEventListener('mousemove', onMove);
      envTex?.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={ref} className="hero-logo3d" aria-hidden="true" />;
}
