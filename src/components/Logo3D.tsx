import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * Crisp 3D BADPROMPT logo (logo.glb) — the hero centerpiece.
 * Chrome material reflecting a PMREM orange (day) / amber (night) environment.
 * Theme-aware:
 *   night (dark page) → calmer dark chrome.
 *   day   (light page) → brighter, more mirror-like, tinted into the brand orange.
 * Turns toward the mouse (gentle auto-sway on narrow screens).
 */
const BASE = { x: 10, y: -83, z: 1 };
const D2R = Math.PI / 180;

/** Vertical orange gradient → equirect env map. `stops` lets day/night differ. */
function orangeEnv(stops: [string, string, string]) {
  const c = document.createElement('canvas');
  c.width = 16; c.height = 256;
  const x = c.getContext('2d')!;
  const g = x.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, stops[0]);
  g.addColorStop(0.5, stops[1]);
  g.addColorStop(1, stops[2]);
  x.fillStyle = g;
  x.fillRect(0, 0, 16, 256);
  const t = new THREE.CanvasTexture(c);
  t.mapping = THREE.EquirectangularReflectionMapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function isDay() {
  const cl = document.body.classList;
  if (cl.contains('light')) return true;
  if (cl.contains('dark')) return false;
  return !window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function Logo3D() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 100);
    // env supplies the broad colour; lights only add the specular sheen on top
    scene.add(new THREE.AmbientLight(0xffffff, 0.18));
    const d1 = new THREE.DirectionalLight(0xffffff, 1.3);
    d1.position.set(2, 3, 4);
    scene.add(d1);
    const d2 = new THREE.DirectionalLight(0xffffff, 0.4);
    d2.position.set(-3, -1, 2);
    scene.add(d2);

    // PMREM-prefilter the orange gradients so the metal actually reflects them
    // (a raw equirect texture on material.envMap barely contributes for PBR).
    const pmrem = new THREE.PMREMGenerator(renderer);
    const makeEnv = (stops: [string, string, string]) => {
      const tex = orangeEnv(stops);
      const rt = pmrem.fromEquirectangular(tex);
      tex.dispose();
      return rt.texture;
    };
    const dayEnv = makeEnv(['#FFE3B0', '#FF9A1F', '#B25400']);   // bright, saturated → orange mirror
    const nightEnv = makeEnv(['#C0700E', '#5A3300', '#140A02']); // deep amber on near-black → dark chrome

    let mat: THREE.MeshStandardMaterial | null = null;
    const applyTheme = () => {
      const day = isDay();
      scene.environment = day ? dayEnv : nightEnv;
      if (mat) {
        mat.color.set(day ? 0xfff3e6 : 0xffffff);
        mat.metalness = 1.0;
        mat.roughness = day ? 0.05 : 0.14;   // day sharper → more mirror
        mat.envMapIntensity = day ? 1.7 : 1.0;
        mat.needsUpdate = true;
      }
    };

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
      mat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.12 });
      applyTheme();
      model.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh) mesh.material = mat!;
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

    // react to theme changes (toggle button flips body class; auto follows OS)
    const themeObserver = new MutationObserver(applyTheme);
    themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', applyTheme);

    // narrow screens: no cursor → gentle automatic left-right sway + bigger framing
    const mqNarrow = window.matchMedia('(max-width: 768px)');
    const SWAY_AMP = 0.5;        // sway amplitude (rad)
    const SWAY_SPEED = 0.0009;   // sway speed (rad per ms)

    const target = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      target.y = nx * 0.5;
      target.x = ny * 0.3;
    };
    window.addEventListener('mousemove', onMove);

    let raf = 0;
    const frame = (now: number) => {
      if (ready) {
        const narrow = mqNarrow.matches;
        if (narrow) {
          target.y = Math.sin(now * SWAY_SPEED) * SWAY_AMP;   // soft back-and-forth
          target.x = 0;
        }
        pivot.rotation.x += (target.x - pivot.rotation.x) * 0.08;
        pivot.rotation.y += (target.y - pivot.rotation.y) * 0.08;
        camera.position.set(0, 0, fitDist * (narrow ? 0.42 : 0.55));   // mobile: closer → bigger
        camera.lookAt(0, 0, 0);
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', size);
      window.removeEventListener('mousemove', onMove);
      themeObserver.disconnect();
      mq.removeEventListener('change', applyTheme);
      dayEnv.dispose();
      nightEnv.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={ref} className="hero-logo3d" aria-hidden="true" />;
}
