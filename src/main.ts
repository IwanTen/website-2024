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
camera.position.z = 15;

const SPHERE_FIDELITY = 16;

const markerGeometry = new THREE.SphereGeometry(
  0.1,
  SPHERE_FIDELITY,
  SPHERE_FIDELITY
);

const leftHand = new THREE.Mesh(
  markerGeometry,
  new THREE.MeshToonMaterial({ color: 0xb642f5 })
);
const rightHand = new THREE.Mesh(
  markerGeometry,
  new THREE.MeshToonMaterial({ color: 0xb642f5 })
);

const heightMarker = new THREE.Mesh(
  markerGeometry,
  new THREE.MeshToonMaterial({ color: 0xb642f5 })
);

function setObjectWorldPositions() {
  let leftWorldPoint = _screenToWorldPoint(
    uiController.hands.left.x,
    uiController.hands.left.y,
    camera
  );
  let rightWorldPoint = _screenToWorldPoint(
    uiController.hands.right.x,
    uiController.hands.right.y,
    camera
  );

  let heightWorldPoint = _screenToWorldPoint(
    window.innerWidth / 2,
    uiController.targetHeight,
    camera
  );

  let worldPointScalar = camera.position.z * 10;

  leftHand.position.set(
    leftWorldPoint.x * worldPointScalar,
    leftWorldPoint.y * worldPointScalar,
    0
  );
  rightHand.position.set(
    rightWorldPoint.x * worldPointScalar,
    rightWorldPoint.y * worldPointScalar,
    0
  );

  heightMarker.position.set(
    heightWorldPoint.x * worldPointScalar,
    heightWorldPoint.y * worldPointScalar,
    0
  );
}
setObjectWorldPositions();
scene.add(leftHand);
scene.add(rightHand);
scene.add(heightMarker);

const sphereGeometry = new THREE.SphereGeometry(
  0.5,
  SPHERE_FIDELITY,
  SPHERE_FIDELITY
);

const JugglingBallConfig = [
  {
    startPos: [leftHand.position.x, leftHand.position.y, 0],
    color: 0xff788a,
    leftHand: true,
  },
  {
    startPos: [rightHand.position.x, rightHand.position.y, 0],
    color: 0x78ffb0,
    leftHand: false,
  },
  {
    startPos: [leftHand.position.x, leftHand.position.y, 0],
    color: 0x78f4ff,
    leftHand: true,
  },
];

const balls: JugglingBall[] = [];

for (let ball of JugglingBallConfig) {
  let newBall = new JugglingBall(
    sphereGeometry,
    new THREE.MeshLambertMaterial({ color: ball.color }),
    ball.startPos,
    ball.leftHand
  );
  balls.push(newBall);
  scene.add(newBall);
}

const renderer = new THREE.WebGLRenderer({ canvas: canvas! });
renderer.setSize(window.innerWidth, window.innerHeight);

const resizeCanvas = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  setObjectWorldPositions();
};
window.addEventListener('resize', resizeCanvas);

let previousTime = Date.now();

// const gravity = new THREE.Vector3(0, -9.8, 0);

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

const INTERVAL = 1;

document.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    let jBall = balls[0];
    jBall.setState('Active');

    // let target = balls[1];
    let target = jBall.leftHand ? leftHand : rightHand;
    //TODO add a check to see if the ball is already in motion
    let distance = target.position.clone().sub(jBall.position).length();
    console.log('distance to target: ', distance);

    let forceX = -distance / INTERVAL;
    let forceY = -(-9.81 * (INTERVAL / 2));
    // console.log(force);
    let forceVector = new THREE.Vector3(-forceX, forceY, 0);
    jBall.applyForce(forceVector);
    jBall.setState('Active');
    setTimeout(() => {
      jBall.acceleration.set(0, 0, 0);
      jBall.setVelocity(new THREE.Vector3(0, 0, 0));
      jBall.setState('Idle');
      jBall.leftHand = !jBall.leftHand;

      console.log('interval complete', jBall.position.y);
    }, INTERVAL * 1000);
  }
});

function _screenToWorldPoint(
  x: number,
  y: number,
  camera: THREE.PerspectiveCamera
) {
  let vector = new THREE.Vector3(
    (x / window.innerWidth) * 2 - 1,
    -(y / window.innerHeight) * 2 + 1,
    -1
  );
  camera.updateMatrixWorld(true);
  vector.unproject(camera);
  return vector;
}

// TODO: Add kinematic display as a method of the ball class

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
