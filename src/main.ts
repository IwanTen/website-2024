import * as THREE from 'three';
import JugglingBall from './ball';
import * as dat from 'dat.gui';

const canvas: HTMLCanvasElement | null = document.querySelector('canvas');
const scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.08); //* LIGHTING
const pointLight = new THREE.PointLight(0xff0000, 1, 100);
pointLight.position.set(1, 2, 1);
scene.add(ambientLight);
scene.add(pointLight);

const camera = new THREE.PerspectiveCamera( //* CAMERA
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 18;

//* Create our base sphere and pass to our Ball class

const SPHERE_FIDELITY = 16;
const sphereGeometry = new THREE.SphereGeometry(
  1,
  SPHERE_FIDELITY,
  SPHERE_FIDELITY
);

let deltaSeperation = 5;
const JugglingBallConfig = [
  {
    startPos: [-deltaSeperation, 0, 0],
    color: 0xff0000,
  },
  {
    startPos: [deltaSeperation, 0, 0],
    color: 0x00ff00,
  },
  // {
  //   startPos: [0, deltaSeperation, 0],
  //   color: 0x0000ff,
  // },
];

const balls: JugglingBall[] = [];

for (let ball of JugglingBallConfig) {
  balls.push(
    new JugglingBall(
      sphereGeometry,
      new THREE.MeshToonMaterial({ color: ball.color }),
      ball.startPos
    )
  );
}

console.log(balls);

balls.forEach((ball) => {
  scene.add(ball);
});

// const Ball = new JugglingBall(sphereGeometry, material);
// scene.add(Ball);

const renderer = new THREE.WebGLRenderer({ canvas: canvas! }); //* RENDERER + RESIZE
renderer.setSize(window.innerWidth, window.innerHeight);
const resizeCanvas = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};
window.addEventListener('resize', resizeCanvas);

let previousTime = 0;

let enableGravity = false;
let isPaused = false;
const gravity = new THREE.Vector3(0, -9.8, 0);
const velocity = new THREE.Vector3(0, 0, 0);
const acceleration = new THREE.Vector3(0, 0, 0);
const mass = 5;

function animate(currentTime: number) {
  const deltaTime = (currentTime - previousTime) / 1000; // Calculate time difference in seconds
  previousTime = currentTime;

  enableGravity && acceleration.add(gravity.clone());

  if (!isPaused) {
    balls.forEach((ball) => {
      ball.updatePhysics(deltaTime, enableGravity);
    });
  }

  renderer.render(scene, camera);
  acceleration.set(0, 0, 0);
  requestAnimationFrame(animate);
}

animate(0);

function _applyForce(force: THREE.Vector3) {
  velocity.set(0, 0, 0);
  acceleration.add(force.clone().divideScalar(mass));
}

const _calculateKinematicPosition = (
  initialPosition: THREE.Vector3,
  initialVelocity: THREE.Vector3,
  acceleration: THREE.Vector3,
  time: number
) => {
  return initialPosition
    .clone()
    .add(initialVelocity.clone().multiplyScalar(time))
    .add(acceleration.clone().multiplyScalar(0.5 * time * time));
};

//* GUI GUI GUI

var gui = new dat.GUI({ name: 'My GUI' });

gui
  .add(
    {
      useGravity: enableGravity,
    },
    'useGravity'
  )
  .onChange(() => {
    enableGravity = !enableGravity;
  })
  .name('Apply gravity');

// //TODO: Draw trajectory of target object.

// const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });

// const projectedPoints = [];
// const projectedTimeInSeconds = 2;
// const lineResolution = 100;

// for (let i = 0; i < lineResolution; i++) {
//   const time = i * (projectedTimeInSeconds / lineResolution);
//   const position = calculateKinematicPosition(
//     Ball.position,
//     new THREE.Vector3(10, 3, 0),
//     new THREE.Vector3(6, -9.8, 0),
//     time
//   );
//   projectedPoints.push(position);
// }

// console.log('projected points: ', projectedPoints);

// const lineGeometry = new THREE.BufferGeometry().setFromPoints(projectedPoints);
// const line = new THREE.Line(lineGeometry, lineMaterial);
// scene.add(line);
