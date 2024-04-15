import * as THREE from 'three';

enum State {
  Idle,
  Active,
}
export default class JugglingBall extends THREE.Mesh {
  acceleration = new THREE.Vector3(0, 0, 0);
  velocity = new THREE.Vector3(0, 0, 0);
  state: State = State.Idle;
  mass: number = 1;
  constructor(
    sphereGeometry: THREE.SphereGeometry,
    material: THREE.MeshToonMaterial,
    startPos: number[]
  ) {
    super(sphereGeometry, material);

    this.position.set(startPos[0], startPos[1], startPos[2]);
  }

  updatePhysics(deltaTime: number, enableGravity: boolean = false) {
    // Here we manually apply gravity to the balls acceleration.
    enableGravity && this.acceleration.add(new THREE.Vector3(0, -9.8, 0));
    this.velocity.add(this.acceleration.clone().multiplyScalar(deltaTime));
    this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
    // console.log('Delta time:', deltaTime);
    this.acceleration.set(0, 0, 0);
  }

  throwBall(force: THREE.Vector3) {
    this.velocity.set(0, 0, 0);
    this.acceleration.add(force.clone().divideScalar(this.mass));
  }
}
