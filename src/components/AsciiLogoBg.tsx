import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * Interactive ASCII logo background.
 * Renders logo.glb (Three.js) into a low-res render target, samples luminance,
 * and draws a dot-halftone of it to a 2D canvas. The logo follows the mouse;
 * when idle it slowly rotates. Day/night palette comes from CSS vars
 * --ascii-bg / --ascii-fg so it tracks the site theme automatically.
 */
const BASE = { x: 10, y: -83, z: 1 };        // baked logo orientation (deg)
const CELL = 10;                              // glyph cell size (px)
const DOLLY = 1.0;                            // camera dolly (0..1), 1 = very close
const DRIFT = 0.12;                           // idle rotation speed (rad/s)
const IDLE_MS = 1400;
const ROT_X = 0.4, ROT_Y = 0.6;               // mouse rotation range (rad)
const D2R = Math.PI / 180;

export function AsciiLogoBg() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const renderer = new THREE.WebGLRenderer({
      canvas: document.createElement('canvas'),
      antialias: false,
    });
    renderer.setPixelRatio(1);
    renderer.setClearColor(0x000000, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 100);
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const key = new THREE.DirectionalLight(0xffffff, 1.25);
    key.position.set(1.2, 1.6, 2.2);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffffff, 0.55);
    rim.position.set(-1.5, -0.6, -1.0);
    scene.add(rim);
    const pivot = new THREE.Group();
    scene.add(pivot);

    let W = 0, H = 0, cols = 0, rows = 0;
    let rt: THREE.WebGLRenderTarget | null = null;
    let buf: Uint8Array | null = null;
    let fitDist = 4;
    let ready = false;
    let disposed = false;

    const buildRT = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
      cols = Math.max(8, Math.ceil(W / CELL));
      rows = Math.max(8, Math.ceil(H / CELL));
      rt?.dispose();
      rt = new THREE.WebGLRenderTarget(cols, rows, { depthBuffer: true });
      buf = new Uint8Array(cols * rows * 4);
      renderer.setSize(cols, rows, false);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
    };
    buildRT();
    window.addEventListener('resize', buildRT);

    new GLTFLoader().load(`${import.meta.env.BASE_URL}logo.glb`, (gltf) => {
      if (disposed) return;
      const model = gltf.scene;
      const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0, roughness: 0.7 });
      model.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh) mesh.material = mat;
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

    // theme palette from CSS custom properties
    let bgCol = '#0A0A0A', fgCol = '#FF8A00';
    const readTheme = () => {
      const cs = getComputedStyle(document.body);
      bgCol = cs.getPropertyValue('--ascii-bg').trim() || bgCol;
      fgCol = cs.getPropertyValue('--ascii-fg').trim() || fgCol;
    };
    readTheme();
    const mo = new MutationObserver(readTheme);
    mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', readTheme);

    // mouse follow / idle
    const target = { x: 0, y: 0 };
    let lastMove = -1e9;
    const onMove = (e: MouseEvent) => {
      lastMove = performance.now();
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      target.y = nx * ROT_Y;
      target.x = ny * ROT_X;
    };
    window.addEventListener('mousemove', onMove);

    let raf = 0;
    let lastT = performance.now();
    const frame = (now: number) => {
      const dt = now - lastT;
      lastT = now;

      if (ready && rt && buf) {
        if (now - lastMove > IDLE_MS) {
          pivot.rotation.y += DRIFT * (dt / 1000);
          pivot.rotation.x += (0 - pivot.rotation.x) * 0.04;
        } else {
          let yy = pivot.rotation.y;
          yy = ((yy + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
          pivot.rotation.y = yy;
          pivot.rotation.x += (target.x - pivot.rotation.x) * 0.09;
          pivot.rotation.y += (target.y - pivot.rotation.y) * 0.09;
        }
        const dist = fitDist * (1.2 - 1.08 * DOLLY);
        camera.position.set(0, 0, dist);
        camera.lookAt(0, 0, 0);
        renderer.setRenderTarget(rt);
        renderer.render(scene, camera);
        renderer.readRenderTargetPixels(rt, 0, 0, cols, rows, buf);
        renderer.setRenderTarget(null);
      }

      ctx.fillStyle = bgCol;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = fgCol;
      const half = CELL / 2, maxS = CELL * 1.06;
      if (buf) {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const sr = rows - 1 - r;
            const i = (sr * cols + c) * 4;
            const lum = (buf[i] * 0.299 + buf[i + 1] * 0.587 + buf[i + 2] * 0.114) / 255;
            const s = lum * maxS;
            if (s < 0.8) continue;
            ctx.beginPath();
            ctx.arc(c * CELL + half, r * CELL + half, s / 2, 0, 6.2832);
            ctx.fill();
          }
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', buildRT);
      window.removeEventListener('mousemove', onMove);
      mo.disconnect();
      mq.removeEventListener('change', readTheme);
      rt?.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={ref} id="ascii-bg-canvas" className="ascii-logo-bg" aria-hidden="true" />;
}
