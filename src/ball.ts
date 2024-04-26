import * as THREE from "three";

enum BallState {
  Idle,
  Active,
}
export default class JugglingBall extends THREE.Mesh {
  acceleration = new THREE.Vector3(0, 0, 0);
  velocity = new THREE.Vector3(0, 0, 0);
  state: BallState = BallState.Idle;
  mass: number = 1;
  constructor(
    sphereGeometry: THREE.SphereGeometry,
    material: THREE.MeshToonMaterial,
    startPos: number[]
  ) {
    super(sphereGeometry, material);
    this.position.set(startPos[0], startPos[1], startPos[2]);
  }

  updatePhysics(deltaTime: number) {
    if (this.state === BallState.Idle) return;
    this.acceleration.add(new THREE.Vector3(0, -9.8, 0));
    this.velocity.add(this.acceleration.clone().multiplyScalar(deltaTime));
    this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
    this.acceleration.set(0, 0, 0);
    console.log(this.velocity);
  }

  //* (This is simply an apply force function)
  applyForce(force: THREE.Vector3) {
    // this.acceleration.add(force.clone().divideScalar(this.mass));
    this.velocity.set(0, 0, 0);
    this.velocity.add(force.clone().divideScalar(this.mass));
    console.log(this.acceleration);
  }

  getPosition() {
    return this.position;
  }

  setState(state: string) {
    this.state = BallState[state as keyof typeof BallState];
  }

  private checkIfOffScreen() {}
}
