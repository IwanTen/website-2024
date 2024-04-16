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
  {
    startPos: [0, deltaSeperation, 0],
    color: 0x0000ff,
  },
];

const balls: JugglingBall[] = [];

//* init juggling balls from config
for (let ball of JugglingBallConfig) {
  balls.push(
    new JugglingBall(
      sphereGeometry,
      new THREE.MeshToonMaterial({ color: ball.color }),
      ball.startPos
    )
  );
}

//* add juggling balls to scene
balls.forEach((ball) => {
  scene.add(ball);
});

const renderer = new THREE.WebGLRenderer({ canvas: canvas! }); //* Init Renderer
renderer.setSize(window.innerWidth, window.innerHeight);
const resizeCanvas = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};
window.addEventListener('resize', resizeCanvas);

let previousTime = Date.now();

let enableGravity = false;
let isPaused = false;
const gravity = new THREE.Vector3(0, -9.8, 0);
const mass = 5;

function animate() {
  let currentTime = Date.now();
  const deltaTime = (currentTime - previousTime) / 1000;

  previousTime = currentTime;

  if (!isPaused) {
    balls.forEach((ball) => {
      ball.updatePhysics(deltaTime, enableGravity ? gravity : null);
    });
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

//* KINEMATICS / DEBUG (Draw trajectories of our ball objects)

const PROJECTION_TIME = 1;
const LINE_RESOLUTION = 100;

// const lineGeometries = [];
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
//Create a line for each ball

function _generatePath(
  position: THREE.Vector3,
  velocity: THREE.Vector3,
  acceleration: THREE.Vector3,
  seconds: number,
  lineResolution: number
) {
  let pointArray = [];
  for (let i = 0; i < lineResolution; i++) {
    const time = i * (seconds / lineResolution);
    let newPoint = _calculateKinematicPosition(
      position,
      new THREE.Vector3(0, 0, 0),
      acceleration,
      time
    );
    pointArray.push(newPoint);
  }
  return pointArray;
}

function _calculateKinematicPosition(
  initialPosition: THREE.Vector3,
  initialVelocity: THREE.Vector3,
  acceleration: THREE.Vector3,
  time: number
) {
  return initialPosition
    .clone()
    .add(initialVelocity.clone().multiplyScalar(time))
    .add(acceleration.clone().multiplyScalar(0.5 * time * time));
}

//* Generate an array of points for each ball
for (let i = 0; i < balls.length; i++) {
  let points = _generatePath(
    balls[i].position,
    balls[i].throwForce,
    gravity,
    PROJECTION_TIME,
    LINE_RESOLUTION
  );

  let geometry = new THREE.BufferGeometry().setFromPoints(points);

  let line = new THREE.Line(geometry, lineMaterial);
  scene.add(line);
}

//* DAT GUI
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
  .name('Enable global Force (gravity)');

// function _applyForce(force: THREE.Vector3) {
//   velocity.set(0, 0, 0);
//   acceleration.add(force.clone().divideScalar(mass));
// }
