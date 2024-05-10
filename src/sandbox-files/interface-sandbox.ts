import { _drawCircle } from './utils';
import InterfaceController from './interface';
import * as THREE from 'three';

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
  40,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 20;

const SPHERE_FIDELITY = 16;
const sphereGeometry = new THREE.SphereGeometry(
  0.3,
  SPHERE_FIDELITY,
  SPHERE_FIDELITY
);
const leftHandMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
const rightHandMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff });

const leftHand = new THREE.Mesh(sphereGeometry, leftHandMaterial);
let leftWordlPoint = _screenToWorldPoint(
  uiController.hands.left.x,
  uiController.hands.left.y,
  camera
);
let rightWordlPoint = _screenToWorldPoint(
  uiController.hands.right.x,
  uiController.hands.right.y,
  camera
);
let leftHandScalar = camera.position.z * 10;
leftHand.position.set(
  leftWordlPoint.x * leftHandScalar,
  leftWordlPoint.y * leftHandScalar,
  0
);
scene.add(leftHand);

const rightHand = new THREE.Mesh(sphereGeometry, rightHandMaterial);
let rightHandScalar = camera.position.z * 10;
rightHand.position.set(
  rightWordlPoint.x * rightHandScalar,
  rightWordlPoint.y * rightHandScalar,
  0
);
scene.add(rightHand);

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

const renderer = new THREE.WebGLRenderer({
  canvas: canvas as HTMLCanvasElement,
});
renderer.setSize(window.innerWidth, window.innerHeight);

const animate = () => {
  requestAnimationFrame(animate);
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
};

animate();
