import * as THREE from 'three';

enum BallState {
  Idle,
  Active,
}
export default class JugglingBall extends THREE.Mesh {
  acceleration = new THREE.Vector3(0, 0, 0);
  velocity = new THREE.Vector3(0, 0, 0);
  state: BallState = BallState.Idle;
  throwForce: THREE.Vector3 = new THREE.Vector3(0, 100, 0);
  mass: number = 1;
  constructor(
    sphereGeometry: THREE.SphereGeometry,
    material: THREE.MeshToonMaterial,
    startPos: number[]
  ) {
    super(sphereGeometry, material);
    this.position.set(startPos[0], startPos[1], startPos[2]);
  }

  updatePhysics(deltaTime: number, globalForce: THREE.Vector3 | null = null) {
    globalForce && this.acceleration.add(globalForce); // if provided a global force we add to accel.
    this.velocity.add(this.acceleration.clone().multiplyScalar(deltaTime));
    this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
    // console.log('Delta time:', deltaTime);
    this.acceleration.set(0, 0, 0);
  }

  //* (This is simply an apply force function)
  throwBall(force: THREE.Vector3) {
    this.velocity.set(0, 0, 0);
    this.acceleration.add(force.clone().divideScalar(this.mass));
  }

  getPosition() {
    return this.position;
  }
}
