import * as THREE from 'three';

export default class JugglingBall extends THREE.Mesh {
  constructor(
    sphereGeometry: THREE.SphereGeometry,
    material: THREE.MeshToonMaterial
  ) {
    super(sphereGeometry, material);

    console.log('This is a ball class that extends a three class');
  }
}
