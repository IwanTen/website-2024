import * as THREE from 'three';
import { _drawCircle, _calculateKinematicPosition, _applyForce } from './utils';
import JugglingBall from './ball';

const canvas: HTMLCanvasElement | null = document.querySelector('canvas');
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
jBall.position.set(5, 0, 0);
scene.add(jBall);

const MAX_HEIGHT = 7;
const TARGET_X = -5;
const markerGeometry = new THREE.SphereGeometry(
  0.1,
  SPHERE_FIDELITY,
  SPHERE_FIDELITY
);
//CREATE MARKERS
const targetMarker = new THREE.Mesh(
  markerGeometry,
  new THREE.MeshToonMaterial({ color: 0x00ff00 })
);
const heightMarker = new THREE.Mesh(
  markerGeometry,
  new THREE.MeshToonMaterial({ color: 0x00ff00 })
);
heightMarker.position.set(0, MAX_HEIGHT, 0);
targetMarker.position.set(TARGET_X, 0, 0);
scene.add(targetMarker, heightMarker);

const renderer = new THREE.WebGLRenderer({ canvas: canvas! });
renderer.setSize(window.innerWidth, window.innerHeight);

const GRAVITY = new THREE.Vector3(0, -9.81, 0);
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

const TIME_TO_TARGET = 2;

document.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    jBall.setState('Active');
    let distance = targetMarker.position.clone().sub(jBall.position).length();
    console.log('distance to target: ', distance);
    let forceX = distance / TIME_TO_TARGET;
    let forceY = -(GRAVITY.y * (TIME_TO_TARGET / 2));
    // console.log(force);
    let forceVector = new THREE.Vector3(-forceX, forceY, 0);
    jBall.applyForce(forceVector);
    jBall.setState('Active');
    setTimeout(() => {
      jBall.setState('Idle');
      console.log(jBall.position.y);
    }, TIME_TO_TARGET * 1000);
  }
});

const resizeCanvas = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};
window.addEventListener('resize', resizeCanvas);

// const BOTTOM_CENTER_SCREEN = {
//   x: window.innerWidth / 2,
//   y: window.innerHeight,
// };

// console.log(BOTTOM_CENTER_SCREEN);

// const BOTTOM_CENTER_WORLD = _screenToWorldPoint(
//   BOTTOM_CENTER_SCREEN.x,
//   BOTTOM_CENTER_SCREEN.y,
//   camera
// );
// target.position.set(BOTTOM_CENTER_WORLD.x, BOTTOM_CENTER_WORLD.y, 0);
// console.log(target.position);
// //Create uitlity function to get screen space to world space
// function _screenToWorldPoint(
//   x: number,
//   y: number,
//   camera: THREE.PerspectiveCamera
// ) {
//   let vector = new THREE.Vector3(
//     (x / window.innerWidth) * 2 - 1,
//     -(y / window.innerHeight) * 2 + 1,
//     0.5
//   );
//   vector.unproject(camera);
//   return vector;
// }
