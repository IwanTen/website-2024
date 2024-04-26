import * as THREE from "three";
import { _drawCircle, _calculateKinematicPosition, _applyForce } from "./utils";
import JugglingBall from "./ball";

const canvas: HTMLCanvasElement | null = document.querySelector("canvas");
const scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 20;
camera.position.y = 2;

const SPHERE_FIDELITY = 16;
const sphereGeometry = new THREE.SphereGeometry(
  0.5,
  SPHERE_FIDELITY,
  SPHERE_FIDELITY
);
// add out testing object
const jBall = new JugglingBall(
  sphereGeometry,
  new THREE.MeshToonMaterial({ color: 0xff0000 }),
  [0, 0, 0]
);
scene.add(jBall);

// create vertical target height
const MAX_HEIGHT = 5;
const targetGeometry = new THREE.SphereGeometry(
  0.5,
  SPHERE_FIDELITY,
  SPHERE_FIDELITY
);
const target = new THREE.Mesh(
  targetGeometry,
  new THREE.MeshToonMaterial({ color: 0x00ff00 })
);
target.position.set(0, MAX_HEIGHT, 0);
scene.add(target);

const renderer = new THREE.WebGLRenderer({ canvas: canvas! });
renderer.setSize(window.innerWidth, window.innerHeight);

const GRAVITY = new THREE.Vector3(0, -9.81, 0);
const TEST_FORCE = new THREE.Vector3(0, 9.81, 0);
let previousTime = Date.now();
function animate() {
  let currentTime = Date.now();
  const deltaTime = (currentTime - previousTime) / 1000;

  previousTime = currentTime;

  jBall.updatePhysics(deltaTime);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// const BOTTOM_CENTER_SCREEN = {
//   x: window.innerWidth / 2,
//   y: window.innerHeight,
// };

// const BOTTOM_CENTER_WORLD = _screenToWorldPoint(
//   BOTTOM_CENTER_SCREEN.x,
//   BOTTOM_CENTER_SCREEN.y,
//   camera
// );
// target.position.set(BOTTOM_CENTER_WORLD.x, BOTTOM_CENTER_WORLD.y, 0);

//Create uitlity function to get screen space to world space
function _screenToWorldPoint(
  x: number,
  y: number,
  camera: THREE.PerspectiveCamera
) {
  let vector = new THREE.Vector3(
    (x / window.innerWidth) * 2 - 1,
    -(y / window.innerHeight) * 2 + 1,
    0.5
  );
  vector.unproject(camera);
  return vector;
}

document.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    jBall.setState("Active");
    jBall.applyForce(TEST_FORCE);
  }
});

const resizeCanvas = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};
window.addEventListener("resize", resizeCanvas);
