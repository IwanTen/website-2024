import * as THREE from 'three';
import * as dat from 'dat.gui';
import { _drawCircle, _calculateKinematicPosition, _applyForce } from './utils';
import JugglingBall from './Ball';

const canvas: HTMLCanvasElement | null = document.querySelector('canvas');
const scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); //* LIGHTING
const pointLight = new THREE.PointLight(0xff0000, 1, 100);
pointLight.position.set(1, 2, 1);
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
  // {
  //   startPos: [-deltaSeperation, 0, 0],
  //   color: 0xff788a,
  // },
  // {
  //   startPos: [deltaSeperation, 0, 0],
  //   color: 0x78ffb0,
  // },
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
      new THREE.MeshToonMaterial({ color: ball.color }),
      ball.startPos
    )
  );
}
balls.forEach((ball) => {
  scene.add(ball);
});

const renderer = new THREE.WebGLRenderer({ canvas: canvas! });
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

//TODO: Add kinematic display as a method of the ball class

const PROJECTION_TIME = 1;
const LINE_RESOLUTION = 100;

// const lineGeometries = [];
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
for (let i = 0; i < balls.length; i++) {
  let pointArray = [];
  for (let j = 0; j < LINE_RESOLUTION; j++) {
    const time = j * (PROJECTION_TIME / LINE_RESOLUTION);
    let newPoint = _calculateKinematicPosition(
      balls[i].position,
      balls[i].throwForce,
      new THREE.Vector3(0, -9.81, 0),
      time
    );
    pointArray.push(newPoint);
  }
  let geometry = new THREE.BufferGeometry().setFromPoints(pointArray);
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

document.addEventListener('click', (e) => {
  let raycaster = new THREE.Raycaster();
  let mouse = new THREE.Vector2();
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  let intersects = raycaster.intersectObjects(balls);
  if (intersects.length > 0) {
    let obj = intersects[0].object;
    if (obj instanceof JugglingBall) {
      console.log('Clicked on ball:', obj.uuid, obj.throwForce);
      obj.throwBall(obj.throwForce);
    }
  }
});
