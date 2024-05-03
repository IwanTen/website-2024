import * as THREE from 'three';
import { _drawCircle, _calculateKinematicPosition, _applyForce } from './utils';
import InterfaceController from './interface';
import JugglingBall from './ball';

const uiController = new InterfaceController();

const canvas: HTMLCanvasElement | null =
  document.querySelector('.three-canvas');

const scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); //* LIGHTING
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 0, 0);
scene.add(ambientLight);
scene.add(pointLight);

const camera = new THREE.PerspectiveCamera( //* CAMERA
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 20;

const SPHERE_FIDELITY = 16;
const sphereGeometry = new THREE.SphereGeometry(
  0.5,
  SPHERE_FIDELITY,
  SPHERE_FIDELITY
);

let deltaSeperation = 3;

const JugglingBallConfig = [
  {
    startPos: [-deltaSeperation, 0, 0],
    color: 0xff788a,
  },
  {
    startPos: [deltaSeperation, 0, 0],
    color: 0x78ffb0,
  },
  {
    startPos: [0, deltaSeperation, 0],
    color: 0x78f4ff,
  },
];

const balls: JugglingBall[] = [];

for (let ball of JugglingBallConfig) {
  balls.push(
    new JugglingBall(
      sphereGeometry,
      new THREE.MeshLambertMaterial({ color: ball.color }),
      ball.startPos
    )
  );
}
balls.forEach((ball) => {
  scene.add(ball);
});

const markerGeometry = new THREE.SphereGeometry(
  0.1,
  SPHERE_FIDELITY,
  SPHERE_FIDELITY
);
//CREATE MARKERS
const leftMarker = new THREE.Mesh(
  markerGeometry,
  new THREE.MeshToonMaterial({ color: 0xb642f5 })
);
const rightMarker = new THREE.Mesh(
  markerGeometry,
  new THREE.MeshToonMaterial({ color: 0xb642f5 })
);

let leftMarkerPos = _screenToWorldPoint(
  uiController.hands.left.x,
  uiController.hands.left.y,
  camera
);
console.log(leftMarkerPos);
leftMarker.position.set(leftMarkerPos.x * 50, leftMarkerPos.y * 50, 0);

scene.add(leftMarker, rightMarker);

const renderer = new THREE.WebGLRenderer({ canvas: canvas! });
renderer.setSize(window.innerWidth, window.innerHeight);
const resizeCanvas = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};
window.addEventListener('resize', resizeCanvas);

let previousTime = Date.now();

const gravity = new THREE.Vector3(0, -9.8, 0);

function animate() {
  let currentTime = Date.now();
  const deltaTime = (currentTime - previousTime) / 1000;

  previousTime = currentTime;

  balls.forEach((ball) => {
    ball.updatePhysics(deltaTime);
  });

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

//TODO: Add kinematic display as a method of the ball class

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

// const PROJECTION_TIME = 1;
// const LINE_RESOLUTION = 100;

// const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
// for (let i = 0; i < balls.length; i++) {
//   let pointArray = [];
//   for (let j = 0; j < LINE_RESOLUTION; j++) {
//     const time = j * (PROJECTION_TIME / LINE_RESOLUTION);
//     let newPoint = _calculateKinematicPosition(
//       balls[i].position,
//       new THREE.Vector3(0, -9.81, 0),
//       new THREE.Vector3(0, -9.81, 0),
//       time
//     );
//     pointArray.push(newPoint);
//   }
//   let geometry = new THREE.BufferGeometry().setFromPoints(pointArray);
//   let line = new THREE.Line(geometry, lineMaterial);
//   scene.add(line);
// }

//create a function that takes the x and y coordinated of a screen point and returns a world point in 3d space at a specified depth (z)
