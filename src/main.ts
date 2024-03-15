import * as THREE from 'three';
// import { Geometry } from 'three/examples/jsm/deprecated/Geometry.js';

const canvas: HTMLCanvasElement | null = document.querySelector('canvas');

const scene = new THREE.Scene();
const ambientLight = new THREE.AmbientLight(0xffffff, 0.06);
scene.add(ambientLight);

const light = new THREE.PointLight(0xff0000, 1, 100);
light.position.set(1, 2, 1);
scene.add(light);

const geometry = new THREE.SphereGeometry(1);
const material = new THREE.MeshToonMaterial({ color: 0xff0000 });
const material2 = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
const material3 = new THREE.MeshLambertMaterial({ color: 0x0000ff });
const mesh = new THREE.Mesh(geometry, material);
const mesh2 = new THREE.Mesh(geometry, material2);
const mesh3 = new THREE.Mesh(geometry, material3);

const offset = 2.3;

// scene.add(mesh);
// scene.add(mesh2);
// scene.add(mesh3);
mesh.position.set(0, offset, 0);
mesh2.position.set(offset, 0, 0);
mesh3.position.set(-offset, 0, 0);

//create a sphere buffer geometry
const SPHERE_FIDELITY = 16;
const sphereGeometry = new THREE.SphereGeometry(
  1,
  SPHERE_FIDELITY,
  SPHERE_FIDELITY
);
//warp the vertices using a noise function

const position = sphereGeometry.attributes.position;
const vertex = new THREE.Vector3();

const VERTEX_OFFSET = 0.05;
for (let i = 0, l = position.count; i < l; i++) {
  vertex.fromBufferAttribute(position, i);
  sphereGeometry.attributes.position.setXYZ(
    i,
    vertex.x + Math.random() * VERTEX_OFFSET,
    vertex.y + Math.random() * VERTEX_OFFSET,
    vertex.z + Math.random() * VERTEX_OFFSET
  );
}

const sphere = new THREE.Mesh(
  sphereGeometry,
  new THREE.MeshLambertMaterial({ color: 0xfa00ff })
);
scene.add(sphere);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const onMouseMove = (event: MouseEvent) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
};

window.addEventListener('mousemove', onMouseMove);

const onClick = (event: MouseEvent) => {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    const object = intersects[0].object;
    if (object instanceof THREE.Mesh) {
      object.material.color.set(0xa0fb00);
      console.log('clicked on object!', object);
    }
  }
};

window.addEventListener('click', onClick);

const renderer = new THREE.WebGLRenderer({ canvas: canvas! });
renderer.setSize(window.innerWidth, window.innerHeight);

const resizeCanvas = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};

window.addEventListener('resize', resizeCanvas);

renderer.render(scene, camera);

const animate = () => {
  requestAnimationFrame(animate);
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;
  mesh2.rotation.x += 0.01;
  mesh2.rotation.y += 0.01;
  mesh3.rotation.x += 0.01;
  mesh3.rotation.y += 0.01;
  renderer.render(scene, camera);
};

animate();
// document.body.appendChild(renderer.domElement);
