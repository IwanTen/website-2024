import * as THREE from 'three';
import * as dat from 'dat.gui';
import Ball from './ball';

//TODO: Extract the majority of following code into scene file.
const canvas: HTMLCanvasElement | null = document.querySelector('canvas');

const scene = new THREE.Scene();

//* LIGHTING
const ambientLight = new THREE.AmbientLight(0xffffff, 0.06);
const pointLight = new THREE.PointLight(0xff0000, 1, 100);
pointLight.position.set(1, 2, 1);
scene.add(ambientLight);
scene.add(pointLight);

//* CAMERA
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 38;

//* CREATE GEOMETRY (Sphere buffer geometry)
const material = new THREE.MeshToonMaterial({ color: 0xff0000 });
const SPHERE_FIDELITY = 16;
const sphereGeometry = new THREE.SphereGeometry(
  1,
  SPHERE_FIDELITY,
  SPHERE_FIDELITY
);

const sphereMesh = new Ball(sphereGeometry, material);
scene.add(sphereMesh);

//* MOUSE MOVE
const mouse = new THREE.Vector2();
const onMouseMove = (event: MouseEvent) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
};
window.addEventListener('mousemove', onMouseMove);

//* CLICK
const raycaster = new THREE.Raycaster();
const onClick = (event: MouseEvent) => {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    const object = intersects[0].object;
    if (object instanceof THREE.Mesh) {
      console.log('clicked on object!', object);
      //TODO: Add functionality to show target trajectory.
    }
  }
};
window.addEventListener('click', onClick);

//* RENDERER + RESIZE
const renderer = new THREE.WebGLRenderer({ canvas: canvas! });
renderer.setSize(window.innerWidth, window.innerHeight);
const resizeCanvas = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};
window.addEventListener('resize', resizeCanvas);

let previousTime = 0;

let enableGravity = true;
let isPaused = true;
const gravity = new THREE.Vector3(0, -9.8, 0);
const velocity = new THREE.Vector3(0, 0, 0);
const acceleration = new THREE.Vector3(0, 0, 0);
const mass = 5;

function animate(currentTime: number) {
  const deltaTime = (currentTime - previousTime) / 1000; // Calculate time difference in seconds
  // console.log('Delta time: ', deltaTime); //! Debugging
  previousTime = currentTime;
  // console.log('current time: ', currentTime); //! Debugging

  enableGravity && acceleration.add(gravity.clone());

  if (!isPaused) {
    velocity.add(acceleration.clone().multiplyScalar(deltaTime));
    sphereMesh.position.add(velocity.clone().multiplyScalar(deltaTime));
  }

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  acceleration.set(0, 0, 0);
}

animate(0);

var gui = new dat.GUI({ name: 'My GUI' });
gui
  .add(
    {
      resetSpherePosition: () => {
        sphereMesh.position.set(0, 0, 0);
        velocity.set(0, 0, 0);
      },
    },
    'resetSpherePosition'
  )
  .name('Reset Sphere Position');
gui
  .add({ pause: isPaused }, 'pause')
  .name('Pause animation')
  .onChange(() => {
    isPaused = !isPaused;
    if (isPaused) {
      previousTime = 0;
    }
  });

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

gui
  .add(
    {
      applyThrowForce: () => {
        _applyForce(new THREE.Vector3(0, 1000, 0));
        console.log('applying random force');
      },
    },
    'applyThrowForce'
  )
  .name('Apply random force');

function _applyForce(force: THREE.Vector3) {
  velocity.set(0, 0, 0);
  acceleration.add(force.clone().divideScalar(mass));
}

const calculateKinematicPosition = (
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

//TODO: Draw trajectory of target object.

const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });

const projectedPoints = [];
const projectedTimeInSeconds = 2;
const lineResolution = 100;

for (let i = 0; i < lineResolution; i++) {
  const time = i * (projectedTimeInSeconds / lineResolution);
  const position = calculateKinematicPosition(
    sphereMesh.position,
    new THREE.Vector3(10, 3, 0),
    new THREE.Vector3(6, -9.8, 0),
    time
  );
  projectedPoints.push(position);
}

console.log('projected points: ', projectedPoints);

const lineGeometry = new THREE.BufferGeometry().setFromPoints(projectedPoints);
const line = new THREE.Line(lineGeometry, lineMaterial);
scene.add(line);
